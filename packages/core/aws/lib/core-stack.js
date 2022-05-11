'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.CoreStack = void 0;
const aws_cdk_lib_1 = require('aws-cdk-lib');
const aws_ecr_1 = require('aws-cdk-lib/aws-ecr');
const aws_ecs_1 = require('aws-cdk-lib/aws-ecs');
const aws_route53_1 = require('aws-cdk-lib/aws-route53');
const aws_elasticloadbalancingv2_1 = require('aws-cdk-lib/aws-elasticloadbalancingv2');
const ec2 = require('aws-cdk-lib/aws-ec2');
const ecs = require('aws-cdk-lib/aws-ecs');
const DOMAIN_NAME = 'newordergame.com';
const SUBDOMAIN = 'core';
const coreServiceDomain = SUBDOMAIN + '.' + DOMAIN_NAME;
class CoreStack extends aws_cdk_lib_1.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'CoreServiceVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    const repository = aws_ecr_1.Repository.fromRepositoryName(
      this,
      'CoreServiceRepository',
      'core-service'
    );
    const image = aws_ecs_1.ContainerImage.fromEcrRepository(
      repository,
      'latest'
    );
    const zone = aws_route53_1.HostedZone.fromLookup(this, 'NewOrderGameZone', {
      domainName: DOMAIN_NAME
    });
    // Instantiate Fargate Service with just cluster and image
    new aws_cdk_lib_1.aws_ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      'CoreService',
      {
        cluster,
        taskImageOptions: {
          image: image,
          containerPort: 5000,
          enableLogging: true
        },
        protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
        domainName: coreServiceDomain,
        domainZone: zone
      }
    );
  }
}
exports.CoreStack = CoreStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29yZS1zdGFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvcmUtc3RhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNkNBQWtFO0FBRWxFLGlEQUFpRDtBQUNqRCxpREFBcUQ7QUFDckQseURBQXFEO0FBQ3JELHVGQUE2RTtBQUM3RSwyQ0FBNEM7QUFDNUMsMkNBQTRDO0FBRTVDLE1BQU0sV0FBVyxHQUFHLGtCQUFrQixDQUFDO0FBQ3ZDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQztBQUN6QixNQUFNLGlCQUFpQixHQUFHLFNBQVMsR0FBRyxHQUFHLEdBQUcsV0FBVyxDQUFDO0FBRXhELE1BQWEsU0FBVSxTQUFRLG1CQUFLO0lBQ2xDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FBa0I7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRS9ELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUUxRCxNQUFNLFVBQVUsR0FBRyxvQkFBVSxDQUFDLGtCQUFrQixDQUM5QyxJQUFJLEVBQ0osdUJBQXVCLEVBQ3ZCLGNBQWMsQ0FDZixDQUFDO1FBRUYsTUFBTSxLQUFLLEdBQUcsd0JBQWMsQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFckUsTUFBTSxJQUFJLEdBQUcsd0JBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLGtCQUFrQixFQUFFO1lBQzNELFVBQVUsRUFBRSxXQUFXO1NBQ3hCLENBQUMsQ0FBQztRQUVILDBEQUEwRDtRQUMxRCxJQUFJLDhCQUFnQixDQUFDLHFDQUFxQyxDQUN4RCxJQUFJLEVBQ0osYUFBYSxFQUNiO1lBQ0UsT0FBTztZQUNQLGdCQUFnQixFQUFFO2dCQUNoQixLQUFLLEVBQUUsS0FBSztnQkFDWixhQUFhLEVBQUUsSUFBSTtnQkFDbkIsYUFBYSxFQUFFLElBQUk7YUFDcEI7WUFDRCxRQUFRLEVBQUUsZ0RBQW1CLENBQUMsS0FBSztZQUNuQyxVQUFVLEVBQUUsaUJBQWlCO1lBQzdCLFVBQVUsRUFBRSxJQUFJO1NBQ2pCLENBQ0YsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQXJDRCw4QkFxQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhd3NfZWNzX3BhdHRlcm5zLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgUmVwb3NpdG9yeSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InO1xuaW1wb3J0IHsgQ29udGFpbmVySW1hZ2UgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtZWNzJztcbmltcG9ydCB7IEhvc3RlZFpvbmUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3Mtcm91dGU1Myc7XG5pbXBvcnQgeyBBcHBsaWNhdGlvblByb3RvY29sIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWVsYXN0aWNsb2FkYmFsYW5jaW5ndjInO1xuaW1wb3J0IGVjMiA9IHJlcXVpcmUoJ2F3cy1jZGstbGliL2F3cy1lYzInKTtcbmltcG9ydCBlY3MgPSByZXF1aXJlKCdhd3MtY2RrLWxpYi9hd3MtZWNzJyk7XG5cbmNvbnN0IERPTUFJTl9OQU1FID0gJ25ld29yZGVyZ2FtZS5jb20nO1xuY29uc3QgU1VCRE9NQUlOID0gJ2NvcmUnO1xuY29uc3QgY29yZVNlcnZpY2VEb21haW4gPSBTVUJET01BSU4gKyAnLicgKyBET01BSU5fTkFNRTtcblxuZXhwb3J0IGNsYXNzIENvcmVTdGFjayBleHRlbmRzIFN0YWNrIHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCAnQ29yZVNlcnZpY2VWcGMnLCB7IG1heEF6czogMiB9KTtcblxuICAgIGNvbnN0IGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcblxuICAgIGNvbnN0IHJlcG9zaXRvcnkgPSBSZXBvc2l0b3J5LmZyb21SZXBvc2l0b3J5TmFtZShcbiAgICAgIHRoaXMsXG4gICAgICAnQ29yZVNlcnZpY2VSZXBvc2l0b3J5JyxcbiAgICAgICdjb3JlLXNlcnZpY2UnXG4gICAgKTtcblxuICAgIGNvbnN0IGltYWdlID0gQ29udGFpbmVySW1hZ2UuZnJvbUVjclJlcG9zaXRvcnkocmVwb3NpdG9yeSwgJ2xhdGVzdCcpO1xuXG4gICAgY29uc3Qgem9uZSA9IEhvc3RlZFpvbmUuZnJvbUxvb2t1cCh0aGlzLCAnTmV3T3JkZXJHYW1lWm9uZScsIHtcbiAgICAgIGRvbWFpbk5hbWU6IERPTUFJTl9OQU1FXG4gICAgfSk7XG5cbiAgICAvLyBJbnN0YW50aWF0ZSBGYXJnYXRlIFNlcnZpY2Ugd2l0aCBqdXN0IGNsdXN0ZXIgYW5kIGltYWdlXG4gICAgbmV3IGF3c19lY3NfcGF0dGVybnMuQXBwbGljYXRpb25Mb2FkQmFsYW5jZWRGYXJnYXRlU2VydmljZShcbiAgICAgIHRoaXMsXG4gICAgICAnQ29yZVNlcnZpY2UnLFxuICAgICAge1xuICAgICAgICBjbHVzdGVyLFxuICAgICAgICB0YXNrSW1hZ2VPcHRpb25zOiB7XG4gICAgICAgICAgaW1hZ2U6IGltYWdlLFxuICAgICAgICAgIGNvbnRhaW5lclBvcnQ6IDUwMDAsXG4gICAgICAgICAgZW5hYmxlTG9nZ2luZzogdHJ1ZVxuICAgICAgICB9LFxuICAgICAgICBwcm90b2NvbDogQXBwbGljYXRpb25Qcm90b2NvbC5IVFRQUyxcbiAgICAgICAgZG9tYWluTmFtZTogY29yZVNlcnZpY2VEb21haW4sXG4gICAgICAgIGRvbWFpblpvbmU6IHpvbmVcbiAgICAgIH1cbiAgICApO1xuICB9XG59XG4iXX0=
