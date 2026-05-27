// SenseNova U1 Fast Infographic Generator - Single File Version
// For Cloudflare Dashboard direct deployment

const SENSENOVA_BASE_URL = "https://token.sensenova.cn/v1";

const PROMPT_TEMPLATES = [
  { id: "general", nameZh: "通用信息图", nameEn: "General",
    prompt: `请生成一张专业通用信息图

布局：采用 Bento Grid 模块化网格布局，主标题占据最大的核心格子（hero cell），附属内容分布在周围小格子中。格子之间用圆角边框分隔。

风格：Corporate Memphis 扁平矢量风格，配色以紫色、橙色、青色、金黄色为主。背景白色。标题加粗无衬线字体。包含简单装饰元素。

文字要求：所有中文文字使用清晰无衬线字体。标题加粗。正文简洁。关键数字放大加粗。

内容：
[在此输入你想展示的内容]` },
  { id: "comparison", nameZh: "对比分析", nameEn: "Comparison",
    prompt: `请生成一张对比分析信息图

布局：采用 Binary Comparison 左右对比布局，页面中间用竖线或渐变分割。左侧展示选项A/Before/优势，右侧展示选项B/After/劣势。两边元素水平对齐。

风格：专业科技品牌风格，干净简约。左侧冷蓝色调，右侧暖珊瑚色调。浅灰色背景。现代无衬线字体。每行对比配简单图标。

文字要求：顶部居中主标题。两侧标签清晰标注。关键差异用颜色或加粗强调。

对比内容：
[在此输入要对比的两项内容]` },
  { id: "timeline", nameZh: "时间线", nameEn: "Timeline",
    prompt: `请生成一张时间线信息图

布局：采用 Linear Progression 线性递进布局，事件沿一条从左到右或从上到下的路径排列。关键节点用圆形标记。路径用箭头连接。每个节点标注日期或序号。

风格：现代编辑风，配色从深蓝渐变为青色再到琥珀色。白色背景。每个事件节点配独特图标。标题加粗无衬线字体。

文字要求：日期/序号加粗突出。事件标题用中文。简要描述1-2行。顶部主标题。

时间线事件（按顺序）：
[在此输入时间线内容]` },
  { id: "steps", nameZh: "步骤流程", nameEn: "Steps",
    prompt: `请生成一张步骤流程信息图

布局：采用 Step Staircase 阶梯式布局，编号步骤按阶梯排列。每一步为一个区块：左侧大号步骤编号，中间图标，右侧说明。步骤之间用箭头连接。

风格：说明书风格，深蓝色标题，暖琥珀色图标，白色背景。简单线条图标。高对比度。无衬线字体。

文字要求：步骤编号超大加粗。步骤标题用中文。下方一行说明。最后一步稍大表示完成。

步骤（按顺序）：
[在此输入步骤内容]` },
  { id: "dataviz", nameZh: "数据看板", nameEn: "Dashboard",
    prompt: `请生成一张数据看板信息图

布局：采用 Dashboard 数据面板布局。顶部2-4个关键指标大号卡片。中部主图表（柱状图/折线图/饼图）。底部次要数据和标注。

风格：数据分析风，深蓝色背景。数据系列用青色、黄绿色、琥珀色、珊瑚色。文字用白色/浅灰色。精确网格线。数据点清晰标注。

文字要求：大数字用超大加粗字体。标签和坐标轴标题用中文。图例清晰。顶部主标题。

要可视化的数据：
[在此输入要可视化的数据]` },
  { id: "hub", nameZh: "中心辐射图", nameEn: "Hub & Spoke",
    prompt: `请生成一张中心辐射信息图

布局：采用 Hub & Spoke 中心辐射布局。中央圆形枢纽为核心主题。辐射线连接到4-6个外围节点，每个节点为相关子概念。节点均匀分布。

风格：扁平多彩风格，中心枢纽为深紫或翡翠绿。外围节点用蓝、绿、黄、橙、粉色。白色背景。简单扁平图标。圆角造型。干净无衬线字体。

文字要求：中心文字用中文加粗居中。每个节点有标签和一行描述。顶部主标题。

中心主题和相关内容：
[在此输入中心主题和相关内容]` },
  { id: "tech", nameZh: "科技风格", nameEn: "Tech Style",
    prompt: `请生成一张科技风信息图

布局：采用非对称 Bento Grid 布局，全宽深色背景。网格区块大小不一非对称排列。主标题占据最大突出区块。区块背景采用毛玻璃效果。

风格：未来科技风，午夜蓝黑背景，青蓝色主调，霓虹粉辅助色。毛玻璃面板带发光边框。细几何网格线。标题渐变文字。数据点发光效果。

文字要求：主标题用带青色渐变的加粗白色。正文浅灰色。重要数字用发光青蓝或品红色。确保暗色背景下的对比度。

内容：
[在此输入你想展示的内容]` }
];

const HTML_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SenseNova U1 Fast - Infographic Generator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 1.5rem; color: #333; }
    .lang-switch { position: absolute; top: 1rem; right: 1rem; }
    .lang-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 0.4rem 0.8rem; border-radius: 8px; cursor: pointer; font-size: 0.85rem; }
    .lang-btn:hover { background: rgba(255,255,255,0.3); }
    header { text-align: center; margin-bottom: 1.5rem; color: white; padding-top: 0.5rem; }
    header h1 { font-size: 2rem; margin-bottom: 0.3rem; }
    header p { font-size: 1rem; opacity: 0.9; }
    .main-layout { display: flex; gap: 1.5rem; align-items: flex-start; max-width: 1400px; margin: 0 auto; }
    .left-panel { width: 420px; flex-shrink: 0; }
    .right-panel { flex: 1; min-width: 0; }
    .card { background: white; border-radius: 16px; padding: 1.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
    .form-group { margin-bottom: 1rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.4rem; color: #555; font-size: 0.9rem; }
    textarea { width: 100%; min-height: 280px; padding: 0.8rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 0.9rem; font-family: inherit; resize: vertical; }
    textarea:focus { outline: none; border-color: #667eea; }
    .template-grid { display: flex; gap: 0.4rem; flex-wrap: wrap; }
    .template-chip { padding: 0.3rem 0.7rem; border: 1.5px solid #e0e0e0; border-radius: 14px; cursor: pointer; font-size: 0.78rem; background: white; transition: all 0.15s; white-space: nowrap; }
    .template-chip:hover { border-color: #667eea; background: #f0f0ff; }
    .template-chip.selected { background: #667eea; color: white; border-color: #667eea; }
    .size-selector, .count-selector { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .size-option, .count-option { padding: 0.5rem 1rem; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 0.85rem; transition: all 0.15s; }
    .size-option:hover, .count-option:hover { border-color: #667eea; }
    .size-option.selected, .count-option.selected { background: #667eea; color: white; border-color: #667eea; }
    .generate-btn { width: 100%; padding: 0.8rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 1.05rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }
    .generate-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    .result-section { display: none; min-height: 400px; }
    .result-section.show { display: block; }
    .loading { text-align: center; padding: 3rem; color: #667eea; }
    .loading-spinner { width: 36px; height: 36px; border: 4px solid #f0f0f0; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 0.8rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .image-grid { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); }
    .image-grid.single { grid-template-columns: 1fr; }
    .image-item { text-align: center; }
    .image-item img { max-width: 100%; border-radius: 10px; }
    .image-item .image-url { margin-top: 0.5rem; padding: 0.5rem; background: #f5f5f5; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 0.8rem; }
    .image-item .image-url a { color: #667eea; text-decoration: none; }
    .image-item .image-url a:hover { text-decoration: underline; }
    .error { background: #fee; border: 1px solid #fcc; color: #c00; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    .hint { font-size: 0.8rem; color: #888; margin-top: 0.3rem; }
    @media (max-width: 960px) { .main-layout { flex-direction: column; } .left-panel { width: 100%; } .right-panel { width: 100%; } .image-grid { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="lang-switch">
    <button class="lang-btn" onclick="toggleLang()">EN / 中文</button>
  </div>
  <header><h1 data-i18n="title">SenseNova U1 Fast</h1><p data-i18n="subtitle">Infographic Generator</p></header>
  <div class="main-layout">
    <div class="left-panel">
      <div class="card">
        <div class="form-group">
          <label data-i18n="promptLabel">Prompt</label>
          <textarea id="prompt" data-i18n-placeholder="promptPlaceholder" placeholder="Describe the infographic..."></textarea>
          <p class="hint" data-i18n="promptHint">Max 4096 tokens</p>
        </div>
        <div class="form-group">
          <label data-i18n="templateLabel">Template</label>
          <div class="template-grid" id="templateGrid"></div>
        </div>
        <div class="form-group">
          <label data-i18n="sizeLabel">Size</label>
          <div class="size-selector" id="sizeSelector">
            <div class="size-option selected" data-size="2752x1536" data-i18n="size1">16:9</div>
            <div class="size-option" data-size="2496x1664" data-i18n="size2">3:2</div>
            <div class="size-option" data-size="1664x2496" data-i18n="size3">2:3</div>
            <div class="size-option" data-size="2048x2048" data-i18n="size4">1:1</div>
            <div class="size-option" data-size="1536x2752" data-i18n="size5">9:16</div>
          </div>
        </div>
        <div class="form-group">
          <label data-i18n="countLabel">Count</label>
          <div class="count-selector" id="countSelector">
            <div class="count-option selected" data-count="1">1</div>
            <div class="count-option" data-count="2">2</div>
            <div class="count-option" data-count="3">3</div>
            <div class="count-option" data-count="4">4</div>
          </div>
        </div>
        <button class="generate-btn" id="generateBtn" data-i18n="generateBtn" onclick="generate()">Generate</button>
      </div>
    </div>
    <div class="right-panel">
      <div class="card result-section" id="resultSection">
        <h2 style="margin-bottom:0.8rem;" data-i18n="resultTitle">Result</h2>
        <div id="loading" class="loading"><div class="loading-spinner"></div><p data-i18n="generating">Generating...</p></div>
        <div id="imageResult" class="image-result" style="display:none;"><div class="image-grid" id="imageGrid"></div></div>
        <div id="errorResult" class="error" style="display:none;"></div>
      </div>
    </div>
  </div>
  <script>
    const promptTemplates = ${JSON.stringify(PROMPT_TEMPLATES)};
    const i18n = {
      en: {
        title: 'SenseNova U1 Fast',
        subtitle: 'Infographic Generator',
        promptLabel: 'Prompt',
        promptPlaceholder: 'Describe the infographic you want to generate...',
        promptHint: 'Max 4096 tokens',
        sizeLabel: 'Size',
        templateLabel: 'Template',
        countLabel: 'Count',
        size1: '16:9', size2: '3:2', size3: '2:3', size4: '1:1', size5: '9:16',
        generateBtn: 'Generate',
        resultTitle: 'Result',
        generating: 'Generating...'
      },
      zh: {
        title: 'SenseNova U1 Fast',
        subtitle: '信息图生成器',
        promptLabel: '提示词',
        promptPlaceholder: '描述你想生成的信息图...',
        promptHint: '最大支持 4096 tokens',
        sizeLabel: '图像尺寸',
        templateLabel: '模板',
        countLabel: '生成数量',
        size1: '16:9', size2: '3:2', size3: '2:3', size4: '1:1', size5: '9:16',
        generateBtn: '生成信息图',
        resultTitle: '生成结果',
        generating: '正在生成...'
      }
    };

    let currentLang = 'zh';
    let selectedSize = '2752x1536';
    let selectedCount = 1;

    function toggleLang() {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      document.documentElement.lang = currentLang;
      updateI18n();
      updateTemplateLabels();
    }

    function updateI18n() {
      const t = i18n[currentLang];
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) el.textContent = t[key];
      });
      document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) el.placeholder = t[key];
      });
    }

    initTemplates();
    document.querySelectorAll('.size-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedSize = opt.dataset.size;
      });
    });
    document.querySelectorAll('.count-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.count-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedCount = parseInt(opt.dataset.count);
      });
    });

    async function generate() {
      const prompt = document.getElementById('prompt').value.trim();
      const btn = document.getElementById('generateBtn');
      const resultSection = document.getElementById('resultSection');
      const loading = document.getElementById('loading');
      const imageResult = document.getElementById('imageResult');
      const imageGrid = document.getElementById('imageGrid');
      const errorResult = document.getElementById('errorResult');
      if (!prompt) { alert(currentLang === 'zh' ? '请输入提示词！' : 'Please enter a prompt!'); return; }
      resultSection.classList.add('show');
      loading.style.display = 'block';
      imageResult.style.display = 'none';
      errorResult.style.display = 'none';
      btn.disabled = true;
      btn.textContent = currentLang === 'zh' ? '生成中...' : 'Generating...';
      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, size: selectedSize, n: selectedCount }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed');
        const images = data.data || [];
        if (images.length === 0) throw new Error('No URLs returned');
        imageGrid.innerHTML = '';
        imageGrid.className = 'image-grid' + (images.length === 1 ? ' single' : '');
        images.forEach(img => {
          const item = document.createElement('div');
          item.className = 'image-item';
          item.innerHTML = '<img src="' + img.url + '" alt="Generated"><div class="image-url"><a href="' + img.url + '" target="_blank">' + img.url + '</a></div>';
          imageGrid.appendChild(item);
        });
        loading.style.display = 'none';
        imageResult.style.display = 'block';
      } catch (e) {
        loading.style.display = 'none';
        errorResult.style.display = 'block';
        errorResult.textContent = (currentLang === 'zh' ? '错误: ' : 'Error: ') + e.message;
      } finally {
        btn.disabled = false;
        btn.textContent = currentLang === 'zh' ? '生成信息图' : 'Generate';
      }
    }
    function initTemplates() {
      const grid = document.getElementById('templateGrid');
      promptTemplates.forEach(t => {
        const chip = document.createElement('div');
        chip.className = 'template-chip';
        chip.textContent = currentLang === 'zh' ? t.nameZh : t.nameEn;
        chip.dataset.id = t.id;
        chip.onclick = () => applyTemplate(t.id);
        grid.appendChild(chip);
      });
    }

    function applyTemplate(id) {
      const t = promptTemplates.find(t => t.id === id);
      if (!t) return;
      document.querySelectorAll('.template-chip').forEach(c => c.classList.remove('selected'));
      document.querySelector(\`.template-chip[data-id="\${id}"]\`).classList.add('selected');
      document.getElementById('prompt').value = t.prompt;
    }

    function updateTemplateLabels() {
      document.querySelectorAll('.template-chip').forEach(chip => {
        const t = promptTemplates.find(t => t.id === chip.dataset.id);
        if (t) chip.textContent = currentLang === 'zh' ? t.nameZh : t.nameEn;
      });
    }
  </script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // API
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }

    // Health check
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Serve HTML page
    return new Response(HTML_PAGE, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  },
};

async function handleGenerate(request, env) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    const body = await request.json();
    const { prompt, size = "2752x1536", n = 1 } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ error: "prompt is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Auto-optimize for Chinese text rendering
    const hasChinese = /[\u4e00-\u9fff]/.test(prompt);
    const optimizedPrompt = hasChinese
      ? prompt + '\n\n[CRITICAL: Chinese Text Rendering]\nAll Chinese text in this infographic must be rendered clearly and correctly.\n- Every Chinese character must be properly formed - NO garbled text, mojibake, or incorrect glyphs\n- Use clean sans-serif Chinese fonts for all Chinese text elements\n- Ensure proper character spacing and vertical alignment\n- 非常重要：信息图中所有中文文字必须清晰正确渲染，绝对不能出现乱码或方块字符'
      : prompt;

    const response = await fetch(SENSENOVA_BASE_URL + '/images/generations', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + env.SENSENOVA_API_KEY,
      },
      body: JSON.stringify({ model: "sensenova-u1-fast", prompt: optimizedPrompt, size, n }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ error: "API failed", details: errorText }), {
        status: response.status,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error", message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
}
