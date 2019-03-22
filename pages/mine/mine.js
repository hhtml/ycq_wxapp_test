// pages/mine/mine.js
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/md5.js') // 引入md5.js文件
var checkReLoad = false; 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    userInfo: [],
    store_has_many: [],
    haibaoImg: '',
    userName: ' ',
    unread: '', //消息列表提示
    authentication: false, //是否实名认证
    authenticationList: '', //认证提示消息
    dataPath: '', //实名认证按钮点击路径
    goldShop: true, //达到黄金店铺级别 隐藏认证区域
    nickname: '',
    store_level: '', //店铺等级
    navList: [{
        icon: '',
        name: '我的店铺',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '我买到的',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '我卖出的',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '服务协议',
        path: '../myShop/myShop'
      },
      {
        icon: '',
        name: '关于友车',
        path: '../myShop/myShop'
      }
    ],
  },

  /**
   * 事件函数
   */

  // 店铺认证 实名认证
  isAuthentication: function() {
    var that = this
    var store_has_many = that.data.store_has_many[0]
    if (store_has_many) {
      if (store_has_many.auditstatus == "wait_the_review") {
        that.setData({
          authentication: false,
          authenticationList: '店铺待审核',
          dataPath: '../order/order',
        })
      } else if (store_has_many.auditstatus == "in_the_review") {
        that.setData({
          authentication: false,
          authenticationList: '店铺审核中',
          dataPath: '../order/order',
        })
      } else if (store_has_many.auditstatus == "paid_the_money") {
        if (store_has_many.storelevel.partner_rank == '铂金店铺') {
          that.setData({
            goldShop: false,
            nickname: store_has_many.store_name,
            store_level: store_has_many.storelevel.partner_rank,
          })
        } else {
          that.setData({
            authentication: false,
            authenticationList: '升级店铺',
            nickname: store_has_many.store_name,
            store_level: store_has_many.storelevel.partner_rank,
            dataPath: './upgrade/upgrade',
          })
        }
      } else if (store_has_many.auditstatus == "audit_failed") {
        that.setData({
          authentication: false,
          authenticationList: '店铺审核没有通过 查看详情',
          dataPath: '../cooperationSupply/cooperationSupply'
        })
      } else if (store_has_many.auditstatus == "pass_the_audit") {
        that.setData({
          authentication: false,
          authenticationList: '店铺审核已通过 去支付',
          dataPath: '../order/order',
        })
      }
    } else {
      //店铺还没有实名认证,提示用户去实名认证
      that.setData({
        authentication: true,
        dataPath: '../cooperationSupply/cooperationSupply',
      })
    }
  },
  nav_to_page: function(e) {
    var path = e.currentTarget.dataset.path;
    // wx.showToast({
    //   title: '即将上线',
    //   image: '../../images/warn.png',
    //   duration: 500
    // })
    if (!path) {
      wx.showToast({
        title: '即将上线',
        image: '../../images/warn.png',
        duration: 500
      })
    } else {
      wx.navigateTo({
        url: path,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // var user_id=wx.getStorageSync("user_id");
    this.request_mine();
    checkReLoad = true;    
  },

  request_mine() {
    var $this = this;
    $http.post('my/index')
      .then(res => {
        var resObj = res.data;
        if (resObj.code == 1) {
          checkReLoad = false; 
          //成功回调
         
          $this.data.userInfo = resObj.data.userInfo;
          $this.data.store_has_many = resObj.data.userInfo.store_has_many
          $this.setData({
            nickname: resObj.data.userInfo.nickname,
            unread: resObj.data.userInfo.unread,
            store_has_many: resObj.data.userInfo.store_has_many
          })
          $this.isAuthentication() //店铺认证 实名认证
          //转化头像图片地址
          if (typeof $this.data.userInfo.avatar === 'string') {
            wx.getImageInfo({ //  小程序获取图片信息API
              src: $this.data.userInfo.avatar,
              success: function(res) {
                $this.data.switch1 = 1
                $this.data.userInfo.avatar = res.path
              },
              fail(err) {

                console.log(err)
              }
            })
          }

          // //获取背景图片
          $this.data.userInfo.invite_bg_img = app.globalData.imgUrl + $this.data.userInfo.invite_bg_img
          if (typeof $this.data.userInfo.invite_bg_img === 'string') {
            wx.getImageInfo({ //  小程序获取图片信息API
              src: $this.data.userInfo.invite_bg_img,
              success: function(res) {
                console.log(res.path)
                $this.data.switch2 = 1
                $this.data.userInfo.invite_bg_img = res.path
              },
              fail(err) {
                console.log($this.data.userInfo.invite_bg_img)
                console.log(err)
              }
            })
          }
          //获取二维码图片地址
          if ($this.data.userInfo.invitation_code_img) {
            $this.data.userInfo.invitation_code_img = app.globalData.localImgUrl + $this.data.userInfo.invitation_code_img
            if (typeof $this.data.userInfo.invitation_code_img === 'string') {
              wx.getImageInfo({ //  小程序获取图片信息API
                src: $this.data.userInfo.invitation_code_img,
                success: function(res) {
                  $this.data.switch3 = 1
                  $this.data.userInfo.invitation_code_img = res.path

                },
                fail(err) {
                  // console.log($this.data.userInfo.invitation_code_img)
                  // console.log(err)
                }
              })
            }
          }

          if (resObj.code == 1) {
            var data = resObj.data;
            var isNewOfferSeller = data.userInfo.isNewOfferSeller;
            var isNewOfferbuyer = data.userInfo.isNewOfferbuyer;
            $this.setData({
              isNewOfferSeller,
              isNewOfferbuyer
            });

          } else {
            console.log('请求失败：', data.msg);
          }
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败,异常回调');
      });
  },



  //二维码点击事件
  erWeiMa: function() {
    var $this = this;
    var store_has_many = $this.data.store_has_many || [];
    // console.log($this.data.userInfo);return;
    if ($this.data.userInfo.invitation_code_img == null) { //没有生成二维码
      $http.post('my/setQrcode')
        .then(res => {
          $this.request_mine() //重新请求数据
        }).catch(err => {
          //异常回调
          console.log('请求失败,异常回调');
        });
    }
    if (store_has_many.length > 0) {
      if (store_has_many[0].auditstatus == 'paid_the_money') {
        if ($this.data.switch1 == 1 && $this.data.switch2 == 1 && $this.data.switch3 == 1) {
          $this.createNewImg()
          $this.setData({
            showModal: true
          })
        } else {
          wx.showToast({
            title: '生成中',
            icon: 'loading',
            duration: 1500
          })
          setTimeout(function() {
            $this.createNewImg()
            $this.setData({
              showModal: true
            })
          }, 1500)
        }

      } else if (store_has_many[0].auditstatus == 'in_the_review') {
        wx.showToast({
          title: '审核中',
          image: '../../images/warn.png',
          duration: 1000
        })
      } else if (store_has_many[0].auditstatus == 'wait_the_review') {
        wx.showToast({
          title: '待审核',
          image: '../../images/warn.png',
          duration: 1000
        })
      } else if (store_has_many[0].auditstatus == 'pass_the_audit') {
        wx.showToast({
          title: '审核通过',
          image: '../../images/warn.png',
          duration: 1000
        })
      }
    } else {
      wx.showToast({
        title: '店铺未认证',
        image: '../../images/warn.png',
        duration: 1000
      })
    }

  },

  //关闭模态框
  closeModalDlg: function() {
    var that = this
    that.setData({
      showModal: false
    })
  },

  makePhoneCall() {
    var tel = '028 - 84167417';
    wx.makePhoneCall({
      phoneNumber: tel // 仅为示例，并非真实的电话号码
    })
  },

  //将canvas转换为图片保存到本地，然后将图片路径传给image图片的src
  createNewImg: function() {
    var $this = this
    var width
    var height
    wx.getSystemInfo({
      success(res) {
        width = res.screenWidth
        height = res.screenHeight
      }
    })
    var ctx = wx.createCanvasContext('mycanvas');
    var path = $this.data.userInfo.invite_bg_img; //背景图片
    var path2 = $this.data.userInfo.avatar //头像图片
    var name = $this.data.userInfo.nickname
    var invite_code = $this.data.userInfo.invite_code
    ctx.drawImage(path, 0, 0, 0.8 * width, 0.58 * height); //绘制图片模板的背景图片
    ctx.drawImage(path2, 30, 20, 60, 60); // 绘制头像
    //绘制昵称
    ctx.setFontSize(16);
    ctx.setFillStyle('#fff');
    ctx.fillText(name, 110, 35);
    ctx.stroke();
    //绘制邀请码
    ctx.setFontSize(18);
    ctx.setFillStyle('#000');
    ctx.fillText(invite_code, 0.8 * width * 0.25, 0.58 * height * 0.82);
    ctx.stroke();
    var path1 = $this.data.userInfo.invitation_code_img //二维码图片
    ctx.drawImage(path1, 0.8 * width * 0.7, 0.58 * height * 0.72, 0.8 * width * 0.25, 0.8 * width * 0.25); //绘制图片模板的二维码
    ctx.draw(true, () => {
      var that = this
      wx.canvasToTempFilePath({
        canvasId: 'mycanvas',
        success: res => {
          that.data.haibaoImg = res.tempFilePath
        }
      })
    })

  },

  // 保存图片事件
  saveImg: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.haibaoImg,
      success(res) {
        wx.showToast({
          title: '保存成功',
        });
      },
      fail(res) {
        console.log(res)
      }
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
  onShow: function() {
    if (!checkReLoad) this.request_mine();
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
    this.request_mine();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    let that = this;
    return {
      title: '友车圈圈', // 转发后 所显示的title
      path: '/pages/cooperationSupply/cooperationSupply?inviter_user_id='+wx.getStorageSync("user_id"), // 相对的路径
      // imageUrl: app.globalData.imgUrl + that.data.shareInfo.shares_img
    }
  },
})