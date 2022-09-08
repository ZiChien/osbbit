const fs = require('fs');
const path = require('path');
const mysql = require("mysql");
const session = require('express-session');

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

exports.uploadpost = (req, res) => {
    if(!req.session.user){
        return res.redirect('../login');
    }
    const base64Data = req.body.imagebase64.split('base64,')[1];
    const imagename = Date.now() + '-' + req.body.imagename;

    //const dir = `/public/image/users/+${req.session.user}/`;
    const dir = path.join(__dirname, `../public/img/users/${req.session.user}/`);

    fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
        if (err) {
            if (err.code === "ENOENT") {
                fs.mkdir(dir, { recursive: true }, function (err) { })
                fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
                    if (err) console.log(err);
                    return res.redirect('../');
                })
            }
        }else
            return res.redirect('../');
    })

    //save image path to database
    var sql = `INSERT INTO users_image SET ?`;
    db.query(sql, { user_id: req.session.user, image_name: imagename }, (err, results) => {
        if (err) throw err;

    })

}
exports.uploadavater = (req, res) => {
    const base64Data = req.body.imagebase64_avater.split('base64,')[1];
    const imagename = Date.now() + '-avater-' + req.body.imagename_avater;

    const dir = path.join(__dirname, `../public/img/users/${req.session.user}/avater/`);

    fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
        if (err) {
            if (err.code === "ENOENT") {
                fs.mkdir(dir, { recursive: true }, function (err) { })
                fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
                    if (err) console.log(err);
                    return res.redirect('../');
                })
            }
        }else
            return res.redirect('../');
    })

    //delete original avater
    //save avaterpath to database
    db.query(`SELECT avater from users WHERE id = ?`,[req.session.user],(err, results)=>{
        if(results[0].avater=="../img/static/avater_default.png"){
            return;
        }
        console.log(results[0].avater)
        const originalpath = path.join('./public',results[0].avater)
        console.log(originalpath)
        fs.unlink(originalpath,function(err){
            if(err) throw err
        })
    })

    let sql = `UPDATE users SET avater = ? WHERE id =?`;
    let avaterPath = "./img/users/"+req.session.user+"/avater/"+imagename 
    db.query(sql, [avaterPath,req.session.user], (err, results) => {
        if (err) throw err;
    })

}