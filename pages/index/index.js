//index.js
//获取应用实例
const app = getApp();
var $http = require('../../utils/http.js');
Page({
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    bannerUrls:[
      /*{
        id:0,
        img:'../../images/banner.png'
      }*/
    ],
    iconList:[
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
        id:2,
        iconUrl: '../../images/index-icon-03.png',
        name: '我想买车',
        path: '../buyCar/buyCar'
      },
      {
        id: 3,
        iconUrl: '../../images/index-icon-04.png',
        name: '汽车资讯',
        // path: '../clueCar/clueCar'
      } 
    ],
    scroll_x:true,
    shopList: [
     /*{
        id: 0,
        name: '汽车公司',
        addr:'成都',
        typeCount: '360',
        brands: '奔驰，宝马，奥迪，阿斯丹顿，奔驰，宝马，奥迪，阿斯丹顿'
      }*/
    ],
    switchTitle:[
      {
        info:'sale',
        name:'商家在售',
        icon:'../../images/switch-title-01.png'
      },
      {
        info: 'buy',
        name: '有人想买',
        icon: '../../images/switch-title-02.png'
      },
      // {
      //   info: 'clue',
      //   name: '线索',
      //   icon: '../../images/switch-title-03.png'
      // },

    ],
    saleInfoList:[
     /*  {
        id:0,
        imgSrc:'../../images/car-test_03.png',
        name:'2011款奥迪A6 2.0T自动舒适版',
        priceArea:'10.5-30.5',
        sale:'30',
        time:'2011-03',
        miles:'3万',
        addr:'成都',
        distance:'310'
       }*/
    ],
    buyInfoList: [
      /*{
        id: 0,
        imgSrc: '../../images/car-test_03.png',
        name: '2011款奥迪A6 2.0T自动舒适版',
        priceArea: '10.5-30.5',
        sale: '30',
        time: '2011-03',
        miles: '3万',
        addr: '成都',
        distance: '310'
      }*/
    ],
    clueInfoList: [
      /*{
        id: 0,
        imgSrc: '../../images/car-test_03.png',
        name: '2011款奥迪A6 2.0T自动舒适版',
        priceArea: '10.5-30.5',
        sale: '30',
        time: '2011-03',
        miles: '3万',
        addr: '成都',
        distance: '310'
      }*/
    ],
    currentInfo:'sale',
    searchResultShow:true,
    searchResult:[]
  },
  //事件处理函数
  
  nav_to_page:function(e){
      var index=e.currentTarget.dataset.index;
      var iconList=this.data.iconList;
      var path = iconList[index].path;
      wx.navigateTo({
        url: path,
      })

    // wx.showToast({
    //   title: '即将上线',
    //   image: '../../images/warn.png'
    // })
  },
  switchTitle:function(e){
      var info=e.currentTarget.dataset.info;
      this.setData({
        currentInfo:info
      })
  },
  searchPage:function(){
    wx.navigateTo({
      url: '/pages/index/searchPage/searchPage'
    })
  },
  searchConfirm(e){
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

  onLoad: function () {
    this.request_index_info();
    this.check();
  },
  nav_to_classify:function(e){
    var index=e.currentTarget.dataset.index;
    var iconList = this.data.iconList;

  },
  nav_to_shoplist:function(){
   wx.showToast({
     title: '即将上线',
     image:'../../images/warn.png',
     duration: 500
   })
  },
  request_index_info: function () {
    var bannerUrls=new Array();
    var shopList=new Array();
    var saleInfoList=new Array();
    var buyInfoList = new Array();
    var clueInfoList = new Array();
    var $this=this;
    $http.post('index/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('首页数据：', resObj);
        if (resObj.code == 1) {
          var bannerList = resObj.data.bannerList;
          var storeList = resObj.data.storeList;
          var saleList = resObj.data.carModelList.modelsInfoList;
          var buyList = resObj.data.carModelList.buycarModelList;
          var clueList = resObj.data.carModelList.clueList;
          bannerList.forEach((val,index)=>{
             var obj={
               title:val.title,
               url:val.url,
               img:val.image
             }
            bannerUrls[index]=obj;
          });
          if (storeList){
            storeList.forEach((val, index) => {
              var obj = {
                id: val.id,
                name: val.store_name,
                addr: val.cities_name,
                typeCount: val.modelsinfo_count,
                brands: val.main_camp
              }
              shopList[index] = obj;
            });
          }
          if (saleList){
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
                type:val.type,
                browse_volume: val.browse_volume
              }
              saleInfoList[index] = obj;
            });
          }
          if (buyList){
            buyList.forEach((val, index) => {
              var obj = {
                id: val.id,
                imgSrc: app.globalData.imgUrl + val.modelsimages,
                brand_name: val.brand.name,
                name: val.models_name,
                priceArea: val.guide_price,
                time: val.car_licensetime,
                miles: val.kilometres,
                addr: val.parkingposition,
                type: val.type,
                browse_volume: val.browse_volume

              }
              buyInfoList[index] = obj;
            });
          }
          if (clueList){
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
                browse_volume: val.browse_volume

              }
              clueInfoList[index] = obj;
            });
          }
          
          console.log('saleInfoList:', saleInfoList);
          console.log('buyInfoList:', buyInfoList);
          console.log('clueInfoList:', clueInfoList);
          $this.setData({
            bannerUrls: bannerUrls,
            shopList: shopList,
            saleInfoList: saleInfoList,
            buyInfoList: buyInfoList,
            clueInfoList: clueInfoList
          });
        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败',err);
      });
  },
  nav_to_car_detail(e){
     var carId=e.currentTarget.dataset.id;
    var type = e.currentTarget.dataset.type;  
    wx.navigateTo({
      url: '../carDetail/carDetail?carId='+carId+'&type='+type,
    }) 
  },
  /***
   * 
   * 登录相关
   */
  close_the_log: function () {
    this.check();
  },
  //显示登录或授权提示
  showLoginModal: function () {
    this.setData({
      settingShow: true
    });
    wx.hideTabBar();
  },
  //判断是否登录
  check: function () {

    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          console.log('已经授权');
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              that.setData({
                settingShow: false
              })
              wx.showTabBar();
               
              that.login();
            },
            fail: function () {
              that.showLoginModal();
              
            }
          });
        } else {
          that.showLoginModal();
        
        }
      },
      fail: function () {
        that.showLoginModal();
      }
    });
    // this.login(cb);

  },
  login: function () {
    var that = this;
    var token = wx.getStorageSync('token') || '';
    //调用登录接口
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.getUserInfo({
            success: function (ures) {
              wx.request({
                url: app.globalData.url + 'user/login',
                data: {
                  code: res.code,
                  rawData: ures.rawData,
                  token: token
                },
                method: 'post',
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                success: function (lres) {
                  var response = lres.data
                  if (response.code == 1) {
                    that.data.userInfo = response.data.userInfo;
                    
                    wx.setStorageSync('userInfo', response.data.userInfo);
                    wx.setStorageSync('user_id', response.data.userInfo.user_id);
                  } else {
                    wx.setStorageSync('token', '');
                    console.log("用户登录失败")
                    that.showLoginModal();
                  }
                }
              });
            },
            fail: function (res) {
              that.showLoginModal();
            }
          });
        } else {
          that.showLoginModal();
        }
      }
    });
  },
  getuserinfo: function (e) {
    if (!e.detail.userInfo) {

    } else {
      console.log('userInfo:', e.detail.userInfo);
      this.setData({
        settingShow: false
      });
      this.check();
    }

  },
  onPullDownRefresh(){
    this.request_index_info();
    
  },

  // 分享功能
  onShareAppMessage: function () {
    let that = this;
    return {
      title: '友车圈圈', // 转发后 所显示的title
      path: '/pages/index/index', // 相对的路径
      success: (res) => {    // 成功后要做的事情
        // console.log(res.shareTickets[0])

        // wx.getShareInfo({
        //   shareTicket: res.shareTickets[0],
        //   success: (res) => {
        //     that.setData({
        //       isShow: true
        //     })
        //     console.log(that.setData.isShow)
        //   },
        //   fail: function (res) { console.log(res) },
        //   complete: function (res) { console.log(res) }
        // })
      },
      fail: function (res) {
        // 分享失败
        console.log(res)
      }
    }
  },

  //登陆界面点击友车圈服务协议跳转到服务协议界面事件
  goServiceAgreement:function(){
    wx.navigateTo({
      url: '../mine/serviceAgreement/serviceAgreement'
    })
  }
})
