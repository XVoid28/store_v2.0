const db = wx.cloud.database()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    books:{},
    remarks:"",
    all_price:0
  },
  // 从购物车删除
  delete_books(){
    let that = this
    let books = that.data.books
    for(let i=0;i<books.length;i++){
      db.collection('shopping_car').doc(books[i]._id).remove()
    }
  },
  // 选择地址
  get_address(){
    let that = this
    wx.chooseAddress({
      success(res){
        console.log('my address:',res);
        that.setData({
          address:res
        })
      }
    })
  },
  //计算总价
  get_all_price(pro){
    let that = this
    let all_price = 0
    let product_list = pro
    for(let i=0;i<product_list.length;i++){
      all_price = all_price+(product_list[i].product_num*product_list[i].product_price)
      // 全算完了再赋值，不然会算的很慢
      if(i+1 == product_list.length){
        that.setData({
          all_price:parseFloat((all_price).toFixed(2))
        })
      }
    }
  },
  // 接收购物车的传参
  get_books(){
    let that = this
    wx.getStorage({
      key:'books',
      success(res){
        console.log('获取到的值:',res.data)
        that.setData({
          books:res.data
        })
        that.get_all_price(res.data)
      }
    })
  },
  // 输入备注
  input_remarks(e){
    this.setData({
      remarks:e.detail.value
    })
  },
  // 下单事件
  add_order(){
    let that = this
    if(that.data.address == {} || that.data.books.length == 0){
      //没书或没地址
      wx.showToast({
        title: '你有信息未填写',
        icon:'error'
      })
    }else{
      wx.showLoading({
        title: '下单中',
      })
      that.delete_books()
      db.collection('order').add({
        data:{
          address:that.data.address,
          books:that.data.books,
          type:'进行中',
          remarks:that.data.remarks,
          all_price:that.data.all_price,
          time:db.serverDate()
        }
      }).then(res=>{
        wx.hideLoading()
        wx.showToast({
          title: '下单成功',
          icon:'success'
        })
        // 清除页面缓存
        wx.removeStorage({
          key: 'books',
          success(res){
            wx.switchTab({
              url: '/pages/shopping_car/shopping_car'
            })
          }
        })
        wx.redirectTo({
          url: '../index/index',
        })
      }).catch(err=>{
        wx.hideLoading()
        wx.showToast({
          title: '发生未知错误',
          icon:'error'
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.get_books()
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