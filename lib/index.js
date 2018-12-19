const WebSocket = require('ws');
import UserService from './modules/UserService'
import Controller from './Controller'
import Room from './modules/Room'
import {USER_GAMING} from './modules/Constant'

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
wss.on('connection',function(ws) {
  var ctrl = new Controller(ws);
  ws.on('close', function () {
    global.us.offline(ctrl)
    ws.terminate()
    console.log('left')
  })
})
function deleteExpireUser() {
  var userMap = Object.keys(global.us.userMap)
  const nowTime = new Date().getTime()
  userMap.forEach(id => {
    var control = global.us.userMap[id]
    const timeNotTouch = nowTime - control.lastActionTime
    if (timeNotTouch > 1000 * 60 * 10) {
      console.log('user not touch ', control.user.name)
      if (control.room && control.user.status !== USER_GAMING) {
         control.room.deleteOfflineUser(id)
         control.ws.terminate();
         global.us.deleteUser(id);
      }
    }
  })
}
setInterval(_ => {
  deleteExpireUser()
}, 5 * 60 * 1000)