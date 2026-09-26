// برای مدل فروشنده


const express = require('express')
const router = express.Router()
const storeControllers = require('../controllers/store-controllers')

router.get('/generate-seller-id', storeControllers.generateSellerId)
router.get('/check-seller-username', storeControllers.checkSellerUsername)
router.get('/store/:userId', storeControllers.getStore)
router.put('/store/:userId', storeControllers.upsertStore)

module.exports = router