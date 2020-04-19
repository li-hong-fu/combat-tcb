//app.js
App({
  onLaunch: function () {
    this.cloudInit()
    this.getUserInfo()
  },
  cloudInit:function(){
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }
  },
  getUserInfo:function(){
    return new Promise((resolve,reject)=>{
      wx.getSetting({
        success: res =>{
          if(res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              success: res => {
                this.globalData.userInfo = res.userInfo
                this.getOpenid()
                resolve(res.userInfo)
              }
            })
          }
        }
      })
    })
    
  },
  getOpenid: function() {
    return new Promise((resolve,reject)=>{
      wx.cloud.callFunction({
        name: 'login',
        success: res => {
          this.globalData.openid = res.result.openid;
          resolve(res.result.openid)
        }
      })
    })
  },
  globalData:{
    userInfo:{},
    openId:''
  }
})
