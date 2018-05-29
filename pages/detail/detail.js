const app = getApp()

Page({
  data: {
    imgUrl: '',
    title: '',
    keyinfo: [],
    alldata: [],
    len: 0,
    info: [],
    newImgUrl:'',
    key:0
  },
  onLoad: function (e) {
    console.log(JSON.parse(e.curTxt))
    this.setData({
      imgUrl: JSON.parse(e.curTxt).url,
      title: JSON.parse(e.curTxt).name,
      keyinfo: JSON.parse(e.curTxt).keyinfo,
      alldata: JSON.parse(e.curTxt),
      len: JSON.parse(e.curTxt).keyinfo.length,
      info: JSON.parse(e.curTxt).keyinfo
    })
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },
  clickBack: function () {
    //返回首页
    wx.navigateBack({
      delta: 1
    })
  },
  //生成图片
  loadImg: function (e) {
    var that=this;
    wx.showLoading({
      title: '生成中',
    })
    wx.request({
      url: 'xxx',
      data: {
        id: this.data.alldata.templateid,
        info: this.data.info
      },
      method: "GET",
      success: function (res) {
        console.log(res.data)
        that.setData({
          newImgUrl:res.data,
          key:1
        })        
      }
    })
  },
  changeImg:function(){
      this.setData({
        imgUrl: this.data.newImgUrl
      })
    wx.hideLoading()
  },
  bindKeyInput: function (e) {
    let items = e.target.dataset;
    items.title = e.detail.value;
    for (var i = 0; i < this.data.len; i++) {
      if (e.target.dataset.xPosition == this.data.info[i].xPosition) {
        this.setData({
          ['info[' + i + ']']: items
        })
      }
    }
    console.log(this.data.info)
  },
  //预览图片
  previewImage: function (e) {
    let current = e.target.dataset.src;
    wx.previewImage({
      current: current,
      urls: [this.data.imgUrl]
    })
  },
}) 
