# AdStudio Ali Al-Zghoul

منصة عربية لإنشاء إعلانات المنتجات بالذكاء الاصطناعي، بواجهة RTL متوافقة مع الهاتف، ومحرك صور مستقل على Cloudflare Workers AI.

## رابط الموقع
https://zghoul92.github.io/adstudio-ali-al-zghoul/

## مهارات تطوير المشروع (AI Skills)
أضفنا إلى المستودع مجموعة مهارات خاصة بـ AdStudio مستوحاة من منهج Replica Skill، ومكيّفة مع بنية مشروعنا بدل بناء نسخة عامة من تطبيق آخر.

- دليل سير العمل: [docs/ADSTUDIO_SKILL_WORKFLOW.md](docs/ADSTUDIO_SKILL_WORKFLOW.md)
- المهارات الإحدى عشرة: [\.claude/skills/](.claude/skills/)
- التسلسل المقترح: recon → architect → design → build → backend → test → diff → entrepreneur → brand → launch → deploy.

المهارات تعليمات لمساعد برمجي متوافق مع ملفات SKILL.md؛ لا تشغّل نموذج توليد الصور بنفسها ولا تنشر التطبيق تلقائيًا. وهي تراعي العربية RTL، الحفاظ على صورة المنتج قدر الإمكان، بنية Cloudflare الحالية، وشرط عدم تفعيل أي خدمة مدفوعة دون موافقة صريحة.

## البنية
- الواجهة: GitHub Pages من ملف `index.html`.
- محرك الصور: Cloudflare Worker داخل `cloudflare-worker/`.
- النموذج الافتراضي: `@cf/black-forest-labs/flux-2-klein-4b`.
- لا توجد مفاتيح API في المتصفح. ربط Workers AI يتم من خلال binding اسمه `AI`.

## نشر المحرك من جديد
1. افتح Cloudflare Dashboard ثم Workers & Pages.
2. افتح Worker باسم `adstudio-ai-engine` أو أنشئ Worker جديدًا بهذا الاسم.
3. في إعدادات المشروع/البناء اجعل مجلد العمل هو جذر المستودع، وأمر النشر:
   `npx wrangler deploy --config cloudflare-worker/wrangler.jsonc`
4. تأكد من إعدادات Worker أن AI binding موجود بالاسم `AI` ومربوط بخدمة Workers AI.
5. بعد النشر، انسخ عنوان `workers.dev` الأساسي الظاهر في صفحة Worker نفسها. لا تستخدم رابط Preview أو عنوان deployment مؤقت.
6. افتح الموقع، ثم «إعداد محرك الذكاء الاصطناعي»، الصق العنوان، اضغط «حفظ رابط Cloudflare»، ثم «اختبار الاتصال».
7. يجب أن يعرض الاختبار اتصالًا سليمًا واسم النموذج و`binding=true` قبل تجربة التوليد.

## نقاط فحص المحرك
- `GET /` و `GET /health`: يعيدان حالة الخدمة ووجود AI binding.
- `POST /generate`: يستقبل `FormData` تحتوي `prompt` و`format` وصورة اختيارية باسم `image`.
- `OPTIONS`: يدعم CORS preflight لموقع GitHub Pages.
- يسمح فقط بالمصدر `https://zghoul92.github.io`. إذا غيّرت نطاق الواجهة، أضف النطاق الجديد إلى `ALLOWED_ORIGINS` في `cloudflare-worker/src/index.js` ثم أعد النشر.
- صورة المرجع يجب أن تكون أقل من 1.5MB بعد الضغط، وبصيغة PNG/JPG/WebP.

## حدود المجانية
راجع صفحة الأسعار الرسمية: https://developers.cloudflare.com/workers-ai/platform/pricing/
لا تفعّل خطة مدفوعة إذا كان شرطك صفر تكلفة. الحصص والحدود قد تتغير؛ تحقق منها قبل الاعتماد عليها.

## تشخيص الأخطاء
- `Failed to fetch`: غالبًا عنوان Worker غير صحيح/غير منشور أو CORS أو اتصال الشبكة. استخدم زر «اختبار الاتصال».
- `404`: رابط غير صحيح أو Worker آخر.
- `405`: الخادم لا يقبل الطريقة أو أن الرابط لا يشير إلى Worker هذا المشروع.
- `403`: تحقق من CORS ومصدر الموقع.
- `503`: AI binding باسم AI غير مربوط.
- `429`: تجاوز حد الطلبات المؤقت.
- `502`: فشل النموذج أو الحصة أو سعة الخدمة؛ راجع Cloudflare Worker Logs.
- `413`: حجم الصورة أكبر من الحد المسموح.

## ملاحظة حول الحفاظ على المنتج
النموذج يستطيع الاستفادة من صورة مرجعية إذا كان مدخل النموذج يدعم ذلك، لكنه قد يغيّر بعض التفاصيل الدقيقة. افحص الشعار والكتابة والشكل واللون قبل نشر الإعلان، وأضف النصوص والأسعار يدويًا في محرر تصميم.
