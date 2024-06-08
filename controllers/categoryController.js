const { Op, Sequelize } = require("sequelize");
const SeniorProfile = require("../models/seniorProfile");
const StudentProfile = require("../models/studentProfile");
const Member = require("../models/member");

const sortOptions = {
  rating: ["score", "DESC"],
  matchingCount: ["matchingCount", "DESC"],
  recentMatching: ["recentMatchingTime", "DESC"],
  recentJoin: ["creationTime", "DESC"],
  lowPrice: [Sequelize.literal("CASE WHEN desiredAmount = '무료' THEN 0 ELSE CAST(desiredAmount AS UNSIGNED) END"), "ASC"],
  highPrice: [Sequelize.literal("CASE WHEN desiredAmount = '무료' THEN 0 ELSE CAST(desiredAmount AS UNSIGNED) END"), "DESC"]
};

// Helper function to calculate time difference
function getTimeDifference(date) {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays > 180) return "6개월";
  if (diffMonths > 0) return diffMonths + "개월";
  if (diffDays > 0) return diffDays + "일";
  if (diffHours > 0) return diffHours + "시간";
  return diffMins + "분";
}

module.exports = {
  index: async (req, res, next) => {
    try {
      const { region, city, gender, amount, day, time, sortBy } = req.query;
      const order = sortOptions[sortBy] || sortOptions.rating;
      const filterConditions = {};

      if (region) filterConditions.sido = region;
      if (city) filterConditions.gu = city;
      if (gender && gender !== "전체") filterConditions.gender = gender === "남성" ? "남성" : "여성";
      if (amount) filterConditions.desiredAmount = { [Op.lte]: amount };
      if (day) filterConditions.availableDay = day;
      if (time) filterConditions.availableTime = time;

      console.log('Filter conditions:', filterConditions);

      let profiles = [];
      const user = req.user;

      if (user.userType === 'student') {
        profiles = await SeniorProfile.findAll({
          where: filterConditions,
          include: [{
            model: Member,
            attributes: ['name'],
            required: false // left join
          }],
          order: [order]
        });
      } else if (user.userType === 'senior') {
        profiles = await StudentProfile.findAll({
          where: filterConditions,
          include: [{
            model: Member,
            attributes: ['name'],
            required: false // left join
          }],
          order: [order]
        });
      } else {
        return res.redirect("/main");
      }

      // Calculate time differences and encode image
      profiles = profiles.map(profile => {
        profile = profile.toJSON();
        profile.recentMatchingTimeDifference = getTimeDifference(profile.recentMatchingTime);
        profile.creationTimeDifference = getTimeDifference(profile.creationTime);
        if (profile.profileImage) {
          profile.encodedImageBase64String = Buffer.from(profile.profileImage).toString('base64');
        } else {
          profile.encodedImageBase64String = '';
        }
        return profile;
      });

      console.log('Profiles:', profiles);

      res.render("category", {
        categories: profiles,
        isSenior: user.userType === 'senior',
        isStudent: user.userType === 'student',
        sortBy: sortBy || 'rating'
      });
    } catch (error) {
      console.log(`Error filtering profiles: ${error.message}`);
      next(error);
    }
  },

  show: async (req, res, next) => {
    try {
      const id = req.params.id;
      const user = req.user;
      let profile = null;
      let isSenior = false;
      let isStudent = false;

      if (user.userType === 'student') {
        profile = await SeniorProfile.findOne({
          where: { seniorNum: id },
          include: [{
            model: Member,
            attributes: ['name']
          }]
        });
        isSenior = true;
      } else if (user.userType === 'senior') {
        profile = await StudentProfile.findOne({
          where: { stdNum: id },
          include: [{
            model: Member,
            attributes: ['name']
          }]
        });
        isStudent = true;
      } else {
        return res.redirect("/main");
      }

      if (profile) {
        profile = profile.toJSON();
        profile.recentMatchingTimeDifference = getTimeDifference(profile.recentMatchingTime);
        profile.creationTimeDifference = getTimeDifference(profile.creationTime);
        if (profile.profileImage) {
          profile.encodedImageBase64String = Buffer.from(profile.profileImage).toString('base64');
        } else {
          profile.encodedImageBase64String = '';
        }
      }

      res.render("detailedProfile", {
        profile: profile,
        isSenior: isSenior,
        isStudent: isStudent,
        user: user
      });
    } catch (error) {
      console.log(`Error fetching profile details: ${error.message}`);
      next(error);
    }
  },

  new: (req, res) => {
    res.render('categories/new');
  },

  create: async (req, res, next) => {
    try {
      const category = await Category.create(req.body);
      res.locals.redirect = `/categories/${category.id}`;
      next();
    } catch (error) {
      console.log(`Error creating category: ${error.message}`);
      next(error);
    }
  },

  showView: (req, res) => {
    res.render('categories/show');
  },

  edit: async (req, res, next) => {
    try {
      const category = await Category.findByPk(req.params.id);
      res.render('categories/edit', { category });
    } catch (error) {
      console.log(`Error fetching category: ${error.message}`);
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      await Category.update(req.body, {
        where: { id: req.params.id }
      });
      res.locals.redirect = `/categories/${req.params.id}`;
      next();
    } catch (error) {
      console.log(`Error updating category: ${error.message}`);
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      await Category.destroy({
        where: { id: req.params.id }
      });
      res.locals.redirect = "/categories";
      next();
    } catch (error) {
      console.log(`Error deleting category: ${error.message}`);
      next(error);
    }
  },

  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  }
};
