const uuidv4 = require('uuid/v4');
import imgMap from '../data/ImgData'
import {USER_FREE,USER_GAMING,USER_LEAVING} from './Constant'
export default class User {
  constructor(num) {
    var random = Math.floor(Math.random() * imgMap.length);
    this.id = uuidv4();
    this.name = "游客 " + num;
    this.status = USER_FREE;
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
