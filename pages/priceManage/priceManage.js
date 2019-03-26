// pages/priceManage/priceManage.js
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/md5.js') // 引入md5.js文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfoList: [

    ],
    state: 0,

  },
  /***
   * 事件
   */
  chooseState(e) {
    var state = e.currentTarget.dataset.state;
    this.setData({
      state: state
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo
    });
    this.request_price_list();

  },
  nav_to_car_detail: function(e) {
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
        var resObj = res.data;
        //成功回调 
        if (resObj.code == 1 && resObj.data != null) {
          console.log(resObj);
          var data = resObj.data;
          var carSell = data.QuotedPriceList.receive_quotation; //收到的报价
          var carBuy = data.QuotedPriceList.my_quoted; //我的砍价

          $this.data.sell = carSell
          $this.data.buy = carBuy;

          if (carSell) {
            carSell.forEach((val, index) => {
              var obj = {
                id: val.id,
                modelsimages: app.globalData.localImgUrl + val.modelsimages, //车辆图片
                models_name: val.models_name, //车辆名称 
                parkingposition: val.parkingposition, //车辆所在地
                kilometres: val.kilometres, //公里数
                browse_volume: val.browse_volume, //浏览量
                car_licensetime: val.car_licensetime, //车辆年份  
                type: val.type, //车辆类型 
                guide_price: val.guide_price, //批发价
                createtime: val.createtime, //车辆发布时间
                has_many_quoted_price: val.has_many_quoted_price,
              }
              carSellList[index] = obj;
            });
            console.log(carSellList)
          }

          if (carBuy) {
            carBuy.forEach((val, index) => {
              var obj = {
                id: val.id,
                modelsimages: app.globalData.imgUrl + val.modelsimages, //车辆图片
                models_name: val.models_name, //车辆名称 
                parkingposition: val.parkingposition, //车辆所在地
                kilometres: val.kilometres, //公里数
                browse_volume: val.browse_volume, //浏览量
                car_licensetime: val.car_licensetime, //车辆年份  
                type: val.type, //车辆类型 
                guide_price: val.guide_price, //批发价
                createtime: val.createtime, //车辆发布时间
                has_many_quoted_price: val.has_many_quoted_price,
              }
              carBuyList[index] = obj;
            });
          }
          $this.setData({
            carBuyList,
            carSellList,
            default_phone: data.QuotedPriceList.default_phone
          });
        } else {
          console.log('数据为空', resObj.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
  },

  //打电话
  makePhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  //支付保证金，收到砍价
  payMargin: function(e) {
    // wx.showLoading({
    //   title: '加载中',
    // })
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
            // wx.hideLoading()
            //发起支付
            wx.requestPayment({
              'timeStamp': timeStamp,
              'nonceStr': nonceStr,
              'package': pkg,
              'signType': 'MD5',
              'paySign': paySign,
              'success': function(res) {
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
                      that.request_price_list();
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'error'
                      });
                    }

                  });
                }
              },
              'fail': function(res) {
                console.log('用户取消支付,需要重载页面');

              },
              'complete': function(res) {

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
  payMarginMy: function(e) {
    // wx.showLoading({
    //   title: '加载中',
    // })
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
            // money: Number(e.detail.target.dataset.id.split('+')[1])  ,
            money: 0.01,
            user_type: e.detail.target.dataset.pay_type
          }


          payInfo.out_trade_no = payInfo.user_type + '_' + wx.getStorageSync("user_id") + '_' + payInfo.trading_models_id + '_' + payInfo.out_trade_no
          // console.log(payInfo);return;
          $http.post('store_margin_pay_other/marginPay', payInfo).then(res => {
            var timeStamp = (Date.parse(new Date()) / 1000).toString();
            var pkg = 'prepay_id=' + res.data.prepay_id;
            var nonceStr = res.data.nonce_str;
            var appid = res.data.appid;
            var key = res.data.key;
            var paySign = util.hexMD5('appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=" + key).toUpperCase(); //此处用到hexMD5插件 
            // wx.hideLoading()
            //发起支付
            wx.requestPayment({
              'timeStamp': timeStamp,
              'nonceStr': nonceStr,
              'package': pkg,
              'signType': 'MD5',
              'paySign': paySign,
              'success': function(res) {
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
                      that.request_price_list();
                    } else {
                      wx.showToast({
                        title: res.data.msg,
                        icon: 'error'
                      });
                    }

                  });
                }
              },
              'fail': function(res) {
                console.log('用户取消支付,需要重载页面');

              },
              'complete': function(res) {

              }
            });

          });
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //卖家确认发货 -收到的砍价
  sellerConfirmTheDelivery: function(e) {
    var eObj = e.detail.target.dataset;
    if (eObj.deal_status == 'click_the_deal' && eObj.buyer_payment_status == 'to_be_paid' && eObj.seller_payment_status == 'to_the_account') {
      wx.showModal({
        title: '提示',
        content: '买家还未支付保证金，您暂时还不能发货',
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#ef4631',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
      return false;
    }
    var that = this;
    var params = {
      formId: e.detail.formId,
      seller_payment_status: e.detail.target.dataset.seller_payment_status, //确认买家保证金到账
      trading_models_id: e.detail.target.dataset.id, //车辆交易id
      user_ids: e.detail.target.dataset.user_ids, //砍价人的id
      by_user_ids: e.detail.target.dataset.by_user_ids, //卖家的id
      quotationtime: e.detail.target.dataset.quotationtime
    }
    // console.log(params);return;
    $http.post('store_margin_pay/sellerConfirmTheDelivery', params).then(res => {
      if (res.data.code == 1) {
        wx.hideLoading();
        console.log(res);
        wx.showToast({
          title: res.data.msg,
          icon: 'success'
        });
        that.request_price_list();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'error'
        });
      }
    });


  },
  //卖家确认收货  --我的砍价
  buyersConfirmTheDeliveryMy: function(e) {
    wx.showLoading({
      title: '加载中',
    })

    console.log();
    var that = this;
    var params = {
      formId: e.detail.formId,
      // buyers_payment_status: e.detail.target.dataset.buyers_payment_status, //确认买家保证金到账
      trading_models_id: e.detail.target.dataset.id, //车辆交易id
      user_ids: e.detail.target.dataset.user_ids,
      by_user_ids: e.detail.target.dataset.by_user_ids, //卖家的id
      quotationtime: e.detail.target.dataset.quotationtime
    }

    
    $http.post('store_margin_pay_other/sellerConfirmTheDelivery', params).then(res => {
      if (res.data.code == 1) {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'success',
          duration: 2000
        });
        that.request_price_list();
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'clear'
        });
      }
    });


  },


  //取消订单
  cancelOrder: function(e) {
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
              if (res.data.data.code == 1) {
                wx.showToast({
                  title: res.data.data.msg,
                  image: 'success'
                });
                that.request_price_list();
              }
              else {
                wx.showToast({
                  title: res.data.data.msg,
                  image: '../../images/warn.png'
                });
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.request_price_list();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})