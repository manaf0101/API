const express =  require('express')

const router = express.Router()

const productControllers =  require('../controllers/products-controllers')


router.post('/add-users' , productControllers.postNewUser)
router.get('/check-email' , productControllers.checkUserEmail)
router.get('/check-username', productControllers.checkUsername);


module.exports = router
