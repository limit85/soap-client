'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
var configENV = require('./config');
var AWS = require('aws-sdk');

AWS.config.update({
  sslEnabled: true
});

class Certificates {
  constructor(config) {
    this.isCertificatesDecrypted = false;
    if (config) this.config = config;
    else this.config = configENV;
    this.signing = {};
    this.readS3File = this.readS3File.bind(this);
    this.decrypt = this.readS3File.bind(this);
    this.decryptCertificates = Promise.method(() => {
      if (!this.isCertificatesDecrypted) {
        this.isCertificatesDecrypted = true;
        this.signing = {};
        //console.log('Decrypting soap signing certificates');
        var s3_key_prefix = '';
        if (this.config.AWS.S3.signing_prefix) {
          s3_key_prefix = `${this.config.AWS.S3.signing_prefix}/`;
        }
        var privateKeyParams = {
          Bucket: this.config.AWS.S3.signing_bucket,
          Key: `${s3_key_prefix}${this.config.AWS.S3.signing_private_key}`
        };
        var publicKeyParams = {
          Bucket: this.config.AWS.S3.signing_bucket,
          Key: `${s3_key_prefix}${this.config.AWS.S3.signing_public_key}`
        };
    
        return Promise.all([
          this.readS3File(privateKeyParams).then(this.decrypt),
          this.readS3File(publicKeyParams).then(this.decrypt)
        ]).spread((privateKey, publicKey) => {
          this.signing = {privateKey, publicKey};
          // console.log('Successfully decrypted soap signing certificates');
    
          return this.signing;
        });
      }
      return this.signing;
    });
    this.decryptCertificates = this.decryptCertificates.bind(this);
  }

  readS3File(params) {
    var s3 = Promise.promisifyAll(new AWS.S3({
      region: this.config.AWS.region,
      signatureVersion: "v4"
    }));
    console.debug('Read file from S3');
    return s3.getObjectAsync(params)
      .then(v => v.Body.toString('utf8'));
  }

  decrypt(encryptedData) {

    let params;
    const buf = new Buffer(encryptedData, 'base64');
    params = {
      CiphertextBlob: buf
    };
  
    const KMS = Promise.promisifyAll(new AWS.KMS(this.config));
  
    return KMS.decryptAsync(params)
      .then(v => v.Plaintext.toString())
      .catch(function(err) {
        console.debug(err);
        if (err.code === 'InvalidCiphertextException') {
          console.log('Invalid Ciphertext Exception');
          console.log(encryptedData);
          return encryptedData;
        }
        throw err;
      });
  }
}


module.exports = Certificates;
