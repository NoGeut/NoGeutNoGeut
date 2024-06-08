const Promise = require('../models/promise');
const SeniorProfile = require('../models/seniorProfile');
const StudentProfile = require('../models/studentProfile');
const Member = require('../models/member');

// 특정 학생의 약속 목록 조회 컨트롤러 함수
exports.getStudentPromises = async (req, res) => {
    try {
        const { stdNum } = req.params;

        // 학생 번호로 약속 목록을 조회하면서 학생과 노인의 이름을 조인합니다.
        const promises = await Promise.findAll({
            where: { stdNum },
            include: [
                {
                    model: StudentProfile,
                    as: 'studentProfile',
                    include: [
                        {
                            model: Member,
                            as: 'member',
                            attributes: ['name'] // 학생의 이름 속성을 가져옵니다.
                        }
                    ]
                },
                {
                    model: SeniorProfile,
                    as: 'seniorProfile',
                    include: [
                        {
                            model: Member,
                            as: 'member',
                            attributes: ['name'] // 노인의 이름 속성을 가져옵니다.
                        }
                    ]
                }
            ]
        });

        // 약속 목록이 비어있는지 확인합니다.
        if (!promises.length) {
            return res.status(404).json({ error: '해당 학생의 약속이 없습니다.' });
        }

        // 조회한 약속 목록을 EJS 템플릿으로 전달합니다.
        res.render('studentPromises', { promises });
    } catch (error) {
        console.error('Error fetching student promises:', error);
        res.status(500).json({ error: '학생의 약속 목록을 가져오는 동안 오류가 발생했습니다.' });
    }
};
