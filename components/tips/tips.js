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
      wx.navigateTo({
        url: '/pages/cooperationSupply/cooperationSupply'
      })
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 1];  //当前页面
      prevPage.setData({
        showModal: false
      })
    },
  }
})
