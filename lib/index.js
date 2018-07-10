const WebSocket = require('ws');


import Controller from './Controller'
import Room from './modules/Room'

const wss = new WebSocket.Server({ port: 9090 });
//固定三个房间
var rooms = [];
const ROOMS_LENGTH = 3;

for(var i = 0; i < ROOMS_LENGTH; i++){
  rooms.push(new Room(i+1));
}

wss.on('open', function open() {
  console.log('connected');
});

wss.on('connection',function(ws) {
  var ctrl = new Controller(ws,rooms);
  console.log("start connect")
})
