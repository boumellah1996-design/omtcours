# OMT Optima Mobile Team

أكاديمية تصليح الهواتف والمايكروسولدرينغ في الحراش.

```bash
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000).

## ما يمكن تعديله بسهولة

- رقم الواتساب ورابط تيليغرام وصورة الأكاديمية: `lib/site.ts`
- ضع صورة المدرسة في `public/academy.jpg` ثم اجعل `academyImage` يساوي `"/academy.jpg"`
- المقتطفات التشويقية (حتى 15 مقطعاً لكل دورة): تُؤخذ من فيديوهات الدورة المضافة في `/admin/videos`
- نصوص الواجهة بالعربي والفرنسي والإنجليزي والإسباني: `lib/i18n.ts`

البيانات (الطلبات، الدروس، والحسابات) تُحفظ في Postgres عبر `DATABASE_URL`.
يجب أن تكون نفس القيمة في ملف `.env` المحلي وفي Vercel → Settings → Environment Variables.
SQLite (`file:...`) لا يبقى على Vercel لأن الملفات تُمسح مع كل نشر.

```bash
npx prisma db push
npm run db:import-local
```
