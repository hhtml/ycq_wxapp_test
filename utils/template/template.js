const app = getApp();
var $http = require('../../utils/http.js');

//获取短信验证码
function get_sms_code () {
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

}