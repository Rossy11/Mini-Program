// pages/search/search.js
const app = getApp()

Page({
  data: {
    plus: "+ 点歌",
    mark: "✓ 点歌",
    tip: "拼命加载中...",
    showtip: false,
    showtipimg: true,
    inputVal: "", //input值
    searchList: [], //搜索后的值
    selectIdList: [], //已点歌单ID

  },
  onLoad: function(options) {

  },
  // 点歌跳转
  clickChoose: function() {
    wx.switchTab({
      url: '../index/index'
    })
  },
  //遥控
  clickControl: function() {
    wx.switchTab({
      url: '../control/control'
    })
  },
  //链接
  clickLink: function() {
    wx.switchTab({
      url: '../boxlink/boxlink'
    })
  },
  //获取输入框val
  inputVal: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  //清空搜索框
  clearInput: function() {
    this.setData({
      inputVal: ""
    })
  },
  //搜索
  searchSong: function() {
    let that = this;
    let searchKey = this.data.inputVal;
    if (searchKey !== "") {
      that.setData({
        showtip: true,
        showtipimg: true,
        tip: "拼命加载中..."
      })
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'SearchSongOrSinger',
          searchKey: searchKey
        },
        method: "GET",
        success: function(res) {
          console.log("搜索", res.data.result)
          that.setData({
            searchList: res.data.result,
            showtip: true,
            showtipimg: false,
            tip: "没有更多内容了"
          })
          if (app.globalData.link) {
            // that.querySelect()
            that.setData({
              selectIdList: app.globalData.hasSong
            })
          }
        }
      })
    }
  },
  //点歌--搜索点歌
  clickSong: function(e) {
    let songid = e.currentTarget.dataset.songid;
    let that = this;
    let thisId = [];
    thisId.push(songid);
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      that.setData({
        selectIdList: that.data.selectIdList.concat(thisId),
      })
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'AddSong',
          songid: songid,
          roomKey: app.globalData.mid,
          openid: app.globalData.openid,
          sourceType: 0
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            selectIdList: res.data.result
          })
          if (res.data.status == 1) {
            //点个成功
          } else if (res.data.status == 0 && res.data.error_code == 10005) {
            wx.showToast({
              title: '认证码失效，请重新扫码链接',
              icon: 'none'
            })
            app.globalData.mid = null;
            app.globalData.link = false;
            app.globalData.MachineId = null;
          }
        }
      })
    } else if (app.globalData.link == true && app.globalData.queryStatus == false) {
      wx.navigateTo({
        url: '../pay/pay'
      })
    } else {
      wx.switchTab({
        url: '../boxlink/boxlink'
      })
    }
  },
  //点击歌手
  clickSinger: function() {
    wx.navigateTo({
      url: '../detail/detail?class=singer'
    })
  },
  //查询已点歌单
  querySelect: function() {
    let that = this;
    wx.request({
      url: app.globalData.url,
      data: {
        cmd: 'QuerySonglist',
        ListType: 1,
        roomKey: app.globalData.mid,
        openid: app.globalData.openid,
        indexpre: 0,
        indexend: -1
      },
      method: "GET",
      success: function(res) {
        console.log("已点歌单", res.data.result)
        let selArr = [];
        for (var i = 0; i < res.data.result.length; i++) {
          selArr.push(res.data.result[i].song_no)
        }
        that.setData({
          selectIdList: selArr
        })

      }
    })
  },


})