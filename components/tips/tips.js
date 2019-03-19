// components/tips/tips.js
var $http = require('../../utils/http.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    paramAtoB: String   //接收父组件传递过来的参数
  },

  /**
   * 组件的初始数据
   */
  data: {
    msg:'',
    code:'',
    sureMsg:'去认证'
  },

  attached: function () {
    var that = this
    that.setData({
      msg: that.properties.paramAtoB.split('+')[0],
      code: that.properties.paramAtoB.split('+')[1],
    })
    if (that.data.code==4){
      that.setData({
        sureMsg: '去支付'
      })
    }else if(that.data.code == 5){
      that.setData({
        sureMsg: '查看原因'
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

    // 取消弹出提示框
    cancelShowModal: function (e) {
      var that = this
      console.log(e.detail.formId)
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 1];  //当前页面
      prevPage.setData({
        showModal: false
      })
      $http.post('form_ids/storageFormIds', {  //存储用户formID
        formId: e.detail.formId
      }).then(res=>{
        console.log(res)
      })
    },
    
    //提示框 点击确认事件
    goAuthentication: function () {
      var that = this
      if(that.data.code == 1){
        wx.navigateTo({
          url: '/pages/cooperationSupply/cooperationSupply'
        })
      } else if (that.data.code == 4) {
        wx.navigateTo({
          url: '/pages/order/order'
        })
      } else if (that.data.code == 5){
        wx.navigateTo({
          url: '/pages/cooperationSupply/cooperationSupply'
        })
      }
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 1];  //当前页面
      prevPage.setData({
        showModal: false
      })
    },
  }
})
