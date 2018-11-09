var mongoose = require('mongoose');
var credentials = require('./credentials');

var opts = {
  server: {
    socketOptions: { keepAlive:1 }
  }
};

mongoose.connect(credentials.mongo.development.connectionString, opts);

var qsSchema = mongoose.Schema({
  key: String,
  tip: String,
  random: {type:Number,index:true}
});

var Qs = mongoose.model('Qs', qsSchema);

Qs.find(function(err, qs){
  if(qs.length) return;

  new Qs({
    key: '源氏',
    tip: '游戏人物',
    random: Math.random()
  }).save();
  new Qs({
    key: '我的英雄学院',
    tip: '动画',
    random: Math.random()
  }).save()
  new Qs({
    key: '绝地求生',
    tip: '游戏',
    random: Math.random()
  }).save()
  new Qs({
    key: '聚乙烯',
    tip: '化学材料',
    random: Math.random()
  }).save()
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
    key: '爆豪胜己',
    tip: '动画人物',
    random: Math.random()
  }).save()
  new Qs({
    key: '花街',
    tip: '习俗地方',
    random: Math.random()
  }).save()
  new Qs({
    key: '哈利波特',
    tip: '电影',
    random: Math.random()
  }).save()
  new Qs({
    key: '龙族',
    tip: '小说',
    random: Math.random()
  }).save()

  new Qs({
    key: '康纳',
    tip: '游戏人物',
    random: Math.random()
  }).save()
  new Qs({
    key: '香蕉',
    tip: '水果',
    random: Math.random()
  }).save()
  new Qs({
    key: '羽生结弦',
    tip: '运动员',
    random: Math.random()
  }).save()
  new Qs({
    key: '羽毛球',
    tip: '运动',
    random: Math.random()
  }).save()
  new Qs({
    key: '钢之炼金术师',
    tip: '动画',
    random: Math.random()
  }).save()

  new Qs({
    key: '熊猫',
    tip: '动物',
    random: Math.random()
  }).save()
  new Qs({
    key: '泰拳',
    tip: '拳击',
    random: Math.random()
  }).save()
  new Qs({
    key: '消音器',
    tip: '装备',
    random: Math.random()
  }).save()
  new Qs({
    key: '广场舞',
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
    key: '显微镜',
    tip: '仪器',
    random: Math.random()
  }).save()
  new Qs({
    key: '自行车',
    tip: '交通工具',
    random: Math.random()
  }).save()
  new Qs({
    key: '吴彦祖',
    tip: '人物',
    random: Math.random()
  }).save()
  new Qs({
    key: '普京',
    tip: '人物',
    random: Math.random()
  }).save()

  new Qs({
    key: '你画我猜',
    tip: '游戏',
    random: Math.random()
  }).save()
})

module.exports = Qs;
