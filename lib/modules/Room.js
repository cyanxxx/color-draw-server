const maxMember = 8;
const minMember = 2;

import Game from './Game'
import {
  ROOM_FREE,
  ROOM_WAITING,
  USER_WAITING,
  USER_LEAVING,
  USER_GAMING,
  USER_RECONNECT,
  ROOM_GAMING
} from './constant'

export default class Room{
  constructor(index, roomId) {
    this.userList = [];
    this.status = ROOM_WAITING;
    this.game = null;
    this.roomId = roomId;
    this.ownerId = null;
    this.offLinePlayerList = [];
    this.index = index
  }
  changeAllUserStatus(status){
    this.userList.forEach((ctrl) => {
      var user = ctrl.user
      user.changeState(status)
      this.broadCast(user.loginInfo(), 'changeUserStatus')
    })
  }

  addUser(firstTimeGetRoom, ctrl) {
    var data;
    if(!this.ownerId)this.ownerId = ctrl.user.id;
    if (this.status === ROOM_WAITING && !this.isFull()) {
      this.userList.push(ctrl);
      var user = ctrl.user
      user.changeState(USER_WAITING);
      var roomIndex = this.index
      var userData = user.loginInfo();
      var persoanalData = {roomId: this.roomId, userData:{id: ctrl.user.id, status: ctrl.user.status}}
      var data = {roomId: this.roomId, userData}
    }
    if (firstTimeGetRoom) {
      this.tellOneUse({ ...persoanalData, userList: this.roomInfo().userList}, 'newUserJoin', ctrl.user.id);
      this.broadCastToOther(data, 'newUserJoin', ctrl.user.id);
    }else{
      this.broadCastToOther(data, 'newUserJoin', ctrl.user.id);
      this.tellOneUse(persoanalData, 'newUserJoin', ctrl.user.id);
    }
    
  }

  broadCast(data, type,cb=null) {
    this.userList.forEach((ctrl) => {
      if (ctrl.online && ctrl.ws.readyState === 1) {
        ctrl.send(data, type)
      }
    })
    cb && cb();
  }

  tellOneUse(data, type, userId) {
    this.userList.find((ctrl) => {
      if (ctrl.user.id == userId && ctrl.online && ctrl.ws.readyState === 1) {
        ctrl.send(data, type)
      }
    })
  }

  broadCastToOther(data, type, exceptUserId) {
    this.userList.forEach((ctrl) => {
      if(ctrl.user.id == exceptUserId)return;
      if (ctrl.online && ctrl.ws.readyState === 1) {
        ctrl.send(data, type)
      }
    })
  }

  roomInfo() {
    var userList = [];
    this.userList.forEach((ctrl) => {
      userList.push(ctrl.user.loginInfo());
    })
    var data = {
      userList:userList,
      status:this.status,
      roomId:this.roomId
    }
    return data;
  }

  isFull() {
    return this.userList.length == maxMember;
  }

  canStart() {
    return this.userList.length >= minMember;
  }

  userLeave(id){
    if(id == this.ownerId){
      this.ownerId = null;
    }
    this.tellOneUse({roomId: -1}, 'exitRoom', id)
    var userIndex;
    var userList = this.userList.filter((ctrl,i)=>{
      if(ctrl.user.id===id){
        userIndex = i;
      }
      return ctrl.user.id !== id
    })
    var data = {
      roomIndex: this.index,
      userIndex
    }
    console.log(data)
    this.broadCast(data, 'sbLeaveRoom')
    this.userList = userList  
  }
  userOffLine(id) {
    var offlinePlayer = this.game.playerOffline(id)
    this.offLinePlayerList.push(offlinePlayer)
    //传用户id
    this.broadCastToOther({type:USER_LEAVING,userIndex:offlinePlayer.index},'refreshOneStatus')
  }
  userReconnet(id){
    var user = this.offLinePlayerList.find((player)=>{
      return player.id == id
    })
    this.broadCastToOther({type: USER_RECONNECT, userIndex: user.index},'refreshOneStatus',id)
    return user;
  }
  //房间状态，不能开始要return error
  changeStatus(status) {
      this.status = status
  }
  startGame() {
    //开始游戏时
    if (this.status == ROOM_WAITING && this.canStart()) {
      this.changeStatus(ROOM_GAMING)
      this.game = new Game(this.userList, this);
      this.userList.forEach((ctrl) => {
        let user = ctrl.user
        user.changeState(USER_GAMING);
        this.tellOneUse({
          status: USER_GAMING
        }, 'changeUserStatus', user.id)
      })
    }
  }
  gameOver() {
    this.changeStatus(ROOM_WAITING)
    this.game = null;
    this.changeAllUserStatus(USER_WAITING)
  }
  on(type,fn) {
    this.events[data.type] = fn;
  }

}
