const TOTAL_ROUND = 3;
import Player from './Player'
import {USER_RECONNECT, GAME_OVER, ROUND_START, ROUND_FINISH, USER_GAMING} from './Constant'
const Qs = require('../db/index');
const xss = require('xss');
const TOTAL_TIME = 60;

export default class Game{
  constructor(userList,room){
    this.playerList = [];
    this.roundMap = []; //每局积分表
    this.roundImg = []; //每局画作
    this.room = room;
    this.round = 1;
    this.status = ROUND_START;
    this.subjects = {};
    this.offlineDraw = null;
    this.currentRound = {
      key:"",
      tip:"",
      drawPlayer:null,
      currentIndex:0,
      time:TOTAL_TIME,
      isSend:false,
      timer:null
    };
    this.scoreMap = [3,2,1];
    userList.forEach((ctrl,i)=>{
      var player = new Player(ctrl.user);
      player.index = i;
      this.playerList.push(player);
    })
    this.currentRound.drawPlayer = this.playerList[this.currentRound.currentIndex];
  }

  start() {
    //拿词库数据
    this.getData().then(()=>{
      this.getGameData();
    })
  }
  getGameData() {
    this.broadCastKey();
    this.timeCountDown();
  }
  infoPlayer() {
    var data = [];
    this.playerList.forEach(player => {
      data.push(player.playInfo())
    })
    return data;
  }
  nextRound() {
    //判断游戏是否结束
    //判断下一个存不存在
    if (this.currentRound.currentIndex < this.playerList.length&& this.playerList[this.currentRound.currentIndex].offline) {
      this.currentRound.currentIndex++;
    }
    if(this.currentRound.currentIndex >= this.playerList.length){
      if(this.round < TOTAL_ROUND){
        this.currentRound.currentIndex  = 0;
        this.round ++;
      }else{
        this.GameOver();
        return;
      }
    }
    //重组数据
    this.room.broadCast({},'reset');
    this.currentRound.drawPlayer = this.playerList[this.currentRound.currentIndex];
    this.currentRound.time = TOTAL_TIME;
    this.currentRound.isSend = false;
    this.roundMap = [];
    this.start();
  }
  broadCastKey() {
    var gameData = {
      currentPlayer:this.currentRound.drawPlayer.playInfo(),
      status: ROUND_START,
      playerList: this.infoPlayer()
    },
      playerData = { ...gameData, key:this.currentRound.key},
      guestData = { ...gameData, key:this.currentRound.key.length + "个字"};

    this.room.tellOneUse(playerData,'getGameData', this.currentRound.drawPlayer.id);
    this.room.broadCastToOther(guestData,'getGameData', this.currentRound.drawPlayer.id);
  }

  timeCountDown() {
    if(this.currentRound.time > 0){
      this.currentRound.time--;
      if(!this.currentRound.isSend && this.currentRound.time <= TOTAL_TIME / 2){
         this.currentRound.isSend = true;
         var tipData = this.currentRound.tip;
         this.room.broadCastToOther(tipData, 'getTip', this.currentRound.drawPlayer.id);
      }
      if(this.currentRound.timer){
        clearTimeout(this.currentRound.timer)
      }
      this.currentRound.timer = setTimeout(_ => {
        this.timeCountDown()
      }, 1000)
      this.room.broadCast(this.currentRound.time,'timeOut')
    }else{
      this.end();
    }
  }
  getRandomSubject() {
     var rand = Math.random();
     return new Promise((reslove, reject) => {
       Qs.findOne({
         random: {
           $gte: rand
         }
       }, (err, result) => {
         reslove(result)
       })
     })
  }
  getData() {
    //待调整
   return new Promise((resolve, reject)=>{
     this.getRandomSubject().then(data => {
       if (data == null || data.key in this.subjects) {
         this.getData().then(()=>{
           resolve();
         })
        
       } else {
         this.subjects[data.key] = data.tip;
         this.currentRound.key = data.key
         this.currentRound.tip = data.tip
         resolve();
       }
     })
   })
  }
  //如果是玩家应该读取画作
  userReconnect(player,control) {
    player.offline = false;
    var gameData = {
      currentPlayer: this.currentRound.drawPlayer.playInfo(),
      status: this.status,
      playerList: this.infoPlayer()
    }
    //当前猜什么，剩多少秒，是不是画画人,其他人的积分
    if(this.currentRound.drawPlayer.id === player.id){
      var playerData = { ...gameData, key:this.currentRound.key}
      var canvasData = {dataURL: this.offlineDraw}
      this.room.tellOneUse(playerData, 'getGameData', player.id)
      this.room.tellOneUse(canvasData, 'drawImage', player.id)
      this.offlineDraw = null
    }else{
      var guestData = { ...gameData, key:this.currentRound.key.length + "个字"}
      if(this.currentRound.isSend){
        var tipData = this.currentRound.tip;
        this.room.tellOneUse(tipData, 'getTip', player.id);
      }
      this.room.tellOneUse(guestData, 'getGameData', player.id)
      this.room.broadCastToOther({offlineId: player.id}, 'getImage', player.id)
    }
    control.user.changeState(USER_GAMING)
  }
  getCurrentImg(data) {
    this.room.tellOneUse(data.dataURL, 'drawImage', data.offlineId);
  }
  saveImg(data) {
    this.roundImg.push(data.dataUrl);
  }
  allOnlinePlayer() {
    return this.playerList.filter((player)=>{
      return !player.offline
    })
  }
  playerOffline(id) {
    var offlinePlayer = this.playerList.find((player)=>{
      return player.id === id
    })
    offlinePlayer.offline = true
    //如果是画的人掉线要存下当前画布
    if (id === this.currentRound.drawPlayer.id) {
      this.room.broadCastToOther({},"sendOfflineImg", id)
    }
    return offlinePlayer;
  }
  saveOfflineDraw(data) {
    this.offlineDraw = data.dataUrl;
  }
  checkAnswer(data, id) {
    var currentUser = null;
    //找当前发信息的用户
    this.playerList.forEach((user)=>{
      if(user.id == id){
        currentUser = user;
      }
    })
    if(id != this.currentRound.drawPlayer.id && data.ans == this.currentRound.key){
      var score = 0;
      //他答对后得到的分
      switch(this.roundMap.length){
        case 0:
          score = this.scoreMap[0];
          currentUser.score += score;
          this.roundMap.push(score);
          break;
        case 1:
          score = this.scoreMap[1];
          currentUser.score += score;
          this.roundMap.push(score);
          break;
        default:
          score = this.scoreMap[2];
          currentUser.score += score;
          this.roundMap.push(score);
          break;
      }
      //给画的那个人加分
      this.currentRound.drawPlayer.score += this.scoreMap[2];
      //是不是都答对了
      this.isAllFinish();
      //给大家加分
      this.room.broadCast(this.getScore(score, currentUser.name),"getcomMes")
      this.room.broadCast(
        {
          drawerScore:this.currentRound.drawPlayer.score,
          ans:{score:currentUser.score, id:currentUser.id}
        },"getScore")
    }
    else{
      var xssData = xss(data.ans)
      this.room.broadCast(this.chat(xssData,currentUser.name),"getcomMes")
    }
  }

  chat(msg, username) {
    return `${username}: ${msg}`
  }

  getScore(score, username) {
    return `${username}: 请对了，+${score}`
  }

  isAllFinish() {
    //除去画的那个,有机会会上来所以还是不跳过
    if (this.roundMap.length == this.allOnlinePlayer().length - 1) {
        this.end();
    }
  }

  GameOver() {
    var data = {status:GAME_OVER, roundImgs:this.roundImg, playerList:this.infoPlayer()};
    new Promise( (res,rej) => {
      this.room.broadCast(data,'gameOver',res);
    }).then(()=>{
      this.room.gameOver();
    })

  }

  end() {
    clearTimeout(this.currentRound.timer)
    this.currentRound.timer = null;
    var data = {
      key:this.currentRound.key,
      status: ROUND_FINISH
    }
    this.room.broadCast(data,"roundFinish");
    this.currentRound.currentIndex ++;
    setTimeout( ()=>{
      this.nextRound()
    },1000 * 5);
  }

}
