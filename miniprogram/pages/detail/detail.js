const App = getApp()
const db = wx.cloud.database()
import { formatTime } from '../../utils/date'

Page({
  data:{
    id:'',
    topic:'',
    fullScreen:false,
    userInfo:{},
    content:'',
    replies:''
  },
  onLoad:function(e){
    this.getTopics(e.id)
    this.getUserInfo()
    this.getReplies(e.id)
  },
  getTopics:function(id){
    db.collection('topic').doc(id).get({
      success:res => {
        this.setData({
          id:id,
          topic:res.data
        })
      }
    })
  },
  handlePreviewImage:function(e){
    let url = e.target.dataset.url
    wx.previewImage({
      current:url,
      urls:[url]
    })
  },
  handlePreviewVideo:function(e){
    let id = e.target.dataset.id
    let videoCtx = wx.createVideoContext(id)
    let fullScreen = this.data.fullScreen
    if(fullScreen){
      videoCtx.pause()
      videoCtx.exitFullScreen()
      this.setData({
        fullScreen:false
      })
    }else{
      videoCtx.play()
      videoCtx.requestFullScreen()
      this.setData({
        fullScreen:true
      })
    }
  },
  getUserInfo:function(){
    let userInfo = App.globalData.userInfo
    if(userInfo.nickName){
      this.setData({
        userInfo:userInfo
      })
    }
  },
  onGetUserInfo:function(e){
    if(e.detail.userInfo){
      App.getUserInfo().then(res => {
        this.setData({
          userInfo:res
        })
      })
    }
  },
  handleChange:function(e){
    let content = e.detail.value
    this.setData({
      content:content
    })
  },
  handleSubmit:function(e){
    let content = this.data.content
    if(!content){
      wx.showToast({
        icon:'none',
        title:'请输入说说'
      })
      return
    }
    let userInfo = this.data.userInfo
    let id = this.data.id
    let date_display = formatTime(new Date())
    let createTime = db.serverDate()

    db.collection('reply').add({
      data:{
        content,userInfo,id,date_display,createTime
      }
    }).then(res => {
        wx.showToast({ title: '评论成功' })
        this.getReplies(id)
        this.incReply(id)
        this.setData({ content:'' })
    })
  },
  getReplies:function(id){
    db.collection('reply').orderBy('createTime','desc').where({id:id}).get({
      success:res => {
        this.setData({
          replies:res.data
        })
      }
    })
  },
  incReply:function(id){
    wx.cloud.callFunction({
      name:'incReply',
      data:{
        id:id
      },
      success:res => {
        console.log(res)
      },
      fail:err => {
        console.error(err)
      }
    })
  }
})