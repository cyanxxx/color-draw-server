import User from './User'
import { USER_GAMING,USER_RECONNECT } from './Constant'
export default class UserService{
  constructor() {
    this.userMap = {}
    this.num = 1;
  }

  login(control, data){
    if (data && data.id && this.userMap[data.id] && this.userMap[data.id].room) {
      //旧对象
      var ctrl = this.userMap[data.id]
      control.room = ctrl.room;
      control.user = ctrl.user;
      control.room.userList.find((ctrl, i) => {
        if (ctrl.user.id === control.user.id) {
          control.room.userList[i] = control;
        }
      })
      this.userMap[data.id] = control
      var inGame = ctrl.user.status === USER_GAMING ? true : false
      control.send({status: USER_RECONNECT, inGame: inGame,roomId: control.room.roomId},'login')
      control.user.changeState(USER_RECONNECT)
      if(inGame){
        var player = control.room.userReconnet(control.user.id)
        control.room.game.userReconnect(player, control)
        control.user.changeState(USER_GAMING)
      }
    }else{
      //放入新成员
      this.userMap[control.user.id] = control;
      control.send(control.user.loginInfo(),'login')
    }
  }
  offline(ctrl) {
    var id = ctrl.user.id;
    if (ctrl.room && ctrl.user.status === USER_GAMING) {
      ctrl.room.userOffLine(id);
    } else if (ctrl.room) {
      ctrl.events.exitRoom.apply(ctrl);
      this.deleteUser(id)
    } else {
      this.deleteUser(id)
      console.log('hidden left')
    }
  }
  addUser() {
    var user = new User(this.num);
    this.num++;
    return user
  }
  deleteUser(id) {
    var userMap = this.userMap
    userMap[id] = null;
    delete userMap[id];
  }
}
