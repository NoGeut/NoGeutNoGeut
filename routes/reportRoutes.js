const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 보고서 작성 페이지를 렌더링하는 라우트
router.get('/', reportController.getPromiseWithMemberName);

module.exports = router;