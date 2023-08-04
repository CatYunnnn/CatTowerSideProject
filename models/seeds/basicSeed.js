const userList = require("../user");
const roleList = require("../role");
const levelList = require("../level");
const db = require("../../config/mongoose");
db.once("open", async () => {
  await userList.create({
    name: "guest",
    password: "000000",
    skills: [1, 2, 1, 1, 0, 3, 5, 1, 1, 2, 1, 1, 0, 3, 5, 1],
    defence: "3002011",
    role: [0],
    level: "0",
  });
  await roleList.create(
    {
      name: "橘貓",
      id: "0",
      HpTimes: "1",
      skills: [50, 0, 0, 0, 0, 150, 0, 0, 1000, 20, 0, 0, 0, 0, 0, 0],
      rarity: "N",
    },
    {
      name: "虎斑貓",
      id: "1",
      HpTimes: "1",
      skills: [60, 0, 0, 0, 0, 150, 0, 0, 1500, 20, 0, 0, 0, 0, 0, 0],
      rarity: "R",
    }
  );
  await levelList.create({
    name: "第一關",
    id: "0",
    skills: [1000, 0, 0, 0, 0, 0, 150, 0, 0, 20, 0, 0, 0, 0, 0, 0],
    spec: "0",
  });
  console.log("done");
  process.exit();
});
