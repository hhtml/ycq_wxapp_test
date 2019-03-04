// pages/order/order.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeId:1,
    orderList:[
      {
        id:0,
        img:'',
        name:'sososo',
        price:'50000'
      },
      {
        id: 0,
        img: '',
        name: 'sososo',
        price: '50000'
      }
    ]
  },
  /***
   * 事件函数
   */
  switchTitle(e) {
    this.setData({
      activeId: e.currentTarget.dataset.id
    })
  }, 
  /***
   * 事件函数
   */
  request_order_list(){
    var $this=this;
    var toBePaidList=new Array();
    var paidList=new Array();
    $http.post('Shop/my_order')
      .then(res => {
        //成功回调
        //成功回调
        var resObj = res.data;
        console.log('订单列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var to_be_paid = data.to_be_paid;
          var paid_the_money = data.paid_the_money;
          if (to_be_paid){
            to_be_paid.forEach((val,index)=>{
                var obj={
                  id: val.id,
                  nickname: val.nickname,
                  avatar: val.avatar,
                  certification_fee: val.certification_fee,
                  can_pay: val.can_pay,
                  companystore_id: val.companystoreone.id,
                  companystore_level: val.companystoreone.level_id,
                  auditstatus: val.companystoreone.auditstatus,
                  can_upgrade: val.can_upgrade ? can_upgrade:''
                }
                toBePaidList[index]=obj;
            });
          }

          if (paid_the_money) {
            paid_the_money.forEach((val, index) => {
              var obj = {
                id: val.id,
                nickname: val.nickname,
                avatar: val.avatar,
                certification_fee: val.certification_fee,
                can_pay: val.can_pay,
                companystore_id: val.companystoreone.id,
                companystore_level: val.companystoreone.level_id,
                companystore_auditstatus: val.companystoreone.auditstatus,
                can_upgrade: val.can_upgrade ? can_upgrade : ''
              }
              paidList[index] = obj;
            });
          }
          $this.setData({
            toBePaidList,paidList
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
  //取消订单
  cancelOrder(e){
    var store_id=e.currentTarget.dataset.store;
    $http.post('shop/cancellation_order',{
      store_id: store_id
    }).then(res => {
        //成功回调
        //成功回调
        var resObj = res.data;
        console.log('取消订单：', resObj);
        if (resObj.code == 1) {
          wx.showToast({
            title: resObj.msg,
            icon: 'success'
          });
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
  //测试支付
  formSubmit(e) {

    console.log(e.detail.formId);

    console.log(e.detail.value);
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.request_order_list();
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