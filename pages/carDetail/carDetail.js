// pages/carDetail/carDetail.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenWidth: 0,
    msg:'还未认证,暂不能砍价',//向提示框组件中传入的参数
    screenHeight: 0,
    imgwidth: 0,
    imgheight: 0,
    statusBarHeight: app.globalData.statusBarHeight,
    showModal:false,
    car: {
      /*banner: '../../images/car-test_03.png',
      name: '2011款奥迪A6 2.0T自动舒适版',
      year:'2016',
      distance: '4.2',
      addr: '成都',
      price:'14.05-16'*/
    },
    detail_img_list: [
      //'../../images/car-test_03.png',
      //'../../images/car-test_03.png'
    ],
    form: {
      phone: '',
      price: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    }); 
    var carId = options.carId;
    var type = options.type;

    console.log('carId:' + carId + 'type:' + type);
    this.setData({
      carId,
      type
    });
    this.request_car_detail(carId, type);
  },
  imageLoad: function (e) {
    var _this = this;
    var $width = e.detail.width,    //获取图片真实宽度
      $height = e.detail.height,
      ratio = $width / $height;   //图片的真实宽高比例
    var viewWidth = 500,           //设置图片显示宽度，
      viewHeight = 500 / ratio;    //计算的高度值   
    this.setData({
      imgwidth: viewWidth,
      imgheight: viewHeight
    })
  } ,
  request_car_detail(carId, type) {
    var detail_img_list = new Array();
    var $this = this;
    var form = this.data.form;
    $http.post('common/car_details', {
      car_id: carId,
      type: type
    }).then(res => {
      //成功回调
      var resObj = res.data;
      console.log('车辆详情：', resObj);
      if (resObj.code == 1) {
        var data = resObj.data;
        var himgUrl; 
        if (data.detail.type == 'sell') {
          himgUrl = app.globalData.localImgUrl;
        } else {
          himgUrl = app.globalData.imgUrl;
        }
        // console.log(this.cut_str(data.detail.user.nickname, 6));
        var car = {
          id: data.detail.id,
          is_authentication: data.is_authentication,
          banner: himgUrl + (data.detail.brand.brand_default_images ? data.detail.brand.brand_default_images : data.detail.modelsimages[0]),
          brand_name: data.detail.brand.name,
          name: data.detail.models_name,
          year: data.detail.car_licensetime,
          distance: data.detail.kilometres,
          addr: data.detail.parkingposition,
          price: data.detail.guide_price,
          tel: data.detail.default.default_phone,
          store_id: data.detail.store_id,
          type: data.detail.type,
          isOffer: data.detail.isOffer,
          description: data.detail.store_description,
          userInfo: data.detail.publisher_user,
          emission_standard: data.detail.emission_standard,
          // nickname =  $this.cutStr(data.detail.user.nickname, 6),
          createtime: data.detail.createtime,
          default: data.detail.default,
          defaultUrl: app.globalData.imgUrl,
          can_quote: data.can_quote,
          user:data.detail.user
        }
        form.phone = data.detail.user.mobile;
        var detailImages = data.detail.modelsimages;
        if (detailImages) {
          detailImages.forEach((val, index) => {
            detail_img_list[index] = himgUrl + val;
          });
        }
        $this.setData({
          car: car,
          form: form,
          detail_img_list: detail_img_list
        })
      } else {
        console.log('请求失败：', data.msg);
      }
    }).catch(err => {
      //异常回调
      console.log('请求失败', err);
    });
  },
  nav_to_shop() {
    wx.showToast({
      title: '敬请期待',
      image: '../../images/warn.png'
    })
    /**var shopId = this.data.car.store_id;
    wx.navigateTo({
      url: '../myShop/myShop?shopId='+shopId,
    })*/
  },

  //点击砍价事件
  priceLog() {
    var that = this
    var isOffer = that.data.car.isOffer;
    var is_authentication = that.data.car.can_quote.is_authentication
    var user = that.data.car.user
    wx.getStorage({
      key: 'user_id',
      success(res) {
        var user_id = res.data
        if (user_id == user.id){
          wx.showToast({
            title: '不能给自己报价',
            image: '../../images/warn.png'
          })
        }else {
          if (is_authentication == 1) { //未认证
            that.setData({
              msg: that.data.car.can_quote.msg,
              showModal: true
            })
          } else if (is_authentication == 2) { //未完成认证
            that.setData({
              msg: that.data.car.can_quote.msg,
              showModal2: true
            })
          } else { //已完成认证
            if (isOffer == 1) {
              wx.showToast({
                title: '您已报过价',
                image: '../../images/warn.png'
              })
            } else {
              this.setData({
                priceLogShow: true
              })
            }
          }
        }
      }
    })
  },
  closeLog() {
    this.setData({
      priceLogShow: false
    })
  },

  //模态框点击事件
  sureClick: function () {
    var that = this
    that.setData({
      showModal2: false
    })
  },


  //点击电话联系事件
  makePhoneCall() {
    var tel = '028 - 84167417';
    wx.makePhoneCall({
      phoneNumber: tel // 仅为示例，并非真实的电话号码
    })
  },
  cleanForm() {
    var form = this.data.form;
    for (var item in form) {
      form[item] = '';
    }
    this.setData({
      form: form
    })
  },
  phoneInput(e) {
    var form = this.data.form;
    form.phone = e.detail.value;
    this.setData({
      form: form
    })
  },
  priceInput(e) {
    var form = this.data.form;
    form.price = e.detail.value;
    this.setData({
      form: form
    })
  },
  priceSubmit(e) {
    var formId = e.detail.formId;
    var form = this.data.form;
    var car = this.data.car;
    var $this = this;
    if (!form.price || !form.phone) {
      wx.showToast({
        title: '信息填写完整',
        image: '../../images/warn.png'
      });
    } else if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(form.phone))) {
      wx.showToast({
        title: '手机号有误',
        image: '../../images/warn.png'
      });

    } else {
      $http.post('wechat/sendOffer', {
          money: form.price,
          phone: form.phone,
          models_id: car.id,
          type: car.type
        })
        .then(res => {
          //成功回调
          var resObj = res.data;
          console.log('报价：', resObj);
          if (resObj.code == 1) {
            wx.showToast({
              title: resObj.msg
            });
            $this.cleanForm();
            car.isOffer = 1;
            $this.setData({
              priceLogShow: false,
              car: car
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
    }

  },
  /* 截取字符串，多余的以省略号代替 */
  cut_str:function(str, len) {
    var str_length = 0;
    var str_len = 0;
    str_cut = new String();
    str_len = str.length;
    for (var i = 0; i < str_len; i++) {
      a = str.charAt(i);
      str_length++;

      //中文字符，长度累加
      if (escape(a).length > 4) {
        str_length++;
      }
      str_cut = str_cut.concat(a);

      if (str_length >= len) {
        str_cut = str_cut.concat("...");
        return str_cut;
      }
    }
    if (str_length < len) {
      return str;
    }
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
    var carId = this.data.carId;
    var type = this.data.type;
    this.request_car_detail(carId, type);
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
    var car = this.data.car;
    var carId = this.data.carId;
    var type = this.data.type;
    return {
      title: car.name,
      path: '/pages/carDetail/carDetail?carId=' + carId + '&type=' + type
    }
  },
  
  //自定义nav返回主页事件
  goHome:function(){
    wx.switchTab({
      url: '/pages/index/index'
    })
  }
})