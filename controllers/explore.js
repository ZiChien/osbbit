const mysql = require("mysql");

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

exports.search = (req, res)=>{
    let sql = `SELECT name,avater FROM users WHERE name LIKE '%${req.query.keywords}%'`;
    db.query(sql,(err, results)=>{
        return res.json({
            "users": results 
        })
    })
    
}
