const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("front/frontPage", { style: "frontPage.css" });
});
module.exports = router;
