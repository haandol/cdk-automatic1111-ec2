#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/stacks/vpc-stack';
import { BastionHostStack } from '../lib/stacks/bastion-host-stack';
import { Config } from '../config/loader';

const app = new cdk.App();

const vpcStack = new VpcStack(app, `${Config.app.ns}VpcStack`, {
  vpcId: Config.vpc.id,
  env: {
    account: Config.aws.account,
    region: Config.aws.region,
  },
});

const bastionHostStack = new BastionHostStack(
  app,
  `${Config.app.ns}BastionHostStack`,
  {
    vpc: vpcStack.vpc,
    availabilityZone: Config.vpc.availabilityZone,
    inboundCIDR: Config.security.inboundCIDR,
    env: {
      account: Config.aws.account,
      region: Config.aws.region,
    },
  }
);
bastionHostStack.addDependency(vpcStack);
