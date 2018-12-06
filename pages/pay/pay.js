// pages/pay/pay.js
const app = getApp()
var md5 = require("../../utils/md5.js")

Page({
  data: {
    onePrice:"",
    twoPrice:"",
    threePrice:"",
    fourPrice:"",
    oneId:"",
    twoId:"",
    threeId:"",
    fourId:"",
  
  },
  onLoad: function (options) {
    let that=this;
    //获取套餐类型
    wx.request({
      url: app.globalData.url,
      data: {
        cmd: 'queryTradeType',
        roomKey: app.globalData.mid,

      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log("套餐类型",res.data.result)
        let prices = res.data.result;
        that.setData({
          onePrice: prices[0].price,
          twoPrice: prices[1].price,
          threePrice: prices[2].price,
          fourPrice: prices[3].price,
          oneId: prices[0].tradeid,
          twoId: prices[0].tradeid,
          threeId: prices[0].tradeid,
          fourId: prices[0].tradeid
        })
      }
    })
    
  },
  onHide: function () {
    app.globalData.goPay++;
  },
  //支付
  pay:function(num,id,time){
    console.log("请求开始")
    wx.request({
      url: "https://k3-mobile.leyecloud.com/les/release/musicpro/center/app_pay.php",
      data: {
        cmd: 'pay',
        roomKey: app.globalData.mid,
        price: num,
        tradeid:id,
        openid:app.globalData.openid,
        time:time
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.error_code=="10005"){
          app.globalData.link = false;
          wx.switchTab({
            url: '../boxlink/boxlink'
          })
        }else{
          var signA = "appId=" + res.data.appid + "&nonceStr=" + res.data.nonce_str + "&package=prepay_id=" + res.data.prepay_id + "&signType=MD5&timeStamp=" + res.data.time;
          var signB = signA + "&key=" + res.data.key;
          var sign = md5.hex_md5(signB).toUpperCase();
          wx.requestPayment({
            'timeStamp': res.data.time + '',
            'nonceStr': res.data.nonce_str,
            'package': "prepay_id=" + res.data.prepay_id,
            'signType': 'MD5',
            'paySign': sign,
            'success': function (res) {
              wx.switchTab({
                url: '../index/index'
              })
            },
            'fail': function (res) {

            }
          })
        }
      }
    })
  },
  pay1:function(){
    let that=this;
    that.pay(that.data.onePrice, that.data.oneId,60)
  },
  pay2: function () {
    let that = this;
    that.pay(that.data.twoPrice, that.data.twoId,120)
  },
  pay3: function () {
    let that = this;
    that.pay(that.data.threePrice, that.data.threeId,180)
  },
  pay4: function () {
    let that = this;
    that.pay(that.data.fourPrice, that.data.fourId,240)
  }


})