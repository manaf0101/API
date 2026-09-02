// برای سفارشات کاربر در این مدل اطلاعات ذخیره خواهد شد .

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
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
    } , 

    // برای مشخص کردن وضعیت پردازش سفارش در مدل سفارش استفاده می‌شود. این فیلد می‌تواند یکی از مقادیر 'unknown'، 'in-progress' یا 'completed' باشد و به طور پیش‌فرض مقدار 'unknown' را دارد.
    processStatus: {
        type: String,
        enum: ['unknown', 'in-progress', 'completed'],
        default: 'unknown'
    }
    // برای مشخص کردن وضعیت پردازش سفارش در مدل سفارش استفاده می‌شود. این فیلد می‌تواند یکی از مقادیر 'unknown'، 'in-progress' یا 'completed' باشد و به طور پیش‌فرض مقدار 'unknown' را دارد.


}, { timestamps: true });//  این گزینه به Mongoose می‌گوید که برای این مدل، دو فیلد خودکار اضافه کند:
// createdAt: زمان ساخت رکورد
// updatedAt: زمان آخرین به‌روزرسانی رکورد

module.exports = mongoose.model("Order", orderSchema);