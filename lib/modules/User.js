const uuidv4 = require('uuid/v4');
import imgMap from '../data/ImgData'
<<<<<<< HEAD
import {FREE, GAMING, LEAVING} from './Constant'
export default class User{
  constructor(control) {
    var random = Math.floor(Math.random() * imgMap.length);
    this.id = uuidv4();
    this.name = "游客 " + random;
    this.status = FREE;
    this.control = control;
    this.img = imgMap[random];
    this.score = 0;
  }

  playInfo(){
    return {
      id: this.id,
      name: this.name,
      img: this.img,
      score: this.score
    }
=======
export default class User{
  constructor(ws) {
    var random = Math.floor(Math.random() * imgMap.length);
    this.id = uuidv4();
    this.name = "游客 " + random;
    this.status = "free";
    this.roomId = undefined;
    this.ws = ws;
    this.img = imgMap[random];
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
  }

  loginInfo() {
    var data = {
      id:this.id,
      name:this.name,
      status: this.status,
<<<<<<< HEAD
=======
      roomId: this.roomId,
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
      img: this.img
    }
    return data;
  }

  startGame() {
<<<<<<< HEAD
    this.status = GAMING;
=======
    this.status = "gaming";
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
  }

  userInfo() {
    var data = {
      id:this.id,
      name:this.name,
      img: this.img
    }
    return data;
  }

<<<<<<< HEAD
  changeState(status) {
    this.status = status;
=======
  changeState(status,roomId) {
    this.status = status;
    this.roomId = roomId;
>>>>>>> f8d52287d5c579abf1efa996e78dca124e1527f2
  }

}
