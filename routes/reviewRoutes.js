const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.get('/write', reviewController.renderReviewPage);
//router.post('/write/:matchingNum', reviewController.createReview);
//router.get('/write/:userProfile/:matchingNum', reviewController.renderReviewPage);
router.post('/write', reviewController.createReview);
//router.get('/write/:userProfile/:matchingNum', reviewController.checkReviewExistence);

//router.get('/write/:userProfile/:matchingNum', reviewController.renderReviewPage);
//router.post('/write/:userProfile/:matchingNum', reviewController.renderReviewPageView);

module.exports = router; 