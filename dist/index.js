'use strict';

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Room = require('./modules/Room');

var _Room2 = _interopRequireDefault(_Room);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 9090 });
//固定三个房间
var rooms = [];
const ROOMS_LENGTH = 3;

for (var i = 0; i < ROOMS_LENGTH; i++) {
  rooms.push(new _Room2.default(i + 1));
}

wss.on('open', function open() {
  console.log('connected');
});

wss.on('connection', function (ws) {
  var ctrl = new _Controller2.default(ws, rooms);
  console.log("start connect");
});