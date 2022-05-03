const { Stack, RemovalPolicy } = require('aws-cdk-lib');
const s3 = require('aws-cdk-lib/aws-s3');

class FirstInfrastructureStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    new s3.Bucket(this, 'FirstBucket', {
      versioned: true,
      removalPolicy: RemovalPolicy.DESTROY
    });
  }
}

module.exports = { FirstInfrastructureStack };
