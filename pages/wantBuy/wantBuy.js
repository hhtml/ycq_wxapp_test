// pages/wantBuy/wantBuy.js
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
        name: '2011款奥迪A6 2.0T自动舒适版自动舒适版自动舒适版',
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request_want_list();
  },
  request_want_list(){
    var $this = this;
    var carInfoList = new Array();
    $http.post('my/buyCar')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('我想买的：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var carList = data.buyCarList;

          carList.forEach((val, index) => {
            var obj = {
              id: val.id,
              imgSrc: app.globalData.imgUrl + (val.brand.brand_default_images ? val.brand.brand_default_images:val.modelsimages),
              brand_name:val.brand.name,
              name: val.models_name,
              shelfismenu: val.shelfismenu,
              priceArea: val.guide_price,
              sale: val.browse_volume,
              time: val.car_licensetime,
              miles: val.kilometres,
              addr: val.parkingposition,
              brand_id: val.brand.id,
              brand_name: val.brand.name,
              type: val.type
            }
            carInfoList[index] = obj;
          });
          $this.setData({
            carInfoList
          });

        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败',err);
      });
  },
  nav_to_car_detail: function (e) {
    var carId = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../carDetail/carDetail?carId=' + carId + '&type=' + type,
    });
  }, 
  putOn(e){
    var id=e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var carInfoList = this.data.carInfoList;
    var $this = this;
    $http.post('my/Buyshelf',{
      id:id,
      shelfismenu:1
    })
      .then(res => {
        //成功回调
        var resObj = res.data;
        if (resObj.code == 1) {
          var data = resObj.data;
          wx.showToast({
            title: resObj.msg,
          })
          carInfoList[index].shelfismenu = 1;
          $this.setData({
            carInfoList: carInfoList
          })
        } else {
          wx.showToast({
            title: resObj.msg,
            image:'../../images/warn.png'
          })
          console.log('请求失败：', resObj.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败');
      });
  },
  pullOff(e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var carInfoList = this.data.carInfoList;
    var $this = this;
    $http.post('my/Buyshelf', {
      id: id,
      shelfismenu: 0
    })
      .then(res => {
        //成功回调
        var resObj = res.data;
        if (resObj.code == 1) {
          var data = resObj.data;
          wx.showToast({
            title: resObj.msg,
          })
          carInfoList[index].shelfismenu=0;
          $this.setData({
            carInfoList: carInfoList
          })
        } else {
          wx.showToast({
            title: resObj.msg,
            image: '../../images/warn.png'
          })
          console.log('请求失败：', resObj.msg);
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
    this.request_want_list();
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