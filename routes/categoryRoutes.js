const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const detailedController = require('../controllers/detailedController');

router.get("/categories/new", categoryController.new);
router.post("/categories/create", categoryController.create, categoryController.redirectView);
router.get("/categories/:id/edit", categoryController.edit);
router.put("/categories/:id/update", categoryController.update, categoryController.redirectView);
router.get("/categories/:id", categoryController.show, categoryController.showView);
router.delete("/categories/:id/delete", categoryController.delete, categoryController.redirectView);

router.get("/categories", categoryController.index); // 카테고리 필터링 및 목록 조회
router.get("/Detail/:id", detailedController.detail); // 프로필 상세 페이지

module.exports = router;
