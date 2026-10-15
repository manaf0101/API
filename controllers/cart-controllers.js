const Order = require('../models/order');
const Store = require('../models/store');



// تبدیل محصولات سبد خرید به سفارش واقعی (پرداخت)
const payForCartProduct = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // همه‌ی اسناد سبد خریدِ همین محصول (ممکنه چند بار جدا اضافه شده باشه) یکجا isCart‌شون false می‌شه
        const updateResult = await Order.updateMany(
            { userId, productId, isCart: true },
            { $set: { isCart: false } }
        );

        if (!updateResult || updateResult.matchedCount === 0) {
            return res.status(404).json({ message: "محصول در سبد خرید پیدا نشد" });
        }

        res.status(200).json({ message: `پرداخت با موفقیت انجام شد` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};
// تبدیل محصولات سبد خرید به سفارش واقعی (پرداخت)





// افزودن یک محصول به سبد خرید کاربر
const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const {
            productId,
            productName,
            sellerId,
            quantity,
            totalPrice,
            sellerDiscountedTotalPrice,
            productImage,
            finalDiscountedTotalPrice,
        } = req.body;

        // اسم غرفه رو از روی فروشگاه همون فروشنده پیدا می‌کنیم
        const store = await Store.findOne({ userId: sellerId });

        const newCartItem = new Order({
            userId,
            orderCode: `CART-${Date.now()}`,
            orderDate: new Date(),
            totalPrice,
            sellerDiscountedTotalPrice: sellerDiscountedTotalPrice || undefined,
            finalDiscountedTotalPrice: finalDiscountedTotalPrice || undefined,
            productImage,
            productName,
            productId,
            storeName: store ? store.storeName : "",
            quantity,
            // برای قسمت سفارشات دریافتی اضافه شد 
            sellerId,
            // برای قسمت سفارشات دریافتی اضافه شد 
            isCart: true,
            status: 'current',
            wasCart: true,   // ← این خط اضافه شد؛ بر خلاف isCart، این دیگر هیچ‌وقت تغییر نمی‌کند
        });

        await newCartItem.save();

        res.status(201).json({ message: "محصول به سبد خرید اضافه شد", order: newCartItem });

    } catch (error) {
        console.log("Error adding to cart:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// گرفتن همه‌ی محصولات داخل سبد خرید کاربر
const getCart = async (req, res) => {
    try {
        const { userId } = req.params;

        // هم محصولات هنوز پرداخت‌نشده (isCart: true) و هم محصولاتی که به تازگی پرداخت شده‌اند
        // (isCart: false ولی هنوز status آن‌ها «جاری» است) با هم برگردانده می‌شوند
        // به محض اینکه وضعیت یک سفارش از «جاری» خارج شود (مثلاً تحویل داده شود)، خودکار از این لیست حذف می‌شود
        const cartItems = await Order.find({
            userId,
            wasCart: true,
            $or: [
                { isCart: true },
                { isCart: false, status: 'current' }
            ]
        }).sort({ createdAt: -1 });

        res.status(200).json(cartItems);

    } catch (error) {
        console.log("Error getting cart:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// جمع تعداد محصولات داخل سبد خرید، برای نمایش روی آیکون بالای صفحه
const getCartCount = async (req, res) => {
    try {
        const { userId } = req.params;

        const cartItems = await Order.find({ userId, isCart: true });
        const totalCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

        res.status(200).json({ count: totalCount });

    } catch (error) {
        console.log("Error getting cart count:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// حذف یک محصول از سبد خرید
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        const deleteResult = await Order.deleteMany({
            userId,
            productId,
            isCart: true
        });

        if (!deleteResult || deleteResult.deletedCount === 0) {
            return res.status(404).json({ message: "محصول در سبد خرید پیدا نشد" });
        }

        res.status(200).json({ message: `تعداد ${deleteResult.deletedCount} آیتم از سبد حذف شد` });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// گرفتن سفارش‌های دریافتی یک فروشنده
// یعنی محصولاتی که از سبد خرید خریدارها پرداخت شده‌اند و متعلق به غرفه‌ی همین فروشنده هستند
const getReceivedOrders = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const receivedOrders = await Order.find({
            sellerId,
            isCart: false,
            wasCart: true
        }).sort({ updatedAt: -1 });

        res.status(200).json(receivedOrders);

    } catch (error) {
        console.log("Error getting received orders:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


// شمارش تعداد سفارش‌های دریافتی یک فروشنده، برای نمایش روی آیکون «پنل فروش»
const getReceivedOrdersCount = async (req, res) => {
    try {
        const { sellerId } = req.params;

        const count = await Order.countDocuments({
            sellerId,
            isCart: false,
            wasCart: true
        });

        res.status(200).json({ count });

    } catch (error) {
        console.log("Error getting received orders count:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = {
    addToCart,
    getCart,
    getCartCount,
    removeFromCart,
    payForCartProduct , 
    getReceivedOrders  , 
    getReceivedOrdersCount  ,
};