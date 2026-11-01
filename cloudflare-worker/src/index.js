const MODEL = "@cf/black-forest-labs/flux-2-klein-4b";
const ALLOWED_ORIGINS = new Set([
  "https://zghoul92.github.io",
]);
const MAX_BODY_BYTES = 4 * 1024 * 1024;
const MAX_PROMPT_LENGTH = 1800;
const recentRequests = new Map();

function corsHeaders(origin = "") {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "Content-Type",
    "access-control-max-age": "86400",
    "vary": "Origin",
  };
  if (origin) headers["access-control-allow-origin"] = origin;
  return headers;
}
function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), { status, headers: corsHeaders(origin) });
}
function getAllowedOrigin(request) {
  const origin = request.headers.get("Origin") || "";
  return ALLOWED_ORIGINS.has(origin) ? origin : "";
}
function isRateLimited(ip) {
  const now = Date.now(), cutoff = now - 60_000;
  const recent = (recentRequests.get(ip) || []).filter(t => t > cutoff);
  if (recent.length >= 3) { recentRequests.set(ip, recent); return true; }
  recent.push(now); recentRequests.set(ip, recent);
  if (recentRequests.size > 500) {
    for (const [key, values] of recentRequests) if (!values.some(t => t > cutoff)) recentRequests.delete(key);
  }
  return false;
}
function dimensions(format) {
  switch (format) {
    case "مربع 1:1": return [1024, 1024];
    case "ستوري 9:16": return [576, 1024];
    case "أفقي 16:9": return [1024, 576];
    default: return [832, 1024];
  }
}
export default {
  async fetch(request, env) {
    const origin = getAllowedOrigin(request);
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      if (!origin) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: {
        "access-control-allow-origin": origin,
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-headers": "Content-Type",
        "access-control-max-age": "86400",
        "vary": "Origin"
      }});
    }
    if (request.method === "GET" && (url.pathname === "/" || url.pathname === "/health")) {
      return json({
        ok: true,
        service: "AdStudio AI Engine",
        model: MODEL,
        binding: Boolean(env.AI),
        endpoints: ["/health", "/generate"]
      }, 200, origin || undefined);
    }
    if (url.pathname !== "/generate") return json({ ok:false, error:"المسار غير موجود. استخدم /health أو /generate." }, 404, origin || undefined);
    if (request.method !== "POST") return json({ ok:false, error:"طريقة الطلب غير مدعومة. استخدم POST /generate." }, 405, origin || undefined);
    if (!origin) return json({ ok:false, error:"مصدر الطلب غير مسموح. تحقق من إعداد CORS." }, 403);
    if (!env.AI) return json({ ok:false, error:"ربط Workers AI غير موجود. أضف AI binding باسم AI في إعدادات Worker." }, 503, origin);
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > MAX_BODY_BYTES) return json({ ok:false, error:"حجم الطلب كبير؛ قلّل حجم الصورة." }, 413, origin);
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) return json({ ok:false, error:"طلبات كثيرة خلال دقيقة. انتظر قليلًا ثم أعد المحاولة." }, 429, origin);
    try {
      const incoming = await request.formData();
      const prompt = String(incoming.get("prompt") || "").trim();
      const format = String(incoming.get("format") || "منشور 4:5");
      const image = incoming.get("image");
      if (!prompt) return json({ ok:false, error:"اكتب وصف الإعلان أولًا." }, 400, origin);
      if (prompt.length > MAX_PROMPT_LENGTH) return json({ ok:false, error:"وصف الإعلان أطول من الحد المسموح." }, 400, origin);
      if (image && !(image instanceof File)) return json({ ok:false, error:"ملف الصورة غير صالح." }, 400, origin);
      if (image && image.size > 1_500_000) return json({ ok:false, error:"صورة المنتج كبيرة جدًا. استخدم صورة أصغر." }, 413, origin);
      if (image && image.size > 0 && !["image/png","image/jpeg","image/webp"].includes(image.type)) {
        return json({ ok:false, error:"استخدم صورة PNG أو JPG أو WebP." }, 415, origin);
      }
      const [width,height] = dimensions(format);
      const modelForm = new FormData();
      modelForm.append("prompt", prompt);
      modelForm.append("width", String(width));
      modelForm.append("height", String(height));
      modelForm.append("guidance", "4");
      if (image && image.size > 0) modelForm.append("input_image_0", image, image.name || "product.png");
      const serialized = new Response(modelForm);
      const result = await env.AI.run(MODEL, {
        multipart: { body: serialized.body, contentType: serialized.headers.get("content-type") }
      });
      if (!result || typeof result.image !== "string" || !result.image.length) {
        return json({ ok:false, error:"النموذج لم يُرجع صورة. تحقق من سجل Workers AI والحصة المتاحة." }, 502, origin);
      }
      const binary = Uint8Array.from(atob(result.image), c => c.charCodeAt(0));
      return new Response(binary, { status:200, headers:{
        "content-type":"image/png",
        "cache-control":"no-store",
        "access-control-allow-origin":origin,
        "access-control-expose-headers":"Content-Type",
        "vary":"Origin",
        "x-content-type-options":"nosniff"
      }});
    } catch (error) {
      const detail = String(error?.message || error || "Unknown error").slice(0,300);
      const quota = /quota|limit|neuron|exceed|capacity|billing/i.test(detail);
      return json({
        ok:false,
        error: quota
          ? "قد تكون الحصة المجانية اليومية انتهت أو أن النموذج غير متاح حاليًا. لن يتم تفعيل أي دفع تلقائي من هذا التطبيق."
          : "فشل Workers AI في تنفيذ الطلب. راجع سجل Worker لمعرفة السبب.",
        detail
      }, 502, origin);
    }
  }
};
