// pages/splash/splash.js — 启动页
Page({
  data: {
    showContent: false,
  },

  onLoad() {
    // 启动后短暂延迟显示内容（入场动画）
    setTimeout(() => {
      this.setData({ showContent: true });
    }, 300);

    // 2.8 秒后自动跳转 Home 页
    setTimeout(() => {
      wx.switchTab({ url: '/pages/home/home' });
    }, 2800);
  },
});
