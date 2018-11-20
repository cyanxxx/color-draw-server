const uuidv4 = require('uuid/v4');
import imgMap from '../data/ImgData'
import {FREE,GAMING,LEAVING} from './Constant'
export default class User {
  constructor() {
    var random = Math.floor(Math.random() * imgMap.length);
    this.id = uuidv4();
    this.name = "游客 " + random;
    this.status = FREE;
    this.img = imgMap[random];
    this.score = 0;
  }

  playInfo() {
    return {
      id: this.id,
      name: this.name,
      img: this.img,
      score: this.score
    }
  }
  loginInfo() {
    var data = {
      id: this.id,
      name: this.name,
      status: this.status,
      img: this.img
    }
    return data;
  }

  startGame() {
    this.status = GAMING;
  }

  userInfo() {
    var data = {
      id: this.id,
      name: this.name,
      img: this.img
    }
    return data;
  }
  changeState(status) {
    this.status = status;
  }
}
