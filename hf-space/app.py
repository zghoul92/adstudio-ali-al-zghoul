import os
import spaces
import gradio as gr
import torch
from PIL import Image, ImageOps
from diffusers import StableDiffusionXLImg2ImgPipeline

MODEL_ID = os.getenv("MODEL_ID", "stabilityai/stable-diffusion-xl-base-1.0")
ADAPTER_REPO = os.getenv("ADAPTER_REPO", "h94/IP-Adapter")
pipe = None

def load_pipe():
    global pipe
    if pipe is None:
        pipe = StableDiffusionXLImg2ImgPipeline.from_pretrained(
            MODEL_ID,
            torch_dtype=torch.float16,
            use_safetensors=True,
            variant="fp16",
        )
        pipe.load_ip_adapter(
            ADAPTER_REPO,
            subfolder="sdxl_models",
            weight_name="ip-adapter_sdxl.bin",
        )
        pipe.enable_attention_slicing()
        pipe.enable_vae_slicing()
        pipe.to("cpu")
    return pipe

@spaces.GPU(duration=120)
def generate(image, prompt, style, aspect, preserve):
    if image is None:
        raise gr.Error("يرجى رفع صورة المنتج أولاً.")
    if not prompt or not prompt.strip():
        raise gr.Error("اكتب وصف المشهد الإعلاني أولاً.")

    p = load_pipe()
    p.to("cuda")
    try:
        ratios = {"منشور 4:5": (832, 1040), "مربع 1:1": (1024, 1024),
                  "ستوري 9:16": (720, 1280), "أفقي 16:9": (1152, 648)}
        width, height = ratios.get(aspect, (832, 1040))
        source = ImageOps.exif_transpose(image).convert("RGB")
        # Fit the entire original product into the selected canvas; never crop it.
        fitted = ImageOps.contain(source, (width, height), Image.Resampling.LANCZOS)
        canvas = Image.new("RGB", (width, height), (238, 233, 249))
        canvas.paste(fitted, ((width-fitted.width)//2, (height-fitted.height)//2))
        scene = {
            "فاخر وأنيق": "premium luxury product campaign, elegant studio lighting, refined neutral background, commercial photography",
            "شتوي وسينمائي": "cinematic winter product campaign, realistic cold atmosphere, soft snow accents, dramatic commercial lighting",
            "عصري وبسيط": "modern minimalist ecommerce product campaign, clean set, soft shadows, premium studio photography",
            "ألوان جريئة": "bold colorful commercial product campaign, vibrant art direction, crisp studio lighting",
            "طبيعي وخارجي": "natural outdoor product advertising, realistic daylight, tasteful environmental setting, professional photography",
        }.get(style, "premium commercial product photography")
        full_prompt = (
            f"Create a professional advertising photograph. {scene}. "
            f"Brief: {prompt.strip()}. Keep the same product from the reference image: "
            "preserve its silhouette, materials, color, pattern, sole, stitching, labels and distinctive details. "
            "Change mainly the environment, background and lighting. Photorealistic, high detail, commercial quality. "
            "No added text, no watermark, no extra products."
        )
        p.set_ip_adapter_scale(float(preserve))
        result = p(
            prompt=full_prompt,
            negative_prompt="different product, changed shape, changed color, extra straps, extra soles, distorted object, duplicate product, text, watermark, blurry, low quality",
            image=canvas,
            ip_adapter_image=canvas,
            strength=max(0.22, min(0.72, 0.72 - float(preserve)*0.42)),
            guidance_scale=5.5,
            num_inference_steps=25,
            width=width,
            height=height,
        ).images[0]
        return result
    except Exception as exc:
        raise gr.Error(f"تعذر توليد الإعلان: {exc}")
    finally:
        p.to("cpu")
        if torch.cuda.is_available():
            torch.cuda.empty_cache()

with gr.Blocks(title="AdStudio Ali Al-Zghoul | AI Ad Generator", theme=gr.themes.Soft(primary_hue="violet")) as demo:
    gr.Markdown("# ✦ AdStudio Ali Al-Zghoul\n### مولّد الإعلانات بالذكاء الاصطناعي — ارفع صورة المنتج وحافظ على تفاصيله قدر الإمكان")
    with gr.Row():
        with gr.Column():
            image = gr.Image(label="صورة المنتج", type="pil")
            prompt = gr.Textbox(label="وصف المشهد الإعلاني", placeholder="مثال: حذاء شتوي فاخر في مشهد ثلجي بإضاءة سينمائية", lines=3)
            style = gr.Dropdown(["فاخر وأنيق", "شتوي وسينمائي", "عصري وبسيط", "ألوان جريئة", "طبيعي وخارجي"], value="فاخر وأنيق", label="الأسلوب")
            aspect = gr.Dropdown(["منشور 4:5", "مربع 1:1", "ستوري 9:16", "أفقي 16:9"], value="منشور 4:5", label="مقاس الإعلان")
            preserve = gr.Slider(0.5, 1.0, value=0.85, step=0.05, label="قوة الحفاظ على المنتج", info="ارفع القيمة للحفاظ على شكل المنتج؛ قد يقل تنوع المشهد.")
            run = gr.Button("✦ توليد الإعلان", variant="primary")
        with gr.Column():
            output = gr.Image(label="الإعلان الناتج", type="pil")
            gr.Markdown("**ملاحظة:** نماذج الانتشار قد تغيّر بعض التفاصيل الدقيقة أو الكتابات والشعارات. راجع النتيجة قبل نشرها، واستخدم محررًا لإضافة النصوص النهائية.")
    run.click(generate, inputs=[image, prompt, style, aspect, preserve], outputs=output, api_name="generate")

demo.queue(default_concurrency_limit=1).launch()
