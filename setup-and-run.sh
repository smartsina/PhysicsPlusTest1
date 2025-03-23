#!/bin/bash

echo "🚀 نصب و راه‌اندازی فیزیک پلاس..."

# بررسی پیش‌نیازها
echo "📋 بررسی پیش‌نیازها..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js نصب نیست. لطفاً آن را از https://nodejs.org نصب کنید"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo "❌ Git نصب نیست. لطفاً آن را نصب کنید"
    exit 1
fi

# کلون کردن مخزن
echo "📦 دریافت کد پروژه..."
git clone https://github.com/smartsina/PhysicsPlusTest1.git
cd PhysicsPlusTest1

# نصب وابستگی‌ها
echo "📚 نصب وابستگی‌ها..."
npm install

# ایجاد فایل محیطی
echo "⚙️ ایجاد تنظیمات محیطی..."
cat > .env << EOL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/physicsplus"
JWT_SECRET="your-secret-key-change-this-in-production"
EOL

# راه‌اندازی پایگاه داده
echo "🗄️ راه‌اندازی پایگاه داده..."
npx prisma migrate dev --name init

# اجرای پروژه
echo "🚀 اجرای پروژه..."
npm run dev