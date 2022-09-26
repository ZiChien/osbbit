const MongoClient = require("mongodb").MongoClient
const mysql = require("mysql");
const cloudinary = require('cloudinary').v2;


exports.post = async (req, res) => {
    const asset_id = req.params.asset_id;
    try {
        const client = new MongoClient(process.env.mongouri);
        const database = client.db('users');
        const post = database.collection('post');

        const query = { asset_id: asset_id }
        const result = await post.findOne(query);
        if (result) {
            let permission = false;
            if (result.user_name == req.session.username)
                permission = true;
            return res.render('post', ({
                permission: permission,
            }));
        }
        else {
            res.send("sorry post not found")
        }

    } catch (err) {
        console.log(err)
    }

}
exports.getpostdoc = async (req, res) => {
    const asset_id = req.params.asset_id;
    try {
        const client = new MongoClient(process.env.mongouri);
        const database = client.db('users');
        const post = database.collection('post');

        const query = { asset_id: asset_id }
        const result = await post.findOne(query);
        if (result) {

            const db = mysql.createPool({
                host: process.env.host,
                user: process.env.user,
                password: process.env.password,
                database: process.env.database,
                charset: 'utf8mb4'
            });
            db.query('SELECT * FROM users WHERE name=?', [result.user_name], (err, mysqlresults) => {
                if (err) console.log(err)
                if (mysqlresults.length <= 0)
                    return res.send('post user not found(062)')
                res.json({
                    result: result,
                    postavater: mysqlresults[0].avater,
                });
            })

        }
        else {
            return res.send("sorry post not found")
        }

    } catch (err) {
        console.log(err)
    }
}
exports.deletepost = async (req, res) => {
    const asset_id = req.params.asset_id
    try {
        const client = new MongoClient(process.env.mongouri)
        const database = client.db('users');
        const post = database.collection('post');

        const query = { asset_id: asset_id }

        Promise.all([
            cloudinary.uploader.destroy(req.query.public_id),
            post.deleteOne(query)
        ]).then(() => {
            return res.json({
                username:req.session.username,
            })
        })
            .catch((err) => {
                console.log(err)
                return res.send("delete fail")
            })
        // if(result.deleteCount===1){
        //     return res.send("delete complete")
        // }else{
        //     return res.send("delete fail")
        // }
    } catch (err) {
        console.log(err)
    }
}