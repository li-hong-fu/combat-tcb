// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  let id = event.id
  try{
    return await db.collection('topic').doc(id).update({
      data:{
        reply_number: _.inc(1)
      }
    })
  }catch(e){
    console.error(e)
  }
}