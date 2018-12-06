// pages/singer/singer.js
const app = getApp()

Page({
  data: {
    type:"",//歌手类型

  },
  onLoad: function (options) {
    this.setData({
      type: options.type
    })  

  },
  // 点歌
  clickChoose: function () {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //遥控
  clickControl: function () {
    wx.switchTab({
      url: '../control/control'
    })
  },
  //链接
  clickLink: function () {
    wx.switchTab({
      url: '../boxlink/boxlink'
    })
  },
  //点击歌手跳转
  clickStar:function(){
    wx.navigateTo({
      url: '../detail/detail?class=singer'
    })
  }

})