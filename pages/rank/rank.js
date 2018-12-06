// pages/rank/rank.js
const app = getApp()

Page({
  data: {
    selectnum:0, //已点歌曲数量
    song1:"1. 星语心愿 - 张柏芝",
    song2:"2. 恋人心 - 魏新雨",
    song3:"3. 小幸运 - 田馥甄(Hebe)"
  
  },
  onLoad: function (options) {
    let that=this;
    wx.request({
      url: app.globalData.url,
      data: {
        cmd: 'QuerySonglist',
        ListType: 4,
        roomKey: app.globalData.mid,
        openid: app.globalData.openid,
        indexpre: 0,
        indexend: 2
      },
      method: "GET",
      success: function (res) {
        let songArr = res.data.result[0].songinfo;
        console.log(songArr)
        that.setData({
          song1: "1. "+songArr[0].name + " - " + songArr[0].singer_names,
          song2: "2. "+songArr[1].name + " - " + songArr[1].singer_names,
          song3: "3. "+songArr[2].name + " - " + songArr[2].singer_names
        })
      }
    })
  
  },
  onShow: function () { //每次页面打开都会调用
    // this.querySelect();
  },
  //查询已点歌单数量
  // querySelect: function () {
  //   let that = this;
  //   wx.request({
  //     url: app.globalData.url,
  //     data: {
  //       cmd: 'QuerySonglist',
  //       ListType: 1,
  //       mid: app.globalData.mid,
  //       index: -2
  //     },
  //     method: "GET",
  //     success: function (res) {
  //       that.setData({
  //         selectnum: res.data.result.length
  //       })
  //     }
  //   })
  // },
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
  haselect: function () {
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
  //点击排行榜
  clickHot:function(){
    wx.navigateTo({
      url: '../detail/detail?class=rank'
    })
  }


})