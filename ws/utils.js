'use strict';

var dom = require('xmldom').DOMParser;

function appendElement(doc, parent, namespace, qualifiedName, value) {
  var e = doc.createElementNS(namespace, qualifiedName);
  if (value) {
    var t = doc.createTextNode();
    t.data = value;
    e.appendChild(t);
  }
  parent.appendChild(e);
  return e;
}



module.exports = {
  appendElement
};