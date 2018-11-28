import { USER_FREE, USER_GAMING } from './modules/constant'

export default class Controller{
  constructor(ws){
    this.ws = ws;
    this.room = null;
    this.user = global.us.addUser(this);
    this.events = {
      login(data){
        global.us.login(this, data);
      },
      getRoomData(){
        var data = [];
        global.roomsMap.forEach((room) => {
          data.push(room.roomInfo())
        })
        // console.log(data)
        this.send(data,'getRoomData');
      },

      join(data) {
        var room = this.getRoom(data.roomId);
        this.room = room;
        if(room){
          this.room.addUser(data.firstTimeGetRoom, this);
        }
       
      },
      exitRoom(){
        this.room.userLeave(this.user.id)
        this.room = null
        this.user.changeState(USER_FREE)
      },
      getGameData() {
          this.room.game.getGameData();
      },
      //为了跳转函数
      startGame() {
        this.room.startGame();
        this.room.broadCast({roomId:this.room.roomId}, 'startGame');
      },
      beginGame(data) {
        if(this.user.status !== USER_GAMING)return;
        if(data.id == this.room.ownerId){
          this.room.game.start();
        }
      },
      sendImg(data) {
        this.room.game.saveImg(data);
      },
      saveImg(data) {
        this.room.game.getCurrentImg(data);
      },
      checkAnswer(data) {
        this.room.game.checkAnswer(data,this.user.id);
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
    this.ws.on('close',(msg) => {
      console.log('close')
    })
  }
  send(data, type){
    var jsonStr = JSON.stringify({data, type})
    this.ws.send(jsonStr);
  }
  request(data, type) {
    return new Promise((resolve,reject)=>{
      this.send(data,type)
      this.ws.on('message', (msg) => {
        var json = JSON.parse(msg);
        this.events[json.type].call(this, json.data);
        resolve(data)
      })
    })
  }

  getRoom(roomId){
    var currentRoom;
     global.roomsMap.forEach((room) =>{
      if(room.roomId == roomId){
        currentRoom = room;
      }
    })
    return currentRoom;
  }
}
