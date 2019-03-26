// pages/myWallet/myWallet.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record:false, //体现记录
    /*nickname:'',
    wallet:{
      total_earnings:2500,
      first_earnings:1300,
      second_earnings:1200
    },
    inviteList:[
      {
        id:0,
        img:'../../images/carsource_02.png',
        name:'李搜搜',
        num:30,
        money:9000
      },
      {
        id: 0,
        img: '../../images/carsource_02.png',
        name: '李搜搜',
        num: 30,
        money: 9000
      }
    ]*/
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var $this = this;
    var inviteList = new Array();
    $http.post('my/my_wallet')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('资讯列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data.data;
          var user = data.user;
          var wallet = data.mymoney;
          var earning_details = data.earning_details;
          $this.data.store_id = data.user.store_has_many.id
          if (earning_details) {
            earning_details.forEach((val, index) => {
              var obj = {
                id: val.store.user_id,
                img: val.user.avatar,
                name: val.user.nickname,
                num: val.second_count,
                money: val.second_moneycount,
                store_info: val.store
              }
              inviteList[index] = obj;
            });
          }
          $this.setData({
            user,
            wallet,
            inviteList
          })
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
  //提现
  nav_to_withdrawcash() {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    // console.log(typeof(that.data.wallet.total_earnings));
    // console.log(that.data.wallet.total_earnings);return

    if (that.data.wallet.available_balance < 100) {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '提现金额不能小于100元',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.hideLoading();

      wx.navigateTo({
        url: '../withdrawCash/withdrawCash',
      })
    }


  },
  //提现记录点击事件
  goRecord:function(){
    var that = this
    wx.navigateTo({
      url: './record/record?store_id=' + that.data.store_id
    })
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
    // this.onLoad();
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
    this.onLoad();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */

})