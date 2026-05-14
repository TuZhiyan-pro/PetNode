const app = getApp();

Page({
  data: {
    isDark: true,
    tempArray: ['摄氏度 ℃', '华氏度 ℉'],
    tempIndex: 0
  },
  onLoad() {
    this.setData({ isDark: app.globalData.autoTheme });
  },
  onTempChange(e) {
    this.setData({ tempIndex: e.detail.value });
  },
  onDarkChange(e) {
    const val = e.detail.value;
    this.setData({ isDark: val });
    app.globalData.autoTheme = val;
    wx.setStorageSync('auto_theme', val);
  },
  navToJoke() {
    wx.navigateTo({ url: '/pages/joke/joke?type=flower' });
  },
  navToFamily() {
    wx.navigateTo({ url: '/pages/familyManage/familyManage' });
  },

  // 🚨 补上这个缺失的返回方法！
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
})
