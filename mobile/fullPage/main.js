var card = {
	_events: {},
	_windowHeight: function() {
		return $(window).height()
	},
	_windowWidth: function() {
		return $(window).width()
	},
	_elementStyle: document.createElement("div").style,
	_page: $(".page"),
	_pageNum: $(".page").size(),
	_pageNow: 0,
	_pageNext: null,
	_touchStartValY: 0,
	_touchDeltaY: 0,
	_moveStart: true,
	_movePosition: null,
	_movePosition_c: null,
	_mouseDown: false,
	_moveFirst: true,
	_moveInit: false,
	_firstChange: false,
	_vendor: function() {
		var g = ["t", "webkitT", "MozT", "msT", "OT"],
			e, h = 0,
			f = g.length;
		for (; h < f; h++) {
			e = g[h] + "ransform";
			if (e in this._elementStyle) {
				return g[h].substr(0, g[h].length - 1)
			}
		}
		return false
	},
	_prefixStyle: function(b) {
		if (this._vendor() === false) {
			return false
		}
		if (this._vendor() === "") {
			return b
		}
		return this._vendor() + b.charAt(0).toUpperCase() + b.substr(1)
	},
	_hasPerspective: function() {
		var b = this._prefixStyle("perspective") in this._elementStyle;
		if (b && "webkitPerspective" in this._elementStyle) {
			this._injectStyles("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}", function(a, d) {
				b = a.offsetLeft === 9 && a.offsetHeight === 3
			})
		}
		return !!b
	},
	_translateZ: function() {
		if (card._hasPerspective) {
			return " translateZ(0)"
		} else {
			return ""
		}
	},
	_injectStyles: function(o, m, v, n) {
		var w, q, t, s, x = document.createElement("div"),
			r = document.body,
			u = r || document.createElement("body"),
			p = "modernizr";
		if (parseInt(v, 10)) {
			while (v--) {
				t = document.createElement("div");
				t.id = n ? n[v] : p + (v + 1);
				x.appendChild(t)
			}
		}
		w = ["&#173;", '<style id="s', p, '">', o, "</style>"].join("");
		x.id = p;
		(r ? x : u).innerHTML += w;
		u.appendChild(x);
		if (!r) {
			u.style.background = "";
			u.style.overflow = "hidden";
			s = docElement.style.overflow;
			docElement.style.overflow = "hidden";
			docElement.appendChild(u)
		}
		q = m(x, o);
		if (!r) {
			u.parentNode.removeChild(u);
			docElement.style.overflow = s
		} else {
			x.parentNode.removeChild(x)
		}
		return !!q
	},
	_handleEvent: function(f) {
		if (!this._events[f]) {
			return
		}
		var d = 0,
			e = this._events[f].length;
		if (!e) {
			return
		}
		for (; d < e; d++) {
			this._events[f][d].apply(this, [].slice.call(arguments, 1))
		}
	},
	_on: function(c, d) {
		if (!this._events[c]) {
			this._events[c] = []
		}
		this._events[c].push(d)
	},
	_scrollStop: function() {
		$(window).on("touchmove.scroll", this._scrollControl);
		$(window).on("scroll.scroll", this._scrollControl)
	},
	_scrollStart: function() {
		$(window).off("touchmove.scroll");
		$(window).off("scroll.scroll")
	},
	_scrollControl: function(b) {
		b.preventDefault()
	},
	page_start: function() {
		card._page.on("touchstart mousedown", card.page_touch_start);
		card._page.on("touchmove mousemove", card.page_touch_move);
		card._page.on("touchend mouseup", card.page_touch_end)
	},
	page_stop: function() {
		card._page.off("touchstart mousedown");
		card._page.off("touchmove mousemove");
		card._page.off("touchend mouseup")
	},
	page_touch_start: function(b) {
		if (!card._moveStart) {
			return
		}
		if (!window.webLimit || !webLimit) {
			return false
		}
		if (b.type == "touchstart") {
			card._touchStartValY = window.event.touches[0].pageY
		} else {
			card._touchStartValY = b.pageY || b.y;
			card._mouseDown = true
		}
		card._moveInit = true;
		card._handleEvent("start")
	},
	page_touch_move: function(h) {
		h.preventDefault();
		if (!card._moveStart) {
			return
		}
		if (!card._moveInit) {
			return
		}
		if (!window.webLimit || !webLimit) {
			return false
		}
		var g = card._page.eq(card._pageNow),
			f, e = null;
		if (h.type == "touchmove") {
			f = window.event.touches[0].pageY
		} else {
			if (card._mouseDown) {
				f = h.pageY || h.y
			} else {
				return
			}
		}
		e = card.page_position(h, f, g);
		card.page_translate(e);
		card._handleEvent("move")
	},
	page_position: function(j, e, i) {
		var h, l;
		if (e != "undefined") {
			card._touchDeltaY = e - card._touchStartValY
		}
		card._movePosition = card._touchDeltaY > 0 ? "down" : "up";
		if (card._movePosition != card._movePosition_c) {
			card._moveFirst = true;
			card._movePosition_c = card._movePosition
		} else {
			card._moveFirst = false
		}
		if (card._touchDeltaY <= 0) {
			if (i.next(".page").length == 0) {
				return
			} else {
				card._pageNext = card._pageNow + 1
			}
			l = card._page.eq(card._pageNext)[0]
		} else {
			if (i.prev(".page").length == 0) {
				return
			} else {
				card._pageNext = card._pageNow - 1
			}
			l = card._page.eq(card._pageNext)[0]
		}
		h = card._page.eq(card._pageNow)[0];
		node = [l, h];
		if (card._moveFirst) {
			k(node)
		}
		function k(a) {
			card._page.removeClass("action");
			$(a[1]).addClass("action").removeClass("hide");
			card._page.not(".action").addClass("hide");
			card.height_auto(card._page.eq(card._pageNext));
			$(a[0]).removeClass("hide").addClass("active");
			var c = Math.max($(window).height(), $(a[0]).height()),
				b = card._translateZ();
			if (card._movePosition == "up") {
				a[0].style[card._prefixStyle("transform")] = "translate(0," + c + "px)" + b;
				$(a[0]).attr("data-translate", c);
				$(a[1]).attr("data-translate", 0)
			} else {
				a[0].style[card._prefixStyle("transform")] = "translate(0,-" + c + "px)" + b;
				$(a[0]).attr("data-translate", -c);
				$(a[1]).attr("data-translate", 0)
			}
		}
		return node
	},
	page_translate: function(k) {
		if (!k) {
			return
		}
		var g = card._translateZ(),
			i = card._touchDeltaY,
			l, h, j;
		if ($(k[0]).attr("data-translate")) {
			l = i + parseInt($(k[0]).attr("data-translate"))
		}
		k[0].style[card._prefixStyle("transform")] = "translate(0," + l + "px)" + g;
		if ($(k[1]).attr("data-translate")) {
			h = i + parseInt($(k[1]).attr("data-translate"))
		}
		j = 1 - Math.abs(i * 0.2 / $(window).height());
		h = h * 0.2;
		k[1].style[card._prefixStyle("transform")] = "translate(0," + h + "px)" + g + " scale(" + j + ")"
	},
	page_touch_end: function(b) {
		card._moveInit = false;
		card._mouseDown = false;
		if (!card._moveStart) {
			return
		}
		if (!card._pageNext && card._pageNext != 0) {
			return
		}
		card._moveStart = false;
		if (Math.abs(card._touchDeltaY) > 10) {
			card._page.eq(card._pageNext)[0].style[card._prefixStyle("transition")] = "all .3s";
			card._page.eq(card._pageNow)[0].style[card._prefixStyle("transition")] = "all .3s"
		}
		if (Math.abs(card._touchDeltaY) >= 100) {
                        if(card._pageNext == card._pageNum-1){
                            $(".j_next").hide();
                        }else{
                            $(".j_next").show();
                        }
			card.page_success()
		} else {
			if (Math.abs(card._touchDeltaY) > 10 && Math.abs(card._touchDeltaY) < 100) {
				card.page_fial()
			} else {
				card.page_fial()
			}
		}
		card._handleEvent("end");
		card._movePosition = null;
		card._movePosition_c = null;
		card._touchStartValY = 0
	},
	page_success: function() {
		var e = card._translateZ();
		card._page.eq(card._pageNext)[0].style[card._prefixStyle("transform")] = "translate(0,0)" + e;
		var f = card._touchDeltaY > 0 ? $(window).height() * 0.2 : -$(window).height() * 0.2;
		var d = 1 - 0.2;
		card._page.eq(card._pageNow)[0].style[card._prefixStyle("transform")] = "translate(0," + f + "px)" + e + " scale(" + d + ")";
		card._handleEvent("success")
	},
	page_fial: function() {
		var b = card._translateZ();
		if (!card._pageNext && card._pageNext != 0) {
			card._moveStart = true;
			card._moveFirst = true;
			return
		}
		if (card._movePosition == "up") {
			card._page.eq(card._pageNext)[0].style[card._prefixStyle("transform")] = "translate(0," + $(window).height() + "px)" + b
		} else {
			card._page.eq(card._pageNext)[0].style[card._prefixStyle("transform")] = "translate(0,-" + $(window).height() + "px)" + b
		}
		card._page.eq(card._pageNow)[0].style[card._prefixStyle("transform")] = "translate(0,0)" + b + " scale(1)";
		card._handleEvent("fial")
	},
	haddle_envent_fn: function() {
		card._on("start", card.lazy_third_pic);
		card._on("move", function() {});
		card._on("end", function() {});
		card._on("fial", function() {
			setTimeout(function() {
				card._page.eq(card._pageNow).attr("data-translate", "");
				card._page.eq(card._pageNow)[0].style[card._prefixStyle("transform")] = "";
				card._page.eq(card._pageNow)[0].style[card._prefixStyle("transition")] = "";
				card._page.eq(card._pageNext)[0].style[card._prefixStyle("transform")] = "";
				card._page.eq(card._pageNext)[0].style[card._prefixStyle("transition")] = "";
				card._page.eq(card._pageNext).removeClass("active").addClass("hide");
				card._moveStart = true;
				card._moveFirst = true;
				card._pageNext = null;
				card._touchDeltaY = 0;
				card._page.eq(card._pageNow).attr("style", "")
			}, 300)
		});
		card._on("success", function() {
			if (card._pageNext == 0 && card._pageNow == card._pageNum - 1) {
				card._firstChange = true
			}
			setTimeout(function() {
				if (card._pageNext == card._pageNum - 1) {
					$(".u-arrow").addClass("hide")
				} else {
					$(".u-arrow").removeClass("hide")
				}
				card._page.eq(card._pageNow).addClass("hide");
				card._page.eq(card._pageNow).attr("data-translate", "");
				card._page.eq(card._pageNow)[0].style[card._prefixStyle("transform")] = "";
				card._page.eq(card._pageNow)[0].style[card._prefixStyle("transition")] = "";
				card._page.eq(card._pageNext)[0].style[card._prefixStyle("transform")] = "";
				card._page.eq(card._pageNext)[0].style[card._prefixStyle("transition")] = "";
				card._page.eq(card._pageNext).removeClass("active");
				card._pageNow = card._pageNext;
				card._moveStart = true;
				card._moveFirst = true;
				card._pageNext = null;
				card._page.eq(card._pageNow).attr("style", "");
				card._page.eq(card._pageNow).attr("data-translate", "");
				card._touchDeltaY = 0;
				setTimeout(function() {}, 20)
			}, 300)
		})
	},
	lazy_start: function() {
		setTimeout(function() {
			for (var d = 0; d < 3; d++) {
				var c = $(".m-page").eq(d);
				if (c.length == 0) {
					break
				}
				if (c.find(".lazy-img").length != 0) {
					card.lazy_images(c)
				} else {
					continue
				}
			}
		}, 200)
	},
	lazy_third_pic: function() {
		var d = 3;
		var c = $(".m-page").eq(card._pageNow + d);
		if (c.length == 0) {
			return false
		}
		if (c.find(".lazy-img").length != 0) {
			card.lazy_images(c)
		}
	},
	lazy_images: function(d, f) {
		var e = d.find(".lazy-img");
		e.each(function() {
			var c = $(this),
				a = c.attr("data-src"),
				h = c.attr("data-position"),
				b = c.attr("data-size");
			$("<img />").on("load", function() {
				if (c.is("img")) {
					c.attr("src", a)
				} else {
					c.css({
						"background-image": "url(" + a + ")",
						"background-position": h,
						"background-size": b
					})
				}
			}).attr("src", a);
			c.removeClass("lazy-img").addClass("lazy-finish")
		})
	},
	height_auto: function(b) {},
	styleInit: function() {
		document.body.style.userSelect = "none";
		document.body.style.mozUserSelect = "none";
		document.body.style.webkitUserSelect = "none";
		$(".u-arrow").removeClass("hide");
		$(".m-fengye").removeClass("hide");
		card.height_auto(card._page.eq(card._pageNow));
		$(".u-arrow").on("touchmove", function(b) {
			b.preventDefault()
		})
	},
	init: function() {
		setTimeout(function() {
			card.styleInit();
			card.haddle_envent_fn();
			card.page_start();
			card.lazy_start()
		}, 200)
	}
};
$(function() {
	function g() {
		var d = $(".j_audio"),
			k = d.data("audiourl"),
			b = d.find(".j_open"),
			a = d.find(".j_close"),
			l = null;
		l = document.createElement("audio");
		l.src = k;
		l.addEventListener("ended", function() {
			l.play()
		}, false);
		var c = navigator.userAgent;
		if (/ipad|iphone|mac/i.test(c) && c.indexOf("MicroMessenger") == -1) {
			a.show();
			l.isplay = false
		} else {
			l.play();
			b.show();
			l.isplay = true
		}
		b.on("click", function() {
			l.pause();
			b.hide();
			a.show();
			l.isplay = false
		});
		a.on("click", function() {
			l.play();
			b.show();
			a.hide();
			l.isplay = true
		})
	}
	function h() {}
	webLimit = true;
	var f = null,
		e = "onorientationchange" in window ? "orientationchange" : "resize";
	window.addEventListener(e, function() {
		if (f) {
			clearTimeout(f);
			f = null
		}
		f = setTimeout(function() {
			window.scrollTo(0, 0);
			h()
		}, 600)
	}, false);
	setTimeout(function() {
		window.scrollTo(0, 0);
		card.init()
	}, 500)
});