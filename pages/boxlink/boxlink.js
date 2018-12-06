const app = getApp()

Page({
  data: {
    // show1:false,
    show2: false,
    bindNum: "", //绑定码


  },
  onLoad: function() {

  },
  onShow: function() {
    if (app.globalData.link == true) {
      this.setData({
        show2: true,
        bindNum: app.globalData.MachineId
      })
    }else{
      this.setData({
        show2: false,
        bindNum: ""
      })
    }
  },
  //点击手动输入绑定码
  // inBindnum:function(){
  //   this.setData({
  //     show1: true
  //   })
  // },
  //获取绑定码
  // inputVal:function(e){
  //   this.setData({
  //     bindNum: e.detail.value
  //   })
  // },
  //点击链接包厢
  // clickLink:function(){
  //   let that=this;
  //   wx.request({
  //     url: app.globalData.url,
  //     data: {
  //       cmd: 'Connect',
  //       roomKey: that.data.bindNum
  //     },
  //     method: "GET",
  //     success: function (res) {
  //       app.globalData.mid = res.data.result[0].MachineId;
  //       that.setData({
  //         show1: false,
  //         show2:true
  //       })

  //     }
  //   })
  // },
  //隐藏弹窗
  // hideAlert:function(){
  //   this.setData({
  //     show1: false
  //   })
  // },

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
              console.log(e)
              if (e.data.result.length > 0) {
                app.globalData.mid = roomkeynow;
                app.globalData.link = true;
                app.globalData.firstLink = true;
                app.globalData.MachineId = e.data.result[0].MachineId;
                that.setData({
                  // show1: false,
                  show2: true,
                  bindNum: e.data.result[0].MachineId
                })
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
  //断开连接
  outlink: function() {
    app.globalData.mid = null;
    app.globalData.link = false;
    app.globalData.MachineId = null;
    this.setData({
      // show1: false,
      show2: false,
      bindNum: ""
    })
  }

})