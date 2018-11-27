  const Qs = require('../db/index');
  var i = 0;
  class Game {
      constructor() {
        this.subjects = {}
        this.currentRound = {
            key: "",
            tip: "",
            drawPlayer: null,
            currentIndex: 0,
            isSend: false,
            timer: null
        };
    }
    start() {
        //拿词库数据
        while(i<6){
            this.getData().then((data) => {
                this.getGameData(data);
            })
            i++;
        }
       
    }
      getGameData(data) {
       console.log(data.key, data.tip)
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
      return new Promise((resolve, reject) => {
          this.getRandomSubject().then(data => {
            console.log('一开始:' + data.key + data.tip)
              if (data == null || data.key in this.subjects) {
                  console.log('hi')
                  this.getData().then((data)=>{
                    resolve(data);
                  })
                  
                  
              } else {
                  this.subjects[data.key] = data.tip;
                  this.currentRound.key = data.key
                  this.currentRound.tip = data.tip
                  resolve(data);
                  
              }
          })
      })
  }
}
var g = new Game()
g.start()