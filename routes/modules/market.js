const express = require("express");
const router = express.Router();
const roleList = require("../../models/role");
const levelList = require("../../models/level");
const userList = require("../../models/user");
///////////////////////////////////////要改成json檔匯入
router.get("/", (req, res) => {
  let name = res.locals.user.name;
  let role = [];
  userList
    .findOne({ name })
    .then((user) => {
      role = user.role;
    })
    .then(() => {
      roleList
        .find()
        .lean()
        .sort({ id: 1 })
        .then((roles) => {
          roles.map((e) => {
            if (role.includes(e.id)) {
              e.have = 1;
            } else {
              e.have = 0;
            }
            return e;
          });
          res.render("market/market", {
            style: "market/market.css",
            roles,
          });
        });
    });
});
router.get("/rarity/:type", (req, res) => {
  let name = res.locals.user.name;
  let role = [];
  let type = req.params.type;
  console.log(type);
  userList
    .findOne({ name })
    .then((user) => {
      role = user.role;
    })
    .then(() => {
      roleList
        .find({ rarity: type })
        .lean()
        .sort({ id: 1 })
        .then((roles) => {
          roles.map((e) => {
            if (role.includes(e.id)) {
              e.have = 1;
            } else {
              e.have = 0;
            }
            return e;
          });
          res.render("market/market", {
            style: "market/market.css",
            roles,
          });
        });
    });
});
router.post("/add/:roleId", async (req, res) => {
  let id = req.params.roleId;
  let name = res.locals.user.name;
  let user = await userList.findOne({ name });
  user.role.push(id);
  await user.save();
  res.redirect("/market");
});
module.exports = router;
