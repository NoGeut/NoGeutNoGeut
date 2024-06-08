const { format } = require('date-fns');
const Promise = require("../models/promise");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const ChatRoom = require("../models/chatRoom");
const Matching = require("../models/matching");

//노인프로필과 약속
exports.showSnProfilePromisePage = async (req, res) => {
    try {
        const user = req.session.userID;
        const seniorNum = req.params.seniorNum;

        const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: seniorNum } });

        if (!seniorProfile) {
            return res.status(400).json({ error: '학생 정보를 찾을 수 없습니다.' });
        }

        console.log(`user: ${user}`);
        console.log(`seniorNum: ${seniorNum}`)

        console.log("start promise page");
        res.render('seniorPromise', { seniorNum: seniorNum });
    } catch (error) {
        console.error('Error showing promise page:', error);
        res.status(500).json({ error: '페이지를 불러오는 동안 오류가 발생했습니다.' });
    }
};

//db에 약속 정보 저장
exports.createSnProfilePromise = async (req, res) => {
    try {
        //const stdNum = req.params.stdNum;
        const seniorNum = req.params.seniorNum;
        const user = req.session.userID;
        const { promiseDay, startTime, finishTime } = req.body;

        console.log("Promise creation process started.");
        console.log("Request params:", req.params);
        console.log("Request body:", req.body);

        const promise = await Promise.create({
            //promiseNum: ,
            stdNum: user,
            protectorNum: seniorNum,
            roomNum: 1,
            //promiseCreationDate: ,
            promiseDay: promiseDay,
            startTime: startTime,
            finishTime: finishTime,
            //textSendingStatus: 
        });

        console.log("Promise created:", promise);

        // 약속 생성 후 매칭 레코드 생성
        const newMatching = await Matching.create({
            promiseNum: promise.promiseNum,  // 생성된 약속의 promiseNum 사용
            reportNum: null,
            depositStatus: false,
            reportStatus: false
        });

        console.log("Matching created:", newMatching);


        //res.status(201).json(promise); // 약속 목록 페이지로 리다이렉션
        res.redirect(`/promise/${seniorNum}/${promise.promiseNum}`);
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ error: '약속을 작성하는 동안 오류가 발생하였습니다.' });
    }
}

//요청 완료된 창
exports.showPromiseRequest = async (req, res) => {
    try {
        const { seniorNum, promiseNum } = req.params;

        // 요청이 도착했는지 확인
        console.log(`Received request to show promise complete page for seniorNum: ${seniorNum},promiseNum: ${promiseNum}`);

        const promise = await Promise.findOne({ where: { promiseNum: promiseNum } });

        if (!promise) {
            console.log(`Promise with ID ${promiseNum} not found.`);
            return res.status(404).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("Promise found:", promise);

        //npm install date-fns
        // 날짜 형식을 'yyyy.MM.dd (E)' 형식으로 변환
        const formattedDate = format(new Date(promise.promiseDay), 'yyyy.MM.dd (E)');

        // 변환된 날짜를 promise 객체에 추가
        promise.formattedPromiseDay = formattedDate;

        res.render('seniorPromiseSender', { seniorNum: seniorNum, promise: promise });
    } catch (error) {
        console.error('Error showing promise page:', error);
        res.status(500).json({ error: '페이지를 불러오는 동안 오류가 발생했습니다.' });
    }
};

// 약속 확인 페이지를 보여주는 컨트롤러 함수(거절 수락 선택 페이지)
exports.showPromiseConfirmation = async (req, res) => {
    try {
        const { seniorNum, promiseNum } = req.params;

        // 요청이 도착했는지 확인
        console.log(`Received request to show promise complete page for seniorNum: ${seniorNum},promiseNum: ${promiseNum}`);

        const promise = await Promise.findOne({ where: { promiseNum: promiseNum } });

        if (!promise) {
            console.log(`Promise with ID ${promiseNum} not found.`);
            return res.status(404).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("Promise found:", promise);

        //npm install date-fns
        // 날짜 형식을 'yyyy.MM.dd (E)' 형식으로 변환
        const formattedDate = format(new Date(promise.promiseDay), 'yyyy.MM.dd (E)');

        // 변환된 날짜를 promise 객체에 추가
        promise.formattedPromiseDay = formattedDate;

        // 약속 정보를 템플릿에 전달합니다.
        res.render('seniorPromiseRequest', { seniorNum: seniorNum, promise: promise });
    } catch (error) {
        console.error('Error showing promise confirmation page:', error);
        res.status(500).json({ error: '페이지를 불러오는 동안 오류가 발생했습니다.' });
    }
};

// 약속 거절
exports.rejectProfilePromise = async (req, res) => {
    try {
        const { seniorNum, promiseNum } = req.params;

        // 매칭 테이블에서 해당 약속 번호를 가지는 레코드 삭제
        await Matching.destroy({ where: { promiseNum: promiseNum } });

        // 약속을 찾고 삭제합니다.
        const deletedPromise = await Promise.destroy({ where: { promiseNum: promiseNum } });

        if (!deletedPromise) {
            return res.status(404).json({ error: '삭제할 약속을 찾을 수 없습니다.' });
        }

        res.status(200).json({ message: '약속이 성공적으로 거절되었습니다.' }); // 약속 목록 페이지로 리다이렉션
        //res.redirect('promiseList');
    } catch (error) {
        console.error('Error rejecting promise:', error);
        res.status(500).json({ error: '약속을 거절하는 동안 오류가 발생하였습니다.' });
    }
}

// 약속 수락 후 입금 확인 페이지로 이동
exports.acceptPromise = async (req, res) => {
    try {
        const { seniorNum, promiseNum } = req.params;

        // 입금 확인 페이지로 넘어가도록 리다이렉트합니다.
        //res.redirect(`/${stdNum}/${promiseNum}/deposit`); // 경로 수정
        res.status(200).json({ redirectUrl: `/promise/${seniorNum}/${promiseNum}/deposit` });
    } catch (error) {
        console.error('Error accepting promise:', error);
        res.status(500).json({ error: '약속을 수락하는 동안 오류가 발생하였습니다.' });
    }
}

//입금확인창
exports.showPromiseDeposit = async (req, res) => {
    try {
        const { seniorNum, promiseNum } = req.params;

        // 요청이 도착했는지 확인
        console.log(`Received request to show promise complete page for seniorNum: ${seniorNum},promiseNum: ${promiseNum}`);

        const promise = await Promise.findOne({ where: { promiseNum: promiseNum } });

        if (!promise) {
            console.log(`Promise with ID ${promiseNum} not found.`);
            return res.status(404).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("Promise found:", promise);

        //npm install date-fns
        // 날짜 형식을 'yyyy.MM.dd (E)' 형식으로 변환
        const formattedDate = format(new Date(promise.promiseDay), 'yyyy.MM.dd (E)');

        // 변환된 날짜를 promise 객체에 추가
        promise.formattedPromiseDay = formattedDate;
        //목록페이지로 리다이렉트
        res.render('seniorPromiseDeposit', { seniorNum: seniorNum, promise: promise });
    } catch (error) {
        console.error('Error showing promise page:', error);
        res.status(500).json({ error: '페이지를 불러오는 동안 오류가 발생했습니다.' });
    }
};

// 입금 확인 처리를 위한 컨트롤러 함수
exports.confirmDeposit = async (req, res) => {
    try {
        const { seniorNum, promiseNum } = req.params;

        // 요청이 도착했는지 확인
        console.log(`Received request to show promise complete page for seniorNum: ${seniorNum},promiseNum: ${promiseNum}`);

        // 매칭(Matching) 데이터베이스에서 해당 약속(promiseNum)을 찾습니다.
        const matching = await Matching.findOne({ where: { promiseNum: promiseNum } });

        if (!matching) {
            console.log(`Matching record for promise number ${promiseNum} not found.`);
            return res.status(404).json({ error: '매칭 레코드를 찾을 수 없습니다.' });
        }

        // 입금 확인을 true로 업데이트합니다.
        matching.depositStatus = true;
        await matching.save();

        console.log(`Deposit confirmation for promise number ${promiseNum} updated successfully.`);

        // 성공적으로 업데이트되었음을 응답합니다.
        //res.status(200).json({ message: '입금 확인이 정상적으로 완료되었습니다.' });
        res.redirect('/main');
    } catch (error) {
        console.error('Error confirming deposit:', error);
        res.status(500).json({ error: '입금 확인 중 오류가 발생했습니다.' });
    }
};