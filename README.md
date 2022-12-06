## 参考文档

- [云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
- [Vant weapp文档](https://youzan.github.io/vant-weapp/#/home)
- [图标来源](https://www.iconfont.cn/)

## 数据库表及其字段
在云数据库中配置对应的数据库及其字段，或者在js代码中修改db.collection('')中的内容为设置的数据库名

- classify表 用于存储分类
  - name 类别名
  - num 类别序，用于排序的

- login_users表 存储授权用户的信息
  - _openid 授权用户的openid
  - avatarUrl 授权用户的头像
  - nickName 授权用户的昵称

- order表 存储订单信息
  - address 收货地址，包含电话等信息
  - all_price 这笔订单的总价
  - books 这笔订单包含的书籍及其详细信息
  - buyer 买家openid
  - remarks 买家的备注
  - seller 卖家的openid
  - sellerPhoneNumber 卖家的电话
  - time 订单创建的时间
  - type 这笔订单的状态（进行中或已完成）

- product表 存储书籍信息
  - buyer 买家信息
  - details 书籍简介
  - img 书籍照片
  - isSale 是否在售
  - name 书籍名称
  - price 书籍价格
  - remarks 买家的备注
  - select_classify 选择的分类
  - seller 卖家的openid
  - sellerPhoneNumber 卖家电话
  - time 上架时间

- shopping_car表 存储购物车信息
  - prodcut_id 书籍的id
  - product_img 书籍照片（购物车只展示第一张）
  - product_name 书籍名称
  - product_num 恒为1 书籍数量
  - product_price 书籍价格
  - seller 卖家openid
  - sellerPhoneNumber 卖家电话
  - time 加购时间

- swiper表 存储轮播图
  - src 轮播图地址