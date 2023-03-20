const readline = require("readline-sync");
let gearArray = require("./armor");

// ---Characters/Props--- //
function Player(name) {
  this.name = name;
  this.hp = 25;
  this.maxhp = 25;
  this.level = 1;
  this.exp = 0;
  this.nextLevel = 25;
  this.equipped = {
    head: {},
    chest: {},
    legs: {},
  };
  this.inventory = [];
  this.isAlive = true;
  this.captainsKilled = [];
  this.attack = 10;
  this.armor = 0;
  this.prone = false;
}

function Captain(type, modifier, hp, level, attack, armor, expGiven) {
  this.type = type;
  this.modifier = modifier;
  this.hp = hp;
  // this.mp = mp;
  this.level = level;
  this.attack = attack;
  this.armor = armor;
  this.expGiven = expGiven;
  this.isAlive = true;
  this.prone = false;
}

function Armor(name, type, armor, slot, rarity) {
  this.name = name;
  this.type = type;
  this.armor = armor;
  this.slot = slot;
  this.rarity = rarity;
}

function checkLevelUp() {
  if (player.exp >= player.nextLevel) {
    player.level++;
    player.maxhp += Math.round((player.hp * level) / 8);
    player.hp = player.maxhp;
    player.nextLevel *= 1.8;
    console.clear(
      "***" + player.name + " has hit level " + player.level + "!***"
    );
  }
}

function getRandomNum(n) {
  let randomNumber = Math.floor(Math.random() * n);
  return parseInt(randomNumber);
}

function lootGenerator(enemy) {
  loot = [];
  itemRoll = getRandomNum(100);
  //adjustment for harder guys
  if (enemy.modifier === "Captain") {
    itemRoll += 60;
  } else if (enemy.modifier === "Lieutenant") {
    itemRoll += 20;
  }

  if (itemRoll < 50) {
    console.log("the " + enemy.type + " did not have anything to loot");
  } else if (itemRoll >= 50 && itemRoll <= 92) {
    if (itemRoll % 4 == 0) {
      //generate armor
      armor = getArmor();
      loot.push(armor);
    }
    return loot;
    //generate 1 item
  } else {
    //generate 2 -3 items
    for (i = 0; i < getRandomNum(4); i++) {
      if (getRandomNum(13) % 4 == 0) {
        //generate armor
        armor = getArmor();
        loot.push(armor);
      }
    }
    return loot;
  }
}

// /Armor(name, type, armor, slot, rarity)

function getArmor() {
  let uniqueRoll = getRandomNum(100);
  // console.log("unique roll in getArmor is " + uniqueRoll)
  let armorTemp = gearArray[getRandomNum(gearArray.length)];
  let goodNames = ["Sturdy", "Gleaming", "Comfortable", "Fitted"];
  let badNames = ["broken", "worn", "old", "used"];
  // if (uniqueRoll){
  if (uniqueRoll > 95) {
    name = "Epic " + armorTemp.name;
    armor = Math.round(
      armorTemp.armor + armorTemp.armor * (1 + getRandomNum(100) / 80)
    );
  } else if (uniqueRoll > 80 && uniqueRoll <= 95) {
    name = goodNames[getRandomNum(goodNames.length)] + " " + armorTemp.name;
    armor = Math.round(
      armorTemp.armor + armorTemp.armor * (1 + getRandomNum(100) / 200)
    );
  } else if (uniqueRoll < 20) {
    name = badNames[getRandomNum(badNames.length)] + " " + armorTemp.name;
    armor = Math.round(
      armorTemp.armor - armorTemp.armor * (1 + getRandomNum(100) / 300)
    );
    if (armor < 1) {
      armor = 1;
    }
  } else {
    name = armorTemp.name;
    armor = armorTemp.armor;
  }
  let gear = new Armor(
    name,
    armorTemp.type,
    armor,
    armorTemp.slot,
    armorTemp.rarity
  );
  return gear;
}

// ---ENEMIES---//

enemies = ["Kenpachi", "Renji", "Byakuya", "Shunsui", "Mayuri"];

function spawnEnemy() {
  let modifier = getModifier(getRandomNum(100));
  let type = enemies[getRandomNum(enemies.length)];
  let level = generateLevel(modifier);
  // hp = 5 * level;
  let hp = generateHP(level, modifier);
  let expGiven = Math.round(3.5 * level);
  let attack = Math.round(3 * level); //can make this more dynamic later
  let armor = 2 * level;
  let enemy = new Captain(type, modifier, hp, level, attack, armor, expGiven);
  let instance = false;
  combatEvent(enemy, instance);
}

function generateHP(level, mod) {
  baseHp = 7 * level;
  if (mod === "3rd Seat") {
    hp = (getRandomNum(100) / 100) * baseHp;
    if (hp < 2) {
      hp = 2;
    }
  } else if (mod === "Lieutenant") {
    hp = (getRandomNum(100) / 100) * level + baseHp;
  } else if (mod === "Captain") {
    hp = (getRandomNum(100) / 100) * (level * 1.5) + baseHp;
  } else {
    hp = ((getRandomNum(100) / 100) * level) / 4 + baseHp;
  }

  return Math.round(hp);
}

function generateLevel(mod) {
  level = 0;
  if (mod === "3rd Seat") {
    level = player.level - 2;
  } else if (mod === "2nd Seat") {
    chance = getRandomNum(100);
    if (chance <= 33) {
      level = player.level - 1;
    } else if (chance > 33 && chance <= 66) {
      level = player.level;
    } else {
      level = player.level + 1;
    }
  } else if (mod === "Lieutenant") {
    chance = getRandomNum(100);
    if (chance <= 50) {
      level = player.level + 1;
    } else {
      level = player.level + 2;
    }
  } else if (mod === "Captain") {
    chance = getRandomNum(100);
    if (chance <= 50) {
      level = player.level + 2;
    } else {
      level = player.level + 3;
    }
  }
  if (level < 1) {
    level = 1;
  }
  return level;
}

function getModifier(n) {
  // console.log("get modifier n:" + n)
  mod = "";
  if (n <= 30) {
    mod = "3rd Seat";
  } else if (n > 30 && n <= 65) {
    mod = "2nd Seat";
  } else if (n > 65 && n <= 95) {
    mod = "Lieutenant";
  } else {
    mod = "Captain";
  }
  return mod;
}
// ----COMBAT ---//

function equipLoot(items) {
  for (i = 0; i < items.length; i++) {
    items[i].type == "armor"
      ? console.log(
          "You have looted " + items[i].name + " Armor: " + items[i].armor
        )
      : console.log(
          "You have looted " + items[i].name + " Power:" + items[i].power
        );

    answer = readline.keyInYN("Would you like to equip " + items[i].name + "?");
    if (answer) {
      player.inventory.push(items[i]);
    }
  }
}

function playerAttack(enemy, proneEnemy, instance) {
  let move = readline.keyIn(
    "Press 'a' to attack!\nPress 'r' to attempt to run!\n",
    {
      limit: "ar",
    }
  );
  if (move === "a") {
    //do attack stuff
    proneModifier = 1;
    critModifier = 1;
    if (proneEnemy) {
      proneModifier = 2;
    }
    criticalRoll = getRandomNum(100);
    if (criticalRoll > 95) {
      console.log(player.name + " Scores a Critical Hit!!");
      critModifier = 1 + getRandomNum(100) / 100;
    }
    let attackVal = parseInt(
      (getRandomNum(100) / 100) * player.attack * proneModifier * critModifier
    );
    armorCheck = Math.round((getRandomNum(100) / 100) * enemy.armor);
    damage = attackVal - armorCheck;
    if (damage < 0) {
      damage = 0;
    }
    console.log(
      player.name +
        " attacks for " +
        damage +
        "\t(attackVal: " +
        attackVal +
        " armorCheck: " +
        armorCheck +
        ")\n"
    );
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
      enemy.isAlive = false;
      console.log(
        "***You have defeated the " + enemy.modifier + " " + enemy.type + "!***"
      );
      killedEnemy(enemy);
    }
    return false;
  } else {
    if (instance) {
      console.log("You cannot run away in here!");
    } else {
      runCheck = getRandomNum(100);
      if (runCheck > 50) {
        console.log("You flee from battle!\n");
        escapeBattle(enemy);
      } else {
        console.log("Nice try ryoka, not this time!\n");
      }
    }
  }
}

function enemyAttack(prone, enemy) {
  if (enemy.isAlive) {
    let attackVal = 0;
    critModifier = 1;
    criticalRoll = getRandomNum(100);
    if (criticalRoll > 95) {
      console.log(enemy.type + " Scores a Critical Hit!!");
      critModifier = 1 + getRandomNum(100) / 100;
    }
    if (prone === true) {
      attackVal = parseInt(
        (getRandomNum(100) / 100) * enemy.attack * 2 * critModifier
      );
    } else {
      attackVal = parseInt(
        (getRandomNum(100) / 100) * enemy.attack * critModifier
      );
    }
    armorCheck = Math.round((getRandomNum(100) / 100) * player.armor);
    damage = attackVal - armorCheck;

    if (damage < 0) {
      damage = 0;
    }
    console.log(
      enemy.modifier +
        " " +
        enemy.type +
        " attacks for " +
        damage +
        "\t(attackVal: " +
        attackVal +
        " armorCheck: " +
        armorCheck +
        ")\n"
    );
    player.hp -= damage;
    if (player.hp <= 0) {
      player.isAlive = false;
      playerDead(player);
    }
  }
}

function escapeBattle(enemy) {
  enemy.isAlive = false;
}

function playerDead(player) {
  console.log(player.name + " has died...");
  console.log("Level attained: " + player.level);
  console.log("Enemies Killed: " + player.captainsKilled.length);
  for (i = 0; i < player.equipped.length; i++) {
    console.log("Equipment: " + player.equipped[i]);
  }
  module.exports.player = player;
}

function killedEnemy(enemy) {
  player.captainsKilled.push(enemy);
  player.exp += enemy.expGiven;
  console.log(player.name + " gained " + enemy.expGiven + " exp!");
  checkLevelUp();
  items = lootGenerator(enemy);
  if (items) {
    equipLoot(items);
  }
}

function combatEvent(enemy, instance) {
  let sucessfulRun = false;
  let combatRoll = getRandomNum(100);
  let firstMove = true;
  let pronePlayer = false;
  let proneEnemy = false;
  console.clear(
    "You have encountered a " + enemy.modifier + " " + enemy.type + "!"
  );
  while (player.isAlive && enemy.isAlive) {
    if (firstMove) {
      firstMove = false;
      if (combatRoll < 10) {
        console.log(
          "You have been surprised by the " + enemy.modifier + " " + enemy.type
        );
        pronePlayer = true;
      } else if (combatRoll > 90) {
        console.log(
          "You have snuck up on a " + enemy.modifier + " " + enemy.type
        );
        proneEnemy = true;
      }
    }

    //player attack
    console.log(player.name + " HP:" + player.hp);
    console.log(
      "level " +
        enemy.level +
        " " +
        enemy.modifier +
        " " +
        enemy.type +
        " HP:" +
        enemy.hp
    );

    if (combatRoll >= 50) {
      successfulRun = playerAttack(enemy, proneEnemy, instance);
      if (enemy.isAlive) {
        enemyAttack(pronePlayer, enemy);
        proneEnemy = false;
      }
    } else {
      enemyAttack(pronePlayer, enemy);
      if (player.isAlive) {
        successfulRun = playerAttack(enemy, proneEnemy);
        pronePlayer = false;
      }
    }

    //captain attack
  }
}

//---Main Game & Loop ---//
let instances = [
  "Sokyoku Hill",
  "Central 46",
  "Zaraki District",
  "Shino Academy",
];

function generateEvent() {
  let randomNumber = getRandomNum(100);

  if (randomNumber <= 33) {
    spawnEnemy();
  }
  if (randomNumber > 33 && randomNumber < 37) {
    instanceType = instances[getRandomNum(instances.length)];
    let response = readline.keyInYN(
      "You encounter a " + instanceType + " Do you investigate further?"
    );
    if (response) {
      generateInstance(instanceType);
    } else {
      console.log("You back away slowly...");
    }
  } else if (randomNumber > 82 && randomNumber <= 100) {
    incrementHealth();
  }
}

function incrementHealth() {
  if (player.hp < player.maxhp) {
    //raise health
    player.hp += 1;
    console.log("hp up! hp is now " + player.hp);
  } else {
    //max health reached
  }
}

function getUserInput() {
  response = "";
  while (response != "w") {
    response = readline.keyIn(
      "Press 'w' to continue on your journey...\nPress 'i' for Soul Reaper status\n",
      { limit: "wiq" }
    );
    if (response === "i") {
      battleStats();
    }
    if (response === "q") {
      player.isAlive = false;
    }
  }
  return response;
}

function battleStats() {
  console.log(
    player.name +
      "\nHP: " +
      player.hp +
      "\nMaxHP: " +
      player.maxhp +
      "\nLevel: " +
      player.level +
      "\nExp :" +
      player.exp +
      "\nNext Level: " +
      player.nextLevel
  );
}

// ---Actual Game Commands---//
let name = readline.question(
  "You have no business here in The Soul Society! what is your name ryoka? "
);

let player = new Player(name);

console.log(
  "---------- \nYou are a Substitute Soul Reaper, who obatained the power by having a another Soul Reaper thrust their Zanpakuto into your chest. You are now in The Soul Society to save the Soul Reaper turn friend Rukia, who gave you this power, from execution. Get  to Sokyoku Hill and save her from the clutches of death!\n----------"
);

let begin = readline.keyIn("Press 'w' to continue\n", { limit: "w" });

while (player.isAlive) {
  getUserInput();
  generateEvent();
}
