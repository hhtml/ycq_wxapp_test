// pages/myShop/myShop.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     shop:{
       banner:'../../images/car-test_03.png',
       name:'济南二手车品鉴',
       addr:'成都市武侯区天府广场1栋',
       brands:['奔驰','宝马','JEEP','玛莎拉蒂','VOLVO']
     },
    active_tab:'店铺特色',
    detail_img_list: ['../../images/car-test_03.png', '../../images/car-test_03.png', '../../images/car-test_03.png']
  },
  /**
   * 事件函数
   */
  change_tab:function(e){
      var title=e.currentTarget.dataset.title;
      this.setData({
        active_tab: title
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var shopId=options.shopId;
      console.log('shopId:',shopId);
  },
  request_shop_detail(shopId){
    var $this = this;
    $http.post('my/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('我的数据：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var company = {
            id: data.userInfo.companystoreone.id,
            qrcode: data.userInfo.companystoreone.store_qrcode
          }
          $this.setData({ company });

        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败');
      });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})