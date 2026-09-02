const express =  require('express')
const upload = require('../middleware/upload')

const router = express.Router()

const productControllers =  require('../controllers/products-controllers')


router.post('/add-users' , productControllers.postNewUser)
router.get('/check-email' , productControllers.checkUserEmail)
router.get('/check-username', productControllers.checkUsername);
router.get("/username/:userId", productControllers.getUsername);
router.get('/profile/:userId' ,  productControllers.getProfile);

// برای کامپوننت MyProfile.tsx
router.put('/profile/:userId', productControllers.updateProfile)
router.post('/check-password', productControllers.checkPassword)
router.put('/change-password/:userId', productControllers.changePassword)
router.get('/orders/current/:userId', productControllers.getCurrentOrders)
router.get('/orders/delivered/:userId', productControllers.getDeliveredOrders)
router.get('/orders/returned/:userId', productControllers.getReturnedOrders)
router.get('/orders/canceled/:userId', productControllers.getCanceledOrders)
router.get('/orders/summary/:userId', productControllers.getOrdersSummary)

// آپلود عکس پروفایل
router.post('/upload-profile-image/:userId', upload.single('profileImage'), productControllers.uploadProfileImage)

module.exports = router
