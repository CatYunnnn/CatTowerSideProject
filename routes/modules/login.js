const express = require("express");
const passport = require("passport");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("login/loginPage", { style: "login/loginPage.css" });
});
router.post(
  "/",
  passport.authenticate("local", {
    failureRedirect: "/",
  }),
  (req, res) => {
    // console.log(local);
    res.redirect("/main");
  }
);
module.exports = router;
