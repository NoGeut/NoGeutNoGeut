const Member = require('../models/member');
const Promise = require('../models/promise');
const Matching = require('../models/matching');
const Review = require('../models/review');
const { Op } = require('sequelize');


async function fetchData(userID) {
    try {
        const user = await Member.findOne({ where: { memberNum: userID } });
        return user; // fetchData 함수가 Promise를 반환하도록 수정
    } /*catch (error) {
        console.error(error);
        throw error;
    }*/
    catch (error) {
        if (error.message.includes("Duplicate entry")) {
            console.log("중복오류");
            res.status(409).json({ error: '후기가 이미 존재합니다.' });
            
        } else {
            console.error('Error creating review:', error);
            console.log("그냥오류");
            res.status(500).json({ error: '후기를 작성하는 동안 오류가 발생했습니다.' });
        }
    }
}

exports.createReview = async (req, res) => {
    try {
        console.log("Review creation process started.");
    
        const userID = req.session.userID; // 세션 아이디를 가져옵니다.
        const { reviewContent, rating } = req.body;
        const score = parseInt(rating, 10);

        console.log("userId: ", userID)
        console.log("Request body: ", req.body);
        // 사용자 정보를 조회합니다.
        const user = await fetchData(userID);

        if (!user) {
            return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        console.log("find promise...");

        // userID와 일치하는 stdNum 또는 protectorNum이 있는지 조회
        const promise = await Promise.findOne({
            where: {
                [Op.or]: [
                    { stdNum: userID },
                    { protectorNum: userID }
                ]
            }
        });

        if (!promise) {
            return res.status(400).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("Promise found:", promise);
        console.log("PromiseNum: ", promise.promiseNum);
        // 약속 정보를 기반으로 매칭 정보를 조회합니다.
        const matching = await Matching.findOne({ where: { promiseNum: promise.promiseNum } });

        if (!matching) {
            return res.status(400).json({ error: '해당 약속에 대한 매칭을 찾을 수 없습니다.' });
        }


        // 매칭 정보에서 매칭 번호를 가져옵니다.
        const matchingNum = matching.matchingNum;

        console.log("matchingNum: ", matchingNum);

        let reviewSender, reviewReceiver;
        if (userID === promise.stdNum) {
            reviewSender = promise.stdNum;
            reviewReceiver = promise.protectorNum;
        } else if (userID === promise.protectorNum) {
            reviewSender = promise.protectorNum;
            reviewReceiver = promise.stdNum;
        } else {
            console.log("Invalid userProfile.");
            return res.status(400).json({ error: '올바르지 않은 사용자 프로필입니다.' });
        }


        console.log("reviewSender: ", reviewSender);
        console.log("reviewReceiver: ", reviewReceiver);

        //사용자가 이전에 후기를 작성한 적 있는지 검사
        const existingReview = await Review.findOne({
            where: {
                matchingNum: matchingNum,
                reviewSender: reviewSender,
                reviewReceiver: reviewReceiver
            }
        });
        //후기가 이미 존재할 경우
        if (existingReview) {
            return res.status(409).json({ error: '후기가 이미 존재합니다.' });
        }

        // 후기가 존재하지 않을 경우 후기를 작성.
        const review = await Review.create({
            matchingNum: matchingNum,
            reviewSender: reviewSender, // 후기 작성자는 사용자의 회원 번호입니다.
            reviewReceiver: reviewReceiver, // 이 부분은 필요에 따라 수정하세요.
            reviewContent: reviewContent,
            score: score
        });

        console.log("Review created:", review);
        res.status(201).json(review);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: '후기를 작성하는 동안 오류가 발생했습니다.' });
    }
};

// 리뷰 작성 페이지 렌더링 함수
exports.renderReviewPage = (req, res) => {
    console.log("Review render process started.");
    //const { matchingNum, userProfile } = req.params; 
    const { matchingNum } = req.params; // URL에서 matchingNum 가져오기
    const user = req.session.userID; // 세션에서 userProfile 가져오기
    const stickerValues = [1, 2, 3, 4, 5];
    const reviewContent = ""; // 초기화할 값 또는 데이터베이스에서 가져온 값
    const score = 0; // 초기화할 값 또는 데이터베이스에서 가져온 값

    res.render("review", {
        stickerValues: stickerValues,
        reviewContent: reviewContent,
        score: score,
        formAction: `/review/write`,
        matchingNum: matchingNum, // matchingNum 전달
        user: user
    });
};