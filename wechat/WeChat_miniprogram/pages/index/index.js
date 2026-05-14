Page({
  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1,
    // 弹窗状态控制
    showInvitePopup: false,
    selectedRole: 'member', // 默认选"成员"

    // 狗狗设备列表
    devices: [
      { id: 1, name: '狗子1号', status: '在线 - 睡觉中', avatar: '🐕' },
      { id: 2, name: '狗子2号', status: '在线 - 玩耍中', avatar: '🐕' },
      { id: 3, name: '狗子3号', status: '离线', avatar: '🐕' },
      { id: 4, name: '狗子4号', status: '电量低', avatar: '🐕' }
    ],

    // 用户信息
    userInfo: {
      nickname: 'PetNode 探索者',
      id: 'ID: 88481234',
      avatar: '/images/DefaultAvatar.png',
      familyCount: 1,
      deviceCount: 4,
      familyName: '我的小窝',
      memberCount: 2,
      members: ['/images/DefaultAvatar.png', '/images/page3_logo.jpg']
    },

    // 功能列表 1
    menuList1: [
      { id: 1, icon: '🔋', name: '设备耗材', url: '/pages/consumables/consumables' },
      { id: 2, icon: '📱', name: '多端管理', url: '/pages/multiDevice/multiDevice' },
      { id: 3, icon: '📿', name: '设备管理', url: '/pages/deviceManage/deviceManage' },
      { id: 4, icon: '⚙️', name: '更多设置', url: '/pages/settings/settings' }
    ],

    // 功能列表 2
    menuList2: [
      { id: 5, icon: '🛍️', name: '在线商城', url: '/pages/joke/joke?type=star' },
      { id: 6, icon: '🐾', name: 'PetNode 服务', url: '/pages/joke/joke?type=star' },
      { id: 7, icon: '💬', name: '帮助与反馈', url: '/pages/joke/joke?type=star' }
    ],

    // 文章列表
    articles: [
      {
        id: 1,
        title: '了解您宠物的静息呼吸频率',
        desc: '静息呼吸频率是评估宠物心肺健康的重要黄金指标。',
        image: '/images/article_breathing.png'
      },
      {
        id: 2,
        title: '了解您宠物的睡眠质量',
        desc: '狗狗一天需要睡多久？教你如何通过睡姿和时长判断它的健康状况。',
        image: '/images/article_sleep.jpg'
      },
      {
        id: 3,
        title: '您知道宠物的房颤吗？',
        desc: '心房颤动不仅是人类的隐形杀手，同样也潜伏在许多高龄犬猫身边。',
        image: '/images/article_afib.jpg'
      },
      {
        id: 4,
        title: '了解您宠物的生命体征',
        desc: '体温、脉搏、呼吸：每一个养宠人都应该掌握的基础生命体征自测法。',
        image: '/images/article_vitals.jpg'
      }
    ],

    isDaytime: true
  },

  /* ================= 1. 生命周期 & 时间逻辑 ================= */

  onLoad() {
    this.checkTime();
  },

  onShow() {
    this.checkTime();
  },

  checkTime() {
    const app = getApp();
    if (!app.globalData.autoTheme) {
      this.setData({ isDaytime: true });
      return;
    }
    const hour = new Date().getHours();
    const isDaytime = hour >= 6 && hour < 18;
    this.setData({ isDaytime });
  },

  /* ================= 2. 导航 & 滑动逻辑 ================= */

  onSwiperChange(e) {
    this.setData({ currentTab: e.detail.current });
  },

  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentTab: index });
  },

  navToSubPage(e) {
    const url = e.currentTarget.dataset.url;
    if (url) {
      wx.navigateTo({ url });
    }
  },

  goToDetail(e) {
    const petId = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/petDetail/petDetail?id=${petId}` });
  },

  /* ================= 3. 扫码功能 ================= */

  scanDevice() {
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果:', res.result);
        wx.showToast({ title: '扫码成功', icon: 'success' });
      },
      fail: (err) => {
        if (err.errMsg.indexOf('cancel') === -1) {
          wx.showToast({ title: '扫码失败', icon: 'error' });
        }
      }
    });
  },

  /* ================= 4. 邀请家人弹窗逻辑 ================= */

  openInvitePopup() {
    this.setData({ showInvitePopup: true });
  },

  closeInvitePopup() {
    this.setData({ showInvitePopup: false });
  },

  selectRole(e) {
    this.setData({ selectedRole: e.currentTarget.dataset.role });
  },

  goToRemark() {
    this.closeInvitePopup();
    wx.navigateTo({ url: '/pages/inviteRemark/inviteRemark' });
  }
})
