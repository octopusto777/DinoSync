// pages/map/map.js — 探索主页
const { LOCATIONS } = require('../../utils/data');

// 全国中心点，缩放 4 可看到全部点位
const MAP_CENTER = { latitude: 32.5, longitude: 110.0 };
const MAP_SCALE  = 4;

Page({
  data: {
    mapLat:  MAP_CENTER.latitude,
    mapLng:  MAP_CENTER.longitude,
    mapScale: MAP_SCALE,
    markers: [],
    selectedLocation: null,
    locations: LOCATIONS,
    activeFilter: 'all',
    showDetail: false,
    botOpen: false,
    botQuestion: '',
    botAnswer: '我是 Era，你的大师姐。先问我：哪个点位最容易解锁？',
  },

  onLoad() {
    this._buildMarkers(LOCATIONS);
  },

  onShow() {
    this._buildMarkers(this.data.locations);
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
  },

  // 根据 locations 列表生成地图标记
  _buildMarkers(locs) {
    const markers = locs.map((loc, i) => ({
      id:        i,
      locationId: loc.id,
      latitude:  loc.coords.latitude,
      longitude: loc.coords.longitude,
      title:     loc.name,
      iconPath:  '/assets/markers/bone-pin.svg',
      width:     36,
      height:    46,
      callout: {
        content:      loc.name,
        color:        '#e8ede9',
        fontSize:     13,
        borderRadius: 8,
        bgColor:      'rgba(8, 30, 18, 0.88)',
        padding:      7,
        display:      'BYCLICK',
      },
    }));
    this.setData({ markers });
  },

  onMarkerTap(e) {
    const idx = e.markerId;
    const loc  = this.data.locations[idx];
    if (loc) this.setData({ selectedLocation: loc, showDetail: true });
  },

  onLocationCardTap(e) {
    const locId = e.currentTarget.dataset.id;
    const loc   = LOCATIONS.find(l => l.id === locId);
    if (loc) this.setData({ selectedLocation: loc, showDetail: true });
  },

  closeDetail() {
    this.setData({ showDetail: false, selectedLocation: null });
  },

  goSync() {
    const { selectedLocation } = this.data;
    if (!selectedLocation) return;
    this.setData({ showDetail: false });
    wx.navigateTo({ url: `/pages/sync/sync?locId=${selectedLocation.id}` });
  },

  onFilterTap(e) {
    const filter   = e.currentTarget.dataset.filter;
    const filtered = filter === 'all'
      ? LOCATIONS
      : LOCATIONS.filter(l => l.type === filter);
    this.setData({ activeFilter: filter, locations: filtered }, () => {
      this._buildMarkers(filtered);
    });
  },

  openBot()  { this.setData({ botOpen: true }); },
  closeBot() { this.setData({ botOpen: false }); },

  onBotInput(e) { this.setData({ botQuestion: e.detail.value }); },

  askBot() {
    const q = this.data.botQuestion.trim();
    if (!q) return;
    let answer = '建议先从"馆"类热门点位开始，解锁速度快，反馈强。';
    if (q.includes('传奇')) answer = '传奇建议先去北票与自贡支线，配合图鉴筛选效率最高。';
    if (q.includes('会员')) answer = '会员优先看知识流和专属坐标线索，能更快补齐图鉴。';
    if (q.includes('路线') || q.includes('哪里')) answer = '路线推荐：北京古动物馆→自贡恐龙博物馆→辽宁北票，覆盖最多传奇标本。';
    this.setData({ botAnswer: answer, botQuestion: '' });
  },
});
