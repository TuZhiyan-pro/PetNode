App({
  onLaunch() {
    const token = wx.getStorageSync('access_token');
    if (token) {
      this.globalData.token = token;
    }
    const autoTheme = wx.getStorageSync('auto_theme');
    if (autoTheme !== '') {
      this.globalData.autoTheme = autoTheme;
    }
  },
  globalData: {
    token: null,
    userInfo: null,
    currentPetId: null,
    currentDeviceId: null,
    autoTheme: true
  }
})
