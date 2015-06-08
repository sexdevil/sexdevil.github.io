

var MyScene = cc.Scene.extend({
                          onEnter:function () {
                              this._super();
                              var textLayer = new TextLayer();
                              this.addChild(textLayer,1)
                          }
                      });