// pages/withdrawCash/withdrawCash.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /*bank:{
      img:'../../images/carsource_02.png',
      name:'中国建设银行',
      lastnum:'2345',
      cardtype:'储蓄卡'

    }*/
    rateMoney: 0
  },
  /**
   * 事件函数
   */
  request_bank() {
    var $this = this;
    var bank;
    $http.post('shop/cash_withdrawal')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('资讯列表：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var total_money = data.total_money ? data.total_money.toFixed(2) : '0';
          var rate = data.presentation_rate ? data.presentation_rate : '100';
          var bank_info = data.bank_info;
          if (bank_info) {
            bank = {
              id: bank_info.id,
              img: bank_info.banklogo,
              name: bank_info.bankname,
              lastnum: bank_info.last_number,
              cardtype: bank_info.cardtype
            }
          }
          $this.setData({
            total_money,
            bank,
            rate
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
  moneyInput(e) {
    var money;
    if (/^(\d?)+(\.\d{0,2})?$/.test(e.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      money = e.detail.value;
    } else {
      money = e.detail.value.substring(0, e.detail.value.length - 1);
    }
    var rate = this.data.rate * 100;
    var rateMoney = (money * (rate / 100)).toFixed(2);
    this.setData({
      money: money,
      rateMoney: rateMoney
    })
  },
  allWithdraw() {
    var money = this.data.total_money;
    var rate = this.data.rate;
    var rateMoney = (money * rate).toFixed(2);
    this.setData({
      money: money,
      rateMoney: rateMoney
    })
  },
  //确认提现
  withdrawSubmit(e) {
    var that = this
    var formId = e.detail.formId;
    var money = this.data.money;
    var rateMoney = this.data.rateMoney;
    var total_money = this.data.total_money;
    var $this = this;
    if (!money) {
      wx.showToast({
        title: '请输入提现金额',
        image: '../../images/warn.png',
        duration: 2000
      })
    } else if (money > total_money) {
      wx.showToast({
        title: '已超过可提金额',
        image: '../../images/warn.png',
        duration: 2000
      })
    } else if (money < 100) {
      wx.showToast({
        title: '不能低于100元',
        image: '../../images/warn.png',
        duration: 2000
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您确认要提现' + money + '元到银行卡吗？本次提现收取服务费' + rateMoney + '元',
        confirmText: '确认提现',
        success(res) {
          if (res.confirm) {
            //确认提现 
            $http.post('shop/check_money', {
                formId: formId,
                money: money
              })
              .then(res => {
                //成功回调
                var resObj = res.data;
                console.log('核对提现：', resObj);
                console.log(money)
                if (resObj.code == 1) {
                  //确认提现
                  wx.showToast({
                    title: '提现处理中',
                    icon: 'success',
                    duration: 1000
                  })
                  that.setData({
                    total_money: (that.data.total_money - that.data.money).toFixed(2),
                    money: '',
                  })
                  // $this.request_bank();

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
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }

      })

    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.request_bank();
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


})