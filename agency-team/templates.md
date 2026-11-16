# قوالب تشغيل

## سياق عميل — نسخة مستقلة لكل عميل
- client_id / domain / business / market / languages:
- الهدف وprimary outcome وقيمته/جودة lead:
- properties/accounts المؤكدة (معرّفات غير سرية فقط):
- timezone / currency / date window / comparison:
- stack / staging / production / deploy owner:
- available sources / access status / known gaps:
- permitted actions / ممنوعات / سقوف معتمدة / approval reference:
- data classification / storage / access roles / retention deadline / incident owner:
- last_updated / context owner:

لا تملأ حسابات أو أهدافًا أو أسرارًا من أمثلة تاريخية. تحقق من السياق قبل كل تشغيل.

## Task packet
- task_id / role / objective:
- user-selected Agent / provider / model / approval reference / scope:
- selection.human_confirmation: source=direct_user_answer / reference لإجابة المستخدم المباشرة / role / scope (لا مخرجات delegate_choose_model أو lane افتراضي؛ null فقط مع pending):
- selection_supported_by_creation_tool / actual Agent / unresolved limitation:
- approved_route / approval_reference / backend / attempt_id أو agent_id (null إن لم يظهر):
- state / blocked_by / write_scopes (إرشادية لا locks):
- acceptance / evidence / checks (command, result, evidence) / results / lead_verification:

ابدأ من [القالب الفارغ](<templates/tasks.example.json>) دون موافقات أو مهام مكتملة مفترضة، واحفظ السجل الفعلي في مساحة العميل الخاصة خارج الحزمة العامة. عقد الدفتر وحالاته في [local-workflow.md](<local-workflow.md>). تقرير العامل ينتقل إلى report_received؛ لا complete إلا بعد تحقق Lead، ولا تخمين للمعرّفات أو اختيار الموديل.
- inputs بأسماء الملفات أو المصادر المصرح بها:
- scope / exclusions / write_scopes:
- dependencies / acceptance criteria:
- skill(s) المطلوب تحميلها / الأدوات المتاحة فعلًا:
- authority: read-only أو خطة كتابة معتمدة:
- output path / expected format / privacy:

## Evidence / finding
- id / observation / URL أو object أو file:
- source / period / timezone / device / locale / retrieved_at:
- confidence / fact أو hypothesis / missing evidence:
- impact / recommendation / owner / priority / dependencies:
- verification / failure signal / rollback:
- source_status: verified / provisional / unavailable:
- last_verified / review_due / سبب نافذة المراجعة:

لا تجعل rubric داخليًا «score من Google». لا تفرض درجات عند أدلة ناقصة؛ وصف partial أفضل من دقة مزيفة.

## سجل موافقة وتغيير
- exact target / before / after / reason / impact ceiling:
- approval reference / timestamp / owner:
- backup reference دون أسرار / restore evidence:
- executed action / actual result / tests run / tests not run:
- rollback action / trigger / next check:

## تسليم موحد
خلاصة تجارية → الدليل وحدوده → أهم الإجراءات ومالك كل منها → ما تغير فعلًا → الاختبارات الفعلية والفحوص غير المنفذة → المخاطر والموافقات والخطوة التالية.

## استدعاء جاهز
«اقرئي AGENTS.md وحزمة agency-team، واعملي كـLead. العميل: [..]، الهدف: [..]. استخدمي المتخصصين المطلوبين فقط والـSkills الملائمة. البداية تحليل فقط، وأي تنفيذ حي بخطة وموافقة. اجمعي النتائج وراجعيها وسلّمي نتيجة موحدة».
