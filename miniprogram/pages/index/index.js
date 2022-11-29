const app = getApp()
const db = wx.cloud.database()
Page({
  data:{
    swiper:[],
    pro_list:[]
  },
  // 搜索事件，按下回车生效
  search(e){
    let that = this
    console.log(e.detail)
  },
  // onLoad函数页面加载成功时就执行
  onLoad:function(options){
    let that = this
    // 这里注释掉是因为不要每次保存刷新都要去数据库读取内容，不然很快就把流量干没了
    db.collection('swiper').get({
      success:res=>{
        console.log('轮播图获取成功',res)
        that.setData({
          swiper:res.data
        })
      },fail:err=>{
        console.log('轮播图获取失败',err);
      }
    })
    db.collection('product').where({
      isSale:true
    }).get({
      success:res=>{
        console.log('商品获取成功',res);
        that.setData({
          pro_list:res.data
        })
      },fail:err=>{
        console.log('商品获取失败',err);
      }
    })
  },
  onShow: function () {
    let that = this
    that.onLoad()
  },
  // 下拉刷新
  onPullDownRefresh:function(){
    wx.showNavigationBarLoading()
    wx.reLaunch({
      url: '/pages/index/index',
      success:function(res){
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh()
      }
    })
  }
  
})