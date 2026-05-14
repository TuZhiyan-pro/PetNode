/**
 * utils/api.js
 * PetNode 全局网络请求封装
 */

// 🚨 你的 Flask 后端基础地址
// 如果是在本机电脑跑 Flask + 微信开发者工具，填 http://127.0.0.1:5000
// 如果是真机调试，需要填你电脑局域网的 IP (比如 http://192.168.x.x:5000)
const BASE_URL = 'http://127.0.0.1:5000';

/**
 * 核心请求函数
 * @param {string} url - 接口路径 (例如: /api/v1/me)
 * @param {string} method - 请求方式 (GET, POST, PUT, DELETE)
 * @param {object} data - 提交的数据
 */
const request = (url, method = 'GET', data = {}) => {
  return new Promise((resolve, reject) => {
    // 1. 设置请求头
    let header = {
      'Content-Type': 'application/json'
    };

    // 2. 自动携带身份令牌 (Token)
    // 假设我们登录后把 token 存在了缓存的 'access_token' 里
    const token = wx.getStorageSync('access_token');
    if (token) {
      header['Authorization'] = `Bearer ${token}`; 
    }

    // 3. 发起请求
    wx.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        const statusCode = res.statusCode;
        
        // --- 状态码 2xx: 成功 ---
        if (statusCode >= 200 && statusCode < 300) {
          resolve(res.data);
        } 
        // --- 状态码 401: 身份过期 / 未登录 ---
        else if (statusCode === 401) {
          wx.removeStorageSync('access_token'); // 清除失效的 token
          wx.showToast({ title: '登录已过期，请重新登录', icon: 'none' });
          // 这里可以加上跳转到登录页的逻辑，例如:
          // wx.redirectTo({ url: '/pages/login/login' });
          reject(res.data);
        } 
        // --- 其他错误 ---
        else {
          wx.showToast({ 
            title: res.data.message || '请求失败', 
            icon: 'none' 
          });
          reject(res.data);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络连接异常，请检查网络', icon: 'none' });
        reject(err);
      }
    });
  });
};

// 导出便捷方法
module.exports = {
  BASE_URL,
  get: (url, data) => request(url, 'GET', data),
  post: (url, data) => request(url, 'POST', data),
  put: (url, data) => request(url, 'PUT', data),
  delete: (url, data) => request(url, 'DELETE', data)
};