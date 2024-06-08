const Member = require("../models/member");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const Keep = require("../models/keep");

module.exports = {
  index: async (req, res, next) => {
    try {
      const user = req.user;
      console.log('Logged in user:', user);

      if (!user) {
        return res.redirect("/login");
      }

      if (user.userType !== 'senior') {
        return res.render("keep", {
          message: "노인 회원만 찜할 수 있습니다.",
          categories: []
        });
      }

      const sortBy = req.query.sortBy || "newest";
      let order;

      if (sortBy === "newest") {
        order = [["keepTime", "DESC"]];
      } else if (sortBy === "oldest") {
        order = [["keepTime", "ASC"]];
      }

      console.log('Order:', order);

      const keeps = await Keep.findAll({
        where: { seniorNum: user.memberNum },
        order: order
      });

      console.log('Keeps:', keeps);

      const profiles = [];

      for (const keep of keeps) {
        console.log('Processing keep:', keep);
        let profile = await StudentProfile.findOne({
          where: { stdNum: keep.stdNum },
          include: [{ model: Member, attributes: ['name'] }]
        });

        if (profile) {
          profile = profile.toJSON();
          profile.keepTime = keep.keepTime; // Attach the keep time to profile
          if (profile.profileImage) {
            profile.encodedImageBase64String = Buffer.from(profile.profileImage).toString('base64');
          } else {
            profile.encodedImageBase64String = '';
          }
          profiles.push(profile);
        }
      }

      console.log('Profiles to render:', profiles);

      res.render("keep", {
        categories: profiles,
        sortBy: sortBy,
        message: null
      });
    } catch (error) {
      console.log(`Error fetching keeps: ${error.message}`);
      next(error);
    }
  }
};
