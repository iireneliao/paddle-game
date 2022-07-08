/* global createCanvas, frameRate, background, keyCode, UP_ARROW, DOWN_ARROW, stroke
   noFill, rect, fill, key, keyIsDown, circle, collideRectCircle, random, tan, round,
   PI, textSize, text, delayTime, noLoop, redraw, loop, keyCode, UP_ARROW, DOWN_ARROW, KeyW, KeyS, line, loadFont, textFont, strokeWeight, createImg, loadSound, soundFormats, setVolume, loadImage, image
*/

//modified for Google CSSI

let width, height, player1, player2, pongBall, paddleWidth, paddleHeight, circleRadius, playerSpeed, player1Score, player2Score
let hit1top, hit1bottom, hit2top, hit2bottom, hitTop, hitBottom;
let ballX, ballY, paddle1X, paddle1Y, paddle2X, paddle2Y;
let fireBalls = new Array(3);
let myFont;
let mySound, bgSound;
let ballImg;

function preload()
{
   bgSound = loadSound('https://cdn.glitch.com/7a3ac509-63ce-4ab5-893c-a56b2255f123%2FWii%20Music%20-%20Gaming%20Background%20Music%20(HD).mp3?v=1627054450832');
}

function setup(){
  width = 800;
  height = 600;
  paddleWidth = 20;
  paddleHeight = 80;
  circleRadius = 10;
  player1Score = 0;
  player2Score = 0;
  playerSpeed = 8;
  createCanvas(width, height);
  frameRate(30);
  ballX = width/2;
  ballY = height/2;
  paddle1X = 20;
  paddle1Y = 40;
  paddle2X = width - 40;
  paddle2Y = 40;
 
  myFont = loadFont('https://cdn.glitch.com/7a3ac509-63ce-4ab5-893c-a56b2255f123%2FFipps-Regular.otf?v=1627049319474');
  mySound = loadSound('https://cdn.glitch.com/7a3ac509-63ce-4ab5-893c-a56b2255f123%2FUntitled.mp3?v=1627054134064');
  ballImg = loadImage('https://cdn.glitch.com/7a3ac509-63ce-4ab5-893c-a56b2255f123%2Fball.png?v=1627055843247');
  
  bgSound.setVolume(0.125);
  bgSound.loop();
  
  //creates two Paddle objects, player1 and player 2
  player1 = new Paddle(paddle1X, paddle1Y, paddleWidth, paddleHeight, 255, 0, 0);
  player2 = new Paddle(paddle2X, paddle2Y, paddleWidth, paddleHeight, 0, 0, 255);
  
  //creates a Ball object, names pongBall
  pongBall = new Ball(ballX, ballY, circleRadius, 255, 255, 255);

  for (var i=0; i<fireBalls.length; i++){
    fireBalls[i] = new fireBall(paddle1X, paddle1Y, circleRadius, 255, 0, 0);
  }
}

function draw() {
  background('black');
  
  line(width/2, 0, width/2, height);

  movePlayer1();
  player1.showSelf();
  movePlayer2();
  player2.showSelf();
  pongBall.moveSelf();
  pongBall.showSelf();
  displayScores();
  
  for (var i=0; i<fireBalls.length; i++){
    if (fireBalls[i].canFire) {fireBalls[i].showSelf(); fireBalls[i].moveSelf();}
  }
  
  checkCollisions();
  checkWin();
  
  if (player1Score == 10 && player2Score < 10)
    {
      background(0, 0, 0);
      
      textSize(35);
      strokeWeight(1);
      fill('white');
      stroke('white');
      text(`Game over!`, width/3, 170);
      
      textSize(20);
      stroke('white')
      fill('red');
      text(`Player 1 won with a score of 10!`, width/5, 250);
      
    }
  else if (player2Score == 10 && player1Score < 10)
    {
      background(0, 0, 0);
      
      textSize(35);
      strokeWeight(1);
      fill('white');
      stroke('white');
      text(`Game over!`, width/3, 170);
      
      textSize(20);
      stroke('white')
      fill('blue');
      text(`Player 2 won with a score of 10!`, width/5, 250);
    }
}

class Ball {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.angle = random(-PI, PI);
    //this.angle = PI/2;
    this.deltaX = 5;
    this.deltaXforY = 5;
    this.deltaY = 0;
  }
  
  showSelf() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, circleRadius);
  }
  
  moveSelf() {
    // TODO 2: if the ball hits the floor or ceiling, then the ball should move in the opposite direction hits a floor or ceiling
    if (this.y < 0 + this.r || this.y > height - this.r) {
      this.angle*= -1;
    }
    
   // the code below this below this should stay
    var slope = tan(this.angle);
    this.deltaY = round(slope * this.deltaXforY);
    this.x += this.deltaX;
    this.y += this.deltaY;
    //console.log(del);
  }
}

class fireBall {
  constructor(x, y, rad, r, g, b, canFire) {
    this.x = x;
    this.y = y;
    this.xv = 5;
    this.yv = 0;
    this.rad = rad;
    this.r = r;
    this.g = g;
    this.b = b;
    this.canFire = false;
    
    //Gravity
    this.grav = 0;
    this.gravVel = 1;
    this.bounceSpeed = 0.9;
    
  }
  
  moveSelf() {
    this.grav += this.gravVel;
    this.x += this.xv;
    this.y += this.yv + this.grav;
    
    if (this.y + this.rad > height){
      this.y = height - this.rad;
      this.grav = -(this.grav*this.bounceSpeed);
    }
  }
  
  showSelf() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    circle(this.x, this.y, circleRadius);
  }
}

class Paddle {
  //TODO 1: Complete the constructor and showSelf methods
  constructor(x, y, w, h, r, g, b) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.r = r;
    this.g = g;
    this.b = b;
    
    this.top = rect(x, y, w, h/2);
    this.bottom = rect(x+w/2, y+h/2, w, h/2);
  }
  
  showSelf() {
    stroke(this.r, this.g, this.b);
    fill(this.r, this.g, this.b);
    rect(this.x, this.y, this.w, this.h);
  }
}

//TODO 3: Complete movePlayer1() and movePlayer2()
function movePlayer1() {
  if (keyIsDown(38))
    {
      player2.y -= playerSpeed;
    }
  else if (keyIsDown(40))
    {
      player2.y += playerSpeed;
    }
  
  if (keyIsDown(32))
    {
      fireBalls[0].canFire = true;
    }
  //if certain keys are pressed, then player1.y should either increment or decrement
}

function movePlayer2() {
  if (keyIsDown(87)) // W key
    {
      player1.y -= playerSpeed;
    }
  else if (keyIsDown(83)) // S key
    {
      player1.y += playerSpeed;
    }
  //if certain keys are pressed, then player2.y should either increment or decrement
}



function checkCollisions() {
  //TODO 4:  use collide2D to check for collisions between either of the paddles and the ball
  
  //Paddle collision: if collision happens, the ball should move in the opposite direction and "speed" (deltaX)
  //hit1 = collideRectCircle(player1.x, player1.y, player1.w, player1.h, pongBall.x, pongBall.y, pongBall.r);
  //hit2 = collideRectCircle(player2.x, player2.y, player2.w, player2.h, pongBall.x, pongBall.y, pongBall.r);
  
  hit1top = collideRectCircle(player1.x, player1.y, player1.w, player1.h/2, pongBall.x, pongBall.y, pongBall.r);
  hit1bottom = collideRectCircle(player1.x, player1.y + player1.h/2, player1.w, player1.h/2, pongBall.x, pongBall.y, pongBall.r);
  hit2top = collideRectCircle(player2.x, player2.y, player2.w, player2.h/2, pongBall.x, pongBall.y, pongBall.r);
  hit2bottom = collideRectCircle(player2.x, player2.y + player2.h/2, player2.w, player2.h/2, pongBall.x, pongBall.y, pongBall.r);
  
  if ((hit1top || hit2top)/* && !hitTop*/)
  {
    if (pongBall.angle > 0) {pongBall.angle*=-1;}
    
    pongBall.deltaX*=-1;
    hitTop = true;
    //console.log("hi");
    //pongBall.angle = random(-PI, PI);
//
    //pongBall.deltaY *= 10;
    mySound.play();
    
  }
  
  if ((hit1bottom || hit2bottom)/* && !hitBottom*/)
  {
    if (pongBall.angle < 0) {pongBall.angle*=-1;}
    pongBall.deltaX*=-1;
    hitBottom = true;
    //pongBall.angle = random(-PI, PI);
    mySound.play();
  }
  
  //hitTop = false;
  //hitBottom = false;
  
  //Wall Collision
  //hit3 = collideRectCircle(paddle1X, paddle1Y, paddleWidth, paddleHeight, ballX, ballY, circleRadius);
}

function displayScores() {
  stroke('white');
  strokeWeight(3);
  fill('red');
  textSize(12);
  textFont(myFont);
  
  text(`Player 1: ${player1Score}`, 20, 30);
  
  fill('blue');
  text(`Player 2: ${player2Score}`, 675, 30);
}

function checkWin() {
  //TODO 5: if the ball goes 'past' the paddle, the appropriate player's score should increment
  //the ball should also be reset
  
  if (pongBall.x > width + pongBall.r) {
    player1Score++;
    resetBall();
  } else if (pongBall.x < 0 - pongBall.r) {
    player2Score++;
    resetBall();
  }
}

function resetBall() {
  pongBall.x = width/2;
  pongBall.y = height/2;
  pongBall.angle = random(-PI, PI);
  var i = 0;
  while (i < 1000000) { // pause before the next round
    i += 1;
    noLoop();
  }
  loop();
}
