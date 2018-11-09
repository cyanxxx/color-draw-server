'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Player {
  constructor({ id, name, ws, img }) {
    this.id = id;
    this.name = name;
    this.ws = ws;
    this.img = img;
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
}
exports.default = Player;