# OMT Optima Mobile Team

أكاديمية تصليح الهواتف والمايكروسولدرينغ في الحراش.

```bash
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000).

## ما يمكن تعديله بسهولة

- رقم الواتساب ورابط تيليغرام وصورة الأكاديمية: `lib/site.ts`
- ضع صورة المدرسة في `public/academy.jpg` ثم اجعل `academyImage` يساوي `"/academy.jpg"`
- روابط المقتطفات (15 مقطعاً لكل دورة): `lib/courses.ts` داخل `teaserSources`
- نصوص الواجهة بالعربي والفرنسي والإنجليزي والإسباني: `lib/i18n.ts`

طلبات الاشتراك تُحفظ محلياً في `data/enrollments.json` إلى أن تُربط قاعدة بيانات. هذا المجلد غير مضاف إلى Git.

حماية لوحة التحكم (`/admin`) تُفعّل لاحقاً بضبط `AUTH_ENFORCE=true` بعد ربط تسجيل الدخول.
