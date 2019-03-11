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
    titleList: [{
        id: 0,
        name: '推荐'
      },
      {
        id: 1,
        name: '成都'
      },
      {
        id: 2,
        name: '军事'
      },
      {
        id: 3,
        name: '社会'
      },
      {
        id: 4,
        name: '娱乐'
      },
      {
        id: 5,
        name: '体育'
      },
      {
        id: 6,
        name: '其他'
      }
    ],
    infoList: [{
      id:0,
      imgSrc: '../../images/carsource_02.png',
      title: '平台上线100天，平台总人数正式突破10万大关突破10万大关',
      author: '萌宠部落',
      browse_volume: 300
    }]
  },
  /**
   * 事件3函数
   */
  changeTitle(e) {
    var titleId = e.currentTarget.dataset.id;
    this.setData({
      activeTitle: titleId
    })
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
    $http.post('index/information_list')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('资讯列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var info_list = data.info_list;
          if (info_list) {
            info_list.forEach((val,index)=>{
                var obj={
                  id: val.id,
                  imgSrc: '../../images/carsource_02.png',
                  title: val.title,
                  author: val.author,
                  browse_volume: val.browse_volume
                }
                infoList[index]=obj;
                $this.setData({ infoList});
            });
            
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