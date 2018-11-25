import User from './User'
import { USER_GAMING } from './Constant'
export default class UserService{
  constructor() {
    this.userMap = {}
    this.num = 1;
  }

  login(control, data){
    if(data && data.id && this.userMap[data.id]){
      //旧对象
      var ctrl = this.userMap[data.id]
      //新的ws
      var ws = control.ws
      Object.assign(control, ctrl)
      control.ws = ws
      var inGame = ctrl.user.status === USER_GAMING ? true : false
      control.send({inGame: inGame,roomId: control.room.roomId},'login')
      if(inGame){
        var player = control.room.userReconnet(control.user.id)
        control.room.game.userReconnect(player)
      }
      
    }else{
      //放入新成员
      this.userMap[control.user.id] = control;
      control.send(control.user.loginInfo(),'login')
    }
  }

  addUser(control) {
    var user = new User(this.num);
    this.num++;
    return user
  }

}
