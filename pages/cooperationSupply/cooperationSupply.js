// pages/cooperationSupply/cooperationSupply.js
const app = getApp();
var $http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeId:2,
    brandCheckList:[],
    year:['1年以下','1年','2年','3年','3年以上'],
    partnerList:[
      /*{
        id:0,
        value:'铂金店铺 999元/年 （无限发布车源）',
        checked:false
      },
      {
        id: 1,
        value: '黄金店铺 399元 （可发布15次车源）',
        checked: false
      },
      {
        id: 2,
        value: '白银店铺 199元 （可发布7次车源）',
        checked: false
      },*/
      
    ],
    idCardSrc:[],
    form:{
      shopName:'',
      shopRegion:'',
      shopRegionDetail:'',
      context:'',//备注
      time:'1年以下',
      smscode:'',
      inviteNumber:'',
      shopTel:'',
      shopImg:'',
      idCard:'',
      idCardFront:'',
      idCardReverse:'',
      name:'',
      regionImg: '',//营业执照
    },
    regionImg: '',//营业执照
    dtNUm:60,
    appImgUrl: app.globalData.localImgUrl,
    multiIndex: [0, 0],
    timeIndex:0
  },
  /***
   * 事件函数
   */
  //进入页面，首次请求
  come_in_page() {
    var $this = this;
    var form = this.data.form;
    var partnerList = new Array();
    var zimuList = new Array();
    var brandsList = new Array();
    $http.post('Shop/index')
      .then(res => {
        //成功回调
        var resObj = res.data;
        console.log('进入店铺申请：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          var submit_type = data.submit_type;
          form.inviteNumber = data.inviter_code;
          var store_level_list = data.store_level_list;
          var brandList = data.brand_list;
          var fail_default_value = data.fail_default_value;
          if (store_level_list) {
            store_level_list.forEach((val, index) => {
              if (val.condition == 'visible') {
                var obj = {
                  id: val.id,
                  partner_rank: val.partner_rank,
                  money: val.money,
                  explain: val.explain,
                  checked: false
                }
                partnerList.push(obj);
              }
            });
          }
          if (brandList) {
            for (var item in brandList) {
              var obj = {
                index: item,
                name: item
              }
              var brand_list = brandList[item];
              var arr = new Array();
              brand_list.forEach((el, i) => {
                var sObj = {
                  id: el.id,
                  name: el.name
                }
                arr[i] = sObj;
              })
              var obj2 = {
                index: item,
                brands: arr
              }
              zimuList.push(obj);
              brandsList.push(obj2);
            }
          }


          console.log('zimuList:', zimuList);
          console.log('brandsList:', brandsList);
          if (fail_default_value){
           form = {
              shopName: fail_default_value.store_name,
              shopRegion: fail_default_value.cities_name,
              shopRegionDetail: fail_default_value.store_address,
              context: fail_default_value.store_description,//备注
              time: fail_default_value.business_life,
              smscode: '',
              inviteNumber: data.inviter_code,
              shopTel: fail_default_value.phone,
              shopImg: fail_default_value.store_img,
              idCard: fail_default_value.bank_card,
              idCardFront: fail_default_value.id_card_positive,
              idCardReverse: fail_default_value.id_card_opposite,
              regionImg: fail_default_value.business_licenseimages
            }
          }
          
          $this.setData({
            submit_type: submit_type,
            form: form,
            partnerList: partnerList,
            zimuList,
            brandsList,
            brandInfo: [zimuList, brandsList[0].brands]
          });

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
  },
  //切换标题
  switchTitle(e){
      this.setData({
        activeId:e.currentTarget.dataset.id
      })
  },
  //表单input输入事件
  formBindInput(e) {
    console.log(e.currentTarget.dataset.name);
    var keyName = e.currentTarget.dataset.name;
    var form = this.data.form;
    form[keyName] = e.detail.value;
    this.setData({
      form: form
    })
  },
  //经营年限选择
  bindYearChange(e){
      var index=e.detail.value;
      var form=this.data.form;
      var year=this.data.year;
      form.time=year[index];
      this.setData({form:form});
  },
  //邀请码验证
  checkInviteNumber(e){
    var invite=e.detail.value;
    var partnerList=new Array();
    var form=this.data.form;
    var $this=this;
    if (invite){
      $http.post('Shop/check_the_invitation_code', {
        code: invite
      }).then(res => {
        //成功回调
        //成功回调
        var resObj = res.data;
        console.log('邀请码验证：', resObj);
        if (resObj.code == 1) {
          var data = resObj.data;
          wx.showToast({
            title: resObj.msg,
            icon: 'success',
            duration: 3000
          });
          var store_level_list = data.store_level_list;
          if (store_level_list) {
            store_level_list.forEach((val, index) => {
              if (val.condition == 'visible') {
                var obj = {
                  id: val.id,
                  partner_rank: val.partner_rank,
                  money: val.money,
                  explain: val.explain,
                  checked: false
                }
                partnerList.push(obj);
              }
            });
          }
          
          $this.setData({
            partnerList: partnerList
          })
        } else {
          wx.showToast({
            title: resObj.msg,
            image: '../../images/warn.png',
            duration: 3000
          });
          form.inviteNumber = '';
          $this.setData({
            form: form
          })
          console.log('请求失败：', resObj.msg);
        }
      }).catch(err => {
        //异常回调
        console.log('请求失败', err);
      });
    }
    
  },
  shopRegionChange(e){
    console.log('picker发送选择改变，携带值为', e.detail.value);
    var form=this.data.form;
    form.shopRegion = e.detail.value[0] + ' ' + e.detail.value[1] + ' '+e.detail.value[2] ;
    this.setData({
      form: form
    })
  },
  
  chooseBrand(e){
    var index=e.currentTarget.dataset.index;
    var brandCheckList = this.data.brandCheckList;
    var check = brandCheckList[index].check;
    brandCheckList[index].check = !check;
    this.setData({ brandCheckList: brandCheckList})
  },
  
  
  uploadShopImg(e) {
    var $this = this;
    var form = this.data.form;
    wx.chooseImage({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        console.log('tupian:', tempFilePaths)
        wx.uploadFile({
          url: app.globalData.url + 'index/upModelImg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: null,
          success: function (res) {
            wx.hideLoading()
            //上传成功后的图片地址imgUrl，需要与服务器地址（app.js全局设置）做拼接, setData出去做预览
            console.log(JSON.parse(res.data));
            let imgUrl = JSON.parse(res.data).data.url; //eg:'https://czz.junyiqiche.com'+imgUrl
            form.shopImg = imgUrl;
            $this.setData({ form: form });
          },
          fail: function (err) {
            console.log('上传失败：', err)
          }
        });  
      }
    });
  },
  uploadIdFront(e){
    var $this=this;
    var form = this.data.form;
    wx.chooseImage({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.url + 'index/upModelImg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: null,
          success: function (res) {
            wx.hideLoading()
            //上传成功后的图片地址imgUrl，需要与服务器地址（app.js全局设置）做拼接, setData出去做预览
            console.log(JSON.parse(res.data));
            let imgUrl = JSON.parse(res.data).data.url; //eg:'https://czz.junyiqiche.com'+imgUrl
            form.idCardFront = imgUrl;
            $this.setData({ form: form });
          },
          fail: function (err) {
            console.log('上传失败：', err)
          }
        });  
        
      }
    });
  },
  uploadIdReverse(e) {
    var $this = this;
    var form = this.data.form;
    wx.chooseImage({
          count: 1,
          success(res) {
            // tempFilePath可以作为img标签的src属性显示图片
            var tempFilePaths = res.tempFilePaths;
            wx.uploadFile({
              url: app.globalData.url + 'index/upModelImg',
              filePath: tempFilePaths[0],
              name: 'file',
              formData: null,
              success: function (res) {
                wx.hideLoading()
                //上传成功后的图片地址imgUrl，需要与服务器地址（app.js全局设置）做拼接, setData出去做预览
                console.log(JSON.parse(res.data));
                let imgUrl = JSON.parse(res.data).data.url; //eg:'https://czz.junyiqiche.com'+imgUrl
                form.idCardReverse = imgUrl;
                $this.setData({ form: form });
              },
              fail: function (err) {
                console.log('上传失败：', err)
              }
            });
      }
    });
  },
  uploadRegion(e) {
    var $this = this;
    var form = this.data.form;
    wx.chooseImage({
      count:1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: app.globalData.url + 'index/upModelImg',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: null,
          success: function (res) {
            wx.hideLoading()
            //上传成功后的图片地址imgUrl，需要与服务器地址（app.js全局设置）做拼接, setData出去做预览
            console.log(JSON.parse(res.data));
            let imgUrl = JSON.parse(res.data).data.url; //eg:'https://czz.junyiqiche.com'+imgUrl
            $this.data.regionImg = imgUrl;
            $this.setData({
              regionImg: imgUrl
            })
            $this.setData({ form: form });
          },
          fail: function (err) {
            console.log('上传失败：', err)
          }
        });
        
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
  partnerChange(e){
    var index = e.currentTarget.dataset.index;
    
    var check=e.detail.value;
    var partnerList = this.data.partnerList;
    var shop_level_id;
    //console.log('index:', partnerList[index].checked);
    //console.log('check:', check)
    if (check){
      for (var i = 0; i < partnerList.length; i++) {
        partnerList[i].checked =false;
      }
      partnerList[index].checked = true;
      shop_level_id = partnerList[index].id;
    }else{
      for (var i = 0; i < partnerList.length; i++) {
        partnerList[i].checked = false;
      }
    }
    console.log('shop_level_id:', shop_level_id)
    this.setData({
      partnerList: partnerList,
      shop_level_id: shop_level_id
    })
    
    
  },
 
  //品牌相关
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
    var brandCheckList = this.data.brandCheckList;
    var obj={
      id: brandList[e.detail.value[1]].id,
      name: brandList[e.detail.value[1]].name,
      check: false
    }
    brandCheckList.push(obj);
    this.setData({
      brandCheckList: brandCheckList
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
  //表单判空
  checkForm() {
    var form = this.data.form;
    for (var item in form) {
      if (!form[item]&&item!='inviteNumber') {
        return false;
      }
    }
    console.log('true');
    return true;
  },
  //清空表单
  cleanForm() {
    var form = this.data.form;
    for (var item in form) {
      if (item == 'phone') {

      } else {
        form[item] = '';
      }

    }
    this.setData({
      form: form
    })
  },
  checkBrand(){
    var brandCheckList = this.data.brandCheckList;
    for (var i = 0; i < brandCheckList.length;i++){
      if (brandCheckList[i].check){
        return true;
      }
    }
    return false;
  },
  getBrand(){
    var checkBrands=new Array();
    var brandCheckList = this.data.brandCheckList;
    for (var i = 0; i < brandCheckList.length; i++) {
      if (brandCheckList[i].check) {
        checkBrands.push(brandCheckList[i].name);
      }
    }
    return checkBrands;
  },
  formSubmit(e){
    var that = this
    var formId=e.detail.formId;
    var shop_level_id = this.data.shop_level_id;
    var form=this.data.form;
    if (!this.checkForm()){
      wx.showToast({
        title: '请将信息填写完整',
        image: '../../images/warn.png'
      })
    } else if (!this.checkBrand()){
      wx.showToast({
        title: '请选择主营车系',
        image: '../../images/warn.png'
      });
    } else if (!shop_level_id){
      wx.showToast({
        title: '请选择合伙人等级',
        image: '../../images/warn.png'
      })
     }else{
      var checkBrands=this.getBrand();
      var checkBrandStr = checkBrands.join(',');//主营品牌名称，用,连接
      console.log("formId,checkBrandStr:", formId, checkBrandStr);
      var submit_type = this.data.submit_type;
      var auditInfo={
        store_name: form.shopName,
        cities_name: form.shopRegion,
        store_address: form.shopRegionDetail,
        store_description: form.context,
        phone:form.shopTel,
        login_code:form.smscode,
        store_img: form.shopImg,
        business_life:form.time,
        main_camp: checkBrandStr,
        bank_card: form.idCard,
        id_card_positive: form.idCardFront,
        id_card_opposite: form.idCardReverse,
        business_licenseimages:that.data.regionImg,
        level_id: shop_level_id,
        code: form.inviteNumber,
        name:form.name
      }
      $http.post('shop/submit_audit',{
        submit_type: submit_type,
        auditInfo: auditInfo
      })
        .then(res => {
          //成功回调
          var resObj = res.data;
          console.log('表单提交：', resObj);
          if (resObj.code == 1) {
            var data = resObj.data;
            wx.showToast({
              title: resObj.msg,
              icon: 'success'
            });
            wx.navigateTo({
              url: '../order/order',
            })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.come_in_page();
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