// pages/wantBuy/wantBuy.js
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/md5.js') // 引入md5.js文件
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
    state: 0,
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
    var receive_List = new Array();
    $http.post('my/buyer_quote')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('我想买的：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var carList = data.QuotedPriceList.my_quoted;
          var carList_receive = data.QuotedPriceList.receive_quotation;
          if (carList){ //我的砍价
            carList.forEach((val, index) => {
              var obj = {
                id: val.id,
                imgSrc: app.globalData.imgUrl + val.brand.brand_default_images,
                name: val.models_name,
                priceArea: val.guide_price,
                sale: val.browse_volume,
                time: val.car_licensetime,
                miles: val.kilometres,
                addr: val.parkingposition,
                type: val.type,
                has_many_quoted_price: val.has_many_quoted_price
              }
              carInfoList[index] = obj;
            });
          }
          if (carList_receive){ //收到的砍价
            carList_receive.forEach((val, index) => {
              var obj = {
                id: val.id,
                imgSrc: app.globalData.imgUrl + val.brand.brand_default_images,
                name: val.models_name,
                priceArea: val.guide_price,
                sale: val.browse_volume,
                time: val.car_licensetime,
                miles: val.kilometres,
                addr: val.parkingposition,
                type: val.type,
                has_many_quoted_price: val.has_many_quoted_price
              }
              receive_List[index] = obj;
            });
          }
          $this.setData({
            carInfoList,
            receive_List,
            default_phone: data.QuotedPriceList.default_phone
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
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },
  //取消订单
  cancelOrderSell: function (e) {
    console.log(e)
    var that = this
    var quoted_id = e.target.id
    wx.showModal({
        title: '提示',
        content: '确定要取消订单吗？',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            $http.post('my/cancellation_of_quotation', {
              quoted_id: quoted_id
            }).then(res => {
              that.request_want_list();
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },
  //支付保证金，收到砍价
  payMargin: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要支付订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var payInfo = {
            formId: e.detail.formId,
            out_trade_no: new Date().getTime(),
            trading_models_id: e.detail.target.dataset.id.split('+')[0],
            // money: Number(e.detail.target.dataset.id.split('+')[1]),
            money: 0.01,
            user_type: e.detail.target.dataset.pay_type

          }
          payInfo.out_trade_no = payInfo.user_type + '_' + wx.getStorageSync("user_id") + '_' + payInfo.trading_models_id + '_' + payInfo.out_trade_no

          $http.post('store_margin_pay_other/marginPay', payInfo).then(res => {
            var timeStamp = (Date.parse(new Date()) / 1000).toString();
            var pkg = 'prepay_id=' + res.data.prepay_id;
            var nonceStr = res.data.nonce_str;
            var appid = res.data.appid;
            var key = res.data.key;
            var paySign = util.hexMD5('appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=" + key).toUpperCase(); //此处用到hexMD5插件 
            wx.hideLoading()
            //发起支付
            wx.requestPayment({
              'timeStamp': timeStamp,
              'nonceStr': nonceStr,
              'package': pkg,
              'signType': 'MD5',
              'paySign': paySign,
              'success': function (res) {
                console.log(res);
                if (res.errMsg == "requestPayment:ok") {
                  //支付成功推送模板
                  $http.post('store_margin_pay_other/after_successful_payment', payInfo).then(res => {
                    if (res.data.code == 1) {
                      console.log(res);
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'success'
                      });
                      that.request_want_list();
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'error'
                      });
                    }

                  });
                }
              },
              'fail': function (res) {
                console.log('用户取消支付,需要重载页面');

              },
              'complete': function (res) {

              }
            });

          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //支付保证金，我的砍价
  payMarginMy: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.showModal({
      title: '提示',
      content: '确定要支付订单吗？',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          var payInfo = {
            formId: e.detail.formId,
            out_trade_no: new Date().getTime(),
            trading_models_id: e.detail.target.dataset.id.split('+')[0],
            // money: Number(e.detail.target.dataset.id.split('+')[1]),
            money: 0.01,
            user_type: e.detail.target.dataset.pay_type

          }
          payInfo.out_trade_no = payInfo.user_type + '_' + wx.getStorageSync("user_id") + '_' + payInfo.trading_models_id + '_' + payInfo.out_trade_no

          $http.post('store_margin_pay/marginPay', payInfo).then(res => {
            var timeStamp = (Date.parse(new Date()) / 1000).toString();
            var pkg = 'prepay_id=' + res.data.prepay_id;
            var nonceStr = res.data.nonce_str;
            var appid = res.data.appid;
            var key = res.data.key;
            var paySign = util.hexMD5('appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=" + key).toUpperCase(); //此处用到hexMD5插件 
            wx.hideLoading()
            //发起支付
            wx.requestPayment({
              'timeStamp': timeStamp,
              'nonceStr': nonceStr,
              'package': pkg,
              'signType': 'MD5',
              'paySign': paySign,
              'success': function (res) {
                console.log(res);
                if (res.errMsg == "requestPayment:ok") {
                  //支付成功推送模板
                  $http.post('store_margin_pay/after_successful_payment', payInfo).then(res => {
                    if (res.data.code == 1) {
                      console.log(res);
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'success'
                      });
                      that.request_want_list();
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'error'
                      });
                    }

                  });
                }
              },
              'fail': function (res) {
                console.log('用户取消支付,需要重载页面');

              },
              'complete': function (res) {

              }
            });

          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //买家确认收货  -收到的砍价
  buyersConfirmTheDelivery: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var params = {
      formId: e.detail.formId,
      trading_models_id: e.detail.target.dataset.id,//车辆交易id
      user_ids: e.detail.target.dataset.user_ids,
      by_user_ids: e.detail.target.dataset.by_user_ids,//卖家的id
      quotationtime: e.detail.target.dataset.quotationtime
    }

 
    $http.post('store_margin_pay_other/buyersConfirmTheDelivery', params).then(res => {
      if (res.data.code == 1) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        });
        that.request_want_list();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'clear'
        });
      }
    });


  },
  //买家确认收货  -我的砍价
  buyersConfirmTheDeliveryMy: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var params = {
      formId: e.detail.formId,
      trading_models_id: e.detail.target.dataset.id,//车辆交易id
      user_ids: e.detail.target.dataset.user_ids,
      by_user_ids: e.detail.target.dataset.by_user_ids,//卖家的id
      quotationtime: e.detail.target.dataset.quotationtime
    }


    $http.post('store_margin_pay/buyersConfirmTheDelivery', params).then(res => {
      if (res.data.code == 1) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        });
        that.request_want_list();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'clear'
        });
      }
    });


  },

  chooseState(e) {
    var state = e.currentTarget.dataset.state;
    this.setData({
      state: state
    })
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