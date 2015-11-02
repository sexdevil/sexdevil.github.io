Math.sqaure = function(x){
  return x*x   
}
var renderer = PIXI.autoDetectRenderer(1000, document.documentElement.clientHeight,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);

var loader = PIXI.loader; // pixi exposes a premade instance for you to use.
//or
var loader = new PIXI.loaders.Loader(); // you can also create your own if you want

loader.add('bunny',"assets/bunny.png");
loader.add('textureAllien',"assets/SpriteSheet-Aliens.png");
loader.once('complete',onAssetsLoaded);

loader.load();
window.over = false
function onAssetsLoaded(){
    
document.getElementsByClassName('loading')[0].remove();

window.enemyList = [];

// create the root of the scene graph
window.stage = new PIXI.Container();

window.gamescene = new PIXI.Sprite();
gamescene.interactive = true;
gamescene.width=1000;
gamescene.height=document.documentElement.clientHeight;
stage.addChild(gamescene);
//bind event
gamescene.on('touchstart', onDown);
gamescene.on('mousedown', onDown);

// create a texture from an image path
var texture = PIXI.Texture.fromImage('assets/bunny.png');

// create a new Sprite using the texture
window.bunny = new PIXI.Sprite(texture);


// center the sprite's anchor point
bunny.anchor.x = 0.5;
bunny.anchor.y = 0.5;

// move the sprite to the center of the screen
bunny.position.x = 200;
bunny.position.y = 150;

bunny.gamedata={
        angle:0,
	width:20,
	height:20,
	speed:0,
        speedY:0
}

stage.addChild(bunny);


addEnemy(stage,bunny);

var map={
	width:1000,
	height:document.documentElement.clientHeight
}

var timer = 0;

var speed=10;





// start animating


function fly(target){
    for(var i=0;i<target.length;i++){
        target[i].position.x+=target[i].gamedata.speed;

        target[i].position.y+=target[i].gamedata.speed*Math.sin(target[i].gamedata.angle);

      if(target[i].position.x>=map.width || target[i].position.x<=0 || target[i].position.y>=map.height || target[i].position.y<=0){
        changeWay(target[i]);
     }
    }
    
	
}

function flyBunny(target){
    target.position.x+=target.gamedata.speed;

    target.position.y+=target.gamedata.speedY;
   
    positonTest(target,window.enemyList)
}

function positonTest(target,enemyList){
    if(target.position.x>=map.width || target.position.x<=0 || target.position.y>=map.height || target.position.y<=0){
    document.getElementById('popup').style.display='block' 
    document.getElementById('popup').getElementsByClassName('text')[0].innerHTML='你飞出去了'
    window.over = true;
   } 
   for(var i=0;i<enemyList.length;i++){
        if(Math.sqrt(Math.sqaure(target.position.x-enemyList[i].position.x)+Math.sqaure(target.position.y-enemyList[i].position.y))<=80){
             document.getElementById('popup').style.display='block' 
           document.getElementById('popup').getElementsByClassName('text')[0].innerHTML='你挂了'
             window.over = true; 
        }     
   }
  
}

function changeWay(target){
    target.gamedata.angle+=180
    target.gamedata.speed = target.gamedata.speed*(-1)
}

animate();

function animate() {
   
    requestAnimationFrame(animate);
    
     if(over){
        return; 
    }

    timer+=0.01;

    enemyNumber(timer,stage);//定时增加怪物数量
   
    fly(window.enemyList)
    
    flyBunny(bunny)
    // just for fun, let's rotate mr rabbit a little
    bunny.rotation += 0.1; 

    // render the container
    renderer.render(stage);
}

function onDown(eventData){
    var x = eventData.data.global.x;
    var y = eventData.data.global.y;
    var x0 = bunny.position.x;
    var y0= bunny.position.y;
    if(x>x0){
       bunny.gamedata.speed=3
    }else{
       bunny.gamedata.speed=-3 
    }
    if(y>y0){
       bunny.gamedata.speedY = 3
    }else{
      bunny.gamedata.speedY = -3
    }
   
   

}

}//onLoaded

function randomAngle(){
	return Math.random()*360
}
function randomNum(){
	return Math.random();
}

function retry(){
    document.getElementById('popup').style.display='none' 
    timer=0;
    for(var i=0;i<enemyList.length;i++){
       stage.removeChild(enemyList[i]); 
    }
    
    window.enemyList=[];
    
    addEnemy(stage,bunny)
    
    bunny.gamedata.speed=0;
    bunny.gamedata.speedY=0;
    bunny.position.x = 200;
    bunny.position.y = 150;
   
     window.over = false;
 
}
function cancle(){
    document.getElementById('popup').style.display='none'
    window.over = true;
  
}

function addEnemy(stage,bunny){
var textureAllien = PIXI.Texture.fromImage('assets/SpriteSheet-Aliens.png');
textureAllien = new PIXI.Texture(textureAllien,new PIXI.Rectangle(0, 0, 165, 165))
var allien = new PIXI.Sprite(textureAllien);
allien.anchor.x=0.5;
allien.anchor.y=0.5;



allien.position.x=randomNum()*1000;
allien.position.y=randomNum()*gamescene.height;

while(1){
 if(Math.sqrt(Math.sqaure(bunny.position.x-allien.position.x)+Math.sqaure(bunny.position.y-allien.position.y))<=80){
  allien.position.x=randomNum()*1000;
  allien.position.y=randomNum()*gamescene.height;  
}else{
    break;
}   
}


allien.gamedata={
	angle:randomAngle(),
	width:165,
	height:165,
	speed:10
}

stage.addChild(allien);
window.enemyList.push(allien)
}

function enemyNumber(timer,stage){
    if(enemyList.length<timer/10){
        addEnemy(stage,bunny)
    }
}