var mongoose = require('mongoose');
var credentials = require('./credentials');

var opts = {
  server: {
    socketOptions: { keepAlive:1 }
  }
};

mongoose.connect(credentials.mongo.development.connectionString, {
  useNewUrlParser: true
});

var qsSchema = mongoose.Schema({
  key: String,
  tip: String,
  random: {type:Number,index:true}
});

var Qs = mongoose.model('Qs', qsSchema);

Qs.find(function(err, qs){
  if(qs.length) return;
  new Qs({
    key: '海绵宝宝',
    tip: '动画',
    random: Math.random()
  }).save()
  new Qs({
    key: '键盘',
    tip: '电脑设备',
    random: Math.random()
  }).save()
  new Qs({
    key: '面膜',
    tip: '化妆用品',
    random: Math.random()
  }).save()
  new Qs({
    key: '防晒霜',
    tip: '化妆用品',
    random: Math.random()
  }).save()
  new Qs({
    key: '小提琴',
    tip: '乐器',
    random: Math.random()
  }).save()
  new Qs({
    key: '哈利波特',
    tip: '电影',
    random: Math.random()
  }).save()
  new Qs({
    key: '香蕉',
    tip: '水果',
    random: Math.random()
  }).save()
  new Qs({
    key: '香肠',
    tip: '食物',
    random: Math.random()
  }).save()
  new Qs({
    key: '羽毛球',
    tip: '运动',
    random: Math.random()
  }).save()
  new Qs({
    key: '书桌',
    tip: '家具',
    random: Math.random()
  }).save()
  new Qs({
    key: '熊猫',
    tip: '动物',
    random: Math.random()
  }).save()
  new Qs({
    key: '棒球',
    tip: '运动',
    random: Math.random()
  }).save()
  new Qs({
    key: '看戏',
    tip: '状态',
    random: Math.random()
  }).save()
  new Qs({
    key: '十三幺',
    tip: '术语',
    random: Math.random()
  }).save()
  new Qs({
    key: '彩虹屁',
    tip: '网络词汇',
    random: Math.random()
  }).save()
  new Qs({
    key: '显微镜',
    tip: '仪器',
    random: Math.random()
  }).save()
  new Qs({
    key: '自行车',
    tip: '交通工具',
    random: Math.random()
  }).save()
})

// module.exports = Qs;
