// pages/carSource/carSource.js
const app = getApp();
var $http = require('../../utils/http.js');
var models_name;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    carInfoList: [
     /* {
        id: 0,
        imgSrc: '../../images/car-test_03.png',
        name: '2011款奥迪A6 2.0T自动舒适版自动舒适版自动舒适版',
        priceArea: '10.5-30.5',
        sale: '30',
        time: '2011-03',
        miles: '3万',
        addr: '成都',
        distance: '310'
      },
      {
        id: 1,
        imgSrc: '../../images/car-test_03.png',
        name: '2011款奥迪A6 2.0T自动舒适版',
        priceArea: '10.5-30.5',
        sale: '30',
        time: '2011-03',
        miles: '3万',
        addr: '成都',
        distance: '310'
      },*/
    ],
    multiIndex:[0,0],
    screen: {
      id: 1,
      name: '最新发布'
    },
    screenList:[
      {
        id:1,
        name:'最新发布'
      },
      {
        id: 2,
        name: '里程最小'
      },
      {
        id: 3,
        name: '价格最低'
      }
    ],
    city_id:'',
    brand_id:''
  },
  
  /**
   * 事件函数
   */
  nav_to_car_detail:function(e){
      var carId=e.currentTarget.dataset.id;
      var type = e.currentTarget.dataset.type;
      wx.navigateTo({
        url: '../carDetail/carDetail?carId=' + carId + '&type=' + type,
      });
  }, 
  bindAddrChange:function(e){
    var cityList = this.data.cityList;
    console.log(cityList[e.detail.value].name);
    var city_id = cityList[e.detail.value].name;
    var brand_id = this.data.brand_id;
    var screen = this.data.screen;
    console.log(cityList[e.detail.value].name);
    var screen_id = screen.id;
    console.log(cityList[e.detail.value].name);
    this.change_car_source(screen_id, city_id, brand_id); 
      this.setData({
        city_id: city_id
      })
  },
  bindScreenChange: function (e) {
    var screenList = this.data.screenList;
    console.log(screenList[e.detail.value]);
    var city_id = this.data.city_id;
    var brand_id = this.data.brand_id;
    var screen_id = screenList[e.detail.value].id;
    this.change_car_source(screen_id, city_id, brand_id); 
    this.setData({
      screen: screenList[e.detail.value]
    })
  },
  bindPickerColumnChange(e) {
    var zimuList = this.data.zimuList;
    if (e.detail.column == 0) {
      var brands = this.getCitysByIndex(e.detail.value);
      this.setData({
        brandInfo: [zimuList, brands]
      })
    }
  },
 bindPickerChange(e) {
   console.log(e.detail.value);
   var brandList = this.getCitysByIndex(e.detail.value[0]);
   var brand_id = brandList[e.detail.value[1]].id;
   console.log('brand_id:', brand_id);
   var city_id = this.data.city_id;
   var screen_id = this.data.screen.id;
   this.change_car_source(screen_id, city_id, brand_id);
   this.setData({
     brand_id: brand_id
   })

},
  getCitysByIndex(index) {
    var zimuList = this.data.zimuList;
    var brandsList = this.data.brandsList;
    let zimuIndex = zimuList[index].index;
    var tempObj = [];
    for (let i = 0; i < brandsList.length; i++) {
      if (brandsList[i].index == zimuIndex) {
        tempObj = brandsList[i].brands;
        break;
      }
    }
    return tempObj;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    if (options.models_name){ 
      models_name = options.models_name
      that.request_car_source(1, '', '',models_name)
    } else if (options.name){ 
      var name = options.name
      that.request_car_source(1, '', name , '')
    }else{
      this.request_car_source(1);
    }
    // this.request_car_source(1);
    this.setData({
      city_id: '',
      brand_id: ''
    })
  },
  request_car_source: function (screen, city, brand_id, models_name){
    var $this=this;
    var carInfoList=new Array();
    var zimuList = new Array();
    var brandsList = new Array();
    var cityList=new Array();
    $http.post('Carselect/index',{
      screen:screen,
      city:city,
      brand_id: brand_id,
      models_name: models_name
    })
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('严选车源：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var carList=data.carList;
          var brandList = data.brand;
          var cityList=data.city;
          carList.forEach( (val,index)=>{
            var himgUrl;
            if (val.type=='sell'){
              himgUrl = app.globalData.localImgUrl;
            }else{
              himgUrl = app.globalData.imgUrl;
            }
             var obj={
               id: val.id,
               imgSrc: himgUrl+ val.modelsimages,
               brand_name: val.brand.name,
               name: val.models_name,
               priceArea: val.guide_price,
               sale: val.browse_volume,
               time: val.car_licensetime,
               miles: val.kilometres,
               addr: val.parkingposition,
               brand_id: val.brand.id,
               brand_name:val.brand.name,
               type: val.type
             }
            carInfoList[index]=obj;
          });
          brandList.forEach((val, index) => {
            var obj = {
              index:index,
              name:val.zimu
            }
            var brand_list = val.brand_list;
            var arr=new Array();
            brand_list.forEach((el,i)=>{
              var sObj={
                 id:el.id,
                 name:el.name
              }
              arr[i]=sObj;
            })
            var obj2={
              index:index,
              brands: arr
            }
            zimuList[index] = obj;
            brandsList[index] = obj2;
          });

          console.log('zimuList:',zimuList);
          console.log('brandsList:', brandsList);
         
          $this.setData({ 
            carInfoList, 
            zimuList, 
            brandsList ,
            cityList,
            brandInfo: [zimuList, brandsList[0].brands]
            });

        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败',err);
      });
  },
  change_car_source: function (screen, city, brand_id) {
    var $this = this;
    var carInfoList = new Array();
    $http.post('Carselect/index', {
      screen: screen,
      city: city,
      brand_id: brand_id
    })
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('筛选车源：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var carList = data.carList;
          carList.forEach((val, index) => {
            var himgUrl;
            if (val.type == 'sell') {
              himgUrl = app.globalData.localImgUrl;
            } else {
              himgUrl = app.globalData.imgUrl;
            }
            var obj = {
              id: val.id,
              imgSrc: himgUrl+ val.modelsimages,
              brand_name: val.brand.name,
              name: val.models_name,
              priceArea: val.guide_price,
              sale: val.browse_volume,
              time: val.car_licensetime,
              miles: val.kilometres,
              addr: val.parkingposition,
              brand_id: val.brand.id,
              brand_name: val.brand.name,
              type: val.type
            }
            carInfoList[index] = obj;
          });
          $this.setData({
            carInfoList
          });

        } else {
          console.log('请求失败：', data.msg);
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
    this.request_car_source(1);
    this.setData({
      city_id: '',
      brand_id: ''
    })
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

  },
})