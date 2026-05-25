// SenseNova U1 Fast Infographic Generator - Single File Version
// For Cloudflare Dashboard direct deployment

const SENSENOVA_BASE_URL = "https://token.sensenova.cn/v1";

const HTML_PAGE = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SenseNova U1 Fast - Infographic Generator</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 2rem; color: #333; }
    .container { max-width: 900px; margin: 0 auto; }
    header { text-align: center; margin-bottom: 2rem; color: white; }
    header h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    header p { font-size: 1.1rem; opacity: 0.9; }
    .lang-switch { position: absolute; top: 1rem; right: 1rem; }
    .lang-btn { background: rgba(255,255,255,0.2); color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .lang-btn:hover { background: rgba(255,255,255,0.3); }
    .card { background: white; border-radius: 16px; padding: 2rem; margin-bottom: 1.5rem; box-shadow: 0 10px 40px rgba(0,0,0,0.15); }
    .form-group { margin-bottom: 1.5rem; }
    label { display: block; font-weight: 600; margin-bottom: 0.5rem; color: #555; }
    textarea { width: 100%; min-height: 180px; padding: 1rem; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 1rem; font-family: inherit; resize: vertical; }
    textarea:focus { outline: none; border-color: #667eea; }
    .size-selector { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .size-option { padding: 0.75rem 1.25rem; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 0.9rem; }
    .size-option:hover { border-color: #667eea; }
    .size-option.selected { background: #667eea; color: white; border-color: #667eea; }
    button { width: 100%; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 10px; font-size: 1.1rem; font-weight: 600; cursor: pointer; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .result-section { display: none; }
    .result-section.show { display: block; }
    .loading { text-align: center; padding: 2rem; color: #667eea; }
    .loading-spinner { width: 40px; height: 40px; border: 4px solid #f0f0f0; border-top: 4px solid #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    .image-result { text-align: center; }
    .image-result img { max-width: 100%; border-radius: 10px; }
    .image-url { margin-top: 1rem; padding: 1rem; background: #f5f5f5; border-radius: 8px; word-break: break-all; font-family: monospace; font-size: 0.9rem; }
    .error { background: #fee; border: 1px solid #fcc; color: #c00; padding: 1rem; border-radius: 8px; margin-top: 1rem; }
    .hint { font-size: 0.85rem; color: #888; margin-top: 0.5rem; }
    .api-info { font-size: 0.8rem; color: #999; text-align: center; margin-top: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="lang-switch">
      <button class="lang-btn" onclick="toggleLang()">EN / 中文</button>
    </div>
    <header><h1 data-i18n="title">SenseNova U1 Fast</h1><p data-i18n="subtitle">Infographic Generator</p></header>
    <div class="card">
      <div class="form-group">
        <label data-i18n="promptLabel">Prompt</label>
        <textarea id="prompt" data-i18n-placeholder="promptPlaceholder" placeholder="Describe the infographic you want to generate..."></textarea>
        <p class="hint" data-i18n="promptHint">Max 4096 tokens</p>
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
      <button id="generateBtn" data-i18n="generateBtn" onclick="generate()">Generate</button>
    </div>
    <div class="card result-section" id="resultSection">
      <h2 style="margin-bottom: 1rem;" data-i18n="resultTitle">Result</h2>
      <div id="loading" class="loading"><div class="loading-spinner"></div><p data-i18n="generating">Generating...</p></div>
      <div id="imageResult" class="image-result" style="display: none;"><img id="generatedImage" src="" alt="Generated"><div class="image-url"><a id="imageUrl" href="" target="_blank"></a></div></div>
      <div id="errorResult" class="error" style="display: none;"></div>
    </div>
  </div>
  <script>
    const i18n = {
      en: {
        title: 'SenseNova U1 Fast',
        subtitle: 'Infographic Generator',
        promptLabel: 'Prompt',
        promptPlaceholder: 'Describe the infographic you want to generate...',
        promptHint: 'Max 4096 tokens',
        sizeLabel: 'Size',
        size1: '16:9',
        size2: '3:2',
        size3: '2:3',
        size4: '1:1',
        size5: '9:16',
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
        size1: '16:9',
        size2: '3:2',
        size3: '2:3',
        size4: '1:1',
        size5: '9:16',
        generateBtn: '生成信息图',
        resultTitle: '生成结果',
        generating: '正在生成...'
      }
    };

    let currentLang = 'zh';
    let selectedSize = '2752x1536';

    function toggleLang() {
      currentLang = currentLang === 'en' ? 'zh' : 'en';
      document.documentElement.lang = currentLang;
      updateI18n();
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

    document.querySelectorAll('.size-option').forEach(opt => {
      opt.addEventListener('click', () => {
        document.querySelectorAll('.size-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selectedSize = opt.dataset.size;
      });
    });

    async function generate() {
      const prompt = document.getElementById('prompt').value.trim();
      const btn = document.getElementById('generateBtn');
      const resultSection = document.getElementById('resultSection');
      const loading = document.getElementById('loading');
      const imageResult = document.getElementById('imageResult');
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
          body: JSON.stringify({ prompt, size: selectedSize, n: 1 }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed');
        const imageUrl = data.data?.[0]?.url;
        if (!imageUrl) throw new Error('No URL returned');
        document.getElementById('generatedImage').src = imageUrl;
        document.getElementById('imageUrl').href = imageUrl;
        document.getElementById('imageUrl').textContent = imageUrl;
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

    const response = await fetch(`${SENSENOVA_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.SENSENOVA_API_KEY}`,
      },
      body: JSON.stringify({ model: "sensenova-u1-fast", prompt, size, n }),
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