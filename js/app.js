var enemyNumberTotal = 3;
var allEnemies = [];
var allFriends = [];
var allGems = [];

var rawLocations = [-25, 55, 135, 215, 295, 375];
var columnLocations = [0, 100, 200, 300, 400];

var bugCount = 0;
var timeForFriend;
var score = 0, scoreRecord = 0;

var playerSprites = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png',
    'images/char-pink-girl.png'
    ];

var gemSprites = [
    'images/Gem Blue.png',
    'images/Gem Green.png',
    'images/Gem Orange.png'
    ];

// Enemies our player must avoid
var Enemy = function() {
    this.x = 0;
    this.y = rawLocations[randomInteger(1,3)];
    this.speed = randomInteger(1,4);
    this.sprite = 'images/enemy-bug.png';
};


//When enemy reaches raw end, it reappears on another randomized line.
Enemy.prototype.update = function(dt) {
    if (this.x > 500) {
        if (allEnemies.length <= enemyNumberTotal) {//Respawn bug code
            this.x = columnLocations[0];
            this.y = rawLocations[randomInteger(1,3)];
            this.speed = randomInteger(1,4);
        }
        else {
            allEnemies.splice(find(allEnemies, this), 1);
        };

        bugCount++;
        if (bugCount == timeForFriend) {
            createFriend();
        };
    };

    this.x = this.x + this.speed * dt * 100;
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

var createEnemy = function(num) {
    for (i = enemyNumberTotal - num; i < enemyNumberTotal ; i++) {
        allEnemies.push(new Enemy());
    }
};

//Friends code goes here:
var Friend = function() {
    Enemy.call(this);
    this.sprite = 'images/char-princess-girl.png';
};

Friend.prototype = Object.create(Enemy.prototype);
Friend.prototype.constructor = Enemy;

Friend.prototype.update = function(dt) {
    if (this.x > 500) {
      friendSetTimer();
      allFriends=[];
    };

    this.x = this.x + this.speed * dt *100;
};

var createFriend = function() {
    var friend = new Friend;
    allFriends.push(friend);
};

var friendSetTimer = function() {
    timeForFriend = bugCount + randomInteger(3,12);
};

//Player related code
var player = function() {
    this.x = 200;
    this.y = 375;
    this.sprite = playerSprites[randomInteger(0,3)];
};

player.prototype.update = function() {
    //When player reaches the water, game restarts with 1 more enemy
    if (this.y == rawLocations[0]) {
        this.y = 375;
        enemyNumberTotal++;
        createEnemy(1);
        score += 50;
    };

    //When bug hits player, player goes back to start position
    for (var i= 0; i < allEnemies.length; i++) {
        if (collision(this.x, this.y, allEnemies[i].x, allEnemies[i].y)) {
            this.x = 200;
            this.y = 375;
            if (score > 0) {
                score -= 5;
            };
            // if (enemyNumberTotal > 3) {
            //     enemyNumberTotal -= 1;
            // }
        }
    };

    //player picks up gem and scores
    for (var i= 0; i < allGems.length; i++) {
        if (collision(this.x, this.y, allGems[i].x, allGems[i].y)) {
            switch(allGems[i].sprite) {
                case 'images/Gem Blue.png':
                    score += 35;
                    break;
                case 'images/Gem Green.png':
                    score += 20;
                    break;
                case 'images/Gem Orange.png':
                    score += 15;
            }
            allGems.splice(i, 1);
            friendSetTimer();
            if (enemyNumberTotal > 3) {//TODO: Replace 3 with some variable
                enemyNumberTotal -= 1;
            }
        }
    };

    //if player meets Friend, gem appears
    for (var i= 0; i < allFriends.length; i++) {
        if (collision(this.x, this.y, allFriends[i].x, allFriends[i].y)) {
          allFriends=[];
          new Gem();
        }
    }
};

player.prototype.handleInput = function(moveDirection) {
    switch(moveDirection) {
        case 'left':
            if (this.x > 0) {
                this.x = this.x -100;
        }
        break;

        case 'right':
            if (this.x < 400) {
                this.x = this.x + 100;
        }
        break;

        case 'up':
            if (this.y > -25) {
                this.y = this.y - 80;
        }
        break;

        case 'down':
            if (this.y < 375) {
                this.y = this.y + 80;
        }
    }
};

player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Gem code goes here:
var Gem = function() {
  this.x = columnLocations[randomInteger(0,4)];
  this.y = rawLocations[randomInteger(1,5)];
  this.sprite = gemSprites[randomInteger(0,2)];
  allGems.push(this);
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Actual creation of player, enemies, friends
var player = new player();
createEnemy(enemyNumberTotal);
createFriend();

//Helper function for randomizing
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

//Collision check
var collision = function(playerX, playerY, x2, y2) {
  var circle1 = {radius: 20, x: playerX, y: playerY};
  var circle2 = {radius: 20, x: x2, y: y2};
  var dx = circle1.x - circle2.x;
  var dy = circle1.y - circle2.y;
  var distance = Math.sqrt(dx * dx + dy * dy);
  if (distance < circle1.radius + circle2.radius) {
      return true;
  }
  return false;
};


// Code below is to keep track of score and to display it
var scoreUpdate = function() {
    if (score > scoreRecord) {
        scoreRecord = score;
    }
};

var renderScore = function() {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16pt Arial";
    ctx.textAlign = "end";
    ctx.fillText("Player: " + score, 450, 80);
    ctx.fillText("Record: " + scoreRecord, 450, 105);
};

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
