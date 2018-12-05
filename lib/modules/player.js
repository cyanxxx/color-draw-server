export default class Player{
  constructor({id, name, img}){
    this.id = id;
    this.name = name;
    this.img = img;
    this.score = 0;
    this.index = -1;
    this.offline = false;
  }
  playInfo(){
    return {
      id: this.id,
      name: this.name,
      img: this.img,
      score: this.score,
      offline: this.offline
    }
  }
}
