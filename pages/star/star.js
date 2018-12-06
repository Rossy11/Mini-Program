// pages/star/star.js
const app = getApp()

Page({
  data: {
    hotStar:[], //热门歌星
  
  },
  onLoad: function (options) {
    var that=this;
    //查询热门歌星
    wx.request({
      url: "https://k3-mobile-new.leyecloud.com/center/songdesk/?cmd=hotSinger",
      method: "GET",
      success: function (res) {
        console.log("热门歌星", res.data)
        that.setData({
          hotStar: res.data.result
        })
      }
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
  //搜索框
  clickInput: function () {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //已点
  clickSelect: function () {
    if (app.globalData.link) {
      wx.navigateTo({
        url: '../selectsong/selectsong'
      })
    } else {
      wx.switchTab({
        url: '../boxlink/boxlink'
      })
    }
  },
  //点击热门歌星
  clickHotstar:function(e){
    let songer = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: '../detail/detail?class=singer&songName=' + songer
    })
  },
  //点击type歌手跳转传参
  clicktypestar:function(e){
    let types = e.currentTarget.dataset.typesinger;
    wx.navigateTo({
      url: '../singer/singer?type=' + types
    })

  }


})