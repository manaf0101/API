const express =  require('express')

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

module.exports = router
