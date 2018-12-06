//index.js
const app = getApp()

Page({
  data: {
    plus: "+ 点歌",
    mark: "✓ 点歌",
    showtip: true,
    showtip2: false,
    selectnum: 0, //已点歌曲数量
    recommend: [], //推荐歌单
    myRegList: [], //我的常唱
    welshow: true,
    tshow: false,
    usershow: false,
    ershow: true,
    id: "", //ID
    selectIdList: [], //已点歌单ID
    endTime: 0, //剩余时间
    timeMark: false,
    timer: "", //计时器
    rawData: "",

  },
  onLoad: function(options) {
    console.log(options)
    var that = this;
    let roomkeys = options.scene;
    wx.getUserInfo({
      success: function(result) {
        console.log('用户信息', result)
        that.setData({
          rawData: result.rawData
        })
      }
    })
    if (roomkeys != undefined) {
      wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'Connect',
          roomKey: roomkeys
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(e) {
          console.log(e.data)
          app.globalData.MachineId = e.data.result[0].MachineId;
          app.globalData.mid = roomkeys;
          app.globalData.link = true;
          app.globalData.goPay = 3;
          that.setData({
            usershow: true,
            ershow: false,
            welshow: false,
            tshow: true,
            id: e.data.result[0].MachineId
          })
          that.querySelect(); //查询已点歌单
          that.queryState(); //查询机器使用状态
          that.data.timer = setInterval(function() {
            if (app.globalData.queryStatus) {
              that.queryState(); //查询机器使用状态
              that.querySelect(); //查询已点歌单
            }
          }, 10000)

        }
      })
    }

    wx.login({
      success: function(res) {
        console.log("code:", res.code)
        if (res.code) {
          wx.request({
            url: app.globalData.url,
            data: {
              code: res.code,
              rawData: that.data.rawData,
              cmd: "code",
              roomKey: roomkeys
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(e) {
              app.globalData.openid = e.data.result.openid;
              console.log(app.globalData.openid)
              //查询我的常唱
              wx.request({
                url: app.globalData.url,
                data: {
                  cmd: 'QuerySonglist',
                  ListType: 2,
                  openid: app.globalData.openid,
                  // roomKey: app.globalData.mid,
                  indexpre: 0, //起始索引
                  indexend: 2 //终止索引
                },
                method: "GET",
                success: function(res) {
                  console.log("我的常唱", res.data)
                  that.setData({
                    myRegList: res.data.result,
                    showtip: false,
                    showtip2: true
                  })

                }
              })
            }
          })

        }
      }
    })
    //查询推荐歌单
    wx.request({
      url: app.globalData.url,
      data: {
        cmd: 'ReadAlbum',
        type: 1,
        roomKey: app.globalData.mid
      },
      method: "GET",
      success: function(res) {
        console.log("推荐歌单", res.data)
        that.setData({
          recommend: res.data.result
        })
      }
    })


  },
  onShow: function(e) { //每次页面打开都会调用
    var that = this;
    app.globalData.goPay++;
    if (app.globalData.link) {
      that.setData({
        usershow: true,
        ershow: false,
        welshow: false,
        tshow: true,
        id: app.globalData.MachineId
      })
      that.querySelect(); //查询已点歌单
      that.queryState(); //查询机器使用状态
      that.data.timer = setInterval(function() {
        if (app.globalData.queryStatus) {
          that.queryState();
          that.querySelect();
        }
      }, 10000)

    } else {
      that.setData({
        usershow: false,
        ershow: true,
        welshow: true,
        tshow: false,
        selectnum: 0
      })
    }

  },
  //查询机器使用状态 
  queryState: function() {
    let that = this;
    wx.request({
      url: app.globalData.url,
      data: {
        cmd: 'queryMachineStatus',
        roomKey: app.globalData.mid
      },
      success: function(res) {
        console.log("机器使用状态", res.data.result)
        if (res.data.result.end_time > 0) {
          app.globalData.queryStatus = true;
          app.globalData.firstLink = false;
          that.setData({
            timeMark: true,
            endTime: (res.data.result.end_time / 60).toFixed(1),
            selectnum: res.data.result.count
          })
        } else if (res.data.result == undefined) {
          app.globalData.queryStatus = false;
          app.globalData.link = false;
          that.setData({
            usershow: false,
            ershow: true,
            welshow: true,
            tshow: false,
            selectnum: 0,
          })
        } else {
          app.globalData.queryStatus = false;
          if (app.globalData.firstLink == false) {
            app.globalData.link = false;
            that.setData({
              usershow: false,
              ershow: true,
              welshow: true,
              tshow: false,
            })
          }
          that.setData({
            timeMark: false,
            endTime: (res.data.result.end_time / 60).toFixed(1),
            selectnum: 0,
            selectIdList: []
          })
          console.log("goPay:", app.globalData.goPay)
          if (app.globalData.goPay == 3) {
            wx.navigateTo({
              url: '../pay/pay'
            })
          }
        }
      }
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
        if (res.data.result == undefined) {
          app.globalData.queryStatus = false;
          app.globalData.link = false;
          that.setData({
            usershow: false,
            ershow: true,
            welshow: true,
            tshow: false,
            selectnum: 0,
          })
        }
        let selArr = [];
        for (var i = 0; i < res.data.result.length; i++) {
          selArr.push(res.data.result[i].song_no)
        }
        that.setData({
          selectIdList: selArr
        })
        app.globalData.hasSong = selArr;
        app.globalData.hasSongDetail = res.data.result;
        if (that.data.endTime == 0) {
          that.setData({
            selectIdList: []
          })
        }
      }
    })
  },
  // 歌星点歌
  clickStar: function() {
    wx.navigateTo({
      url: '../star/star'
    })
  },
  //排行榜
  clickRank: function() {
    wx.navigateTo({
      url: '../rank/rank'
    })
  },
  //搜索框
  clickInput: function() {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  //查看更多
  lookMore: function() {
    wx.navigateTo({
      url: '../detail/detail?class=Myresinging'
    })
  },
  //已点
  clickSelect: function() {
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
  //切歌
  changeSong: function() {
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
          console.log(res.data)
          if (res.data.status == 1) {
            wx.showToast({
              title: '已切歌',
              icon: 'none'
            })
          } else if (res.data.status == 0 && res.data.error_code == 10005) {
            wx.showToast({
              title: '认证码失效，请重新扫码链接',
              icon: 'none'
            })
            app.globalData.mid = null;
            app.globalData.link = false;
            app.globalData.MachineId = null;
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
  //推荐歌单
  clickRecommend: function(e) {
    let albumid = e.currentTarget.dataset.albumid;
    wx.navigateTo({
      url: '../detail/detail?class=recommend&albumid=' + albumid
    })
  },
  //点歌--我的常唱
  chooseSong: function(e) {
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
          sourceType: 3
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log("已点返回数据", res.data)
          if (res.data.status == 1) {
            app.globalData.hasSong = res.data.result;
          } else if (res.data.status == 0 && res.data.error_code == 10005) {
            wx.showToast({
              title: '认证码失效，请重新扫码链接',
              icon: 'none'
            })
            app.globalData.mid = null;
            app.globalData.link = false;
            app.globalData.MachineId = null;
          }
          that.setData({
            selectIdList: res.data.result,
            selectnum: res.data.result.length
          })
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
  //扫码
  Scavenging: function() {
    let that = this;
    wx.scanCode({
      onlyFromCamera: true, // 只允许从相机扫码
      success: (res) => {
        console.log(res)
        if (res.path) {
          let roomkeynow = res.path.split("?scene=")[1];
          wx.request({
            url: app.globalData.url,
            data: {
              cmd: 'Connect',
              roomKey: roomkeynow
            },
            method: "POST",
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function(e) {
              if (e.data.result.length > 0) {
                app.globalData.MachineId = e.data.result[0].MachineId;
                app.globalData.mid = roomkeynow;
                app.globalData.link = true;
                app.globalData.firstLink = true;
                app.globalData.goPay++;
                that.setData({
                  usershow: true,
                  ershow: false,
                  welshow: false,
                  tshow: true,
                  id: e.data.result[0].MachineId
                })
                that.querySelect(); //查询已点歌单
                that.queryState(); //查询机器使用状态
                that.data.timer = setInterval(function() {
                  if (app.globalData.queryStatus) {
                    that.queryState(); //查询机器使用状态
                    that.querySelect(); //查询已点歌单
                  }
                }, 10000)
              } else {
                wx.showToast({
                  title: '二维码无效，请重新扫码链接',
                  icon: 'none'
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '二维码无效，请重新扫码链接',
            icon: 'none'
          })
        }
      }
    })
  },
  //购买套餐
  buy: function() {
    if (app.globalData.link == true && app.globalData.mid != null && app.globalData.MachineId != null) {
      wx.navigateTo({
        url: '../pay/pay'
      })
    } else {
      this.Scavenging()
    }
  },
  onHide: function() {
    var that = this;
    clearInterval(that.data.timer)
  }


})