const Member = require('../models/member');
const PromiseModel = require('../models/promise');
const SeniorProfile = require('../models/seniorProfile');
const { Op } = require('sequelize');

exports.getPromiseWithMemberName = async (req, res) => {
    try {
        console.log("Report render process started.");

        const userID = req.session.userID;
        console.log("User ID:", userID);

        // 사용자 정보 조회
        const user = await Member.findOne({ where: { memberNum: userID } });
        console.log("User:", user);

        if (!user) {
            return res.status(400).json({ error: '사용자를 찾을 수 없습니다.' });
        }

        // 약속 정보 조회
        const promise = await PromiseModel.findOne({
            where: {
                [Op.or]: [
                    { stdNum: userID },
                    { protectorNum: userID }
                ]
            }
        });
        console.log("Promise:", promise);

        if (!promise) {
            return res.status(400).json({ error: '약속을 찾을 수 없습니다.' });
        }

        console.log("PromiseNum:", promise.promiseNum);

        let seniorName = null;
        let protectorName = null;

        // 학생의 이름 조회
        const student = await Member.findOne({ where: { memberNum: promise.stdNum } });
        console.log("Student:", student);
        const studentName = student ? student.name : null;

        // 보호자의 이름 조회
        if (promise.protectorNum === userID) {
            protectorName = user.name;
        }

        // 노인의 이름 조회
        if (promise.seniorNum) {
            const seniorProfile = await SeniorProfile.findOne({ where: { seniorNum: promise.seniorNum } });
            console.log("Senior Profile:", seniorProfile);
            seniorName = seniorProfile ? seniorProfile.seniorName : null;
        }

        console.log("Student Name:", studentName);
        console.log("Protector Name:", protectorName);
        console.log("Senior Name:", seniorName);

        const promiseWithMemberName = {
            promiseNum: promise.promiseNum,
            studentName: studentName,
            seniorName: seniorName,
            guardianName: protectorName
        };

        res.render('report', {
            promiseWithMemberName,
            promiseDate: promise.promiseCreationDate,
            startTime: promise.startTime
        });
    } catch (error) {
        console.error('Error fetching promise with member name:', error);
        res.status(500).json({ error: '약속과 회원 이름을 가져오는 중 오류가 발생했습니다.' });
    }
};