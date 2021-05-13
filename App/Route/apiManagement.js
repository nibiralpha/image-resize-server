const express = require('express');
const router = express.Router();

const multer = require("multer")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})


var upload = multer({ storage: storage })

const FileController = require('../Controller/FileController');


router.get('/', (req, res) => {
    res.send({ status: true });
});

router.post('/file/upload/', upload.single('file'), FileController.upload);

module.exports = router;