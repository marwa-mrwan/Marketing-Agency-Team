# مصادر Skills والإعداد المحمول

المستودع يحتوي تعليمات الفريق فقط: لا يضم ملفات Skills أو dependencies أو credentials، ولا يثبتها أو يصل الحسابات تلقائيًا. أسماء المهارات في [خريطة التوجيه](<agency-team/skill-routing.md>) اختيارات تُراجع مقابل كتالوج المضيف في كل تشغيل، وليست اشتراطًا بتحميلها جميعًا.

## مصادر عامة

| المجموعة والأسماء المرتبطة | المصدر الفعلي | طريقة الاستخدام وحدوده |
|---|---|---|
| `seo` و`seo-*` مثل audit/page/plan/technical/schema/hreflang/sitemap/images/drift/content-brief/cluster/local/ecommerce/backlinks، والامتدادات | [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) | اتبع README المصدر والمضيف؛ بعض الامتدادات تتطلب أدوات واشتراكات مستقلة. ليست `seo-strategist` أو `seo-report-sheet-builder` منسوبة لهذا المصدر. |
| `ads` وعائلة workflow/platform `ads-*` مثل google/plan/audit/attribution/server-side-tracking/test/launch/optimize/youtube | [AgriciDaniel/claude-ads](https://github.com/AgriciDaniel/claude-ads) | حافظ على عقود الأدلة والـJSON وبوابات التغيير؛ لا اتصال ولا mutation بمجرد التثبيت. الاستثناء المحلي `ads-search-term-sheet` موضح أدناه. |
| `blog` و`blog-*`، وBrain عند اختياره | [AgriciDaniel/claude-blog](https://github.com/AgriciDaniel/claude-blog) | اختر workflow لازمًا فقط؛ APIs والصور والصوت المدفوع لها موافقة وقدرة منفصلتان. |
| `wordpress-router` و`wp-project-triage` و`wp-*` الواردة بالخريطة، و`blueprint` | [WordPress/agent-skills](https://github.com/WordPress/agent-skills) | اتبع router واكتشف الإصدارات. تحقق من الاسم الحالي لكل تخصص؛ قد تختلف adaptations المثبتة أو إعادة تسميتها بين المضيفين. لا تنسخ مجلد runtime إلى المشروع. |
| `laravel-specialist` | [jeffallan/claude-skills — laravel-specialist](https://github.com/jeffallan/claude-skills/tree/main/skills/laravel-specialist) | metadata المثبتة تنسبه إلى Jeffallan؛ النسخة المحلية تتضمن hardening إضافيًا. احفظ [بوابة العزل والإذن](<agency-team/roles/laravel.md>) حتى عند تثبيت upstream غير المعدل. |
| `content-writer` | [aaron-he-zhu/aaron-marketing-skills](https://github.com/aaron-he-zhu/aaron-marketing-skills) | الرابط من metadata المهارة المثبتة؛ راجع تثبيت المصدر وترخيصه وتوافقه. |
| `paid-media-auditor` و`paid-media-ppc-strategist` — اختياريان | [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) | المصدر ينسب النصوص إلى John Williams (@itallstartedwithaidea). adaptations محلية وليست مكتبة كاملة مثبتة؛ لا تجعل المراجعة مالكًا موازيًا لنفس العمل. |

جرى فتح روابط المجموعات الست الأولى عدا `content-writer` وأعيد HTTP 200 في جولة إعداد النسخة العامة. هذا تحقق وصول للصفحات فقط؛ المحتوى المعاد مقتطع، وليس تدقيقًا لكل ملف أو ترخيص أو installer أو إثباتًا لتطابق النسخة المثبتة مع آخر upstream. رابط `content-writer` مستند إلى metadata محلية ولم يُفحص عبر الشبكة في هذه الجولة.

## محلية أو منشؤها العام غير مثبت

لا نخترع رابط GitHub لمهارة شخصية، ولا ننسب اسمًا عامًا إلى مستودع مشابه. الأسماء التالية مستخدمة في التعليمات لكن لم يُثبت لها مصدر توزيع عام في فحص metadata المتاح:

- `ads-search-term-sheet`، `conv-sheet-for-google-ads`، `seo-report-sheet-builder`، `gsc-content-refresh`.
- `seo-strategist`، `google-ads-strategist`، `google-ads-campaign-operator`، `copywriting`.
- `office`، `office-xlsx`، `office-docx`، `office-pptx`: قدرات تعتمد على المضيف/الحزمة الفعلية، لا روابط توزيع مفترضة.
- `youtube`: اختياري بطلب فيديو؛ لم يثبت رابط توزيع عام مطابق للاسم في هذا الفحص.

«غير مثبت» لا يعني بالضرورة أن المهارة خاصة أو بلا upstream؛ يعني عدم وجود دليل كافٍ للنسبة هنا. اطلب من مالكها مصدرًا مصرحًا أو استخدم workflow متاحًا واذكر النقص. لا تُنشر نسخ شخصية أو ملفات runtime لتعويض الغياب. يمكن تنفيذ مهام الفريق بقدرات محدودة مع الإفصاح؛ لا يُدّعى تحميل مهارة غائبة.

## خطوات آمنة للتثبيت والتشغيل

1. اختر مجموعة واحدة مناسبة للمهمة، وافتح README وملف الترخيص في مصدرها.
2. راجع scripts والأذونات والاتصالات قبل التنفيذ، واختر revision معروفًا حيث أمكن. لا تستخدم `curl | bash` بلا مراجعة وموافقة.
3. ثبّت عبر آلية المضيف المدعومة خارج هذا المستودع، ثم تأكد من ظهور الاسم في كتالوج جلسة جديدة وتحميل تعليماته الفعلية. المستندات هنا ليست أداة تثبيت.
4. أكد مصادر البيانات والحسابات والميزانيات والتكاليف بصورة مستقلة؛ لا ترسل بيانات عميل إلى مزود جديد أو تغيّر حسابًا بلا الإذن اللازم.
5. احتفظ بالأدلة والاختبارات الفعلية والقيود؛ المصدر أو المثال لا يثبت نجاح التشغيل.

## الحقوق

لا يعاد توزيع محتوى Skills upstream في هذه الحزمة. تظل تراخيص كل مصدر وحقوق مؤلفيه سارية، ويجب مراجعتها قبل النسخ أو التعديل أو التوزيع. لم تُضف رخصة نيابة عن مالك هذا المستودع. تعريف Infrastructure محلي ولا يدّعي استيراد أدوار سيرفرات من agency-agents.

## المناظرة الاختيارية
`debate-review` تعتمد على كتالوج المضيف؛ لم يُثبت مصدر توزيع عام مطابق هنا ولا تُوزع ملفاتها. يحمّلها Reviewer فعلًا عند توافرها وطلب المناظرة أو ملاءمتها، ولا يشغّل مشاركًا أو موديلًا إضافيًا دون اختيار المستخدم الصريح.
