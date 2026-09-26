const Store = require('../models/store');


// GET STORE (دریافت اطلاعات فروشگاه بر اساس userId)
const getStore = async (req, res) => {
    try {
        const { userId } = req.params;
        const store = await Store.findOne({ userId });

        // اگر فروشگاهی وجود نداشت (فروشنده‌ی جدید است)، یک آبجکت خالی برمی‌گردانیم
        // تا loader سمت فرانت با خطا مواجه نشود
        res.status(200).json(store || {});

    } catch (error) {
        console.log("Error getting store:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// UPSERT STORE (ایجاد یا به‌روزرسانی اطلاعات فروشگاه)
const upsertStore = async (req, res) => {
    try {
        const { userId } = req.params;
        const { storeName, sellerID, username, welcomeMessage, contactInfo } = req.body;

        if (!storeName || storeName.trim() === '') {
            return res.status(400).json({ message: "نام فروشگاه الزامی است" });
        }
        if (!username || username.trim() === '') {
            return res.status(400).json({ message: "نام کاربری الزامی است" });
        }

        const updatedStore = await Store.findOneAndUpdate(
            { userId },
            { userId, storeName, sellerID, username, welcomeMessage, contactInfo },
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: "اطلاعات فروشگاه با موفقیت ثبت شد", store: updatedStore });

    } catch (error) {
        console.log("Error upserting store:", error);
        res.status(500).json({ success: false, message: "خطایی رخ داد، لطفاً دوباره تلاش کنید" });
    }
};





// تولید یک کد ۶ رقمی یکتا برای sellerID
const generateSellerId = async (req, res) => {
    try {
        let code;
        let alreadyExists = true;

        // تا زمانی که یه کد یکتا (که تو دیتابیس نباشه) پیدا نشه، ادامه می‌ده
        while (alreadyExists) {
            // عدد تصادفی ۶ رقمی (بین 100000 تا 999999)
            code = Math.floor(100000 + Math.random() * 900000).toString();

            const found = await Store.findOne({ sellerID: code });
            alreadyExists = !!found;
        }

        res.status(200).json({ sellerID: code });

    } catch (error) {
        console.log("Error generating seller ID:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// بررسی یکتا بودن نام کاربری فروشگاه
const checkSellerUsername = async (req, res) => {
    try {
        const { username } = req.query;

        if (!username) {
            return res.status(400).json({ message: "نام کاربری الزامی است" });
        }

        const found = await Store.findOne({ username });

        res.status(200).json({ exists: !!found });

    } catch (error) {
        console.log("Error checking seller username:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = {
    generateSellerId,
    checkSellerUsername,
    getStore,
    upsertStore,
};