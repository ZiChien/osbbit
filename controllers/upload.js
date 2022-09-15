const fs = require('fs');
const path = require('path');
const mysql = require("mysql");
const session = require('express-session');
const cloudinary = require('cloudinary').v2;

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    charset: 'utf8mb4'
});

cloudinary.config({
    cloud_name: 'chian',
    api_key: '841851475151153',
    api_secret: 'h4BJZdUQBobpVlf6an7EAEQQC2Y',
    secure: true
});

exports.uploadpost = (req, res) => {
    if (!req.session.user) {
        return res.redirect('../login');
    }
    // const base64Data = req.body.imagebase64.split('base64,')[1];
    const imagename = Date.now() + '-' + req.body.imagename;

    //stored in Cloudinary
    try {
        cloudinary.uploader
            .upload(req.body.imagebase64,
                {
                    folder: req.session.user,
                    public_id: imagename
                })
            .then((result) => {
                console.log(result)
                // save image path to database
                var sql = `INSERT INTO users_image SET ?`;
                db.query(sql, { user_id: req.session.user, image_name: result.secure_url }, (err, results) => {
                    if (err) throw err;
                })
                return res.redirect('../');
            })
    } catch (error) {
        console.error(error);
    }


    // stored in local disk
    //const dir = path.join(__dirname, `../public/img/users/${req.session.user}/`);
    // fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
    //     if (err) {
    //         if (err.code === "ENOENT") {
    //             fs.mkdir(dir, { recursive: true }, function (err) { })
    //             fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
    //                 if (err) console.log(err);
    //                 return res.redirect('../');
    //             })
    //         }
    //     }else
    //         return res.redirect('../');
    // })



}
exports.uploadavater = (req, res) => {
    // const base64Data = req.body.imagebase64_avater.split('base64,')[1];
    const imagename = Date.now() + '-avater-' + req.body.imagename_avater;


    //stored in Cloudinary
    try {
        cloudinary.uploader
            .upload(req.body.imagebase64_avater,
                {
                    folder: req.session.user,
                    public_id: imagename
                })
            .then((result) => {
                console.log(result)

                db.query(`SELECT avater from users WHERE id = ?`, [req.session.user], (err, results) => {
                    let oldavaterPath = results[0].avater;
                    // save image path to database
                    let sql = `UPDATE users SET avater = ? WHERE id =?`;
                    db.query(sql, [result.secure_url, req.session.user], (err, results) => {
                        if (err) throw err;
                    })
                    if (oldavaterPath == "../img/static/avater_default.png") {
                        return;
                    }
                    //delete old avater
                    try {
                        
                        let file = oldavaterPath.split('/')
                        file = file[file.length-1].split('.')
                        let publicid = `${req.session.user}/${file[0]}`
                        cloudinary.uploader.destroy(publicid)
                            .then((result) => {
                                console.log("delete why" + result)
                            })
                    } catch (error) {
                        console.error(error);
                    }
                })
                return res.redirect('../');
            })
    } catch (error) {
        console.error(error);
    }
    // stored in local disk
    // fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
    //     if (err) {
    //         if (err.code === "ENOENT") {
    //             fs.mkdir(dir, { recursive: true }, function (err) { })
    //             fs.writeFile(dir + imagename, base64Data, 'base64', (err) => {
    //                 if (err) console.log(err);
    //                 return res.redirect('../');
    //             })
    //         }
    //     } else
    //         return res.redirect('../');
    // })

    //delete original avater
    // db.query(`SELECT avater from users WHERE id = ?`, [req.session.user], (err, results) => {
    //     if (results[0].avater == "../img/static/avater_default.png") {
    //         return;
    //     }
    //     console.log(results[0].avater)
    //     const originalpath = path.join('./public', results[0].avater)
    //     console.log(originalpath)
    //     fs.unlink(originalpath, function (err) {
    //         if (err) throw err
    //     })
    // })



}