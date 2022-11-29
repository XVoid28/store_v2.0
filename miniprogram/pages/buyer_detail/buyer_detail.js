const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    name:"",
    price:0,
    phoneNumber:"",
    img:[],
    classify:[],
    select_classify:"",
    details:"",
    address:""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    that.get_classify()
    wx.showLoading({
      title: '加载中',
    })
    that.setData({
      id:options.id
    })
    db.collection('product').doc(options.id).get({
      success:function(res){
        console.log('31行的res:',res);
        wx.hideLoading()
        that.setData({
          id:res.data._id,
          name:res.data.name,
          price:res.data.price,
          details:res.data.remarks,
          phoneNumber:res.data.buyer.telNumber,
          select_classify:res.data.select_classify,
          img:res.data.img,
          address:res.data.buyer.provinceName + res.data.buyer.cityName + res.data.buyer.countyName + res.data.buyer.detailInfo
        })
      },fail:function(err){
        console.log('这是41行的错误',err);
      }
    })
  },
  // 删除这本书
  delete_book(e){
    let that = this
    wx.showModal({
      title: '警告',
      content: '是否确定下架该书？此操作不可恢复',
      success (res) {
        if (res.confirm) {
          db.collection('product').doc(that.data.id).get().then(res=>{
            if(res.data.isSale == true){
              db.collection('product').doc(that.data.id).remove().then(res=>{
                wx.showToast({
                  title: '下架成功',
                })
                wx.redirectTo({
                  url: '../my/my',
                })
              })
            }else{
              wx.showToast({
                title: '交易中不可下架',
                icon:'error'
              })
            }
          })
          
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 删除照片
  delete_img(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let img = that.data.img
    wx.showModal({
      title: '提示',
      content: '你确定要删除这张照片吗',
      success (res) {
        if(res.confirm){
          img.splice(index,1)
          that.setData({
            img:img
          })
        } else if (res.cancel){
          console.log('用户取消操作');
        }
      }
    })
  },
  // 上传照片
  add_img(){
    let that = this
    let img = that.data.img
    wx.chooseImage({
      count: 9-img.length,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        const tempFilePaths = res.tempFilePaths
        that.setData({
          img:img.concat(tempFilePaths)
        })
      }
    })
  },
  // 输入事件
  input_msg(e){
    console.log(e);
    let that = this
    let name = e.currentTarget.dataset.name
    if(name == 'price'){
      that.setData({
        [name]:parseFloat((e.detail.value*1).toFixed(2))
      })
    }else if(name == 'phoneNumber'){
      that.setData({
        [name]:e.detail.value
      })
    }else{
      that.setData({
        [name]:e.detail.value
      })
    }
  },
  // 输入简介
  input_details(e){
    let that = this
    that.setData({
      details:e.detail.value
    })
  },
  // 获取分类
  get_classify(){
    let that = this
    db.collection('classify').get().then(res=>{
      console.log('获取分类',res.data);
      that.setData({
        classify:res.data
      })
    })
  },
  // 选择分类
  select_classify(e){
    let that = this
    that.setData({
      select_classify:e.detail
    })
  },
  // 提交
  async submit(){
    let that = this
    let img = that.data.img
    wx.showLoading({
      title: '上传中',
    })
    for(let i = 0;i<img.length;i++){
      var timestamp = new Date().getTime()
      await wx.cloud.uploadFile({
        cloudPath:'product/'+timestamp+''+i+''+'.png',
        filePath:img[i]
      }).then(res=>{
        console.log(res.fileID);
        img[i] = res.fileID
        if(i+1 == img.length){
          //上传完了
          wx.cloud.callFunction({
            name:"product_update",
            data:{
              id:that.data.id,
              name:that.data.name,
              price:that.data.price,
              img:img,
              select_classify:that.data.select_classify,
              details:that.data.details,
              sellerId:app.globalData.userData._openid,
              sellerPhoneNumber:that.data.phoneNumber
            }
          }).then(res => {
            wx.hideLoading()
            wx.showToast({
              title: '已上架',
              icon:'success'
            })
            wx.redirectTo({
              url: '../my/my',
            })()
          })
        }
      }).catch(error=>{
        //handle error
      })
      
    }
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