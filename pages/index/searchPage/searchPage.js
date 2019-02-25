// pages/index/searchPage/searchPage.js
var models_name;
var history = [];
var $http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:'', //输入框value值
    searchList:[], //搜索结果
    focus:true,
    isHistory:false,
    history:[],
    noData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHistoryData()
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

  },

  //输入框搜索事件
  search:function(e){
    var that = this
    console.log(e.detail.value)
    if (e.detail.value){
      that.setData({
        isHistory:false
      })
      
    }else{
      that.setData({
        isHistory: true,
        noData: false,
        searchList:''
      })
    }
    $http.post('index/search',{
      query_criteria: e.detail.value
    }).then(res=>{
      console.log(res.data)
        if (res.data.data.buy.length == 0 && res.data.data.sell.length == 0){
          that.setData({
            noData:true
          })
        }else{
          that.setData({
            searchList: res.data.data,
            noData: false
          })
        }
    })
  },

  //点击X取消输入框内容事件
  close:function(){
    var that = this
    that.setData({
      inputValue:'',
      searchList:'',
      noData:false
    })
  },

  //取消事件
  cancel:function(){
    var that = this
    wx.switchTab({
      url: '/pages/index/index'
    })
  },
  //选择买车事件
  selectBuyCar:function(e){
    console.log(e)
    models_name = e._relatedInfo.anchorTargetText
    history.push(e._relatedInfo.anchorTargetText)
    wx.setStorage({
      key: 'history',
      data: history
    })
    wx.reLaunch({
      url: '/pages/carSource/carSource?models_name=' + models_name
    })
  },

  //选择卖车事件
  selectSellCar:function(e){
    models_name = e._relatedInfo.anchorTargetText
    history.push(e._relatedInfo.anchorTargetText)
    wx.setStorage({
      key: 'history',
      data: history
    })
    wx.reLaunch({
      url: '/pages/carSource/carSource?models_name=' + models_name
    })
  },

  //买车 车名点击事件
  buyCarName:function(e){
    console.log(e)
  },


  //买车 车名点击事件
  sellCarName: function (e) {
    var name = e._relatedInfo.anchorTargetText
    wx.reLaunch({
      url: '/pages/carSource/carSource?name=' + name
    })
  },

  //卖车 车名点击事件
  sellCarName: function (e) {
    var name = e._relatedInfo.anchorTargetText
    wx.reLaunch({
      url: '/pages/carSource/carSource?name=' + name
    })
  },

  //获取历史记录缓存事件
  getHistoryData:function(){
    var that = this
    wx.getStorage({
      key: 'history',
      success(res) {
        console.log(res)
        history = res.data
        that.setData({
          history: history,
          isHistory:true
        })
      }
    })
  },

  //清除历史记录缓存事件
  clearHistory:function(){
    var that = this
    wx.clearStorageSync('history')
    that.setData({
      history:''
    })
  },

  //点击历史记录搜索事件
  searchHistory:function(e){
    var that = this
    that.setData({
      inputValue:e._relatedInfo.anchorTargetText
    })
    $http.post('index/search', {
      query_criteria: e._relatedInfo.anchorTargetText
    }).then(res => {
      console.log(res.data)
      if (res.data.data.buy.length == 0 && res.data.data.sell.length == 0) {
        that.setData({
          noData: true
        })
      } else {
        that.setData({
          searchList: res.data.data,
          noData: false
        })
      }
      })
  }

})