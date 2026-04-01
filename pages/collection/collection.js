// pages/collection/collection.js — 数字标本图鉴
const { SPECIMENS } = require('../../utils/data');

Page({
  data: {
    allSpecimens: SPECIMENS,
    displaySpecimens: [],
    unlockedIds: [],
    activeFilter: 'all',  // all / unlocked / locked
    selectedSpec: null,
    showDetail: false,

    // 统计
    totalCount: SPECIMENS.length,
    unlockedCount: 0,
    lockedCount: SPECIMENS.length,
    progressPct: 0,
    isEmpty: false,
  },

  onLoad() {
    this._refreshData();
  },

  onShow() {
    this._refreshData();
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
  },

  _refreshData() {
    const app = getApp();
    const unlockedIds = app.globalData.unlockedSpecimens;
    const unlockedSet = new Set(unlockedIds);
    const unlockedCount = unlockedIds.length;
    const totalCount = SPECIMENS.length;
    const lockedCount = totalCount - unlockedCount;
    const progressPct = totalCount > 0
      ? Math.round((unlockedCount / totalCount) * 100)
      : 0;

    // 对标本按稀有度排序：legendary > rare > common
    const rarityOrder = { legendary: 0, rare: 1, common: 2 };
    const sorted = [...SPECIMENS].sort(
      (a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity]
    );

    let displaySpecimens = sorted;
    if (this.data.activeFilter === 'unlocked') {
      displaySpecimens = sorted.filter(s => unlockedSet.has(s.id));
    } else if (this.data.activeFilter === 'locked') {
      displaySpecimens = sorted.filter(s => !unlockedSet.has(s.id));
    }

    const displayWithStatus = displaySpecimens.map(s => ({
      ...s,
      unlocked: unlockedSet.has(s.id),
    }));

    this.setData({
      unlockedIds,
      unlockedCount,
      lockedCount,
      progressPct,
      displaySpecimens: displayWithStatus,
      isEmpty: displayWithStatus.length === 0,
    });
  },

  onFilterTap(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ activeFilter: filter }, () => {
      this._refreshData();
    });
  },

  onSpecimenTap(e) {
    const specId = e.currentTarget.dataset.id;
    const spec = SPECIMENS.find(s => s.id === specId);
    const isUnlocked = this.data.unlockedIds.includes(specId);
    if (spec && isUnlocked) {
      this.setData({ selectedSpec: spec, showDetail: true });
    } else if (!isUnlocked) {
      wx.showToast({ title: '前往对应坐标解锁', icon: 'none', duration: 2000 });
    }
  },

  closeDetail() {
    this.setData({ showDetail: false, selectedSpec: null });
  },

  goMap() {
    wx.switchTab({ url: '/pages/map/map' });
  },
});
