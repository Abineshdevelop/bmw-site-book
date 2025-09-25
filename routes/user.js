const express = require('express');
const router = express.Router();

const usercontroller = require('../controller/usercontroller');
const { isUserLoggedIn, publicUserMiddleware } = require('../middlewares/userMiddleware');

router.get('/login', (req, res) => {
    res.render('user/login.hbs');
  });

//login 
router.post('/login',usercontroller.login)//check password and email
router.get('/login',publicUserMiddleware, usercontroller.loadLogin);  
//session is not there
//show login page


//for displayiung user name
router.get('/home',isUserLoggedIn, usercontroller.fetchHome)

//register
router.post('/register', usercontroller.registerUser);
router.get('/register',publicUserMiddleware, usercontroller.loadRegister);


router.post('/logout', isUserLoggedIn, usercontroller.signout);


module.exports = router