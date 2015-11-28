// Enemies our player must avoid
var enemyEntryRaw = [55, 135, 215];

var Enemy = function(x, y, speed) {
    this.x = 0;
    this.y = enemyEntryRaw[randomInteger(0,2)];
    this.speed = randomInteger(1,4);
    this.sprite = 'images/enemy-bug.png';
};

Enemy.prototype.update = function(dt, speed) {
    if (this.x > 500) {
        this.x = 0;
        this.y = enemyEntryRaw[randomInteger(0,2)];
        this.speed = randomInteger(1,4);
    };
    this.x = this.x + this.speed;
};

Enemy.prototype.render = function() {
    // console.log(this.x, this.y, this.speed);
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var player = function (x, y) {
    this.x = x;
    this.y = y;
    this.sprite = 'images/char-boy.png';
};

player.prototype.update = function() {
    for (var i= 0; i <= allEnemies.length - 1; i++) {
        console.log(this.x, this.y);
        // console.log(i);
            // console.log("player coords: " + this.x, this.y);
            // console.log("bug1: " + allEnemies[0].x, allEnemies[0].y);
            // console.log("bug2: " + allEnemies[1].x, allEnemies[1].y);
            // console.log("bug3: " + allEnemies[2].x, allEnemies[2].y);
            // console.log ('HIT');
        if (this.y == allEnemies[i].y && this.x == parseInt(allEnemies[i].x)) {
        // if (this.x == allEnemies[i].x)  {
            this.x = 200;
            this.y = 375;
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
    // break;
  // default:
  //   ...
  //   [break]
}
};


player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player


function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

var enemyTotal = 3;
// var enemyNumber;
var allEnemies = [];

for (var enemyNumber = 0; enemyNumber < enemyTotal ; enemyNumber++) {
    allEnemies[enemyNumber] = new Enemy ();
};


// var enemy1 = new Enemy(0, 50, 2);
// var enemy2 = new Enemy(0, 150, 1);
// var enemy3 = new Enemy(0, 350, 3);
// var allEnemies = [enemy1, enemy2, enemy3];

var player = new player(200, 375);

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
