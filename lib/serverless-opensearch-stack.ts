import { Aws, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Topic } from 'aws-cdk-lib/aws-sns';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { LambdaSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Domain, EngineVersion } from 'aws-cdk-lib/aws-opensearchservice';

export class ServerlessOpensearchStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const { domainEndpoint, masterUserPassword } = new Domain(this, 'opensearch', {
      version: EngineVersion.OPENSEARCH_1_2,
      accessPolicies: [
        new PolicyStatement({
          actions: ['es:ESHttpGet', 'es:ESHttpPost', 'es:ESHttpPut'],
          effect: Effect.ALLOW,
          principals: [new AccountPrincipal(props?.env?.account)],
          resources: ['*'],
        }),
      ],
      capacity: {
        masterNodes: 2,
        masterNodeInstanceType: 't3.small.search',
        dataNodes: 1,
        dataNodeInstanceType: 't3.small.search'
      },
      fineGrainedAccessControl: {
        masterUserName: 'master'
      },
      logging: {
        slowSearchLogEnabled: true,
        appLogEnabled: true,
        slowIndexLogEnabled: true,
      },
      useUnsignedBasicAuth: true
    });

    const topic = new Topic(this, 'document-saved-topic', {
      topicName: `document-saved`,
      displayName: `document-saved`
    });
    
    topic.addToResourcePolicy(new PolicyStatement({
      actions: ['SNS:GetTopicAttributes', 'SNS:SetTopicAttributes', 'SNS:AddPermission',
        'SNS:RemovePermission', 'SNS:DeleteTopic', 'SNS:Subscribe',
        'SNS:ListSubscriptionsByTopic', 'SNS:Publish', 'SNS:Receive'],
      resources: [topic.topicArn],
      principals: [new AccountPrincipal(Aws.ACCOUNT_ID)]
    }));

    const lambda = new Function(this, 'document-saved-function', {
      runtime: Runtime.NODEJS_16_X,
      code: Code.fromAsset('resources'),
      handler: 'document-saved.main',
      timeout: Duration.seconds(5),
      environment: {
        OPENSEARCH_ENDPOINT: domainEndpoint,
        OPENSEARCH_SECRET: masterUserPassword?.unsafeUnwrap() || ''
      }
    });

    topic.addSubscription(new LambdaSubscription(lambda));

  }
}
