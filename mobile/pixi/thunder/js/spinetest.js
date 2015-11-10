var renderer = PIXI.autoDetectRenderer(1000, document.documentElement.clientHeight,{backgroundColor : 0x1099bb});
document.body.appendChild(renderer.view);
var stage= new PIXI.Container();

// load spine data
PIXI.loader
    .add('spineboy', 'assets/spineboy.json')
    .load(onAssetsLoaded);

stage.interactive = true;

function onAssetsLoaded(loader, res)
{
    // create a spine boy
    var spineBoy = new PIXI.spine.Spine(res.spineboy.spineData);

    // set the position
    spineBoy.position.x = renderer.width / 2;
    spineBoy.position.y = renderer.height;

    spineBoy.scale.set(1.5);

    // set up the mixes!
    spineBoy.stateData.setMixByName('walk', 'jump', 0.2);
    spineBoy.stateData.setMixByName('jump', 'walk', 0.4);

    // play animation
    spineBoy.state.setAnimationByName(0, 'walk', true);

    stage.addChild(spineBoy);

    stage.on('touchstart', function ()
    {
        spineBoy.state.setAnimationByName(0, 'jump', false);
        spineBoy.state.addAnimationByName(0, 'jerkoff', true, 0);
    });
}

requestAnimationFrame(animate);

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(stage);
}