var renderer = PIXI.autoDetectRenderer(1000, document.documentElement.clientHeight,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);
var stage= new PIXI.Container();

var loader = PIXI.loader; // pixi exposes a premade instance for you to use.
//or
var loader = new PIXI.loaders.Loader(); // you can also create your own if you want

var timmer=0;

loader.add('Explosion',"assets/SpriteSheet-Explosion.png");
loader.once('complete',onAssetsLoaded);

loader.load();

var tilingSprite

function onAssetsLoaded(){
    var ExplosionTextrue = new PIXI.Texture.fromImage('assets/SpriteSheet-Explosion.png')

    
    tilingSprite = new PIXI.extras.TilingSprite(ExplosionTextrue, 250, 250);
    
    tilingSprite.tilePosition.x=-750;
    tilingSprite.tilePosition.y=-1250;
 
   
    
   stage.addChild(tilingSprite);
   
   animate()

}



function framesPlay(){
    
    if(timmer%1==0){
        
   
    if(tilingSprite.tilePosition.x==0){
        //换行
        tilingSprite.tilePosition.x=-750
        if(tilingSprite.tilePosition.y==0){
            tilingSprite.tilePosition.y=-1250
        }else{
            tilingSprite.tilePosition.y+=250;
        }
        
    }else{
       tilingSprite.tilePosition.x+=250;  
    }
    
    }

}

function animate() {
    
    timmer+=1;
    
    framesPlay(timmer);
    
     


    requestAnimationFrame(animate);

    // render the root container
    renderer.render(stage);
}