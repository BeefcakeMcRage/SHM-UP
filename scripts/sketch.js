// A top-down shooter game

// Source: https://www.youtube.com/channel/UCHm5sxfqw5Oq2mbiYH1kgzw

// for local server, run command:
//    python -m http.server
// then in browser visit:
//    http://localhost:8000


let bullets = []
let enemies = []
let rocks = []

let score = 0
let buffer_X = 11
let position_Y = 750
let x = 0
let easing = 0.03

let enemy_size = 15
let enemy_speed = 4
let rock_siza = 15
let rock_speed = 1
let bullet_speed = -15
let bullet_accuracy = 15

let player_img
let enemy_img
let rock_img

let laser_sfx
let laser_hit_sfx
let expl_sfx
let enemyEnd_sfx

function preload() {
  // load immage and sound assets
  player_img = loadImage('assets/images/player.png')
  enemy_img =  loadImage('assets/images/enemy.png')
  rock_img = loadImage('assets/images/rock.png')

  laser_sfx = loadSound('assets/audio/laser001.wav')
  expl_sfx = loadSound('assets/audio/expl001.wav')
  laser_hit_sfx = loadSound('assets/audio/beep004.wav')
  enemyEnd_sfx = loadSound('assets/audio/beep005.wav')
}

function setup() {
  // put setup code here
  createCanvas (400, 800)
  // removes cursor over canvas
  noCursor()
  
  // generate enemies
  for (let i = 0; i < 2; i++){
    let enemy = {
      x: random(0, width),
      y: random(-100, 0)
    }
    enemies.push(enemy)
  }
   // generate rocks
   for (let i = 0; i < 10; i++){
    let rock = {
      x: random(0, width),
      y: random(-100, 0)
    }
    rocks.push(rock)
  }
}

function draw() {
  // put drawing code here
  background(100)
  rectMode(CENTER)

  // draw player
  let player_movement = mvmntSmoothing(mouseX)
  image(player_img, player_movement - 32, position_Y - 32, 64, 64)

  // update and draw bullets
  for (let bullet of bullets){
    circle(bullet.x, bullet.y, 10)
    bullet.y += bullet_speed
  }

  // update and draw enemies
  for (let enemy of enemies){
    image(enemy_img, enemy.x - 32, enemy.y - 32, 64, 64)
    enemy.y += enemy_speed
  }
  
  // update and draw rocks
  for (let rock of rocks){
    image(rock_img, rock.x - 32, rock.y - 32, 64, 64)
    rock.y += rock_speed
  }
  
  // hit registration and create new enemies when bullets hit
  for (let enemy of enemies){
    for (let bullet of bullets){
      if (dist(enemy.x, enemy.y, bullet.x, bullet.y) < bullet_accuracy){
        expl_sfx.play()
        enemies.splice(enemies.indexOf(enemy), 1)
        bullets.splice(bullets.indexOf(bullet), 1)
      let newEnemy = {
        x: random(0, width),
        y: random(-100, 0)
      }
      enemies.push(newEnemy)
      score += 3
      }
    }
    // end game if enemies reaches bottom of play area
    if (enemy.y > height){
      enemyEnd_sfx.play()
      text("GAME OVER", 15, 105)
      text("ENEMY GOT PAST YOU", 100, 105)
      noLoop()
    }
    // end game if player is hit by enemy
    if (dist(enemy.x, enemy.y, player_movement, position_Y) < 25){
      expl_sfx.play()
      text("GAME OVER", 15, 105)
      text("YOU GOT HIT BY ENEMY", 100, 105)
      noLoop()
    }

  // hit registration and create new rocks when bullets hit  
  for (let rock of rocks){
    for (let bullet of bullets){
      if (dist(rock.x, rock.y, bullet.x, bullet.y) < bullet_accuracy){
        laser_hit_sfx.play()
        rocks.splice(rocks.indexOf(rock), 1)
        bullets.splice(bullets.indexOf(bullet), 1)
      let newRock = {
        x: random(0, width),
        y: random(-100, 0)
      }
      rocks.push(newRock)
      score += 1
      }
    }

    // create new rocks when reaching botttom of play area
    if (rock.y > height){
      rocks.splice(rocks.indexOf(rock), 1)
      let newRock = {
        x: random(0, width),
        y: random(-100, 0)
      }
      rocks.push(newRock)
      score -= 2
    }

    // end game if player is hit by rock
    if (dist(rock.x, rock.y, player_movement, position_Y) < 20){
      expl_sfx.play()
      text("GAME OVER", 15, 105)
      text("YOU GOT HIT BY ROCK", 100, 105)
      noLoop()
    }
 }
  // display score
  text("SCORE:", 15, 15)
  text(score, 100, 15)
    
  text('Destroyed enemies: +3', 15, 45)
  text('Destroyed rocks: +1', 15, 60)
  text('Lost rocks: -2', 15, 75)
  }
}

function mousePressed() {
  // create bullets when LMB is pressed
  laser_sfx.play()
  let bullet = {
    x: mvmntSmoothing(mouseX),
    y: position_Y
  }
  bullets.push(bullet)
}

function mvmntSmoothing(mouseX) {
  // smooth player movement with easing and constrain to play area
  let dx = mouseX - x
  x += dx * easing
  let x_mvmnt = constrain(x, buffer_X, width - buffer_X)
  return x_mvmnt
}

