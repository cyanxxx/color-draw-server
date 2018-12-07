const maxMember = 8;
const minMember = 2;

import Game from './Game'
import {
  ROOM_WAITING,
  USER_WAITING,
  USER_LEAVING,
  USER_GAMING,
  USER_RECONNECT,
  ROOM_GAMING
} from './Constant'

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
      this.broadCast({status:user.status}, 'changeUserStatus')
    })
  }

  addUser(firstTimeGetRoom, ctrl) {
    var data;
    if(!this.ownerId)this.ownerId = ctrl.user.id;
    if (this.status === ROOM_WAITING && !this.isFull()) {
      this.userList.push(ctrl);
      var user = ctrl.user
      user.changeState(USER_WAITING);
      var userData = user.loginInfo();
      var persoanalData = {roomId: this.roomId, userData:{id: ctrl.user.id, status: ctrl.user.status}}
      var data = {roomId: this.roomId, userData}
    }
    if (firstTimeGetRoom) {
      this.tellOneUse({ ...persoanalData, ...this.roomInfo()}, 'newUserJoin', ctrl.user.id);
      this.broadCastToOther(data, 'newUserJoin', ctrl.user.id);
    }else{
      this.broadCastToOther(data, 'newUserJoin', ctrl.user.id);
      this.tellOneUse(persoanalData, 'newUserJoin', ctrl.user.id);
    }
    
  }

  broadCast(data, type,cb=null) {
    this.userList.forEach((ctrl) => {
      if (ctrl.ws.readyState === 1) {
        ctrl.send(data, type)
      }
    })
    cb && cb();
  }

  tellOneUse(data, type, userId) {
    this.userList.find((ctrl) => {
      if (ctrl.user.id == userId && ctrl.ws.readyState === 1) {
        ctrl.send(data, type)
      }
    })
  }
  tellOwner(data, type) {
    this.userList.find((ctrl) => {
      if (ctrl.user.id == this.ownerId && ctrl.ws.readyState === 1) {
        ctrl.send(data, type)
      }
    })
  }
  broadCastToOther(data, type, exceptUserId) {
    this.userList.forEach((ctrl) => {
      if(ctrl.user.id == exceptUserId)return;
      if (ctrl.ws.readyState === 1) {
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
      status: this.status,
      roomId: this.roomId,
      ownerId: this.ownerId
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
    this.tellOneUse({roomId: -1}, 'exitRoom', id)
    var userIndex;
    var userList = this.userList.filter((ctrl,i)=>{
      if(ctrl.user.id===id){
        userIndex = i;
      }
      return ctrl.user.id !== id
    })
    if (id == this.ownerId) {
      if (userList.length != 0) {
        this.ownerId = userList[0].user.id;
      } else {
        this.ownerId = null;
      }
    }
    var data = {
      roomIndex: this.index,
      ownerId: this.ownerId,
      userIndex
    }
    this.broadCast(data, 'sbLeaveRoom')
    this.userList = userList
  }
  userOffLine(id) {
    var offlinePlayer = this.game.playerOffline(id)
    this.offLinePlayerList.push(offlinePlayer)
    //传用户id
    this.broadCastToOther({type:USER_LEAVING,userIndex:offlinePlayer.index},'refreshOneStatus',id)
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
  startGame(id) {
    //开始游戏时
    if (this.status == ROOM_WAITING && this.canStart() && id === this.ownerId) {
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
    if(this.offLinePlayerList.length != 0){
      var userMap = global.us.userMap
      this.offLinePlayerList.forEach(function(player){
        var ctrl = userMap[player.id]
        console.log(ctrl)
        ctrl.events.exitRoom.apply(ctrl);
        userMap[player.id] = null;
        delete userMap[player.id];
      })
    }
  }

}
