// pages/profile/profile.js — 个人中心
const {
  ACHIEVEMENTS,
  LEADERBOARD_MOCK,
  KNOWLEDGE_ARTICLES,
} = require('../../utils/data');

Page({
  data: {
    user: null,
    syncCount: 0,
    streak: 0,
    isMember: false,
    unlockedCount: 0,
    achievements: ACHIEVEMENTS,
    unlockedAchievements: 0,
    shareCount: 0,
    rankPercent: 0,
    leaderboardPreview: LEADERBOARD_MOCK,
    dailyArticleTitle: '',
  },

  onShow() {
    const app = getApp();
    const { globalData } = app;
    const unlockedCount = globalData.unlockedSpecimens.length;
    const unlockedAchievements = ACHIEVEMENTS.filter(a => a.unlocked).length;
    const rankPercent = Math.min(99, 35 + globalData.syncCount * 4);
    const dailyArticle = KNOWLEDGE_ARTICLES[(new Date().getDate() - 1) % KNOWLEDGE_ARTICLES.length];

    this.setData({
      user: globalData.userInfo,
      syncCount: globalData.syncCount,
      streak: globalData.streak,
      isMember: globalData.isMember,
      unlockedCount,
      unlockedAchievements,
      shareCount: globalData.shareCount,
      rankPercent,
      dailyArticleTitle: dailyArticle.title,
    });

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 3 });
    }
  },

  // 开通会员（DEMO 模拟）
  onMemberTap() {
    const app = getApp();
    if (app.globalData.isMember) {
      wx.showToast({ title: '您已是研究员会员', icon: 'none' });
      return;
    }

    wx.showModal({
      title: '古生物研究员',
      content: '¥18/月 · 解锁全量内容\n\nDEMO 模式：点确认免费开通体验',
      confirmText: '立即开通',
      cancelText: '再想想',
      success: (res) => {
        if (res.confirm) {
          app.globalData.isMember = true;
          this.setData({ isMember: true });
          wx.showToast({ title: '欢迎成为研究员！', icon: 'success' });
        }
      },
    });
  },

  // 去地图探索
  goMap() {
    wx.switchTab({ url: '/pages/map/map' });
  },

  goKnowledge() {
    wx.navigateTo({ url: '/pages/knowledge/knowledge' });
  },
});
