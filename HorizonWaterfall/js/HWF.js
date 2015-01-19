//http://try.fashion.sina.com.cn/home/api/?s=front&a=get_beauty_timeline&order=push&page=1&size=50&_=1421565600632


(function (){
    var that;
    function HWF (dataAry,container){
        this.dataAry=dataAry;
        this.container = container;
        this.standardWidth = container.offsetWidth;
        this.standardHeight = this.standardWidth/5;
        this.domAry = [];
        this.initDom();
        that = this;
    }
    
    HWF.prototype.initDom = function(){
        for(var i=0;i<this.dataAry.length;i++){
            var div = document.createElement('div');
            div.className='imgWrapper';
            var img = document.createElement('img');
            img.className='HWFImg';
            img.src=this.dataAry[i].url;
            div.appendChild(img);
            this.domAry.push({div:div,owidth:this.dataAry[i].width,oheight:this.dataAry[i].height});
            this.container.appendChild(div);
        }
        this.layOut();
    }
    HWF.prototype.layOut = function (){
        for(var i=0;i<this.domAry.length;i++){   
            this.domAry[i].width = this.domAry[i].owidth;
            this.domAry[i].height = this.domAry[i].oheight;
            this.domAry[i].width = 300/this.domAry[i].height*this.domAry[i].width ;
            this.domAry[i].height=300;
            this.domAry[i].leftPx=0;
        }
        var lineWidth =0;
        var startIndex=0;
        this.topPx = 0;
        for(var i=0;i<this.domAry.length;i++){
            lineWidth+=(this.domAry[i].width+10);
            if(lineWidth>=this.standardWidth && i-startIndex>=3){
                this.resizeLine(this.domAry.slice(startIndex,i),lineWidth-this.domAry[i].width);                              
                lineWidth = this.domAry[i].width;
                startIndex = i;
            }
        }
        
        
    }
    
    HWF.prototype.resizeLine=function (lineAry,_lineW){
           var scaleRate= this.standardWidth/_lineW;
           var left=0;
           for(var i=0;i<lineAry.length;i++){
              lineAry[i].div.style.width = (lineAry[i].width * scaleRate) + "px";
              lineAry[i].div.style.height = (lineAry[i].height * scaleRate) + "px";
              lineAry[i].width = lineAry[i].width * scaleRate;
              lineAry[i].height = lineAry[i].height * scaleRate
              left+=lineAry[i].width;
              if(!!lineAry[i+1]){
                left = left+4
                lineAry[i+1].leftPx=left;  
              }

           }
           
           for(var i=0;i<lineAry.length-1;i++){
               lineAry[i].div.style.left=lineAry[i].leftPx+"px";
               lineAry[i].div.style.top = this.topPx +'px';
           }
           lineAry[lineAry.length-1].div.style.top = this.topPx +'px';
           lineAry[lineAry.length-1].div.style.right='0px';
           this.topPx  =this.topPx +(lineAry[0].height+20);
           
        }
    var resizeHandle = function (){
        that.standardWidth = that.container.offsetWidth;
        that.standardHeight = that.standardHeight/5
        that.layOut();
    }    
        
    window.onresize = function (){
        window.clearTimeout(resizeHandle)
        setTimeout(resizeHandle,100);
    }
    window.HWF = HWF;
})()