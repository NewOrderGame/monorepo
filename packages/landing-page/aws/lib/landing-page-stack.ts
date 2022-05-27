#!/usr/bin/env node
import {
  App,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps
} from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { HostedZone } from 'aws-cdk-lib/aws-route53';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as cloudfront_origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { HttpsRedirect } from 'aws-cdk-lib/aws-route53-patterns';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

export class LandingPageStack extends Stack {
  constructor(parent: App, name: string, props: StackProps) {
    super(parent, name, props);

    const domainName = this.node.tryGetContext('domain');
    const landingPageSubDomain = this.node.tryGetContext('subdomain');

    const zone = HostedZone.fromLookup(this, 'NewOrderGameZone', {
      domainName: domainName
    });

    const landingPageDomain = landingPageSubDomain + '.' + domainName;
    const cloudfrontOAI = new cloudfront.OriginAccessIdentity(
      this,
      'cloudfront-OAI',
      {
        comment: `OAI for ${name}`
      }
    );

    new CfnOutput(this, 'LandingPageUrl', {
      value: 'https://' + landingPageDomain
    });

    // Content bucket
    const landingPageBucket = new s3.Bucket(this, 'LandingPageBucket', {
      bucketName: landingPageDomain,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,

      /**
       * The default removal policy is RETAIN, which means that cdk destroy will not attempt to delete
       * the new bucket, and it will remain in your account until manually deleted. By setting the policy to
       * DESTROY, cdk destroy will attempt to delete the bucket, but will error if the bucket is not empty.
       */
      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code

      /**
       * For sample purposes only, if you create an S3 bucket then populate it, stack destruction fails.  This
       * setting will enable full cleanup of the demo.
       */
      autoDeleteObjects: true // NOT recommended for production code
    });

    // Grant access to cloudfront
    landingPageBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [landingPageBucket.arnForObjects('*')],
        principals: [
          new iam.CanonicalUserPrincipal(
            cloudfrontOAI.cloudFrontOriginAccessIdentityS3CanonicalUserId
          )
        ]
      })
    );
    new CfnOutput(this, 'Bucket', { value: landingPageBucket.bucketName });

    // TLS certificate
    const certificate = new acm.DnsValidatedCertificate(
      this,
      'WwwNewOrderGameComCertificate',
      {
        domainName: landingPageDomain,
        hostedZone: zone,
        region: 'us-east-1' // Cloudfront only checks this region for certificates.
      }
    );
    new CfnOutput(this, 'Certificate', { value: certificate.certificateArn });

    // CloudFront distribution
    const distribution = new cloudfront.Distribution(
      this,
      'LandingPageDistribution',
      {
        certificate: certificate,
        defaultRootObject: 'index.html',
        domainNames: [landingPageDomain],
        minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 403,
            responsePagePath: '/error.html',
            ttl: Duration.minutes(30)
          }
        ],
        defaultBehavior: {
          origin: new cloudfront_origins.S3Origin(landingPageBucket, {
            originAccessIdentity: cloudfrontOAI
          }),
          compress: true,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
        }
      }
    );

    new CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId
    });

    // Route53 alias record for the CloudFront distribution
    new route53.ARecord(this, 'LandingPageAliasRecord', {
      recordName: landingPageDomain,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone
    });

    // HTTPS Redirects to WWW
    new HttpsRedirect(this, 'nonWwwToWww', {
      recordNames: [domainName],
      targetDomain: landingPageDomain,
      zone
    });

    // Deploy landingPage contents to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWithInvalidation', {
      sources: [s3deploy.Source.asset('../public')],
      destinationBucket: landingPageBucket,
      distribution,
      distributionPaths: ['/*']
    });
  }
}
