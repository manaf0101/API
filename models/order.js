// برای سفارشات کاربر در این مدل اطلاعات ذخیره خواهد شد .

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    // شناسه‌ی فروشنده‌ی صاحب این محصول؛ برای پیدا کردن «سفارش‌های دریافتی» هر فروشنده لازم است
    sellerId: {
        type: String
    },

    orderCode: {
        type: String,
        required: true
    },

    orderDate: {
        type: Date,
        required: true
    },

    totalPrice: {
        type: Number,
        required: true
    },

    productImage: {
        type: String
    },

    // در مدل سفارش برای ذخیره کردن لینک فاکتور است.
    invoiceUrl: {
        type: String
    },
    // در مدل سفارش برای ذخیره کردن لینک فاکتور است.


    status: {
        type: String,
        enum: ['current', 'delivered', 'returned', 'canceled'],
        default: 'current'
    },

    // برای مشخص کردن وضعیت پردازش سفارش در مدل سفارش استفاده می‌شود. 
    // این فیلد می‌تواند یکی از مقادیر 'unknown'، 'in-progress' 
    // یا 'completed' باشد و به طور پیش‌فرض مقدار 'unknown' را دارد.
    processStatus: {
        type: String,
        enum: ['unknown', 'in-progress', 'completed'],
        default: 'unknown'
    },

    // این چهار فیلد جدید فقط برای سبد خرید اضافه شدن

    // اسم و شناسه محصول، همون لحظه که به سبد اضافه می‌شه ذخیره می‌شه
    productName: {
        type: String
    },

    productId: {
        type: String
    },

    // اسم غرفه‌ای که این محصول رو می‌فروشه
    storeName: {
        type: String
    },

    // تعداد همون محصول داخل همین ردیف سبد خرید
    quantity: {
        type: Number
    },

    // اگه فروشنده خودش رو محصول تخفیف گذاشته بود، مجموع قیمت تخفیف‌خورده (بدون کد تخفیف خریدار)
    sellerDiscountedTotalPrice: {
        type: Number
    },

    // اگه خریدار خودش کد تخفیف داشت، مجموع قیمت تخفیف‌خورده (با کد تخفیف خریدار)
    finalDiscountedTotalPrice: {
        type: Number
    },

    // مشخص می‌کنه این سند فقط برای سبد خریده، نه یه سفارش واقعی ثبت‌شده
    isCart: {
        type: Boolean,
        default: false
    },

    // نشان می‌دهد این سفارش از مسیر «سبد خرید» ساخته شده یا نه؛ بر خلاف isCart، این فیلد بعد از پرداخت هم تغییر نمی‌کند
    wasCart: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });;//  این گزینه به Mongoose می‌گوید که برای این مدل، دو فیلد خودکار اضافه کند:
// createdAt: زمان ساخت رکورد
// updatedAt: زمان آخرین به‌روزرسانی رکورد

module.exports = mongoose.model("Order", orderSchema);