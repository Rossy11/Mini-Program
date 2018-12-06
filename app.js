//app.js
App({
  onLaunch: function() {
     
  },
  globalData: {
    url: "xxxxx", //url
    link:false, //是否连接房间
    openid:null, //用户唯一id
    mid: 111111, //默认房间认证码
    selectSongNum:0, //已点歌单的数量
    MachineId:null, //机器id
    queryStatus:false, //是否查询机器使用状态
    goPay:0, //是否跳转支付界面
    hasSong:[], //已点歌单id
    hasSongDetail:[], //已点歌单详情
    firstLink:true, //是否第一次登陆

  }
})
