var PLAY = 1;
var END = 0;
var Over=2;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg,endImage,end,flag,flagImage;
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  endImage=loadImage("the end image.png");
  flagImage = loadImage("chekerd flag.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")

}

function setup() {
  createCanvas(600,200);

  trex = createSprite(0,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  

  gameOver = createSprite(200,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(200,140);
  restart.addImage(restartImg);
  
  end = createSprite(300,100);
  end.addImage(endImage);
  end.scale=0.5;

  flag = createSprite(7000,150);
  flag.addImage(flagImage);
  flag.scale=0.15;
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  
  score = 0;

 
}

function draw() {
  
  background(180);  

  camera.position.x = trex.x;

  console.log(trex.x);

  invisibleGround.x=camera.position.x;
  ground.x=camera.position.x;

  end.x=camera.position.x;
  restart.x=camera.position.x+150;
  gameOver.x=camera.position.x+150;

  //displaying score
  fill("black")
  text("Score: "+ score,camera.position.x+100,15);

  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    end.visible=false;

    //scoring
    //score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    

    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }

    if(keyDown(RIGHT_ARROW)){
      trex.x= trex.x+12;
      score++
     
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play();
    }

    if(trex.x>7000){
      gameState=Over;
    }

  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
      trex.velocityY = 0
      trex.velocityX=0;
      ground.velocityX=0;
      invisibleGround.velocityX=0;
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 

   }else if(gameState===Over){
   
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.destroy();
    flag.destroy();
    end.visible=true;
   }

   
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  if(mousePressedOver(restart)) {
      reset();
    }


    drawSprites();    
}

function reset(){
  gameState=PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  score=0;
  trex.x=0;

}


function spawnObstacles(){
 if (frameCount % 50 === 0){
   var obstacle = createSprite(camera.position.x +400,165,10,40);
   obstacle.velocityX =0;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    //obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(camera.position.x+Math.round(random(550,800)),120,40,10);
    cloud.y = Math.round(random(20,80));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = 0;
    
     //assign lifetime to the variable
    //cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

