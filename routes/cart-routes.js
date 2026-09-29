const express = require('express');
const router = express.Router();
const cartControllers = require('../controllers/cart-controllers');

// نکته: روت count باید قبل از روت عمومی :userId تعریف بشه
// وگرنه اکسپرس کلمه‌ی "count" رو به‌جای userId قبول می‌کنه
router.get('/cart/count/:userId', cartControllers.getCartCount);

router.post('/cart/:userId', cartControllers.addToCart);
router.get('/cart/:userId', cartControllers.getCart);
router.delete('/cart/:userId/:orderId', cartControllers.removeFromCart);

module.exports = router;