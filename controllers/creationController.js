const Member = require("../models/member");

async function fetchData(userID) {
    try {
        const users = await Member.findOne({ where: { memberNum: userID } });
        if (users) {
            if (users.name) {
                console.log("회원 있다있어!!!!!!!!!!!!!!");
            }
            else {
                console.log("회원 없어!!!!!!!");
            }
        }
        return users;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

exports.create = async (req, res) => {
    try {
        if (req.session.user) {
            console.log('Creation page accessed by user:', req.session.user);
            res.render('nonProfile', { user: req.session.user });
        } else {
            res.redirect('/login'); // 세션에 사용자가 없으면 로그인 페이지로 리디렉션
        }
    } catch (error) {
        console.error('Internal Server Error:', error);
        res.status(500).send('Internal Server Error');
    }
};
