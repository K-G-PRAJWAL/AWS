import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import * as ec2 from "@aws-cdk/aws-ec2";
import * as ecs from "@aws-cdk/aws-ecs";
import * as ecs_patterns from "@aws-cdk/aws-ecs-patterns";


export class EcsAppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC Construct
    const vpc = new ec2.Vpc(this, "ECSAppVPC", { maxAzs: 2 });

    // Cluster Construct
    const cluster = new ecs.Cluster(this, "ECSAppCluster", { vpc: vpc });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "ECSAppFargateService", {
      cluster: cluster,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      publicLoadBalancer: true
    });
  }
}
