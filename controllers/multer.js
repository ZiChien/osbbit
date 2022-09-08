const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/img'))
        
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + file.originalname
        cb(null, uniqueSuffix)
    }
})
const upload = multer({ storage: storage })
module.exports = upload;

exports.saveimg = (req, res)=>{
    console.log(req.file.path);
}
