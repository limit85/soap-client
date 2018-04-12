const _ = require('lodash');
const {
  AWS_REGION,
  SIGNING_BUCKET,
  SIGNING_PREFIX,
  SIGNING_PRIVATE_KEY,
  SIGNING_PUBLIC_KEY,
  SIGNING_KEY_PASSPHRASE,
  ESB_INTEGRATION_ACTION,
  ESB_INTEGRATION_URL,
  DIBP_ENVIRONMENT
} = process.env;

const config = {
  ESBIntegrationAction: ESB_INTEGRATION_ACTION,
  ESBIntegrationURL: ESB_INTEGRATION_URL,
  DIBPEnvironment: DIBP_ENVIRONMENT,

  AWS: {
    region: AWS_REGION,
    S3: {
      signing_bucket: SIGNING_BUCKET,
      signing_prefix: SIGNING_PREFIX,
      signing_private_key: SIGNING_PRIVATE_KEY,
      signing_public_key: SIGNING_PUBLIC_KEY,
      signing_certificate_passphrase: SIGNING_KEY_PASSPHRASE
    }
  },
  logLevel: _.get(process.env, 'LOG_LEVEL', 'log').toLowerCase(),
};

module.exports = config;