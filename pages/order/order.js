// pages/order/order.js
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/md5.js') // 引入md5.js文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeId: 0,
    completeList: []
  },
  /***
   * 事件函数
   */
  switchTitle(e) {
    this.setData({
      activeId: e.currentTarget.dataset.id
    })
  },
  /***
   * 事件函数
   */
  request_order_list() {
    var $this = this;
    var toBePaidList = new Array();
    var paidList = new Array();
    $http.post('Shop/my_order')
      .then(res => {

        //成功回调
        var resObj = res.data;
        console.log('订单列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var to_be_paid = data.to_be_paid;
          var paid_the_money = data.paid_the_money;
          if (to_be_paid) {
            to_be_paid.forEach((val, index) => {
              console.log(val.companystoreone.auditstatus);
              var obj = {
                id: val.id,
                nickname: val.companystoreone.store_name,
                avatar: val.avatar,
                certification_fee: val.certification_fee,
                can_pay: val.can_pay,
                companystore_id: val.companystoreone.id,
                companystore_level: val.companystoreone.level_id,
                auditstatus: val.companystoreone.auditstatus,
                can_upgrade: val.can_upgrade ? val.can_upgrade : '',
                level_name: val.level_name,
                createtime: val.companystoreone.createtime
              }
              toBePaidList[index] = obj;
            });
          }

          if (paid_the_money) {
            paid_the_money.forEach((val, index) => {
              if (val.company_store) { 
                var obj = {
                  id: val.id,
                  nickname: val.company_store.store_name,
                  avatar: val.user.avatar,
                  certification_fee: val.level?val.level.money:'',
                  can_pay: val.can_pay,
                  companystore_id: val.company_store.id,
                  companystore_level: val.level,
                  companystore_auditstatus: val.company_store.auditstatus,
                  can_upgrade: val.can_upgrade ? val.can_upgrade : '',
                  companystoreone: val.company_store,
                  payment_time: val.time_end,
                  partner_rank: val.level ? val.level.partner_rank:'',
                  level_id: val.level ? val.level.id:'',
                  pay_type: val.pay_type,
                  models_name: val.models_name,
                  total_fee: val.total_fee
                }
                paidList[index] = obj;
              }
             
            });
          }
          $this.setData({
            toBePaidList: toBePaidList,
            paidList: paidList
          })
        } else {
          wx.showToast({
            title: resObj.msg,
            image: '../../images/warn.png'
          });
          console.log('请求失败：', resObj.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('异常回调', err);
      });

  },
  //取消订单
  cancelOrder(e) {
    var $this = this;
    var store_id = e.currentTarget.dataset.store;
    wx.showModal({
      title: '提示',
      content: '确定删除该订单？',
      success(res) {
        if (res.confirm) {
          $http.post('shop/cancellation_order', {
            store_id: store_id
          }).then(res => {
            //成功回调
            var resObj = res.data;
            console.log('取消订单：', resObj);
            if (resObj.code == 1) {
              wx.showToast({
                title: resObj.msg,
                icon: 'success'
              });
              //重新加载列表刷新
              $this.request_order_list();
            } else {
              wx.showToast({
                title: resObj.msg,
                image: '../../images/warn.png'
              });
              console.log('请求失败：', resObj.msg);
            }
          }).catch(err => {
            //异常回调
            console.log('请求失败', err);
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }

    })

  },
  //去支付点击事件
  payOrder: function(e) {
    wx.showLoading({
      title: '加载中',
    })
    var $this = this;
    // var money = e.target.id.split('+')[0]
    var money = 0.01;
    var store_id = e.target.id.split('+')[1]
    var payInfo = {
      formId: e.detail.formId,
      out_trade_no: new Date().getTime(),
      money: money,
      store_id: store_id
    }

    payInfo.out_trade_no = wx.getStorageSync("user_id") + '_' + payInfo.store_id + '_' + payInfo.out_trade_no

    $http.post('store_certification_pay/certification_wxPay', payInfo).then(res => {
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
        'success': function(res) {
          if (res.errMsg == "requestPayment:ok") {


            //推送模板消息回调 
            console.log(res);
            $http.post('store_certification_pay/after_successful_payment', payInfo).then(res => {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '支付成功！',
                  icon: 'success',
                  duration: 2000,
                  success: function(res) {
                    wx.navigateBack({
                      delta: 1
                    })
                  }

                })

              } else {
                wx.showToast({
                  title: res.data.msg,
                  image: '../../images/warn.png',
                  duration: 500
                })
              }
            });
          }
        },
        'fail': function(res) {
          console.log('用户取消支付,需要重载页面');

        },
        'complete': function(res) {
          // console.log(res)
        }
      });

    });
  },
  //测试支付
  formSubmit(e) {

    console.log(e.detail.formId);

    console.log(e.detail.value);
  },

  //店铺升级
  upgradeOrder: function() {
    wx.navigateTo({
      url: '../mine/upgrade/upgrade'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.request_order_list();
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
    this.request_order_list();
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