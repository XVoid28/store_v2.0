// pages/classify/classify.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classify:[{"name":"全部"}],
    select_classify:"全部",
    goods:[]
  },
  // 获取分类
  get_classify(){
    let that = this
    let classify = that.data.classify
    db.collection('classify').orderBy("num","asc").get().then(res=>{
      console.log('获取分类',res.data);
      that.setData({
        classify:classify.concat(res.data)
      })
    })
  },
  // 选择分类
  select_classify(e){
    let that = this
    let name = e.currentTarget.dataset.name
    that.setData({
      select_classify: name
    })
    that.get_goods(name)
  },
  // 获取商品
  get_goods(classify){
    let that = this
    if(classify == '全部'){
      db.collection('product').where({
        isSale:true
      }).get().then(res=>{
        that.setData({
          goods:res.data
        })
      })
    }else{
      db.collection('product').where({
        isSale:true,
        select_classify:classify
      }).get().then(res=>{
        that.setData({
          goods:res.data
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.get_classify()
    that.get_goods("全部")
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