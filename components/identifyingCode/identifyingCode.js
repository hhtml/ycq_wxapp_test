// components/identifyingCode.js
const app = getApp();
var $http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sentSms:false,
    phone:'',
    dtNUm: 60,
    smscode:''
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //获取短信验证码
    get_sms_code: function () {
      var telInput = this.data.phone;
      if (!telInput) {
        wx.showToast({
          title: '请先填写手机号',
          image: '/images/warn.png',
          duration: 2000
        });
      } else {
        var dtNUm = this.data.dtNUm;
        var that = this;
        $http.post('index/sendMessage', {
          'mobile': telInput
        })
          .then(res => {
            //成功回调
            var data = res.data;
            if (data.code == 1) {
              console.log(data);
              that.setData({
                sentSms: true
              });
              /*****************定时器 ****/
              var timer = setInterval(function () {
                timeclock();
              }, 1000);

              function timeclock() {
                if (dtNUm == 0) {
                  clearInterval(timer);
                  that.setData({
                    sentSms: false,
                    dtNUm: 60
                  })
                  return;
                } else {
                  dtNUm--;
                  that.setData({
                    dtNUm: dtNUm
                  });
                  console.log('dtNUm', dtNUm)
                  return dtNUm;
                }
              }
              console.log('timeclock', timeclock())


            } else {
              wx.showToast({
                title: data.msg,
                image: '../../images/warn.png',
                duration: 2000
              });
              that.setData({
                sentSms: false
              });
            }
          }).catch(err => {
            //异常回调
            console.log('请求失败');
          });

      }

    },

    // 关闭验证手机号输入框
    closeLog:function(e) {
      var that = this
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 1];  //当前页面
      prevPage.setData({
        phoneLogShow: false
      })
    },

    // 手机号码输入框
    phoneInput:function(e){
      this.setData({
        phone: e.detail.value
      })
    },

    // 验证码输入框
    bindMsglInput(e) {
      this.setData({
        smscode: e.detail.value
      })
    },

    // 点击提交事件
    phoneAuth() {
      var phone = this.data.phone;
      var smscode = this.data.smscode;
      var $this = this;
      if(!/^1(3|4|5|6|7|8)\d{9}$/.test(phone)){
        wx.showToast({
          title: '手机号格式错误',
          image: '../../images/warn.png'
        })
      } else if (smscode == ''){
        wx.showToast({
          title: '请填写验证码',
          image: '../../images/warn.png'
        })
      }else{
        $http.post('index/clickAppointment', {
          mobile: phone,
          code: smscode
        })
          .then(res => {
            //成功回调
            var resObj = res.data;
            console.log('验证：', resObj);
            if (resObj.code == 1) {
              wx.showToast({
                title: '验证成功',
              });
              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 1];  //当前页面
              prevPage.setData({
                phoneLogShow: false,
                phone: phone
              })
            } else {
              $this.setData({
                smscode: '',
              })
              wx.showToast({
                title: resObj.msg,
                image: '../../images/warn.png'
              })
              console.log('请求失败：', data.msg);
            }
          }).catch(err => {
            //异常回调
            console.log('请求失败', err);
          });
      }
    },


  }
})
