'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Player = require('./Player');

var _Player2 = _interopRequireDefault(_Player);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Qs = require('../db/index');

const TOTAL_ROUND = 3;
const TOTAL_TIME = 60;

class Game {
  constructor(userList, room) {
    this.playerList = [];
    this.roundMap = []; //每局积分表
    this.roundImg = []; //每局画作
    this.room = room;
    this.round = 1;
    this.currentRound = {
      key: "",
      tip: "",
      drawPlayer: null,
      currentIndex: 0,
      time: TOTAL_TIME,
      isSend: false,
      timer: null
    };
    this.scoreMap = [3, 2, 1];
    userList.forEach(user => {
      var player = new _Player2.default(user);
      this.playerList.push(player);
    });
    this.currentRound.drawPlayer = this.playerList[this.currentRound.currentIndex];
  }

  start() {
    //拿词库数据
    this.getData().then(() => {
      //广播当前局数据
      this.getGameData();
    });
  }
  getGameData() {
    this.broadCastKey();
    this.timeCountDown();
  }
  infoPlayer() {
    var data = [];
    this.playerList.forEach(player => {
      data.push(player.playInfo());
    });
    return data;
  }
  nextRound() {
    //判断游戏是否结束
    if (this.currentRound.currentIndex == this.playerList.length) {
      if (this.round < TOTAL_ROUND) {
        this.currentRound.currentIndex = 0;
        this.round++;
        console.log(this.round);
      } else {
        this.GameOver();
        return;
      }
    }
    //重组数据
    this.room.broadCast({}, 'reset');
    this.currentRound.drawPlayer = this.playerList[this.currentRound.currentIndex];
    this.currentRound.time = TOTAL_TIME;
    this.isSend = false;
    this.currentRound.isSend = false;
    this.roundMap = [];
    this.start();
  }
  broadCastKey() {
    var gameData = {
      currentPlayer: this.currentRound.drawPlayer.playInfo(),
      status: 'start',
      playerList: this.infoPlayer()
    },
        playerData = _extends({}, gameData, { key: this.currentRound.key }),
        guestData = _extends({}, gameData, { key: this.currentRound.key.length + "个字" });

    this.room.tellOneUse(playerData, 'getGameData', this.currentRound.drawPlayer.id);
    this.room.broadCastToOther(guestData, 'getGameData', this.currentRound.drawPlayer.id);
  }

  timeCountDown() {
    if (this.currentRound.time > 0) {
      this.currentRound.time--;
      if (!this.currentRound.isSend && this.currentRound.time <= TOTAL_TIME / 2) {
        this.currentRound.isSend = true;
        var tipData = this.currentRound.tip;
        this.room.broadCastToOther(tipData, 'getTip', this.currentRound.drawPlayer.id);
      }
      if (this.currentRound.timer) {
        clearTimeout(this.currentRound.timer);
      }
      this.currentRound.timer = setTimeout(_ => {
        this.timeCountDown();
      }, 1000);
      this.room.broadCast(this.currentRound.time, 'timeOut');
    } else {
      this.end();
    }
  }

  getData() {
    var rand = Math.random();
    console.log(rand);
    return new Promise((reslove, reject) => {
      Qs.findOne({ random: { $gte: rand } }, function (err, result) {
        console.log(result);
        if (result == null) {
          Qs.findOne({ random: { $lte: rand } }, function (err, result) {
            reslove(result);
          });
        } else {
          console.log(result);
          reslove(result);
        }
      });
    }).then(data => {
      console.log(data);
      this.currentRound.key = data.key;
      this.currentRound.tip = data.tip;
    });
    // if (result == null) {
    //   result = Qs.findOne({random: { $lte: rand } })
    // }
    console.log(this.currentRound.key, this.currentRound.tip);
    // if(result){
    //   console.log(result)
    //   this.currentRound.key = result.key
    //   this.currentRound.tip = result.tip
    // }

  }

  saveImg(data) {
    this.roundImg.push(data.dataUrl);
  }

  checkAnswer(data, id) {
    var currentUser = null;
    //找当前发信息的用户
    this.playerList.forEach(user => {
      if (user.id == id) {
        currentUser = user;
      }
    });
    if (id != this.currentRound.drawPlayer.id && data.ans == this.currentRound.key) {
      var score = 0;
      //他答对后得到的分
      switch (this.roundMap.length) {
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
      this.room.broadCast(this.getScore(score, currentUser.name), "getcomMes");
      this.room.broadCast({
        drawerScore: this.currentRound.drawPlayer.score,
        ans: { score: currentUser.score, id: currentUser.id }
      }, "getScore");
    } else {
      this.room.broadCast(this.chat(data.ans, currentUser.name), "getcomMes");
    }
  }

  chat(msg, username) {
    return `${username}: ${msg}`;
  }

  getScore(score, username) {
    return `${username}: 请对了，+${score}`;
  }

  isAllFinish() {
    //除去画的那个
    if (this.roundMap.length == this.playerList.length - 1) {
      this.end();
    }
  }

  GameOver() {
    var data = { status: 'over', roundImgs: this.roundImg, playerList: this.infoPlayer() };
    new Promise((res, rej) => {
      this.room.broadCast(data, 'gameOver', res);
    }).then(() => {
      this.room.changeStatus('free');
    });
  }

  end() {
    clearTimeout(this.currentRound.timer);
    this.currentRound.timer = null;
    var data = {
      key: this.currentRound.key,
      status: 'finish'
    };
    this.room.broadCast(data, "roundFinish");
    this.currentRound.currentIndex++;
    setTimeout(() => {
      this.nextRound();
    }, 1000 * 5);
  }

}
exports.default = Game;