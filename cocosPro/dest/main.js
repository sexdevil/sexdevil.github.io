
//绑定事件



var MyScene = cc.Scene.extend({
    ctor: function() {
         this._super();
        this.bindEvent();
        this.preventDefault();
    },
    onEnter: function() {
        this._super();
        var textLayer = new TextLayer();
        this.addChild(textLayer, 1)
    },
    bindEvent: function() {
        var me = this;
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchBegan: function(touch, event) {
               console.log(TextLayer.label.x)
            },
            onTouchMoved: function(touch, event) {

            }
        }, MyScene)
        
    },
    preventDefault:function(){
        document.addEventListener('touchstart',function(e){
             e.preventDefault();
        })
        document.addEventListener('touchmove',function(e){
              e.preventDefault();
        })
        document.addEventListener('touchend',function(e){
              e.preventDefault();
        })
    }
});var TextLayer = cc.Layer.extend({
    
    label:null,
    deltaX:1,
    bg:null,
    frame:0,
    ctor:function(){
        this._super();
        
        var size = cc.director.getWinSize();
        this.label = cc.LabelTTF.create("Test", "Arial", 40);
        this.label.setPosition(size.width / 2, size.height / 2);
        this.bg = new cc.DrawNode();
        this.addChild(this.label, 1);
        this.addChild(this.bg)
        this.scheduleUpdate()
        return true;
    },
    update:function(){
        var size = cc.director.getWinSize();
        this.label.x += this.deltaX;
        if(this.label.x>=size.width|| this.label.x<=0){
            this.deltaX *= -1;
        }
        this.label.y = Math.sin(this.frame/20)*50 + size.height/2;
        this.bg.drawDot(new cc.Point(this.label.x,this.label.y),2,cc.color(255,255,255));
        this.frame++;
    }
    
    
})


  window.onload = function(){
      var a = document.getElementById('preload')
              a.parentNode.removeChild(a)
              cc.game.onStart = function(){
                  //load resources
                      cc.view.setDesignResolutionSize(720,1280,cc.ResolutionPolicy.SHOW_ALL)
                      cc.director.runScene(new MyScene());
              };
              cc.game.run("gameCanvas");
          };