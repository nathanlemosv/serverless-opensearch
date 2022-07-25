# IAC - Serverless to Opensearch

This is a simple CDK project that implements an AWS SQS topic to recieve documents and an AWS Lambda subscrivied to the topic that send de document to an opensearch index definied in the project.

The `cdk.json` file tells the CDK Toolkit how to execute your app.
The project needs a env-var called `AWS_ACCOUNT_ID` with the AWS account id as value.

## To run

* [Install AWS CDK](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)
* `cdk synth`       emits the synthesized CloudFormation template
* `cdk bootstrap`   set resources to create de stack in AWS
* `cdk deploy --all --require-approval never`      deploy this stack to your default AWS account/region


