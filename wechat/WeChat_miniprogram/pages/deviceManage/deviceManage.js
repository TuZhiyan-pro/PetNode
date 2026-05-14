Page({
  data: {
    devices: [
      { id: 1, name: '狗子1号', collarInfo: '项圈 SN: 84729472' },
      { id: 2, name: '狗子2号', collarInfo: '项圈 SN: 99382741' }
    ]
  },
  // 统一的返回上一页逻辑
  goBack() {
    wx.navigateBack({ delta: 1 });
  },
  unbind(e) {
    const name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '解除绑定',
      content: `确定要解除与 ${name} 的项圈绑定吗？此操作不可逆。`,
      confirmColor: '#ff3b30',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({ title: '已解绑', icon: 'success' });
          // 这里后续接后端 API
        }
      }
    });
  }
})
