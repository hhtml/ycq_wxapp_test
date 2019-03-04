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
    form: {
      // carType: '',
      carRegion: '',
      price: '',
      phone: '',
      description: '',
      displacementUnit: 'L',
      displacement: '',
      productDate: '',
      transmissionData: '', //变速箱
    },
    phoneLogShow:false,
    dtNUm: 60,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取短信验证码
    get_sms_code: function () {
      var telInput = this.data.form.phone;
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
    closeLog:function() {
      var that = this
      console.log(1)
      that.setData({
        phoneLogShow: false
      })
    },
    phoneInput:function(e){
      var form = this.data.form;
      form.phone = e.detail.value;
      this.setData({
        form: form
      })
    },
    phoneAuth() {
      var form = this.data.form;
      var phone = form.phone;
      var smscode = this.data.smscode;
      var $this = this;
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
            $this.setData({
              phoneLogShow: false
            })
          } else {
            form.phone = '';
            $this.setData({
              form: form,
              phoneLogShow: false
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
    },

    
  }
})
