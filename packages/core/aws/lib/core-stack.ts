import {aws_ecs_patterns, CfnOutput, Stack, StackProps} from "aws-cdk-lib";
import {Construct} from "constructs";
import {Repository} from "aws-cdk-lib/aws-ecr";
import {ContainerImage} from "aws-cdk-lib/aws-ecs";
import {HostedZone} from "aws-cdk-lib/aws-route53";
import {ApplicationProtocol} from "aws-cdk-lib/aws-elasticloadbalancingv2";
import ec2 = require("aws-cdk-lib/aws-ec2");
import ecs = require("aws-cdk-lib/aws-ecs");

const DOMAIN_NAME = "newordergame.com";
const SUBDOMAIN = "core";
const coreServiceDomain = SUBDOMAIN + "." + DOMAIN_NAME;

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "CoreServiceVpc", {maxAzs: 2});

    const cluster = new ecs.Cluster(this, "Cluster", {vpc});

    const repository = Repository.fromRepositoryName(
      this,
      "CoreServiceRepository",
      "core-service"
    );

    const image = ContainerImage.fromEcrRepository(repository, "latest");

    const zone = HostedZone.fromLookup(this, "NewOrderGameZone", {
      domainName: DOMAIN_NAME,
    });

    // Instantiate Fargate Service with just cluster and image
    const coreService =
      new aws_ecs_patterns.ApplicationLoadBalancedFargateService(
        this,
        "CoreService",
        {
          cluster,
          taskImageOptions: {
            image: image,
            containerPort: 3000,
            enableLogging: true
          },
          protocol: ApplicationProtocol.HTTPS,
          domainName: coreServiceDomain,
          domainZone: zone,
        }
      );
  }
}
