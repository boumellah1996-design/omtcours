# OMT Optima Mobile Team

أكاديمية تصليح الهواتف والمايكروسولدرينغ في الحراش.

```bash
npm run dev
```

ثم افتح [http://localhost:3000](http://localhost:3000).

## ما يمكن تعديله بسهولة

- رقم الواتساب ورابط تيليغرام وصورة الأكاديمية: `lib/site.ts`
- ضع صورة المدرسة في `public/academy.jpg` ثم اجعل `academyImage` يساوي `"/academy.jpg"`
- المقتطفات التشويقية (حتى 15 مقطعاً لكل دورة): تُؤخذ من دروس الدورة المضافة في `/admin/courses`
- نصوص الواجهة بالعربي والفرنسي والإنجليزي والإسباني: `lib/i18n.ts`

البيانات (الطلبات، الدروس، والحسابات) تُحفظ في Neon Postgres.
ضع نفس `DATABASE_URL` (pooler) و `DIRECT_URL` (بدون `-pooler`) في `.env` وفي Vercel.

```bash
npm run db:migrate
npm run seed:admin
npm run db:import-local
```
