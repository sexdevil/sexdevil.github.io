var renderer = PIXI.autoDetectRenderer(1000, document.documentElement.clientHeight,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);
var stage= new PIXI.Container();

// load spine data
PIXI.loader
    .add('spineboy', 'assets/spineboy.json')
    .load(onAssetsLoaded);

stage.interactive = true;
 // create a spine boy
    var spineBoy

    var gamescene = new PIXI.Sprite();
gamescene.interactive = true;
gamescene.width=renderer.width;
gamescene.height=renderer.height;

function onAssetsLoaded(loader, res)
{
   
  spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);
    // set the position
    spineBoy.position.x = renderer.width / 4;
    spineBoy.position.y = renderer.height/1.5;

    spineBoy.scale.set(1);
    spineBoy.gamestate='walk';
    // set up the mixes!
    spineBoy.stateData.setMixByName('walk', 'jump', 0.2);
    spineBoy.stateData.setMixByName('jump', 'walk', 0.4);

    // play animation
    spineBoy.state.setAnimationByName(0, 'walk', true);

    stage.addChild(spineBoy);
    stage.addChild(gamescene)

    gamescene.on('touchend', function (e)
    {      
        if(spineBoy.state.tracks[0].animation.name != 'jump'){

        spineBoy.state.setAnimationByName(0, 'jump', false,0);
        if(e.data.global.y>spineBoy.y){
             spineBoy.gamestate='down';
        }else{
             spineBoy.gamestate='up';
        }

        }
        
    });
    

    requestAnimationFrame(animate);
}



function animate()
{
    
    if(spineBoy.gamestate == 'up'){
        spineBoy.position.y-=2; 
    }else if(spineBoy.gamestate == 'down'){
        spineBoy.position.y+=2; 
    }
    if(spineBoy.gamestate != 'walk' && spineBoy.state.tracks[0]==null){
           spineBoy.state.addAnimationByName(0, 'walk', true, 0);
           spineBoy.gamestate='walk'
       }
    requestAnimationFrame(animate);
    renderer.render(stage);
}