// custom-tab-bar/index.js
Component({
  data: {
    selected: 0,
    sliderStyle: 'width:25%;left:0%;',
    list: [
      { pagePath: '/pages/home/home',           text: 'HOME', icon: '/assets/icons/home.svg' },
      { pagePath: '/pages/map/map',             text: '探索', icon: '/assets/icons/explore.svg' },
      { pagePath: '/pages/collection/collection', text: '图鉴', icon: '/assets/icons/collection.svg' },
      { pagePath: '/pages/profile/profile',     text: '我的',  icon: '/assets/icons/me.svg' },
    ],
  },

  lifetimes: {
    attached() {
      this._updateSlider(this.data.selected);
    },
  },

  observers: {
    selected(v) {
      this._updateSlider(v);
    },
  },

  methods: {
    switchTab(e) {
      const { index, path } = e.currentTarget.dataset;
      // 先更新 UI 再跳转，避免视觉延迟
      this.setData({ selected: index });
      this._updateSlider(index);
      wx.switchTab({ url: path });
    },

    _updateSlider(index) {
      // 每个 tab 占 1/4 宽度。
      // slider 用 left:X% 而非 transform，避免 left offset 导致的偏移 bug。
      const total = this.data.list.length; // 4
      const pct   = 100 / total;           // 25
      this.setData({
        sliderStyle: `width:${pct}%;left:${index * pct}%;`,
      });
    },
  },
});
