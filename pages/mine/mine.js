// pages/mine/mine.js
const app = getApp();
var $http = require('../../utils/http.js');
var util = require('../../utils/md5.js') // 引入md5.js文件


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    userInfo: [],
    haibaoImg: '',
    userName: ' ',
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

  nav_to_page: function(e) {
    var path = e.currentTarget.dataset.path;
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
  nav_to_myshop: function() {
    // var shopId=this.data.company.id;
    // wx.navigateTo({
    //   url: '../myShop/myShop?shopId=' + shopId,
    // })
    wx.showToast({
      title: '即将上线',
      image: '../../images/warn.png',
      duration: 500
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //var user_id=wx.getStorageSync("user_id");

  },
  //测试支付
  pay: function(e) {
    var $this = this;
    $http.post('Wxpay/index', {
      order: new Date().getTime(),
      money: 0.01,
      // formId:e.detail.formId
    }).then(res => {
      console.log(res);
      var timeStamp = (Date.parse(new Date()) / 1000).toString();
      var pkg = 'prepay_id=' + res.data.prepay_id;
      var nonceStr = res.data.nonce_str;
      var appid = res.data.appid;
      var key = res.data.key;
      var paySign = util.hexMD5('appId=' + appid + '&nonceStr=' + nonceStr + '&package=' + pkg + '&signType=MD5&timeStamp=' + timeStamp + "&key=" + key).toUpperCase(); //此处用到hexMD5插件
      // console.log(paySign);
      // return;
      //发起支付
      wx.requestPayment({
        'timeStamp': timeStamp,
        'nonceStr': nonceStr,
        'package': pkg,
        'signType': 'MD5',
        'paySign': paySign,
        'success': function(res) {
          console.log('支付成功');
          //支付成功之后的操作

        }
      });

    });
    console.log(util.hexMD5('asa' + 2342 + '萨芬大苏打'));


  },
  request_mine() {
    var $this = this;
    $http.post('my/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        $this.data.userInfo = resObj.data.userInfo;
        //转化头像图片地址
        if (typeof $this.data.userInfo.avatar === 'string') {
          wx.getImageInfo({ //  小程序获取图片信息API
            src: $this.data.userInfo.avatar,
            success: function(res) {
              // console.log(res.path)
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
                console.log($this.data.userInfo.invitation_code_img)
                console.log(err)
              }
            })
          }
        }
        console.log('我的数据：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var isNewOffer = data.userInfo.isNewOffer;
          $this.setData({
            isNewOffer
          });

        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败,异常回调');
      });
  },



  //二维码点击事件
  erWeiMa: function() {
    var $this = this;
    if ($this.store_has_many) {
      if ($this.store_has_many.auditstatus == 'paid_the_money') {
        if ($this.data.switch1 == 1 && $this.data.switch2 == 1 && $this.data.switch3 == 1) {
          if ($this.data.userInfo.invitation_code_img == '') { //没有生成二维码
            $http.post('my/setQrcode')
              .then(res => {
                $this.request_mine() //重新请求数据
              }).catch(err => {
                //异常回调
                console.log('请求失败,异常回调');
              });
          }
          $this.createNewImg()
          $this.setData({
            showModal: true
          })
        } else {
          wx.showToast({
            title: '生成中',
            icon: 'loading',
            duration: 1000
          })
        }
      } else if ($this.store_has_many.auditstatus == 'in_the_review') {
        wx.showToast({
          title: '审核中',
          image: '../../images/warn.png',
          duration: 1000
        })
      } else if ($this.store_has_many.auditstatus == 'wait_for_review') {
        wx.showToast({
          title: '待审核',
          image: '../../images/warn.png',
          duration: 1000
        })
      } else if ($this.store_has_many.auditstatus == 'wait_for_review') {
        wx.showToast({
          title: '店铺未认证',
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
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        width = res.windowWidth
        height = res.windowHeight
      }
    })
    var ctx = wx.createCanvasContext('mycanvas');
    var path = $this.data.userInfo.invite_bg_img; //背景图片
    var path2 = $this.data.userInfo.avatar //头像图片
    var name = $this.data.userInfo.nickname
    var invite_code = $this.data.userInfo.invite_code
    ctx.drawImage(path, 0, 0, 0.8 * width, 0.72 * height); //绘制图片模板的背景图片
    ctx.drawImage(path2, 30, 20, 60, 60); // 绘制头像
    //绘制昵称
    ctx.setFontSize(16);
    ctx.setFillStyle('#fff');
    ctx.fillText(name, 110, 35);
    ctx.stroke();
    //绘制邀请码
    ctx.setFontSize(18);
    ctx.setFillStyle('#000');
    ctx.fillText(invite_code, 0.8 * width * 0.25, 0.72 * height * 0.82);
    ctx.stroke();
    var path1 = $this.data.userInfo.invitation_code_img //二维码图片
    ctx.drawImage(path1, 0.8 * width * 0.7, 0.72 * height * 0.72, 0.8 * width * 0.25, 0.8 * width * 0.25); //绘制图片模板的二维码
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
    this.request_mine();
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
  onShareAppMessage: function() {

  },
})