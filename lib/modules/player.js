import User from './User'

export default class Player{
  constructor({id, name, ws, img}){
    this.id = id;
    this.name = name;
    this.ws = ws;
    this.img = img;
    this.score = 0;
  }
  playInfo(){
    return {
      id: this.id,
      name: this.name,
      img: this.img,
      score: this.score
    }
  }
}
