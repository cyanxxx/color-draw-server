const maxMember = 8;
const minMember = 2;

import Game from './Game'
<<<<<<< HEAD
import {FREE} from './constant'
=======
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2

export default class Room{
  constructor(roomId) {
    this.userList = [];
<<<<<<< HEAD
    this.status = FREE;
=======
    this.status = 'free';
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
    this.game = null;
    this.roomId = roomId;
    this.ownerId = null;
  }
<<<<<<< HEAD
  changeAllUserStatus(status){
    this.userList.forEach(function(ctrl){
      ctrl.user.changeState(status)
    })
  }
=======

>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
  addUser(user) {
    if(!this.userList.length){
      this.ownerId = user.id;
    }
<<<<<<< HEAD
    if(this.status === FREE && !this.isFull()){
=======
    if(this.status == 'free' && !this.isFull()){
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
      this.userList.push(user);
      user.changeState('wait',this.roomId);
      var roomData = this.roomInfo();
      var userData = user.loginInfo();
      var data = {roomData, userData}
      //有待调整
      this.broadCast(data, 'newUserJoin');
    }

  }

  broadCast(data, type,cb=null) {
    var jsonData = JSON.stringify({data, type});
    this.userList.forEach((user) => {
      user.ws.send(jsonData)
    })
    cb && cb();
  }

  tellOneUse(data, type, userId) {
    var jsonData = JSON.stringify({data, type});
    this.userList.every((user) => {
      if(user.id == userId){
        user.ws.send(jsonData)
        return false;
      }
      return true;
    })
  }

  broadCastToOther(data, type, exceptUserId) {
    var jsonData = JSON.stringify({data, type});
    this.userList.forEach((user) => {
      if(user.id == exceptUserId)return;
      user.ws.send(jsonData)
    })
  }

  roomInfo() {
    var userList = [];
    this.userList.forEach((user) => {
      userList.push(user.loginInfo());
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


  //不能开始要return error
  changeStatus(status) {
    this.status = status;
    if(status == 'start' && this.canStart()){
      this.game = new Game(this.userList, this);
      this.userList.forEach((user) =>{
        user.startGame();
        this.tellOneUse(user.loginInfo(), 'changeUserStatus',user.id)
      })
    }
<<<<<<< HEAD
    if(status == FREE){
      this.game = null;
      this.userList.forEach((user) =>{
        user.changeState(FREE, undefined)
=======
    if(status == 'free'){
      this.game = null;
      this.userList.forEach((user) =>{
        user.changeState('free', undefined)
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
        this.broadCast(user.loginInfo(), 'changeUserStatus')
      })
      this.userList = [];
    }

  }

  on(type,fn) {
    this.events[data.type] = fn;
  }

}
