// pages/infomationDetail/infomationDetail.js
const app = getApp();
var $http = require('../../utils/http.js');
var WxParse = require('../../utils/wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    artical:{
      title:"平台上线100天，平台总人数正式突破10万大关突破10万大关",
      coverImg:'../../images/carsource_02.png',
      person:'李搜搜',
      time:'2019-03-09'
    }
  },
  /**
   * 事件函数
   */
  request_detail(id){
    var $this=this;
    $http.post('index/information_details',{
      information_id:id
    })
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('资讯详情：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          if (data.detail){
            var artical = {
              id:data.detail.id,
              title: data.detail.title,
              coverImg:app.globalData.imgUrl+ data.detail.coverimage,
              author: data.detail.author,
              time: data.detail.createtime,
              browse_volume: data.detail.browse_volume,
            }
            var articalCont = data.detail.content;
            $this.setData({artical});
            //使用wxParse解析富文本
            WxParse.wxParse('articalCont', 'html', articalCont, $this, 0);
            
          }
           
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
    var id=options.id;
    this.request_detail(id);
    
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
    var id = this.data.artical.id;
    return {
      path: '/pages/infomationDetail/infomationDetail?id=' + id
    }
  }
})