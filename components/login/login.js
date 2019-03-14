// components/login/login.js
//获取应用实例
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/util.js');
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

  },

  attached: function () {
    this.check();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /***
   * 
   * 登录相关
   */
    //显示登录或授权提示
    showLoginModal: function () {
      this.setData({
        settingShow: true
      });
      wx.hideTabBar();
    },
    //判断是否登录
    check: function (cb) {
      console.log('登录')
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
                      // that.updateGlobalData(response.data);
                      wx.setStorageSync('token', response.data.userInfo.token)
                      // wx.setStorageSync('userInfo', response.data.userInfo);
                      wx.setStorageSync('user_id', response.data.userInfo.user_id);
                      // typeof cb == "function" && cb(response.data.userInfo);

                        //刷新当前页面
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 1];  //当前页面)
                        prevPage.onLoad()

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
        this.setData({
          settingShow: false
        });
        this.check();
      }

    },
    //登陆界面点击友车圈服务协议跳转到服务协议界面事件
    goServiceAgreement: function () {
      wx.navigateTo({
        url: '../mine/serviceAgreement/serviceAgreement'
      })
    },
  }
})
