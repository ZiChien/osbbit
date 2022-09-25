const express = require('express');
const router = express.Router();

const post = require('../controllers/post')

router.get('/:asset_id',post.post)

router.get('/api/callpost/:asset_id',post.getpostdoc)
router.get('/api/deletepost/:asset_id',post.deletepost)
module.exports = router;