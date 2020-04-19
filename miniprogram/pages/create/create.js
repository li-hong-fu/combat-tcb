const db = wx.cloud.database()
const App = getApp()
import { formatTime } from '../../utils/date'

Page({
  data:{
    content:'',
    imageUrl:'',
    videoUrl:''
  },
  handleChange:function(e){
    let value = e.detail.value
    this.setData({
      content:value
    })
  },
  handleUpload:function(){
    let itemListType = ['image','video'];
    wx.showActionSheet({
      itemList:["图片","视频"],
      success: res => {
        let type = itemListType[res.tapIndex]
        switch(res.tapIndex){
          case 0:
            wx.chooseImage({
              count:1,
              sizeType:['compressed'],
              sourceType:['album', 'camera'],
              success: res => {
                let filePath = res.tempFilePaths[0]
                this.uploadFile(type,filePath)
              }
            })
            break;
          case 1:
            wx.chooseVideo({
              sourceType: ['album','camera'],
              maxDuration: 60,
              camera:'back',
              success: (res)=> {
                let filePath = res.tempFilePath
                this.uploadFile(type,filePath)
              }
            })
        }
      }
    })
  },
  uploadFile:function(type,filePath){
    let openid = App.globalData.openid
    let date = Date.now()
    let postfix = filePath.match(/\.[^.]+?$/)[0];
    let cloudPath = `${openid}_${date}_${postfix}`

    wx.showLoading({ 
      title: '上传中',
      mask: true
    });

    wx.cloud.uploadFile({
      cloudPath:cloudPath,
      filePath:filePath,
      success: res => {
        if(type === 'image'){
          this.setData({imageUrl:res.fileID})
        }else{
          this.setData({videoUrl:res.fileID})
        }
      },
      fail: err => {
        wx.showLoading({ 
          title: '上传失败',
          mask: true
        });
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  },
  handleSubmit:function(){
    let content = this.data.content
    let imageUrl = this.data.imageUrl
    let videoUrl = this.data.videoUrl
    let date_display = formatTime(new Date())
    let userInfo = App.globalData.userInfo
    let createdTime = Date.now()

    if(!content && !imageUrl && !videoUrl){
      wx.showToast({
        icon: 'none',
        title: '缺少内容'
      })
      return
    }

    wx.showLoading({ 
      title: '上传中',
      mask: true
    });

    db.collection('topic').add({
      data:{
        content,imageUrl,videoUrl,date_display,userInfo,createdTime
      },
      success: res => {
        console.log(res)
        wx.navigateTo({url:'/pages/detail/detail?id='+res._id})
      },
      fail: err => {
        wx.showLoading({ 
          icon: 'none',
          title: '添加失败'
        });
      },
      complete:()=>{
        wx.hideLoading()
      }
    })
  }
})