$(document).ready(function (){
    
    var provIDlist= [{id:"CN-34"},
        {id:"CN-11"},
        {id:"CN-50"},{id:"CN-35"},{id:"CN-44"},{id:"CN-62"},{id:"CN-45"},{id:"CN-52"},{id:"CN-46"},{id:"CN-13"},{id:"CN-41"},{id:"CN-91"},{id:"CN-23"},{id:"CN-43"},{id:"CN-42"},{id:"CN-22"},{id:"CN-32"},{id:"CN-36"},{id:"CN-21"},{id:"CN-92"},{id:"CN-15"},{id:"CN-64"},{id:"CN-63"},{id:"CN-61"},{id:"CN-51"},{id:"CN-37"},{id:"CN-31"},{id:"CN-14"},{id:"CN-12"},{id:"CN-71"},{id:"CN-65"},{id:"CN-54"},{id:"CN-53"},{id:"CN-33"},{id:"CN-YN"},{id:"CN-ZJ"}];
    
    var PlayerForce = 0;
    
    var elapsedTime = 0;
    
    var PlayerForceTime = 0;
    
    var provData=[];
    for(var i=0;i<provIDlist.length;i++){
        var a ={}; 
        a.provID = provIDlist[i].id ;
        a.provName = $(document.getElementById(provIDlist[i].id)).attr('title');
        a.$el = $(document.getElementById(provIDlist[i].id));
        a.status = 'normal';
        a.level = 0;
        provData.push(a);
        a = null;
    }
    
    
    $("path").on("touchstart",function (){
         for(var i=0;i<provData.length;i++){
             if(this.id == provData[i].provID){
                 if(PlayerForce >=1){
                 provData[i].status = 'fortifed';                
                 provData[i].level++;
                 PlayerForce--;
                 renderPath(provData[i])
                 renderPlayerForce(PlayerForce);
                 }
             }
         }     
    })
    
    var timmer = window.setTimeout(function (){
        timmerFun();
    },1000) 
    
   function timmerFun (){
       elapsedTime++;
       
       PlayerForceTime++;
       
       infect();
       
       PlayerForceAdd();
       
        timmer = window.setTimeout(function() {
            timmerFun();
        }, 1000) 
   }
       
    
    
    function  infect(){
        
    }
    
    function PlayerForceAdd(){
        if(PlayerForceTime>=5){
           PlayerForce++; 
           PlayerForceTime=0;
           renderPlayerForce(PlayerForce);
        }           
    }
    
    function renderPath(provData){
        var classname = provData.status;      
        provData.$el[0].classList.add(classname);
    }
    
    function renderPlayerForce(PlayerForce) {
       $("#playerForceDisplay .num").text(PlayerForce);
    }
})
