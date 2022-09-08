const express = require('express');
const auth_Controller = require('../controllers/auth_c');
const login_Controller = require('../controllers/login');
const logout_Controller = require('../controllers/logout');
const account_Controoler = require('../controllers/account');
const uploadimg = require('../controllers/multer');
const upload = require('../controllers/upload');
const userInfo = require('../controllers/userInfo');

const router = express.Router();

router.post('/register',auth_Controller.register);
router.get('/checkemail',auth_Controller.checkemail);
router.get('/checkname',auth_Controller.checkname);
router.post('/login',login_Controller.login);
router.get('/logout',logout_Controller.logout);
router.post('/rename',account_Controoler.rename);
router.post('/uploadpost',upload.uploadpost);
router.post('/upload_avater',upload.uploadavater);

router.get('/getpost/:username',userInfo.getuserpost);
router.post('/changpassword',userInfo.authpassword);

router.post('/upload',uploadimg.single('avater'),account_Controoler.saveImg);
module.exports = router

// search
const explore = require('../controllers/explore');
router.get('/explore',explore.search);