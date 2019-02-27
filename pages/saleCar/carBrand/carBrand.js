// pages/saleCar/carBrand/carBrand.js
const app = getApp();
var $http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carBrand:[],
    anchor:'', //锚点
    showModal:false, //遮罩层
    carIndex:'',
    carType:[], //具体车型列表
    marker: -1, //点击汽车名字显示红标记
    moveData: null, //动画
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCarTypeList()
  },

  //请求车辆品牌数据
  getCarTypeList: function () {
    var that = this
    $http.post('index/getBrandCates').then(res => {
      console.log(res)
      that.setData({
        carBrand:res.data.data.brandList
      })
      console.log(that.data.carBrand)
    })
  },

  //锚点点击事件
  selectAnchor:function(e){
    var that = this
    console.log(e)
    that.setData({
      anchor: e.target.id
    })
  },

  //选择车型事件
  selectCar:function(e){
    var that = this
    console.log(e.target.id)
    that.setData({
      showModal:true,
      carIndex:e.target.id.split('+')[0], 
      marker: e.target.id.split('+')[1]
    })
    // console.log(that.data.carBrand['A'].brand[0].series)
  },

  // 对外暴露出id事件
  selectIndex:function(e){
    var that = this
    console.log(e)
    console.log(e._relatedInfo.anchorTargetText)
    var carName = e._relatedInfo.anchorTargetText
    var carType = that.data.carBrand[e.currentTarget.id].brand[that.data.carIndex].series
    console.log(carType)
    carType.forEach((val,index) =>{ //汽车型号前面补全名字
      if(val.name.indexOf(carName) == -1){
        val.name = carName + val.name
      }
      
    })
    that.setData({
      carType: carType
    })
    var animation = wx.createAnimation({
      duration: 300,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translateX(-262).step({ duration: 500 })
    that.setData({ moveData: animation.export() })

    that.iconMove()
  },

  iconMove:function(){
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translateX(-246).step({ duration: 510 })
    that.setData({ iconMove: animation.export() })
  },

  qxiconMove:function(){
    var that = this
    var animation = wx.createAnimation({
      duration: 500,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translateX(246).step({ duration: 500 })
    that.setData({ iconMove: animation.export() })
  },

  //选择具体车型事件
  selectCarType:function(e){
    console.log(e)
    var carType = e.target.id
    app.globalData.carType = carType
    app.globalData.carBrand = carType
    wx.navigateBack({
      delta: 1
    })
  },

  // 关闭遮罩层
  closeModalDlg:function(){
    var that = this
    that.setData({
      showModal:false,
      marker:-1
    })
    var animation = wx.createAnimation({
      duration: 500,
      delay: 0,
      timingFunction: "ease",
    });

    animation.translateX(262).step({ duration: 500 })
    that.setData({ moveData: animation.export() })
    that.qxiconMove()
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