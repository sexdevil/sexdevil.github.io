 (function() {
 if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

var mainAnimate=0;

Math.sqaure = function(x){
  return x*x   
}
var speed = 4;
var range = 0;//前进距离
var renderer = PIXI.autoDetectRenderer(document.documentElement.clientWidth, document.documentElement.clientHeight,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);
var stage= new PIXI.Container();

var basicText = new PIXI.Text('你走了0米');
basicText.x = 30;
basicText.y = 90;

stage.addChild(basicText);
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
var graphicsList = [];
var timer = 0;

function onAssetsLoaded(loader, res)
{
   
  spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);
    // set the position
    spineBoy.x = renderer.width / 4;
    spineBoy.y = renderer.height/2;

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
    

    mainAnimate=requestAnimationFrame(animate);
}

function addBlock(){
    var graphics= new PIXI.Graphics()
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.beginFill(0xFF700B, 1);
    graphics.drawRect(-60, -60, 120, 120);
    graphics.endFill();
    stage.addChild(graphics);
    graphics.position.x=renderer.width;
    graphics.position.y=renderer.height/2+(Math.random())*(renderer.height/2)+(Math.random())*(-renderer.height/2);
    graphicsList.push(graphics);
    if(graphicsList.length>10){
        stage.removeChild(graphicsList[0])
        graphicsList.splice(0,1)
    }
}

function collision(g,spineBoy){
   if(Math.sqrt(Math.sqaure(g.x-spineBoy.x)+Math.sqaure(g.y-spineBoy.y+spineBoy.height/2))<=100){
      
       window.cancelAnimationFrame(mainAnimate);
        alert('You dead!')
       return false
   }
   return true
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
    for(var i=0;i<graphicsList.length;i++){
        graphicsList[i].position.x-=speed;
        if(!collision(graphicsList[i],spineBoy)){
            return
        } 
    }
    timer++;
    if(timer>100){
        timer=0;
        addBlock();
      
    }
     range+=speed;
    
          stage.removeChild(basicText);
       basicText = new PIXI.Text('你走了'+range/1000+'米');
      basicText.x = 30;
      basicText.y = 90;
      stage.addChild(basicText)
     

    mainAnimate = requestAnimationFrame(animate);
    renderer.render(stage);
}