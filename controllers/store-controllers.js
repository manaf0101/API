const Store = require('../models/store');

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
};