# 🎮 تطبيق التذكيرات - Last War

> تطبيق تذكيرات ذكي وشامل لسيرفر لعبة Last War

## ✨ الميزات

✅ **إدخال المهام بسهولة** - اسم المهمة + المدة الزمنية
✅ **تذكيرات تلقائية** - يذكرك بعد انتهاء الوقت المحدد
✅ **حفظ البيانات** - حفظ تلقائي لجميع المهام
✅ **واجهة تفاعلية** - أزرار وتحكم سهل
✅ **اقتراحات ذكية** - يقترح المهام السابقة
✅ **تعديل الأوقات** - غير وقت التذكير في أي وقت
✅ **أنماط زمنية** - يومي، أسبوعي، مخصص
✅ **واجهة عربية كاملة** - نصوص ورسائل باللغة العربية

## 🚀 التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/FaroukZt/reminder-bot.git
cd reminder-bot

# تثبيت المكتبات
npm install

# تشغيل التطبيق
npm start
```

## 📋 البنية

```
reminder-bot/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ReminderApp.tsx
│   │   ├── TaskForm.tsx
│   │   ├── TaskList.tsx
│   │   ├── NotificationModal.tsx
│   │   └── TaskCard.tsx
│   ├── services/
│   │   ├── firebaseConfig.ts
│   │   ├── taskService.ts
│   │   └── notificationService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── timeUtils.ts
│   │   └── validators.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ الإعدادات

### Firebase Setup

1. انسخ `.env.example` إلى `.env.local`
2. أضف بيانات Firebase الخاصة بك
3. اختبر الاتصال

## 🎯 الاستخدام

1. **أضف مهمة جديدة**
   - اكتب اسم المهمة
   - اختر المدة الزمنية
   - اختر النمط (يومي/أسبوعي/مخصص)
   - اضغط "إضافة"

2. **استقبل التذكيرات**
   - يتم إرسال إشعار تلقائي عند انتهاء الوقت
   - صوت + رسالة نصية

3. **أدِر المهام**
   - عدِّل الأوقات
   - حذف المهام
   - وقف/استئناف التذكيرات

## 📱 المتطلبات

- Node.js v14+
- npm أو yarn
- حساب Firebase (مجاني)

## 📄 الترخيص

MIT License

## 👨‍💻 المطور

**FaroukZt** - Last War Community

---

**شارك الحب! ⭐** إذا أعجبك المشروع
