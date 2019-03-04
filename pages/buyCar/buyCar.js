// pages/buyCar/buyCar.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    year:'',
    form: {
      // carType: '',
      carRegion: '',
      price: '',
      phone: '',
      description: '',
      displacementUnit:'L',
      displacement:'',
      productDate:'',
      transmissionData: '', //变速箱
    },
    transmission: [], //变速箱
    radioArray: [
      { name: 'L', checked: 'true' },
      { name: 'T' }
    ],
    dtNUm: 60,
  },
  // typeInput(e) {
  //   var form = this.data.form;
  //   form.carType = e.detail.value;
  //   this.setData({
  //     form: form
  //   })
  // },
  priceInput(e) {
    var form = this.data.form;
    form.price = e.detail.value;
    this.setData({
      form: form
    })
  },
  distanceInput(e) {
    var form = this.data.form;
    form.distance = e.detail.value;
    this.setData({
      form: form
    })
  },
  carRegionChange(e) {
    var form = this.data.form;
    form.carRegion = e.detail.value[0] + ' ' + e.detail.value[1];
    this.setData({
      form: form
    })
  },
  descriptionInput(e) {
    var form = this.data.form;
    form.description = e.detail.value;
    this.setData({
      form: form
    })
  },
  displacementInput(e) {
    var form = this.data.form;
    form.displacement = e.detail.value
    this.setData({
      form: form
    })
  },
  radioChange(e) { 
    this.data.form.displacementUnit = e.detail.value
    this.setData({
      displacementUnit: this.data.form.displacementUnit
    })
    console.log(e.detail.value)
  },
  productDateChange(e){
    var form = this.data.form
    form.productDate = e.detail.value
    this.setData({
    form: form
  })
  },
  transmissionDataChange(e) {
    var index = e.detail.value
    var form = this.data.form
    form.transmissionData = this.data.transmission[index]
    this.setData({
      form: form
    })
  },
  //获取当前年份
  getYear: function () {
    var that = this
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate()
    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    console.log(year + '-' + month + '-' + day)
    that.setData({
      year: year + '-' + month + '-' + day
    })
  },
  /**
   * 品牌相关
   */
  request_brand() {
    var $this = this;
    var zimuList = new Array();
    var brandsList = new Array();
    var form = this.data.form;
    $http.post('index/brandCates')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('品牌数据：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var brandList = data.brand;
          var transmission = new Array()
          var defaultTransmission = '';
          for (var i in resObj.data.transmission) {
            transmission.push(resObj.data.transmission[i]);
          }
          console.log(defaultTransmission)
          $this.setData({
            transmission: transmission,
          })
          $this.data.form.transmissionData = transmission[0]
          form.phone = data.mobile;
          for (var item in brandList) {
            //console.log('item:',item);
            var brands = new Array();
            var obj = {
              zimu: item,
              name: item
            }

            brandList[item].forEach((val, index) => {
              var sobj = {
                id: val.id,
                name: val.name
              }
              brands[index] = sobj;
            });
            var obj2 = {
              zimu: item,
              brands: brands
            }
            zimuList.push(obj);
            brandsList.push(obj2);
          }
          // var brandInfo = [zimuList, brandsList[0].brands];
          console.log('zimuList:', zimuList);
          console.log('brandsList:', brandsList);
          // console.log('brandInfo:', brandInfo);
          $this.setData({
            zimuList,
            brandsList,
            // brandInfo,
            form
          })

        } else {
          console.log('请求失败：', resObj.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
  },
  // bindPickerColumnChange(e) {
  //   console.log('(e.detail.column:', e.detail.column)
  //   var zimuList = this.data.zimuList;
  //   if (e.detail.column == 0) {
  //     var brands = this.getCitysByIndex(e.detail.value);
  //     this.setData({
  //       brandInfo: [zimuList, brands]
  //     })
  //   }
  // },
  // bindPickerChange(e) {
  //   console.log(e.detail.value);
  //   var brandList = this.getCitysByIndex(e.detail.value[0]);
  //   var brand_id = brandList[e.detail.value[1]].id;
  //   var brand_name = brandList[e.detail.value[1]].name;
  //   console.log('brand_id:', brand_name);
  //   var brand = {
  //     id: brand_id,
  //     name: brand_name
  //   }
  //   this.setData({
  //     brand
  //   })

  // },

  getCitysByIndex(index) {
    var zimuList = this.data.zimuList;
    var brandsList = this.data.brandsList;
    let zimu = zimuList[index].zimu;
    var tempObj = [];
    for (let i = 0; i < brandsList.length; i++) {
      if (brandsList[i].zimu == zimu) {
        tempObj = brandsList[i].brands;
        break;
      }
    }
    return tempObj;
  },
  formTip() {
    this.setData({
      formTipShow: true
    });
    var $this = this;
    setTimeout(function() {
      $this.setData({
        formTipShow: false
      })
    }, 3000)
  },
  phoneInput(e) {
    var form = this.data.form;
    form.phone = e.detail.value;
    this.setData({
      form: form
    })
  },
  bindMsglInput(e) {
    this.setData({
      smscode: e.detail.value
    })
  },
  openLog() {
    this.setData({
      phoneLogShow: true
    })
  },
  closeLog() {
    this.setData({
      phoneLogShow: false
    })
  },
  //获取短信验证码
  get_sms_code: function() {
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
            var timer = setInterval(function() {
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
  checkForm() {
    var form = this.data.form; 
    if (form.description.replace(/(^\s*)|(\s*$)/g, "").length == 0) form.description = '有符合需求的卖家，第一时间联系我哦'; 
    for (var item in form) {
      if (!form[item]) {
        return false;
      }
    }
    console.log('true');
    return true;
  },
  cleanForm() {
    var form = this.data.form;
    for (var item in form) {
      if (item == 'phone') {

      } else {
        form[item] = '';
      }

    }
    this.setData({
      form: form
    })
  },
  cleanImg() {
    var imgList = new Array();
    this.setData({
      imgList: imgList
    })
  },
  //发布
  formSubmit(e) {
    var formId = e.detail.formId;
    var form = this.data.form;
    var $this = this; 
   
    if (!this.checkForm()) {
      wx.showToast({
        title: '请将信息填写完整',
        image: '../../images/warn.png'
      })
    } else {
      var carInfo = {
        brand_id: app.globalData.brand_id,
        models_name: app.globalData.carBrand +' '+ form.productDate+'款' + ' ' + form.displacement + form.displacementUnit + ' ' + form.transmissionData,
        parkingposition: form.carRegion,
        guide_price: form.price,
        phone: form.phone,
        store_description: form.description,
        displacement: form.displacement + form.displacementUnit,
        productDate: form.productDate,
        transmissionData: form.transmissionData,
      }
      $http.post('index/wantBuyCar', {
          carInfo: carInfo,
          formId: formId
        })
        .then(res => {
          //成功回调
          var resObj = res.data;
          console.log('我的数据：', resObj);
          if (resObj.code == 1) {
            wx.showToast({
              title: resObj.msg,
              icon: 'success'
            });
            $this.cleanForm();
            // brand = {

            // };
            $this.setData({
              form: form,
              brand: brand
            })
          } else {
            wx.showToast({
              title: resObj.msg,
              image: '../../images/warn.png'
            })
            console.log('请求失败：', resObj.msg);
          }
        }).catch(err => {
          //异常回调
          console.log('请求失败', err);
        });
    }

  },

  //选择车辆品牌
  selectCar:function(){
    wx.navigateTo({
      url: '../saleCar/carBrand/carBrand'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getYear()
    this.request_brand();
    this.setData({
      carType: app.globalData.carBrand
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

  onShow: function () {
    this.setData({
      carType: app.globalData.carBrand
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */

  onHide: function () {
    app.globalData.carType = '请选择车型'
    app.globalData.carBrand = '选择品牌'
    app.globalData.brand_id = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */

  onUnload: function () {
    app.globalData.carType = '请选择车型'
    app.globalData.carBrand = '选择品牌'
    app.globalData.brand_id = ''
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