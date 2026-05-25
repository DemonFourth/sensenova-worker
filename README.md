# SenseNova U1 Fast 信息图生成器

基于 Cloudflare Workers 部署的 SenseNova U1 Fast 信息图生成静态页面。

## 特性

- **精美 UI** - 现代化渐变设计，响应式布局
- **中英文切换** - 一键切换界面语言
- **多尺寸支持** - 5 种图像比例可选
- **安全代理** - API Key 存储在 Cloudflare 环境变量中
- **单文件部署** - 所有代码在一个文件中，无需额外配置

## 项目结构

```
sensenova-worker/
├── worker.js          # 单文件 Worker（含 HTML + API 代理）
├── README.md          # 本文档
└── wrangler.toml      # 本地部署配置
```

## 快速部署

### 方式一：Dashboard 直接部署（推荐）

适合不想安装任何工具的用户。

#### 1. 创建 Worker

1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application** → **Create Worker**
3. 输入 Worker 名称（如 `sensenova-infographic`）
4. 点击 **Deploy**

#### 2. 粘贴代码

1. 在 Worker 编辑页面，删除默认代码
2. 打开本地文件 `worker.js`，复制全部内容
3. 粘贴到编辑区，点击 **Save and Deploy**

#### 3. 配置环境变量

1. 进入 Worker → **Settings** → **Variables**
2. 添加变量：
   - **Variable name**: `SENSENOVA_API_KEY`
   - **Value**: 你的 SenseNova API Key
3. 点击 **Save**

#### 4. 访问应用

访问 `https://sensenova-infographic.your-subdomain.workers.dev`

---

### 方式二：本地部署（可选）

```bash
# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 部署
cd sensenova-worker
wrangler deploy --name your-worker-name
```

---

## 功能说明

### 中英文切换

点击右上角的 **EN / 中文** 按钮切换界面语言。

### 支持的图像尺寸

| 尺寸 | 比例 | 用途 |
|------|------|------|
| 2752x1536 | 16:9 | 宽屏展示（默认） |
| 2496x1664 | 3:2 | 横版海报 |
| 1664x2496 | 2:3 | 竖版海报 |
| 2048x2048 | 1:1 | 方形图 |
| 1536x2752 | 9:16 | 手机竖屏 |

### API 接口

**POST /api/generate**

```json
{
  "prompt": "图像描述文本",
  "size": "2752x1536",
  "n": 1
}
```

---

## 注意事项

1. **API Key 安全** - 永远不要将 API Key 硬编码在代码中
2. **生成时间** - 图像生成通常需要 10-30 秒
3. **提示词语言** - 支持中文和英文提示词，生成效果相同

---

## 获取 API Key

1. 访问 [platform.sensenova.cn](https://platform.sensenova.cn)
2. 登录账户
3. 进入 **API 管理** 或 **开发者设置**
4. 创建/复制 API Key

---

## 相关链接

- [SenseNova 平台文档](https://platform.sensenova.cn/docs)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

---

**Made with love by SenseNova U1 Fast**