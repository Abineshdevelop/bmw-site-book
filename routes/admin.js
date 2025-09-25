const express=require('express')
const router=express.Router()

const adminController=require('../controller/admincontroller')
const {isLogginned, publicMiddleware} = require("../middlewares/adminMiddleware")

router.get('/login', publicMiddleware,adminController.loadLogin)
router.post('/login',adminController.loginin)


router.get('/dashboard', isLogginned,adminController.loadDashboard)


router.get('/delete-user/:id', adminController.deleteUser);
router.post('/edit-user/:id', adminController.updateUser);

router.post('/create-user',adminController.createUser)

// cars
router.post('/cars', isLogginned, adminController.createCar)
router.post('/cars/:id', isLogginned, adminController.updateCar)
router.get('/cars/delete/:id', isLogginned, adminController.deleteCar)


router.get('/search', isLogginned, adminController.searchUser);

router.post('/logout', isLogginned, adminController.adminsignout);


module.exports=router