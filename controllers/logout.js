exports.logout = (req, res)=>{
    req.session.destroy(()=>{
        console.log("session destroy");
    })
    return res.redirect('../login');
}