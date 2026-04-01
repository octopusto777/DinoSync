// pages/home/home.js — 交流广场（瀑布流 + 渐变卡占位）
Page({
  data: {
    leftFeed:  [],
    rightFeed: [],
    loading:   false,

    // 8张卡：混合竖版(imgH>200)和横版(imgH<200)，确保视觉错落
    // colorClass 对应 home.wxss 中 8 个渐变色方案
    posts: [
      {
        id:'p1', colorClass:'cb0', emoji:'🦴', era:'Early Cretaceous',
        author:'热河追踪者', title:'今天在北票解锁了羽毛线索',
        body:'地层卡片超有感觉，记录了一组化石纹理。',
        likes:48, tag:'线索', imgH:280,
      },
      {
        id:'p2', colorClass:'cb1', emoji:'🦕', era:'Late Jurassic',
        author:'侏罗纪漫游', title:'自贡路线建议',
        body:'馆内先做主线再走稀有支线，效率最高。',
        likes:72, tag:'攻略', imgH:185,
      },
      {
        id:'p3', colorClass:'cb2', emoji:'🪶', era:'Early Cretaceous',
        author:'骨骼收藏家', title:'图鉴稀有度展示',
        body:'传奇标本光效很顶，晚上看更像游戏。',
        likes:19, tag:'图鉴', imgH:240,
      },
      {
        id:'p4', colorClass:'cb3', emoji:'🦖', era:'Late Cretaceous',
        author:'DinoPedia', title:'禄丰龙知识卡整理',
        body:'把年代线索做成时间轴，方便新人理解。',
        likes:35, tag:'科普', imgH:190,
      },
      {
        id:'p5', colorClass:'cb4', emoji:'⚡', era:'Middle Jurassic',
        author:'化石轻旅', title:'周末探索计划',
        body:'目标两城四点，争取拿下跨省成就。',
        likes:66, tag:'计划', imgH:260,
      },
      {
        id:'p6', colorClass:'cb5', emoji:'🗺️', era:'Field Trip',
        author:'Aster', title:'你们会先肝哪个路线？',
        body:'馆/野之间纠结，想听听大家建议。',
        likes:28, tag:'讨论', imgH:175,
      },
      {
        id:'p7', colorClass:'cb6', emoji:'🏛️', era:'All Eras',
        author:'化石猎人M', title:'北京古动物馆打卡全程',
        body:'中午人少，工作日去标本细节看得很清楚。',
        likes:51, tag:'线索', imgH:250,
      },
      {
        id:'p8', colorClass:'cb7', emoji:'💎', era:'Top 5',
        author:'小恐龙迷', title:'最喜欢的标本 TOP 5',
        body:'从侏罗纪到白垩纪，这几件镇馆之宝见过吗？',
        likes:83, tag:'科普', imgH:200,
      },
    ],
  },

  onShow() {
    if (this.data.leftFeed.length === 0) {
      this._buildFeed();
    }
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  // 贪心平衡算法：哪列矮就塞哪列
  _buildFeed() {
    const left = [], right = [];
    let lh = 0, rh = 0;
    this.data.posts.forEach(p => {
      const h = p.imgH + 148; // 图片高 + 文字估算
      if (lh <= rh) { left.push(p);  lh += h; }
      else          { right.push(p); rh += h; }
    });
    this.setData({ leftFeed: left, rightFeed: right });
  },
});
