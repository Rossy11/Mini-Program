//index.js
//获取应用实例
const app = getApp()

Page({
  data: {

    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    url: 'https://k3-mobile-new.leyecloud.com/',
    navList:[],//头部导航
    hot:[],//热门
    news:[],//最新
    certificates:[],//证件
    kuso:[], //恶搞
    thisindex:''
  },
  onLoad: function () {
    var that = this;
    //请求分类导航
    wx.request({
      url: that.data.url +"wsc_class/",
      success: function (res) {
        //console.log(res.data)
        that.setData({
          navList:res.data
        })
      }
    })
    //请求热门模板
    wx.request({
      url: that.data.url +"wsc_class_relation/?classid=1",
      success: function (res) {
        //console.log(res.data)
        that.setData({
          hot: res.data
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current, thisindex: e.detail.current + 1});
    console.log(that.data.thisindex)
    //请求模板
    wx.request({
      url: that.data.url + "wsc_class_relation/?classid=" + that.data.thisindex,
      success: function (res) {
        console.log(res.data)
        if (that.data.thisindex==1){
          that.setData({
            hot:res.data
          })
        } else if (that.data.thisindex == 2){
          that.setData({
            news: res.data
          })
        } else if (that.data.thisindex == 3) {
          that.setData({
            certificates: res.data
          })
        } else if (that.data.thisindex == 4) {
          that.setData({
            kuso: res.data
          })
        }
      }
    })
  },
  swichNav: function (e) {
    console.log(e.target.dataset.current)
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  clickBtn:function(e){
    var curTxt = JSON.stringify(e.currentTarget.dataset.location);
    wx.navigateTo({
      url: '../detail/detail?curTxt=' + curTxt
    })

  }
}) 
