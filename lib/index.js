const WebSocket = require('ws');
<<<<<<< HEAD
import UserService from './modules/UserService'
import Controller from './Controller'
import Room from './Room'

const wss = new WebSocket.Server({ port: 9090 });
//固定三个房间
var roomsMap = {};
const ROOMS_LENGTH = 3;
for(var i = 1; i <= ROOMS_LENGTH; i++){
  roomsMap[i] = newRoom(i)
}

global.us = new UserService();
=======


import Controller from './Controller'
import Room from './modules/Room'

const wss = new WebSocket.Server({ port: 9090 });
//固定三个房间
var rooms = [];
const ROOMS_LENGTH = 3;

for(var i = 0; i < ROOMS_LENGTH; i++){
  rooms.push(new Room(i+1));
}
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2

wss.on('open', function open() {
  console.log('connected');
});
<<<<<<< HEAD
wss.on('close', function close() {
  console.log('the server is close');
});
function heartbeat() {
  this.isAlive = true;
}
wss.on('connection',function(ws) {
  var ctrl = new Controller(ws);
  ws.isAlive = true;
  ws.on('pong', heartbeat);
  console.log("start connect")
})
function noop() {
}
const interval = setInterval(function ping() {
  for(var ctrl in  global.us.userMap){
    if (ctrl.ws.isAlive === false){
      if(ctrl.user.status === 'FREE'){
        delete ctrl;
      }else{
        ctrl.isOnline = false;
      }
      return ctrl.ws.terminate();
    }
    else{
      ctrl.ws.isAlive = false;
      ctrl.ws.ping(noop);
    }
}, 30000);
=======

wss.on('connection',function(ws) {
  var ctrl = new Controller(ws,rooms);
  console.log("start connect")
})
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
