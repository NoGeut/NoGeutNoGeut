//youngProfileController.js

const StudentProfile = require("../models/studentProfile");
const InterestField = require("../models/interestField");
const Member = require("../models/member");
const Sequelize = require("sequelize");
//const fs = require('fs').promises;

async function fetchData(userId) {
	try {
		const users = await Member.findOne({ where: {memberNum: userId}});
		return users; // Promise를 반환하도록 수정
	} catch (error) {
		console.error(error);
		throw error;
	}
}

//이름 수정
module.exports = {
	showForm: (req, res) => {
		res.render("../views/profileForm_young");
	},

	showProfile: async (req, res) => {
		try {
			const profileData = await fetchData(req.session.user.userId);
			res.render("../views/showProfile", { profile: res.locals.profileData });
		} catch (error) {
			res.status(500).send('profileController.showProfile Error');
			//Internal Server Error
		}
	},

	//임시
	showMyPage: (req, res) => {
		res.render("../views/myPage");
	},

	redirectView: (req, res, next) => {
		let redirectPath = res.locals.redirect;
		if (redirectPath !== undefined) res.redirect(redirectPath);
	},

    create: async (req, res) => {
        try {
            const {
                name,
                birthYear,
                phoneNumber,
                gender,
                university,
                major,
                sido,
                gugun,
                favoField,
                desiredAmount,
                ableDay,
                ableTime,
                selfIntro,
                active
            } = req.body;
    
            const profileImagePath = req.file ? req.file.path : null;
            let profileImage = null;
    
            // 이미지 파일을 읽어 BLOB 데이터로 변환합니다.
            /*
            if (profileImagePath) {
                profileImage = await fs.readFile(profileImagePath);
            }
            */
    
            const ableDayString = Array.isArray(ableDay) ? ableDay.join(',') : ableDay;
    
            const ableDayMapping = {
                'ableDay_1': '월',
                'ableDay_2': '화',
                'ableDay_3': '수',
                'ableDay_4': '목',
                'ableDay_5': '금',
                'ableDay_6': '토',
                'ableDay_7': '일'
            };
            const ableTimeMapping = {
                'ableTime_noon': '오후',
                'ableTime_morn': '오전',
                'ableTime_disscu': '협의'
            };
    
            const DesireMapping = {
                'DA_1': '1만원',
                'DA_3': '3만원',
                'DA_5': '5만원',
                'DA_free': '무료',
                'DA_disscu': '협의'
            };
            const studentProfile = await studentProfile.create({
                //stdNum == memberNum
                stdNum: req.session.userID,
                profileImage: profileImage,
                desiredAmount: DesireMapping[desiredAmount],
                enableMatching: active === '활성화',
                gender: gender === 'male'? '남성' : '여성',
                //precautions: caution,
                introduce: selfIntro,
                //studentName: name,
                phoneNumber: phoneNumber,
                matchingCount: 0,
                creationTime: new Date(),
                recentMatchingTime: null,
                //yearOfBirth: birthYear,
                sido: sido,
                gu: gugun,
                availableDay: ableDayMapping[ableDayString],
                availableTime: ableTimeMapping[ableTime],
                score: 0,
                recentMatchingTime: null
            });
    
            const fieldMappings = {
                'FF_exercise': '운동',
                'FF_craft': '수공예',
                'FF_digital': '디지털',
                'FF_music': '음악',
                'FF_art': '미술',
                'FF_companion': '말동무'
            };
    
            for (const field of favoField) {
                const mappedField = fieldMappings[field];
                if (mappedField) {
                    await InterestField.create({
                        memberNum: req.session.userID,
                        interestField: mappedField
                    });
                }
            }
    
            const user = await fetchData(req.session.userID);
            if (user) {
                await Member.update({
                    profileCreationStatus: true
                }, {
                    where: { memberNum: req.session.userID }
                }).then((result) => {
                    console.log("수정 성공: ", result);
                }).catch((err) => {
                    console.log("수정 Error: ", err);
                });
            }
    
            console.log("Student Profile Created:", studentProfile);
            res.redirect('../views/myPage');
        } catch (error) {
            console.error("Error creating Studnet profile:", error);
            res.status(500).send("프로필을 생성하는 중에 오류가 발생했습니다.");
        }
    },

	update: async (req, res, next) => {
		let userId = req.params.id;
		let editProfileParams = getProfileParams(req.body);
		try {
			let memberNum = await Member.findOne(userId, { attributes: memberNum });
			let profile = await StudentProfile.findByPK(memberNum);
			if(profile) {
				let updateProfileParams = {};

				//기존 프로필 데이터와 새 데이터 비교
				 for (let key in editProfileParams) {
					 if (editProfileParams[key] !== undefined && editProfileParams[key] !== profile[key]) {
						 updatedProfileParams[key] = editProfileParams[key];
					 }
				 }

				//변경된 데이터가 있으면 업데이트
				if (Object.keys(updatedProfileParams).length > 0) {
					await profile.update(updatedProfileParams);
				}

				res.locals.redirect = `/showProfile`;
				res.locals.profile = profile;
				next();
			} else {
				//
				next(new Error("Profile not found"));
			}
		} catch(error) {
			console.log(`Error updating profile: ${error.message}`);
			next(error);
		}
	},

	remove: async (req, res, next) => {
		let userId = req.params.id;
		try {
			let memberNum = await Member.findOne(userId, { attributes: memberNum });
			let profile = await StudentProfile.findByPKAndRemove(memberNum);
			//
			res.locals.redirect = "/myPage";
			next();
		} catch(error) {
			console.log(`Error removing profile: ${error.message}`);
			next(error);
		};
	},


};
