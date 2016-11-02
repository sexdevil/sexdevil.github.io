var webpack_photoViewer =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(6);

	var doT = __webpack_require__(8);

	var Baad = __webpack_require__(9);

	var photoViewerHTML = __webpack_require__(10);

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

/***/ },
/* 1 */,
/* 2 */,
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(7);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./photoViewer.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./photoViewer.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, ".photo-viewer-back{\n    background: #000;\n    position: fixed;\n    top: 0;\n    width: 100%;\n    min-height: 100%;\n    z-index: 999;\n    overflow: hidden;\n    font-size: 32px;\n}\n.photo-viewer-wrap{\n    height: 100%;\n    z-index: 1001;\n    position: absolute;\n    top: 50%;\n    transform: translate(0,-50%);\n    -webkit-transform: translate(0,-50%);\n    overflow: visible;\n}\n.photo-viewer-item{\n    height: 100%;\n    width:100%;\n    position: relative;\n    display: block;\n    overflow: hidden;\n    float: left;\n}\n.photo-viewer-item > img {\n    margin: 0 auto;\n    display: block;\n}\n.photo-viewer-item img{\n    opacity: 1;\n    display: block;\n    height: auto;\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    transform: translate3d(-50%,-50%,0) scale(0.5);\n    -webkit-transform: translate3d(-50%,-50%,0) scale(0.5);\n    width: 100%;\n    transition: .5s ;\n    -webkit-transition: .5s;\n    visibility: hidden;\n}\n.photo-viewer-item .img-loaded{\n    transform: translate3d(-50%,-50%,0) scale(1);\n    -webkit-transform: translate3d(-50%,-50%,0) scale(1);\n    visibility: visible;\n}\n.photo-viewer-content{\n    height: 100%;\n    z-index: 1002;\n    position: absolute;\n    top: 50%;\n    transform: translate(0,-50%);\n    -webkit-transform: translate(0,-50%);\n    overflow: hidden;\n    width: 100%;\n    margin: 0 auto;\n}\n.bnrs-indic-wrap {\n    position: absolute;\n    bottom: 8px;\n    width: 100%;\n    text-align: center;\n    height: 8px;\n    line-height: 8px;\n}\n.bnrs-indic {\n    width: 5px;\n    height: 5px;\n    background: #ddd;\n    border: 0;\n    margin: 0;\n    vertical-align: middle;\n    -moz-border-radius: 50%;\n    -webkit-border-radius: 50%;\n    border-radius: 50%;\n     display: inline-block;\n}\n\n.bnrs-indic-wrap .indic-focus {\n    width: 7px;\n    height: 7px;\n    background: #ffb900;\n}\n\n.bnrs-indic-wrap {\n    z-index: 1007;\n    bottom: 0;\n    height: 20px;\n}\n.bnrs-indic {\n    margin-top: 2px;\n}\n.photo-viewer-inner{\n    height: 100%;\n    width: 100%;\n    overflow: hidden;\n}\n.loading-card {\n    width: 100%;\n    height: 100%;\n    position: absolute;\n    left: 0;\n    top: 0;\n    z-index: 1003;\n}\n@-webkit-keyframes line-spin-fade-loader {\n    50% {\n        opacity: 0.3;\n    }\n    100% {\n        opacity: 1;\n    }\n}\n@keyframes line-spin-fade-loader {\n    50% {\n        opacity: 0.3;\n    }\n    100% {\n        opacity: 1;\n    }\n}\n.line-spin-fade-loader-outter {\n    background: rgba(0, 0, 0, 0.2);\n    width: 50px;\n    height: 50px;\n    position: absolute;\n    left: 50%;\n    top: 50%;\n    border-radius: 5px;\n    transform: translate(-50%, -50%);\n    -webkit-transform: translate(-50%, -50%);\n}\n.line-spin-fade-loader {\n    position: absolute;\n    height: 60px;\n    width: 60px;\n    left: 50%;\n    top: 50%;\n    margin-left: -15px;\n    margin-top: -15px;\n    transform-origin: 0 0;\n    -webkit-transform-origin: 0 0;\n    transform: scale(0.5);\n    -webkit-transform: scale(0.5);\n}\n.line-spin-fade-loader > div:nth-child(1) {\n    top: 40px;\n    left: 25px;\n    -webkit-animation: line-spin-fade-loader 1.2s 0.12s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.12s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(2) {\n    top: 33.63636px;\n    left: 38.63636px;\n    -webkit-transform: rotate(-45deg);\n    -ms-transform: rotate(-45deg);\n    transform: rotate(-45deg);\n    -webkit-animation: line-spin-fade-loader 1.2s 0.24s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.24s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(3) {\n    top: 20px;\n    left: 45px;\n    -webkit-transform: rotate(90deg);\n    -ms-transform: rotate(90deg);\n    transform: rotate(90deg);\n    -webkit-animation: line-spin-fade-loader 1.2s 0.36s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.36s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(4) {\n    top: 6.36364px;\n    left: 38.63636px;\n    -webkit-transform: rotate(45deg);\n    -ms-transform: rotate(45deg);\n    transform: rotate(45deg);\n    -webkit-animation: line-spin-fade-loader 1.2s 0.48s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.48s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(5) {\n    top: 0px;\n    left: 25px;\n    -webkit-animation: line-spin-fade-loader 1.2s 0.6s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.6s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(6) {\n    top: 6.36364px;\n    left: 11.36364px;\n    -webkit-transform: rotate(-45deg);\n    -ms-transform: rotate(-45deg);\n    transform: rotate(-45deg);\n    -webkit-animation: line-spin-fade-loader 1.2s 0.72s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.72s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(7) {\n    top: 20px;\n    left: 5px;\n    -webkit-transform: rotate(90deg);\n    -ms-transform: rotate(90deg);\n    transform: rotate(90deg);\n    -webkit-animation: line-spin-fade-loader 1.2s 0.84s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.84s infinite ease-in-out;\n}\n.line-spin-fade-loader > div:nth-child(8) {\n    top: 33.63636px;\n    left: 11.36364px;\n    -webkit-transform: rotate(45deg);\n    -ms-transform: rotate(45deg);\n    transform: rotate(45deg);\n    -webkit-animation: line-spin-fade-loader 1.2s 0.96s infinite ease-in-out;\n    animation: line-spin-fade-loader 1.2s 0.96s infinite ease-in-out;\n}\n.line-spin-fade-loader > div {\n    background-color: #fff;\n    width: 4px;\n    height: 35px;\n    border-radius: 2px;\n    margin: 2px;\n    -webkit-animation-fill-mode: both;\n    animation-fill-mode: both;\n    position: absolute;\n    width: 5px;\n    height: 15px;\n}\n.preload-img{\n    width: 100px;\n    display: block;\n    position: absolute;\n    top: 50%;\n    left:50%;\n    transform: translate(-50%,-50%);\n    -webkit-transform: translate(-50%,-50%);\n    z-index: 1000;\n}", ""]);

	// exports


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* Laura Doktorova https://github.com/olado/doT */
	(function(){function p(b,a,d){return("string"===typeof a?a:a.toString()).replace(b.define||h,function(a,c,e,g){0===c.indexOf("def.")&&(c=c.substring(4));c in d||(":"===e?(b.defineParams&&g.replace(b.defineParams,function(a,b,l){d[c]={arg:b,text:l}}),c in d||(d[c]=g)):(new Function("def","def['"+c+"']="+g))(d));return""}).replace(b.use||h,function(a,c){b.useParams&&(c=c.replace(b.useParams,function(a,b,c,l){if(d[c]&&d[c].arg&&l)return a=(c+":"+l).replace(/'|\\/g,"_"),d.__exp=d.__exp||{},d.__exp[a]=
	d[c].text.replace(new RegExp("(^|[^\\w$])"+d[c].arg+"([^\\w$])","g"),"$1"+l+"$2"),b+"def.__exp['"+a+"']"}));var e=(new Function("def","return "+c))(d);return e?p(b,e,d):e})}function k(b){return b.replace(/\\('|\\)/g,"$1").replace(/[\r\t\n]/g," ")}var f={version:"1.0.3",templateSettings:{evaluate:/\{\{([\s\S]+?(\}?)+)\}\}/g,interpolate:/\{\{=([\s\S]+?)\}\}/g,encode:/\{\{!([\s\S]+?)\}\}/g,use:/\{\{#([\s\S]+?)\}\}/g,useParams:/(^|[^\w$])def(?:\.|\[[\'\"])([\w$\.]+)(?:[\'\"]\])?\s*\:\s*([\w$\.]+|\"[^\"]+\"|\'[^\']+\'|\{[^\}]+\})/g,
	define:/\{\{##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\}\}/g,defineParams:/^\s*([\w$]+):([\s\S]+)/,conditional:/\{\{\?(\?)?\s*([\s\S]*?)\s*\}\}/g,iterate:/\{\{~\s*(?:\}\}|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\}\})/g,varname:"it",strip:!0,append:!0,selfcontained:!1,doNotSkipEncoded:!1},template:void 0,compile:void 0},m;f.encodeHTMLSource=function(b){var a={"&":"&#38;","<":"&#60;",">":"&#62;",'"':"&#34;","'":"&#39;","/":"&#47;"},d=b?/[&<>"'\/]/g:/&(?!#?\w+;)|<|>|"|'|\//g;return function(b){return b?
	b.toString().replace(d,function(b){return a[b]||b}):""}};m=function(){return this||(0,eval)("this")}();"undefined"!==typeof module&&module.exports?module.exports=f: true?!(__WEBPACK_AMD_DEFINE_RESULT__ = function(){return f}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)):m.doT=f;var r={start:"'+(",end:")+'",startencode:"'+encodeHTML("},s={start:"';out+=(",end:");out+='",startencode:"';out+=encodeHTML("},h=/$^/;f.template=function(b,a,d){a=a||f.templateSettings;var n=a.append?r:s,c,e=0,g;b=a.use||a.define?p(a,b,d||{}):b;b=("var out='"+(a.strip?
	b.replace(/(^|\r|\n)\t* +| +\t*(\r|\n|$)/g," ").replace(/\r|\n|\t|\/\*[\s\S]*?\*\//g,""):b).replace(/'|\\/g,"\\$&").replace(a.interpolate||h,function(b,a){return n.start+k(a)+n.end}).replace(a.encode||h,function(b,a){c=!0;return n.startencode+k(a)+n.end}).replace(a.conditional||h,function(b,a,c){return a?c?"';}else if("+k(c)+"){out+='":"';}else{out+='":c?"';if("+k(c)+"){out+='":"';}out+='"}).replace(a.iterate||h,function(b,a,c,d){if(!a)return"';} } out+='";e+=1;g=d||"i"+e;a=k(a);return"';var arr"+
	e+"="+a+";if(arr"+e+"){var "+c+","+g+"=-1,l"+e+"=arr"+e+".length-1;while("+g+"<l"+e+"){"+c+"=arr"+e+"["+g+"+=1];out+='"}).replace(a.evaluate||h,function(a,b){return"';"+k(b)+"out+='"})+"';return out;").replace(/\n/g,"\\n").replace(/\t/g,"\\t").replace(/\r/g,"\\r").replace(/(\s|;|\}|^|\{)out\+='';/g,"$1").replace(/\+''/g,"");c&&(a.selfcontained||!m||m._encodeHTML||(m._encodeHTML=f.encodeHTMLSource(a.doNotSkipEncoded)),b="var encodeHTML = typeof _encodeHTML !== 'undefined' ? _encodeHTML : ("+f.encodeHTMLSource.toString()+
	"("+(a.doNotSkipEncoded||"")+"));"+b);try{return new Function(a.varname,b)}catch(q){throw"undefined"!==typeof console&&console.log("Could not create a template function: "+b),q;}};f.compile=function(b,a){return f.template(b,null,a)}})();


/***/ },
/* 9 */
/***/ function(module, exports) {

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


/***/ },
/* 10 */
/***/ function(module, exports) {

	module.exports = "<div id=\"photo-viewer\" class=\"photo-viewer-back\">\n    <div class=\"loading-card\">\n        <div class=\"line-spin-fade-loader-outter\">\n            <div class=\"line-spin-fade-loader\">\n                <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>\n            </div>\n        </div>\n    </div>\n    <section class=\"photo-viewer-content\">\n        {{? !!it.preloadImage}}<img src=\"{{=it.preloadImage.lowLevel}}\" class=\"preload-img\">{{?}}\n        <div id=\"photo-viewer-inner\" class=\"photo-viewer-inner\" data-action=\"destoryPhoto\">\n            {{~it.imgList :value:index }}\n            <a class=\"photo-viewer-item\" href=\"javascript:;\" data-action=\"destoryPhoto\" style=\"width:{{=it.windowWidth}}px;\"> <img data-action=\"destoryPhoto\" data-hook='photoImgage' src=\"{{=value.highLevel}}\" style=\"opacity: 1;\"> </a>\n            {{~}}\n        </div>\n    </section>\n    <div id=\"bnrs-indic-wrap\" style=\"display: none\" class=\"bnrs-indic-wrap\">\n        {{~it.imgList :value:index }}\n        <i class=\"j-indic{{=(index+1)}} i-circle bnrs-indic {{? index==0}}indic-focus{{?}}\"></i>\n        {{~}}\n    </div>\n</div>";

/***/ }
/******/ ]);