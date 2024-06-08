const express = require('express');
const router = express.Router();
const session = require('express-session');
const creationController = require("../controllers/creationController");
const oldProfileController = require("../controllers/oldProfileController");
const youngProfileController = require("../controllers/youngProfileController");
const FileStore = require('session-file-store')(session);
const multer = require('multer'); // multer를 require 합니다
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // 파일 저장 디렉토리
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // 파일 이름 설정
    }
});
const upload = multer({ storage: storage });

router.get("/", creationController.create);
router.get("/creation", creationController.create); // 소문자로 경로 설정
router.get("/login", creationController.create);
router.get("/senior", oldProfileController.createOldProfile); // 소문자로 경로 설정
router.post("/senior", upload.single('profileImage'), oldProfileController.createSeniorProfile);
router.get("/university", youngProfileController.showForm); // 소문자로 경로 설정
router.post("/university", youngProfileController.create);

module.exports = router;
