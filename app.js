// app.js — DinoSync 全局逻辑
App({
  globalData: {
    // 已解锁的标本 ID 列表（DEMO 默认解锁 2 个）
    unlockedSpecimens: ['1', '3'],
    // 打卡总次数
    syncCount: 2,
    // 连签天数
    streak: 3,
    // 最近一次 Sync 日期（YYYY-MM-DD）
    lastSyncDate: '',
    // 是否是会员
    isMember: false,
    // 分享次数
    shareCount: 0,
    // 用户信息
    userInfo: {
      nickName: 'PEI',
      avatarEmoji: '🦕',
    },
  },

  onLaunch() {
    this._hydrateLocalState();
    // 加载 Orbitron 游戏字体（jsDelivr CDN，大陆可访问）
    wx.loadFontFace({
      family: 'Orbitron',
      source: 'url("https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5/files/orbitron-latin-700-normal.woff2")',
      global: true,
      success: () => {},
      fail: () => {},
    });
    // 如果接入微信云开发，在这里初始化：
    // wx.cloud.init({ env: 'your-env-id', traceUser: true });
  },

  _hydrateLocalState() {
    const saved = wx.getStorageSync('dinosync_state');
    if (!saved) return;
    this.globalData = {
      ...this.globalData,
      ...saved,
    };
  },

  _persistLocalState() {
    wx.setStorageSync('dinosync_state', this.globalData);
  },

  _formatDateKey(ts = Date.now()) {
    const d = new Date(ts);
    const year = d.getFullYear();
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 解锁新标本
  unlockSpecimen(id) {
    const { unlockedSpecimens } = this.globalData;
    if (!unlockedSpecimens.includes(id)) {
      unlockedSpecimens.push(id);
      this._persistLocalState();
    }
  },

  // 记录一次 Sync 行为，并更新连签
  recordSync() {
    const today = this._formatDateKey();
    const last = this.globalData.lastSyncDate;
    this.globalData.syncCount += 1;

    if (!last) {
      this.globalData.streak = 1;
    } else if (last !== today) {
      const diffDays = Math.floor((new Date(today) - new Date(last)) / 86400000);
      this.globalData.streak = diffDays === 1 ? this.globalData.streak + 1 : 1;
    }

    this.globalData.lastSyncDate = today;
    this._persistLocalState();
  },

  recordShare() {
    this.globalData.shareCount += 1;
    this._persistLocalState();
  },
});
