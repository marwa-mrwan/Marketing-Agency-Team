# منشأ النسخة وحقوقها

الحزم الأربع في snapshots من توزيع ZadLoop `0.10.3` المثبت، بإصدار حزم معلن `0.2.2-rc.1`، وليست كودًا أصليًا لمستودع Marketing Agency Team. ملفاتها الأصلية نُقلت دون تعديل وظيفي؛ أضيف LICENSE إلى كل أرشيف من توزيع npm لنفس اسم الحزمة وإصدارها، بعد التحقق من `dist.integrity` باستخدام SHA-512. نص الترخيص: MIT، Copyright (c) 2026 DeepSeek؛ محفوظ كاملًا في كل أرشيف وفي [DeepSeek-MIT.txt](<licenses/DeepSeek-MIT.txt>). لا تمنح هذه الملاحظة ترخيصًا عامًا لبقية المستودع نيابةً عن صاحبه.

مصادر npm المستخدمة بتاريخ 2026-11-16:

- [خدمة الفريق](https://registry.npmjs.org/@deepseek-ai%2Fdsh-experimental-agent-team/0.2.2-rc.1)
- [الأدوات](https://registry.npmjs.org/@deepseek-ai%2Fdsh-experimental-tool-agent-team/0.2.2-rc.1)
- [الواجهة](https://registry.npmjs.org/@deepseek-ai%2Fdsh-experimental-client-ui-agent-team/0.2.2-rc.1)
- [حزمة التفعيل](https://registry.npmjs.org/@deepseek-ai%2Fdsh-experimental-agent-team-profile/0.2.2-rc.1)

تذكر metadata المستودع upstream `deepseek-ai/deepseek-harness`. محاولة استرجاع LICENSE من فرع `main` عبر raw GitHub أعادت 404؛ لذلك لا نعتمد على توفر المصدر على GitHub كشرط للاسترجاع. مصادر npm وintegrity مثبتة في [manifest.json](<manifest.json>). لم تُفحص هوية ناشر npm أو توقيعاته بمفاتيح مستقلة؛ integrity يثبت مطابقة metadata المسترجعة، وليس شهادة سلسلة توريد.

مدخل `lib/index.js` المحلي لخدمة الفريق **لا يطابق** مدخل npm لنفس الإصدار: النسخة المثبتة تضيف `history: "active"` إلى تعريف projection. الفرق محفوظ في [installed-vs-npm.patch](<installed-vs-npm.patch>). لا ننسب هذه الإضافة إلى ناشر npm ولا ندّعي معرفة مؤلفها أو أنها موجودة في الإصدار المنشور. مدخلات الأدوات والواجهة وحزمة التفعيل مقارنة byte-for-byte، والنتائج في manifest. metadata المحلية تستخدم workspace ranges بدل ranges المنشورة؛ لذلك أرشيفاتنا ليست tarballs npm الرسمية.

تقتصر الحزمة على application resources لأسماء أربع حزم allowlisted، ولا تحتوي userData أو profile أو session store أو مفاتيح أو cookies أو credentials. لا تشمل تبعيات DSH ولا Electron ولا نظام التشغيل ولا Skills. ملفات manifests للتبعيات لم تُنسخ؛ سُجلت أسماؤها وإصداراتها وبصماتها فقط. إعادة توزيع بقية المحرك أو التطبيق تحتاج مراجعة تراخيصه وإشعاراته واعتمادياته بصورة منفصلة.
