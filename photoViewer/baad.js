function Baad(){
        this._jQbannerElem = null
        this._jQindicator = null
            this._transTime = 0
            this._picWidth = 0
        this._duration = 0
        this._animating = true  //用于标识当前是否需要动画，在手指操作的时候不需要动画
        this._currIdx = 1 //当前的图片编号
        this._currPos = 0  //当前的偏移量
        this._picNum = 0
        this._animateInterval = null
        this._currIndicator = 0;
        this.enable = true ; //开关 是否启用滑动事件
        this.clickStartTime=0 ;//标示点击开始事件
        this.clickMoved = false ;//标示是否触发过touchmove
}


Baad.prototype.init = function(options) {
    this._jQbannerElem = options.jQbannerElem;
    this._jQindicator = options.jQindicator;
    this._transTime = (options.transTime || 500)/1000;
    this._picWidth = options.picWidth;
    this._duration = options.duration || 5000;
    this._disableAutoPlay = options.disableAutoPlay=='undefined'?false:options.disableAutoPlay;//禁用自动播放
    this._picNum = this._jQbannerElem.children().size();

    this._prepare();
    this._beginAnimate();
    this._initSwipe();
}

Baad.prototype._prepare = function() {
    var jQbannerElems = this._jQbannerElem.children();
    var picNum = this._picNum;
    //左右各插入一个元素
    this._jQbannerElem.prepend($(jQbannerElems.get(picNum-1)).clone());
    this._jQbannerElem.append($(jQbannerElems.get(0)).clone());
    this._jQbannerElem.css({
        'width':this._picWidth*(picNum+2) //左右各插了一个
    });
    this._moveToIdx(1,0);
}

Baad.prototype._beginAnimate = function() {
    var self = this;
    this._stopAnimate();
    this._animateInterval = setInterval(function() {
        if (self._animating && !self._disableAutoPlay) {
            self._adjust();
            setTimeout(function() { //设一个延迟是为了让上一个动作完全完成，时间非常短，不会造成视觉延迟
                self._moveToIdx(self._currIdx+1);
            },1);
        }
    },self._duration-self._transTime);
}

    Baad.prototype._stopAnimate = function() {
    if (this._animateInterval) {
        clearInterval(this._animateInterval);
        this._animateInterval = null;
    }
}

Baad.prototype._moveToIdx = function(idx,duration) {
    this._currIdx = idx;
    this._moveToPos(-this._picWidth*idx,duration);
    this._setIndicator(this._currIdx);
}

Baad.prototype._moveToPos = function(pos,duration) {
    if (duration==null) duration = this._transTime;
    this._currPos = pos;
    this._jQbannerElem.css({
        '-webkit-transform':'translate3d('+pos+'px,0,0)',
        'transform':'translate3d('+pos+'px,0,0)',
        '-webkit-transition':'-webkit-transform '+duration+'s',
        'transition':'transform '+duration+'s'
    });
}

Baad.prototype._setIndicator = function(idx) {
    if (!this._jQindicator) return;
    idx = this._getRealIdx(idx);
    this._jQindicator.find('.j-indic'+this._currIndicator).removeClass('indic-focus');
    this._jQindicator.find('.j-indic'+idx).addClass('indic-focus');
    this._currIndicator = idx;
}

Baad.prototype._getRealIdx = function(idx) {
    if (idx==0) {
        idx = this._picNum;
    } else if (idx==this._picNum+1) {
        idx = 1;
    }
    return idx;
}

Baad.prototype._adjust = function() {
    this._moveToIdx(this._getRealIdx(this._currIdx),0);
}

Baad.prototype.moveNext = function() {
    this._moveToIdx(this._currIdx+1,0.3);
}
Baad.prototype.movePrev = function() {
    this._moveToIdx(this._currIdx-1,0.3);
}

    Baad.prototype._initSwipe = function() {
    var self = this;
    var jQbannerElem = this._jQbannerElem;
    var lastPos;
    var lastEventPos;

    var onMove = function(event) {
        self.clickMoved = true;
        if(!self.enable){
            return;
        }
        var delta = event.touches[0].pageX - lastEventPos;
        lastEventPos = event.touches[0].pageX;
        self._moveToPos(self._currPos+delta,0);
        event.preventDefault(); //阻止鼠标引起的滚动条动作
      //  event.stopPropagation();
    };

    var moveEnd = function(event) {
        if(new Date().getTime() - self.clickStartTime <=300){
            if(!self.clickMoved){
                $(event.target).trigger('click');//由于禁用了默认事件，所以对于点击事件要自己触发一下
            }
        }
        if(!self.enable){
            jQbannerElem.off('touchmove',onMove);
            jQbannerElem.off('touchend touchcancel',moveEnd);
            return;
        }
        jQbannerElem.off('touchmove',onMove);
        jQbannerElem.off('touchend touchcancel',moveEnd);
        //根据当前图片的位置判断最后应该停在哪里
        var deltaPos = self._currPos - lastPos;
        if (deltaPos<0) {  //向左滑的
            self._moveToIdx(self._currIdx+1,0.3);
        } else if (deltaPos>0) {
            self._moveToIdx(self._currIdx-1,0.3);
        }
        self._animating = true;
        self._beginAnimate();

        if (deltaPos==0) {  //由于禁用了默认事件，所以对于点击事件要自己触发一下
            $(event.target).trigger('click');
        }

        event.preventDefault(); //阻止鼠标引起的滚动条动作
     //   event.stopPropagation();
    };

    jQbannerElem.on('touchstart',function(event) {
        self.clickStartTime = new Date().getTime();
        self.clickMoved = false;
        if(!self.enable){
            jQbannerElem.on('touchmove',onMove);
            jQbannerElem.on('touchend touchcancel',moveEnd);
            return;
        }
        self._animating = false;
        self._stopAnimate();
        self._adjust();
        lastPos = self._currPos;
        lastEventPos = event.touches[0].pageX;
        jQbannerElem.on('touchmove',onMove);
        jQbannerElem.on('touchend touchcancel',moveEnd);
        event.preventDefault(); //阻止鼠标引起的滚动条动作
       // event.stopPropagation();
    });
}
module.exports = function() {
    return new Baad()
}
