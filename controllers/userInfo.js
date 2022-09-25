const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const MongoClient = require("mongodb").MongoClient

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    charset: 'utf8mb4'
});

exports.getuserpost = async (req ,res)=>{
    const username = req.params.username;
    try{
        const client = new MongoClient(process.env.mongouri);
        const database = client.db('users');
        const post = database.collection('post');

        const query = {user_name: username}
        const result = await post.find(query).toArray();
        res.json({
            result: result
        });
    }catch(err){
        console.log(err)
    }
    
}
exports.authpassword = (req, res)=>{
    if(!req.session.user){
        return res.send('404notfound')
    }
    db.query(`SELECT password FROM users WHERE id = ?`,[req.session.user],async (err, results)=>{
        if(err) throw err;
        let pwcheck = false;
        const o_password = results[0].password;
        const password = req.body.password;
        const n_password = req.body.newpassword;
        let info;
        console.log(req.body.password)
        await bcrypt.compare(password,o_password,async (error, results)=>{
            if(error) throw error;
            if(results){
                await bcrypt.compare(n_password,o_password,async (error, results)=>{
                    if(results){
                        pwcheck = false;
                        info = "密碼與原密碼相同";
                    }
                    else{
                        pwcheck = true;
                        info = "密碼變更成功";
                        const hashnewpassword = await bcrypt.hash(n_password,8);
                        db.query(`UPDATE users SET password = ? WHERE id = ?`,[hashnewpassword,req.session.user],(error, results)=>{
                            console.log(results)
                        })
                    }
                    res.json({
                        pwcheck : pwcheck,
                        info : info,
                    })
                })
            }else{
                pwcheck = false
                info = "舊密碼不正確"
                console.log('res.json!')
                res.json({
                    pwcheck : pwcheck,
                    info : info,
                })
            }

            
        })
    })
}