// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
   env: "bookstore-2g4yh3ax134a3848"
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  return await db.collection('product').add({
    data:{
      time:db.serverDate(),
      name:event.name,
      price:event.price,
      img:event.img,
      select_classify:event.select_classify,
      details:event.details,
      isSale:true
    }
  })
}