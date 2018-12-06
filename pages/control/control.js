//logs.js
const app = getApp()
const util = require('../../utils/util.js')

Page({
  data: {
    logs: [],
    showInput: false,
    inputVal: "",
    color: "e4ccb2", //默认颜色
    c: ["#f5a623", "#fff", "#fff", "#fff", "#fff", "#fff"],
    t: "", //计时器
    RequestTask: "", //请求任务
    longPress:false, //是否长按

  },
  onLoad: function() {

  },
  control: function(type) {
    let that = this;
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      that.data.RequestTask = wx.request({
        url: app.globalData.url,
        data: {
          cmd: 'SendControlCmd',
          ControlType: type,
          roomKey: app.globalData.mid
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log(res.data)
          if (res.data.status == 1) {
            if (type == 2 || type == 0) {
              wx.showToast({
                title: '操作成功',
                icon: 'none'
              })
            } else if (type == 12) {
              if (res.data.error_code != undefined) {
                wx.showToast({
                  title: '已经是双人模式',
                  icon: 'none'
                })
              } else {
                wx.showToast({
                  title: '已切换双人模式！',
                  icon: 'none'
                })
              }
            }
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
  //原唱/伴唱
  sing: function() {
    this.setData({
      longPress: false
    })
    this.control(0)
  },
  //切歌
  changeSong: function() {
    this.setData({
      longPress: false
    })
    this.control(2)
  },
  //双人
  resing: function() {
    this.setData({
      longPress: false
    })
    this.control(12)
  },
  //效果音++++
  effectPlus: function() {
    this.setData({
      longPress: false
    })
    this.control(6);
  },
  //长按效果音++++
  effectPluslong: function() {
    this.longPressEvent(6)
  },

  //效果音----
  effectMin: function() {
    this.setData({
      longPress:false
    })
    this.control(7);
  },
  //长按效果音----
  effectMinlong: function() {
    this.longPressEvent(7)
  },
  //触摸结束
  touchend: function() {
    let that = this;
    if (that.data.longPress){
      that.data.RequestTask.abort();
    }
    clearInterval(that.data.t);
  },
  //长按事件
  longPressEvent:function(id){
    let that = this;
    if (app.globalData.link == true && app.globalData.queryStatus == true) {
      that.setData({
        longPress: true
      })
      that.data.t = setInterval(function () {
        that.control(id);
      }, 300)
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

  //麦克风++++
  macPlus: function() {
    this.setData({
      longPress: false
    })
    this.control(8)
  },
  //长按麦克风++++
  macPluslong: function () {
    this.longPressEvent(8)
  },
  //麦克风----
  macMin: function() {
    this.setData({
      longPress: false
    })
    this.control(9)
  },
  //长按麦克风----
  macMinlong:function(){
    this.longPressEvent(9)
  },



  //音乐++++
  musicPlus: function() {
    this.setData({
      longPress: false
    })
    this.control(10)
  },
  //长按音乐++++
  musicPluslong: function () {
    this.longPressEvent(10)
  },
  //音乐----
  musicMin: function() {
    this.setData({
      longPress: false
    })
    this.control(11)
  },
  //长按音乐----
  musicMinlong: function () {
    this.longPressEvent(11)
  },


  //发送弹幕
  barrage: function() {
    let that = this;
    that.setData({
      showInput: true
    })
    // if (app.globalData.link == true && app.globalData.queryStatus == true){

    // } else if (app.globalData.link == true && app.globalData.queryStatus == false) {
    //   wx.navigateTo({
    //     url: '../pay/pay'
    //   })
    // } else {
    //   wx.switchTab({
    //     url: '../boxlink/boxlink'
    //   })
    // }
  },
  //获取输入框val
  inputVal: function(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },
  hiddleInput: function() {
    this.setData({
      showInput: false
    })
  },
  showInputs: function() {
    this.setData({
      showInput: true
    })
  },
  setBorder: function(e) {
    let thisColor = e.currentTarget.dataset.color;
    if (thisColor == "1") {
      this.setData({
        color: "e4ccb2",
        c: ["#f5a623", "#fff", "#fff", "#fff", "#fff", "#fff"]
      })
    } else if (thisColor == "2") {
      this.setData({
        color: "d3b8ad",
        c: ["#fff", "#f5a623", "#fff", "#fff", "#fff", "#fff"]
      })
    } else if (thisColor == "3") {
      this.setData({
        color: "c2cedc",
        c: ["#fff", "#fff", "#f5a623", "#fff", "#fff", "#fff"]
      })
    } else if (thisColor == "4") {
      this.setData({
        color: "b8c4ba",
        c: ["#fff", "#fff", "#fff", "#f5a623", "#fff", "#fff"]
      })
    } else if (thisColor == "5") {
      this.setData({
        color: "b67e83",
        c: ["#fff", "#fff", "#fff", "#fff", "#f5a623", "#fff"]
      })
    } else if (thisColor == "6") {
      this.setData({
        color: "9da691",
        c: ["#fff", "#fff", "#fff", "#fff", "#fff", "#f5a623"]
      })
    }
  }

})