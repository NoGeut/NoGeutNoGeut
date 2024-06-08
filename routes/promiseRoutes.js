const express = require('express');
const router = express.Router(); 
const stdPromiseController = require("../controllers/stdPromiseController");
const seniorPromiseController = require("../controllers/seniorPromiseController");  // Verify this path
const promiseListController = require("../controllers/promiseListController");

// 사용자 - 노인프로필 / 상대방 - 학생
router.get('/:stdNum', stdPromiseController.showStdProfilePromisePage);
router.post('/:stdNum', stdPromiseController.createStdProfilePromise);
router.get('/:stdNum/:promiseNum', stdPromiseController.showPromiseRequest);
router.get('/:stdNum/:promiseNum/request', stdPromiseController.showPromiseConfirmation);
router.post('/:stdNum/:promiseNum/request/reject', stdPromiseController.rejectProfilePromise);
router.post('/:stdNum/:promiseNum/request/accept', stdPromiseController.acceptPromise);
router.get('/:stdNum/:promiseNum/deposit', stdPromiseController.showPromiseDeposit);
router.post('/:stdNum/:promiseNum/deposit', stdPromiseController.confirmDeposit);

// 사용자 - 학생 / 상대방 - 노인프로필
router.get('/:seniorNum', seniorPromiseController.showSnProfilePromisePage);
router.post('/:seniorNum', seniorPromiseController.createSnProfilePromise);
router.get('/:seniorNum/:promiseNum', seniorPromiseController.showPromiseRequest);
router.get('/:seniorNum/:promiseNum/request', seniorPromiseController.showPromiseConfirmation);
router.post('/:seniorNum/:promiseNum/request/reject', seniorPromiseController.rejectProfilePromise);
router.post('/:seniorNum/:promiseNum/request/accept', seniorPromiseController.acceptPromise);
router.get('/:seniorNum/:promiseNum/deposit', seniorPromiseController.showPromiseDeposit);
router.post('/:seniorNum/:promiseNum/deposit', seniorPromiseController.confirmDeposit);

// 약속 목록
router.get('/:stdNum/promiseList', promiseListController.getStudentPromises);

module.exports = router;
