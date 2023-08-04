const me = document.querySelector("#myHpbar");
const enemy = document.querySelector("#enemyHpbar");
const outside = document.querySelector("#outside");
const info = document.querySelector(".info");
const log = document.querySelector(".log");
const battle = {
  dmgMake: function (atk, def, pen, resist) {
    def = (1 - pen / 100) * def;
    return Math.trunc(
      atk * (1 - Math.sqrt(def) / 2 / 100) * (1 - resist / 100)
    );
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
//////////////////////////////////////////get data
async function fetchData() {
  let response = await axios.get("/main/getdata");
  let data = response.data;
  let { mySkills, roleSkills, enemySkills } = data;
  for (let i = 0; i < roleSkills.length; i++) {
    roleSkills[i] = roleSkills[i] * (1 + mySkills[i] / 100);
    roleSkills[i] = Math.trunc(roleSkills[i]);
  }

  const mydata = {
    hp: roleSkills[8],
    fullhp: roleSkills[8],
    shield: roleSkills[11],
    dmg: battle.dmgMake(
      roleSkills[0],
      enemySkills[9],
      roleSkills[3],
      enemySkills[15]
    ),
    bleed: battle.bleedMake(roleSkills[0], roleSkills[1], enemySkills[10]),
    burn: battle.burnMake(roleSkills[8], roleSkills[2], enemySkills[10]),
    dodge: roleSkills[13],
    bigdmgrate: roleSkills[5],
    bigdmg: roleSkills[6],
    dizzy: roleSkills[4],
  };
  const enemydata = {
    hp: enemySkills[8],
    fullhp: enemySkills[8],
    shield: roleSkills[11],
    dmg: battle.dmgMake(
      enemySkills[0],
      roleSkills[9],
      enemySkills[3],
      roleSkills[15]
    ),
    bleed: battle.bleedMake(enemySkills[0], enemySkills[1], roleSkills[10]),
    burn: battle.burnMake(enemySkills[8], enemySkills[2], roleSkills[10]),
    dodge: enemySkills[13],
    dizzy: enemySkills[4],
  };
  //////////////////////////////////計算攻擊傷害
  let nowHp = 0;
  const battleLog = function (player, atk, def, type) {
    switch (type) {
      case "norm":
        if (player == enemy) {
          info.innerHTML += `<div id=${player}>對方受到${atk}點普通攻擊傷害，對方還剩下${def.hp}</div>`;
          nowHp = Math.trunc((def.hp / def.fullhp) * 100);
          player.style.backgroundImage = `linear-gradient(90deg, rgba(255, 255, 255, 1) calc(100% - ${nowHp}%), red calc(100% - ${nowHp}%),red 100%)`;
        } else {
          info.innerHTML += `<div id=${player}>你受到${atk}點普通攻擊傷害，你還剩下${def.hp}</div>`;
          nowHp = Math.trunc((def.hp / def.fullhp) * 100);
          player.style.backgroundImage = `linear-gradient(90deg, red ${nowHp}%, rgba(255, 255, 255, 1) ${nowHp}%, rgba(255, 255, 255, 1) 100%)`;
        }
        break;
      case "burn":
        if (player == enemy) {
          info.innerHTML += `<div id=${player}>對方受到${atk.dmg}點燃燒傷害，對方還剩下${def.hp}</div>`;
          nowHp = Math.trunc((def.hp / def.fullhp) * 100);
          player.style.backgroundImage = `linear-gradient(90deg, rgba(255, 255, 255, 1) calc(100% - ${nowHp}%), red calc(100% - ${nowHp}%),red 100%)`;
        } else {
          info.innerHTML += `<div id=${player}>你受到${atk.dmg}點燃燒傷害，你還剩下${def.hp}</div>`;
          nowHp = Math.trunc((def.hp / def.fullhp) * 100);
          player.style.backgroundImage = `linear-gradient(90deg, red ${nowHp}%, rgba(255, 255, 255, 1) ${nowHp}%, rgba(255, 255, 255, 1) 100%)`;
        }
        break;
      case "bleed":
        if (player == enemy) {
          info.innerHTML += `<div id=${player}>對方受到${atk.dmg}點流血傷害，對方還剩下${def.hp}</div>`;
          nowHp = Math.trunc((def.hp / def.fullhp) * 100);
          player.style.backgroundImage = `linear-gradient(90deg, rgba(255, 255, 255, 1) calc(100% - ${nowHp}%), red calc(100% - ${nowHp}%),red 100%)`;
        } else {
          info.innerHTML += `<div id=${player}>你受到${atk.dmg}點流血傷害，你還剩下${def.hp}</div>`;
          nowHp = Math.trunc((def.hp / def.fullhp) * 100);
          player.style.backgroundImage = `linear-gradient(90deg, red ${nowHp}%, rgba(255, 255, 255, 1) ${nowHp}%, rgba(255, 255, 255, 1) 100%)`;
        }
        break;
    }
  };
  const reduceHp = async function (atk, def, player) {
    let dmg = atk.dmg;
    let randomNum = Math.random();
    if (atk.bigdmgrate / 100 >= randomNum) {
      dmg = Math.trunc(dmg * (1 + atk.bigdmg / 100));
      if (def.shield > 0) {
        if (def.shield >= dmg) {
          def.shield -= dmg;
        } else {
          dmg -= def.shield;
          def.hp -= dmg;
          battleLog(player, dmg, def, "norm");
        }
      } else {
        def.hp -= dmg;
        battleLog(player, dmg, def, "norm");
      }
    } else {
      if (def.shield > 0) {
        if (def.shield >= atk.dmg) {
          def.shield -= atk.dmg;
        } else {
          atk.dmg -= def.shield;
          def.hp -= atk.dmg;
          battleLog(player, atk.dmg, def, "norm");
        }
      } else {
        def.hp -= atk.dmg;
        battleLog(player, atk.dmg, def, "norm");
      }
    }
    if (atk.burn > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      def.hp -= atk.burn;
      battleLog(player, atk, def, "burn");
    }
    if (atk.bleed > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      def.hp -= atk.bleed;
      battleLog(player, atk, def, "bleed");
    }
  };
  const test = (async function () {
    let temp = 0;
    while (temp < 50) {
      let randomNum = Math.random(); ///取機率
      if (randomNum <= enemydata.dodge / 100) {
        info.innerHTML += `<div>對方閃避掉了這次傷害</div>`;
      } else {
        await reduceHp(mydata, enemydata, enemy);
      }
      if (enemydata.hp <= 0) {
        log.innerHTML = `<div id="lose">You win !!!</div>`;
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      randomNum = Math.random();
      if (randomNum <= mydata.dodge / 100) {
        info.innerHTML += `<div>你閃避掉了這次傷害</div>`;
      } else {
        reduceHp(enemydata, mydata, me);
      }
      if (enemydata.hp <= 0) {
        log.innerHTML = `<div id="lose">You lose !!!</div>`;
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
      temp++;
    }
  })();
}
fetchData();
