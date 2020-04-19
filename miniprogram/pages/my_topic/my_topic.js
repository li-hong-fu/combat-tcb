const db = wx.cloud.database()
const App = getApp()

Page({
  data:{
    openid:'',
    topic:'',
    fullScreen:false
  },
  onShow:function(){
    this.getOpenId()
  },
  getOpenId:function(){
    App.getOpenid().then(res => {
      this.getTopics(res)
    })
  },
  getTopics:function(openid){
    db.collection('topic').orderBy('createTime','desc').where({
      _openid: openid
    }).get({
      success: res => {
        this.setData({
          topic:res.data
        })
      },
      fail: err => {
        console.log(err)
      }
    })
  },
  handlePreviewImage:function(e){
    let url = e.currentTarget.dataset.url
    wx.previewImage({
      current:url,
      urls:[url]
    })
  },
  handlePreviewVideo:function(e){
    let id = e.currentTarget.dataset.id
    let videoCtx = wx.createVideoContext(id)
    let fullScreen = this.data.fullScreen
    if(!fullScreen){
      videoCtx.requestFullScreen()
      videoCtx.play()
      this.setData({
        fullScreen:true
      })
    }else{
      videoCtx.pause()
      videoCtx.exitFullScreen()
      this.setData({
        fullScreen:false
      })
    }
  },
  onPullDownRefresh:function(){
    this.getTopics(()=>{
      wx.stopPullDownRefresh()
    })
  }
})
