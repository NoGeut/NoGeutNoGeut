const express = require("express");
const router = express.Router();
const keepController = require("../controllers/keepController");

router.get("/keeps", keepController.index);

module.exports = router;
