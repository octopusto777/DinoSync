# DinoSync 时空遗迹 — 微信小程序 DEMO

> **Find the Point, Sync the Past. 步入坐标，同步纪元**

---

## 目录结构

```
dinosync/
├── app.js                    # 全局逻辑
├── app.json                  # 全局配置（页面、TabBar）
├── app.wxss                  # 全局样式（颜色变量）
├── project.config.json       # 微信开发者工具项目配置
├── sitemap.json
├── custom-tab-bar/           # 自定义底部导航组件
│   ├── index.js
│   ├── index.json
│   ├── index.wxml
│   └── index.wxss
├── pages/
│   ├── splash/               # 启动页
│   ├── map/                  # 遗迹地图（Tab 1）
│   ├── sync/                 # Sync 打卡仪式页（从地图跳入）
│   ├── collection/           # 数字标本图鉴（Tab 2）
│   └── profile/              # 我的（Tab 3）
└── utils/
    └── data.js               # 全部 Mock 数据
```

---

## ⚡ 快速启动步骤（Cursor + 微信开发者工具）

### 第一步：安装微信开发者工具

1. 前往 https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 下载并安装「稳定版 Stable Build」
3. 用微信扫码登录（需要一个微信账号，不需要已认证的小程序账号）

### 第二步：在 Cursor 中打开项目

1. 将本文件夹 `dinosync/` 用 Cursor 打开
2. 可以在 Cursor 中直接编辑所有 `.js` `.wxml` `.wxss` `.json` 文件
3. Cursor AI 辅助：直接描述想要的改动，让 AI 生成代码

### 第三步：导入微信开发者工具

1. 打开微信开发者工具 → 点击「+」新建项目
2. **项目目录**：选择本 `dinosync/` 文件夹
3. **AppID**：选择「测试号」（无需真实 AppID，DEMO 够用）
4. **后端服务**：选择「不使用云服务」
5. 点击「确定」→ 项目自动加载

### 第四步：运行 DEMO

1. 微信开发者工具左上角点击「编译」
2. 模拟器中可以看到完整 UI
3. 点击右上角「预览」用手机扫码真机预览

### 第五步：测试地图功能

- 地图页默认显示全国恐龙坐标点
- **DEMO 模式**：点击任意地图标注 → 进入 Sync 页面
- Sync 页面有完整动画序列：扫描 → 进度条 → 解锁 → 分享卡
- 无需真实 GPS，Demo 内所有位置均为 Mock 数据

---

## 🎨 设计系统（与 PRD 一致）

| 变量 | 颜色 | 用途 |
|------|------|------|
| `--bg` | `#0d0f0e` | 主背景 |
| `--surface` | `#141816` | 次级背景 |
| `--card` | `#1a1e1b` | 卡片背景 |
| `--accent` | `#c8f060` | 主强调色（石灰绿）|
| `--accent-warm` | `#f0a840` | 化石琥珀 |
| `--accent-cool` | `#60d4f0` | 冰川青 |
| `--text-primary` | `#e8ede9` | 主文字 |
| `--text-secondary` | `#8a9b8c` | 次文字 |

---

## 📦 Mock 数据说明

所有数据在 `utils/data.js` 中，包括：
- `SPECIMENS`：6 个中国恐龙物种（含坐标、描述、稀有度）
- `LOCATIONS`：全国 6 个打卡点
- `ACHIEVEMENTS`：成就徽章列表

**扩展方式**：直接在 `data.js` 增加条目，页面自动渲染，无需改动逻辑代码。

---

## 🛠 常见问题

**Q: 地图不显示怎么办？**
A: 微信开发者工具的 map 组件需要真实 AppID 才能在模拟器渲染地图底图，用「测试号」时地图背景为灰色，但标记点和交互正常。真机预览可以看完整地图。

**Q: 位置权限报错？**
A: DEMO 中已注释掉真实 `wx.getLocation` 调用，用 Mock 坐标替代。不会触发权限请求。

**Q: 如何接入真实后端？**
A: `utils/data.js` 中的数据替换为 `wx.request` 调用即可。建议先用微信云开发（CloudBase）— 在 `app.json` 中将 `"cloud": true` 并在 `app.js` 中初始化 `wx.cloud.init()`。

---

## 🗺 页面说明

| 页面 | 路径 | 功能 |
|------|------|------|
| 启动页 | `pages/splash` | Logo + Slogan 动画，2秒后自动跳转地图 |
| 遗迹地图 | `pages/map` | 全国打卡点地图 + 卡片列表 |
| Sync 仪式 | `pages/sync` | 打卡动画 → 标本解锁 → 分享卡生成 |
| 数字图鉴 | `pages/collection` | 已解锁/待解锁标本网格 |
| 我的 | `pages/profile` | 用户数据、成就、会员入口 |
