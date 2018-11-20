const WebSocket = require('ws');
import UserService from './modules/UserService'
import Controller from './Controller'
import Room from './modules/Room'
import {FREE} from './modules/Constant'

const wss = new WebSocket.Server({ port: 9090 });
//固定三个房间
global.roomsMap = [];
const ROOMS_LENGTH = 3;
for(var i = 0; i < ROOMS_LENGTH; i++){
  global.roomsMap[i] = new Room(i, i+1)
}

global.us = new UserService();


wss.on('open', function open() {
  console.log('connected');
});
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
  ws.on('close',function(){
    var userMap = global.us.userMap
    userMap[ctrl] = null
    delete userMap[ctrl];
    ws.terminate()
    console.log('left')
  })
})
function noop() {
}
const interval = setInterval(function ping() {
  var userMap = global.us.userMap
  for(var ctrl in  userMap){
    if (userMap[ctrl].ws.isAlive === false){
      userMap[ctrl].ws.terminate();
      if(userMap[ctrl].user.status === FREE){
        userMap[ctrl] = null
        delete userMap[ctrl];
      }else{
        //不在线不再发送信息，同时把游戏中的玩家删除，存到掉线名单
        userMap[ctrl].online = false;
        userMap[ctrl].room.userOffLine();
      }
      //console.log(userMap[ctrl])
      return;
    }
    else{
      userMap[ctrl].ws.isAlive = false;
      userMap[ctrl].ws.ping(noop);
    }
  }
}, 5000);
