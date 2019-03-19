// pages/infomation/infomation.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scroll_x: true,
    activeTitle: 0,
    titleList: [
      /*{
        id: 0,
        name: '推荐'
      },
      {
        tid: 1,
        name: '成都'
      },
      {
        tid: 2,
        name: '军事'
      },
      {
        tid: 3,
        name: '社会'
      }*/
    ],
    infoList: []
  },
  /**
   * 事件3函数
   */
  changeTitle(e) {
    var titleId = e.currentTarget.dataset.id;
    var currentInfoList = this.searchCurrent(titleId);
    this.setData({
      currentInfoList: currentInfoList,
      activeTitle: titleId
    })
  },
  searchCurrent(titleId){
    var infoList=this.data.infoList;
    for (var i = 0; i < infoList.length; i++){
      if (infoList[i].tid == titleId){
        return infoList[i].arr;
      } 
    }
  },
  nav_to_detail(e){
    var id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../infomationDetail/infomationDetail?id='+id,
    })
  },
  request_info_list() {
    var $this = this;
    var infoList=new Array();
    var titleList=new Array();
    $http.post('index/information_list')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('资讯列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var information = data.information;
          if (information) {
            information.forEach((val,index)=>{
              var titleObj={
                tid:val.id,
                title: val.categories_name
              };
              var automotive = val.automotive;
              var arr = new Array();
              if (automotive){
                automotive.forEach((el,i)=>{
                  var obj = {
                    id: el.id,
                    imgSrc: app.globalData.imgUrl + el.coverimage,
                    title: el.title,
                    author: el.author,
                    browse_volume: el.browse_volume
                  }
                  arr[i]=obj;
                });
              }
              var infoObj={
                tid:val.id,
                arr:arr
              }
                
              infoList[index] = infoObj;
              titleList[index] = titleObj;
              
            });
            console.log('infoList：', infoList);
            console.log('titleList', titleList);
            var currentInfoList=infoList[0].arr;
            var activeTitle = titleList[0].tid;
            $this.setData({ infoList, titleList, activeTitle, currentInfoList });
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
  onLoad: function(options) {
    this.request_info_list();
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