const express = require('express');
const router = express.Router();
const cartControllers = require('../controllers/cart-controllers');

// نکته: روت count باید قبل از روت عمومی :userId تعریف بشه
// وگرنه اکسپرس کلمه‌ی "count" رو به‌جای userId قبول می‌کنه
router.get('/cart/count/:userId', cartControllers.getCartCount);

router.post('/cart/:userId', cartControllers.addToCart);
router.get('/cart/:userId', cartControllers.getCart);
router.delete('/cart/:userId/:productId', cartControllers.removeFromCart);
router.put('/cart/pay/:userId/:productId', cartControllers.payForCartProduct);
// برای سفارشات دریافتی 
router.get('/received-orders/count/:sellerId', cartControllers.getReceivedOrdersCount);
router.get('/received-orders/:sellerId', cartControllers.getReceivedOrders);

module.exports = router;