# راهنمای راه‌اندازی کلاس هوشمند

## این بسته چیست؟
نسخه MVP توسعه‌پذیر است، نه سامانه تجاری نهایی. روی یک دستگاه در حالت آزمایشی آفلاین کار می‌کند؛ ورود امن و همگام‌سازی واقعی فقط پس از تنظیم Supabase فعال می‌شود.

## فایل‌ها
- `index.html`: رابط برنامه
- `style.css`: طراحی واکنش‌گرا
- `app.js`: منطق پنل‌ها و اتصال
- `sw.js` و `manifest.webmanifest`: نصب PWA و کش فایل‌های رابط
- `supabase/schema.sql`: جدول‌ها و سیاست‌های امنیتی
- `supabase/functions/create-student/index.ts`: تابع امن ساخت حساب دانش‌آموز
- `SETUP-FA.md`: این راهنما

## راه‌اندازی آنلاین
1. در Supabase یک پروژه بساز.
2. کل فایل `supabase/schema.sql` را در SQL Editor اجرا کن.
3. از تنظیمات پروژه، Project URL و کلید عمومی anon/publishable را بردار.
4. فایل `app.js` را باز کن و `YOUR_SUPABASE_PROJECT_URL` و `YOUR_SUPABASE_ANON_PUBLIC_KEY` را جایگزین کن. کلید service_role محرمانه است و نباید در مرورگر قرار گیرد.
5. در Supabase → Authentication → Users یک حساب با ایمیل خودت بساز.
6. در SQL Editor نقش حساب مدرس را فعال کن؛ ایمیل را با ایمیل خودت جایگزین کن:
   ```sql
   update public.profiles
   set role='teacher', grade=0, display_name='نام مدرس'
   where email='YOUR_EMAIL';
   ```
7. برای ساخت حساب دانش‌آموز از پنل مدرس، تابع Edge Function را با Supabase CLI منتشر کن:
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase functions deploy create-student
   ```
   مطمئن شو secrets سمت سرور `SUPABASE_URL`، `SUPABASE_SERVICE_ROLE_KEY` و `SUPABASE_ANON_KEY` تنظیم‌اند. هیچ‌وقت service role را در `app.js` قرار نده.
8. پوشه را روی میزبانی استاتیک HTTPS مانند Cloudflare Pages یا GitHub Pages منتشر کن. آدرس سایت را در Authentication → URL Configuration به‌عنوان Site URL و Redirect URL تنظیم کن.
9. با حساب مدرس و یک حساب دانش‌آموز جداگانه آزمایش کن.

## استفاده روی گوشی
- سایت منتشرشده را در Chrome اندروید باز کن.
- منوی سه‌نقطه → «افزودن به صفحه اصلی» را بزن.
- برای کش‌شدن فایل‌های برنامه، یک بار در حالت آنلاین بازش کن.

## محدودیت‌ها و نکات مهم
- حالت آزمایشی رمزگذاری یا احراز هویت واقعی ندارد؛ برای اطلاعات واقعی کودکان استفاده نکن.
- صف آفلاین این نسخه ابتدایی است و همگام‌سازی خودکار تغییرات محلی را به‌طور کامل حل نمی‌کند؛ اطلاعات آفلاین را با فایل پشتیبان حفظ کن.
- برای آزمون‌های واقعی، کلید پاسخ در این نمونه به مرورگر ارسال می‌شود؛ برای آزمون امن باید تصحیح پاسخ در سرور انجام شود.
- قابلیت تماس تصویری زنده، اعلان‌ها، بازیابی رمز عبور، پرداخت و گزارش‌های پیشرفته هنوز نیازمند توسعه‌اند.
- قبل از انتشار عمومی، سیاست حریم خصوصی، رضایت والدین در صورت لزوم، امنیت RLS و رفتار همگام‌سازی باید بازبینی شود.
- برای اجرای آزمایشی روی کامپیوتر می‌توان از VS Code Live Server یا `python -m http.server 8000` استفاده کرد؛ بازکردن مستقیم `file://` برای Service Worker کافی نیست.
