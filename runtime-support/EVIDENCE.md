# سجل التحقق — 2026-11-16

## النتيجة

حُفظت الحزم الأربع المحلية كاملة: 44 ملفًا شاملًا LICENSE المضاف لكل أرشيف، مع declarations الأدوات التسع، وواجهة الفريق وpatch التفعيل. سُجلت بصمات manifests لـ128 حزمة في dependency_inventory؛ **كود هذه التبعيات ليس ضمن النسخة**. لم يُستخدم موديل مدفوع أو credentials أو بيانات عميل في الاختبارات.

**اختبار الاستقلال فشل فعليًا:** فُكت الحزم الأربع إلى مجلد مؤقت منفصل، وشُغل import لخدمة Team في Node.js `v22.22.1`، دون ربط `node_modules` بالتثبيت الأصلي ودون بيئة التطبيق. خرجت العملية بكود `1` ورسالة `ERR_MODULE_NOT_FOUND` للحزمة `@deepseek-ai/cordis`. هذا دليل ضد الادعاء بأن الأرشيفات وحدها تعمل مستقلة، وليس فحصًا ناجحًا للتشغيل.

## فحوص تاريخية موثقة في المصدر، وليست إعادة اختبار لهذه النسخة

الأوامر من مجلد المشروع الذي يحتوي مجلد Marketing-Agency-Team:

```bash
python3 Marketing-Agency-Team/runtime-support/doctor.py
python3 Marketing-Agency-Team/runtime-support/doctor.py --runtime /path/to/compatible/runtime
python3 -m unittest discover -s Marketing-Agency-Team/runtime-support -p 'test_*.py' -v
```

نتائج doctor: أربعة أرشيفات، 44 ملفًا، وتسعة tool declarations؛ ملفات الحزم وهوية build وmanifests التبعيات المفحوصة تطابق المثبت. اجتازت الاختبارات الخمسة: snapshot سليمة، runtime مفقود مرفوض، رفض traversal، اكتشاف فساد الأرشيف، ورفض member غير آمن حتى مع تحديث hash الخارجي.

شُغل كذلك `node --check` باستخدام ملف `.mjs` مؤقت لكل ملف JavaScript داخل الأرشيفات: **20 ملفًا اجتازت فحص syntax**. لم ينفذ هذا الفحص كود الحزم. هذه النتيجة ليست import/linking أو اختبار خدمة.

تحققت SHA-512 لكل tarball npm قبل أخذ LICENSE ومقارنة مدخل JavaScript. الاختلاف المحلي عن npm في خدمة Team موثق في [الفرق](<installed-vs-npm.patch>). فحص declarations الأدوات ليس إثباتًا بأن registrations تعمل على مضيف جديد.

## فجوات واعتماديات

جرد التبعيات بحث في top-level node_modules، لا محرك resolution كاملًا ولا تحققًا من جميع optional/native packages. الأسماء غير المحلولة في هذا الجرد: `@deepseek-ai/dsh-client-ui-primitives`, `bufferutil`, `utf-8-validate`. قد تكون optional أو مضمَّنة أو مثبتة بمسار nested؛ لم يُحسم ذلك. لا يجوز وصف جرد manifests بأنه dependency closure مكتملة.

## لم يُختبر

- تحميل الحزم على ZadLoop أحدث أو على Windows/macOS.
- إعادة بناء client-set أو تفعيل plugin في profile آخر.
- تشغيل مستقل ناجح دون التطبيق الأصلي أو كامل تبعيات DSH.
- إنشاء عضو/رسائل/مهام/استمرار بعد restart في runtime مستعاد.
- تغيير موديل عضو من الواجهة، ومصادقة مزود موديلات أو استخدام الحسابات.
- استعادة installer كامل أو rollback فعلي، وفحص أمني شامل.

## القرار

هذه **نسخة مصدر تشغيلية/مرجعية للميزة** وليست ضمان استعادة مستقل. لضمان الحفاظ على التجربة الحالية عند حذف الميزة جذريًا، يلزم مسار إضافي: نسخة تطبيق قديم كاملة متحققة وقابلة للتشغيل منفصلة، أو توزيع DSH مستقل مع dependencies وlockfile واختبارات قبول. لا يُعلن أيٌّ منهما منجزًا هنا.
