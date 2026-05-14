const api = require('../../utils/api.js');

Page({
  data: {
    isAgreed: false,       // 是否勾选协议
    needBindPhone: false,  // 核心状态机：是否切换为"授权手机号"模式
    showToast: false,      // Toast 显示状态
    toastMsg: '',          // Toast 文本内容
  },

  // 1. 切换协议勾选状态
  toggleAgree() {
    this.setData({ isAgreed: !this.data.isAgreed });
  },

  // 2. 自定义 Toast 弹出逻辑 (3秒淡出)
  showCustomToast(msg) {
    this.setData({
      toastMsg: msg,
      showToast: true
    });
    // 3秒后自动隐藏
    setTimeout(() => {
      this.setData({ showToast: false });
    }, 3000);
  },

  // ================= 核心流 第一步：微信一键登录 =================
  handleWechatLogin() {
    // 拦截 1：必须勾选协议
    if (!this.data.isAgreed) {
      this.showCustomToast('请先阅读并勾选底部用户协议');
      return;
    }

    wx.showLoading({ title: '登录中...', mask: true });

    // 调用微信原生 API 获取 code
    wx.login({
      success: async (res) => {
        if (res.code) {
          try {
            // 发送给我们的 Flask 后端
            const backendRes = await api.post('/api/v1/wechat/auth', { code: res.code });
            wx.hideLoading();

            // 假设后端返回 { access_token: "xxx" } 表示老用户
            if (backendRes.access_token) {
              wx.setStorageSync('access_token', backendRes.access_token);
              this.showCustomToast('✅ 登录成功');
              setTimeout(() => {
                wx.switchTab({ url: '/pages/index/index' }); // 跳回首页
              }, 1000);
            }
            // 假设后端返回 status 提示需要绑定手机号
            else if (backendRes.status === 'need_bind') {
              // 🌟 触发 UI 巨变！变成获取手机号按钮
              this.setData({ needBindPhone: true });
              this.showCustomToast('首次登录，请绑定手机号');
            }
          } catch (error) {
            wx.hideLoading();
            // 网络异常阻断式提醒
            wx.showModal({ title: '登录失败', content: '服务器连接异常，请重试', showCancel: false });
          }
        }
      },
      fail: () => {
        wx.hideLoading();
        this.showCustomToast('微信登录调用失败');
      }
    });
  },

  // ================= 核心流 第二步：获取并绑定手机号 =================
  async handleGetPhone(e) {
    // 拦截：如果用户点了拒绝
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      this.showCustomToast('您拒绝了授权，无法完成注册');
      return;
    }

    // 拿到微信返回的 phone code (现代基础库玩法)
    const phoneCode = e.detail.code;
    wx.showLoading({ title: '绑定中...', mask: true });

    try {
      // 发送给 Flask 后端完成绑定
      const bindRes = await api.post('/api/v1/wechat/bind', { code: phoneCode });
      wx.hideLoading();

      if (bindRes.access_token) {
        wx.setStorageSync('access_token', bindRes.access_token);
        this.showCustomToast('✅ 绑定并登录成功');
        setTimeout(() => {
          wx.switchTab({ url: '/pages/index/index' });
        }, 1000);
      } else {
        wx.showModal({ title: '绑定失败', content: bindRes.message || '未知错误', showCancel: false });
      }
    } catch (error) {
      wx.hideLoading();
      wx.showModal({ title: '绑定失败', content: '服务器异常', showCancel: false });
    }
  },

  // 占位函数：跳转到协议文本页
  goToProtocol() {
    console.log('跳转服务协议');
  },
  goToPrivacy() {
    console.log('跳转隐私政策');
  }
});
