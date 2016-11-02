require('./photoViewer.css');

var doT = require('./doT.js');

var Baad = require('./baad.js');

var photoViewerHTML = require('./photoViewer.html');

function compileHTML(html,data){
    var template = doT.template(html);
    return template(data)
}

function parseDom(arg) {

    var objE = document.createElement("div");

    objE.innerHTML = arg;

    return objE.childNodes[0];

};

function setCssPrefix($dom,key,value){
    var prefixList = ['-webkit-','']
    var cssResult = {};
    for(var i in prefixList){
        cssResult[prefixList[i]+key] = value
    }
    $dom.css(cssResult)
}

module.exports = function() {
    return {
        init:function(ops){
            var self = this;
            ops.order = ops.order=='undefined'?0:parseInt(ops.order);
            var resultHTML = compileHTML(photoViewerHTML,{
                imgList:ops.imgList,
                preloadImage:ops.imgList[ops.order],
                windowWidth:$(window).width()
            })

            this.moduleDom=parseDom(resultHTML)

            document.body.appendChild(this.moduleDom)

            this.$loadingDom = $('#photo-viewer .loading-card');
            this.$preLoadImage = $('#photo-viewer .preload-img');

            $("#photo-viewer-inner").find('img').eq(ops.order).on('load',function(){
                if(this.complete){
                    self.hideLoading();
                }
                $("#photo-viewer-inner img").addClass("img-loaded");
            })


            if(ops.imgList.length>1){
                this.baad(ops); //多图开启轮播 单图不管
                this.bindEvent();
                this.bindScaleEvent();
            }else{
                this.bindEvent();
                this.bindScaleEvent();//缩放处理
            }
            return this;
        },
        baad:function(ops){
            //轮播组件初始化
            $('#bnrs-indic-wrap').show();//显示播放按钮
            self.BAADObj= Baad();
            self.BAADObj.init({
                jQbannerElem: $('#photo-viewer-inner'),
                jQindicator: $('#bnrs-indic-wrap'),
                picWidth: $(window).width(),
                disableAutoPlay:ops.disableAutoPlay=='undefined'?true:ops.disableAutoPlay
            })
            self.BAADObj._moveToIdx(ops.order+1,0)
        },
        bindEvent:function(){
            var self = this;
            $('#photo-viewer').on('click',function(e){
                if($(e.target).attr('data-action') == 'destoryPhoto'){
                    self.destoryPhoto();
                }
            })
        },
        bindScaleEvent:function(){
            var pointersDistance = 0;//记录两个手指距离
            var scale = 1;//计算缩放比例
            var baseScale = 1;//存储上次手势缩放的比率
            var scrollX = 0 ;//x轴滚动
            var scrollY = 0 ;//y轴滚动
            var positionX = 0; //x坐标
            var positionY = 0  //y坐标
            var windowWidth = $(window).width();//窗口宽度
            var windowHeight = $(window).height();//窗口高度
            var $currentImage = $('#photo-viewer-inner img');
            var imgWidth = 0;
            var imgHeight =0;
            var leftTrigger = 0; // 两次超过右边界触发右侧滑动
            var rightTrigger = 0;// 两次超过左边界触发右侧滑动
            var enableMoving = false;//是否启用滑动
            var enableScale = false;//启用缩放
            $('#photo-viewer').on('touchstart',function(e){
                if($(e.touches[0].target).data('hook')=='photoImgage'){
                    enableMoving =true; //只有第一接触点是图片 才可移动
                        imgWidth = $(e.touches[0].target).width()/scale;
                        imgHeight = $(e.touches[0].target).height()/scale;
                }else{
                    enableMoving = false;
                }
                if(e.touches.length>=2){
                    pointersDistance = Math.sqrt((e.touches[1].pageX - e.touches[0].pageX)*(e.touches[1].pageX - e.touches[0].pageX)+(e.touches[1].pageY - e.touches[0].pageY)*(e.touches[1].pageY - e.touches[0].pageY))
                    if($(e.touches[0].target).data('hook')=='photoImgage' && $(e.touches[1].target).data('hook')=='photoImgage'){
                        enableScale = true;//两点都是图片 可以缩放
                    }else {
                        enableScale = false;
                    }
                }

                positionX = e.touches[0].pageX;
                positionY = e.touches[0].pageY;
                setCssPrefix($currentImage,'transition','0s');
                if(!!$currentImage.attr('data-scaleRate')){
                    baseScale =  $currentImage.attr('data-scaleRate')
                }
                if(baseScale<1){
                    baseScale=1
                }else if(baseScale>3){
                    baseScale=3
                }
                if(!!self.BAADObj)self.BAADObj.enable = false;
            })
            $('#photo-viewer').on('touchmove',function(e){
                //缩放
                if(e.touches.length>=2 && enableScale){
                    scale =baseScale * Math.sqrt((e.touches[1].pageX - e.touches[0].pageX)*(e.touches[1].pageX - e.touches[0].pageX)+(e.touches[1].pageY - e.touches[0].pageY)*(e.touches[1].pageY - e.touches[0].pageY))/pointersDistance
                    $currentImage.attr('data-scaleRate',scale)
                }
                if(scale!=1){
                    //滑动
                    if(enableMoving){
                        scrollX = scrollX + (e.touches[0].pageX - positionX);
                        scrollY = scrollY + (e.touches[0].pageY - positionY);
                    }
                    positionX = e.touches[0].pageX;
                    positionY = e.touches[0].pageY;
                    //合成全部变换
                    console.log('translate3d('+(scrollX-imgWidth)+'px,'+(scrollY-imgHeight/2)+'px,0) scale('+scale+')')
                    setCssPrefix($currentImage,'transform','translate3d('+(scrollX-imgWidth/2)+'px,'+(scrollY-imgHeight/2)+'px,0) scale('+scale+')');
                    if(!!self.BAADObj)self.BAADObj.enable = false;
                }else{
                    if(!!self.BAADObj)self.BAADObj.enable = true;
                }
                //ios 10 meta缩放禁止无效 使用js禁止
                e.preventDefault();
            })
            $('#photo-viewer').on('touchend',function(e){
                setCssPrefix($currentImage,'transition','.5s');
                if(scale<=1){
                    setCssPrefix($currentImage,'transform','translate3d(-50%,-50%,0) scale(1)');
                    console.log('<=1')
                    baseScale =1;
                    scale=1;
                    if(!!self.BAADObj)self.BAADObj.enable = true;
                    return; //过大或者过小 都恢复居中
                }else if(scale>3){
                    setCssPrefix($currentImage,'transform','translate3d(-50%,-50%,0) scale(3)');
                    baseScale =3;
                    scale =3;
                    if(!!self.BAADObj)self.BAADObj.enable = false;
                    return; //过大或者过小 都恢复居中
                }
                //滑动边界情况 (+/-)1/2*width*(scale-1)
                var rangeX = (1/2)*windowWidth*(scale-1);
                var rangeY = Math.abs((1/2)*(windowHeight-imgHeight*scale));
                if(scrollX<(-1)*rangeX){
                    scrollX = (-1)*rangeX
                    leftTrigger++;
                    rightTrigger=0;
                }else if(scrollX>rangeX){
                    scrollX = rangeX
                    rightTrigger++;
                    leftTrigger=0;
                }
                if(scrollY<(-1)*rangeY){
                    scrollY = (-1)*rangeY
                }else if(scrollY>rangeY){
                    scrollY = rangeY
                }
                //合成全部变换
                setCssPrefix($currentImage,'transform','translate3d('+(scrollX-imgWidth/2)+'px,'+(scrollY-imgHeight/2)+'px,0) scale('+scale+')');
                if(rightTrigger>=2){
                    if(!!self.BAADObj){
                        setCssPrefix($currentImage,'transform','translate3d(-50%,-50%,0) scale(1)');
                        rightTrigger = 0; //标志位归零
                        baseScale =1;
                        scale=1;
                        $currentImage.attr('data-scaleRate',1)
                        scrollX = 0;
                        scrollY = 0;
                        self.BAADObj.enable = true;
                        self.BAADObj.movePrev();
                    }
                }else if(leftTrigger>=2){
                    if(!!self.BAADObj){
                        setCssPrefix($currentImage,'transform','translate3d(-50%,-50%,0) scale(1)');
                        leftTrigger = 0; //标志位归零
                        baseScale =1;
                        scale=1;
                        $currentImage.attr('data-scaleRate',1)
                        scrollX = 0;
                        scrollY = 0;
                        self.BAADObj.enable = true;
                        self.BAADObj.moveNext();
                    }
                }

            })
        },
        showLoading:function(){
            this.$loadingDom.show()
        },
        hideLoading:function(){
            this.$loadingDom.hide()
            this.$preLoadImage.hide()
        },
        show:function(){
            this.moduleDom.style.display = 'block';
            return this;
        },
        hide:function(){
            this.moduleDom.style.display = 'none';
            return this;
        },
        destoryPhoto:function(){
            $('#photo-viewer').off('click');
            $('#photo-viewer').remove();
        }
    }
};