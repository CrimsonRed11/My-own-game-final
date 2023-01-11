var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")
  
  backgroundImg = loadImage("Background.png")
  //sunAnimation = loadImage("sun.png");
  
  trex_running = loadAnimation("Miner5.png","Miner4.png","Miner3.png");
  trex_collided = loadAnimation("Miner2.png","Miner1.png");
  
  groundImage = loadImage("Background.png");
  
  cloudImage = loadImage("Bomb.png");
  
  obstacle1 = loadImage("Diamond.png");
  obstacle2 = loadImage("Gold Block.png");
  obstacle3 = loadImage("Iron.png");
  obstacle4 = loadImage("Rock.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);    
  
  
  
  
  
 // invisibleGround = createSprite(width/2,height-10,width,125);  
 //invisibleGround.shapeColor = "#f4cbaa";
  
  ground = createSprite(width,height/2,width,height);
  ground.addImage("ground",groundImage);
  ground.shapeColor = "#f4cbaa";
  ground.x = width/6;
  ground.velocityX = -(6 + 3*score/100);
  ground.scale=2.35;
  trex = createSprite(80,height/2,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  //trex.setCollider('circle',0,0,350)
  trex.scale = 2
   //trex.debug=true
  
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw() {
  //trex.debug = true;
  background(backgroundImg);
  
 
  
  
  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
   
    if((touches.length > 0 || keyDown("SPACE")) && trex.y  >= height-120) {
      jumpSound.play( )
      trex.velocityY = -10;
       touches = [];
    }

    if (keyDown("up")) {
  
   
 trex.y +=-5;
 }

 if (keyDown("down")) {
  

  trex.y+=5;
}




    
//trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x <0){
      ground.x = width;
    }
  
    //trex.collide(invisibleGround);
   spawnClouds();
    spawnObstacles();
  
    if(cloudsGroup.isTouching(trex)){
        collidedSound.play()
        gameState = END;
    }
    if(obstaclesGroup.isTouching(trex)){
      collidedSound.play()
     score += 10;
     obstaclesGroup.destroyEach();
  } 
  }

 


  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(touches.length>0 || keyDown("SPACE")) {      
      reset();
      touches = []
    }
  }
  
   
  drawSprites();
  textSize(40);
  fill("black")
    text("Score: "+ score,30,50);
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(200,width-100));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6 + 3*score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 50 === 0) {
    var obstacle = createSprite(width+20,height-300,40,10);
    obstacle.setCollider('circle',0,0,45)
    // obstacle.debug = true
  
    obstacle.velocityX = -(6 + 3*score/100);
    obstacle.y = Math.round(random(200,width-100));
    //generate random obstacles
    var rand = Math.round(random(1,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
      break;
      case 4: obstacle.addImage(obstacle4);
     break;  
    default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.3;
    obstacle.lifetime = 1000;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}
