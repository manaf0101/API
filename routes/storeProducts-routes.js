const express = require('express');
const router = express.Router();
const productControllers = require('../controllers/storeProducts-controllers');
const uploadProductImage = require('../middleware/uploadProductImage');

router.get('/products/:sellerId', productControllers.getProductsBySeller);
router.get('/getAllproducts', productControllers.getAllProducts);
router.post('/products/:sellerId', uploadProductImage.single('productImage'), productControllers.addProduct);
router.put('/products/:sellerId/:productId', uploadProductImage.single('productImage'), productControllers.updateProduct);
router.delete('/products/:sellerId/:productId', productControllers.deleteProduct);
router.get('/seller-market/:sellerID', productControllers.getSellerMarket)
router.get('/search', productControllers.searchEverything)

module.exports = router; 