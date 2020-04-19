const App = getApp()

Page({
  data:{
    userInfo:{}
  },
  onLoad:function(){
    this.getUserInfo()
  },
  getUserInfo:function(){
    App.getUserInfo().then(res => {
      if(res.nickName){
        this.setData({
          userInfo:res
        })
      }
    })
  },
  onGetUserInfo:function(e){
    console.log(e)
    if(e.detail.userInfo){
      App.getUserInfo().then(res => {
        this.setData({
          userInfo:res
        })
      })
    }
  }
})