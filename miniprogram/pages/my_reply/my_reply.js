const db = wx.cloud.database()
const App = getApp();

Page({
  data:{
    replies:[]
  },
  onLoad: function() {
    this.getOpenId();
  },
  getOpenId:function(){
    App.getOpenid().then(res => {
      this.getReplies(res)
    })
  },
  getReplies:function(openid){
    console.log(openid)
    db.collection('reply').orderBy('createTime', 'desc').where({
      _openid:openid
    }).get({
      success:res => {
        console.log(res)
        this.setData({
          replies:res.data,
        })
      }
    })
  }
})