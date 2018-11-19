import User from './User'
const {FREE, GAMING, LEAVING} = require('./Constant')
export default class UserService{
  constructor() {
    this.userMap = {}
  }

  login(control, data){
    //console.log(this.userMap)
    if(data && data.id && this.userMap[data.id]){
      console.log(Object.keys(this.userMap))
      //旧对象
      var user = this.userMap[data.id]
      var ws = control.user.ws
      Object.assign(control.user,user)
      control.user.ws = ws

      var inGame = control.user.status === GAMING? true: false
      control.send({inGame: inGame},'login')
      control.room.game.userReconnect(control.user.id)
      console.log(Object.keys(this.userMap))
    }else{
      //放入新成员
      this.userMap[control.user.id] = control;
      control.send(control.user.loginInfo(),'login')
    }
  }

  addUser(control) {
    var user = new User();
    return user
  }

}
