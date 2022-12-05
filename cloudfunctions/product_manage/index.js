// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  if(event.method == 'get_product'){
    return await db.collection('product').where({
      //卖家open_id号
      seller:event.seller,
      isSale:true
    }).orderBy("time","desc").get()
  }else if(event.method == 'search'){
    return await db.collection('product').where({
      name: db.RegExp({
        regexp: event.name,
        options: 'i',
      })
    }).orderBy("time","desc").get()
  }else if(event.method == 'to_classify'){
    return await db.collection('product').where({
      select_classify:event.classify,
      seller:event.seller,
      isSale:true
    }).orderBy("time","desc").get()
  }else if(event.method == 'get_product_sold'){
    return await db.collection('product').where({
      seller:event.seller,
      isSale:false
    }).orderBy("time","desc").get()
  }
}