/****
 * wx.request、wx.uploadFile 封装
 */
const apiHttp = "https://czz.junyiqiche.com/addons/cms/wxapp.";
const socketHttp = "https://czz.junyiqiche.com/addons/cms/wxapp.";
function fun(url, method, data, header) {
  data = data || {};
  header = header || { 'content-type': 'application/json'};
  let user_id = wx.getStorageSync("user_id");
  if (user_id) {
    data.user_id = user_id;
  }
  //wx.showNavigationBarLoading();
  wx.showLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.request({
      url: apiHttp + url,
      header: header,
      data: data,
      method: method,
      success: function (res) {
        if (typeof res.data === "object") {
          if (res.data.code) {
            if (res.data.code === 410) {
              /*wx.showToast({
                title: "为确保能向您提供最准确的服务，请退出应用重新授权",
                icon: "none"
              });*/
              console.log('请重新登录')
              reject("请重新登录");
              wx.redirectTo({
                url: '../index/index',
              })
            } 
          }
        }
        resolve(res);
      },
     // fail: reject,
     fail:function(){
        wx.redirectTo({
          url: '../404/404',
        })
     },
      complete: function () {
        //wx.hideNavigationBarLoading();
        wx.hideLoading();
        wx.stopPullDownRefresh();
      }
    });
  });
  return promise;
}
function upload(url, name, filePath,formData) {
  let header = {};
  /**let user_id = wx.getStorageSync("user_id");
  if (user_id) {
    formData.user_id = user_id;
  }**/
  wx.showNavigationBarLoading();
  let promise = new Promise(function (resolve, reject) {
    wx.uploadFile({
      url: apiHttp + url,
      filePath: filePath,
      formData: formData,
      name: name,
      header: header,
      success: function (res) {
        resolve(res);
      },
      fail: reject,
      complete: function () {
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      }
    });
  });
  return promise;
}
//多张图片上传
function uploadimg(data) {
    var that = this,
    i = data.i ? data.i : 0,
    success = data.success ? data.success : 0,
    fail = data.fail ? data.fail : 0;
    wx.uploadFile({
     url: data.url,
     filePath: data.path[i],
     name: 'file',
     formData: null,
     success: (resp) => {
       success++;
       console.log(resp)
       console.log(i);
       //这里可能有BUG，失败也会执行这里
     },
     fail: (res) => {
       fail++;
       console.log('fail:' + i + "fail:" + fail);
     },
     complete: () => {
       console.log(i);
       i++;
       if (i == data.path.length) { //当图片传完时，停止调用 
        console.log('执行完毕');
        console.log('成功：' + success + " 失败：" + fail);
      } else {//若图片还没有传完，则继续调用函数
        console.log(i);
        data.i = i;
        data.success = success;
        data.fail = fail;
        that.uploadimg(data);
      }
    }
  });
}


module.exports = {
  apiHttp: apiHttp,
  socketHttp: socketHttp,
  "get": function (url, data, header) {
    return fun(url, "GET", data, header);
  },
  "post": function (url, data, header) {
    return fun(url, "POST", data, header);
  },
  upload: function (url, name, filePath) {
    return upload(url, name, filePath);
  }
};

