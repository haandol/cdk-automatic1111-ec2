import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

interface IProps extends StackProps {
  vpc: ec2.IVpc;
  availabilityZone: string;
  inboundCIDR: string;
}

export class BastionHostStack extends Stack {
  constructor(scope: Construct, id: string, props: IProps) {
    super(scope, id, props);

    const securityGroup = new ec2.SecurityGroup(
      this,
      `BastionHostSecurityGroup`,
      {
        vpc: props.vpc,
      }
    );
    securityGroup.connections.allowInternally(
      ec2.Port.allTraffic(),
      'Internal'
    );
    securityGroup.connections.allowFrom(
      ec2.Peer.ipv4(props.inboundCIDR),
      ec2.Port.tcp(22),
      'SSH'
    );
    securityGroup.connections.allowFrom(
      ec2.Peer.ipv4(props.inboundCIDR),
      ec2.Port.tcp(7860),
      'WebUI'
    );

    const bastionHost = new ec2.BastionHostLinux(this, `BastionHost`, {
      vpc: props.vpc,
      availabilityZone: props.availabilityZone,
      subnetSelection: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(256, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            encrypted: true,
          }),
        },
      ],
      securityGroup,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.G5,
        ec2.InstanceSize.XLARGE4
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      requireImdsv2: true,
    });
    bastionHost.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['secretsmanager:GetSecretValue'],
        resources: ['*'],
      })
    );
    bastionHost.role.addToPrincipalPolicy(
      new iam.PolicyStatement({
        actions: ['sts:AssumeRole'],
        resources: ['*'],
      })
    );
  }
}
