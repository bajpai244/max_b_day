/** @format */

var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: {
    key: 'game',
    preload: preload,
    create: create,
    update: update,
  },
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var game_over_text;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform3.png');
  this.load.image('main_platform', 'assets/main_platform.png');
  this.load.image('star', 'assets/logo_pix.png', {
    height: 30,
    width: 30,
  });
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude', 'assets/dude_4.png', {
    frameWidth: 35,
    frameHeight: 50,
  });

  this.load.audio('audio_beam', [
    'assets/sounds/beam.ogg',
    'assets/sounds/beam.mp3',
  ]);

  this.load.audio('audio_explosion', [
    'assets/sounds/explosion.ogg',
    'assets/sounds/explosion.mp3',
  ]);

  this.load.audio('audio_pickup', [
    'assets/sounds/pickup.ogg',
    'assets/sounds/pickup.mp3',
  ]);

  this.load.audio('game_over', [
    'assets/sounds/gameover.ogg',
    'assets/sounds/gameover.mp3',
  ]);

  this.load.audio('music', [
    'assets/sounds/bgscore3.ogg',
    'assets/sounds/bgscore3.mp3',
  ]);
}

function create() {
  //  A simple background for our game
  this.add.image(400, 300, 'sky');

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, 'main_platform').setScale(2).refreshBody();

  //  Now let's create some ledges
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  // The player and its settings
  player = this.physics.add.sprite(100, 450, 'dude');

  //  Player physics properties. Give the little guy a slight bounce.
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);

  // 1.2 create the sounds to be used
  this.beamSound = this.sound.add('audio_beam');
  this.explosionSound = this.sound.add('audio_explosion');
  this.pickupSound = this.sound.add('audio_pickup');
  this.gameOver = this.sound.add('game_over');
  // 2.1 create music
  this.music = this.sound.add('music');

  var musicConfig = {
    mute: false,
    volume: 1,
    rate: 1,
    detune: 0,
    seek: 0,
    loop: true,
    delay: 0,
  };

  this.music.play(musicConfig);

  //  Our player animations, turning, walking left and walking right.
  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: 'turn',
    frames: [{ key: 'dude', frame: 4 }],
    frameRate: 20,
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1,
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys();

  //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 },
  });

  stars.children.iterate(function (child) {
    //  Give each star a slightly different bounce
    child.setScale(0.05);
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  bombs = this.physics.add.group();

  //  The score
  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: 'white',
  });

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(stars, platforms);
  this.physics.add.collider(bombs, platforms);

  //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
  if (gameOver) {
    return;
  }

  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectStar(player, star) {
  this.pickupSound.play();
  star.disableBody(true, true);

  //  Add and update the score
  score += 10;
  scoreText.setText('Score: ' + score);

  if (stars.countActive(true) === 0) {
    //  A new batch of stars to collect
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });
  }
  var x =
    player.x < 400
      ? Phaser.Math.Between(400, 800)
      : Phaser.Math.Between(0, 400);

  if (score % 4 == 0) {
    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-100, 100), 20);
    bomb.allowGravity = false;
  }
}

function hitBomb(player, bomb) {
  this.physics.pause();
  this.music.pause();
  this.explosionSound.play();
  this.gameOver.play();
  // player.setTint(0xff0000);

  player.anims.play('turn');

  //gameOver = true;

  game_over_text = this.add.text(250, 300, 'Game Over', {
    fontSize: '64px',
    fill: 'orange',
  });

  (() => {
    var time = 0;
    var game_restart_text = this.add.text(
      100,
      400,
      `Game Restarts in ${5 - time}`,
      {
        fontSize: '48px',
        fill: 'orange',
      }
    );
    const interval = setInterval(() => {
      if (time == 6) {
        clearInterval(interval);
        this.scene.start('game');
      }

      game_restart_text.setText(`Game Restarts in ${5 - time}`);

      time += 1;
    }, 1000);
  })();
}
