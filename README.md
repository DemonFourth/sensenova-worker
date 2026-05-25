# SenseNova U1 Fast 信息图生成器

基于 Cloudflare Workers 部署的 SenseNova U1 Fast 信息图生成静态页面。

## 特性

- **精美 UI** - 现代化渐变设计，响应式布局
- **多尺寸支持** - 11 种图像比例可选
- **安全代理** - API Key 存储在 Cloudflare 环境变量中
- **快速部署** - 一键部署到 Cloudflare Workers
- **移动端友好** - 完美适配手机和桌面

## 项目结构

`
sensenova-worker/
├── wrangler.toml          # Cloudflare Workers 配置
├── README.md              # 本文档
└── src/
    ├── index.js           # Worker 代码（API 代理 + 静态托管）
    └── index.html         # 前端页面
`

## 快速部署

### 方式一：Dashboard 直接部署（最简单）

适合不想安装任何工具的用户。

#### 1. 创建 Worker

1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application** → **Create Worker**
3. 输入 Worker 名称（如 sensenova-infographic）
4. 点击 **Deploy**

#### 2. 上传代码

**方法 A：直接粘贴代码**

1. 在 Worker 编辑页面，删除默认代码
2. 打开本地文件 src/index.js，复制全部内容
3. 粘贴到编辑区，点击 **Save and Deploy**

**方法 B：上传文件**

1. 在 Worker 页面，点击 **Settings** → **Resources** → **File binding**
2. 添加文件绑定：
   - **Name**: __STATIC_CONTENT
   - **Type**: File
   - **Path**: 选择 src/index.html
3. 在代码中引用静态文件（需要修改 index.js）

#### 3. 配置环境变量

1. 进入 Worker → **Settings** → **Variables**
2. 添加变量：
   - **Variable name**: SENSENOVA_API_KEY
   - **Value**: 你的 SenseNova API Key
3. 点击 **Save**

#### 4. 测试

访问 https://sensenova-infographic.your-subdomain.workers.dev

---

### 方式二：本地部署（推荐）

适合需要版本控制和自动化部署的用户。

#### 1. 前置准备

`ash
# 安装 Node.js (如果未安装)
# https://nodejs.org/

# 安装 Wrangler CLI
npm install -g wrangler

# 登录 Cloudflare
wrangler login
`

#### 2. 部署步骤

`ash
# 进入项目目录
cd sensenova-worker

# 部署到 Cloudflare Workers（指定名称）
wrangler deploy --name your-worker-name

# 示例
wrangler deploy --name sensenova-infographic
`

#### 3. 配置 API Key

部署后，在 Cloudflare Dashboard 中配置环境变量：

1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → 找到你的 Worker
3. 点击 **Settings** → **Variables**
4. 添加变量：
   - **Variable name**: SENSENOVA_API_KEY
   - **Value**: 你的 SenseNova API Key
5. 点击 **Save**

#### 4. 访问应用

部署完成后，访问：
`
https://your-worker-name.your-subdomain.workers.dev
`

---

### 方式三：GitHub + Cloudflare Pages

适合需要 CI/CD 和自动部署的用户。

#### 1. 推送到 GitHub

`ash
# 初始化 Git（如果尚未初始化）
git init

# 添加远程仓库
git remote add origin https://github.com/DemonFourth/sensenova-worker.git

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: SenseNova U1 Fast Infographic Generator"

# 推送
git branch -M main
git push -u origin main
`

#### 2. 连接 Cloudflare Pages

1. 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → **Create application** → **Pages**
3. 点击 **Connect to Git**
4. 选择 GitHub 仓库 DemonFourth/sensenova-worker
5. 构建设置（留空，静态站点无需构建）：
   - **Build command**: （留空）
   - **Build output directory**: （留空）
6. 点击 **Save and Deploy**

#### 3. 配置环境变量

在 Pages 设置中添加环境变量：

1. 进入 Pages 项目 → **Settings** → **Environment variables**
2. 添加变量：
   - **Variable**: SENSENOVA_API_KEY
   - **Value**: 你的 SenseNova API Key
3. 点击 **Save**

#### 4. 绑定 Worker（可选）

如果需要自定义域名或更复杂的后端逻辑：

1. 进入 **Workers & Pages** → **Create** → **Worker**
2. 上传 src/index.js 代码
3. 在 Pages 设置中绑定 Worker

---

## 配置说明

### wrangler.toml

`	oml
# 最小配置，其余在 Cloudflare Dashboard 中设置
name = ""  # 部署时通过 --name 指定
main = "src/index.js"
compatibility_date = "2026-05-25"

[assets]
directory = "src"
binding = "__STATIC_CONTENT"
`

### 环境变量

| 变量名 | 说明 | 配置位置 |
|--------|------|----------|
| SENSENOVA_API_KEY | SenseNova API 密钥 | Workers/Pages → Settings → Variables |

### 自定义域名

在 Cloudflare Dashboard 中配置：

1. **Workers**: Workers → 你的 Worker → Triggers → Custom domains
2. **Pages**: Pages → 你的项目 → Custom domains

---

## 支持的图像尺寸

| 尺寸 | 比例 | 用途 |
|------|------|------|
| 2752x1536 | 16:9 | 宽屏展示（默认） |
| 2496x1664 | 3:2 | 横版海报 |
| 1664x2496 | 2:3 | 竖版海报 |
| 2048x2048 | 1:1 | 方形图 |
| 1536x2752 | 9:16 | 手机竖屏 |
| 3072x1376 | 21:9 | 超宽屏 |

---

## API 接口

### POST /api/generate

生成信息图。

**请求头：**
`
Content-Type: application/json
`

**请求体：**
`json
{
  "prompt": "图像描述文本（必填，最大 4096 tokens）",
  "size": "2752x1536",  // 可选，默认值
  "n": 1                 // 可选，生成数量
}
`

**响应示例：**
`json
{
  "created": 1713167890,
  "data": [
    { "url": "https://cdn.sensenova.dev/gen/..." }
  ]
}
`

### GET /health

健康检查接口。

**响应：**
`json
{
  "status": "ok",
  "service": "sensenova-infographic"
}
`

---

## 获取 API Key

1. 访问 [platform.sensenova.cn](https://platform.sensenova.cn)
2. 登录账户
3. 进入 **API 管理** 或 **开发者设置**
4. 创建/复制 API Key

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 前端 | 原生 HTML/CSS/JavaScript |
| 后端 | Cloudflare Workers (JavaScript) |
| API | SenseNova U1 Fast |
| 部署 | Cloudflare Workers / Pages |

---

## 注意事项

1. **API Key 安全** - 永远不要将 API Key 硬编码在代码中
2. **速率限制** - SenseNova API 可能有调用频率限制
3. **生成时间** - 图像生成通常需要 10-30 秒
4. **提示词长度** - 最大支持 4096 tokens

---

## 许可证

MIT License

---

## 相关链接

- [SenseNova 平台文档](https://platform.sensenova.cn/docs)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

---

**Made with love by SenseNova U1 Fast**
