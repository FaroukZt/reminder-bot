# 🤖 بوت تذكيرات Last War

> بوت Discord متقدم لإدارة التذكيرات والمهام لسيرفر لعبة Last War

## ✨ المميزات

✅ **إضافة المهام** - أضف مهام بسهولة مع مدات زمنية محددة
✅ **تذكيرات تلقائية** - نبهات DM عند انتهاء الوقت
✅ **قائمة المهام** - عرض جميع مهامك النشطة
✅ **تعديل المهام** - غيّر أوقات التذكيرات
✅ **حذف المهام** - احذف المهام المكتملة
✅ **أنماط زمنية** - مرة واحدة / يومي / أسبوعي
✅ **واجهة تفاعلية** - أزرار وقوائم سهلة الاستخدام
✅ **حفظ البيانات** - MongoDB لحفظ دائم
✅ **متعدد الأعضاء** - كل عضو له مهامه الخاصة

## 🚀 التثبيت والتشغيل

### المتطلبات
- Node.js 16.9.0 أو أحدث
- حساب Discord Developer
- MongoDB Atlas (مجاني)

### الخطوات

1. **النسخ**
```bash
git clone https://github.com/FaroukZt/reminder-bot.git
cd reminder-bot
```

2. **تثبيت المكتبات**
```bash
npm install
```

3. **إعداد البيئة**
```bash
cp .env.example .env
```

4. **ملء البيانات في `.env`**
```
DISCORD_TOKEN=your_token_here
CLIENT_ID=your_client_id
GUILD_ID=your_guild_id
MONGODB_URI=your_mongodb_uri
```

5. **التشغيل**
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## 📖 أوامر البوت

### الأوامر الرئيسية

#### `/add-task`
إضافة مهمة جديدة
```
/add-task name:جمع الموارد duration:30 unit:دقيقة pattern:مرة_واحدة
```

#### `/list-tasks`
عرض جميع مهامك
```
/list-tasks
```

#### `/edit-task`
تعديل مهمة
```
/edit-task task_id:12345 duration:45
```

#### `/delete-task`
حذف مهمة
```
/delete-task task_id:12345
```

#### `/help`
عرض المساعدة
```
/help
```

## 🎨 ميزات متقدمة

### الأنماط الزمنية المدعومة:
- 🔔 **مرة واحدة** - تنبيه واحد فقط
- 🔁 **يومي** - كل يوم في نفس الوقت
- 📅 **أسبوعي** - كل أسبوع في نفس اليوم والوقت

### وحدات الزمن:
- دقيقة (د)
- ساعة (س)
- يوم (ي)

## 🗄️ قاعدة البيانات

### نموذج المهمة
```typescript
interface Task {
  _id: ObjectId;
  userId: string;           // Discord User ID
  name: string;            // اسم المهمة
  duration: number;        // المدة
  durationUnit: string;    // الوحدة (د/س/ي)
  pattern: string;         // النمط
  createdAt: Date;         // تاريخ الإنشاء
  nextTrigger: Date;       // وقت التنبيه التالي
  isActive: boolean;       // هل المهمة نشطة
  lastTriggered?: Date;    // آخر تنبيه
}
```

## 📁 هيكل المشروع

```
src/
├── index.ts              # نقطة البداية
├── config/
│   └── config.ts         # إعدادات البوت
├── commands/
│   ├── slashCommands/
│   │   ├── addTask.ts
│   │   ├── listTasks.ts
│   │   ├── editTask.ts
│   │   ├── deleteTask.ts
│   │   └── help.ts
│   └── commandHandler.ts
├── events/
│   ├── ready.ts
│   ├── interactionCreate.ts
│   └── eventHandler.ts
├── services/
│   ├── database.ts       # اتصال MongoDB
│   ├── taskService.ts    # منطق المهام
│   └── notificationService.ts # التنبيهات
├── models/
│   └── Task.ts           # نموذج قاعدة البيانات
├── utils/
│   ├── logger.ts         # تسجيل الأحداث
│   ├── timeUtils.ts      # حسابات الوقت
│   └── embeds.ts         # تنسيقات الرسائل
└── types/
    └── index.ts          # أنواع TypeScript
```

## 🔐 الأمان

- ✅ توكن البوت محمي بـ .env
- ✅ معرّف السيرفر مخزن آمناً
- ✅ كل مستخدم يرى فقط مهامه الخاصة
- ✅ معالجة الأخطاء الآمنة

## 🐛 استكشاف الأخطاء

### البوت لا يستجيب
1. تحقق من صحة `DISCORD_TOKEN`
2. تأكد من وجود الأذونات في السيرفر
3. أعد تشغيل البوت

### لا تعمل الأوامر
1. تحقق من `CLIENT_ID` و `GUILD_ID`
2. جرب `/` في الدردشة
3. تأكد من وجود الأذونات

### MongoDB غير متصل
1. تحقق من `MONGODB_URI`
2. تأكد من أن IP آمن في MongoDB Atlas
3. جرب الاتصال من محطة

## 📝 الترخيص

MIT License

## 🤝 المساهمة

المساهمات مرحب بها! يرجى فتح Issue أو Pull Request

## 📞 الدعم

للمساعدة، تواصل عبر Discord أو افتح Issue في المستودع

---

**صُنع بـ ❤️ لسيرفر Last War**
