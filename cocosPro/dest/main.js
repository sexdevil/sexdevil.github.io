var TextLayer = cc.Layer.extend({
    
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




var MyScene = cc.Scene.extend({
                          onEnter:function () {
                              this._super();
                              var textLayer = new TextLayer();
                              this.addChild(textLayer,1)
                          }
                      });  window.onload = function(){
              cc.game.onStart = function(){
                  //load resources
                      cc.director.runScene(new MyScene());
              };
              cc.game.run("gameCanvas");
          };