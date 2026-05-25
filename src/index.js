// SenseNova U1 Fast 信息图生成器 - Cloudflare Worker
// API 代理 + 静态页面托管

const SENSENOVA_BASE_URL = "https://token.sensenova.cn/v1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS 预检
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    // API 代理路由
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }

    // 健康检查
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "sensenova-infographic" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // 静态文件托管
    if (env.__STATIC_CONTENT) {
      let path = url.pathname;
      if (path === "/" || path === "/index.html") {
        path = "/index.html";
      }

      const file = await env.__STATIC_CONTENT.get(path.slice(1));
      if (file) {
        const contentType = getContentType(path);
        return new Response(file.body, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=3600",
          },
        });
      }
    }

    return new Response("Not Found", { status: 404 });
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
      return jsonResponse({ error: "prompt 是必填参数" }, 400, corsHeaders);
    }

    // 调用 SenseNova U1 Fast API
    const response = await fetch(`${SENSENOVA_BASE_URL}/images/generations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.SENSENOVA_API_KEY}`,
      },
      body: JSON.stringify({
        model: "sensenova-u1-fast",
        prompt: prompt,
        size: size,
        n: n,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return jsonResponse(
        { error: "API 请求失败", details: errorText, status: response.status },
        response.status,
        corsHeaders
      );
    }

    const data = await response.json();
    return jsonResponse(data, 200, corsHeaders);

  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      { error: "服务器内部错误", message: error.message },
      500,
      corsHeaders
    );
  }
}

function jsonResponse(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

function getContentType(path) {
  const ext = path.split(".").pop().toLowerCase();
  const types = {
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    ico: "image/x-icon",
    woff2: "font/woff2",
  };
  return types[ext] || "application/octet-stream";
}
