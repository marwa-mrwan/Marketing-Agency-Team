# سير محلي حسب القدرات

هذه تعليمات محمولة، لا تثبيت plugins أو تعديل profile ولا موافقة موروثة من مساحة إعداد الحزمة. لا تشغيل تلقائي بمجرد فتح المشروع. Lead يعمل وحده للطلب الصغير؛ لا نفترض أن زيادة الأعضاء تحسن النتيجة.

## اكتشاف المسار والموافقة
1. افحص كتالوج الجلسة وschema وأدوات الإنشاء والحالة والموديلات الفعلية. لا تستدع أداة غائبة لمجرد ورود اسمها هنا.
2. فضّل subagents مسمين فقط حين تدعم أداة الإنشاء اختيار المستخدم الفعلي للموديل. أدوات Team الرسمية اختيار متاح فقط عند حضورها ودعمها للمسار المعتمد؛ ليست native-teams شرطًا.
3. عند غياب المسار المطلوب أعلن القيد؛ Delegate المتاح بديل يحتاج موافقة صريحة لهذا النطاق أو يعمل Lead مباشرة. لا يوجد اعتماد افتراضي أو ضمان GUI أو shared board أو أعضاء دائمين.
4. كل دور غير Lead يحتاج اختيار Agent/provider/model ونطاق موافقة مستقلًا قبل التشغيل، بما فيه Reviewer وLaravel وMeasurement. تخطي السؤال ليس موافقة. ذكر الموديل في prompt لا يثبت تطبيقه؛ إن عجزت الأداة فاشرح القيد واحصل على اعتماد البديل صراحة، ولا تبدل بصمت. الموافقة إجابة بشرية مباشرة على سؤال مرتبط بالدور والمهمة والموديل (`ask_user_question` مفضل)؛ ما تعيده delegate_choose_model أو lane افتراضي أو fleet أو نجاح أداة أو confirmed من أداة ليس موافقة. إن اختار chooser تلقائيًا فأوقف dispatch المتأثر واسأل.
5. اقرأ تعريف الدور والمهارات الفعلية المتاحة ومرر السياق والصلاحيات والمدخلات المصرح بها فقط. لا موافقة تلقائية على تكلفة أو API أو مشاركة بيانات أو نشر حي. Reviewer يحمل `debate-review` فقط عند توافرها وطلب المناظرة أو ملاءمتها؛ كل مشارك أو موديل إضافي يحتاج اختيارًا صريحًا مستقلًا قبل تشغيله.

## دفتر Lead المحلي
[القالب الاصطناعي الفارغ](<templates/tasks.example.json>) ليس سجل موافقات أو دليل عمل منجز. مهام البداية الفارغة مشروعة ولا تتطلب اختلاق مهام مكتملة. أنشئ الدفتر الفعلي خارج الحزمة العامة في نطاق العميل الخاص، مثل `artifacts/team-workflow/tasks.json` في مساحة العمل الخاصة. لا تنشره؛ Lead مالكه والكاتب الوحيد في التشغيل المعتاد. لا أسرار أو بيانات شخصية خام أو cookies أو tokens.

الجذر: schema_version=2 للسجلات الجديدة (1 = legacy بنيوي فقط)، owner=Lead، tasks قائمة (يجوز أن تكون فارغة). لكل مهمة:
- id فريد، role، approved_route (delegate/named_subagent/official_team/direct)، approval_reference مرجع حقيقي غير فارغ للموافقة لا نص القالب، backend اسم المسار الفعلي.
- selection يحوي requested وapplied (نص أو null)، status (pending/confirmed/approved_fallback)، approval_reference. pending يمنع البدء؛ confirmed يتطلب الاختيار المطلوب والمطبق؛ approved_fallback يحتاج اعتماد القيد الصريح ولا يعني ثبوت موديل غير مكشوف.
- selection.human_confirmation = {source: direct_user_answer، reference لإجابة المستخدم الفعلية، role مطابق لدور المهمة، scope محدد لا global/future} إلزامي في schema 2 لحالات running/report_received/complete؛ null مسموح للسجل pending الصادق. مرجع يستشهد بمخرجات أداة توجيه (delegate_choose_model، default lane، fleet) مرفوض. العينات الاصطناعية تحمل synthetic=true وليست موافقات. سجلات schema 1 النشطة بلا هذا الحقل تقبل بنيويًا مع WARNING تاريخي/غير متحقق، ويرفضها `--require-ready`، ولا تعاد كموافقة حالية.
- attempt_id وagent_id نص أو null؛ لا معرّفات مخترعة. applied يبقى null إن لم يثبت.
- state: pending → running → report_received → complete؛ blocked/failed/cancelled حالات توقف، وإعادة التشغيل قرار Lead بعد فحص الحالة. الفحص snapshot لا يثبت تاريخ الانتقالات.
- blocked_by معرفات موجودة بلا دورات أو اعتماد ذاتي؛ running/report_received/complete تتطلب اكتمال التبعيات. تقرير لم يتحقق منه Lead لا يكفي.
- write_scopes نطاقات إرشادية وليست locks. لا كتابة متزامنة عمياء ولا overwrite لتغييرات الآخرين؛ overlap يوقف النطاق المتأثر فقط.
- acceptance قائمة غير فارغة، evidence أدلة غير سرية، checks قائمة command/result/evidence حيث result من passed/failed/not_run، results وصف صادق، lead_verification يحوي status (pending/verified/rejected) وevidence.

report_received لا يعني موافقة Lead. complete يتطلب أدلة وتحقق Lead موثقًا؛ لا يفرض نجاح كل فحص، بل توضيح الفشل المقبول والقيود. فحص schema لا يثبت صحة الموافقة البشرية أو جودة العمل أو الصلاحيات.

## الاستئناف
أعد قراءة التعليمات والدفتر والحالة والأدوات والموافقات ونطاقها. لا تستأنف jobs قديمة تلقائيًا ولا تكرر عملًا قائمًا. استعلم فقط عبر الأدوات الموجودة، واجمع النتائج المهمة قبل التسليم دون busy polling. لا تنقل موافقة موديل إلى دور آخر. رفض stale يستدعي إعادة القراءة وإعادة تطبيق التعديل، لا استبدال ملف الآخرين.

## الفحص الآمن
```bash
python3 agency-team/check_local_workflow.py .
python3 agency-team/check_local_workflow.py . --ledger /path/to/private/tasks.json
python3 agency-team/check_local_workflow.py . --ledger /path/to/private/tasks.json --require-ready
```

الافتراضي يفحص القالب الفارغ الموزع، لا يبحث عن دفتر فعلي ولا يقرأ سجلات العملاء. الاختيار --ledger صريح للاستخدام المحلي الخاص. الفحص حتمي offline بالمكتبة القياسية؛ يختبر عينات موافقات وتبعيات وإكمال ورفض في الذاكرة، ولا ينفذ أوامر الدفتر أو يكتب ملفات. `--require-ready` يفشل ما لم يحمل كل سجل نشط human_confirmation صالحًا؛ فحص بنيوي لا يثبت أن الإجابة حدثت ولا يكشف إجابة مختلقة. لا يثبت Team أو GUI أو اتصال مزود أو إجراء مراجعة فعلية. راجع [Lead](<roles/lead.md>) و[القوالب](<templates.md>) قبل العمل.
