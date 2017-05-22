var app = app || {
    enemyNumberTotal: 3,
    allEnemies: [],
    allFriends: [],
    allGems: [],
    coords: {
        raws: [-25, 55, 135, 215, 295, 375],
        columns: [0, 100, 200, 300, 400],
    },
    bugCount: 0,
    timeForFriend: 0,
    score: 0,
    scoreRecord: 0,
    sprites: {
        player: [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png'
        ],
        gem: [
            'images/Gem Blue.png',
            'images/Gem Green.png',
            'images/Gem Orange.png'
        ], 
        friend: ['images/char-princess-girl.png'],
        enemy: ['images/enemy-bug.png'],
    },
};


var rawStart = app.coords.raws[5];
var colStart = app.coords.columns[2];
var rawTop = app.coords.raws[0];
var rawEndPoint = app.coords.columns[4];
var rawStartPoint = app.coords.columns[0];


// Enemies our player must avoid
var Enemy = function () {
    this.x = rawStartPoint;
    this.y = app.coords.raws[randomInteger(1, 3)];
    this.speed = randomInteger(1, 4);
    this.sprite = app.sprites.enemy[0];
};


//This should maintain certain number of bugs in the game
Enemy.prototype.update = function (dt) {
    if (this.x > rawEndPoint) { //end of raw
        if (app.allEnemies.length <= app.enemyNumberTotal) {
            this.x = rawStartPoint;
            this.y = app.coords.raws[randomInteger(1, 3)];
            this.speed = randomInteger(1, 4);
        } else {
            app.allEnemies.splice(find(app.allEnemies, this), 1);
        }

        //Number of bugs used as a time concept for Princess creation.
        app.bugCount++;
        if (app.bugCount == app.timeForFriend) {
            createFriend();
        }
    }

    this.x = this.x + this.speed * dt * 100;
};


Enemy.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Function below is used in 2 ways:
//- to create total number of enemies at the start of the game,
//- to add certain given num of enemies, when needed.
var createEnemy = function (num) {
    for (var i = app.enemyNumberTotal - num; i < app.enemyNumberTotal; i++) {
        app.allEnemies.push(new Enemy());
    }
};


//Friends code goes here:
var Friend = function () {
    Enemy.call(this);
    this.sprite = app.sprites.friend[0];
};


Friend.prototype = Object.create(Enemy.prototype);
Friend.prototype.constructor = Enemy;

Friend.prototype.update = function (dt) {
    if (this.x > rawEndPoint) {
        friendSetTimer();
        app.allFriends = [];
    }
    this.x = this.x + this.speed * dt * 100;
};


var createFriend = function () {
    var friend = new Friend();
    app.allFriends.push(friend);
};


var friendSetTimer = function () {
    app.timeForFriend = app.bugCount + randomInteger(3, 12);
};


//Player related code. Player starts from the center of the bottom raw
var goToStart = function () {
    this.x = colStart;
    this.y = rawStart;
};


var player = function () {
    goToStart.call(this);
    this.sprite = app.sprites.player[randomInteger(0, 3)];
    // this.sprite = 'images/char-girl.png';
};


player.prototype.update = function () {
    //When player reaches the water, and game restarts with 1 more enemy
    if (this.y == rawTop) {
        this.y = rawStart;
        app.enemyNumberTotal++;
        createEnemy(1);
        app.score += 50;
    }

    //BUG hits the player
    for (var i = 0; i < app.allEnemies.length; i++) {
        if (collision(this.x, this.y, app.allEnemies[i].x, app.allEnemies[i].y)) {
            goToStart.call(this);
            if (app.score > 0) {
                app.score -= 5;
            }
        }
    }

    //player picks up gem and app.scores
    for (i = 0; i < app.allGems.length; i++) {
        if (collision(this.x, this.y, app.allGems[i].x, app.allGems[i].y)) {
            switch (app.allGems[i].sprite) {
                // case 'images/Gem Blue.png':
                case app.sprites.gem[0]:
                    app.score += 35;
                    break;
                // case 'images/Gem Green.png':
                case app.sprites.gem[1]:
                    app.score += 20;
                    break;
                // case 'images/Gem Orange.png':
                case app.sprites.gem[2]:
                    app.score += 15;
            }
            app.allGems.splice(i, 1);
            friendSetTimer();

            if (app.enemyNumberTotal > 3) { //At least 3 bugs in the game
                app.enemyNumberTotal -= 1;
            }
        }
    }

    //if player meets Friend, gem appears
    for (i = 0; i < app.allFriends.length; i++) {
        if (collision(this.x, this.y, app.allFriends[i].x, app.allFriends[i].y)) {
            app.allFriends = [];
            new Gem();
        }
    }
};


player.prototype.handleInput = function (moveDirection) {
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


player.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


//Gem code goes here:
var Gem = function () {
    this.x = app.coords.columns[randomInteger(0, 4)];
    this.y = app.coords.raws[randomInteger(1, 5)];
    this.sprite = app.sprites.gem[randomInteger(0, 2)];
    app.allGems.push(this);
};

Gem.prototype.render = function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};


//Helper function for randomizing
function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
}


//Collision check
var collision = function (playerX, playerY, x2, y2) {
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


//Player app.score and app.score's record goes here.
var scoreUpdate = function () {
    if (app.score > app.scoreRecord) {
        app.scoreRecord = app.score;
    }
};


var renderScore = function () {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "16pt Arial";
    ctx.textAlign = "end";
    ctx.fillText("Player: " + app.score, 450, 80);
    ctx.fillText("Record: " + app.scoreRecord, 450, 105);
};


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


var player = new player();
createEnemy(app.enemyNumberTotal);
createFriend();
