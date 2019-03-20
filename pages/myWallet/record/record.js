// pages/myWallet/record/record.js
var $http = require('../../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordList:[], //提现记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.getRocordList(options.store_id)
  },

  //请求提现记录数据
  getRocordList: function (store_id){
    var that = this
    var recordList = []
    $http.post('my/withdrawals_record',{
      store_id: store_id
    }).then(res=>{
      console.log(res)
      var resObj = res.data
      if (resObj.code == 1){
        //请求成功
        var data = resObj.data
        var record = data.record
        if (record){
          record.forEach((val,index)=>{
            var obj = {
              id:val.id,
              bankname: val.bank_info.bankname,
              createtime: val.createtime,
              status: val.status,
              bank_card: val.store.bank_card,
              withdrawal_amount: val.withdrawal_amount
            }
            recordList[index] = obj;
          })
        }
        that.setData({
          recordList
        })
      }else{
        //请求失败
        wx.showToast({
          title: resObj.msg,
          image: '../../../images/warn.png'
        });
        console.log('请求失败：', resObj.msg);
      }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
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