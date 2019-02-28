// pages/priceManage/priceManage.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfoList: [
     /* {
        id: 0,
        imgSrc: '../../images/car-test_03.png',
        name: '2011款奥迪A6 2.0T自动舒适版自动舒',
        priceArea: '10.5-30.5',
        sale: '30',
        time: '2011-03',
        miles: '3万',
        addr: '成都',
        distance: '310'
      },
      {
        id: 1,
        imgSrc: '../../images/car-test_03.png',
        name: '2011款奥迪A6 2.0T自动舒适版',
        priceArea: '10.5-30.5',
        sale: '30',
        time: '2011-03',
        miles: '3万',
        addr: '成都',
        distance: '310'
      },*/
    ],
    state:0
  },
  /***
   * 事件
   */
  chooseState(e){
      var state=e.currentTarget.dataset.state;
      this.setData({
         state:state
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({ userInfo });
    this.request_price_list();
   
  },
  nav_to_car_detail: function (e) {
    var carId = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../carDetail/carDetail?carId=' + carId + '&type=' + type,
    });
  }, 
  request_price_list() {
    var userInfo = this.data.userInfo;
    var $this = this;
    var carSellList = new Array();
    var carBuyList = new Array();
    $http.post('my/myQuoted')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('报价管理：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var carSell = data.QuotedPriceList.sell;
          var carBuy = data.QuotedPriceList.buy;
          if (carSell){
            carSell.forEach((val, index) => {
              var obj = {
                id: val.models_info.id,
                imgSrc: (val.models_info.type == 'sell' ? app.globalData.localImgUrl : app.globalData.imgUrl
                ) + val.models_info.modelsimages,
                brand_name: val.models_info.brand_name,
                name: val.models_info.models_name,
                priceArea: val.models_info.guide_price,
                price: val.money,
                quotationtime: val.quotationtime,
                sale: val.models_info.browse_volume,
                time: val.models_info.car_licensetime,
                miles: val.models_info.kilometres,
                addr: val.models_info.parkingposition,
              //  brand_id: val.buycar_model.brand.id,
              //  brand_name: val.buycar_model.brand.name,
                type: val.models_info.type,
                userPic: val.user.avatar,
                userName: val.user.nickname,
                mobile:val.user.mobile
              }
              carSellList[index] = obj;
            });
          }
          
          if (carBuy){
            carBuy.forEach((val, index) => {
              //console.log('userINFO:', userInfo);
              var obj = {
                id: val.models_info.id,
                imgSrc: (val.models_info.type == 'sell' ? app.globalData.localImgUrl : app.globalData.imgUrl  
                )+ val.models_info.modelsimages,
                brand_name: val.models_info.brand_name,
                name: val.models_info.models_name,
                priceArea: val.models_info.guide_price,
                price: val.money,
                quotationtime: val.quotationtime,

                sale: val.models_info.browse_volume,
                time: val.models_info.car_licensetime,
                miles: val.models_info.kilometres,
                addr: val.models_info.parkingposition,
                //brand_id: val.buycar_model.brand.id,
                //brand_name: val.buycar_model.brand.name,
                type: val.models_info.type,
                userPic: userInfo.avatar,
                userName: userInfo.nickname,
                mobile: val.user.mobile
              }
              carBuyList[index] = obj;
            });
          }
          $this.setData({
            carBuyList,
            carSellList
          });
        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
  },
  makePhoneCall(e){
    var tel = '028 - 84167417';
     wx.makePhoneCall({
       phoneNumber: tel,
     })
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
    this.request_price_list();
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