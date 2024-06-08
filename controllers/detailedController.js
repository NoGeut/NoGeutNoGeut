const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const InterestField = require("../models/interestField");
const Member = require("../models/member");
const Review = require("../models/review");



async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        console.log("users");
        return users; // fetchData 함수가 Promise를 반환하도록 수정
    } catch (error) {
        console.error(error);
        throw error;
    }
}




async function fetchData2(userID) {
    try {
        const senior = await SeniorProfile.findOne({ where: { seniorNum: userID } });
        if (senior) {
            console.log("있다있어!!!!!!!!!!!!!!");
        } else {
            console.log("없어!!!!!!!");
        }
        return senior;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

async function fetchData3(userID) {
    try {
        const student = await StudentProfile.findOne({ where: { stdNum: userID } });
        if (student) {
            console.log("주니어 회원");
        } else {
            console.log("주니어 회원이 아닙니다.");
        }
   return student;
    } catch (error) {
        console.error(error);
        throw error;
    }
}


// 같이 씀
async function interestFieldData(seniorID) {
    try {
        const interests = await InterestField.findAll({ where: { memberNum: seniorID } });
        if (interests.length > 0) {
            console.log("있다있어!!!!!!!!!!!!!!");
        } else {
            console.log("없어!!!!!!!");
        }
        return interests;
    } catch (error) {
        console.error(error);
        throw error;
    }
}



async function reviewData(memberNum) {
    try {
        const review = await Review.findAll({ where: { reviewReceiver: memberNum } });
        if (review.length > 0) {
            console.log("있다있어!!!!!!!!!!!!!!");
        } else {
            console.log("없어!!!!!!!");
        }
        return review;
    } catch (error) {
        console.error(error);
        throw error;
    }
}




function calculateKoreanAgeByYear(birthYear) {
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear;
}

exports.myDetail = async (req, res) => {
    try {
        const member = await fetchData(req.session.userID);
        res.render("myPage.ejs", {member: member});
    } catch (error) {
        res.status(500).send(error.message);
    }
}


exports.detail = async (req, res) => {
    try {
        const user = await fetchData(req.session.userID);
        const senior = await fetchData2(req.session.userID);
        const student = await fetchData3(req.session.userID);

        if (senior) {
            const year = calculateKoreanAgeByYear(senior.yearOfBirth);
            const interestField = await interestFieldData(senior.seniorNum);
            const review = await reviewData(senior.seniorNum);
            const encodedImageBase64String = Buffer.from(senior.profileImage).toString('base64');
            return res.render('DetailedProfile_old', { senior, age: year, encodedImageBase64String, interests: interestField, review, user });
        }

        if (student) {
            const year = calculateKoreanAgeByYear(student.yearOfBirth);
            const interestField = await interestFieldData(student.stdNum);
            const review = await reviewData(student.stdNum);
            const encodedImageBase64String = student.profileImage ? Buffer.from(student.profileImage).toString('base64') : '';
            return res.render('DetailedProfile_young', { student, user, age: year, encodedImageBase64String, interests: interestField, review, user });
        }

        // If neither senior nor student profile exists
        return res.status(404).send('회원 정보를 찾을 수 없습니다.');
    } catch (error) {
        res.status(500).send(error.message);
    }
}


exports.oldDetail = async (req, res) => {
    try {

        //const user = await fetchData(req.session.userID);
        const user = req.session.user;
        const senior = await fetchData2(req.session.userID);
        //const senior = await fetchData2(req.session.user.memberNum);
        if (senior) {
            const year = await calculateKoreanAgeByYear(senior.yearOfBirth);
            const interestField = await interestFieldData(senior.seniorNum);

            const review = await reviewData(senior.seniorNum);
            const encodedImageBase64String = Buffer.from(senior.profileImage).toString('base64');
            res.render('MyDetailedProfile_old', { senior, age: year, encodedImageBase64String: encodedImageBase64String, interests: interestField, review: review, user: user });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

//수정
exports.mypage = async (req, res) => {
    try {
        const user = await fetchData(req.session.userID);
        const senior = await fetchData2(req.session.userID);
        const student = await fetchData3(req.session.userID);

        if (senior) {
            const year = await calculateKoreanAgeByYear(senior.yearOfBirth);
            const interestField = await interestFieldData(senior.seniorNum);

            //const formatSelfIntro = senior.introduce.replace("<br>", "\n");
            //const formatCaution = senior.precautions.replace("<br>", "\n");

            const review = await reviewData(senior.seniorNum);
            const encodedImageBase64String = Buffer.from(senior.profileImage).toString('base64');
            res.render('DetailedProfile_old', { senior, age: year, encodedImageBase64String: encodedImageBase64String, interests: interestField, review: review, user: user });
        
        }
        if (student) {
            const year = await calculateKoreanAgeByYear(student.yearOfBirth);
            const interestField = await interestFieldData(student.stdNum);

            //const formatSelfIntro = student.introduce.replace("<br>", "\n");
            
            const review = await reviewData(student.stdNum);
            const encodedImageBase64String = student.profileImage ? Buffer.from(student.profileImage).toString('base64') : '';
            res.render('myPage_young', { student, user, age: year, encodedImageBase64String: encodedImageBase64String, interests: interestField, review: review, user: user });
        }
        if (senior && student) res.status(404).send('회원 정보를 찾을 수 없습니다.'); // Error: 양쪽 프로필 생성한 경우

    } catch (error) {
        res.status(500).send(error.message);
    }
}