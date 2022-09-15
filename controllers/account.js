const mysql = require("mysql");
const bcrypt = require("bcryptjs");

const db = mysql.createPool({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    charset: 'utf8mb4'
});
// 抓取 /home 所需資料
// exports.home = (req, res)=>{
//     var username;
//     if (req.session.user) {
//         userID = req.session.user;
//         var sql = `SELECT * FROM users WHERE id = ?`;
//         db.query(sql, [userID], (error, results) => {
//             if (error) throw error;
//             username = results[0].name;
//             email = results[0].email;
//             console.log(email);
//             res.render('index', {
//                 username: username,
//                 email: email
//             });
//         })
//     } else {
//         res.render('index', {
//             username: username
//         });
//     }
// }


//抓取 /account 所需資料
exports.account = (req,res)=>{
    if (req.session.user) {
        var sql = `SELECT * FROM users WHERE id = ?`;
        db.query(sql, [req.session.user], (error, results) => {
            if (error) throw error;
            const username = results[0].name;
            const email = results[0].email;
            const intro = results[0].intro;
            const web = results[0].web;
            const avaterPath = results[0].avater;

            return res.render('account', {
                username: username,
                email: email,
                avater: avaterPath,
                intro: intro,
                web: web,
            });
        })
    } else {
        return res.redirect('./login')
    }
}
exports.homepage = (req,res)=>{
    if (req.session.user) {
        if(req.session.username==req.params.username){
            var sql = `SELECT * FROM users WHERE id = ?`;
            db.query(sql, [req.session.user], (error, results) => {
                if (error) throw error;
                const username = results[0].name;
                const email = results[0].email;
                const avaterPath = results[0].avater;
                const intro = results[0].intro;
                const web = results[0].web;

                return res.render('homepage', {
                    username: username,
                    email: email,
                    avater: avaterPath,
                    intro: intro,
                    web: web,
                    own: true,
                    
                });
            })
        }else{
            if(!req.params.username){
                return res.redirect(`../${req.session.username}`)
            }
            userName = req.params.username;
            var sql = `SELECT * FROM users WHERE name = ?`;
            db.query(sql, [userName], (error, results) => {
                if (error) throw error;
                if(results.length<1){
                    return res.send("notfound")
                }
                const username = results[0].name;
                const email = results[0].email;
                const avaterPath = results[0].avater;
                const intro = results[0].intro;
                const web = results[0].web;

                return res.render('homepage', {
                    username: username,
                    email: email,
                    avater: avaterPath,
                    intro: intro,
                    web: web,
                    own: false,
                });
            })
        }
    }
    else {
        if(!req.params.username){
            return res.render('login')
        }
            userName = req.params.username;
            var sql = `SELECT * FROM users WHERE name = ?`;
            db.query(sql, [userName], (error, results) => {
                if (error) throw error;
                if(results.length==0){
                    return res.send("notfound")
                }
                const username = results[0].name;
                const email = results[0].email;
                const avaterPath = results[0].avater;
                const intro = results[0].intro;
                const web = results[0].web;

                return res.render('homepage', {
                    username: username,
                    email: email,
                    avater: avaterPath,
                    intro: intro,
                    web: web,
                    own: false,
                });
            })
    }
}
//個資更新
exports.rename = (req, res)=>{
    // const {newname, password,newpassword,newConfirmpassword} = req.body;
    // if(newpassword !== newConfirmpassword){
    //     return res.redirect('./account');
    // }
    const {newname, intro, web} = req.body;
    if(newname!=''){
        const setName = `UPDATE users SET name = ? WHERE id = ?`;
        db.query(setName,[newname,req.session.user],(error, results)=>{
            if(error) throw error;
        })
        
        req.session.username = newname;
        req.session.save();
    }
    const setintro = `UPDATE users SET intro = ? WHERE id = ?`;
    db.query(setintro,[intro,req.session.user],(error, results)=>{
        if(error) throw error;
    })
    const setweb = `UPDATE users SET web = ? WHERE id = ?`;
    db.query(setweb,[web,req.session.user],(error, results)=>{
        if(error) throw error;
    })
    return res.redirect('../account')
    
    
    // changed password
    // db.query(`SELECT * FROM users WHERE id = ?`, [req.session.user],async (error, results) => {
    //     if (error) throw error;
    //     const originalPassword=results[0].password;
    //     await bcrypt.compare(password,originalPassword,async (error, results)=>{
    //         if(error) throw error;
    //         if(results){
    //             const hashnewpassword = await bcrypt.hash(newpassword,8);
    //             db.query(`UPDATE users SET password = ? WHERE id = ?`,[hashnewpassword,req.session.user],(error, results)=>{
    //                 console.log(results)
    //             })
    //         }else{
    //             return res.redirect('../account')
    //         }
    //     })
    //     console.log(originalPassword);
    // })
}
exports.saveImg = (req ,res)=>{
    const sql = `UPDATE users SET avater = ? WHERE id = ?`;
    db.query(sql,[req.file.filename,req.session.user],(error, results)=>{
        if(error) throw error;

        return res.redirect('../account')
    })
}
exports.showchangpassword = (req, res)=>{
    if (req.session.user) {
        var sql = `SELECT * FROM users WHERE id = ?`;
        db.query(sql, [req.session.user], (error, results) => {
            if (error) throw error;
            const username = results[0].name;
            const email = results[0].email;
            const intro = results[0].intro;
            const web = results[0].web;
            const avaterPath = '../'+results[0].avater;

            return res.render('account_changpassword', {
                username: username,
                email: email,
                avater: avaterPath,
                intro: intro,
                web: web,
            });
        })
    } else {
        return res.redirect('../login')
    }
}
