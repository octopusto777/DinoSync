// pages/sync/sync.js — Sync 打卡仪式页（核心体验）
const { LOCATIONS, SPECIMENS } = require('../../utils/data');

Page({
  data: {
    location: null,
    specimens: [],      // 该地点可解锁的物种
    specimenCards: [],
    unlockedIds: [],    // 已解锁的 ID

    // Sync 动画阶段：
    // idle → scanning → syncing → unlocked → done
    phase: 'idle',
    progress: 0,        // 0~100 进度条
    progressTimer: null,

    // 解锁结果
    newlyUnlocked: [],  // 本次新解锁的标本
    alreadyOwned: [],   // 已拥有的标本

    // 分享卡
    showShareCard: false,
    shareSpecimen: null,
  },

  onLoad(options) {
    const { locId } = options;
    const location = LOCATIONS.find(l => l.id === locId);
    if (!location) {
      wx.showToast({ title: '坐标数据异常', icon: 'error' });
      wx.navigateBack();
      return;
    }

    const app = getApp();
    const unlockedIds = app.globalData.unlockedSpecimens;

    // 找到该地点对应的物种信息
    const specimens = location.specimenIds.map(id =>
      SPECIMENS.find(s => s.id === id)
    ).filter(Boolean);

    const unlockedSet = new Set(unlockedIds);
    const specimenCards = specimens.map((s) => ({
      ...s,
      owned: unlockedSet.has(s.id),
    }));
    this.setData({ location, specimens, specimenCards, unlockedIds });
  },

  onUnload() {
    this._clearTimer();
  },

  // ── 开始 Sync 流程 ──
  startSync() {
    this.setData({ phase: 'scanning' });

    // 第一阶段：扫描（1.2 秒）
    setTimeout(() => {
      this.setData({ phase: 'syncing', progress: 0 });
      this._startProgress();
    }, 1200);
  },

  // ── 进度条动画 ──
  _startProgress() {
    let progress = 0;
    const timer = setInterval(() => {
      progress += Math.random() * 8 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(timer);
        this.setData({ progress });
        setTimeout(() => this._onSyncComplete(), 400);
      } else {
        this.setData({ progress: Math.round(progress) });
      }
    }, 80);
    this.data.progressTimer = timer;
  },

  _clearTimer() {
    if (this.data.progressTimer) {
      clearInterval(this.data.progressTimer);
    }
  },

  // ── Sync 完成，计算解锁结果 ──
  _onSyncComplete() {
    const app = getApp();
    const { specimens, unlockedIds } = this.data;
    const newlyUnlocked = [];
    const alreadyOwned = [];

    specimens.forEach(s => {
      if (unlockedIds.includes(s.id)) {
        alreadyOwned.push(s);
      } else {
        newlyUnlocked.push(s);
        app.unlockSpecimen(s.id);
      }
    });

    app.recordSync();

    // 震动反馈
    if (newlyUnlocked.length > 0) {
      wx.vibrateShort({ type: 'medium' });
    }

    this.setData({
      phase: 'unlocked',
      newlyUnlocked,
      alreadyOwned,
      unlockedIds: app.globalData.unlockedSpecimens,
      specimenCards: specimens.map((s) => ({
        ...s,
        owned: true,
      })),
    });
  },

  // ── 查看分享卡 ──
  showShare(e) {
    const specId = e.currentTarget.dataset.id;
    const spec = SPECIMENS.find(s => s.id === specId);
    this.setData({ showShareCard: true, shareSpecimen: spec });
  },

  closeShare() {
    this.setData({ showShareCard: false, shareSpecimen: null });
  },

  // ── 微信分享（实际项目接入 wx.shareAppMessage）──
  onShareTap() {
    getApp().recordShare();
    wx.showToast({ title: '分享功能开发中', icon: 'none' });
    // 正式版：
    // wx.shareAppMessage({ title: '...', imageUrl: '...' });
  },

  // ── 返回地图 ──
  goBack() {
    wx.navigateBack();
  },

  // ── 去查看图鉴 ──
  goCollection() {
    wx.switchTab({ url: '/pages/collection/collection' });
  },
});
