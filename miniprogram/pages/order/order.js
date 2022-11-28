// pages/order/order.js
const db = wx.cloud.database()
const time = require('../../utils/time.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 默认展示进行中订单
    title:"进行中",
    order:[]
  },
  // 转换时间
  change_time(li){
    if(li.length == 0){
      return li
    }else{
      for(let i=0;i<li.length;i++){
        li[i].time = time.formatTime(new Date(li[i].time))
        if(i+1==li.length){
          return li
        }
      }
    }
  },
  // 选择订单类型
  select_title(e){
    let that = this
    let name = e.currentTarget.dataset.name
    that.setData({
      title:name
    })
    that.get_order(name)
  },
  //获取订单
  get_order(type){
    let that = this
    wx.showLoading({
      title: '加载中'
    })
    db.collection('order').where({
      type:type,
      buyer:app.globalData.userData._openid
    }).orderBy('time','desc').get().then(res=>{
      console.log('成功',res.data);
      wx.hideLoading()
      that.setData({
        order:that.change_time(res.data)
      })
    }).catch(err=>{
      wx.hideLoading()
      console.log('失败',err.data);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.setData({
      title:options.type
    })
    that.get_order(options.type)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})