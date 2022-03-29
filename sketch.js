//Variáveis
var trex, trex_running;
var edges;
var ground, groundImage;
var InvisibleGround;
var cloud, cloudImage;
var obstaculo1, obstaculo2, obstaculo3, obstaculo4, obstaculo5, obstaculo6;
var trexcolisao;
var gameover, gameoverimage;
var restart, restartimage;
var jumpsound, diesound, checkpointsound;

var Score = 0;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//Pre carregamento de imagens para criar uma animação em sprites
function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");

  obstaculo1 = loadImage("obstacle1.png");
  obstaculo2 = loadImage("obstacle2.png");
  obstaculo3 = loadImage("obstacle3.png");
  obstaculo4 = loadImage("obstacle4.png");
  obstaculo5 = loadImage("obstacle5.png");
  obstaculo6 = loadImage("obstacle6.png");
  trexcolisao = loadAnimation("trex_collided.png");
  gameoverimage = loadImage("gameOver.png");
  restartimage = loadImage("restart.png");
  jumpsound = loadSound("jump.mp3");
  diesound = loadSound("die.mp3");
  checkpointsound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  InvisibleGround = createSprite(width/2, height -10, width, 10);
  InvisibleGround.visible = false;

  obstaculoG = new Group();
  nuvenG = new Group();

  trex = createSprite(50, height -40, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("trexco", trexcolisao);
  trex.scale = 0.5;

  edges = createEdgeSprites();

  ground = createSprite(width/2, height -20, width, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;

 trex.setCollider("circle", 0,0,50);
 //trex.debug = true;

 gameover = createSprite(width/2,height/2);
 gameover.addImage(gameoverimage);
 gameover.scale = 0.5;
 gameover.visible = false;

 restart = createSprite(width/2,height/2+40);
 restart.addImage(restartimage);
 restart.scale = 0.7;
 restart.visible = false;
}


function draw() {
  background("white");

  text("pontuação: " + Score, width -100, 50);

  if (gameState === PLAY) {
    ground.velocityX = -4;
    Score = Score + Math.round(getFrameRate() / 60);

    /*if (Score > 0 && Score%100===0) {
      checkpointsound.play();
    }
    */
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (touches.length>0 || keyDown("space")) { 
     if (trex.y >= height -40) {
      trex.velocityY = -10;
      jumpsound.play();
      touches = [];
    }}
    trex.velocityY = trex.velocityY + 0.5;

    criarNuvem();
    criarobstaculos();

    if (obstaculoG.isTouching(trex)) {
      gameState = END;
      diesound.play();
    }
  }

  else if (gameState === END) {
    gameover.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    trex.velocityY = 0;
    trex.changeAnimation("trexco", trexcolisao);
    obstaculoG.setLifetimeEach(-1);
    obstaculoG.setVelocityXEach(0);
    nuvenG.setLifetimeEach(-1);
    nuvenG.setVelocityXEach(0);

    if (mousePressedOver(restart)|| touches.lenght >0) {
      touches = [];
      reset();
    }
  }

  trex.collide(InvisibleGround);
  drawSprites();
}

function reset() {
  gameState = PLAY;

  gameover.visible = false;
  restart.visible = false;
  obstaculoG.destroyEach();
  nuvenG.destroyEach();
  trex.changeAnimation("running", trex_running);
  Score = 0;
}

function criarobstaculos() {
  //a cada 60 quadros cria-se um cactu
  if (frameCount % 60 == 0) {
    var obstaculo = createSprite(width +10, height -35, 10, 40);
    obstaculo.velocityX = -(6+Score/100);
    
    var aleatorio = Math.round(random(1, 6));

    switch (aleatorio) {
      case 1: obstaculo.addImage(obstaculo1);
        break;

      case 2: obstaculo.addImage(obstaculo2);
        break;

      case 3: obstaculo.addImage(obstaculo3);
        break;

      case 4: obstaculo.addImage(obstaculo4);
        break;

      case 5: obstaculo.addImage(obstaculo5);
        break;

      case 6: obstaculo.addImage(obstaculo6);
        break;

      default: break;
    }
    //atribuir dimensão e tempo de vida ao obstáculo
    obstaculo.scale = 0.5;
    obstaculo.lifetime = width +10;

    //adicione cada obstáculo ao grupo
    obstaculoG.add(obstaculo);
  }
}

function criarNuvem() {
  //a cada 60 quadros cria-se uma nuvem 
  if (frameCount % 60 == 0) {
    //sprite nuvem
    cloud = createSprite(width +10, height - 100, 10, 10);
    //aleatoriedade da altura da nuvem
    cloud.y = Math.round(random(height -150, height -100));
    //imagem, scale, velocidade
    cloud.addImage("nuvem", cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;

    //tempo de vida 
    cloud.lifetime = width +10;

    //profundidade
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    //consoles para exibir velocidade
    // console.log(cloud.depth);
    // console.log(trex.depth);

    //adicionar nuvem ao grupo
    nuvenG.add(cloud);

  }
}
