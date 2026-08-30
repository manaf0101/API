// مخصوص آپلود عکس روی سرور
const multer = require('multer');
// مخصوص آپلود عکس روی سرور


const path = require('path');

// تنظیم محل ذخیره‌سازی و نام‌گذاری فایل‌ها
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile-images');
    },
    filename: (req, file, cb) => {
        const { userId } = req.params;
        const ext = path.extname(file.originalname); // مثلاً .jpg یا .png
        cb(null, `${userId}${ext}`);
    }
});

// فیلتر کردن فایل‌ها: فقط عکس مجاز است
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('فقط فایل تصویری مجاز است'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 15 * 1024 * 1024 } // حداکثر15 مگابایت
});

module.exports = upload;