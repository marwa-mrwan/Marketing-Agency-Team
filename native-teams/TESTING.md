# اختبار الإضافة وحدود الاعتماد

الهدف المثبت بالاختبار هو **إضافة Native فوق DSH core متوافق، دون حزم Agent Teams الأصلية**؛ ليس runtime مستقلًا عن المضيف، ولا ضمانًا لكل إصدار ZadLoop مستقبلي.

## بيئة الاختبار

- Linux x86_64؛ ملفات core من ZadLoop `0.10.3`، وDSH `0.2.2-rc.1`.
- عملية Node منفصلة، وCordis Context جديدة، وAgents حقيقيون وJSONL persistence داخل مجلد مؤقت جديد؛ لا userData ولا profile قائم.
- adapterان اصطناعيان `synthetic-a` و`synthetic-b`: يولدان نصًا محليًا ثابتًا، بلا credentials أو اتصال LLM أو تكلفة API.
- test loader يسمح بحزم core من تثبيت متوافق محدد صراحة، ويرفض استيراد حزم `dsh-experimental-...agent-team...` الأصلية. لا يُستخدم loader الاختبار في الإنتاج.

## الأوامر

من جذر المستودع:

```bash
node --test native-teams/tests/model-route.test.mjs native-teams/tests/client.test.mjs
python3 native-teams/pack.py
```

لاختبار التكامل، حدد مسار runtime اختبارية متوافقة ومفكوكة:

```bash
AGENCY_TEST_RUNTIME=/path/to/compatible/runtime node --experimental-loader ./native-teams/tests/core-loader.mjs --test native-teams/tests/integration.test.mjs
```

يمكن تحديد `AGENCY_TEST_ADDON_DIR` ليشير إلى مجلد الإضافة **المثبتة من الأرشيف** بدل source، وتشغيل أمر التكامل نفسه. `--experimental-loader` قد يصدر تحذيرًا من Node؛ هو أداة اختبار هنا فقط.

## نطاق الاختبارات

- خمسة اختبارات unit/client: اختيار route صريحة أو session approval؛ رفض الاختيار الناقص والتعارض؛ عدم تعديل المدخلات؛ فحص core المفقود والخدمة المتعارضة؛ تسجيل module العميل وslot الروستر تحت هوية الإضافة.
- اختبار core integration: تسجيل الأدوات التسع فعليًا في scope لـAgent حقيقي؛ رفض الإنشاء دون اختيار؛ إنشاء متخصصين بموديلين/providerين مختلفين قبل أول طلب؛ بقاء Lead على موديله؛ رفض provider غير مسجل قبل حجز العضو؛ منع المتخصص من إنشاء Team متداخل؛ رسالة وwait وإيقاف؛ مهام مع dependency وclaim وcomplete ورفض stale revision؛ flush إلى JSONL؛ التخلص من Context وإعادة إنشائها؛ استرجاع roster والمهام وdescriptor route؛ مراسلة عضو cold بعد الاستعادة.
- اختبار package manager في fixture جديدة، مع scripts معطلة وauto-install-peers معطل: يجب ألا يُنصَّب محرك DSH ثانٍ. يُعاد اختبار التكامل باستخدام الملفات المستخرجة من الأرشيف المثبت، لا source.

## حدود مهمة

تسجيل slot عبر VM ليس اختبار عرض بصري في متصفح؛ لم يُختبر التثبيت/التفعيل في Desktop profile حقيقي، ولا تنزيل client-set على جهاز آخر، ولا واجهة ZadLoop أحدث، ولا Windows/macOS. لم يُجر اتصال فعلي بمزودين مدفوعين أو OAuth أو Skills، ولا اختبار جودة خبرة متخصص. إعدادات الصلاحيات والـSkills تُورّث من المضيف وتُراجع وقت المهمة.

نجاح التكامل في core المعزول لا يثبت أن plugin_manager أو client loader في إصدار مستقبلي لم يتغير. لهذا `engines.dsh` مقيدة بالإصدار المختبر؛ لا نوصي بتجاوز بوابة التوافق. أي إصدار إضافي يحتاج اختبار package/Host/Client جديدًا، وليس تغيير رقم الإصدار في manifest فقط.

## أمن التشغيل

تركيب الإضافة يشغّل Host code داخل عملية التطبيق خارج sandbox الملفات. التسجيل يتوقف عند وجود خدمة Team أخرى أو APIs أساسية ناقصة؛ لا يحقن كودًا في app.asar ولا يغير مزود Lead أو credentials. لا تقوم الحزمة بتثبيت نفسها أو بقراءة أسرار أو إنشاء Agents لمجرد تنزيل repo. `prepareCall` قبل الإنشاء يفحص adapter/model metadata وreasoning المتاحة، لكنه لا يضمن قبول الطلب لاحقًا أو ميزانية الحساب.

الـwrite_scopes تحذيرات تنسيق وليست lock. أدوات Shell/الكتابة وصلاحيات النشر والحسابات يجب أن تبقى محكومة بالمضيف والمستخدم. الرسائل والمهام مدخلات غير موثوقة وليست تفويضًا. لم تُجر مراجعة أمنية شاملة أو اختبار اختراق؛ الاحتفاظ بسلوك المكتبة المرجعية ليس شهادة أمان.
