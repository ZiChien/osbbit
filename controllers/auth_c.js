const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

exports.register = (req, res) => {
    console.log(req.body);

    const { name, email, password, comfirmpassword } = req.body;

    db.query(`SELECT email FROM users WHERE email = ?`, [email], async (error, results) => {
        if (error) {
            console.log(error);
            return;
        }
        if (results.length > 0) {
            console.log("email has been signed up");
            return;
        }
        if (password !== comfirmpassword) {
            console.log("comfirmpassword is incorrect");
            return;
        }

        var hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);

        db.query(`INSERT INTO users SET ?`, { name: name, email: email, password: hashedpassword, avater: "../img/static/avater_default.png" }, (error, results) => {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
                console.log("sign up successed");
                return res.redirect('../login')
            }
        })


    })
}

exports.checkemail = (req, res) => {
    
    db.query(`SELECT email FROM users WHERE email = ?`, [req.query.email], async (error, results) => {
        if (error) throw error;
        let available;
        results.length ? (available = false) : (available = true);

        res.json({
            available: available
        })
    })

}
exports.checkname = (req, res) => {
    
    db.query(`SELECT name FROM users WHERE name = ?`, [req.query.name], async (error, results) => {
        if (error) throw error;
        let available;
        results.length ? (available = false) : (available = true);
        res.json({
            available: available
        })
    })

}