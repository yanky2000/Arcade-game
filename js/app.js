var enemyNumberTotal = 3;
var allEnemies = [];
var allFriends = [];
var allGems = [];

var rawLocations = [-25, 55, 135, 215, 295, 375];
var columnLocations = [0, 100, 200, 300, 400];
var rawStart = rawLocations[5];
var colStart = columnLocations[2];
var rawTop = rawLocations[0];
var rawEndPoint = columnLocations[4];
var rawStartPoint = columnLocations[0];

var bugCount = 0;
var timeForFriend;
var score = 0,
    scoreRecord = 0;

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
    this.x = rawStartPoint;
    this.y = rawLocations[randomInteger(1, 3)];
    this.speed = randomInteger(1, 4);
    this.sprite = 'images/enemy-bug.png';
};


//This should maintain certain number of bugs in games
Enemy.prototype.update = function(dt) {
    if (this.x > rawEndPoint) { //end of raw
        if (allEnemies.length <= enemyNumberTotal) {
            this.x = rawStartPoint;
            this.y = rawLocations[randomInteger(1, 3)];
            this.speed = randomInteger(1, 4);
        } else {
            allEnemies.splice(find(allEnemies, this), 1);
        }

        //Number of bugs used as a time concept for Princess creation.
        bugCount++;
        if (bugCount == timeForFriend) {
            createFriend();
        }
    }

    this.x = this.x + this.speed * dt * 100;
};

Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Function below is used in 2 ways:
//- to create total number of enemies at the start of the game,
//- to add certain given num of enemies, when needed.
var createEnemy = function(num) {
    for (i = enemyNumberTotal - num; i < enemyNumberTotal; i++) {
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
    if (this.x > rawEndPoint) {
        friendSetTimer();
        allFriends = [];
    }

    this.x = this.x + this.speed * dt * 100;
};

var createFriend = function() {
    var friend = new Friend();
    allFriends.push(friend);
};

var friendSetTimer = function() {
    timeForFriend = bugCount + randomInteger(3, 12);
};

//Player related code. Player starts from the center of the bottom raw
var goToStart = function() {
    this.x = colStart;
    this.y = rawStart;
};

var player = function() {
    goToStart.call(this);
    this.sprite = playerSprites[randomInteger(0, 3)];
};

player.prototype.update = function() {
    //When player reaches the water, and game restarts with 1 more enemy
    if (this.y == rawTop) {
        this.y = rawStart;
        enemyNumberTotal++;
        createEnemy(1);
        score += 50;
    }

    //BUG hits the player
    for (var i = 0; i < allEnemies.length; i++) {
        if (collision(this.x, this.y, allEnemies[i].x, allEnemies[i].y)) {
            goToStart.call(this);
            if (score > 0) {
                score -= 5;
            }
        }
    }

    //player picks up gem and scores
    for (i = 0; i < allGems.length; i++) {
        if (collision(this.x, this.y, allGems[i].x, allGems[i].y)) {
            switch (allGems[i].sprite) {
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

            if (enemyNumberTotal > 3) { //At least 3 bugs in the game
                enemyNumberTotal -= 1;
            }
        }
    }

    //if player meets Friend, gem appears
    for (i = 0; i < allFriends.length; i++) {
        if (collision(this.x, this.y, allFriends[i].x, allFriends[i].y)) {
            allFriends = [];
            new Gem();
        }
    }
};

player.prototype.handleInput = function(moveDirection) {
    switch (moveDirection) {
        case 'left':
            if (this.x > rawStartPoint) {
                this.x -= 100;
            }
            break;

        case 'right':
            if (this.x < rawEndPoint) {
                this.x += 100;
            }
            break;

        case 'up':
            if (this.y > rawTop) {
                this.y -= 80;
            }
            break;

        case 'down':
            if (this.y < rawStart) {
                this.y += 80;
            }
    }
};

player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Gem code goes here:
var Gem = function() {
    this.x = columnLocations[randomInteger(0, 4)];
    this.y = rawLocations[randomInteger(1, 5)];
    this.sprite = gemSprites[randomInteger(0, 2)];
    allGems.push(this);
};

Gem.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Helper function for randomizing
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}

//Collision check
var collision = function(playerX, playerY, x2, y2) {
    var circle1 = {
        radius: 20,
        x: playerX,
        y: playerY
    };
    var circle2 = {
        radius: 20,
        x: x2,
        y: y2
    };
    var dx = circle1.x - circle2.x;
    var dy = circle1.y - circle2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < circle1.radius + circle2.radius) {
        return true;
    }
    return false;
};

//Player score and score's record goes here.
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

var player = new player();
createEnemy(enemyNumberTotal);
createFriend();