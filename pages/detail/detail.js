// pages/detail.js
const app = getApp()

Page({
  data: {
    plus: "+ 点歌",
    mark: "✓ 点歌",
    tip: "拼命加载中...",
    show: true,
    showtip: true,
    classes: "", //类型
    albumid: "", //推荐歌单id
    songInfo: [], //歌曲数据
    sourceType: "", //点歌来源
    indexpre: 0, //起始位置
    indexend: 15, //终止位置
    selectIdList: [], //已点歌单ID
    loadFlag: true, //是否可以上拉加载
    songName:"", //热门歌星

  },
  onLoad: function(options) {
    let that = this;
    console.log(options)
    if (options.class == "recommend" && options.albumid != undefined) { //推荐歌单进入
      //查询歌曲
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'QuerySonglist',
          ListType: 3,
          albumid: options.albumid,
          roomKey: app.globalData.mid,
          opendi: app.globalData.openid,
          indexpre: 0,
          indexend: 15
        },
        method: "GET",
        success: function(res) {
          console.log("推荐歌单", res.data)
          that.setData({
            classes: options.class,
            albumid: options.albumid,
            songInfo: res.data.result[0].songinfo,
            show: false,
            sourceType: 4
          })
          if (app.globalData.link) {
            // that.querySelect()
            that.setData({
              selectIdList: app.globalData.hasSong
            })
          }
        }
      })
    } else if (options.class == "Myresinging") { //我的常唱进入
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'QuerySonglist',
          ListType: 2,
          // roomKey: app.globalData.mid,
          openid: app.globalData.openid,
          indexpre: 0,
          indexend: 15
        },
        method: "GET",
        success: function(res) {
          console.log("我的常唱", res.data)
          that.setData({
            classes: options.class,
            songInfo: res.data.result,
            show: false,
            sourceType: 3
          })
          if (app.globalData.link) {
            // that.querySelect()
            that.setData({
              selectIdList: app.globalData.hasSong
            })
          }
        }
      })
    } else if (options.class == "rank") { //热歌榜进入
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'QuerySonglist',
          ListType: 4,
          roomKey: app.globalData.mid,
          openid: app.globalData.openid,
          indexpre: 0,
          indexend: 15
        },
        method: "GET",
        success: function(res) {
          console.log(res.data)
          let songArr = res.data.result[0].songinfo;
          that.setData({
            classes: options.class,
            songInfo: songArr,
            show: false,
            sourceType: 2
          })
          if (app.globalData.link) {
            // that.querySelect()
            that.setData({
              selectIdList: app.globalData.hasSong
            })
          }
        }
      })
    } else if (options.class == "singer") { //歌星点歌进入
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'SearchSongOrSinger',
          searchKey: options.songName
        },
        success: function(res) {
          console.log(res.data.result)
          that.setData({
            classes: options.class,
            songInfo: res.data.result,
            show: false,
            sourceType: 2,
            songName: options.songName
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
  onReachBottom: function() { //上拉加载
    let that = this;
    if (that.data.loadFlag) {
      that.setData({
        indexpre: that.data.indexpre + 16,
        indexend: that.data.indexend + 16,
        tip: "拼命加载中...",
        show: true
      })
      if (that.data.classes == "recommend" && that.data.albumid != undefined) {
        wx.request({
          url: app.globalData.url,
          data: {
            cmd: 'QuerySonglist',
            ListType: 3,
            albumid: that.data.albumid,
            roomKey: app.globalData.mid,
            opendi: app.globalData.openid,
            indexpre: that.data.indexpre,
            indexend: that.data.indexend
          },
          method: "GET",
          success: function(res) {
            console.log(res.data.result[0].songinfo)
            if (res.data.result[0].songinfo.length > 0) {
              that.setData({
                songInfo: that.data.songInfo.concat(res.data.result[0].songinfo),
                show: false
              })
              if (app.globalData.link) {
                that.querySelect()
              }
            } else {
              that.setData({
                tip: "没有更多内容了",
                show: true,
                showtip: false,
                loadFlag: false
              })
            }
          }
        })
      } else if (that.data.classes == "Myresinging") { //我的常唱进入
        wx.request({
          url: app.globalData.url,
          data: {
            cmd: 'QuerySonglist',
            ListType: 2,
            // roomKey: app.globalData.mid,
            openid: app.globalData.openid,
            indexpre: that.data.indexpre,
            indexend: that.data.indexend
          },
          method: "GET",
          success: function(res) {
            if (res.data.result.length > 0) {
              that.setData({
                songInfo: that.data.songInfo.concat(res.data.result),
                show: false
              })
              if (app.globalData.link) {
                that.querySelect()
              }
            } else {
              that.setData({
                tip: "没有更多内容了",
                show: true,
                showtip: false,
                loadFlag: false
              })
            }
          }
        })
      } else if (that.data.classes == "rank") { //热歌榜进入
        wx.request({
          url: app.globalData.url,
          data: {
            cmd: 'QuerySonglist',
            ListType: 4,
            roomKey: app.globalData.mid,
            openid: app.globalData.openid,
            indexpre: that.data.indexpre,
            indexend: that.data.indexend
          },
          method: "GET",
          success: function(res) {
            let songArr = res.data.result[0].songinfo;
            if (songArr.length > 0) {
              that.setData({
                songInfo: that.data.songInfo.concat(songArr),
                show: false
              })
              if (app.globalData.link) {
                that.querySelect()
              }
            } else {
              that.setData({
                tip: "没有更多内容了",
                show: true,
                showtip: false,
                loadFlag: false
              })
            }
          }
        })
      } else if (that.data.classes == "singer") { //歌星点歌进入
        that.setData({
          tip: "没有更多内容了",
          show: true,
          showtip: false,
          loadFlag: false
        })
      }
    }
  },
  //点歌
  clickBtnsong: function(e) {
    let that = this;
    let songid = e.currentTarget.dataset.singid;
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
          sourceType: that.data.sourceType
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
          if (res.data.status == 1){
            //点歌成功
          } else if (res.data.status == 0 && res.data.error_code == 10005){
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
  // 点歌回首页
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
  }

})