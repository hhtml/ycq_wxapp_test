//index.js
//获取应用实例
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/util.js');

Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    unread: '', //消息提示红点显示
    bannerUrls: [
      /*{
        id:0,
        img:'../../images/banner.png'
      }*/
    ],
    iconList: [
      /*{
        id:0,
        iconUrl:'../../images/index-icon-01.png',
        name:'顺风车',
        path:'../hitchHiking/hitchHiking'
      },*/
      {
        id: 1,
        iconUrl: '../../images/index-icon-02.png',
        name: '我有车卖',
        path: '../saleCar/saleCar'
      },
      {
        id: 2,
        iconUrl: '../../images/index-icon-03.png',
        name: '我想买车',
        path: '../buyCar/buyCar'
      },
      {
        id: 3,
        iconUrl: '../../images/index-icon-04.png',
        name: '汽车资讯',
        path: '../infomation/infomation'
      }
    ],


    scroll_x: true,
    shopList: [
      /*{
         id: 0,
         name: '汽车公司',
         addr:'成都',
         typeCount: '360',
         brands: '奔驰，宝马，奥迪，阿斯丹顿，奔驰，宝马，奥迪，阿斯丹顿'
       }*/
    ],
    switchTitle: [{
        info: 'sale',
        name: '商家在售',
        icon: '../../images/switch-title-01.png'
      },
      {
        info: 'buy',
        name: '有人想买',
        icon: '../../images/switch-title-02.png'
      }

    ],

    currentInfo: 'sale',
    searchResultShow: true,
    searchResult: [],
    shareInfo: '',
    sell_car_condition: {},
    buy_car_condition: {},
    msg: '',
    showModal: false
  },
  //事件处理函数

  nav_to_page: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index;
    var iconList = this.data.iconList;
    var path = iconList[index].path;
    if (index == 0) {
      // wx.navigateTo({
      //   url: path,
      // })
      switch (that.data.sell_car_condition.code){
        case 0: //认证通过
          wx.navigateTo({
            url: path,
          })
          break;
        case 1: //去认证
          that.setData({
            msg: that.data.sell_car_condition.msg,
            showModal: true
          })
          break;
        case 3: //审核中/待审核
          that.setData({
            msg: that.data.sell_car_condition.msg,
            showModal2: true
          })
          break;
        case 4: //去付费
          that.setData({
            msg: that.data.sell_car_condition.msg,
            showModal: true
          })
          break;
        case 5: //审核不通过
          that.setData({
            msg: that.data.sell_car_condition.msg,
            showModal: true
          })
          break;
        default: //发布超过次数
          that.setData({
            msg: that.data.sell_car_condition.msg,
            showModal2: true
          })
      }

    } else if (index == 1) {
      // wx.navigateTo({
      //   url: path,
      // })
      switch (that.data.sell_car_condition.code){
        case 1: //去认证
          that.setData({
            msg: that.data.buy_car_condition.msg,
            showModal: true
          })
          break;
        case 3: //审核中/待审核
          that.setData({
            msg: that.data.buy_car_condition.msg,
            showModal2: true
          })
          break;
        case 4: //去付费
          that.setData({
            msg: that.data.buy_car_condition.msg,
            showModal: true
          })
          break;
        case 5: //审核不通过
          that.setData({
            msg: that.data.buy_car_condition.msg,
            showModal: true
          })
          break;
        default: //认证通过
          wx.navigateTo({
            url: path,
          })
      }
    } else {
      wx.navigateTo({
        url: path,
      })
      // wx.showToast({
      //   title: '即将上线',
      //   image: '../../images/warn.png'
      // })
    }
  },

  //模态框点击事件
  sureClick:function(){
    var that = this
    that.setData({
      showModal2:false
    })
  },

  //消息图标点击事件
  goNews: function() {
    wx.navigateTo({
      url: '/pages/mine/news/news'
    })
  },
  switchTitle: function(e) {
    var info = e.currentTarget.dataset.info;
    this.setData({
      currentInfo: info
    })
  },
  searchPage: function() {
    wx.navigateTo({
      url: '/pages/index/searchPage/searchPage'
    })
  },
  searchConfirm(e) {
    /* var $this=this;
    $http.post('',{

    })
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('搜索数据：', resObj);
        if (resObj.code == 1) {
          

        } else {
          console.log('请求失败：', resObj.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败',err);
      });*/
  },

  onLoad: function (options) {
    this.request_index_info();
    // this.check();
  },
  nav_to_classify: function(e) {
    var index = e.currentTarget.dataset.index;
    var iconList = this.data.iconList;

  },
  nav_to_shoplist: function() {
    wx.showToast({
      title: '即将上线',
      image: '../../images/warn.png',
      duration: 500
    })
  },
  request_index_info: function() {
    var bannerUrls = new Array();
    var shopList = new Array();
    var saleInfoList = new Array();
    var buyInfoList = new Array();
    var clueInfoList = new Array();
    var $this = this;
    $http.post('index/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        // console.log('首页数据：', resObj);

        if (resObj.code == 1) {
          var bannerList = resObj.data.bannerList;
          var storeList = resObj.data.storeList;
          var saleList = resObj.data.carModelList.modelsInfoList;
          var buyList = resObj.data.carModelList.buycarModelList;
          var clueList = resObj.data.carModelList.clueList;
          //分享数据
          $this.data.shareInfo = resObj.data.share;
          bannerList.forEach((val, index) => {
            var obj = {
              title: val.title,
              url: val.url,
              img: val.image
            }
            bannerUrls[index] = obj;
          });
          if (storeList) {
            storeList.forEach((val, index) => {
              var obj = {
                id: val.id,
                name: val.store_name,
                addr: val.cities_name,
                typeCount: val.modelsinfo_count,
                brands: val.main_camp,
                factorytime: val.factorytime
              }
              shopList[index] = obj;
            });
          }
          if (saleList) {
            saleList.forEach((val, index) => {
              var obj = {
                id: val.id,
                imgSrc: app.globalData.localImgUrl + val.modelsimages,
                brand_name: val.brand.name,
                name: val.models_name,
                priceArea: val.guide_price,
                time: val.car_licensetime,
                miles: val.kilometres,
                addr: val.parkingposition,
                type: val.type,
                browse_volume: val.browse_volume,
                factorytime: val.factorytime
              }
              saleInfoList[index] = obj;
            });
          }
          if (buyList) {
            buyList.forEach((val, index) => {
              var obj = {
                id: val.id,
                imgSrc: app.globalData.imgUrl + (val.brand.brand_default_images ? val.brand.brand_default_images : val.modelsimages),
                brand_name: val.brand.name,
                name: val.models_name,
                priceArea: val.guide_price,
                time: val.car_licensetime,
                miles: val.kilometres,
                addr: val.parkingposition,
                type: val.type,
                browse_volume: val.browse_volume,
                factorytime: val.factorytime
              }
              buyInfoList[index] = obj;
            });
          }
          if (clueList) {
            clueList.forEach((val, index) => {
              var obj = {
                id: val.id,
                imgSrc: app.globalData.localImgUrl + val.modelsimages,
                brand_name: val.brand.name,
                name: val.models_name,
                priceArea: val.guide_price,
                time: val.car_licensetime,
                miles: val.kilometres,
                addr: val.parkingposition,
                type: val.type,
                browse_volume: val.browse_volume,
                factorytime: val.factorytime
              }
              clueInfoList[index] = obj;
            });
          }


          $this.setData({
            bannerUrls: bannerUrls,
            shopList: shopList,
            saleInfoList: saleInfoList,
            buyInfoList: buyInfoList,
            clueInfoList: clueInfoList,
            buy_car_condition: resObj.data.buy_car_condition,
            sell_car_condition: resObj.data.sell_car_condition,
            unread: resObj.data.unread
          });
        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
  },
  nav_to_car_detail(e) {
    var carId = e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;
    wx.navigateTo({
      url: '../carDetail/carDetail?carId=' + carId + '&type=' + type,
    })
  },
  
  onPullDownRefresh() {
    this.request_index_info();

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // 分享功能
  onShareAppMessage: function() {
    let that = this;
    return {
      title: that.data.shareInfo.shares_title, // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      imageUrl: app.globalData.imgUrl+that.data.shareInfo.shares_img
    }
  },

  onShow: function() {
    this.request_index_info();
  }
 
})

