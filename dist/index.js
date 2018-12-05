'use strict';

var _UserService = require('./modules/UserService');

var _UserService2 = _interopRequireDefault(_UserService);

var _Controller = require('./Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _Room = require('./modules/Room');

var _Room2 = _interopRequireDefault(_Room);

var _Constant = require('./modules/Constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WebSocket = require('ws');


const wss = new WebSocket.Server({ port: 9090 });
//固定三个房间
global.roomsMap = [];
const ROOMS_LENGTH = 3;
for (var i = 0; i < ROOMS_LENGTH; i++) {
  global.roomsMap[i] = new _Room2.default(i, i + 1);
}

global.us = new _UserService2.default();

wss.on('open', function open() {
  console.log('connected');
});
wss.on('close', function close() {
  console.log('the server is close');
});
function heartbeat() {
  this.isAlive = true;
}
wss.on('connection', function (ws) {
  var ctrl = new _Controller2.default(ws);
  ws.isAlive = true;
  // ws.on('pong', heartbeat);
  console.log("start connect");
  ws.on('close', function () {
    var userMap = global.us.userMap;
    var id = ctrl.user.id;
    if (ctrl.room && ctrl.user.status === _Constant.USER_GAMING) {
      console.log('left ' + ctrl.user.status);
      ctrl.room.userOffLine(id);
    } else if (ctrl.room) {
      ctrl.events.exitRoom.apply(ctrl);
      userMap[id] = null;
      delete userMap[id];
    } else {
      userMap[id] = null;
      delete userMap[id];
    }
    ws.terminate();
    console.log('left');
  });
});
// function noop() {
// }
// const interval = setInterval(function ping() {
//   var userMap = global.us.userMap
//   for(var ctrl in  userMap){
//     if (userMap[ctrl].ws.isAlive === false){
//       userMap[ctrl].ws.terminate();
//       var user = userMap[ctrl].user
//       if (user.status !== USER_GAMING) {
//         user = null
//         delete userMap[ctrl];
//       }else{
//         //不在线不再发送信息，同时把游戏中的玩家删除，存到掉线名单
//         userMap[ctrl].online = false;
//         if (userMap[ctrl].room) userMap[ctrl].room.userOffLine(user.id);
//       }
//       //console.log(userMap[ctrl])
//       return;
//     }
//     else{
//       userMap[ctrl].ws.isAlive = false;
//       userMap[ctrl].ws.ping(noop);
//     }
//   }
// }, 5000);