const express = require('express');
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    charset: 'utf8mb4'
});


const account = require('../controllers/account');
router.get('/',account.homepage)

router.get('/register', (req, res) => {
    return res.render('sign_up');
})
router.get('/login', (req, res) => {
    return res.render('login');
})
router.get('/account', account.account)
router.get('/account/changpassword',account.showchangpassword)

router.get('/explore',(req, res)=>{
    if(req.session.user){
        return res.render('explore')
    }else
        return res.redirect('../login')
})

router.get('/:username?',account.homepage)
module.exports = router;