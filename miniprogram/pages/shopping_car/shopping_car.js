// pages/shopping_car/shopping_car.js
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product_list:[],
    all_price:0,
    result:[],
    is_all:false
  },
  // 读取购物车信息
  get_shopping_car(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    db.collection('shopping_car').orderBy('time','desc').get().then(res=>{
      wx.hideLoading()
      console.log('读取购物车信息成功',res);
      that.setData({
        product_list:res.data
      })
    })
  },
  //选择方法
  select_product(e){
    let that = this
    let select_pro = e.detail
    that.setData({
      result:select_pro
    })
    that.get_all_price(select_pro)
    console.log(e);
  },
  //计算总价
  get_all_price(pro){
    let that = this
    let all_price = 0
    let product_list = that.data.product_list
    if(pro.length == 0){
      that.setData({
        // 啥都没选直接0
        all_price:0
      })
    }else{
      for(let i=0;i<pro.length;i++){
        let index = parseInt(pro[i])
        all_price = all_price+(product_list[index].product_num*product_list[index].product_price)
        // 全算完了再赋值，不然会算的很慢
        if(i+1 == pro.length){
          that.setData({
            all_price:parseFloat((all_price*100).toFixed(2))
          })
        }
      }
    }
  },
  // 全选和取消全选
  select_all(e){
    let that = this
    let name = e.currentTarget.dataset.name
    let result = []
    if(name=='全选'){
      for(let i=0;i<that.data.product_list.length;i++){
        result.push(i+'')
        if(i+1==that.data.product_list.length){
          that.get_all_price(result)
          that.setData({
            result:result,
            is_all:true
          })
        }
      }
    }else{
      that.setData({
        result:[],
        is_all:false,
        all_price:0
      })
    }
    console.log(e);
  },
  // 删除购物车内的书籍
  delete_product(e){
    let that = this
    let id = e.currentTarget.dataset.id
    wx.showModal({
      title: '提示',
      content: '是否确认删除？请注意，该操作无法恢复！',
      success(res){
        if(res.confirm){
          console.log('用户确定');
          wx.showLoading({
            title: '删除中'
          })
          db.collection('shopping_car').doc(id).remove().then(res=>{
            wx.hideLoading()
            wx.showToast({
              title: '已成功删除'
            })
            that.get_shopping_car()
          }).catch(err=>{
            wx.hideLoading()
            wx.showToast({
              title: '发生未知错误',
              icon:'error'
            })
            console.log('发生未知错误:',err);
          })
        }else if(res.cancel){
          console.log('用户取消');
        }
      }
    })
    
  },
  // 提交订单
  submit_order(){
    let that = this
    if(that.data.result.length != 0){
      let books = []
      for(let i=0;i<that.data.result.length;i++){
        wx.showLoading({
          title: '提交中',
        })
        books.push(that.data.product_list[that.data.result[i]*1])
        if(i+1==that.data.result.length){
          wx.hideLoading()
          // 缓存传参
          wx.setStorage({
            key:"books",
            data:books
          })
          wx.navigateTo({
            url: '../add_order/add_order',
          })
        }
      }
    }else{
      wx.showToast({
        title: '请选择书籍',
        icon: 'error'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    let that = this
    that.get_shopping_car()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    let that = this
    that.get_shopping_car()
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