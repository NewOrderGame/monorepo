import {aws_ecs_patterns, Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Repository} from "aws-cdk-lib/aws-ecr";
import {ContainerImage} from "aws-cdk-lib/aws-ecs";
import ec2 = require('aws-cdk-lib/aws-ec2');
import ecs = require('aws-cdk-lib/aws-ecs');

export class CoreStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'CoreServiceVpc', {maxAzs: 2});
    const cluster = new ecs.Cluster(this, 'Cluster', {vpc});

    const repository = Repository.fromRepositoryName(this, 'HelloRepository', 'hello-repository');

    const image = ContainerImage.fromEcrRepository(repository, "latest")

    // Instantiate Fargate Service with just cluster and image
    const coreService = new aws_ecs_patterns.ApplicationLoadBalancedFargateService(this, "CoreService", {
      cluster,
      taskImageOptions: {
        image: image,
        containerPort: 3000
      }
    });
  }
}
