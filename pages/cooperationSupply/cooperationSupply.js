// pages/cooperationSupply/cooperationSupply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeId:2,
    brandList:[
      {
      name:'奔驰',
      check:false
      },
      { 
        name:'宝马',
        check:false
      },
      {
        name:'奥迪',
        check: false
        },
      {
        name:'雷克萨斯',
        check: false
        }
        ],
    partnerList:[
      {
        id:0,
        value:'5A级合伙人 2万元 （邀请权限5A级5A以下均可）',
        checked:false
      },
      {
        id: 1,
        value: '3A级合伙人 2万元 （邀请权限3A级3A以下均可）',
        checked: false
      },
      {
        id: 2,
        value: '2A级合伙人 2万元 （邀请权限2A级2A以下均可）',
        checked: false
      },
      {
        id: 3,
        value: 'A级合伙人 2万元 （邀请权限A级A以下均可）',
        checked: false
      },
      {
        id: 4,
        value: 'B级合伙人 2万元 （邀请权限B级B以下均可）',
        checked: false
      },
      {
        id: 5,
        value: 'C级合伙人 2万元 （邀请权限C级C以下均可）',
        checked: false
      },
    ],
    idCardSrc:[],
    form:{
      shopName:'',
      shopRegion:'',
      shopRegionDetail:'',
      shopTel:''
    },
    dtNUm:60
  },
  /***
   * 事件函数
   */
  switchTitle(e){
      this.setData({
        activeId:e.currentTarget.dataset.id
      })
  },
  nameInput(e){
    var form = this.data.form;
    form.shopName = e.detail.value;
    this.setData({
      form: form
    })
  },
  regionDetailInput(e) {
    var form = this.data.form;
    form.shopRegionDetail = e.detail.value;
    this.setData({
      form: form
    })
  },
  shopRegionChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var form=this.data.form;
    form.shopRegion = e.detail.value[0] + ' ' + e.detail.value[1] + ' '+e.detail.value[2] ;
    this.setData({
      form: form
    })
  },
  telInput(e) {
    var form = this.data.form;
    form.shopTel = e.detail.value;
    this.setData({
      form: form
    })
  },
  contextInput(e){
    var form = this.data.form;
    form.context = e.detail.value;
    this.setData({
      form: form
    })
  },
  chooseBrand(e){
     var index=e.currentTarget.dataset.index;
    var brandList = this.data.brandList;
    var check = brandList[index].check;
    brandList[index].check = !check;
    this.setData({ brandList: brandList})
  },
  uploadId(e){
    var $this=this;
    var idCardSrc =this.data.idCardSrc;
    wx.chooseImage({
      count: 2,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        for (var item in tempFilePaths){
          idCardSrc.push(tempFilePaths[item]);
        }
        
        $this.setData({idCardSrc});
      }
    });
  },
  uploadRegion(e) {
    var $this = this;
  
    wx.chooseImage({
      count:1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        

        $this.setData({ regionSrc: tempFilePaths });
      }
    });
  },
  //获取短信验证码
  get_sms_code: function () {
    var telInput = this.data.form.shopTel;
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
            var timer = setInterval(function () {
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
                that.setData({ dtNUm: dtNUm });
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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