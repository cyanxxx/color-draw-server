import User from './modules/User'
const maxMember = 8;
const minMember = 2;

const WAITING_TO_START = 0;
const GAME_START = 1;
var GAME_OVER = 2;

export default class Controller{
  constructor(ws,roomMap){
    this.ws = ws;
    this.roomMap = roomMap;
    this.room = null;
    this.user = new User(ws);
    this.events = {
      login(){
        this.send(this.user.loginInfo(), 'login');
      },

      getUserList(){
        var data = [];
        this.roomMap.forEach((room) => {
          data.push(room.roomInfo())
        })
        this.send(data,'getUserList');
      },

      join(data) {
        var room = this.getRoom(data.roomId);
        this.room = room;
        this.room.addUser(this.user);
      },

      getGameData() {
          this.room.game.getGameData();
      },
      //为了跳转函数
      startGame() {
        this.room.changeStatus('start');
        this.room.broadCast({roomId:this.room.roomId}, 'startGame');
      },
      beginGame(data) {
        if(data.id == this.room.ownerId){
          this.room.game.start();
        }
      },
      sendImg(data) {
        this.room.game.saveImg(data);
      },

      checkAnswer(data) {
        var result = this.room.game.checkAnswer(data,this.user.id);
      },

      canvas(data) {
        this.room.broadCastToOther(data,'getCanvas',this.room.game.currentRound.drawPlayer.id);
      },
      drawImage(data) {
        this.room.broadCastToOther(data, 'drawImage',this.room.game.currentRound.drawPlayer.id);
      },
      reset() {
        this.room.broadCastToOther({}, 'reset',this.room.game.currentRound.drawPlayer.id);
      }
    }

    this.ws.on('message',(msg) => {
      var json = JSON.parse(msg);
      this.events[json.type].call(this,json.data);
    })
  }

  send(data, type){
    var jsonStr = JSON.stringify({data, type})
    this.ws.send(jsonStr);
  }

  getRoom(roomId){
    var currentRoom;
     this.roomMap.forEach((room) =>{
      if(room.roomId == roomId){
        currentRoom = room;
      }
    })
    return currentRoom;
  }
}
