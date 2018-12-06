// pages/selectsong/selectsong.js
const app = getApp()

Page({
  data: {
    tip: "拼命加载中...",
    showtip: true,
    showFirst: true,
    playing: [], //正在播放
    selectList: [], //已点歌单
    indexpre: 0, //起始位置
    indexend: -1, //终止位置
    t: ""

  },
  onLoad: function(options) {
    let that = this;
    if (app.globalData.hasSongDetail.length == 0) {
      that.setData({
        showFirst: false
      })
    }
    that.setData({
      playing: app.globalData.hasSongDetail[0],
    })
    app.globalData.hasSongDetail.shift();
    that.setData({
      selectList: app.globalData.hasSongDetail
    })
    that.queryHaselect()
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      that.data.t = setInterval(function() {
        that.queryHaselect()
      }, 10000)
    }

  },
  onUnload: function() {
    var that = this;
    clearInterval(that.data.t)
  },
  queryHaselect: function() {
    let that = this;
    //查询已点歌单
    wx.request({
      url: app.globalData.url,
      data: {
        cmd: 'QuerySonglist',
        ListType: 1,
        roomKey: app.globalData.mid,
        openid: app.globalData.openid,
        indexpre: that.data.indexpre,
        indexend: that.data.indexend
      },
      method: "GET",
      success: function(res) {
        console.log("已点歌单", res.data)
        that.setData({
          playing: res.data.result[0],
        })
        app.globalData.hasSongDetail = res.data.result;
        res.data.result.shift()
        that.setData({
          selectList: res.data.result,
          tip: "没有更多内容了",
          showtip: false
        })
      }
    })
  },
  // onPullDownRefresh: function() { //下拉刷新
  //   wx.showNavigationBarLoading();
  //   let that = this;
  //   //查询已点歌单
  //   wx.request({
  //     url: app.globalData.url,
  //     data: {
  //       cmd: 'QuerySonglist',
  //       ListType: 1,
  //       roomKey: app.globalData.mid,
  //       openid: app.globalData.openid,
  //       indexpre: that.data.indexpre,
  //       indexend: that.data.indexend
  //     },
  //     method: "GET",
  //     success: function(res) {
  //       console.log("已点歌单", res.data)
  //       that.setData({
  //         playing: res.data.result[0],
  //       })
  //       res.data.result.shift()
  //       that.setData({
  //         selectList: res.data.result,
  //         tip: "没有更多内容了",
  //         showtip: false
  //       })
  //       wx.hideNavigationBarLoading();
  //       wx.stopPullDownRefresh();

  //     }
  //   })
  // },
  // 点歌
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
  //播放
  plays: function(e) {

  },
  //删除
  delete: function(e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'HandleSonglist',
          handleType: 3,
          roomKey: app.globalData.mid,
          index: idx
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log("已点歌单", res.data)
          that.setData({
            playing: res.data.result[0],
          })
          res.data.result.shift()
          that.setData({
            selectList: res.data.result,
            tip: "没有更多内容了",
            showtip: false
          })
          if (res.data.status == 1) {
            wx.showToast({
              title: '已删除',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
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
  //置顶
  settop: function(e) {
    let that = this;
    let idx = e.currentTarget.dataset.idx;
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'HandleSonglist',
          handleType: 2,
          roomKey: app.globalData.mid,
          index: idx
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log("已点歌单", res.data)
          that.setData({
            playing: res.data.result[0],
          })
          res.data.result.shift()
          that.setData({
            selectList: res.data.result,
            tip: "没有更多内容了",
            showtip: false
          })
          if (res.data.status == 1) {
            wx.showToast({
              title: '已置顶',
              icon: 'none'
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
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
  //切歌
  changeSong: function() {
    let that = this;
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'SendControlCmd',
          ControlType: 2,
          roomKey: app.globalData.mid
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log("切歌", res.data)
          if (res.data.status == 1) {
            wx.showToast({
              title: '已切歌',
              icon: 'none'
            })
            wx.request({
              url: app.globalData.url,
              data: {
                cmd: 'QuerySonglist',
                ListType: 1,
                roomKey: app.globalData.mid,
                openid: app.globalData.openid,
                indexpre: that.data.indexpre,
                indexend: that.data.indexend
              },
              method: "GET",
              success: function(res) {
                console.log("已点歌单", res.data.result.length)
                if (res.data.result.length > 0) {
                  that.setData({
                    playing: res.data.result[0],
                  })
                  res.data.result.shift()
                  that.setData({
                    selectList: res.data.result,
                    tip: "没有更多内容了",
                    showtip: false
                  })
                } else {
                  that.setData({
                    showFirst: false
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
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
  }


})