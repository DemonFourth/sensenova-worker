// SenseNova U1 Fast ��Ϣͼ������ - Cloudflare Worker
// API ���� + ��̬ҳ���й�

const SENSENOVA_BASE_URL = "https://token.sensenova.cn/v1";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // CORS Ԥ��
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

    // API ����·��
    if (url.pathname === "/api/generate" && request.method === "POST") {
      return handleGenerate(request, env);
    }

    // �������
    if (url.pathname === "/health") {
      return new Response(JSON.stringify({ status: "ok", service: "sensenova-infographic" }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // ��̬�ļ��й�
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
      return jsonResponse({ error: "prompt �Ǳ������" }, 400, corsHeaders);
    }

    // ���� SenseNova U1 Fast API
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
        { error: "API ����ʧ��", details: errorText, status: response.status },
        response.status,
        corsHeaders
      );
    }

    const data = await response.json();
    return jsonResponse(data, 200, corsHeaders);

  } catch (error) {
    console.error("Error:", error);
    return jsonResponse(
      { error: "�������ڲ�����", message: error.message },
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
