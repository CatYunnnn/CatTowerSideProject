const express = require("express");
const mongoose = require("mongoose");
const db = require("./config/mongoose");
const session = require("express-session");
const usePassport = require("./config/passport");
const exphbs = require("express-handlebars");
const port = 3000;
const app = express();
const routes = require("./routes");
app.engine("hbs", exphbs.engine({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");
app.use(express.static("public"));
app.use(
  session({
    secret: "capybara",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.urlencoded({ extended: true })); ///body-Parser
usePassport(app);
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use(routes);
app.listen(port, () => {
  console.log(`express is running on http://localhost:${port}`);
});
