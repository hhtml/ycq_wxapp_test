// pages/mine/carFriend/carFriend.js
var $http = require('../../../utils/http.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getStorage({
      key: 'carFriendImg',
      success(res) {
        console.log(res.data)
        that.setData({
          imgUrls:res.data
        })
      }
    })
    this.getImg()
  },

  /**
   * 获取图片事件
   */
  getImg:function(){
    var that = this
    var imgUrls =[]
    $http.post('my/about_riders').then(res=>{
      console.log(res.data)
      var resObj = res.data
      if (resObj.code == 1){
        var imgsCut = resObj.data.about_riders.split(',') //切割字符串
        imgsCut.forEach((val, index) => {
          var obj = {
            imgUrl: app.globalData.imgUrl + val,
          }
          imgUrls[index] = obj;
        })
      }
      that.setData({
        imgUrls: imgUrls
      })
      wx.setStorage({
        key: 'carFriendImg',
        data: that.data.imgUrls
      })
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