$(document).ready(function (){
    $("path").on("touchstart mousedown",function (){
        if(this.classList.contains("selected")){
            this.classList.remove("selected")
        }else{
         this.classList.add("selected");   
        }       
    })
})
