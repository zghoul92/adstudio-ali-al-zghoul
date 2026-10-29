const MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
const ALLOWED_ORIGINS = new Set([
  "https://zghoul92.github.io",
]);
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_PROMPT_LENGTH = 1800;

// Best-effort per-isolate throttling. This is not a global rate limiter.
const recentRequests = new Map();

function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "access-control-allow-origin": origin,
      "access-control-allow-methods": "POST, OPTIONS, GET",
      "access-control-allow-headers": "Content-Type",
      "vary": "Origin",
    },
  });
}

function allowedOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  return ALLOWED_ORIGINS.has(origin) ? origin : "";
}

function isRateLimited(ip) {
  const now = Date.now();
  const cutoff = now - 60_000;
  const recent = (recentRequests.get(ip) || []).filter((t) => t > cutoff);
  if (recent.length >= 3) {
    recentRequests.set(ip, recent);
    return true;
  }
  recent.push(now);
  recentRequests.set(ip, recent);
  if (recentRequests.size > 500) {
    for (const [key, values] of recentRequests) {
      if (!values.some((t) => t > cutoff)) recentRequests.delete(key);
    }
  }
  return false;
}

function dimensions(format) {
  switch (format) {
    case "مربع 1:1": return [1024, 1024];
    case "ستوري 9:16": return [576, 1024];
    case "أفقي 16:9": return [1024, 576];
    case "منشور 4:5":
    default: return [819, 1024];
  }
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request);
    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          "access-control-allow-origin": origin,
          "access-control-allow-methods": "POST, OPTIONS, GET",
          "access-control-allow-headers": "Content-Type",
          "access-control-max-age": "86400",
          "vary": "Origin",
        },
      });
    }

    const url = new URL(request.url);
    if (request.method === "GET" && url.pathname === "/") {
      return json({ ok: true, service: "AdStudio AI Worker", model: MODEL }, 200, origin);
    }

    if (request.method !== "POST" || url.pathname !== "/generate") {
      return json({ error: "المسار غير موجود." }, 404, origin);
    }
    if (!origin) return json({ error: "مصدر الطلب غير مسموح." }, 403, "");
    if (request.headers.get("content-length") && Number(request.headers.get("content-length")) > MAX_BODY_BYTES) {
      return json({ error: "حجم الطلب كبير. قلّل حجم صورة المنتج وحاول مجددًا." }, 413, origin);
    }

    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) {
      return json({ error: "تم بلوغ حد الطلبات المؤقت. انتظر دقيقة ثم حاول مجددًا." }, 429, origin);
    }

    try {
      const incoming = await request.formData();
      const prompt = String(incoming.get("prompt") || "").trim();
      const format = String(incoming.get("format") || "منشور 4:5");
      const image = incoming.get("image");
      if (!prompt) return json({ error: "اكتب وصف الإعلان أولًا." }, 400, origin);
      if (prompt.length > MAX_PROMPT_LENGTH) return json({ error: "وصف الإعلان طويل جدًا." }, 400, origin);
      if (image && image.size > 1_500_000) {
        return json({ error: "صورة المنتج أكبر من الحد المسموح بعد الضغط. جرّب صورة أصغر." }, 413, origin);
      }
      if (image && !(image instanceof File)) return json({ error: "ملف الصورة غير صالح." }, 400, origin);
      if (!image && !prompt) return json({ error: "أدخل وصفًا أو صورة." }, 400, origin);

      const [width, height] = dimensions(format);
      const modelInput = new FormData();
      modelInput.append("prompt", prompt);
      modelInput.append("width", String(width));
      modelInput.append("height", String(height));
      modelInput.append("guidance", "4");

      if (image && image.size > 0) {
        const imageType = image.type || "image/png";
        if (!["image/png", "image/jpeg", "image/webp"].includes(imageType)) {
          return json({ error: "نوع الصورة غير مدعوم. استخدم PNG أو JPG أو WebP." }, 415, origin);
        }
        modelInput.append("input_image_0", image, image.name || "product.png");
      }

      const serialized = new Response(modelInput);
      const result = await env.AI.run(MODEL, {
        multipart: {
          body: serialized.body,
          contentType: serialized.headers.get("content-type"),
        },
      });

      const base64 = result?.image;
      if (typeof base64 !== "string" || !base64.length) {
        return json({ error: "لم يرجع النموذج صورة. تحقق من توافر النموذج وحصة Workers AI." }, 502, origin);
      }
      const binary = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      return new Response(binary, {
        status: 200,
        headers: {
          "content-type": "image/png",
          "cache-control": "no-store",
          "access-control-allow-origin": origin,
          "vary": "Origin",
          "x-content-type-options": "nosniff",
        },
      });
    } catch (error) {
      const message = String(error?.message || error || "");
      const quota = /quota|limit|neuron|billing|payment|exceed/i.test(message);
      return json({
        error: quota
          ? "قد تكون الحصة المجانية اليومية قد انتهت أو أن Workers AI غير مفعّل. لم يتم تفعيل دفع تلقائي من هذا الكود."
          : "تعذّر توليد الصورة. تحقق من ربط Workers AI، ثم أعد المحاولة.",
        detail: message.slice(0, 240),
      }, 502, origin);
    }
  },
};
