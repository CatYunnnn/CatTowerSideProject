const express = require("express");
const roleList = require("../../models/role");
const levelList = require("../../models/level");
const userList = require("../../models/user");
const role = require("../../models/role");
const router = express.Router();
let id = 0;
router.get("/", (req, res) => {
  let name = res.locals.user.name;
  let ticket = res.locals.user.money[0];
  let money = res.locals.user.money[1];
  res.render("main/mainPage", {
    style: "main/mainPage.css",
    name,
    ticket,
    money,
  });
});
router.get("/goFight", (req, res) => {
  const temp = ["0", "1"];
  roleList
    .find({ id: { $in: temp } })
    .lean()
    .sort({ name: "asc" })
    .then((roles) => {
      res.render("main/goFight", { style: "main/goFight.css", roles: roles });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/fighting/:roleid", (req, res) => {
  id = req.params.roleid;
  res.render("main/fighting", {
    style: "main/fighting.css",
    script: "fighting.js",
    name: res.locals.user.name,
  });
});
//////////////////////////getdata
router.get("/getdata", async (req, res) => {
  let roleSkills = [];
  let mySkills = res.locals.user.skills;
  let level = 0;
  let data = {};
  await roleList
    .findOne({ id })
    .lean()
    .then((data) => {
      roleSkills = data.skills;
    });
  await levelList
    .findOne({ id: level })
    .lean()
    .then((data) => {
      let enemySkills = data.skills;
      data.mySkills = mySkills;
      data.roleSkills = roleSkills;
      data.enemySkills = enemySkills;
      res.send(data);
    })
    .catch((err) => {
      console.log(err);
    });
});
router.get("/winthegame", (req, res) => {
  userList
    .findOne({ name: res.locals.user.name })
    .then((user) => {
      user.level = Number(user.level) + 1;
      user.save();
    })
    .then(() => {
      res.redirect("/main");
    });
});
router.get("/lose", (req, res) => {
  userList
    .findOne({ name: res.locals.user.name })
    .then((user) => {
      user.money[1] = Number(user.money[1]) + 500;
      user.save();
    })
    .then(() => {
      res.redirect("/main");
    });
});
router.get("/win", (req, res) => {
  userList
    .findOne({ name: res.locals.user.name })
    .then((user) => {
      user.level = Number(user.level) + 1;
      user.money[1] = Number(user.money[1]) + 3000;
      user.save();
    })
    .then(() => {
      res.redirect("/main");
    });
});
module.exports = router;
