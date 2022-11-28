
//可以访问到globalData里的数据
const app =getApp()
const db=wx.cloud.database()
Page({
    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that=this
        wx.showLoading({
          title: '加载中',
        })
        //等待两秒是为了等app.js中异步请求完成，不然的话start页面里的app.globalData.userData是null
        setTimeout(function(){
            wx.hideLoading({
              success: (res) => {
                console.log(app.globalData.openid)
                that.setData({
                    userInfo: app.globalData.userData
                })
              },
            })
        },1000)
 
    },

    /**
     * 登录方法
     */
    login(){
        var that=this
        wx.getUserProfile({
            //说明获取信息做什么
            desc: '请授权登录，否则无法使用本程序',
            success(res){
                var user=res.userInfo
                //登陆数据设置到全局数据里
                app.globalData.userData=user
                that.setData({
                    userInfo:user
                })
                // 登录信息存在数据库中
                // 检查之前是不是已经授权登录成功过了
                wx.cloud.database().collection('login_users').where({
                    _openid:app.globalData.openid
                }).get({
                    success(res){
                        console.log(res)
                        /**
                         * 如果查到的结果length==0说明是第一次登录，要添加到数据库
                         * 否则之前已经登陆过，执行自动登录
                         * */
                        if(res.data.length == 0){
                            wx.cloud.database().collection('login_users').add({
                                data:{
                                    //数据库字段 : 参数
                                    avatarUrl:user.avatarUrl,
                                    nickName:user.nickName,
                                },
                                success(res){
                                    console.log(res)
                                    wx.showToast({
                                      title: '登录成功',
                                      icon:'success'
                                    })
                                }
                            })
                        }else{
                            //查找出来的数据绑定到页面的userInfo变量里，以免用户更新了头像或昵称而数据库不能更改
                            that.setData({
                                userInfo: res.data[0]
                            })
                            wx.showToast({
                              title: '登陆成功',
                              icon:'success'
                            })
                        }
                    }
                })

                
            }
        })
    },

    /**
     * 进入程序
     */
    enter(){
      wx.switchTab({
        url: '../index/index',
      })
    }
})