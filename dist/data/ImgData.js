'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
const fs = require('fs');
const path = require("path");

var mine = 'image/png';
var encoding = 'base64';
var imgPath = './assets/userImgs';
var imgMap = [];
fs.readdirSync(imgPath).forEach(el => {
  var data = fs.readFileSync(path.resolve(imgPath, "./" + el)).toString(encoding);
  var url = 'data:' + mine + ';' + encoding + ',' + data;
  imgMap.push(url);
});

exports.default = imgMap;