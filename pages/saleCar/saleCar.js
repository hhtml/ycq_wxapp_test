// pages/saleCar/saleCar.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    year:'',
    imgList:[],
    form:{
      carRegion:'',
      productDate:'',
      listingDate:'',
      price:'',
      distance:'',
      emission:'',
      description:'',
      displacement:'',
      displacementUnit:'L',
      transmissionData: '', //变速箱
    },
    a:{
      carRegion:''
    },
    carRegion:'',
    phone:'', //手机号
    transmission: [], //变速箱
    radioArray:[ //单选框
      {name:'L',checked:'true'},
      {name:'T'}
    ],
    // multiIndex: [0, 0],
    phoneLogShow:false,
    dtNUm: 60,
    appImgUrl: app.globalData.localImgUrl
  },
  /***
   * 事件函数
   */
  

  
  chooseImg(){
    var $this = this;
    var imgList=this.data.imgList;
    wx.chooseImage({
      count: 9,
      success: function ({ tempFilePaths }) {
        wx.showLoading({
          title: '加载中',
        })
        var promise = Promise.all(tempFilePaths.map((tempFilePath, index) => {
          return new Promise(function (resolve, reject) {
            wx.uploadFile({
              url: app.globalData.url+'index/upModelImg',
              filePath: tempFilePath,
              name: 'file',
              formData: null,
              success: function (res) {
                wx.hideLoading()
                //上传成功后的图片地址imgUrl，需要与服务器地址（app.js全局设置）做拼接, setData出去做预览
                let imgUrl = JSON.parse(res.data).data.url; //eg:'https://czz.junyiqiche.com'+imgUrl
                console.log(JSON.parse(res.data));
                resolve(imgUrl);
              },
              fail: function (err) {
                reject(new Error('failed to upload file'));
              }
            });
          });
        }));
        promise.then(function (results) {
          console.log(results);
          var newList = imgList.concat(results);
          // for(var i in newList){
          //   newList[i] = app.globalData.localImgUrl+newList[i]
          // } 
          console.log('newList:', newList);
          $this.setData({
            imgList: newList,
            carType: app.globalData.carType
          })
        }).catch(function (err) {
          console.log(err);
        });
      }
    });
  },
  //上传图片后点击预览
  // previewImage(){
  //   wx.previewImage({
  //     current: '', // 当前显示图片的http链接
  //     urls: this.data.imgList // 需要预览的图片http链接列表
  //   })
  // },
  deleteImg(e){
      var index=e.currentTarget.dataset.index;
      var imgList=this.data.imgList;
      imgList.splice(index,1);
      this.setData({
        imgList:imgList
      })
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
  emissionInput(e) {
    var form = this.data.form;
    form.emission = e.detail.value;
    this.setData({
      form: form
    })
  },
  productDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var form = this.data.form;
    form.productDate = e.detail.value;
    this.setData({
      form: form
    })
  },
  listingDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var form = this.data.form;
    form.listingDate = e.detail.value;
    this.setData({
      form: form
    })
  },

  carRegionChange(e){
    var form=this.data.form;
    form.carRegion = e.detail.value[0] + ' ' + e.detail.value[1];
    this.setData({
      form:form
    })
  },

  displacementInput(e){
    var form = this.data.form;
    form.displacement = e.detail.value
    this.setData({
      form: form
    })
  },
  radioChange(e){
    var form = this.data.form
    form.displacementUnit = e.detail.value
    this.setData({
      form: form
    })
  },
  transmissionDataChange(e){
    var index = e.detail.value
    var form = this.data.form
    form.transmissionData = this.data.transmission[index]
    this.setData({
      form: form
    })
    console.log(this.data.form)
  },
  openLog() { //弹出手机号验证码区域
    this.setData({
      phoneLogShow: true
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
  request_brand(){
     var $this=this;
     var zimuList=new Array();
     var brandsList = new Array();
     var form=this.data.form;
    $http.post('index/brandCates')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('品牌数据：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var brandList = data.brand;
          var transmission = new Array()
          for (var i in resObj.data.transmission){
            transmission.push(resObj.data.transmission[i]);
          }
          $this.setData({
            transmission: transmission,
            phone: data.mobile
          })
          $this.data.form.transmissionData = transmission[0]
          // form.phone = data.mobile;
          for (var item in brandList){
            //console.log('item:',item);
            var brands = new Array();
            var obj={
              zimu:item,
              name:item
            }
            
            brandList[item].forEach((val,index)=>{
                var sobj={
                  id:val.id,
                  name:val.name
                }
              brands[index] = sobj;
            });
            var obj2={
              zimu:item,
              brands:brands
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
        console.log('请求失败',err);
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
  //   var brand={
  //     id: brand_id,
  //     name: brand_name
  //   }
  //   this.setData({
  //     brand
  //   })

  // },
  descriptionInput(e){
    var form=this.data.form;
    form.description=e.detail.value;
     this.setData({
       form: form
     })
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
  checkForm(){
    var that = this
    var form=this.data.form;
    form.phone = this.data.phone
    if (form.description.replace(/(^\s*)|(\s*$)/g, "").length == 0) form.description = '车况良好，车子也有按时保养，感兴趣的朋友，随时欢迎联系'; 
    for(var item in form){
      if(!form[item]){
        // that.data.a.item = 'red'
        // that.setData({
        //   a: that.data.a
        // })
        // console.log(that.data.a.item)
        return false;
      }
    }
    console.log('true');
    return true;
  },
  cleanForm() {
    var form = this.data.form;
    for (var item in form) {
      if(item == 'phone'){

      }else{
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
  formSubmit(e){
    this.checkForm();
    var form = this.data.form;
    var brand=this.data.brand;
    var $this=this;
    var imgList = this.data.imgList;
    if (!this.checkForm()){
      wx.showToast({
        title: '请将信息填写完整',
        image: '../../images/warn.png'
      })
    } 
    // else if(imgList.length < 6){
    //   wx.showToast({
    //     title: '至少上传6张图片',
    //     image: '../../images/warn.png'
    //   })
    // } 
    else if (this.data.form.price<1000){
      wx.showToast({
        title: '价格有误',
        image: '../../images/warn.png'
      })
    } else{
      var modelsimages = imgList.join(',');
      var carInfo = {
        brand_id: app.globalData.brand_id,
        models_name: app.globalData.carType + ' ' + form.productDate +'款'+' ' + form.displacement + form.displacementUnit + ' ' + form.transmissionData,
        parkingposition: form.carRegion,
        guide_price: form.price,
        factorytime: form.productDate,
        car_licensetime: form.listingDate,
        kilometres: form.distance,
        emission_standard: form.emission,
        phone: $this.data.phone,
        store_description: form.description,
        modelsimages: modelsimages,
        displacement: form.displacement + form.displacementUnit,
        transmissionData: form.transmissionData
      }
      console.log(carInfo)
      return;
      $http.post('index/uploadModels',{
        carInfo: carInfo
      })
        .then(res => {
          //成功回调
          var resObj = res.data;
          console.log('我的数据：', resObj);
          if (resObj.code == 1) {
            wx.showToast({
              title: resObj.msg,
              icon:'success'
            });
            $this.cleanForm();
            $this.cleanImg();
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
  formTip(){
      this.setData({
        formTipShow:true
      });
      var $this=this;
      setTimeout(function(){
        $this.setData({
          formTipShow:false
        })
      },3000)
  },

  // 选择品牌点击事件
  selectCar:function(){
    wx.navigateTo({
      url: './carBrand/carBrand'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.getYear()
    this.request_brand();
    this.setData({
      carType: app.globalData.carType
    })
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
    this.setData({
      carType: app.globalData.carType
    })
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
    app.globalData.carType = '请选择车型'
    app.globalData.carBrand = '选择品牌'
    app.globalData.brand_id = ''
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