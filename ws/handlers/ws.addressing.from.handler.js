'use strict';

const select = require('xpath.js');
const Dom = require('xmldom').DOMParser;
const utils = require('../utils');

function WsAddressingFromHandler(version) {
  this.version = version;
}

WsAddressingFromHandler.prototype.send = function(ctx, callback) {
  let self = this;
  let doc = new Dom().parseFromString(ctx.request);

  let prefix = 'ws';
  let ns = doc.documentElement.getAttribute('xmlns:ws');
  if (ns !== this.version) {
    if (ns) {
      prefix = 'wsa';
    }
    doc.documentElement.setAttribute(`xmlns:${prefix}`, this.version);
  }
  let header = select(doc, "/*[local-name(.)='Envelope']/*[local-name(.)='Header']")[0];

  utils.appendElement(doc, header, this.version, `${prefix}:From`, ctx.DIBPEnvironment);
  ctx.request = doc.toString();
  this.next.send(ctx, function(ctx) {
    self.receive(ctx, callback);
  });
};

WsAddressingFromHandler.prototype.receive = function(ctx, callback) {
  callback(ctx);
};

module.exports = WsAddressingFromHandler;