// pages/mine/upgrade/upgrade.js
const app = getApp();
var $http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    store:[], //店铺数据详情
    partnerList:[], //合伙人级别
    appImgUrl: app.globalData.localImgUrl,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStore_list();
    this.getStore_level_list();
  },

  //获取店铺详情数据
  getStore_list:function(){
    var that = this
    $http.post('my/upgrade_shop').then(res=>{
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
  getStore_level_list:function(){
    var that = this
    $http.post('Shop/index').then(res=>{
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
    wx.showToast({
      title: '即将上线',
      image: '/images/warn.png'
    });
    return;
    var formId = e.detail.formId;
    var shop_level_id = this.data.shop_level_id;
    var form = this.data.form;
    var store = that.data.store
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
        cities_name: store.cities_name,
        store_address: store.store_address,
        store_description: store.store_description,
        phone: store.phone,
        // login_code: store.smscode,
        store_img: store.store_img,
        business_life: store.business_life,
        main_camp: store.main_camp,
        bank_card: store.bank_card,
        id_card_positive: store.id_card_images[0],
        id_card_opposite: store.id_card_images[1],
        business_licenseimages: store.business_licenseimages,
        level_id: that.data.shop_level_id,
        // code: store.inviteNumber,
        name: store.real_name
      }
      $http.post('shop/submit_audit', {
        submit_type: submit_type,
        auditInfo: auditInfo
      })
        .then(res => {
          //成功回调
          var resObj = res.data;
          console.log('表单提交：', resObj);
          if (resObj.code == 1) {
            var data = resObj.data;
            wx.showToast({
              title: resObj.msg,
              icon: 'success'
            });
            wx.navigateTo({
              url: '../order/order',
            })
          } else {
            wx.showToast({
              title: resObj.msg,
              image: '/images/warn.png'
            });
            console.log('请求失败：', resObj.msg);
          }
        }).catch(err => {
          //异常回调
          console.log('请求失败', err);
        });
    }
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