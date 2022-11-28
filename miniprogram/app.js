// app.js
App({
  onLaunch() {
    // 云环境初始化
    wx.cloud.init({
      env:'bookstore-2g4yh3ax134a3848'
    })

    var that = this
    wx.cloud.callFunction({
      name:'login_get_openid',
      success(res){
        that.globalData.openid = res.result.openid
        // 看数据库中有没有此人
        wx.cloud.database().collection('login_users').where({
          _openid:res.result.openid
        }).get({
          success(result){
            console.log('这是app.js的result:',result);
            that.globalData.userData = result.data[0]
          }
        })
      }
    })
    
  },
  globalData: {
    userData: null,
    openid:null
  }
})
