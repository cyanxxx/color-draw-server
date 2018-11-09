'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ImgData = require('../data/ImgData');

var _ImgData2 = _interopRequireDefault(_ImgData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const uuidv4 = require('uuid/v4');
class User {
  constructor(ws) {
    var random = Math.floor(Math.random() * _ImgData2.default.length);
    this.id = uuidv4();
    this.name = "游客 " + random;
    this.status = "free";
    this.roomId = undefined;
    this.ws = ws;
    this.img = _ImgData2.default[random];
  }

  loginInfo() {
    var data = {
      id: this.id,
      name: this.name,
      status: this.status,
      roomId: this.roomId,
      img: this.img
    };
    return data;
  }

  startGame() {
    this.status = "gaming";
  }

  userInfo() {
    var data = {
      id: this.id,
      name: this.name,
      img: this.img
    };
    return data;
  }

  changeState(status, roomId) {
    this.status = status;
    this.roomId = roomId;
  }

}
exports.default = User;