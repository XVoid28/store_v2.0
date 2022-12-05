const time = require('../../utils/time.js')
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify:"全部",
    product:[],
    classify_list:[{'name':'全部'}]
  },
  // 获取书籍
  get_product(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name:"product_manage",
      data:{
        method:"get_product",
        seller:app.globalData.userData._openid
      }
    }).then(res=>{
      wx.hideLoading()
      console.log('获取书籍',res.result.data);
      that.setData({
        product:that.change_time(res.result.data)
      })
    })
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
  // 搜索
  search(e){
    let that = this
    if(e.detail.value){
      wx.showLoading({
        title: '搜索中',
      })
      wx.cloud.callFunction({
        name:"product_manage",
        data:{
          method:"search",
          name:e.detail.value
        }
      }).then(res => {
        wx.hideLoading()
        that.setData({
          product:that.change_time(res.result.data)
        })
      })
    }else{
      that.get_product()
    }
    
  },
  // 获取分类
  get_classify(){
    let that = this
    db.collection('classify').get().then(res=>{
      that.setData({
        classify_list:that.data.classify_list.concat(res.data)
      })
    })
  },
  // 选择分类
  select_classify(e){
    let that = this
    let classify = that.data.classify_list[e.detail.value*1].name
    that.setData({
      classify:classify
    })
    if(classify == '全部'){
      that.get_product()
    }else{
      wx.showLoading({
        title: '加载中',
      })
      wx.cloud.callFunction({
        name:"product_manage",
        data:{
          method:"to_classify",
          classify:classify,
          seller:app.globalData.userData._openid
        }
      }).then(res=>{
        wx.hideLoading()
        that.setData({
          product:that.change_time(res.result.data)
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.get_product()
    that.get_classify()
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