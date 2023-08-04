const me = document.querySelector("#myHpbar"); ////myhpbar
const enemy = document.querySelector("#enemyHpbar"); ///enemyhpbar
const myShield = document.querySelector(".shieldbar");
const enemyShield = document.querySelector(".shieldbarright");
const myHpCount = document.querySelector(".hp");
const enemyHpCount = document.querySelector(".hpright");
const myShieldCount = document.querySelector(".shield");
const enemyShieldCount = document.querySelector(".shieldright");
const roundCount = document.querySelector(".round");
const info = document.querySelector(".info");
const log = document.querySelector(".log");
const result = document.querySelector("#outside");
const battle = {
  dmgMake: function (atk, def, pen, resist) {
    def = (1 - pen / 100) * def;
    return Math.trunc(
      atk * (1 - Math.sqrt(def) / 2 / 100) * (1 - resist / 100)
    );
  },
  bigdmg: function (atk, bigdmg) {
    return Math.trunc(atk * (1 + bigdmg / 100));
  },
  bleedMake: function (atk, blood, resist) {
    ///流血
    return atk * (blood / 100) * (1 - resist / 100);
  },
  burnMake: function (hp, burning, resist) {
    ///燃燒
    return hp * (burning / 100) * (1 - resist / 100);
  },
  bloods: function (shield, dmg, bloods) {
    ///吸血
    if (dmg - shield > 0) {
      return ((dmg - shield) * bloods) / 100;
    }
  },
};
async function fighting() {
  //////////////////拿取基本資料
  let response = await axios.get("/main/getdata");
  let data = response.data;
  let { mySkills, roleSkills, enemySkills } = data;
  for (let i = 0; i < roleSkills.length; i++) {
    roleSkills[i] = roleSkills[i] * (1 + mySkills[i] / 100);
    roleSkills[i] = Math.trunc(roleSkills[i]);
  }
  //////////////////重構基本資料
  const mydata = {
    hp: roleSkills[8],
    fullhp: roleSkills[8],
    shield: roleSkills[11],
    fullShield: roleSkills[11],
    dmg: battle.dmgMake(
      roleSkills[0],
      enemySkills[9],
      roleSkills[3],
      enemySkills[15]
    ),
    bleed: battle.bleedMake(roleSkills[0], roleSkills[1], enemySkills[10]),
    burn: battle.burnMake(roleSkills[8], roleSkills[2], enemySkills[10]),
    dodge: roleSkills[13] / 100,
    bigdmgrate: roleSkills[5] / 100,
    bigdmg: battle.bigdmg(roleSkills[0], roleSkills[6]),
    dizzy: roleSkills[4] / 100,
    recovery: roleSkills[12],
    thorn: roleSkills[14],
    isdizzing: 0,
  };
  const enemydata = {
    hp: enemySkills[8],
    fullhp: enemySkills[8],
    shield: enemySkills[11],
    fullShield: enemySkills[11],
    dmg: battle.dmgMake(
      enemySkills[0],
      roleSkills[9],
      enemySkills[3],
      roleSkills[15]
    ),
    bleed: battle.bleedMake(enemySkills[0], enemySkills[1], roleSkills[10]),
    burn: battle.burnMake(enemySkills[8], enemySkills[2], roleSkills[10]),
    dodge: enemySkills[13] / 100,
    bigdmgrate: enemySkills[5] / 100,
    bigdmg: battle.bigdmg(enemySkills[0], enemySkills[6]),
    dizzy: enemySkills[4] / 100,
    recovery: enemySkills[12],
    thorn: enemySkills[14],
    isdizzing: 0,
  };
  if (mydata.shield > 0) {
    myShield.style.backgroundColor = `rgb(56, 188, 245)`;
    console.log("ouo");
  }
  if (enemydata.shield > 0) {
    enemyShield.style.backgroundColor = `rgb(56, 188, 245)`;
  }
  const battlelog = function (attacker, attacked, dmg, def, type) {
    let id = type;
    let hp = 0;
    let shield = 0;
    switch (type) {
      case "norm":
        type = "普通攻擊";
        break;
      case "bigdmg":
        type = "爆擊";
        break;
      case "burn":
        type = "燒傷";
        break;
      case "bleed":
        type = "流血";
        break;
    }
    //////////如果有護盾
    if (def.shield > 0) {
      if (dmg > def.shield) {
        dmg = dmg -= def.shield;
        def.shield = 0;
      } else {
        def.shield -= dmg;
      }
    } else {
      def.hp -= dmg;
    }
    /////////戰鬥日誌
    info.innerHTML += `<div class="attacklog">${attacker}對${attacked}造成${dmg}點<div id=
      "${id}">${type}</div>傷害</div>`;
    hp = Math.trunc((def.hp / def.fullhp) * 100);
    shield = Math.trunc((def.shield / def.fullShield) * 100);
    if (attacker === "你") {
      enemy.style.backgroundImage = `linear-gradient(90deg,gray calc(100% - ${hp}%), red calc(100% - ${hp}%),red 100%)`;
      if (enemydata.shield > 0)
        enemyShield.style.backgroundImage = `linear-gradient(90deg,gray calc(100% - ${shield}%), rgb(56, 188, 245) calc(100% - ${shield}%),rgb(56, 188, 245) 100%)`;
    } else {
      me.style.backgroundImage = `linear-gradient(90deg, red ${hp}%, gray ${hp}%,gray 100%)`;
      if (mydata.shield > 0)
        myShield.style.backgroundImage = `linear-gradient(90deg, rgb(56, 188, 245) ${shield}%, gray ${shield}%,gray 100%)`;
    }
  };
  /////////////////計算扣血
  const reduceHp = async function (attacker, attacked, atk, def) {
    if (atk.isdizzing === 1) {
      info.innerHTML += `<div>${attacker}處於暈眩狀態，無法攻擊</div>`;
      atk.isdizzing = 0;
      return 0;
    }
    let randomNum = Math.random();
    //////////////計算閃避
    if (def.dodge >= randomNum) {
      attacker === "你"
        ? (info.innerHTML += `<div>${attacked}閃避了你的傷害</div>`)
        : (info.innerHTML += `<div>你閃避了${attacker}的傷害</div>`);
    } else {
      ////////////計算是否爆擊
      atk.bigdmgrate >= randomNum
        ? battlelog(attacker, attacked, atk.bigdmg, def, "bigdmg")
        : battlelog(attacker, attacked, atk.dmg, def, "norm");
      myShieldCount.textContent = mydata.shield;
      myHpCount.textContent = mydata.hp;
      enemyShieldCount.textContent = enemydata.shield;
      enemyHpCount.textContent = enemydata.hp;
    }
    /////////////////燒傷
    if (atk.burn > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      battlelog(attacker, attacked, atk.burn, def, "burn");
      myShieldCount.textContent = mydata.shield;
      myHpCount.textContent = mydata.hp;
      enemyShieldCount.textContent = enemydata.shield;
      enemyHpCount.textContent = enemydata.hp;
    }
    /////////////////流血
    if (atk.bleed > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      battlelog(attacker, attacked, atk.bleed, def, "bleed");
      myShieldCount.textContent = mydata.shield;
      myHpCount.textContent = mydata.hp;
      enemyShieldCount.textContent = enemydata.shield;
      enemyHpCount.textContent = enemydata.hp;
    }
    /////////////////暈眩
    if (atk.dizzy >= randomNum) {
      def.isdizzing = 1;
    }
  };
  const battleStart = (async function () {
    let round = 1;
    while (round < 50) {
      roundCount.textContent = `ROUND ${round}`;
      await reduceHp("你", "壞狗狗軍團", mydata, enemydata);
      if (enemydata.hp <= 0) {
        result.innerHTML = `<div id="result"><h2>You win !!!</h2><a href="/main/win">回到首頁</a></div>`;
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await reduceHp("壞狗狗軍團", "你", enemydata, mydata);
      if (mydata.hp <= 0) {
        result.innerHTML = `<div id="result">You lose !!!<a href="/main/lose">回到首頁</a></div>`;
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      round++;
    }
  })();
}
fighting();
