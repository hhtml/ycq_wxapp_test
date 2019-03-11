// pages/mine/upgrade/upgrade.js
const app = getApp();
var $http = require('../../../utils/http.js');
var util = require('../../../utils/md5.js') // 引入md5.js文件
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: [], //店铺数据详情
    partnerList: [], //合伙人级别
    appImgUrl: app.globalData.localImgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getStore_list();
    this.getStore_level_list();
  },

  //获取店铺详情数据
  getStore_list: function() {
    var that = this
    $http.post('my/upgrade_shop').then(res => {
      var store = res.data.data
      store.id_card_images = store.id_card_images.split(',')
      store.main_camp = store.main_camp.split(',')
      that.setData({
        store: store
      })
      console.log(that.data.store)
    })
  },
  //获取合伙人级别数据
  getStore_level_list: function() {
    var that = this
    $http.post('Shop/index').then(res => {
      that.data.submit_type = res.data.data.submit_type
      that.setData({
        partnerList: res.data.data.store_level_list
      })
    })
  },

  // 选择合伙人级别
  partnerChange(e) {
    var index = e.currentTarget.dataset.index;
    var check = e.detail.value;
    var partnerList = this.data.partnerList;
    var shop_level_id;
    //console.log('index:', partnerList[index].checked);
    //console.log('check:', check)
    if (check) {
      for (var i = 0; i < partnerList.length; i++) {
        partnerList[i].checked = false;
      }
      partnerList[index].checked = true;
      shop_level_id = partnerList[index].id;
    } else {
      for (var i = 0; i < partnerList.length; i++) {
        partnerList[i].checked = false;
      }
    }
    console.log('shop_level_id:', shop_level_id)
    this.setData({
      partnerList: partnerList,
      shop_level_id: shop_level_id
    })
  },

  // form表单数据提交
  formSubmit(e) { 
 
    var that = this
    // wx.showToast({
    //   title: '即将上线',
    //   image: '/images/warn.png'
    // });
    // return;
    var formId = e.detail.formId;
    var shop_level_id = this.data.shop_level_id;
    var form = this.data.form;
    var store = that.data.store
    var store_id = e.detail.target.dataset.store_id;
    if (!that.data.shop_level_id) {
      wx.showToast({
        title: '请选择合伙人级别',
        image: '/images/warn.png'
      })
    } else {
      // console.log("formId,checkBrandStr:", formId, checkBrandStr);
      var submit_type = this.data.submit_type;
      var auditInfo = {
        store_name: store.store_name,
        store_id: store_id,
        out_trade_no: new Date().getTime(),
        up_level_id: that.data.shop_level_id,
        formId: e.detail.formId,
        base_level_id: store.level_id
      }
      auditInfo.out_trade_no = wx.getStorageSync("user_id") + '_' + auditInfo.store_id + '_' + auditInfo.out_trade_no;

      $http.post('store_up_pay/upShop', auditInfo)
        .then(res => {
          var timeStamp = (Date.parse(new Date()) / 1000).toString();
          var pkg = 'prepay_id=' + res.data.prepay_id;
          var nonceStr = res.data.nonce_str;
          var appid = res.data.appid;
          var key = res.data.key;
          var paySign = util.hexMD5('appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=" + key).toUpperCase(); //此处用到hexMD5插件 
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
                $http.post('store_up_pay/after_successful_payment', auditInfo).then(res => {
                  console.log(res);

                  if(res.data.code==1){
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'success',
                      duration: 2000,
                      success: function (res) {
                        wx.navigateBack({
                          delta: 1
                        })
                      }

                    })
                  }
                  else{
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


        }).catch(err => {
          //异常回调
          console.log('请求失败', err);
        });
    }
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