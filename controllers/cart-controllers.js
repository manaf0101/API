const Order = require('../models/order');
const Store = require('../models/store');

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
        } = req.body;

        // اسم غرفه رو از روی فروشگاه همون فروشنده پیدا می‌کنیم
        const store = await Store.findOne({ userId: sellerId });

        const newCartItem = new Order({
            userId,
            orderCode: `CART-${Date.now()}`,
            orderDate: new Date(),
            totalPrice,
            sellerDiscountedTotalPrice: sellerDiscountedTotalPrice || undefined,
            productImage,
            productName,
            productId,
            storeName: store ? store.storeName : "",
            quantity,
            isCart: true,
            status: 'current',
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

        const cartItems = await Order.find({ userId, isCart: true }).sort({ createdAt: -1 });

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
        const { orderId } = req.params;

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({ message: "محصول از سبد خرید حذف شد" });

    } catch (error) {
        console.log("Error removing from cart:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


module.exports = { addToCart, getCart, getCartCount, removeFromCart };