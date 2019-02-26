// pages/mine/mine.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    userInfo:[],
    haibaoImg:'',
    userName:' ',
    navList:[
      {
        icon:'',
        name:'我的店铺',
        path:'../myShop/myShop'
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
    posterInfo:
      {
        avatarImg:'',
        nickname:'',
        ewmCode:' ',
        invite_code:'',
        bgImg:''
      }
    
  },

  /**
   * 事件函数
   */
  
  nav_to_page:function(e){
    var path=e.currentTarget.dataset.path;
    if (!path){
      wx.showToast({
        title: '即将上线',
        image: '../../images/warn.png',
        duration: 500
      })
    }else{
      wx.navigateTo({
        url: path,
      })
    }
    
  },
  nav_to_myshop:function(){
    /***var shopId=this.data.company.id;
    wx.navigateTo({
      url: '../myShop/myShop?shopId=' + shopId,
    })*/
    wx.showToast({
      title: '即将上线',
      image:'../../images/warn.png',
      duration: 500
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //var user_id=wx.getStorageSync("user_id");
    
  },
  request_mine(){
    var $this = this;
    $http.post('my/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        //转化二维码头像图片地址
        $this.data.posterInfo.avatarImg = resObj.data.userInfo.avatar;
        if (typeof $this.data.posterInfo.avatarImg === 'string') {
         
          wx.getImageInfo({   //  小程序获取图片信息API
            src: $this.data.posterInfo.avatarImg,
            success: function (res) {
              console.log(res.path)
              $this.data.posterInfo.avatarImg = res.path
            },
            fail(err) {
             
              console.log(err)
            }
          })
        }
        //获取昵称
        $this.data.posterInfo.nickname = resObj.data.userInfo.nickname
        //获取背景图片
        $this.data.posterInfo.bgImg = app.globalData.imgUrl + resObj.data.userInfo.invite_bg_img
        if (typeof $this.data.posterInfo.bgImg === 'string') {

          wx.getImageInfo({   //  小程序获取图片信息API
            src: $this.data.posterInfo.bgImg,
            success: function (res) {
              console.log(res.path)
              $this.data.posterInfo.bgImg = res.path
            },
            fail(err) {
              console.log($this.data.posterInfo.bgImg)
              console.log(err)
            }
          })
        }
        //获取二维码图片地址
        $this.data.posterInfo.ewmCode = app.globalData.localImgUrl + resObj.data.userInfo.invitation_code_img
        if (typeof $this.data.posterInfo.ewmCode === 'string') {

          wx.getImageInfo({   //  小程序获取图片信息API
            src: $this.data.posterInfo.ewmCode,
            success: function (res) {
              console.log(res.path)
              $this.data.posterInfo.ewmCode = res.path
            },
            fail(err) {
              console.log($this.data.posterInfo.ewmCode)
              console.log(err)
            }
          })
        }
        console.log('我的数据：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var company = {
            id: data.userInfo.store_has_many.id,
            qrcode: data.userInfo.store_has_many.store_qrcode
          }
          var isNewOffer = data.userInfo.isNewOffer;
          // var isRealName = data.userInfo.isRealName;
          $this.setData({ company, isNewOffer});

        } else {
          console.log('请求失败：', data.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败,异常回调');
      });
  },
  


  //二维码点击事件
  erWeiMa:function(){

    var $this = this;
    console.log($this.data.posterInfo.nickname);
    // wx.showToast({
    //   title: '即将上线',
    //   image: '../../images/warn.png',
    //   duration: 500
    // })

    $this.createNewImg()
    $this.setData({
      showModal:true
    })

    

    
  },

  //关闭模态框
  closeModalDlg:function(){
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
  createNewImg:function(){
    var that = this
    var ctx = wx.createCanvasContext('mycanvas');
    var path = that.data.posterInfo.bgImg; //底板图片
    var path2 = that.data.posterInfo.avatarImg //头像图片
    var name = that.data.posterInfo.nickname
    ctx.drawImage(path, 0, 0, 300, 450);  //绘制图片模板的底图
    ctx.drawImage(path2, 30, 20, 60, 60); // 绘制头像
    //绘制昵称
    ctx.setFontSize(16);
    ctx.setFillStyle('#fff');
    // ctx.setTextAlign('center');
    ctx.fillText(name, 110, 35);
    ctx.stroke();
    var path1 = that.data.posterInfo.ewmCode //二维码图片
    ctx.drawImage(path1, 205, 330, 80, 80);   //绘制图片模板的二维码
    ctx.draw(true,() =>{
      // wx.canvasToTempFilePath({
      //   canvasId: 'mycanvas',
      //   success: res => {
      //     that.data.haibaoImg = res.tempFilePath
      //   }
      // })
      setTimeout(function () {
        wx.canvasToTempFilePath({
          canvasId: 'mycanvas',
          success: res => {
            that.data.haibaoImg = res.tempFilePath
          }
        })
      }, 500);
    })
    
  },

  // 保存图片事件
  saveImg:function(){
    var that = this
    // wx.canvasToTempFilePath({
    //   canvasId: 'mycanvas',
    //   fileType: 'jpg',
    //   success: function (res) {
    //     console.log(res)
    //     wx.saveImageToPhotosAlbum({
    //       filePath: res.tempFilePath,
    //       success(res) {
    //         wx.showToast({
    //           title: '保存成功',
    //         });
    //       },
    //       fail() {

    //       }
    //     })
    //   }
    // })

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
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.request_mine();
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
    this.request_mine();
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