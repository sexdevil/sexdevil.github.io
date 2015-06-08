  window.onload = function(){
              cc.game.onStart = function(){
                  //load resources
                      cc.director.runScene(new MyScene());
              };
              cc.game.run("gameCanvas");
          };