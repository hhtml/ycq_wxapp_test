// pages/mine/news/news.js

const app = getApp();
var $http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[], //消息列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getNewsData()
  },


  // 请求消息列表数据
  getNewsData:function(){
    var that = this
    $http.post('my/message_details',{
      isRead:1
    }).then(res=>{
      console.log(res)
      var resObj = res.data
      if (resObj.code == 1){ //请求成功
        var newsList = resObj.data.message_details
        newsList.forEach(item => { //将时间戳转换成日期格式
          var date = new Date(item.createtime*1000);
          var Y = date.getFullYear() + '年';
          var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
          var D = date.getDate();
          D = D<10?'0'+D+ '日'+' ':D+ '日'+' '
          var h = date.getHours();
          h = h < 10 ? '0' + h + ':' : h + ':'
          var m = date.getMinutes();
          m = m < 10 ? '0' + m : m
          item.createtime =Y + M + D + h + m
          item.content = that.formatRichText(item.content) //富文本解析 修改图片自适应样式
        })
        that.setData({
          newsList: newsList
        })
      }else{
        console.log('请求失败:' + resObj.msg)
      }
    })
  },


  formatRichText: function (html) { //富文本解析 修改图片自适应样式
    let newContent = html.replace(/<img[^>]*>/gi, function (match, capture) {
      match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
      match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
      match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
      return match;
    });
    newContent = newContent.replace(/style="[^"]+"/gi, function (match, capture) {
      match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
      return match;
    });
      newContent = newContent.replace(/<br[^>]*\/>/gi, '');
      newContent = newContent.replace(/\<img/gi, '<img style="width:100%;height:auto;display:block;margin-top:0px;margin-bottom:0;"');
    return newContent;
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