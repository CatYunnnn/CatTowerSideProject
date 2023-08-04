const express = require("express");
const router = express.Router();
const roleList = require("../../models/role");
const levelList = require("../../models/level");
const userList = require("../../models/user");
const user = require("../../models/user");
let buyPage = 0;
let noMoney = 0;
let highest = 0;
let skill = 0;
router.get("/", (req, res) => {
  const { skills } = res.locals.user;
  let [
    atk,
    bleed,
    consist,
    penetrate,
    freeze,
    bigdmg,
    bigdmgdmg,
    add,
    hp,
    def,
    resist,
    shield,
    recovery,
    dodge,
    rebound,
    dmgresist,
  ] = skills;
  res.render("skill/skill", {
    style: "skill/skill.css",
    atk,
    bleed,
    consist,
    penetrate,
    freeze,
    bigdmg,
    bigdmgdmg,
    add,
    hp,
    def,
    resist,
    shield,
    recovery,
    dodge,
    rebound,
    dmgresist,
    buyPage,
    noMoney,
    highest,
    money: res.locals.user.money[1],
  });
  buyPage = 0;
  noMoney = 0;
  highest = 0;
});
router.get("/atkskills/:id", (req, res) => {
  skill = req.params.id;
  if (Number(res.locals.user.skills[skill]) >= 10) {
    highest = 1;
    return res.redirect("/skill");
  } else {
    buyPage = 1;
    res.redirect("/skill");
  }
});
router.get("/updateSkills/:choice", async (req, res) => {
  let choice = req.params.choice;
  if (choice === "yes") {
    let user = await userList.findOne({ name: res.locals.user.name });
    if (user.money[1] >= 3000) {
      user.money[1] -= 3000;
      user.skills[skill]++;
      await user.save();
    } else {
      noMoney = 1;
      return res.redirect("/skill");
    }
    return res.redirect("/skill");
  } else {
    return res.redirect("/skill");
  }
});
module.exports = router;
