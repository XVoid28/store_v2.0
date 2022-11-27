// pages/my/my.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:{},
    show_login:true
  },

  // 地址管理
  my_address(){
    let that = this
    wx.chooseAddress({
      success(res){
        console.log('my address',res);
      }
    })
  },
  // 注册
  register(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '你还未授权，是否授权？',
      success(res){
        if(res.confirm){
          wx.getUserProfile({
            desc: '个人信息用于使用本程序',
            success:(userInfo=>{
              console.log(userInfo);
              wx.showLoading({
                title: '授权中',
              })
              db.collection('user').add({
                data:{
                  userInfo:userInfo.userInfo
                }
              }).then(user=>{
                wx.hideLoading()
                wx.showToast({
                  title: '授权成功',
                })
                that.login()
              })
              // this.setData({
              //   userInfo:res.userInfo,
              //   hasUserInfo:true
              // })
            })
          })
        }else if(res.cancel){
          console.log('用户取消授权');
        }
      }
    })
    
  },

  // 登录
  login(){
    let that = this
    db.collection('user').get().then(res=>{
      if(res.data.length>0){
        that.setData({
          user:res.data[0]
        })
      }else{
        that.register()
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.login()
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