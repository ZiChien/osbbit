const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

exports.login = (req, res)=>{
    const {email, password} = req.body;
    var sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql,[email], async(error, results)=>{
        if(error) throw error;
        if(results.length<=0){
            return res.redirect('../login');
        }
        let username = results[0].name;
        let dbuserID = results[0].id;
        let myhash = results[0].password;
        await bcrypt.compare(password, myhash,(error,results)=>{
            if(error) throw error;
            if(results){
                req.session.user = dbuserID;
                req.session.username = username;
                return res.redirect(`../${username}`)
            }else{
                return res.redirect('../login');
            }
        })
        
    })
}