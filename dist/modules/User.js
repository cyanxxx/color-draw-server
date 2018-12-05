'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ImgData = require('../data/ImgData');

var _ImgData2 = _interopRequireDefault(_ImgData);

var _Constant = require('./Constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uuidv4 = require('uuid/v4');
class User {
  constructor(num) {
    var random = Math.floor(Math.random() * _ImgData2.default.length);
    this.id = uuidv4();
    this.name = "游客 " + num;
    this.status = _Constant.USER_FREE;
    this.img = _ImgData2.default[random];
    this.score = 0;
  }

  playInfo() {
    return {
      id: this.id,
      name: this.name,
      img: this.img,
      score: this.score
    };
  }
  loginInfo() {
    var data = {
      id: this.id,
      name: this.name,
      status: this.status,
      img: this.img
    };
    return data;
  }
  userInfo() {
    var data = {
      id: this.id,
      name: this.name,
      img: this.img
    };
    return data;
  }
  changeState(status) {
    this.status = status;
  }
}
exports.default = User;