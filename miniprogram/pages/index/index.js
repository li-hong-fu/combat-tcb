const db = wx.cloud.database()

Page({
  data:{
    topic:'',
    fullScreen:false
  },
  onShow:function(){
    this.getTopics()
  },
  getTopics:function(){
    db.collection('topic').orderBy('createTime','desc').get({
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