Page({
  data: {
    members: [
      { id: 1, name: 'PetNode 探索者', phone: '138****8888', avatar: '/images/DefaultAvatar.png', isMe: true },
      { id: 2, name: '家人A', phone: '139****9999', avatar: '/images/page3_logo.jpg', isMe: false }
    ]
  },
  kickMember(e) {
    const name = e.currentTarget.dataset.name;
    wx.showModal({
      title: '踢出成员',
      content: `确定要将 ${name} 踢出家庭组吗？`,
      confirmColor: '#ff3b30'
    });
  },

  // 🚨 同样补上返回方法！
  goBack() {
    wx.navigateBack({ delta: 1 });
  }
})
