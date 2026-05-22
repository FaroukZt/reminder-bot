import dotenv from 'dotenv';

dotenv.config();

export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN!,
    clientId: process.env.CLIENT_ID!,
    guildId: process.env.GUILD_ID!,
  },
  mongodb: {
    uri: process.env.MONGODB_URI!,
  },
  bot: {
    prefix: process.env.BOT_PREFIX || '!',
    notificationCheckInterval: parseInt(process.env.NOTIFICATION_CHECK_INTERVAL || '60000'),
  },
};

// التحقق من المتغيرات المطلوبة
const requiredEnvVars = ['DISCORD_TOKEN', 'CLIENT_ID', 'GUILD_ID', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(v => !process.env[v]);

if (missingEnvVars.length > 0) {
  console.error(`❌ متغيرات البيئة المفقودة: ${missingEnvVars.join(', ')}`);
  process.exit(1);
}

console.log('✅ تم تحميل إعدادات البوت بنجاح');
