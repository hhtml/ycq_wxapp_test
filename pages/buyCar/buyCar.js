// pages/buyCar/buyCar.js
const app = getApp();
var $http = require('../../utils/http.js');
var valve = true //节流阀
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiIndex: [0, 0],
    year:'',
    form: {
      carRegion: '',
      price: '',
      description: '',
      displacementUnit:'L',
      displacement:'',
      productDate:'',
      transmissionData: '', //变速箱
      phone:''
    },
    phone:'',
    transmission: [], //变速箱
    radioArray: [
      { name: 'L', checked: 'true' },
      { name: 'T' }
    ],
    dtNUm: 60,
    phoneLogShow:false
  },
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
            phone: data.mobile
          })
          $this.data.form.transmissionData = transmission[0]
          form.phone = data.mobile;
          for (var item in brandList) {
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
  openLog() { //弹出手机验证码区域
    this.setData({
      phoneLogShow: true
    })
  },
  checkForm() {
    var form = this.data.form; 
    form.phone  = this.data.phone
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

      } else if (item == 'displacementUnit'){

      }else {
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
    if (valve == true){ //节流阀
      valve = false
      var formId = e.detail.formId;
      var form = this.data.form;
      var $this = this;
      if (!this.checkForm()) {
        wx.showToast({
          title: '请将信息填写完整',
          image: '../../images/warn.png'
        })
        valve = true 
      } else if ($this.data.carType == '') {
        wx.showToast({
          title: '请将信息填写完整',
          image: '../../images/warn.png'
        })
        valve = true 
      } else {
        var carInfo = {
          brand_id: app.globalData.brand_id,
          models_name: app.globalData.carBrand + ' ' + form.productDate + '款' + ' ' + form.displacement + form.displacementUnit + ' ' + form.transmissionData,
          parkingposition: form.carRegion,
          guide_price: form.price,
          phone: $this.data.phone,
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
              $this.setData({
                carType: ''
              })
              $this.setData({
                form: form,
                // brand: brand
              })
              valve = true 
            } else {
              wx.showToast({
                title: resObj.msg,
                image: '../../images/warn.png'
              })
              console.log('请求失败：', resObj.msg);
              valve = true 
            }
          }).catch(err => {
            //异常回调
            console.log('请求失败', err);
            valve = true 
          });
      }
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
    app.globalData.carType = ''
    app.globalData.carBrand = ''
    app.globalData.brand_id = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */

  onUnload: function () {
    app.globalData.carType = ''
    app.globalData.carBrand = ''
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