const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const session = require("express-session");



const app = express();

const publicDirectory = path.join(__dirname, './public')

// 設定預設檔案路徑
app.use(express.static(publicDirectory));

// 解析POST傳入的資料形式/qs when true/query when false
app.use(express.urlencoded({
    extended: false,
    limit: '50mb'
}))

// 以json格式解析資料
app.use(express.json());

// 設定樣板/hbs/ejs/eta
app.set('view engine','hbs');

const bodyParser = require('body-parser')

// DB connect
dotenv.config({
    path: './config.env'
});

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

db.connect((err)=>{
    if(err)
        console.log(err);
    console.log("My sql connected!");
})

app.use(session({
    secret: 'mySecret',
    username:'username',
    name: 'user', // optional
    saveUninitialized: false,
    resave: true,
    cookie: { maxAge: 600 * 1000 }
}))

const router = require('./routes/pages');
const auth = require('./routes/auth');

app.use('/',router);
app.use('/auth',auth);

app.listen(5000,()=>{
    console.log('Your server is runnig on Port 5000!');
})