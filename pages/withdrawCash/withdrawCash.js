// pages/withdrawCash/withdrawCash.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bank:{
      img:'../../images/carsource_02.png',
      name:'中国建设银行',
      lastnum:'2345',
      cardtype:'储蓄卡'

    }
  },
  /**
   * 事件函数
   */
  request_bank(){
    var $this = this;
    var bank;
    $http.post('shop/cash_withdrawal')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('资讯列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data.data;
          var total_money = data.total_money;
          var bank_info = data.bank_info;
          if (bank_info) {
           bank={
              id: bank_info.id,
              img: bank_info.banklogo,
              name: bank_info.bankname,
              lastnum: bank_info.last_number,
              cardtype: bank_info.cardtype
            }
          }
          $this.setData({ total_money, bank})
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
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request_bank();
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