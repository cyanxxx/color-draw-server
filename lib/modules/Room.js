const maxMember = 8;
const minMember = 2;

import Game from './Game'
import {FREE, WAITING, LEAVING} from './constant'

export default class Room{
  constructor(index, roomId) {
    this.userList = [];
    this.status = WAITING;
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

  addUser(ctrl) {
    console.log(ctrl)
    if(!this.userList.length){
      this.ownerId = ctrl.user.id;
    }
    if(this.status === WAITING && !this.isFull()){
      this.userList.push(ctrl);
      var user = ctrl.user
      user.changeState(WAITING,this.roomId);
      var roomIndex = this.index
      var userData = user.loginInfo();
      var data = {roomIndex, userData}
      //有待调整
      this.broadCast(data, 'newUserJoin');
    }

  }

  broadCast(data, type,cb=null) {
    var jsonData = JSON.stringify({data, type});
    this.userList.forEach((ctrl) => {
      console.log(ctrl.online)
      if(ctrl.online){
        ctrl.ws.send(jsonData)
      }
    })
    cb && cb();
  }

  tellOneUse(data, type, userId) {
    var jsonData = JSON.stringify({data, type});
    this.userList.find((ctrl) => {
      if(ctrl.user.id == userId){
        ctrl.send(jsonData)
      }
    })
  }

  broadCastToOther(data, type, exceptUserId) {
    var jsonData = JSON.stringify({data, type});
    this.userList.forEach((ctrl) => {
      if(ctrl.user.id == exceptUserId)return;
      ctrl.send(jsonData)
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
    var userIndex;
    this.userList = this.userList.filter((ctrl,i)=>{
      if(ctrl.user.id===id){
        userIndex = i;
      }
      return ctrl.user.id !== id
    })
    var data = {
      roomIndex: this.roomIndex,
      userIndex
    }
    this.broadCast(data, 'sbLeaveRoom')
    this.tellOneUse({}, 'exitRoom',id)
  }
  userOffLine(id) {
    var msg = this.game.playerOffline(id)
    this.offLinePlayerList.push(msg.offlinePlayer)
    //传用户id
    this.broadCastToOther({type:LEAVING,userIndex:msg.playerIndex},'refreshOneStatus')
  }
  userReconnet(id){
    var user = this.offLinePlayerList.find((player)=>{
      return player.id == id
    })
    this.broadCastToOther(user,'refreshOneStatus',id)
  }
  //房间状态，不能开始要return error
  changeStatus(status) {
    //开始游戏时
    if(this.status == WAITING && this.canStart()){
      this.status = status;
      this.game = new Game(this.userList, this);
      this.userList.forEach((user) =>{
        user.startGame();
        this.tellOneUse(user.loginInfo(), 'changeUserStatus',user.id)
      })
    }
    //游戏结束
    if(status == WAITING){
      this.status = status;
      this.game = null;
      changeAllUserStatus(WAITING)
    }

  }

  on(type,fn) {
    this.events[data.type] = fn;
  }

}
