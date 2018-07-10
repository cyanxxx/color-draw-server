const uuidv4 = require('uuid/v4');
import imgMap from '../data/ImgData'
export default class User{
  constructor(ws) {
    var random = Math.floor(Math.random() * imgMap.length);
    this.id = uuidv4();
    this.name = "游客 " + random;
    this.status = "free";
    this.roomId = undefined;
    this.ws = ws;
    this.img = imgMap[random];
  }

  loginInfo() {
    var data = {
      id:this.id,
      name:this.name,
      status: this.status,
      roomId: this.roomId,
      img: this.img
    }
    return data;
  }

  startGame() {
    this.status = "gaming";
  }

  userInfo() {
    var data = {
      id:this.id,
      name:this.name,
      img: this.img
    }
    return data;
  }

  changeState(status,roomId) {
    this.status = status;
    this.roomId = roomId;
  }

}
