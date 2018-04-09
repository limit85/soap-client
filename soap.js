'use strict';

const ws = require('ws.js');
const fs = require('fs');
const path = require('path');
const sec = ws.Security;
const X509BinarySecurityToken = ws.X509BinarySecurityToken;
const configENV = require('./config');
const wsAddressingFromHandler = require('./ws/handlers/ws.addressing.from.handler');

class SignXML {
  constructor(config) {
    if (config) {
      this.config = config;
    } else this.config = configENV;
    this.signXML = this.signXML.bind(this);
  }

  signXML(requestXML, certificates) {
    var privateKey = certificates.privateKey + '\n' + certificates.publicKey;
    console.debug(privateKey);
    //console.log(privateKey);
    var x509 = new X509BinarySecurityToken({
      key: privateKey //fs.readFileSync(path.join(__dirname , `../../config/cert/private.pem`)).toString()
    });
    var signature = new ws.Signature(x509);
    signature.addReference("//*[local-name(.)='Body']");
    signature.addReference("//*[local-name(.)='Timestamp']");
  
    //validateResponseSignature determines if we should validate any incoming signature.
    var sec = new ws.Security({}, [x509, signature]);
  
    var handlers = [
      new ws.Addr("http://www.w3.org/2005/08/addressing"),
      new wsAddressingFromHandler("http://www.w3.org/2005/08/addressing"),
      sec,
      new ws.Http()
    ];

    const self = this;
  
    return new Promise(function(resolve, reject) {
      var ctx = {
        request: requestXML,
        contentType: "application/soap+xml; charset=utf-8",
        action: self.config.ESBIntegrationAction,
        url: self.config.ESBIntegrationURL,
        DIBPEnvironment: self.config.DIBPEnvironment
      };
  
      ws.send(handlers, ctx, function(ctx) {
        console.debug(ctx);
        console.debug("status " + ctx.statusCode);
        console.debug("messagse " + ctx.response);
        if (ctx.statusCode === 200) {
          resolve(ctx);
        } else {
          reject();
        }
      });
    });
  }
}

module.exports = SignXML;
