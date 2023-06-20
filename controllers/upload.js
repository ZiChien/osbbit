const fs = require('fs');
const path = require('path');
const mysql = require("mysql");
const session = require('express-session');
const cloudinary = require('cloudinary').v2;
const MongoClient = require('mongodb').MongoClient;

async function addpost(doc){
    try {
        const client = new MongoClient(process.env.mongouri);
        const database = client.db('users');
        const post = database.collection('post');
        
        let postdoc={
            user_name: doc.user_name,
            image_path: doc.image_path,
            public_id: doc.public_id,
            asset_id: doc.asset_id,
            postintro: doc.postintro,
            postdate: doc.postdate,
        }
        const result = await post.insertOne(postdoc);
    } catch (err) {
        console.log(err);
    }
}




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
    //stored in Cloudinary
    try {
        cloudinary.uploader
            .upload(req.body.imagebase64,
                {
                    folder: req.session.user,
                })
            .then((result) => {
                let time = new Date()
                time = time.toLocaleDateString() 
                addpost({
                    user_name: req.session.username,
                    image_path: result.secure_url,
                    public_id: result.public_id,
                    asset_id: result.asset_id,
                    postintro: req.body.uploadintro,
                    postdate: time,
                })
                return res.redirect('../');
            })
    } catch (error) {
        console.error(error);
    }
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
                        file = file[file.length - 1].split('.')
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