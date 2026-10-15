const express =  require('express')
const upload = require('../middleware/upload')



const router = express.Router()

const userControllers = require('../controllers/user-controllers')


router.post('/add-users', userControllers.postNewUser)
router.get('/check-email', userControllers.checkUserEmail)
router.get('/check-username', userControllers.checkUsername)
router.get('/username/:userId', userControllers.getUsername)
router.get('/profile/:userId', userControllers.getProfile)
router.get('/users', userControllers.getUsers)
router.get('/users-with-store', userControllers.getUsersWithStore)

// برای کامپوننت MyProfile.tsx
router.put('/profile/:userId', userControllers.updateProfile)
router.post('/check-password', userControllers.checkPassword)
router.put('/change-password/:userId', userControllers.changePassword)
router.get('/orders/current/:userId', userControllers.getCurrentOrders)
router.get('/orders/delivered/:userId', userControllers.getDeliveredOrders)
router.get('/orders/returned/:userId', userControllers.getReturnedOrders)
router.get('/orders/canceled/:userId', userControllers.getCanceledOrders)
router.get('/orders/summary/:userId', userControllers.getOrdersSummary) 

// آپلود عکس پروفایل
router.post('/upload-profile-image/:userId', upload.single('profileImage'), userControllers.uploadProfileImage)




module.exports = router
