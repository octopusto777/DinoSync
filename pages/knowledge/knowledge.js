const { KNOWLEDGE_ARTICLES } = require('../../utils/data');

Page({
  data: {
    articleCards: [],
    selectedArticle: null,
    showDetail: false,
  },

  onShow() {
    this._buildCards();
  },

  _buildCards() {
    const app = getApp();
    const unlocked = new Set(app.globalData.unlockedSpecimens);
    const isMember = app.globalData.isMember;
    const today = new Date().getDate();
    const freeId = KNOWLEDGE_ARTICLES[(today - 1) % KNOWLEDGE_ARTICLES.length].id;

    const articleCards = KNOWLEDGE_ARTICLES.map((a) => {
      const canRead = isMember || unlocked.has(a.specimenId) || a.id === freeId;
      return {
        ...a,
        canRead,
        lockReason: a.membersOnly && !isMember ? '研究员专属' : '解锁对应标本可阅读',
      };
    });
    this.setData({ articleCards });
  },

  onArticleTap(e) {
    const articleId = e.currentTarget.dataset.id;
    const article = this.data.articleCards.find((a) => a.id === articleId);
    if (!article) return;
    if (!article.canRead) {
      wx.showToast({ title: article.lockReason, icon: 'none' });
      return;
    }
    this.setData({ selectedArticle: article, showDetail: true });
  },

  closeDetail() {
    this.setData({ selectedArticle: null, showDetail: false });
  },
});
