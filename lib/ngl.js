// rl - from /pdb/assets/wro/ngl.js?ver=20170328-1627
//    - removed NglController and related code in a separate file - see src/ngl-controller.js
//    - commented jira code
//    - added rcsbUrl for local env

var rcsbUrl = 'http://www.rcsb.org';

if (typeof jQuery != 'undefined') {
    console.info("Software Version: jQuery " + jQuery.fn.jquery);
    console.info("Software Version: Bootstrap " + $.fn.modal.Constructor.VERSION);
    $(document).ready(function() {
        if (jQuery) {
            if (jQuery.ui) {
                console.warn("WARNING: jQuery UI is being deprecated!\nSoftware Version: jQuery UI " + jQuery.ui.version);
            }
        }
        if (typeof Jmol != 'undefined') {
            if (typeof Jmol.___JmolVersion != 'undefined') {
                console.info("Software Version: JSmol " + Jmol.___JmolVersion)
            }
        }
    });
} else {
    console.error("No jQuery loaded!");
    document.getElementById("UnsupportedBrowser").className = "hidden-print";
};
/**
 * Cookie plugin
 *
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function(name, value, options) {
    if (typeof value != 'undefined') {
        options = options || {};
        if (value === null) {
            value = '';
            options = $.extend({}, options);
            options.expires = -1;
        }
        var expires = '';
        if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
            var date;
            if (typeof options.expires == 'number') {
                date = new Date();
                date.setTime(date.getTime() + (options.expires * 24 * 60 * 60 * 1000));
            } else {
                date = options.expires;
            }
            expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + (options.path) : '';
        var domain = options.domain ? '; domain=' + (options.domain) : '';
        var secure = options.secure ? '; secure' : '';
        document.cookie = [name, '=', encodeURIComponent(value), expires, path, domain, secure].join('');
    } else {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
};
/*
 * jQuery Cycle Plugin (with Transition Definitions)
 * Examples and documentation at: http://jquery.malsup.com/cycle/
 * Copyright (c) 2007-2009 M. Alsup
 * Version: 2.74 (03-FEB-2010)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires: jQuery v1.2.6 or later
 */
(function($) {
    var ver = "2.74";
    if ($.support == undefined) {
        $.support = {
            opacity: !($.browser.msie)
        };
    }

    function debug(s) {
        if ($.fn.cycle.debug) {
            log(s);
        }
    }

    function log() {
        if (window.console && window.console.log) {
            window.console.log("[cycle] " + Array.prototype.join.call(arguments, " "));
        }
    }
    $.fn.cycle = function(options, arg2) {
        var o = {
            s: this.selector,
            c: this.context
        };
        if (this.length === 0 && options != "stop") {
            if (!$.isReady && o.s) {
                log("DOM not ready, queuing slideshow");
                $(function() {
                    $(o.s, o.c).cycle(options, arg2);
                });
                return this;
            }
            log("terminating; zero elements found by selector" + ($.isReady ? "" : " (DOM not ready)"));
            return this;
        }
        return this.each(function() {
            var opts = handleArguments(this, options, arg2);
            if (opts === false) {
                return;
            }
            if (this.cycleTimeout) {
                clearTimeout(this.cycleTimeout);
            }
            this.cycleTimeout = this.cyclePause = 0;
            var $cont = $(this);
            var $slides = opts.slideExpr ? $(opts.slideExpr, this) : $cont.children();
            var els = $slides.get();
            if (els.length < 2) {
                log("terminating; too few slides: " + els.length);
                return;
            }
            var opts2 = buildOptions($cont, $slides, els, opts, o);
            if (opts2 === false) {
                return;
            }
            var startTime = opts2.continuous ? 10 : getTimeout(opts2.currSlide, opts2.nextSlide, opts2, !opts2.rev);
            if (startTime) {
                startTime += (opts2.delay || 0);
                if (startTime < 10) {
                    startTime = 10;
                }
                debug("first timeout: " + startTime);
                this.cycleTimeout = setTimeout(function() {
                    go(els, opts2, 0, !opts2.rev);
                }, startTime);
            }
        });
    };

    function handleArguments(cont, options, arg2) {
        if (cont.cycleStop == undefined) {
            cont.cycleStop = 0;
        }
        if (options === undefined || options === null) {
            options = {};
        }
        if (options.constructor == String) {
            switch (options) {
                case "stop":
                    cont.cycleStop++;
                    if (cont.cycleTimeout) {
                        clearTimeout(cont.cycleTimeout);
                    }
                    cont.cycleTimeout = 0;
                    $(cont).removeData("cycle.opts");
                    return false;
                case "toggle":
                    cont.cyclePause = (cont.cyclePause === 1) ? 0 : 1;
                    return false;
                case "pause":
                    cont.cyclePause = 1;
                    return false;
                case "resume":
                    cont.cyclePause = 0;
                    if (arg2 === true) {
                        options = $(cont).data("cycle.opts");
                        if (!options) {
                            log("options not found, can not resume");
                            return false;
                        }
                        if (cont.cycleTimeout) {
                            clearTimeout(cont.cycleTimeout);
                            cont.cycleTimeout = 0;
                        }
                        go(options.elements, options, 1, 1);
                    }
                    return false;
                case "prev":
                case "next":
                    var opts = $(cont).data("cycle.opts");
                    if (!opts) {
                        log('options not found, "prev/next" ignored');
                        return false;
                    }
                    $.fn.cycle[options](opts);
                    return false;
                default:
                    options = {
                        fx: options
                    };
            }
            return options;
        } else {
            if (options.constructor == Number) {
                var num = options;
                options = $(cont).data("cycle.opts");
                if (!options) {
                    log("options not found, can not advance slide");
                    return false;
                }
                if (num < 0 || num >= options.elements.length) {
                    log("invalid slide index: " + num);
                    return false;
                }
                options.nextSlide = num;
                if (cont.cycleTimeout) {
                    clearTimeout(cont.cycleTimeout);
                    cont.cycleTimeout = 0;
                }
                if (typeof arg2 == "string") {
                    options.oneTimeFx = arg2;
                }
                go(options.elements, options, 1, num >= options.currSlide);
                return false;
            }
        }
        return options;
    }

    function removeFilter(el, opts) {
        if (!$.support.opacity && opts.cleartype && el.style.filter) {
            try {
                el.style.removeAttribute("filter");
            } catch (smother) {}
        }
    }

    function buildOptions($cont, $slides, els, options, o) {
        var opts = $.extend({}, $.fn.cycle.defaults, options || {}, $.metadata ? $cont.metadata() : $.meta ? $cont.data() : {});
        if (opts.autostop) {
            opts.countdown = opts.autostopCount || els.length;
        }
        var cont = $cont[0];
        $cont.data("cycle.opts", opts);
        opts.$cont = $cont;
        opts.stopCount = cont.cycleStop;
        opts.elements = els;
        opts.before = opts.before ? [opts.before] : [];
        opts.after = opts.after ? [opts.after] : [];
        opts.after.unshift(function() {
            opts.busy = 0;
        });
        if (!$.support.opacity && opts.cleartype) {
            opts.after.push(function() {
                removeFilter(this, opts);
            });
        }
        if (opts.continuous) {
            opts.after.push(function() {
                go(els, opts, 0, !opts.rev);
            });
        }
        saveOriginalOpts(opts);
        if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg) {
            clearTypeFix($slides);
        }
        if ($cont.css("position") == "static") {
            $cont.css("position", "relative");
        }
        if (opts.width) {
            $cont.width(opts.width);
        }
        if (opts.height && opts.height != "auto") {
            $cont.height(opts.height);
        }
        if (opts.startingSlide) {
            opts.startingSlide = parseInt(opts.startingSlide);
        }
        if (opts.random) {
            opts.randomMap = [];
            for (var i = 0; i < els.length; i++) {
                opts.randomMap.push(i);
            }
            opts.randomMap.sort(function(a, b) {
                return Math.random() - 0.5;
            });
            opts.randomIndex = 0;
            opts.startingSlide = opts.randomMap[0];
        } else {
            if (opts.startingSlide >= els.length) {
                opts.startingSlide = 0;
            }
        }
        opts.currSlide = opts.startingSlide = opts.startingSlide || 0;
        var first = opts.startingSlide;
        $slides.css({
            position: "absolute",
            top: 0,
            left: 0
        }).hide().each(function(i) {
            var z = first ? i >= first ? els.length - (i - first) : first - i : els.length - i;
            $(this).css("z-index", z);
        });
        $(els[first]).css("opacity", 1).show();
        removeFilter(els[first], opts);
        if (opts.fit && opts.width) {
            $slides.width(opts.width);
        }
        if (opts.fit && opts.height && opts.height != "auto") {
            $slides.height(opts.height);
        }
        var reshape = opts.containerResize && !$cont.innerHeight();
        if (reshape) {
            var maxw = 0,
                maxh = 0;
            for (var j = 0; j < els.length; j++) {
                var $e = $(els[j]),
                    e = $e[0],
                    w = $e.outerWidth(),
                    h = $e.outerHeight();
                if (!w) {
                    w = e.offsetWidth;
                }
                if (!h) {
                    h = e.offsetHeight;
                }
                maxw = w > maxw ? w : maxw;
                maxh = h > maxh ? h : maxh;
            }
            if (maxw > 0 && maxh > 0) {
                $cont.css({
                    width: maxw + "px",
                    height: maxh + "px"
                });
            }
        }
        if (opts.pause) {
            $cont.hover(function() {
                this.cyclePause++;
            }, function() {
                this.cyclePause--;
            });
        }
        if (supportMultiTransitions(opts) === false) {
            return false;
        }
        var requeue = false;
        options.requeueAttempts = options.requeueAttempts || 0;
        $slides.each(function() {
            var $el = $(this);
            this.cycleH = (opts.fit && opts.height) ? opts.height : $el.height();
            this.cycleW = (opts.fit && opts.width) ? opts.width : $el.width();
            if ($el.is("img")) {
                var loadingIE = ($.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete);
                var loadingFF = ($.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete);
                var loadingOp = ($.browser.opera && ((this.cycleW == 42 && this.cycleH == 19) || (this.cycleW == 37 && this.cycleH == 17)) && !this.complete);
                var loadingOther = (this.cycleH == 0 && this.cycleW == 0 && !this.complete);
                if (loadingIE || loadingFF || loadingOp || loadingOther) {
                    if (o.s && opts.requeueOnImageNotLoaded && ++options.requeueAttempts < 100) {
                        log(options.requeueAttempts, " - img slide not loaded, requeuing slideshow: ", this.src, this.cycleW, this.cycleH);
                        setTimeout(function() {
                            $(o.s, o.c).cycle(options);
                        }, opts.requeueTimeout);
                        requeue = true;
                        return false;
                    } else {
                        log("could not determine size of image: " + this.src, this.cycleW, this.cycleH);
                    }
                }
            }
            return true;
        });
        if (requeue) {
            return false;
        }
        opts.cssBefore = opts.cssBefore || {};
        opts.animIn = opts.animIn || {};
        opts.animOut = opts.animOut || {};
        $slides.not(":eq(" + first + ")").css(opts.cssBefore);
        if (opts.cssFirst) {
            $($slides[first]).css(opts.cssFirst);
        }
        if (opts.timeout) {
            opts.timeout = parseInt(opts.timeout);
            if (opts.speed.constructor == String) {
                opts.speed = $.fx.speeds[opts.speed] || parseInt(opts.speed);
            }
            if (!opts.sync) {
                opts.speed = opts.speed / 2;
            }
            while ((opts.timeout - opts.speed) < 250) {
                opts.timeout += opts.speed;
            }
        }
        if (opts.easing) {
            opts.easeIn = opts.easeOut = opts.easing;
        }
        if (!opts.speedIn) {
            opts.speedIn = opts.speed;
        }
        if (!opts.speedOut) {
            opts.speedOut = opts.speed;
        }
        opts.slideCount = els.length;
        opts.currSlide = opts.lastSlide = first;
        if (opts.random) {
            opts.nextSlide = opts.currSlide;
            if (++opts.randomIndex == els.length) {
                opts.randomIndex = 0;
            }
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else {
            opts.nextSlide = opts.startingSlide >= (els.length - 1) ? 0 : opts.startingSlide + 1;
        }
        if (!opts.multiFx) {
            var init = $.fn.cycle.transitions[opts.fx];
            if ($.isFunction(init)) {
                init($cont, $slides, opts);
            } else {
                if (opts.fx != "custom" && !opts.multiFx) {
                    log("unknown transition: " + opts.fx, "; slideshow terminating");
                    return false;
                }
            }
        }
        var e0 = $slides[first];
        if (opts.before.length) {
            opts.before[0].apply(e0, [e0, e0, opts, true]);
        }
        if (opts.after.length > 1) {
            opts.after[1].apply(e0, [e0, e0, opts, true]);
        }
        if (opts.next) {
            $(opts.next).bind(opts.prevNextEvent, function() {
                return advance(opts, opts.rev ? -1 : 1);
            });
        }
        if (opts.prev) {
            $(opts.prev).bind(opts.prevNextEvent, function() {
                return advance(opts, opts.rev ? 1 : -1);
            });
        }
        if (opts.pager) {
            buildPager(els, opts);
        }
        exposeAddSlide(opts, els);
        return opts;
    }

    function saveOriginalOpts(opts) {
        opts.original = {
            before: [],
            after: []
        };
        opts.original.cssBefore = $.extend({}, opts.cssBefore);
        opts.original.cssAfter = $.extend({}, opts.cssAfter);
        opts.original.animIn = $.extend({}, opts.animIn);
        opts.original.animOut = $.extend({}, opts.animOut);
        $.each(opts.before, function() {
            opts.original.before.push(this);
        });
        $.each(opts.after, function() {
            opts.original.after.push(this);
        });
    }

    function supportMultiTransitions(opts) {
        var i, tx, txs = $.fn.cycle.transitions;
        if (opts.fx.indexOf(",") > 0) {
            opts.multiFx = true;
            opts.fxs = opts.fx.replace(/\s*/g, "").split(",");
            for (i = 0; i < opts.fxs.length; i++) {
                var fx = opts.fxs[i];
                tx = txs[fx];
                if (!tx || !txs.hasOwnProperty(fx) || !$.isFunction(tx)) {
                    log("discarding unknown transition: ", fx);
                    opts.fxs.splice(i, 1);
                    i--;
                }
            }
            if (!opts.fxs.length) {
                log("No valid transitions named; slideshow terminating.");
                return false;
            }
        } else {
            if (opts.fx == "all") {
                opts.multiFx = true;
                opts.fxs = [];
                for (p in txs) {
                    tx = txs[p];
                    if (txs.hasOwnProperty(p) && $.isFunction(tx)) {
                        opts.fxs.push(p);
                    }
                }
            }
        }
        if (opts.multiFx && opts.randomizeEffects) {
            var r1 = Math.floor(Math.random() * 20) + 30;
            for (i = 0; i < r1; i++) {
                var r2 = Math.floor(Math.random() * opts.fxs.length);
                opts.fxs.push(opts.fxs.splice(r2, 1)[0]);
            }
            debug("randomized fx sequence: ", opts.fxs);
        }
        return true;
    }

    function exposeAddSlide(opts, els) {
        opts.addSlide = function(newSlide, prepend) {
            var $s = $(newSlide),
                s = $s[0];
            if (!opts.autostopCount) {
                opts.countdown++;
            }
            els[prepend ? "unshift" : "push"](s);
            if (opts.els) {
                opts.els[prepend ? "unshift" : "push"](s);
            }
            opts.slideCount = els.length;
            $s.css("position", "absolute");
            $s[prepend ? "prependTo" : "appendTo"](opts.$cont);
            if (prepend) {
                opts.currSlide++;
                opts.nextSlide++;
            }
            if (!$.support.opacity && opts.cleartype && !opts.cleartypeNoBg) {
                clearTypeFix($s);
            }
            if (opts.fit && opts.width) {
                $s.width(opts.width);
            }
            if (opts.fit && opts.height && opts.height != "auto") {
                $slides.height(opts.height);
            }
            s.cycleH = (opts.fit && opts.height) ? opts.height : $s.height();
            s.cycleW = (opts.fit && opts.width) ? opts.width : $s.width();
            $s.css(opts.cssBefore);
            if (opts.pager) {
                $.fn.cycle.createPagerAnchor(els.length - 1, s, $(opts.pager), els, opts);
            }
            if ($.isFunction(opts.onAddSlide)) {
                opts.onAddSlide($s);
            } else {
                $s.hide();
            }
        };
    }
    $.fn.cycle.resetState = function(opts, fx) {
        fx = fx || opts.fx;
        opts.before = [];
        opts.after = [];
        opts.cssBefore = $.extend({}, opts.original.cssBefore);
        opts.cssAfter = $.extend({}, opts.original.cssAfter);
        opts.animIn = $.extend({}, opts.original.animIn);
        opts.animOut = $.extend({}, opts.original.animOut);
        opts.fxFn = null;
        $.each(opts.original.before, function() {
            opts.before.push(this);
        });
        $.each(opts.original.after, function() {
            opts.after.push(this);
        });
        var init = $.fn.cycle.transitions[fx];
        if ($.isFunction(init)) {
            init(opts.$cont, $(opts.elements), opts);
        }
    };

    function go(els, opts, manual, fwd) {
        if (manual && opts.busy && opts.manualTrump) {
            $(els).stop(true, true);
            opts.busy = false;
        }
        if (opts.busy) {
            return;
        }
        var p = opts.$cont[0],
            curr = els[opts.currSlide],
            next = els[opts.nextSlide];
        if (p.cycleStop != opts.stopCount || p.cycleTimeout === 0 && !manual) {
            return;
        }
        if (!manual && !p.cyclePause && ((opts.autostop && (--opts.countdown <= 0)) || (opts.nowrap && !opts.random && opts.nextSlide < opts.currSlide))) {
            if (opts.end) {
                opts.end(opts);
            }
            return;
        }
        if (manual || !p.cyclePause) {
            var fx = opts.fx;
            curr.cycleH = curr.cycleH || $(curr).height();
            curr.cycleW = curr.cycleW || $(curr).width();
            next.cycleH = next.cycleH || $(next).height();
            next.cycleW = next.cycleW || $(next).width();
            if (opts.multiFx) {
                if (opts.lastFx == undefined || ++opts.lastFx >= opts.fxs.length) {
                    opts.lastFx = 0;
                }
                fx = opts.fxs[opts.lastFx];
                opts.currFx = fx;
            }
            if (opts.oneTimeFx) {
                fx = opts.oneTimeFx;
                opts.oneTimeFx = null;
            }
            $.fn.cycle.resetState(opts, fx);
            if (opts.before.length) {
                $.each(opts.before, function(i, o) {
                    if (p.cycleStop != opts.stopCount) {
                        return;
                    }
                    o.apply(next, [curr, next, opts, fwd]);
                });
            }
            var after = function() {
                $.each(opts.after, function(i, o) {
                    if (p.cycleStop != opts.stopCount) {
                        return;
                    }
                    o.apply(next, [curr, next, opts, fwd]);
                });
            };
            if (opts.nextSlide != opts.currSlide) {
                opts.busy = 1;
                if (opts.fxFn) {
                    opts.fxFn(curr, next, opts, after, fwd);
                } else {
                    if ($.isFunction($.fn.cycle[opts.fx])) {
                        $.fn.cycle[opts.fx](curr, next, opts, after);
                    } else {
                        $.fn.cycle.custom(curr, next, opts, after, manual && opts.fastOnEvent);
                    }
                }
            }
            opts.lastSlide = opts.currSlide;
            if (opts.random) {
                opts.currSlide = opts.nextSlide;
                if (++opts.randomIndex == els.length) {
                    opts.randomIndex = 0;
                }
                opts.nextSlide = opts.randomMap[opts.randomIndex];
            } else {
                var roll = (opts.nextSlide + 1) == els.length;
                opts.nextSlide = roll ? 0 : opts.nextSlide + 1;
                opts.currSlide = roll ? els.length - 1 : opts.nextSlide - 1;
            }
            if (opts.pager) {
                $.fn.cycle.updateActivePagerLink(opts.pager, opts.currSlide);
            }
        }
        var ms = 0;
        if (opts.timeout && !opts.continuous) {
            ms = getTimeout(curr, next, opts, fwd);
        } else {
            if (opts.continuous && p.cyclePause) {
                ms = 10;
            }
        }
        if (ms > 0) {
            p.cycleTimeout = setTimeout(function() {
                go(els, opts, 0, !opts.rev);
            }, ms);
        }
    }
    $.fn.cycle.updateActivePagerLink = function(pager, currSlide) {
        $(pager).each(function() {
            $(this).find("a").removeClass("activeSlide").filter("a:eq(" + currSlide + ")").addClass("activeSlide");
        });
    };

    function getTimeout(curr, next, opts, fwd) {
        if (opts.timeoutFn) {
            var t = opts.timeoutFn(curr, next, opts, fwd);
            while ((t - opts.speed) < 250) {
                t += opts.speed;
            }
            debug("calculated timeout: " + t + "; speed: " + opts.speed);
            if (t !== false) {
                return t;
            }
        }
        return opts.timeout;
    }
    $.fn.cycle.next = function(opts) {
        advance(opts, opts.rev ? -1 : 1);
    };
    $.fn.cycle.prev = function(opts) {
        advance(opts, opts.rev ? 1 : -1);
    };

    function advance(opts, val) {
        var els = opts.elements;
        var p = opts.$cont[0],
            timeout = p.cycleTimeout;
        if (timeout) {
            clearTimeout(timeout);
            p.cycleTimeout = 0;
        }
        if (opts.random && val < 0) {
            opts.randomIndex--;
            if (--opts.randomIndex == -2) {
                opts.randomIndex = els.length - 2;
            } else {
                if (opts.randomIndex == -1) {
                    opts.randomIndex = els.length - 1;
                }
            }
            opts.nextSlide = opts.randomMap[opts.randomIndex];
        } else {
            if (opts.random) {
                if (++opts.randomIndex == els.length) {
                    opts.randomIndex = 0;
                }
                opts.nextSlide = opts.randomMap[opts.randomIndex];
            } else {
                opts.nextSlide = opts.currSlide + val;
                if (opts.nextSlide < 0) {
                    if (opts.nowrap) {
                        return false;
                    }
                    opts.nextSlide = els.length - 1;
                } else {
                    if (opts.nextSlide >= els.length) {
                        if (opts.nowrap) {
                            return false;
                        }
                        opts.nextSlide = 0;
                    }
                }
            }
        }
        if ($.isFunction(opts.prevNextClick)) {
            opts.prevNextClick(val > 0, opts.nextSlide, els[opts.nextSlide]);
        }
        go(els, opts, 1, val >= 0);
        return false;
    }

    function buildPager(els, opts) {
        var $p = $(opts.pager);
        $.each(els, function(i, o) {
            $.fn.cycle.createPagerAnchor(i, o, $p, els, opts);
        });
        $.fn.cycle.updateActivePagerLink(opts.pager, opts.startingSlide);
    }
    $.fn.cycle.createPagerAnchor = function(i, el, $p, els, opts) {
        var a;
        if ($.isFunction(opts.pagerAnchorBuilder)) {
            a = opts.pagerAnchorBuilder(i, el);
        } else {
            a = '<a href="#">' + (i + 1) + "</a>";
        }
        if (!a) {
            return;
        }
        var $a = $(a);
        if ($a.parents("body").length === 0) {
            var arr = [];
            if ($p.length > 1) {
                $p.each(function() {
                    var $clone = $a.clone(true);
                    $(this).append($clone);
                    arr.push($clone[0]);
                });
                $a = $(arr);
            } else {
                $a.appendTo($p);
            }
        }
        $a.bind(opts.pagerEvent, function(e) {
            e.preventDefault();
            opts.nextSlide = i;
            var p = opts.$cont[0],
                timeout = p.cycleTimeout;
            if (timeout) {
                clearTimeout(timeout);
                p.cycleTimeout = 0;
            }
            if ($.isFunction(opts.pagerClick)) {
                opts.pagerClick(opts.nextSlide, els[opts.nextSlide]);
            }
            go(els, opts, 1, opts.currSlide < i);
            return false;
        });
        if (opts.pagerEvent != "click") {
            $a.click(function() {
                return false;
            });
        }
        if (opts.pauseOnPagerHover) {
            $a.hover(function() {
                opts.$cont[0].cyclePause++;
            }, function() {
                opts.$cont[0].cyclePause--;
            });
        }
    };
    $.fn.cycle.hopsFromLast = function(opts, fwd) {
        var hops, l = opts.lastSlide,
            c = opts.currSlide;
        if (fwd) {
            hops = c > l ? c - l : opts.slideCount - l;
        } else {
            hops = c < l ? l - c : l + opts.slideCount - c;
        }
        return hops;
    };

    function clearTypeFix($slides) {
        function hex(s) {
            s = parseInt(s).toString(16);
            return s.length < 2 ? "0" + s : s;
        }

        function getBg(e) {
            for (; e && e.nodeName.toLowerCase() != "html"; e = e.parentNode) {
                var v = $.css(e, "background-color");
                if (v.indexOf("rgb") >= 0) {
                    var rgb = v.match(/\d+/g);
                    return "#" + hex(rgb[0]) + hex(rgb[1]) + hex(rgb[2]);
                }
                if (v && v != "transparent") {
                    return v;
                }
            }
            return "#ffffff";
        }
        $slides.each(function() {
            $(this).css("background-color", getBg(this));
        });
    }
    $.fn.cycle.commonReset = function(curr, next, opts, w, h, rev) {
        $(opts.elements).not(curr).hide();
        opts.cssBefore.opacity = 1;
        opts.cssBefore.display = "block";
        if (w !== false && next.cycleW > 0) {
            opts.cssBefore.width = next.cycleW;
        }
        if (h !== false && next.cycleH > 0) {
            opts.cssBefore.height = next.cycleH;
        }
        opts.cssAfter = opts.cssAfter || {};
        opts.cssAfter.display = "none";
        $(curr).css("zIndex", opts.slideCount + (rev === true ? 1 : 0));
        $(next).css("zIndex", opts.slideCount + (rev === true ? 0 : 1));
    };
    $.fn.cycle.custom = function(curr, next, opts, cb, speedOverride) {
        var $l = $(curr),
            $n = $(next);
        var speedIn = opts.speedIn,
            speedOut = opts.speedOut,
            easeIn = opts.easeIn,
            easeOut = opts.easeOut;
        $n.css(opts.cssBefore);
        if (speedOverride) {
            if (typeof speedOverride == "number") {
                speedIn = speedOut = speedOverride;
            } else {
                speedIn = speedOut = 1;
            }
            easeIn = easeOut = null;
        }
        var fn = function() {
            $n.animate(opts.animIn, speedIn, easeIn, cb);
        };
        $l.animate(opts.animOut, speedOut, easeOut, function() {
            if (opts.cssAfter) {
                $l.css(opts.cssAfter);
            }
            if (!opts.sync) {
                fn();
            }
        });
        if (opts.sync) {
            fn();
        }
    };
    $.fn.cycle.transitions = {
        fade: function($cont, $slides, opts) {
            $slides.not(":eq(" + opts.currSlide + ")").css("opacity", 0);
            opts.before.push(function(curr, next, opts) {
                $.fn.cycle.commonReset(curr, next, opts);
                opts.cssBefore.opacity = 0;
            });
            opts.animIn = {
                opacity: 1
            };
            opts.animOut = {
                opacity: 0
            };
            opts.cssBefore = {
                top: 0,
                left: 0
            };
        }
    };
    $.fn.cycle.ver = function() {
        return ver;
    };
    $.fn.cycle.defaults = {
        fx: "fade",
        timeout: 4000,
        timeoutFn: null,
        continuous: 0,
        speed: 1000,
        speedIn: null,
        speedOut: null,
        next: null,
        prev: null,
        prevNextClick: null,
        prevNextEvent: "click",
        pager: null,
        pagerClick: null,
        pagerEvent: "click",
        pagerAnchorBuilder: null,
        before: null,
        after: null,
        end: null,
        easing: null,
        easeIn: null,
        easeOut: null,
        shuffle: null,
        animIn: null,
        animOut: null,
        cssBefore: null,
        cssAfter: null,
        fxFn: null,
        height: "auto",
        startingSlide: 0,
        sync: 1,
        random: 0,
        fit: 0,
        containerResize: 1,
        pause: 0,
        pauseOnPagerHover: 0,
        autostop: 0,
        autostopCount: 0,
        delay: 0,
        slideExpr: null,
        cleartype: !$.support.opacity,
        cleartypeNoBg: false,
        nowrap: 0,
        fastOnEvent: 0,
        randomizeEffects: 1,
        rev: 0,
        manualTrump: true,
        requeueOnImageNotLoaded: true,
        requeueTimeout: 250
    };
})(jQuery);
/*
 * jQuery Cycle Plugin Transition Definitions
 * This script is a plugin for the jQuery Cycle Plugin
 * Examples and documentation at: http://malsup.com/jquery/cycle/
 * Copyright (c) 2007-2008 M. Alsup
 * Version:	 2.72
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */
(function($) {
    $.fn.cycle.transitions.none = function($cont, $slides, opts) {
        opts.fxFn = function(curr, next, opts, after) {
            $(next).show();
            $(curr).hide();
            after();
        };
    };
    $.fn.cycle.transitions.scrollUp = function($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var h = $cont.height();
        opts.cssBefore = {
            top: h,
            left: 0
        };
        opts.cssFirst = {
            top: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            top: -h
        };
    };
    $.fn.cycle.transitions.scrollDown = function($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var h = $cont.height();
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            top: -h,
            left: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            top: h
        };
    };
    $.fn.cycle.transitions.scrollLeft = function($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var w = $cont.width();
        opts.cssFirst = {
            left: 0
        };
        opts.cssBefore = {
            left: w,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: 0 - w
        };
    };
    $.fn.cycle.transitions.scrollRight = function($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push($.fn.cycle.commonReset);
        var w = $cont.width();
        opts.cssFirst = {
            left: 0
        };
        opts.cssBefore = {
            left: -w,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: w
        };
    };
    $.fn.cycle.transitions.scrollHorz = function($cont, $slides, opts) {
        $cont.css("overflow", "hidden").width();
        opts.before.push(function(curr, next, opts, fwd) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssBefore.left = fwd ? (next.cycleW - 1) : (1 - next.cycleW);
            opts.animOut.left = fwd ? -curr.cycleW : curr.cycleW;
        });
        opts.cssFirst = {
            left: 0
        };
        opts.cssBefore = {
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            top: 0
        };
    };
    $.fn.cycle.transitions.scrollVert = function($cont, $slides, opts) {
        $cont.css("overflow", "hidden");
        opts.before.push(function(curr, next, opts, fwd) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.cssBefore.top = fwd ? (1 - next.cycleH) : (next.cycleH - 1);
            opts.animOut.top = fwd ? curr.cycleH : -curr.cycleH;
        });
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            left: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            left: 0
        };
    };
    $.fn.cycle.transitions.slideX = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $(opts.elements).not(curr).hide();
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.animIn.width = next.cycleW;
        });
        opts.cssBefore = {
            left: 0,
            top: 0,
            width: 0
        };
        opts.animIn = {
            width: "show"
        };
        opts.animOut = {
            width: 0
        };
    };
    $.fn.cycle.transitions.slideY = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $(opts.elements).not(curr).hide();
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.animIn.height = next.cycleH;
        });
        opts.cssBefore = {
            left: 0,
            top: 0,
            height: 0
        };
        opts.animIn = {
            height: "show"
        };
        opts.animOut = {
            height: 0
        };
    };
    $.fn.cycle.transitions.shuffle = function($cont, $slides, opts) {
        var i, w = $cont.css("overflow", "visible").width();
        $slides.css({
            left: 0,
            top: 0
        });
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
        });
        if (!opts.speedAdjusted) {
            opts.speed = opts.speed / 2;
            opts.speedAdjusted = true;
        }
        opts.random = 0;
        opts.shuffle = opts.shuffle || {
                left: -w,
                top: 15
            };
        opts.els = [];
        for (i = 0; i < $slides.length; i++) {
            opts.els.push($slides[i]);
        }
        for (i = 0; i < opts.currSlide; i++) {
            opts.els.push(opts.els.shift());
        }
        opts.fxFn = function(curr, next, opts, cb, fwd) {
            var $el = fwd ? $(curr) : $(next);
            $(next).css(opts.cssBefore);
            var count = opts.slideCount;
            $el.animate(opts.shuffle, opts.speedIn, opts.easeIn, function() {
                var hops = $.fn.cycle.hopsFromLast(opts, fwd);
                for (var k = 0; k < hops; k++) {
                    fwd ? opts.els.push(opts.els.shift()) : opts.els.unshift(opts.els.pop());
                }
                if (fwd) {
                    for (var i = 0, len = opts.els.length; i < len; i++) {
                        $(opts.els[i]).css("z-index", len - i + count);
                    }
                } else {
                    var z = $(curr).css("z-index");
                    $el.css("z-index", parseInt(z) + 1 + count);
                }
                $el.animate({
                    left: 0,
                    top: 0
                }, opts.speedOut, opts.easeOut, function() {
                    $(fwd ? this : curr).hide();
                    if (cb) {
                        cb();
                    }
                });
            });
        };
        opts.cssBefore = {
            display: "block",
            opacity: 1,
            top: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.turnUp = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.cssBefore.top = next.cycleH;
            opts.animIn.height = next.cycleH;
        });
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            left: 0,
            height: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            height: 0
        };
    };
    $.fn.cycle.transitions.turnDown = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssFirst = {
            top: 0
        };
        opts.cssBefore = {
            left: 0,
            top: 0,
            height: 0
        };
        opts.animOut = {
            height: 0
        };
    };
    $.fn.cycle.transitions.turnLeft = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.cssBefore.left = next.cycleW;
            opts.animIn.width = next.cycleW;
        });
        opts.cssBefore = {
            top: 0,
            width: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            width: 0
        };
    };
    $.fn.cycle.transitions.turnRight = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.animIn.width = next.cycleW;
            opts.animOut.left = curr.cycleW;
        });
        opts.cssBefore = {
            top: 0,
            left: 0,
            width: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            width: 0
        };
    };
    $.fn.cycle.transitions.zoom = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, false, true);
            opts.cssBefore.top = next.cycleH / 2;
            opts.cssBefore.left = next.cycleW / 2;
            opts.animIn = {
                top: 0,
                left: 0,
                width: next.cycleW,
                height: next.cycleH
            };
            opts.animOut = {
                width: 0,
                height: 0,
                top: curr.cycleH / 2,
                left: curr.cycleW / 2
            };
        });
        opts.cssFirst = {
            top: 0,
            left: 0
        };
        opts.cssBefore = {
            width: 0,
            height: 0
        };
    };
    $.fn.cycle.transitions.fadeZoom = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, false);
            opts.cssBefore.left = next.cycleW / 2;
            opts.cssBefore.top = next.cycleH / 2;
            opts.animIn = {
                top: 0,
                left: 0,
                width: next.cycleW,
                height: next.cycleH
            };
        });
        opts.cssBefore = {
            width: 0,
            height: 0
        };
        opts.animOut = {
            opacity: 0
        };
    };
    $.fn.cycle.transitions.blindX = function($cont, $slides, opts) {
        var w = $cont.css("overflow", "hidden").width();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.width = next.cycleW;
            opts.animOut.left = curr.cycleW;
        });
        opts.cssBefore = {
            left: w,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: w
        };
    };
    $.fn.cycle.transitions.blindY = function($cont, $slides, opts) {
        var h = $cont.css("overflow", "hidden").height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssBefore = {
            top: h,
            left: 0
        };
        opts.animIn = {
            top: 0
        };
        opts.animOut = {
            top: h
        };
    };
    $.fn.cycle.transitions.blindZ = function($cont, $slides, opts) {
        var h = $cont.css("overflow", "hidden").height();
        var w = $cont.width();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            opts.animIn.height = next.cycleH;
            opts.animOut.top = curr.cycleH;
        });
        opts.cssBefore = {
            top: h,
            left: w
        };
        opts.animIn = {
            top: 0,
            left: 0
        };
        opts.animOut = {
            top: h,
            left: w
        };
    };
    $.fn.cycle.transitions.growX = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true);
            opts.cssBefore.left = this.cycleW / 2;
            opts.animIn = {
                left: 0,
                width: this.cycleW
            };
            opts.animOut = {
                left: 0
            };
        });
        opts.cssBefore = {
            width: 0,
            top: 0
        };
    };
    $.fn.cycle.transitions.growY = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false);
            opts.cssBefore.top = this.cycleH / 2;
            opts.animIn = {
                top: 0,
                height: this.cycleH
            };
            opts.animOut = {
                top: 0
            };
        });
        opts.cssBefore = {
            height: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.curtainX = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, false, true, true);
            opts.cssBefore.left = next.cycleW / 2;
            opts.animIn = {
                left: 0,
                width: this.cycleW
            };
            opts.animOut = {
                left: curr.cycleW / 2,
                width: 0
            };
        });
        opts.cssBefore = {
            top: 0,
            width: 0
        };
    };
    $.fn.cycle.transitions.curtainY = function($cont, $slides, opts) {
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, false, true);
            opts.cssBefore.top = next.cycleH / 2;
            opts.animIn = {
                top: 0,
                height: next.cycleH
            };
            opts.animOut = {
                top: curr.cycleH / 2,
                height: 0
            };
        });
        opts.cssBefore = {
            left: 0,
            height: 0
        };
    };
    $.fn.cycle.transitions.cover = function($cont, $slides, opts) {
        var d = opts.direction || "left";
        var w = $cont.css("overflow", "hidden").width();
        var h = $cont.height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts);
            if (d == "right") {
                opts.cssBefore.left = -w;
            } else {
                if (d == "up") {
                    opts.cssBefore.top = h;
                } else {
                    if (d == "down") {
                        opts.cssBefore.top = -h;
                    } else {
                        opts.cssBefore.left = w;
                    }
                }
            }
        });
        opts.animIn = {
            left: 0,
            top: 0
        };
        opts.animOut = {
            opacity: 1
        };
        opts.cssBefore = {
            top: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.uncover = function($cont, $slides, opts) {
        var d = opts.direction || "left";
        var w = $cont.css("overflow", "hidden").width();
        var h = $cont.height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
            if (d == "right") {
                opts.animOut.left = w;
            } else {
                if (d == "up") {
                    opts.animOut.top = -h;
                } else {
                    if (d == "down") {
                        opts.animOut.top = h;
                    } else {
                        opts.animOut.left = -w;
                    }
                }
            }
        });
        opts.animIn = {
            left: 0,
            top: 0
        };
        opts.animOut = {
            opacity: 1
        };
        opts.cssBefore = {
            top: 0,
            left: 0
        };
    };
    $.fn.cycle.transitions.toss = function($cont, $slides, opts) {
        var w = $cont.css("overflow", "visible").width();
        var h = $cont.height();
        opts.before.push(function(curr, next, opts) {
            $.fn.cycle.commonReset(curr, next, opts, true, true, true);
            if (!opts.animOut.left && !opts.animOut.top) {
                opts.animOut = {
                    left: w * 2,
                    top: -h / 2,
                    opacity: 0
                };
            } else {
                opts.animOut.opacity = 0;
            }
        });
        opts.cssBefore = {
            left: 0,
            top: 0
        };
        opts.animIn = {
            left: 0
        };
    };
    $.fn.cycle.transitions.wipe = function($cont, $slides, opts) {
        var w = $cont.css("overflow", "hidden").width();
        var h = $cont.height();
        opts.cssBefore = opts.cssBefore || {};
        var clip;
        if (opts.clip) {
            if (/l2r/.test(opts.clip)) {
                clip = "rect(0px 0px " + h + "px 0px)";
            } else {
                if (/r2l/.test(opts.clip)) {
                    clip = "rect(0px " + w + "px " + h + "px " + w + "px)";
                } else {
                    if (/t2b/.test(opts.clip)) {
                        clip = "rect(0px " + w + "px 0px 0px)";
                    } else {
                        if (/b2t/.test(opts.clip)) {
                            clip = "rect(" + h + "px " + w + "px " + h + "px 0px)";
                        } else {
                            if (/zoom/.test(opts.clip)) {
                                var top = parseInt(h / 2);
                                var left = parseInt(w / 2);
                                clip = "rect(" + top + "px " + left + "px " + top + "px " + left + "px)";
                            }
                        }
                    }
                }
            }
        }
        opts.cssBefore.clip = opts.cssBefore.clip || clip || "rect(0px 0px 0px 0px)";
        var d = opts.cssBefore.clip.match(/(\d+)/g);
        var t = parseInt(d[0]),
            r = parseInt(d[1]),
            b = parseInt(d[2]),
            l = parseInt(d[3]);
        opts.before.push(function(curr, next, opts) {
            if (curr == next) {
                return;
            }
            var $curr = $(curr),
                $next = $(next);
            $.fn.cycle.commonReset(curr, next, opts, true, true, false);
            opts.cssAfter.display = "block";
            var step = 1,
                count = parseInt((opts.speedIn / 13)) - 1;
            (function f() {
                var tt = t ? t - parseInt(step * (t / count)) : 0;
                var ll = l ? l - parseInt(step * (l / count)) : 0;
                var bb = b < h ? b + parseInt(step * ((h - b) / count || 1)) : h;
                var rr = r < w ? r + parseInt(step * ((w - r) / count || 1)) : w;
                $next.css({
                    clip: "rect(" + tt + "px " + rr + "px " + bb + "px " + ll + "px)"
                });
                (step++ <= count) ? setTimeout(f, 13): $curr.css("display", "none");
            })();
        });
        opts.cssBefore = {
            display: "block",
            opacity: 1,
            top: 0,
            left: 0
        };
        opts.animIn = {
            left: 0
        };
        opts.animOut = {
            left: 0
        };
    };
})(jQuery);

(function($) {
    var textarea, staticOffset;
    var iLastMousePos = 0;
    var iMin = 32;
    var grip;
    $.fn.TextAreaResizer = function() {
        return this.each(function() {
            textarea = $(this).addClass('processed'), staticOffset = null;
            $(this).wrap('<div class="resizable-textarea"><span></span></div>').parent().append($('<div class="grippie"></div>').bind("mousedown", {
                el: this
            }, startDrag));
            var grippie = $('div.grippie', $(this).parent())[0];
            grippie.style.marginRight = (grippie.offsetWidth - $(this)[0].offsetWidth) + 'px';
        });
    };

    function startDrag(e) {
        textarea = $(e.data.el);
        textarea.blur();
        iLastMousePos = mousePosition(e).y;
        staticOffset = textarea.height() - iLastMousePos;
        textarea.css('opacity', 0.25);
        $(document).mousemove(performDrag).mouseup(endDrag);
        return false;
    }

    function performDrag(e) {
        var iThisMousePos = mousePosition(e).y;
        var iMousePos = staticOffset + iThisMousePos;
        if (iLastMousePos >= (iThisMousePos)) {
            iMousePos -= 5;
        }
        iLastMousePos = iThisMousePos;
        iMousePos = Math.max(iMin, iMousePos);
        textarea.height(iMousePos + 'px');
        if (iMousePos < iMin) {
            endDrag(e);
        }
        return false;
    }

    function endDrag(e) {
        $(document).unbind('mousemove', performDrag).unbind('mouseup', endDrag);
        textarea.css('opacity', 1);
        textarea.focus();
        textarea = null;
        staticOffset = null;
        iLastMousePos = 0;
    }

    function mousePosition(e) {
        return {
            x: e.clientX + document.documentElement.scrollLeft,
            y: e.clientY + document.documentElement.scrollTop
        };
    };
})(jQuery);

(function(w) {
    var E = w(window),
        u, f, F = -1,
        n, x, D, v, y, L, r, m = !window.XMLHttpRequest,
        s = [],
        l = document.documentElement,
        k = {},
        t = new Image(),
        J = new Image(),
        H, a, g, p, I, d, G, c, A, K;
    w(function() {
        w("body").append(w([H = w('<div id="lbOverlay" />').click(C)[0], a = w('<div id="lbCenter" />')[0], G = w('<div id="lbBottomContainer" />')[0]]).css("display", "none"));
        g = w('<div id="lbImage" />').appendTo(a).append(p = w('<div style="position: relative;" />').append([I = w('<a id="lbPrevLink" href="#" />').click(B)[0], d = w('<a id="lbNextLink" href="#" />').click(e)[0]])[0])[0];
        c = w('<div id="lbBottom" />').appendTo(G).append([w('<a id="lbCloseLink" href="#" />').click(C)[0], A = w('<div id="lbCaption" />')[0], K = w('<div id="lbNumber" />')[0], w('<div style="clear: both;" />')[0]])[0]
    });
    w.slimbox = function(O, N, M) {
        u = w.extend({
            loop: false,
            overlayOpacity: 0.8,
            overlayFadeDuration: 400,
            resizeDuration: 400,
            resizeEasing: "swing",
            initialWidth: 250,
            initialHeight: 250,
            imageFadeDuration: 400,
            captionAnimationDuration: 400,
            counterText: "Image {x} of {y}",
            closeKeys: [27, 88, 67],
            previousKeys: [37, 80],
            nextKeys: [39, 78]
        }, M);
        if (typeof O == "string") {
            O = [
                [O, N]
            ];
            N = 0
        }
        y = E.scrollTop() + (E.height() / 2);
        L = u.initialWidth;
        r = u.initialHeight;
        w(a).css({
            top: Math.max(0, y - (r / 2)),
            width: L,
            height: r,
            marginLeft: -L / 2
        }).show();
        v = m || (H.currentStyle && (H.currentStyle.position != "fixed"));
        if (v) {
            H.style.position = "absolute"
        }
        w(H).css("opacity", u.overlayOpacity).fadeIn(u.overlayFadeDuration);
        z();
        j(1);
        f = O;
        u.loop = u.loop && (f.length > 1);
        return b(N)
    };
    w.fn.slimbox = function(M, P, O) {
        P = P || function(Q) {
                return [Q.href, Q.title]
            };
        O = O || function() {
                return true
            };
        var N = this;
        return N.unbind("click").click(function() {
            var S = this,
                U = 0,
                T, Q = 0,
                R;
            T = w.grep(N, function(W, V) {
                return O.call(S, W, V)
            });
            for (R = T.length; Q < R; ++Q) {
                if (T[Q] == S) {
                    U = Q
                }
                T[Q] = P(T[Q], Q)
            }
            return w.slimbox(T, U, M)
        })
    };

    function z() {
        var N = E.scrollLeft(),
            M = E.width();
        w([a, G]).css("left", N + (M / 2));
        if (v) {
            w(H).css({
                left: N,
                top: E.scrollTop(),
                width: M,
                height: E.height()
            })
        }
    }

    function j(M) {
        if (M) {
            w("object").add(m ? "select" : "embed").each(function(O, P) {
                s[O] = [P, P.style.visibility];
                P.style.visibility = "hidden"
            })
        } else {
            w.each(s, function(O, P) {
                P[0].style.visibility = P[1]
            });
            s = []
        }
        var N = M ? "bind" : "unbind";
        E[N]("scroll resize", z);
        w(document)[N]("keydown", o)
    }

    function o(O) {
        var N = O.which,
            M = w.inArray;
        return (M(N, u.closeKeys) >= 0) ? C() : (M(N, u.nextKeys) >= 0) ? e() : (M(N, u.previousKeys) >= 0) ? B() : null
    }

    function B() {
        return b(x)
    }

    function e() {
        return b(D)
    }

    function b(M) {
        if (M >= 0) {
            F = M;
            n = f[F][0];
            x = (F || (u.loop ? f.length : 0)) - 1;
            D = ((F + 1) % f.length) || (u.loop ? 0 : -1);
            q();
            a.className = "lbLoading";
            k = new Image();
            k.onload = i;
            k.src = n;
        }
        return false;
    }

    function i() {
        a.className = "";
        w(g).css({
            backgroundImage: "url(" + n + ")",
            visibility: "hidden",
            display: ""
        });
        w(p).width(k.width);
        w([p, I, d]).height(k.height);
        w(A).html(f[F][1] + "<br /> <a href='" + n + "'>Download Image</a><br />" || "");
        w(K).html((((f.length > 1) && u.counterText) || "").replace(/{x}/, F + 1).replace(/{y}/, f.length));
        if (x >= 0) {
            t.src = f[x][0]
        }
        if (D >= 0) {
            J.src = f[D][0]
        }
        L = g.offsetWidth;
        r = g.offsetHeight;
        var M = Math.max(0, y - (r / 2));
        if (a.offsetHeight != r) {
            w(a).animate({
                height: r,
                top: M
            }, u.resizeDuration, u.resizeEasing)
        }
        if (a.offsetWidth != L) {
            w(a).animate({
                width: L,
                marginLeft: -L / 2
            }, u.resizeDuration, u.resizeEasing)
        }
        w(a).queue(function() {
            w(G).css({
                width: L,
                top: M + r,
                marginLeft: -L / 2,
                visibility: "hidden",
                display: ""
            });
            w(g).css({
                display: "none",
                visibility: "",
                opacity: ""
            }).fadeIn(u.imageFadeDuration, h)
        })
    }

    function h() {
        if (x >= 0) {
            w(I).show()
        }
        if (D >= 0) {
            w(d).show()
        }
        w(c).css("marginTop", -c.offsetHeight).animate({
            marginTop: 0
        }, u.captionAnimationDuration);
        G.style.visibility = ""
    }

    function q() {
        k.onload = null;
        k.src = t.src = J.src = n;
        w([a, g, c]).stop(true);
        w([I, d, g, G]).hide()
    }

    function C() {
        if (F >= 0) {
            q();
            F = x = D = -1;
            w(a).hide();
            w(H).stop().fadeOut(u.overlayFadeDuration, j)
        }
        return false
    }
})(jQuery);
if (!/android|iphone|ipod|series60|symbian|windows ce|blackberry/i.test(navigator.userAgent)) {
    jQuery(function($) {
        $("a[rel^='lightbox']").slimbox({}, function(el) {
            return [el.href, el.getAttribute("slimboxcaption") != null ? el.getAttribute("slimboxcaption") : ""];
        }, function(el) {
            return (this == el) || ((this.rel.length > 8) && (this.rel == el.rel));
        });
    });
};
/*
 * TipTip
 * Copyright 2010 Drew Wilson
 * www.drewwilson.com
 * code.drewwilson.com/entry/tiptip-jquery-plugin
 *
 * Version 1.3   -   Updated: Mar. 23, 2010
 *
 * This Plug-In will create a custom tooltip to replace the default
 * browser tooltip. It is extremely lightweight and very smart in
 * that it detects the edges of the browser window and will make sure
 * the tooltip stays within the current window size. As a result the
 * tooltip will adjust itself to be displayed above, below, to the left
 * or to the right depending on what is necessary to stay within the
 * browser window. It is completely customizable as well via CSS.
 *
 * This TipTip jQuery plug-in is dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

(function(a) {
    a.fn.tipTip = function(c) {
        var g = {
            activation: "hover",
            keepAlive: false,
            maxWidth: "200px",
            edgeOffset: 3,
            defaultPosition: "bottom",
            delay: 400,
            fadeIn: 200,
            fadeOut: 200,
            attribute: "title",
            content: false,
            enter: function() {},
            exit: function() {},
            unbind: false
        };
        var e = a.extend(g, c);
        if (a("#tiptip_holder").length <= 0) {
            var b = a('<div id="tiptip_holder" style="max-width:' + e.maxWidth + ';"></div>');
            var d = a('<div id="tiptip_content"></div>');
            var f = a('<div id="tiptip_arrow"></div>');
            a("body").append(b.html(d).prepend(f.html('<div id="tiptip_arrow_inner"></div>')))
        } else {
            var b = a("#tiptip_holder");
            var d = a("#tiptip_content");
            var f = a("#tiptip_arrow")
        }
        return this.each(function() {
            var j = a(this);
            var o = "";
            if (e.content) {
                o = e.content
            } else {
                o = j.attr(e.attribute)
            }
            if (e.unbind) {
                var l = j.attr("class").split(" ");
                var n = "";
                var h = "";
                a.each(l, function(p, q) {
                    if (q.match("^cd:") == "cd:") {
                        h = q;
                        n = q.replace(/^cd:/g, "")
                    }
                });
                j.attr(e.attribute, unescape(n));
                j.removeClass(h);
                j.unbind(e.activation);
                return true
            }
            if (o != "") {
                if (!e.content) {
                    j.addClass("cd:" + escape(o));
                    j.removeAttr(e.attribute)
                }
                var i = false;
                if (e.activation == "hover") {
                    j.hover(function() {
                        m()
                    }, function() {
                        if (!e.keepAlive) {
                            k()
                        }
                    });
                    if (e.keepAlive) {
                        b.hover(function() {}, function() {
                            k()
                        })
                    }
                } else {
                    if (e.activation == "focus") {
                        j.focus(function() {
                            m()
                        }).blur(function() {
                            k()
                        })
                    } else {
                        if (e.activation == "click") {
                            j.click(function() {
                                m();
                                return false
                            }).hover(function() {}, function() {
                                if (!e.keepAlive) {
                                    k()
                                }
                            });
                            if (e.keepAlive) {
                                b.hover(function() {}, function() {
                                    k()
                                })
                            }
                        }
                    }
                }

                function m() {
                    e.enter.call(this);
                    d.html(o);
                    b.hide().removeAttr("class").css("margin", "0");
                    f.removeAttr("style");
                    var B = parseInt(j.offset()["top"]);
                    var s = parseInt(j.offset()["left"]);
                    var y = parseInt(j.outerWidth());
                    var D = parseInt(j.outerHeight());
                    var A = b.outerWidth();
                    var v = b.outerHeight();
                    var z = Math.round((y - A) / 2);
                    var r = Math.round((D - v) / 2);
                    var q = Math.round(s + z);
                    var p = Math.round(B + D + e.edgeOffset);
                    var w = "";
                    var F = "";
                    var x = Math.round(A - 12) / 2;
                    if (e.defaultPosition == "bottom") {
                        w = "_bottom"
                    } else {
                        if (e.defaultPosition == "top") {
                            w = "_top"
                        } else {
                            if (e.defaultPosition == "left") {
                                w = "_left"
                            } else {
                                if (e.defaultPosition == "right") {
                                    w = "_right"
                                }
                            }
                        }
                    }
                    var u = (z + s) < parseInt(a(window).scrollLeft());
                    var t = (A + s) > parseInt(a(window).width());
                    if ((u && z < 0) || (w == "_right" && !t) || (w == "_left" && s < (A + e.edgeOffset + 5))) {
                        w = "_right";
                        F = Math.round(v - 13) / 2;
                        x = -12;
                        q = Math.round(s + y + e.edgeOffset);
                        p = Math.round(B + r)
                    } else {
                        if ((t && z < 0) || (w == "_left" && !u)) {
                            w = "_left";
                            F = Math.round(v - 13) / 2;
                            x = Math.round(A);
                            q = Math.round(s - (A + e.edgeOffset + 5));
                            p = Math.round(B + r)
                        }
                    }
                    var C = (B + D + e.edgeOffset + v + 8) > parseInt(a(window).height() + a(window).scrollTop());
                    var E = ((B + D) - (e.edgeOffset + v + 8)) < 0;
                    if (C || (w == "_bottom" && C) || (w == "_top" && !E)) {
                        if (w == "_top" || w == "_bottom") {
                            w = "_top"
                        } else {
                            w = w + "_top"
                        }
                        F = v;
                        p = Math.round(B - (v + 5 + e.edgeOffset))
                    } else {
                        if (E | (w == "_top" && E) || (w == "_bottom" && !C)) {
                            if (w == "_top" || w == "_bottom") {
                                w = "_bottom"
                            } else {
                                w = w + "_bottom"
                            }
                            F = -12;
                            p = Math.round(B + D + e.edgeOffset)
                        }
                    }
                    if (w == "_right_top" || w == "_left_top") {
                        p = p + 5
                    } else {
                        if (w == "_right_bottom" || w == "_left_bottom") {
                            p = p - 5
                        }
                    }
                    if (w == "_left_top" || w == "_left_bottom") {
                        q = q + 5
                    }
                    f.css({
                        "margin-left": x + "px",
                        "margin-top": F + "px"
                    });
                    b.css({
                        "margin-left": q + "px",
                        "margin-top": p + "px"
                    }).attr("class", "tip" + w);
                    if (i) {
                        clearTimeout(i)
                    }
                    i = setTimeout(function() {
                        b.stop(true, true).fadeIn(e.fadeIn)
                    }, e.delay)
                }

                function k() {
                    e.exit.call(this);
                    if (i) {
                        clearTimeout(i)
                    }
                    b.fadeOut(e.fadeOut)
                }
            }
        })
    }
})(jQuery);

/*!
 Colorbox v1.5.5 - 2014-03-13
 jQuery lightbox and modal window plugin
 (c) 2014 Jack Moore - http://www.jacklmoore.com/colorbox
 license: http://www.opensource.org/licenses/mit-license.php
 */
(function(t, e, i) {
    function n(i, n, o) {
        var r = e.createElement(i);
        return n && (r.id = Z + n), o && (r.style.cssText = o), t(r)
    }

    function o() {
        return i.innerHeight ? i.innerHeight : t(i).height()
    }

    function r(e, i) {
        i !== Object(i) && (i = {}), this.cache = {}, this.el = e, this.value = function(e) {
            var n;
            return void 0 === this.cache[e] && (n = t(this.el).attr("data-cbox-" + e), void 0 !== n ? this.cache[e] = n : void 0 !== i[e] ? this.cache[e] = i[e] : void 0 !== X[e] && (this.cache[e] = X[e])), this.cache[e]
        }, this.get = function(e) {
            var i = this.value(e);
            return t.isFunction(i) ? i.call(this.el, this) : i
        }
    }

    function h(t) {
        var e = E.length,
            i = (z + t) % e;
        return 0 > i ? e + i : i
    }

    function s(t, e) {
        return Math.round((/%/.test(t) ? ("x" === e ? W.width() : o()) / 100 : 1) * parseInt(t, 10))
    }

    function a(t, e) {
        return t.get("photo") || t.get("photoRegex").test(e)
    }

    function l(t, e) {
        return t.get("retinaUrl") && i.devicePixelRatio > 1 ? e.replace(t.get("photoRegex"), t.get("retinaSuffix")) : e
    }

    function d(t) {
        "contains" in x[0] && !x[0].contains(t.target) && t.target !== v[0] && (t.stopPropagation(), x.focus())
    }

    function c(t) {
        c.str !== t && (x.add(v).removeClass(c.str).addClass(t), c.str = t)
    }

    function g() {
        z = 0, rel && "nofollow" !== rel ? (E = t("." + te).filter(function() {
            var e = t.data(this, Y),
                i = new r(this, e);
            return i.get("rel") === rel
        }), z = E.index(_.el), -1 === z && (E = E.add(_.el), z = E.length - 1)) : E = t(_.el)
    }

    function u(i) {
        t(e).trigger(i), se.triggerHandler(i)
    }

    function f(i) {
        var o;
        G || (o = t(i).data("colorbox"), _ = new r(i, o), rel = _.get("rel"), g(), $ || ($ = q = !0, c(_.get("className")), x.css({
            visibility: "hidden",
            display: "block",
            opacity: ""
        }), L = n(ae, "LoadedContent", "width:0; height:0; overflow:hidden; visibility:hidden"), b.css({
            width: "",
            height: ""
        }).append(L), D = T.height() + k.height() + b.outerHeight(!0) - b.height(), j = C.width() + H.width() + b.outerWidth(!0) - b.width(), A = L.outerHeight(!0), N = L.outerWidth(!0), _.w = s(_.get("initialWidth"), "x"), _.h = s(_.get("initialHeight"), "y"), L.css({
            width: "",
            height: _.h
        }), J.position(), u(ee), _.get("onOpen"), O.add(R).hide(), x.focus(), _.get("trapFocus") && e.addEventListener && (e.addEventListener("focus", d, !0), se.one(re, function() {
            e.removeEventListener("focus", d, !0)
        })), _.get("returnFocus") && se.one(re, function() {
            t(_.el).focus()
        })), v.css({
            opacity: parseFloat(_.get("opacity")) || "",
            cursor: _.get("overlayClose") ? "pointer" : "",
            visibility: "visible"
        }).show(), _.get("closeButton") ? B.html(_.get("close")).appendTo(b) : B.appendTo("<div/>"), w())
    }

    function p() {
        !x && e.body && (V = !1, W = t(i), x = n(ae).attr({
            id: Y,
            "class": t.support.opacity === !1 ? Z + "IE" : "",
            role: "dialog",
            tabindex: "-1"
        }).hide(), v = n(ae, "Overlay").hide(), M = t([n(ae, "LoadingOverlay")[0], n(ae, "LoadingGraphic")[0]]), y = n(ae, "Wrapper"), b = n(ae, "Content").append(R = n(ae, "Title"), F = n(ae, "Current"), P = t('<button type="button"/>').attr({
            id: Z + "Previous"
        }), K = t('<button type="button"/>').attr({
            id: Z + "Next"
        }), I = n("button", "Slideshow"), M), B = t('<button type="button"/>').attr({
            id: Z + "Close"
        }), y.append(n(ae).append(n(ae, "TopLeft"), T = n(ae, "TopCenter"), n(ae, "TopRight")), n(ae, !1, "clear:left").append(C = n(ae, "MiddleLeft"), b, H = n(ae, "MiddleRight")), n(ae, !1, "clear:left").append(n(ae, "BottomLeft"), k = n(ae, "BottomCenter"), n(ae, "BottomRight"))).find("div div").css({
            "float": "left"
        }), S = n(ae, !1, "position:absolute; width:9999px; visibility:hidden; display:none; max-width:none;"), O = K.add(P).add(F).add(I), t(e.body).append(v, x.append(y, S)))
    }

    function m() {
        function i(t) {
            t.which > 1 || t.shiftKey || t.altKey || t.metaKey || t.ctrlKey || (t.preventDefault(), f(this))
        }
        return x ? (V || (V = !0, K.click(function() {
            J.next()
        }), P.click(function() {
            J.prev()
        }), B.click(function() {
            J.close()
        }), v.click(function() {
            _.get("overlayClose") && J.close()
        }), t(e).bind("keydown." + Z, function(t) {
            var e = t.keyCode;
            $ && _.get("escKey") && 27 === e && (t.preventDefault(), J.close()), $ && _.get("arrowKey") && E[1] && !t.altKey && (37 === e ? (t.preventDefault(), P.click()) : 39 === e && (t.preventDefault(), K.click()))
        }), t.isFunction(t.fn.on) ? t(e).on("click." + Z, "." + te, i) : t("." + te).live("click." + Z, i)), !0) : !1
    }

    function w() {
        var o, r, h, d = J.prep,
            c = ++le;
        q = !0, U = !1, u(he), u(ie), _.get("onLoad"), _.h = _.get("height") ? s(_.get("height"), "y") - A - D : _.get("innerHeight") && s(_.get("innerHeight"), "y"), _.w = _.get("width") ? s(_.get("width"), "x") - N - j : _.get("innerWidth") && s(_.get("innerWidth"), "x"), _.mw = _.w, _.mh = _.h, _.get("maxWidth") && (_.mw = s(_.get("maxWidth"), "x") - N - j, _.mw = _.w && _.w < _.mw ? _.w : _.mw), _.get("maxHeight") && (_.mh = s(_.get("maxHeight"), "y") - A - D, _.mh = _.h && _.h < _.mh ? _.h : _.mh), o = _.get("href"), Q = setTimeout(function() {
            M.show()
        }, 100), _.get("inline") ? (h = n(ae).hide().insertBefore(t(o)[0]), se.one(he, function() {
            h.replaceWith(L.children())
        }), d(t(o))) : _.get("iframe") ? d(" ") : _.get("html") ? d(_.get("html")) : a(_, o) ? (o = l(_, o), U = e.createElement("img"), t(U).addClass(Z + "Photo").bind("error", function() {
            d(n(ae, "Error").html(_.get("imgError")))
        }).one("load", function() {
            var e;
            c === le && (t.each(["alt", "longdesc", "aria-describedby"], function(e, i) {
                var n = t(_.el).attr(i) || t(_.el).attr("data-" + i);
                n && U.setAttribute(i, n)
            }), _.get("retinaImage") && i.devicePixelRatio > 1 && (U.height = U.height / i.devicePixelRatio, U.width = U.width / i.devicePixelRatio), _.get("scalePhotos") && (r = function() {
                U.height -= U.height * e, U.width -= U.width * e
            }, _.mw && U.width > _.mw && (e = (U.width - _.mw) / U.width, r()), _.mh && U.height > _.mh && (e = (U.height - _.mh) / U.height, r())), _.h && (U.style.marginTop = Math.max(_.mh - U.height, 0) / 2 + "px"), E[1] && (_.get("loop") || E[z + 1]) && (U.style.cursor = "pointer", U.onclick = function() {
                J.next()
            }), U.style.width = U.width + "px", U.style.height = U.height + "px", setTimeout(function() {
                d(U)
            }, 1))
        }), setTimeout(function() {
            U.src = o
        }, 1)) : o && S.load(o, _.get("data"), function(e, i) {
                c === le && d("error" === i ? n(ae, "Error").html(_.get("xhrError")) : t(this).contents())
            })
    }
    var v, x, y, b, T, C, H, k, E, W, L, S, M, R, F, I, K, P, B, O, _, D, j, A, N, z, U, $, q, G, Q, J, V, X = {
            html: !1,
            photo: !1,
            iframe: !1,
            inline: !1,
            transition: "elastic",
            speed: 300,
            fadeOut: 300,
            width: !1,
            initialWidth: "600",
            innerWidth: !1,
            maxWidth: !1,
            height: !1,
            initialHeight: "450",
            innerHeight: !1,
            maxHeight: !1,
            scalePhotos: !0,
            scrolling: !0,
            opacity: .9,
            preloading: !0,
            className: !1,
            overlayClose: !0,
            escKey: !0,
            arrowKey: !0,
            top: !1,
            bottom: !1,
            left: !1,
            right: !1,
            fixed: !1,
            data: void 0,
            closeButton: !0,
            fastIframe: !0,
            open: !1,
            reposition: !0,
            loop: !0,
            slideshow: !1,
            slideshowAuto: !0,
            slideshowSpeed: 2500,
            slideshowStart: "start slideshow",
            slideshowStop: "stop slideshow",
            photoRegex: /\.(gif|png|jp(e|g|eg)|bmp|ico|webp|jxr|svg)((#|\?).*)?$/i,
            retinaImage: !1,
            retinaUrl: !1,
            retinaSuffix: "@2x.$1",
            current: "image {current} of {total}",
            previous: "previous",
            next: "next",
            close: "close",
            xhrError: "This content failed to load.",
            imgError: "This image failed to load.",
            returnFocus: !0,
            trapFocus: !0,
            onOpen: !1,
            onLoad: !1,
            onComplete: !1,
            onCleanup: !1,
            onClosed: !1,
            rel: function() {
                return this.rel
            },
            href: function() {
                return t(this).attr("href")
            },
            title: function() {
                return this.title
            }
        },
        Y = "colorbox",
        Z = "cbox",
        te = Z + "Element",
        ee = Z + "_open",
        ie = Z + "_load",
        ne = Z + "_complete",
        oe = Z + "_cleanup",
        re = Z + "_closed",
        he = Z + "_purge",
        se = t("<a/>"),
        ae = "div",
        le = 0,
        de = {},
        ce = function() {
            function t() {
                clearTimeout(h)
            }

            function e() {
                (_.get("loop") || E[z + 1]) && (t(), h = setTimeout(J.next, _.get("slideshowSpeed")))
            }

            function i() {
                I.html(_.get("slideshowStop")).unbind(a).one(a, n), se.bind(ne, e).bind(ie, t), x.removeClass(s + "off").addClass(s + "on")
            }

            function n() {
                t(), se.unbind(ne, e).unbind(ie, t), I.html(_.get("slideshowStart")).unbind(a).one(a, function() {
                    J.next(), i()
                }), x.removeClass(s + "on").addClass(s + "off")
            }

            function o() {
                r = !1, I.hide(), t(), se.unbind(ne, e).unbind(ie, t), x.removeClass(s + "off " + s + "on")
            }
            var r, h, s = Z + "Slideshow_",
                a = "click." + Z;
            return function() {
                r ? _.get("slideshow") || (se.unbind(oe, o), o()) : _.get("slideshow") && E[1] && (r = !0, se.one(oe, o), _.get("slideshowAuto") ? i() : n(), I.show())
            }
        }();
    t.colorbox || (t(p), J = t.fn[Y] = t[Y] = function(e, i) {
        var n, o = this;
        if (e = e || {}, t.isFunction(o)) o = t("<a/>"), e.open = !0;
        else if (!o[0]) return o;
        return o[0] ? (p(), m() && (i && (e.onComplete = i), o.each(function() {
            var i = t.data(this, Y) || {};
            t.data(this, Y, t.extend(i, e))
        }).addClass(te), n = new r(o[0], e), n.get("open") && f(o[0])), o) : o
    }, J.position = function(e, i) {
        function n() {
            T[0].style.width = k[0].style.width = b[0].style.width = parseInt(x[0].style.width, 10) - j + "px", b[0].style.height = C[0].style.height = H[0].style.height = parseInt(x[0].style.height, 10) - D + "px"
        }
        var r, h, a, l = 0,
            d = 0,
            c = x.offset();
        if (W.unbind("resize." + Z), x.css({
                top: -9e4,
                left: -9e4
            }), h = W.scrollTop(), a = W.scrollLeft(), _.get("fixed") ? (c.top -= h, c.left -= a, x.css({
                position: "fixed"
            })) : (l = h, d = a, x.css({
                position: "absolute"
            })), d += _.get("right") !== !1 ? Math.max(W.width() - _.w - N - j - s(_.get("right"), "x"), 0) : _.get("left") !== !1 ? s(_.get("left"), "x") : Math.round(Math.max(W.width() - _.w - N - j, 0) / 2), l += _.get("bottom") !== !1 ? Math.max(o() - _.h - A - D - s(_.get("bottom"), "y"), 0) : _.get("top") !== !1 ? s(_.get("top"), "y") : Math.round(Math.max(o() - _.h - A - D, 0) / 2), x.css({
                top: c.top,
                left: c.left,
                visibility: "visible"
            }), y[0].style.width = y[0].style.height = "9999px", r = {
                width: _.w + N + j,
                height: _.h + A + D,
                top: l,
                left: d
            }, e) {
            var g = 0;
            t.each(r, function(t) {
                return r[t] !== de[t] ? (g = e, void 0) : void 0
            }), e = g
        }
        de = r, e || x.css(r), x.dequeue().animate(r, {
            duration: e || 0,
            complete: function() {
                n(), q = !1, y[0].style.width = _.w + N + j + "px", y[0].style.height = _.h + A + D + "px", _.get("reposition") && setTimeout(function() {
                    W.bind("resize." + Z, J.position)
                }, 1), i && i()
            },
            step: n
        })
    }, J.resize = function(t) {
        var e;
        $ && (t = t || {}, t.width && (_.w = s(t.width, "x") - N - j), t.innerWidth && (_.w = s(t.innerWidth, "x")), L.css({
            width: _.w
        }), t.height && (_.h = s(t.height, "y") - A - D), t.innerHeight && (_.h = s(t.innerHeight, "y")), t.innerHeight || t.height || (e = L.scrollTop(), L.css({
            height: "auto"
        }), _.h = L.height()), L.css({
            height: _.h
        }), e && L.scrollTop(e), J.position("none" === _.get("transition") ? 0 : _.get("speed")))
    }, J.prep = function(i) {
        function o() {
            return _.w = _.w || L.width(), _.w = _.mw && _.mw < _.w ? _.mw : _.w, _.w
        }

        function s() {
            return _.h = _.h || L.height(), _.h = _.mh && _.mh < _.h ? _.mh : _.h, _.h
        }
        if ($) {
            var d, g = "none" === _.get("transition") ? 0 : _.get("speed");
            L.remove(), L = n(ae, "LoadedContent").append(i), L.hide().appendTo(S.show()).css({
                width: o(),
                overflow: _.get("scrolling") ? "auto" : "hidden"
            }).css({
                height: s()
            }).prependTo(b), S.hide(), t(U).css({
                "float": "none"
            }), c(_.get("className")), d = function() {
                function i() {
                    t.support.opacity === !1 && x[0].style.removeAttribute("filter")
                }
                var n, o, s = E.length;
                $ && (o = function() {
                    clearTimeout(Q), M.hide(), u(ne), _.get("onComplete")
                }, R.html(_.get("title")).show(), L.show(), s > 1 ? ("string" == typeof _.get("current") && F.html(_.get("current").replace("{current}", z + 1).replace("{total}", s)).show(), K[_.get("loop") || s - 1 > z ? "show" : "hide"]().html(_.get("next")), P[_.get("loop") || z ? "show" : "hide"]().html(_.get("previous")), ce(), _.get("preloading") && t.each([h(-1), h(1)], function() {
                    var i, n = E[this],
                        o = new r(n, t.data(n, Y)),
                        h = o.get("href");
                    h && a(o, h) && (h = l(o, h), i = e.createElement("img"), i.src = h)
                })) : O.hide(), _.get("iframe") ? (n = e.createElement("iframe"), "frameBorder" in n && (n.frameBorder = 0), "allowTransparency" in n && (n.allowTransparency = "true"), _.get("scrolling") || (n.scrolling = "no"), t(n).attr({
                    src: _.get("href"),
                    name: (new Date).getTime(),
                    "class": Z + "Iframe",
                    allowFullScreen: !0
                }).one("load", o).appendTo(L), se.one(he, function() {
                    n.src = "//about:blank"
                }), _.get("fastIframe") && t(n).trigger("load")) : o(), "fade" === _.get("transition") ? x.fadeTo(g, 1, i) : i())
            }, "fade" === _.get("transition") ? x.fadeTo(g, 0, function() {
                J.position(0, d)
            }) : J.position(g, d)
        }
    }, J.next = function() {
        !q && E[1] && (_.get("loop") || E[z + 1]) && (z = h(1), f(E[z]))
    }, J.prev = function() {
        !q && E[1] && (_.get("loop") || z) && (z = h(-1), f(E[z]))
    }, J.close = function() {
        $ && !G && (G = !0, $ = !1, u(oe), _.get("onCleanup"), W.unbind("." + Z), v.fadeTo(_.get("fadeOut") || 0, 0), x.stop().fadeTo(_.get("fadeOut") || 0, 0, function() {
            x.hide(), v.hide(), u(he), L.remove(), setTimeout(function() {
                G = !1, u(re), _.get("onClosed")
            }, 1)
        }))
    }, J.remove = function() {
        x && (x.stop(), t.colorbox.close(), x.stop().remove(), v.remove(), G = !1, x = null, t("." + te).removeData(Y).removeClass(te), t(e).unbind("click." + Z))
    }, J.element = function() {
        return t(_.el)
    }, J.settings = X)
})(jQuery, document, window);

(function() {
    "use strict";
    var $, EkkoLightbox;
    $ = jQuery;
    EkkoLightbox = function(element, options) {
        var content, footer, header, _this = this;
        this.options = $.extend({
            title: null,
            footer: null,
            remote: null
        }, $.fn.ekkoLightbox.defaults, options || {});
        this.$element = $(element);
        content = '';
        this.modal_id = this.options.modal_id ? this.options.modal_id : 'ekkoLightbox-' + Math.floor((Math.random() * 1000) + 1);
        header = '<div class="modal-header"' + (this.options.title || this.options.always_show_close ? '' : ' style="display:none"') + '><button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button><h4 class="modal-title">' + (this.options.title || "&nbsp;") + '</h4></div>';
        footer = '<div class="modal-footer"' + (this.options.footer ? '' : ' style="display:none"') + '>' + this.options.footer + '</div>';
        $(document.body).append('<div id="' + this.modal_id + '" class="ekko-lightbox modal fade" tabindex="-1"><div class="modal-dialog"><div class="modal-content">' + header + '<div class="modal-body"><div class="ekko-lightbox-container"><div></div></div></div>' + footer + '</div></div></div>');
        this.modal = $('#' + this.modal_id);
        this.modal_dialog = this.modal.find('.modal-dialog').first();
        this.modal_content = this.modal.find('.modal-content').first();
        this.modal_body = this.modal.find('.modal-body').first();
        this.lightbox_container = this.modal_body.find('.ekko-lightbox-container').first();
        this.lightbox_body = this.lightbox_container.find('> div:first-child').first();
        this.showLoading();
        this.modal_arrows = null;
        this.border = {
            top: parseFloat(this.modal_dialog.css('border-top-width')) + parseFloat(this.modal_content.css('border-top-width')) + parseFloat(this.modal_body.css('border-top-width')),
            right: parseFloat(this.modal_dialog.css('border-right-width')) + parseFloat(this.modal_content.css('border-right-width')) + parseFloat(this.modal_body.css('border-right-width')),
            bottom: parseFloat(this.modal_dialog.css('border-bottom-width')) + parseFloat(this.modal_content.css('border-bottom-width')) + parseFloat(this.modal_body.css('border-bottom-width')),
            left: parseFloat(this.modal_dialog.css('border-left-width')) + parseFloat(this.modal_content.css('border-left-width')) + parseFloat(this.modal_body.css('border-left-width'))
        };
        this.padding = {
            top: parseFloat(this.modal_dialog.css('padding-top')) + parseFloat(this.modal_content.css('padding-top')) + parseFloat(this.modal_body.css('padding-top')),
            right: parseFloat(this.modal_dialog.css('padding-right')) + parseFloat(this.modal_content.css('padding-right')) + parseFloat(this.modal_body.css('padding-right')),
            bottom: parseFloat(this.modal_dialog.css('padding-bottom')) + parseFloat(this.modal_content.css('padding-bottom')) + parseFloat(this.modal_body.css('padding-bottom')),
            left: parseFloat(this.modal_dialog.css('padding-left')) + parseFloat(this.modal_content.css('padding-left')) + parseFloat(this.modal_body.css('padding-left'))
        };
        this.modal.on('show.bs.modal', this.options.onShow.bind(this)).on('shown.bs.modal', function() {
            _this.modal_shown();
            return _this.options.onShown.call(_this);
        }).on('hide.bs.modal', this.options.onHide.bind(this)).on('hidden.bs.modal', function() {
            if (_this.gallery) {
                $(document).off('keydown.ekkoLightbox');
            }
            _this.modal.remove();
            return _this.options.onHidden.call(_this);
        }).modal('show', options);
        return this.modal;
    };
    EkkoLightbox.prototype = {
        modal_shown: function() {
            var video_id, _this = this;
            if (!this.options.remote) {
                return this.error('No remote target given');
            } else {
                this.gallery = this.$element.data('gallery');
                if (this.gallery) {
                    if (this.options.gallery_parent_selector === 'document.body' || this.options.gallery_parent_selector === '') {
                        this.gallery_items = $(document.body).find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
                    } else {
                        this.gallery_items = this.$element.parents(this.options.gallery_parent_selector).first().find('*[data-toggle="lightbox"][data-gallery="' + this.gallery + '"]');
                    }
                    this.gallery_index = this.gallery_items.index(this.$element);
                    $(document).on('keydown.ekkoLightbox', this.navigate.bind(this));
                    if (this.options.directional_arrows && this.gallery_items.length > 1) {
                        this.lightbox_container.prepend('<div class="ekko-lightbox-nav-overlay"><a href="#" class="' + this.strip_stops(this.options.left_arrow_class) + '"></a><a href="#" class="' + this.strip_stops(this.options.right_arrow_class) + '"></a></div>');
                        this.modal_arrows = this.lightbox_container.find('div.ekko-lightbox-nav-overlay').first();
                        this.lightbox_container.find('a' + this.strip_spaces(this.options.left_arrow_class)).on('click', function(event) {
                            event.preventDefault();
                            return _this.navigate_left();
                        });
                        this.lightbox_container.find('a' + this.strip_spaces(this.options.right_arrow_class)).on('click', function(event) {
                            event.preventDefault();
                            return _this.navigate_right();
                        });
                    }
                }
                if (this.options.type) {
                    if (this.options.type === 'image') {
                        return this.preloadImage(this.options.remote, true);
                    } else if (this.options.type === 'youtube' && (video_id = this.getYoutubeId(this.options.remote))) {
                        return this.showYoutubeVideo(video_id);
                    } else if (this.options.type === 'vimeo') {
                        return this.showVimeoVideo(this.options.remote);
                    } else if (this.options.type === 'instagram') {
                        return this.showInstagramVideo(this.options.remote);
                    } else if (this.options.type === 'url') {
                        return this.showInstagramVideo(this.options.remote);
                    } else {
                        return this.error("Could not detect remote target type. Force the type using data-type=\"image|youtube|vimeo|url\"");
                    }
                } else {
                    return this.detectRemoteType(this.options.remote);
                }
            }
        },
        strip_stops: function(str) {
            return str.replace(/\./g, '');
        },
        strip_spaces: function(str) {
            return str.replace(/\s/g, '');
        },
        isImage: function(str) {
            return str.match(/(^data:image\/.*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg)((\?|#).*)?$)/i);
        },
        isSwf: function(str) {
            return str.match(/\.(swf)((\?|#).*)?$/i);
        },
        getYoutubeId: function(str) {
            var match;
            match = str.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);
            if (match && match[2].length === 11) {
                return match[2];
            } else {
                return false;
            }
        },
        getVimeoId: function(str) {
            if (str.indexOf('vimeo') > 0) {
                return str;
            } else {
                return false;
            }
        },
        getInstagramId: function(str) {
            if (str.indexOf('instagram') > 0) {
                return str;
            } else {
                return false;
            }
        },
        navigate: function(event) {
            event = event || window.event;
            if (event.keyCode === 39 || event.keyCode === 37) {
                if (event.keyCode === 39) {
                    return this.navigate_right();
                } else if (event.keyCode === 37) {
                    return this.navigate_left();
                }
            }
        },
        navigateTo: function(index) {
            var next, src;
            if (index < 0 || index > this.gallery_items.length - 1) {
                return this;
            }
            this.showLoading();
            this.gallery_index = index;
            this.options.onNavigate.call(this, this.gallery_index);
            this.$element = $(this.gallery_items.get(this.gallery_index));
            this.updateTitleAndFooter();
            src = this.$element.attr('data-remote') || this.$element.attr('href');
            this.detectRemoteType(src, this.$element.attr('data-type') || false);
            if (this.gallery_index + 1 < this.gallery_items.length) {
                next = $(this.gallery_items.get(this.gallery_index + 1), false);
                src = next.attr('data-remote') || next.attr('href');
                if (next.attr('data-type') === 'image' || this.isImage(src)) {
                    return this.preloadImage(src, false);
                }
            }
        },
        navigate_left: function() {
            if (this.gallery_items.length === 1) {
                return;
            }
            if (this.gallery_index === 0) {
                this.gallery_index = this.gallery_items.length - 1;
            } else {
                this.gallery_index--;
            }
            this.options.onNavigate.call(this, 'left', this.gallery_index);
            return this.navigateTo(this.gallery_index);
        },
        navigate_right: function() {
            if (this.gallery_items.length === 1) {
                return;
            }
            if (this.gallery_index === this.gallery_items.length - 1) {
                this.gallery_index = 0;
            } else {
                this.gallery_index++;
            }
            this.options.onNavigate.call(this, 'right', this.gallery_index);
            return this.navigateTo(this.gallery_index);
        },
        detectRemoteType: function(src, type) {
            var video_id;
            if (type === 'image' || this.isImage(src)) {
                this.options.type = 'image';
                return this.preloadImage(src, true);
            } else if (type === 'youtube' || (video_id = this.getYoutubeId(src))) {
                this.options.type = 'youtube';
                return this.showYoutubeVideo(video_id);
            } else if (type === 'vimeo' || (video_id = this.getVimeoId(src))) {
                this.options.type = 'vimeo';
                return this.showVimeoVideo(video_id);
            } else if (type === 'instagram' || (video_id = this.getInstagramId(src))) {
                this.options.type = 'instagram';
                return this.showInstagramVideo(video_id);
            } else if (type === 'url' || (video_id = this.getInstagramId(src))) {
                this.options.type = 'instagram';
                return this.showInstagramVideo(video_id);
            } else {
                this.options.type = 'url';
                return this.loadRemoteContent(src);
            }
        },
        updateTitleAndFooter: function() {
            var caption, footer, header, title;
            header = this.modal_content.find('.modal-header');
            footer = this.modal_content.find('.modal-footer');
            title = this.$element.data('title') || "";
            caption = this.$element.data('footer') || "";
            if (title || this.options.always_show_close) {
                header.css('display', '').find('.modal-title').html(title || "&nbsp;");
            } else {
                header.css('display', 'none');
            }
            if (caption) {
                footer.css('display', '').html(caption);
            } else {
                footer.css('display', 'none');
            }
            return this;
        },
        showLoading: function() {
            this.lightbox_body.html('<div class="modal-loading">Loading..</div>');
            return this;
        },
        showYoutubeVideo: function(id) {
            var aspectRatio, height, width;
            aspectRatio = 560 / 315;
            width = this.$element.data('width') || 560;
            width = this.checkDimensions(width);
            height = width / aspectRatio;
            this.resize(width);
            this.lightbox_body.html('<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + id + '?badge=0&autoplay=1&html5=1" frameborder="0" allowfullscreen></iframe>');
            this.options.onContentLoaded.call(this);
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'none');
            }
        },
        showVimeoVideo: function(id) {
            var aspectRatio, height, width;
            aspectRatio = 500 / 281;
            width = this.$element.data('width') || 560;
            width = this.checkDimensions(width);
            height = width / aspectRatio;
            this.resize(width);
            this.lightbox_body.html('<iframe width="' + width + '" height="' + height + '" src="' + id + '?autoplay=1" frameborder="0" allowfullscreen></iframe>');
            this.options.onContentLoaded.call(this);
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'none');
            }
        },
        showInstagramVideo: function(id) {
            var width;
            width = this.$element.data('width') || 612;
            width = this.checkDimensions(width);
            this.resize(width);
            this.lightbox_body.html('<iframe width="' + width + '" height="' + width + '" src="' + this.addTrailingSlash(id) + 'embed/" frameborder="0" allowfullscreen></iframe>');
            this.options.onContentLoaded.call(this);
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'none');
            }
        },
        loadRemoteContent: function(url) {
            var disableExternalCheck, width, _this = this;
            width = this.$element.data('width') || 560;
            this.resize(width);
            disableExternalCheck = this.$element.data('disableExternalCheck') || false;
            console.log(disableExternalCheck, this.isExternal(url));
            if (!disableExternalCheck && !this.isExternal(url)) {
                this.lightbox_body.load(url, $.proxy(function() {
                    return _this.$element.trigger('loaded.bs.modal');
                }));
            } else {
                this.lightbox_body.html('<iframe width="' + width + '" height="' + width + '" src="' + url + '" frameborder="0" allowfullscreen></iframe>');
                this.options.onContentLoaded.call(this);
            }
            if (this.modal_arrows) {
                return this.modal_arrows.css('display', 'block');
            }
        },
        isExternal: function(url) {
            var match;
            match = url.match(/^([^:\/?#]+:)?(?:\/\/([^\/?#]*))?([^?#]+)?(\?[^#]*)?(#.*)?/);
            if (typeof match[1] === "string" && match[1].length > 0 && match[1].toLowerCase() !== location.protocol) {
                return true;
            }
            if (typeof match[2] === "string" && match[2].length > 0 && match[2].replace(new RegExp(":(" + {
                        "http:": 80,
                        "https:": 443
                    }[location.protocol] + ")?$"), "") !== location.host) {
                return true;
            }
            return false;
        },
        error: function(message) {
            this.lightbox_body.html(message);
            return this;
        },
        preloadImage: function(src, onLoadShowImage) {
            var img, _this = this;
            img = new Image();
            if ((onLoadShowImage == null) || onLoadShowImage === true) {
                img.onload = function() {
                    var image;
                    image = $('<img />');
                    image.attr('src', img.src);
                    image.addClass('img-responsive');
                    _this.lightbox_body.html(image);
                    if (_this.modal_arrows) {
                        _this.modal_arrows.css('display', 'block');
                    }
                    _this.resize(img.width);
                    return _this.options.onContentLoaded.call(_this);
                };
                img.onerror = function() {
                    return _this.error('Failed to load image: ' + src);
                };
            }
            img.src = src;
            return img;
        },
        resize: function(width) {
            var width_total;
            width_total = width + this.border.left + this.padding.left + this.padding.right + this.border.right;
            this.modal_dialog.css('width', 'auto').css('max-width', width_total);
            this.lightbox_container.find('a').css('padding-top', function() {
                return $(this).parent().height() / 2;
            });
            return this;
        },
        checkDimensions: function(width) {
            var body_width, width_total;
            width_total = width + this.border.left + this.padding.left + this.padding.right + this.border.right;
            body_width = document.body.clientWidth;
            if (width_total > body_width) {
                width = this.modal_body.width();
            }
            return width;
        },
        close: function() {
            return this.modal.modal('hide');
        },
        addTrailingSlash: function(url) {
            if (url.substr(-1) !== '/') {
                url += '/';
            }
            return url;
        }
    };
    $.fn.ekkoLightbox = function(options) {
        return this.each(function() {
            var $this;
            $this = $(this);
            options = $.extend({
                remote: $this.attr('data-remote') || $this.attr('href'),
                gallery_parent_selector: $this.attr('data-parent'),
                type: $this.attr('data-type')
            }, options, $this.data());
            new EkkoLightbox(this, options);
            return this;
        });
    };
    $.fn.ekkoLightbox.defaults = {
        gallery_parent_selector: '*:not(.row)',
        left_arrow_class: '.glyphicon .glyphicon-chevron-left',
        right_arrow_class: '.glyphicon .glyphicon-chevron-right',
        directional_arrows: true,
        type: null,
        always_show_close: true,
        onShow: function() {},
        onShown: function() {},
        onHide: function() {},
        onHidden: function() {},
        onNavigate: function() {},
        onContentLoaded: function() {}
    };
}).call(this);

if (typeof Object.create !== "function") {
    Object.create = function(e) {
        function t() {}
        t.prototype = e;
        return new t
    }
}
var ua = {
    toString: function() {
        return navigator.userAgent
    },
    test: function(e) {
        return this.toString().toLowerCase().indexOf(e.toLowerCase()) > -1
    }
};
ua.version = (ua.toString().toLowerCase().match(/[\s\S]+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
ua.webkit = ua.test("webkit");
ua.gecko = ua.test("gecko") && !ua.webkit;
ua.opera = ua.test("opera");
ua.ie = ua.test("msie") && !ua.opera;
ua.ie6 = ua.ie && document.compatMode && typeof document.documentElement.style.maxHeight === "undefined";
ua.ie7 = ua.ie && document.documentElement && typeof document.documentElement.style.maxHeight !== "undefined" && typeof XDomainRequest === "undefined";
ua.ie8 = ua.ie && typeof XDomainRequest !== "undefined";
var domReady = function() {
    var e = [];
    var t = function() {
        if (!arguments.callee.done) {
            arguments.callee.done = true;
            for (var t = 0; t < e.length; t++) {
                e[t]()
            }
        }
    };
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", t, false)
    }
    if (ua.ie) {
        (function() {
            try {
                document.documentElement.doScroll("left")
            } catch (e) {
                setTimeout(arguments.callee, 50);
                return
            }
            t()
        })();
        document.onreadystatechange = function() {
            if (document.readyState === "complete") {
                document.onreadystatechange = null;
                t()
            }
        }
    }
    if (ua.webkit && document.readyState) {
        (function() {
            if (document.readyState !== "loading") {
                t()
            } else {
                setTimeout(arguments.callee, 10)
            }
        })()
    }
    window.onload = t;
    return function(t) {
        if (typeof t === "function") {
            e[e.length] = t
        }
        return t
    }
}();
var cssHelper = function() {
    var e = {
        BLOCKS: /[^\s{;][^{;]*\{(?:[^{}]*\{[^{}]*\}[^{}]*|[^{}]*)*\}/g,
        BLOCKS_INSIDE: /[^\s{][^{]*\{[^{}]*\}/g,
        DECLARATIONS: /[a-zA-Z\-]+[^;]*:[^;]+;/g,
        RELATIVE_URLS: /url\(['"]?([^\/\)'"][^:\)'"]+)['"]?\)/g,
        REDUNDANT_COMPONENTS: /(?:\/\*([^*\\\\]|\*(?!\/))+\*\/|@import[^;]+;)/g,
        REDUNDANT_WHITESPACE: /\s*(,|:|;|\{|\})\s*/g,
        WHITESPACE_IN_PARENTHESES: /\(\s*(\S*)\s*\)/g,
        MORE_WHITESPACE: /\s{2,}/g,
        FINAL_SEMICOLONS: /;\}/g,
        NOT_WHITESPACE: /\S+/g
    };
    var t, n = false;
    var r = [];
    var s = function(e) {
        if (typeof e === "function") {
            r[r.length] = e
        }
    };
    var o = function() {
        for (var e = 0; e < r.length; e++) {
            r[e](t)
        }
    };
    var u = {};
    var a = function(e, t) {
        if (u[e]) {
            var n = u[e].listeners;
            if (n) {
                for (var r = 0; r < n.length; r++) {
                    n[r](t)
                }
            }
        }
    };
    var f = function(e, t, n) {
        if (ua.ie && !window.XMLHttpRequest) {
            window.XMLHttpRequest = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            }
        }
        if (!XMLHttpRequest) {
            return ""
        }
        var r = new XMLHttpRequest;
        try {
            r.open("get", e, true);
            r.setRequestHeader("X_REQUESTED_WITH", "XMLHttpRequest")
        } catch (i) {
            n();
            return
        }
        var s = false;
        setTimeout(function() {
            s = true
        }, 5e3);
        document.documentElement.style.cursor = "progress";
        r.onreadystatechange = function() {
            if (r.readyState === 4 && !s) {
                if (!r.status && location.protocol === "file:" || r.status >= 200 && r.status < 300 || r.status === 304 || navigator.userAgent.indexOf("Safari") > -1 && typeof r.status === "undefined") {
                    t(r.responseText)
                } else {
                    n()
                }
                document.documentElement.style.cursor = "";
                r = null
            }
        };
        r.send("")
    };
    var l = function(t) {
        t = t.replace(e.REDUNDANT_COMPONENTS, "");
        t = t.replace(e.REDUNDANT_WHITESPACE, "$1");
        t = t.replace(e.WHITESPACE_IN_PARENTHESES, "($1)");
        t = t.replace(e.MORE_WHITESPACE, " ");
        t = t.replace(e.FINAL_SEMICOLONS, "}");
        return t
    };
    var c = {
        stylesheet: function(t) {
            var n = {};
            var r = [],
                i = [],
                s = [],
                o = [];
            var u = t.cssHelperText;
            var a = t.getAttribute("media");
            if (a) {
                var f = a.toLowerCase().split(",")
            } else {
                var f = ["all"]
            }
            for (var l = 0; l < f.length; l++) {
                r[r.length] = c.mediaQuery(f[l], n)
            }
            var h = u.match(e.BLOCKS);
            if (h !== null) {
                for (var l = 0; l < h.length; l++) {
                    if (h[l].substring(0, 7) === "@media ") {
                        var p = c.mediaQueryList(h[l], n);
                        s = s.concat(p.getRules());
                        i[i.length] = p
                    } else {
                        s[s.length] = o[o.length] = c.rule(h[l], n, null)
                    }
                }
            }
            n.element = t;
            n.getCssText = function() {
                return u
            };
            n.getAttrMediaQueries = function() {
                return r
            };
            n.getMediaQueryLists = function() {
                return i
            };
            n.getRules = function() {
                return s
            };
            n.getRulesWithoutMQ = function() {
                return o
            };
            return n
        },
        mediaQueryList: function(t, n) {
            var r = {};
            var i = t.indexOf("{");
            var s = t.substring(0, i);
            t = t.substring(i + 1, t.length - 1);
            var o = [],
                u = [];
            var a = s.toLowerCase().substring(7).split(",");
            for (var f = 0; f < a.length; f++) {
                o[o.length] = c.mediaQuery(a[f], r)
            }
            var l = t.match(e.BLOCKS_INSIDE);
            if (l !== null) {
                for (f = 0; f < l.length; f++) {
                    u[u.length] = c.rule(l[f], n, r)
                }
            }
            r.type = "mediaQueryList";
            r.getMediaQueries = function() {
                return o
            };
            r.getRules = function() {
                return u
            };
            r.getListText = function() {
                return s
            };
            r.getCssText = function() {
                return t
            };
            return r
        },
        mediaQuery: function(t, n) {
            t = t || "";
            var r, i;
            if (n.type === "mediaQueryList") {
                r = n
            } else {
                i = n
            }
            var s = false,
                o;
            var u = [];
            var a = true;
            var f = t.match(e.NOT_WHITESPACE);
            for (var l = 0; l < f.length; l++) {
                var c = f[l];
                if (!o && (c === "not" || c === "only")) {
                    if (c === "not") {
                        s = true
                    }
                } else if (!o) {
                    o = c
                } else if (c.charAt(0) === "(") {
                    var h = c.substring(1, c.length - 1).split(":");
                    u[u.length] = {
                        mediaFeature: h[0],
                        value: h[1] || null
                    }
                }
            }
            return {
                getQueryText: function() {
                    return t
                },
                getAttrStyleSheet: function() {
                    return i || null
                },
                getList: function() {
                    return r || null
                },
                getValid: function() {
                    return a
                },
                getNot: function() {
                    return s
                },
                getMediaType: function() {
                    return o
                },
                getExpressions: function() {
                    return u
                }
            }
        },
        rule: function(e, t, n) {
            var r = {};
            var i = e.indexOf("{");
            var s = e.substring(0, i);
            var o = s.split(",");
            var u = [];
            var a = e.substring(i + 1, e.length - 1).split(";");
            for (var f = 0; f < a.length; f++) {
                u[u.length] = c.declaration(a[f], r)
            }
            r.getStylesheet = function() {
                return t || null
            };
            r.getMediaQueryList = function() {
                return n || null
            };
            r.getSelectors = function() {
                return o
            };
            r.getSelectorText = function() {
                return s
            };
            r.getDeclarations = function() {
                return u
            };
            r.getPropertyValue = function(e) {
                for (var t = 0; t < u.length; t++) {
                    if (u[t].getProperty() === e) {
                        return u[t].getValue()
                    }
                }
                return null
            };
            return r
        },
        declaration: function(e, t) {
            var n = e.indexOf(":");
            var r = e.substring(0, n);
            var i = e.substring(n + 1);
            return {
                getRule: function() {
                    return t || null
                },
                getProperty: function() {
                    return r
                },
                getValue: function() {
                    return i
                }
            }
        }
    };
    var h = function(e) {
        if (typeof e.cssHelperText !== "string") {
            return
        }
        var n = {
            stylesheet: null,
            mediaQueryLists: [],
            rules: [],
            selectors: {},
            declarations: [],
            properties: {}
        };
        var r = n.stylesheet = c.stylesheet(e);
        var s = n.mediaQueryLists = r.getMediaQueryLists();
        var o = n.rules = r.getRules();
        var u = n.selectors;
        var a = function(e) {
            var t = e.getSelectors();
            for (var n = 0; n < t.length; n++) {
                var r = t[n];
                if (!u[r]) {
                    u[r] = []
                }
                u[r][u[r].length] = e
            }
        };
        for (i = 0; i < o.length; i++) {
            a(o[i])
        }
        var f = n.declarations;
        for (i = 0; i < o.length; i++) {
            f = n.declarations = f.concat(o[i].getDeclarations())
        }
        var l = n.properties;
        for (i = 0; i < f.length; i++) {
            var h = f[i].getProperty();
            if (!l[h]) {
                l[h] = []
            }
            l[h][l[h].length] = f[i]
        }
        e.cssHelperParsed = n;
        t[t.length] = e;
        return n
    };
    var p = function(e, t) {
        return;
        e.cssHelperText = l(t || e.innerHTML);
        return h(e)
    };
    var d = function() {
        n = true;
        t = [];
        var r = [];
        var i = function() {
            for (var e = 0; e < r.length; e++) {
                h(r[e])
            }
            var t = document.getElementsByTagName("style");
            for (e = 0; e < t.length; e++) {
                p(t[e])
            }
            n = false;
            o()
        };
        var s = document.getElementsByTagName("link");
        for (var u = 0; u < s.length; u++) {
            var a = s[u];
            if (a.getAttribute("rel").indexOf("style") > -1 && a.href && a.href.length !== 0 && !a.disabled) {
                r[r.length] = a
            }
        }
        if (r.length > 0) {
            var c = 0;
            var d = function() {
                c++;
                if (c === r.length) {
                    i()
                }
            };
            var v = function(t) {
                var n = t.href;
                f(n, function(r) {
                    r = l(r).replace(e.RELATIVE_URLS, "url(" + n.substring(0, n.lastIndexOf("/")) + "/$1)");
                    t.cssHelperText = r;
                    d()
                }, d)
            };
            for (u = 0; u < r.length; u++) {
                v(r[u])
            }
        } else {
            i()
        }
    };
    var v = {
        stylesheets: "array",
        mediaQueryLists: "array",
        rules: "array",
        selectors: "object",
        declarations: "array",
        properties: "object"
    };
    var m = {
        stylesheets: null,
        mediaQueryLists: null,
        rules: null,
        selectors: null,
        declarations: null,
        properties: null
    };
    var g = function(e, t) {
        if (m[e] !== null) {
            if (v[e] === "array") {
                return m[e] = m[e].concat(t)
            } else {
                var n = m[e];
                for (var r in t) {
                    if (t.hasOwnProperty(r)) {
                        if (!n[r]) {
                            n[r] = t[r]
                        } else {
                            n[r] = n[r].concat(t[r])
                        }
                    }
                }
                return n
            }
        }
    };
    var y = function(e) {
        m[e] = v[e] === "array" ? [] : {};
        for (var n = 0; n < t.length; n++) {
            var r = e === "stylesheets" ? "stylesheet" : e;
            g(e, t[n].cssHelperParsed[r])
        }
        return m[e]
    };
    var b = function(e) {
        if (typeof window.innerWidth != "undefined") {
            return window["inner" + e]
        } else if (typeof document.documentElement !== "undefined" && typeof document.documentElement.clientWidth !== "undefined" && document.documentElement.clientWidth != 0) {
            return document.documentElement["client" + e]
        }
    };
    return {
        addStyle: function(e, t, n) {
            var r = document.createElement("style");
            r.setAttribute("type", "text/css");
            if (t && t.length > 0) {
                r.setAttribute("media", t.join(","))
            }
            document.getElementsByTagName("head")[0].appendChild(r);
            if (r.styleSheet) {
                r.styleSheet.cssText = e
            } else {
                r.appendChild(document.createTextNode(e))
            }
            r.addedWithCssHelper = true;
            if (typeof n === "undefined" || n === true) {
                cssHelper.parsed(function(t) {
                    var n = p(r, e);
                    for (var i in n) {
                        if (n.hasOwnProperty(i)) {
                            g(i, n[i])
                        }
                    }
                    a("newStyleParsed", r)
                })
            } else {
                r.parsingDisallowed = true
            }
            return r
        },
        removeStyle: function(e) {
            return e.parentNode.removeChild(e)
        },
        parsed: function(e) {
            if (n) {
                s(e)
            } else {
                if (typeof t !== "undefined") {
                    if (typeof e === "function") {
                        e(t)
                    }
                } else {
                    s(e);
                    d()
                }
            }
        },
        stylesheets: function(e) {
            cssHelper.parsed(function(t) {
                e(m.stylesheets || y("stylesheets"))
            })
        },
        mediaQueryLists: function(e) {
            cssHelper.parsed(function(t) {
                e(m.mediaQueryLists || y("mediaQueryLists"))
            })
        },
        rules: function(e) {
            cssHelper.parsed(function(t) {
                e(m.rules || y("rules"))
            })
        },
        selectors: function(e) {
            cssHelper.parsed(function(t) {
                e(m.selectors || y("selectors"))
            })
        },
        declarations: function(e) {
            cssHelper.parsed(function(t) {
                e(m.declarations || y("declarations"))
            })
        },
        properties: function(e) {
            cssHelper.parsed(function(t) {
                e(m.properties || y("properties"))
            })
        },
        broadcast: a,
        addListener: function(e, t) {
            if (typeof t === "function") {
                if (!u[e]) {
                    u[e] = {
                        listeners: []
                    }
                }
                u[e].listeners[u[e].listeners.length] = t
            }
        },
        removeListener: function(e, t) {
            if (typeof t === "function" && u[e]) {
                var n = u[e].listeners;
                for (var r = 0; r < n.length; r++) {
                    if (n[r] === t) {
                        n.splice(r, 1);
                        r -= 1
                    }
                }
            }
        },
        getViewportWidth: function() {
            return b("Width")
        },
        getViewportHeight: function() {
            return b("Height")
        }
    }
}();
domReady(function() {
    var t;
    var n = {
        LENGTH_UNIT: /[0-9]+(em|ex|px|in|cm|mm|pt|pc)$/,
        RESOLUTION_UNIT: /[0-9]+(dpi|dpcm)$/,
        ASPECT_RATIO: /^[0-9]+\/[0-9]+$/,
        ABSOLUTE_VALUE: /^[0-9]*(\.[0-9]+)*$/
    };
    var r = [];
    var i = function() {
        var e = "css3-mediaqueries-test";
        var t = document.createElement("div");
        t.id = e;
        var n = cssHelper.addStyle("@media all and (width) { #" + e + " { width: 1px !important; } }", [], false);
        document.body.appendChild(t);
        var r = t.offsetWidth === 1;
        n.parentNode.removeChild(n);
        t.parentNode.removeChild(t);
        i = function() {
            return r
        };
        return r
    };
    var s = function() {
        t = document.createElement("div");
        t.style.cssText = "position:absolute;top:-9999em;left:-9999em;" + "margin:0;border:none;padding:0;width:1em;font-size:1em;";
        document.body.appendChild(t);
        if (t.offsetWidth !== 16) {
            t.style.fontSize = 16 / t.offsetWidth + "em"
        }
        t.style.width = ""
    };
    var o = function(e) {
        t.style.width = e;
        var n = t.offsetWidth;
        t.style.width = "";
        return n
    };
    var u = function(e, t) {
        var r = e.length;
        var i = e.substring(0, 4) === "min-";
        var s = !i && e.substring(0, 4) === "max-";
        if (t !== null) {
            var u;
            var a;
            if (n.LENGTH_UNIT.exec(t)) {
                u = "length";
                a = o(t)
            } else if (n.RESOLUTION_UNIT.exec(t)) {
                u = "resolution";
                a = parseInt(t, 10);
                var f = t.substring((a + "").length)
            } else if (n.ASPECT_RATIO.exec(t)) {
                u = "aspect-ratio";
                a = t.split("/")
            } else if (n.ABSOLUTE_VALUE) {
                u = "absolute";
                a = t
            } else {
                u = "unknown"
            }
        }
        var l, c;
        if ("device-width" === e.substring(r - 12, r)) {
            l = screen.width;
            if (t !== null) {
                if (u === "length") {
                    return i && l >= a || s && l < a || !i && !s && l === a
                } else {
                    return false
                }
            } else {
                return l > 0
            }
        } else if ("device-height" === e.substring(r - 13, r)) {
            c = screen.height;
            if (t !== null) {
                if (u === "length") {
                    return i && c >= a || s && c < a || !i && !s && c === a
                } else {
                    return false
                }
            } else {
                return c > 0
            }
        } else if ("width" === e.substring(r - 5, r)) {
            l = document.documentElement.clientWidth || document.body.clientWidth;
            if (t !== null) {
                if (u === "length") {
                    return i && l >= a || s && l < a || !i && !s && l === a
                } else {
                    return false
                }
            } else {
                return l > 0
            }
        } else if ("height" === e.substring(r - 6, r)) {
            c = document.documentElement.clientHeight || document.body.clientHeight;
            if (t !== null) {
                if (u === "length") {
                    return i && c >= a || s && c < a || !i && !s && c === a
                } else {
                    return false
                }
            } else {
                return c > 0
            }
        } else if ("device-aspect-ratio" === e.substring(r - 19, r)) {
            return u === "aspect-ratio" && screen.width * a[1] === screen.height * a[0]
        } else if ("color-index" === e.substring(r - 11, r)) {
            var h = Math.pow(2, screen.colorDepth);
            if (t !== null) {
                if (u === "absolute") {
                    return i && h >= a || s && h < a || !i && !s && h === a
                } else {
                    return false
                }
            } else {
                return h > 0
            }
        } else if ("color" === e.substring(r - 5, r)) {
            var p = screen.colorDepth;
            if (t !== null) {
                if (u === "absolute") {
                    return i && p >= a || s && p < a || !i && !s && p === a
                } else {
                    return false
                }
            } else {
                return p > 0
            }
        } else if ("resolution" === e.substring(r - 10, r)) {
            var d;
            if (f === "dpcm") {
                d = o("1cm")
            } else {
                d = o("1in")
            }
            if (t !== null) {
                if (u === "resolution") {
                    return i && d >= a || s && d < a || !i && !s && d === a
                } else {
                    return false
                }
            } else {
                return d > 0
            }
        } else {
            return false
        }
    };
    var a = function(e) {
        var t = e.getValid();
        var n = e.getExpressions();
        var r = n.length;
        if (r > 0) {
            for (var i = 0; i < r && t; i++) {
                t = u(n[i].mediaFeature, n[i].value)
            }
            var s = e.getNot();
            return t && !s || s && !t
        }
        return t
    };
    var f = function(e, t) {
        var n = e.getMediaQueries();
        var i = {};
        for (var s = 0; s < n.length; s++) {
            var o = n[s].getMediaType();
            if (n[s].getExpressions().length === 0) {
                continue
            }
            var u = true;
            if (o !== "all" && t && t.length > 0) {
                u = false;
                for (var f = 0; f < t.length; f++) {
                    if (t[f] === o) {
                        u = true
                    }
                }
            }
            if (u && a(n[s])) {
                i[o] = true
            }
        }
        var l = [],
            c = 0;
        for (var h in i) {
            if (i.hasOwnProperty(h)) {
                if (c > 0) {
                    l[c++] = ","
                }
                l[c++] = h
            }
        }
        if (l.length > 0) {
            r[r.length] = cssHelper.addStyle("@media " + l.join("") + "{" + e.getCssText() + "}", t, false)
        }
    };
    var l = function(e, t) {
        for (var n = 0; n < e.length; n++) {
            f(e[n], t)
        }
    };
    var c = function(e) {
        var t = e.getAttrMediaQueries();
        var n = false;
        var i = {};
        for (var s = 0; s < t.length; s++) {
            if (a(t[s])) {
                i[t[s].getMediaType()] = t[s].getExpressions().length > 0
            }
        }
        var o = [],
            u = [];
        for (var f in i) {
            if (i.hasOwnProperty(f)) {
                o[o.length] = f;
                if (i[f]) {
                    u[u.length] = f
                }
                if (f === "all") {
                    n = true
                }
            }
        }
        if (u.length > 0) {
            r[r.length] = cssHelper.addStyle(e.getCssText(), u, false)
        }
        var c = e.getMediaQueryLists();
        if (n) {
            l(c)
        } else {
            l(c, o)
        }
    };
    var h = function(e) {
        for (var t = 0; t < e.length; t++) {
            c(e[t])
        }
        if (ua.ie) {
            document.documentElement.style.display = "block";
            setTimeout(function() {
                document.documentElement.style.display = ""
            }, 0);
            setTimeout(function() {
                cssHelper.broadcast("cssMediaQueriesTested")
            }, 100)
        } else {
            cssHelper.broadcast("cssMediaQueriesTested")
        }
    };
    var p = function() {
        for (var e = 0; e < r.length; e++) {
            cssHelper.removeStyle(r[e])
        }
        r = [];
        cssHelper.stylesheets(h)
    };
    var d = 0;
    var v = function() {
        var e = cssHelper.getViewportWidth();
        var t = cssHelper.getViewportHeight();
        if (ua.ie) {
            var n = document.createElement("div");
            n.style.position = "absolute";
            n.style.top = "-9999em";
            n.style.overflow = "scroll";
            document.body.appendChild(n);
            d = n.offsetWidth - n.clientWidth;
            document.body.removeChild(n)
        }
        var r;
        var s = function() {
            var n = cssHelper.getViewportWidth();
            var s = cssHelper.getViewportHeight();
            if (Math.abs(n - e) > d || Math.abs(s - t) > d) {
                e = n;
                t = s;
                clearTimeout(r);
                r = setTimeout(function() {
                    if (!i()) {
                        p()
                    } else {
                        cssHelper.broadcast("cssMediaQueriesTested")
                    }
                }, 500)
            }
        };
        window.onresize = function() {
            var e = window.onresize || function() {};
            return function() {
                e();
                s()
            }
        }()
    };
    var m = document.documentElement;
    m.style.marginLeft = "-32767px";
    setTimeout(function() {
        m.style.marginLeft = ""
    }, 5e3);
    return function() {
        if (!i()) {
            cssHelper.addListener("newStyleParsed", function(e) {
                c(e.cssHelperParsed.stylesheet)
            });
            cssHelper.addListener("cssMediaQueriesTested", function() {
                if (ua.ie) {
                    m.style.width = "1px"
                }
                setTimeout(function() {
                    m.style.width = "";
                    m.style.marginLeft = ""
                }, 0);
                cssHelper.removeListener("cssMediaQueriesTested", arguments.callee)
            });
            s();
            p()
        } else {
            m.style.marginLeft = ""
        }
        v()
    }
}());
try {
    document.execCommand("BackgroundImageCache", false, true)
} catch (e) {};

(function(l, f) {
    function m() {
        var a = e.elements;
        return "string" == typeof a ? a.split(" ") : a
    }

    function i(a) {
        var b = n[a[o]];
        b || (b = {}, h++, a[o] = h, n[h] = b);
        return b
    }

    function p(a, b, c) {
        b || (b = f);
        if (g) return b.createElement(a);
        c || (c = i(b));
        b = c.cache[a] ? c.cache[a].cloneNode() : r.test(a) ? (c.cache[a] = c.createElem(a)).cloneNode() : c.createElem(a);
        return b.canHaveChildren && !s.test(a) ? c.frag.appendChild(b) : b
    }

    function t(a, b) {
        if (!b.cache) b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, b.frag = b.createFrag();
        a.createElement = function(c) {
            return !e.shivMethods ? b.createElem(c) : p(c, a, b)
        };
        a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function(a) {
                b.createElem(a);
                b.frag.createElement(a);
                return 'c("' + a + '")'
            }) + ");return n}")(e, b.frag)
    }

    function q(a) {
        a || (a = f);
        var b = i(a);
        if (e.shivCSS && !j && !b.hasCSS) {
            var c, d = a;
            c = d.createElement("p");
            d = d.getElementsByTagName("head")[0] || d.documentElement;
            c.innerHTML = "x<style>article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}</style>";
            c = d.insertBefore(c.lastChild, d.firstChild);
            b.hasCSS = !!c
        }
        g || t(a, b);
        return a
    }
    var k = l.html5 || {},
        s = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,
        r = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,
        j, o = "_html5shiv",
        h = 0,
        n = {},
        g;
    (function() {
        try {
            var a = f.createElement("a");
            a.innerHTML = "<xyz></xyz>";
            j = "hidden" in a;
            var b;
            if (!(b = 1 == a.childNodes.length)) {
                f.createElement("a");
                var c = f.createDocumentFragment();
                b = "undefined" == typeof c.cloneNode || "undefined" == typeof c.createDocumentFragment || "undefined" == typeof c.createElement
            }
            g = b
        } catch (d) {
            g = j = !0
        }
    })();
    var e = {
        elements: k.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
        version: "3.7.0",
        shivCSS: !1 !== k.shivCSS,
        supportsUnknownElements: g,
        shivMethods: !1 !== k.shivMethods,
        type: "default",
        shivDocument: q,
        createElement: p,
        createDocumentFragment: function(a, b) {
            a || (a = f);
            if (g) return a.createDocumentFragment();
            for (var b = b || i(a), c = b.frag.cloneNode(), d = 0, e = m(), h = e.length; d < h; d++) c.createElement(e[d]);
            return c
        }
    };
    l.html5 = e;
    q(f)
})(this, document);
/*! Respond.js v1.4.2: min/max-width media query polyfill * Copyright 2013 Scott Jehl
 * Licensed under https://github.com/scottjehl/Respond/blob/master/LICENSE-MIT
 *  */

! function(a) {
    "use strict";
    a.matchMedia = a.matchMedia || function(a) {
            var b, c = a.documentElement,
                d = c.firstElementChild || c.firstChild,
                e = a.createElement("body"),
                f = a.createElement("div");
            return f.id = "mq-test-1", f.style.cssText = "position:absolute;top:-100em", e.style.background = "none", e.appendChild(f),
                function(a) {
                    return f.innerHTML = '&shy;<style media="' + a + '"> #mq-test-1 { width: 42px; }</style>', c.insertBefore(e, d), b = 42 === f.offsetWidth, c.removeChild(e), {
                        matches: b,
                        media: a
                    }
                }
        }(a.document)
}(this),
    function(a) {
        "use strict";

        function b() {
            u(!0)
        }
        var c = {};
        a.respond = c, c.update = function() {};
        var d = [],
            e = function() {
                var b = !1;
                try {
                    b = new a.XMLHttpRequest
                } catch (c) {
                    b = new a.ActiveXObject("Microsoft.XMLHTTP")
                }
                return function() {
                    return b
                }
            }(),
            f = function(a, b) {
                var c = e();
                c && (c.open("GET", a, !0), c.onreadystatechange = function() {
                    4 !== c.readyState || 200 !== c.status && 304 !== c.status || b(c.responseText)
                }, 4 !== c.readyState && c.send(null))
            };
        if (c.ajax = f, c.queue = d, c.regex = {
                media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
                keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
                urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
                findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
                only: /(only\s+)?([a-zA-Z]+)\s?/,
                minw: /\([\s]*min\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/,
                maxw: /\([\s]*max\-width\s*:[\s]*([\s]*[0-9\.]+)(px|em)[\s]*\)/
            }, c.mediaQueriesSupported = a.matchMedia && null !== a.matchMedia("only all") && a.matchMedia("only all").matches, !c.mediaQueriesSupported) {
            var g, h, i, j = a.document,
                k = j.documentElement,
                l = [],
                m = [],
                n = [],
                o = {},
                p = 30,
                q = j.getElementsByTagName("head")[0] || k,
                r = j.getElementsByTagName("base")[0],
                s = q.getElementsByTagName("link"),
                t = function() {
                    var a, b = j.createElement("div"),
                        c = j.body,
                        d = k.style.fontSize,
                        e = c && c.style.fontSize,
                        f = !1;
                    return b.style.cssText = "position:absolute;font-size:1em;width:1em", c || (c = f = j.createElement("body"), c.style.background = "none"), k.style.fontSize = "100%", c.style.fontSize = "100%", c.appendChild(b), f && k.insertBefore(c, k.firstChild), a = b.offsetWidth, f ? k.removeChild(c) : c.removeChild(b), k.style.fontSize = d, e && (c.style.fontSize = e), a = i = parseFloat(a)
                },
                u = function(b) {
                    var c = "clientWidth",
                        d = k[c],
                        e = "CSS1Compat" === j.compatMode && d || j.body[c] || d,
                        f = {},
                        o = s[s.length - 1],
                        r = (new Date).getTime();
                    if (b && g && p > r - g) return a.clearTimeout(h), h = a.setTimeout(u, p), void 0;
                    g = r;
                    for (var v in l)
                        if (l.hasOwnProperty(v)) {
                            var w = l[v],
                                x = w.minw,
                                y = w.maxw,
                                z = null === x,
                                A = null === y,
                                B = "em";
                            x && (x = parseFloat(x) * (x.indexOf(B) > -1 ? i || t() : 1)), y && (y = parseFloat(y) * (y.indexOf(B) > -1 ? i || t() : 1)), w.hasquery && (z && A || !(z || e >= x) || !(A || y >= e)) || (f[w.media] || (f[w.media] = []), f[w.media].push(m[w.rules]))
                        }
                    for (var C in n) n.hasOwnProperty(C) && n[C] && n[C].parentNode === q && q.removeChild(n[C]);
                    n.length = 0;
                    for (var D in f)
                        if (f.hasOwnProperty(D)) {
                            var E = j.createElement("style"),
                                F = f[D].join("\n");
                            E.type = "text/css", E.media = D, q.insertBefore(E, o.nextSibling), E.styleSheet ? E.styleSheet.cssText = F : E.appendChild(j.createTextNode(F)), n.push(E)
                        }
                },
                v = function(a, b, d) {
                    var e = a.replace(c.regex.keyframes, "").match(c.regex.media),
                        f = e && e.length || 0;
                    b = b.substring(0, b.lastIndexOf("/"));
                    var g = function(a) {
                            return a.replace(c.regex.urls, "$1" + b + "$2$3")
                        },
                        h = !f && d;
                    b.length && (b += "/"), h && (f = 1);
                    for (var i = 0; f > i; i++) {
                        var j, k, n, o;
                        h ? (j = d, m.push(g(a))) : (j = e[i].match(c.regex.findStyles) && RegExp.$1, m.push(RegExp.$2 && g(RegExp.$2))), n = j.split(","), o = n.length;
                        for (var p = 0; o > p; p++) k = n[p], l.push({
                            media: k.split("(")[0].match(c.regex.only) && RegExp.$2 || "all",
                            rules: m.length - 1,
                            hasquery: k.indexOf("(") > -1,
                            minw: k.match(c.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                            maxw: k.match(c.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
                        })
                    }
                    u()
                },
                w = function() {
                    if (d.length) {
                        var b = d.shift();
                        f(b.href, function(c) {
                            v(c, b.href, b.media), o[b.href] = !0, a.setTimeout(function() {
                                w()
                            }, 0)
                        })
                    }
                },
                x = function() {
                    for (var b = 0; b < s.length; b++) {
                        var c = s[b],
                            e = c.href,
                            f = c.media,
                            g = c.rel && "stylesheet" === c.rel.toLowerCase();
                        e && g && !o[e] && (c.styleSheet && c.styleSheet.rawCssText ? (v(c.styleSheet.rawCssText, e, f), o[e] = !0) : (!/^([a-zA-Z:]*\/\/)/.test(e) && !r || e.replace(RegExp.$1, "").split("/")[0] === a.location.host) && ("//" === e.substring(0, 2) && (e = a.location.protocol + e), d.push({
                                href: e,
                                media: f
                            })))
                    }
                    w()
                };
            x(), c.update = x, c.getEmValue = t, a.addEventListener ? a.addEventListener("resize", b, !1) : a.attachEvent && a.attachEvent("onresize", b)
        }
    }(this);

function QuerySuggest(textbox, settings) {
    this.settings = jQuery.extend(this.defaultSettings(), settings);
    this.textBoxId = $(textbox).attr('id');
    this.suggestId = this.textBoxId + "_querySuggest";
    this.queryExecutions = {};
    this.emptyExecution = null;
    this.queryTexts = [];
    this.delayTimer = 0;
    this.clearTimer = 0;
    this.autoHide = true;
    this.pendingQuery = null;
    this.anotherPending = null;
}
jQuery.fn.querySuggest = function(settings) {
    return this.each(function(i, textbox) {
        var querySuggest = new QuerySuggest(textbox, settings);
        $(textbox).focus(function(e) {
            return querySuggest.enableSuggest(e);
        });
        $(textbox).blur(function(e) {
            return querySuggest.disableSuggest(e);
        });
        $(textbox).keyup(function(e) {
            return querySuggest.digestInput(e);
        });
        $(textbox).bind('paste', function(e) {
            setTimeout(function() {
                return querySuggest.digestInput();
            }, 30);
        });
        $(textbox).after('<div id="' + querySuggest.suggestId + '" class="' + querySuggest.settings.cssClass + '" ' + 'style="display:none;">' + '</div>');
        $('#' + querySuggest.suggestId).click(function(e) {
            querySuggest.autoHide = false;
            querySuggest.manualClose();
        });
        textbox.querySuggest = querySuggest;
    });
};
jQuery.fn.getQuerySuggest = function() {
    if (this.length == 0) {
        return null;
    }
    var textbox = this[0];
    return textbox.querySuggest;
};
QuerySuggest.prototype.defaultSettings = function() {
    return {
        width: 600,
        cssClass: 'querySuggest',
        delay: 800,
        align: 'center',
        cacheSize: 10,
        minQuerySize: 1,
        maxQuerySize: 500,
        condensed: false,
        initQuery: true,
        limit: 6,
        present: function(querySuggest, suggestId, suggestions, query) {
            QuerySuggest.prototype.defaultPresent(querySuggest, suggestId, suggestions, query);
        },
        empty: function(querySuggest, suggestId) {
            QuerySuggest.prototype.defaultEmpty(querySuggest, suggestId);
        },
        queryUrl: function(query, querySuggest) {
            return "";
        }
    };
};
QuerySuggest.prototype.enableSuggest = function() {
    this.autoHide = true;
    this.querySuggestions();
};
QuerySuggest.prototype.disableSuggest = function() {
    var sid = this.suggestId;
    var querySuggest = this;
    setTimeout(function() {
        if (querySuggest.autoHide) {
            $('#' + sid).hide();
        }
    }, 200);
};
QuerySuggest.prototype.manualClose = function() {
    if (!$('#suggestClose_' + this.suggestId).html()) {
        $('#' + this.suggestId).append("<div class='Close_SearchSuggestionWindow' id='suggestClose_" + this.suggestId + "'>" + "<a href='#' onclick='$(\"#" + this.suggestId + "\").hide();return false;'>close <span class='glyphicon glyphicon-remove'></span></a>" + "</div>");
    }
};
QuerySuggest.prototype.digestInput = function() {
    var input = $('#' + this.textBoxId).val();
    var qs = this;
    if (this.clearTimer === 0) {
        this.clearTimer = setTimeout(function() {
            qs.emptySuggestions();
        }, this.settings.delay * 1.2);
    }
    if (this.delayTimer !== 0) {
        clearTimeout(this.delayTimer);
        this.delayTimer = 0;
    }
    if (!input || (input.length < this.settings.minQuerySize) || (input.length > this.settings.maxQuerySize)) {
        $('#' + this.suggestId).hide();
        return;
    }
    this.delayTimer = setTimeout(function() {
        qs.querySuggestions();
    }, this.settings.delay);
};
QuerySuggest.prototype.emptySuggestions = function() {
    this.clearTimer = 0;
    if (this.delayTimer !== 0) {
        return;
    }
    this.settings.empty(this, this.suggestId);
};
QuerySuggest.prototype.querySuggestions = function() {
    this.delayTimer = 0;
    var input = $('#' + this.textBoxId).val();
    if (input.length < this.settings.minQuerySize) {
        input = "";
    }
    if (!this.settings.initQuery && (input.length < this.settings.minQuerySize)) {
        $('#' + this.suggestId).hide();
        return;
    }
    if (this.pendingQuery) {
        if (!this.anotherPending || new Date().getTime() - this.anotherPending > 2000) {
            this.anotherPending = new Date().getTime();
            return;
        }
    }
    this.anotherPending = null;
    this.pendingQuery = input;
    this.pendingUrl = this.settings.queryUrl(this.pendingQuery, this);
    if (this.pendingUrl == null) {
        this.pendingQuery = null;
        $('#' + this.suggestId).hide();
        return;
    }
    var cachedSuggestions = this.queryExecutions[this.pendingUrl];
    if (!this.pendingQuery) {
        cachedSuggestions = this.emptyExecution;
    }
    if (cachedSuggestions !== undefined && cachedSuggestions !== null) {
        this.giveSuggestions(cachedSuggestions);
    } else {
        this.requestSuggestions();
    }
};
QuerySuggest.prototype.requestSuggestions = function() {
    var qs = this;
    var qr = this.pendingQuery;
    var url = this.pendingUrl;
    $.getJSON(this.pendingUrl, function(data) {
        qs.pendingQuery = qr;
        qs.pendingUrl = url;
        qs.giveSuggestions(data);
        if (qs.anotherPending) {
            qs.querySuggestions();
        }
    });
};
QuerySuggest.prototype.giveSuggestions = function(suggestions) {
    if (suggestions !== undefined && suggestions != null) {
        this.cacheSuggestions(this.pendingQuery, this.pendingUrl, suggestions);
    }
    var qr = this.pendingQuery;
    this.pendingQuery = null;
    this.pendingUrl = null;
    if (this.clearTimer !== 0) {
        clearTimeout(this.clearTimer);
        this.clearTimer = 0;
    }
    if (qr == $('#' + this.textBoxId).val()) {
        this.settings.present(this, this.suggestId, suggestions, qr);
        if (suggestions && suggestions.length) {
            $('#' + this.suggestId).show();
        } else {
            $('#' + this.suggestId).hide();
        }
    } else {
        $('#' + this.suggestId).hide();
    }
};
QuerySuggest.prototype.cacheSuggestions = function(queryText, queryUrl, suggestions) {
    if (!queryText) {
        this.emptyExecution = suggestions;
        return;
    }
    if (this.queryExecutions[queryUrl]) {
        var index = 0;
        for (index = 0; index < this.queryTexts.length; index++) {
            if (this.queryTexts[index] === queryUrl) {
                break;
            }
        }
        if (index !== this.queryTexts.length) {
            this.queryTexts.splice(index, 1);
        }
    }
    if (this.queryTexts.length > this.settings.cacheSize) {
        this.queryExecutions[this.queryTexts[0]] = null;
        this.queryTexts.splice(0, 1);
    }
    this.queryTexts.push(queryUrl);
    this.queryExecutions[queryUrl] = suggestions;
};
QuerySuggest.prototype.defaultEmpty = function(querySuggest, suggestId) {
    if (querySuggest.settings.initQuery) {
        if (querySuggest.emptyExecution) {
            querySuggest.settings.present(querySuggest, suggestId, querySuggest.emptyExecution, "");
        } else {
            querySuggest.querySuggestions();
        }
    } else {
        $('#' + suggestId).html("");
    }
};
QuerySuggest.prototype.defaultPresent = function(querySuggest, suggestId, suggestions, query) {
    var html = "";
    var i = 0,
        j = 0;
    if (suggestions) {
        for (i = 0; i < suggestions.length; i++) {
            var suggestion = suggestions[i];
            html += "<div>" + suggestion.name + "<ul>";
            for (j = 0; j < suggestion.matches.length; j++) {
                var match = suggestion.matches[j];
                html += "<li><a href='" + match.url + "'>" + match.label + "</a>";
            }
            html += "</ul></div>";
        }
        $('#' + suggestId).html(html);
    } else {
        querySuggest.settings.empty(querySuggest, suggestId);
    }
};

$(document).ready(function() {
    $('#mypdb_loginMenu').hide();
    $('#mypdb_userMenu').hide();
    if (!window.sessionInfo) {
        $.ajax({
            url: rcsbUrl + '/pdb/json/sessionInfo.do' + (document.pdbQueryId ? ('?qrid=' + document.pdbQueryId) : ''),
            dataType: 'json',
            success: function(data) {
                if (data.structureId || data.hetId) {
                    if (data.structureId) {
                        $('#queryStructureHref').attr('href', '/pdb/explore/explore.do?structureId=' + data.structureId);
                        $('#queryStructureHref').html(data.structureId);
                        $('#queryStructureDiv').show();
                    }
                    if (data.hetId) {
                        $('#queryLigandHref').attr('href', '/pdb/ligand/ligandsummary.do?hetId=' + data.hetId);
                        $('#queryLigandHref').html(data.hetId);
                        $('#queryHetDiv').show();
                    }
                    $('#queryExplorerDiv').show();
                }
                if (!document.pdbQueryId && data.queryId) {
                    document.pdbQueryId = data.queryId;
                }
                if (document.pdbQueryId) {
                    var queryResultsLinkHref = $('#queryResultsLink').attr('href');
                    if (queryResultsLinkHref && queryResultsLinkHref.indexOf('qrid') == -1) {
                        $('#queryResultsLink').attr('href', queryResultsLinkHref + "&qrid=" + document.pdbQueryId);
                    }
                    var queryDetailsLinkHref = $('#queryDetailsLink').attr('href');
                    if (queryDetailsLinkHref && queryDetailsLinkHref.indexOf('qrid') == -1) {
                        $('#queryDetailsLink').attr('href', queryDetailsLinkHref + "?qrid=" + document.pdbQueryId);
                    }
                }
                if (data.user) {
                    var queryHistLink = $('#queryHistoryLink').parent();
                    var queryResLink = $('#queryResultsLink').parent();
                    $('#mypdb_userMenu .leftMenu_list li:first-child').after(queryHistLink);
                    $('#mypdb_userMenu .leftMenu_list li:first-child').after(queryResLink);
                    $('#mypdb_userMenu').show();
                    $('#mypdb_loginMenu').remove();
                    $('#mypdb_userVal').html(data.user);
                    if (data.user == "Admin") {
                        $('#mypdb_adminMenu').show();
                    } else {
                        $('#mypdb_adminMenu').remove();
                    }
                } else {
                    $('#mypdb_loginMenu').show();
                    $('#mypdb_userMenu').remove();
                    $('#mypdb_adminMenu').remove();
                }
                if (data.queryCount) {
                    $('#queryResultCountDiv').attr("title", data.lastQuery);
                    $('#queryResultCountDiv').addClass("tooltip");
                    $('.queryResultCountValSpan').html(" (" + data.resultCount + ")");
                    $('.queryCountValSpan').html(" (" + data.queryCount + ")");
                    $('#SearchBarHistory').removeClass('hide');
                    $('#SearchBarPreviousResults').removeClass('hide');
                } else {
                    $('#queryHistoryLink').css('display', 'none');
                    $('#queryResultsLink').css('display', 'none');
                }
                window.sessionInfo = data;
            }
        });
        window.sessionInfo = {};
        var prevUrl;
        if (!(window.location.pathname + window.location.search).match("/pdb/admin/Logon.do")) {
            prevUrl = window.location.pathname + window.location.search;
        } else {
            prevUrl = $("#logon_previousRequestUrl").val();
        }
        $("#lhm_mypdb_previousRequestUrl").val(prevUrl);
    }
    $("#lhm_mypdb_logoff").attr("href", "/pdb/Logoff.do");
});

triggeredSubmit = false;

function markQuery(lbl, query) {
    var lbli = lbl.toLowerCase().indexOf(query.toLowerCase());
    if (lbli !== -1 && query != "b") {
        return lbl.substr(0, lbli) + "<b>" + lbl.substr(lbli, query.length) + "</b>" + lbl.substr(lbli + query.length);
    }
    var words = query.replace(/-/g, " ").split(" ");
    var i;
    if (words.length > 1) {
        for (i = 0; i < words.length; i++) {
            lbl = markQuery(lbl, words[i]);
        }
    }
    return lbl;
}

function focusSuggest(textBoxId, itemId) {
    var querySuggest = $('#' + textBoxId).getQuerySuggest();
    querySuggest.itemId = itemId;
    querySuggest.settings.limit = 47;
    querySuggest.querySuggestions();
}

function reSuggest(textBoxId) {
    var querySuggest = $('#' + textBoxId).getQuerySuggest();
    querySuggest.querySuggestions();
}

function presentSuggestionsInSearchBar(querySuggest, suggestId, suggestions, query) {
    var drillHTML = "",
        optsHTML = "";
    var gci = 0,
        pc = 0,
        cn = 0,
        ccn;
    var vls = "",
        lbls = "";
    var contextLbl = ContextLabels[suggestId.replace("_querySuggest", "")];
    var contextLabel = contextLbl ? contextLbl : suggestId;
    var browseClass = {
        'Author': 'authorProfileIcon'
    };
    if (!querySuggest.popupCounter) {
        querySuggest.popupCounter = 0;
    }
    querySuggest.popupCounter++;
    $('#tiptip_holder').hide();
    $.each(suggestions, function(i, item) {
        if (item.suggestions.length <= 0) {
            return true;
        }
        vls = "";
        lbls = "";
        optsHTML = "";
        gci = 0;
        ccn = 0;
        $.each(item.suggestions, function(j, group) {
            pc = Math.round(1000 * group.percent) / 10;
            if (!group.abbreviation) {
                group.abbreviation = group.label;
            }
            var lbl = markQuery(group.label, query);
            var abv = markQuery(group.abbreviation, query);
            var tooltip = (group.label !== group.abbreviation ? lbl.replace(/'/g, "&#39;") : null);
            if (group.percent) {
                tooltip = pc + "% " + lbl + " (" + group.population + " hits)";
            }
            var evt = ((group.url.indexOf("?") == -1) ? "?" : "&") + "evtc=Suggest&evta=" + item.name.replace(" ", "") + "&evtl=" + contextLabel;
            if (tooltip) {
                var titleTooltip = tooltip.replace("<b>", "")
                titleTooltip = titleTooltip.replace("</b>", "")
            }
            optsHTML += "<li " + (tooltip ? ("title='" + titleTooltip + "'") : "") + " class='querySuggestGroup" + (tooltip ? " mantooltip" : "") + (!group.isEnabled ? " suggestNotFocus" : "") + "' style='white-space:nowrap;'>";
            optsHTML += "<a class='groupLabel' id='drill_" + i + "_" + (pc > 0 ? (gci + "") : (j + "_n")) + "return true;' " + "href='" + group.url + evt + "' onclick=''>";
            optsHTML += abv;
            optsHTML += (group.population ? " (" + group.population + ")" : "");
            optsHTML += (group.url ? "</a>" : "");
            if (group.redirectUrl) {
                var iconClass = "icon-taxonomy";
                if (browseClass[item.id]) {
                    iconClass = browseClass[item.id];
                } else
                    optsHTML += "<a href='" + group.redirectUrl + "'>&nbsp;<i class='fa fa-sitemap'></i></a>";
            }
            optsHTML += "</li>";
            vls += (gci > 0 ? "," : "") + pc;
            var slbl = group.abbreviation;
            if (slbl.length > 35) {
                slbl = slbl.substring(0, 32) + "...";
            }
            lbls += (gci > 0 ? "|" : "") + pc + "% " + slbl + " (" + group.population + " hits)";
            gci++;
            if (gci % 12 == 0)
                optsHTML += "</ul><ul>";
            ccn++;
        });
        if (ccn > cn) {
            cn = ccn;
        }
        if (cn > 12) {
            cn = 12;
        }
        var sgname = item.name;
        drillHTML += "<div class='suggestgroup'><h5>" + sgname + "</h5>";
        drillHTML += "<ul>";
        drillHTML += optsHTML;
        if (item.allUrl || item.moreResults || querySuggest.itemId) {
            drillHTML += "<li class='querySuggestAll' >";
            var leftHTML = "",
                rightHTML = "";
            if (item.moreResults && !querySuggest.itemId)
                leftHTML += "<a style='float:left' href='#' onclick='focusSuggest(\"" + querySuggest.textBoxId + "\",\"" + item.id + "\");" + "return false;'>More</a>";
            if (querySuggest.itemId)
                leftHTML += "<a style='float:left' href='#' onclick='reSuggest(\"" + querySuggest.textBoxId + "\");return false;'>Less</a>";
            if (item.allUrl && (item.name.indexOf("Author") == -1)) {
                var evt = ((item.allUrl.indexOf("?") == -1) ? "?" : "&") + "evtc=Suggest&evta=" + item.name.replace(" ", "") + "All&evtl=" + contextLabel;
                rightHTML += "<a href='" + item.allUrl + evt + "return true;'>Find all</a>";
            }
            if (item.moreResults && querySuggest.itemId && !item.allUrl)
                rightHTML += "<span>Too many matches</span>";
            drillHTML += leftHTML + (leftHTML && rightHTML ? "<span style='float:left'>&nbsp;&nbsp;-&nbsp;&nbsp;</span>" : "") + rightHTML;
            drillHTML += "</li>";
        }
        drillHTML += "</ul>";
        drillHTML += "</div>";
    });
    drillHTML += "<div class='clearHide'>&nbsp</div>";
    $('#' + suggestId).html(drillHTML);
    querySuggest.itemId = null;
    querySuggest.settings.limit = 6;
    if (querySuggest.settings.condensed == false) {
        $("#" + suggestId + " .suggestgroup").css('min-height', (cn * 10) + 130 + "px");
    }
    querySuggest.manualClose();
    var fid = querySuggest.fixedItemId;
    if (!fid) {
        fid = 'All';
    }
}
ContextLabels = {
    autosearch: 'TopBar',
    othersearch: 'OtherOptions',
    noresults: 'NoResults'
};
$(document).ready(function($) {
    $(function() {
        $("#autosearch_SearchBar").querySuggest({
            queryUrl: function(query, querySuggest) {
                if (querySuggest.fixedItemId == "All") {
                    querySuggest.fixedItemId = "";
                }
                var url = rcsbUrl + "/pdb/json/autosearch.do?limit=" + querySuggest.settings.limit + "&" + (querySuggest.fixedItemId ? ("p=" + querySuggest.fixedItemId + "&") : (querySuggest.itemId ? ("p=" + querySuggest.itemId + "&") : "")) + "q=" + encodeURIComponent(query);
                return url;
            },
            initQuery: false,
            present: presentSuggestionsInSearchBar,
            align: 'left',
            delay: 200,
            width: 675
        });
    });
    $("#autosearch_SearchBar").keyup(function(e) {
        var querySuggest = $('#autosearch_SearchBar').getQuerySuggest();
        var val = $('#autosearch_SearchBar').val();
    });
    $("#headerQueryForm").submit(function(e) {
        if ($('#autosearch_SearchBar').val().length < 2) {
            alert('Please enter at least a 2 character search term.');
            return false;
        }
        var querySuggest = $('#autosearch_SearchBar').getQuerySuggest();
        var queryVal = $('#autosearch_SearchBar').val();
        pageTracker._trackEvent('TopBarSubmit', "All", queryVal, querySuggest.popupCounter);
        triggeredSubmit = true;
        return true;
    });
});

$(document).ready(function() {
    $('.nav>.dropdown').mouseenter(function(event) {
        $(this).addClass("open");
    });
    $('.nav>.dropdown').mouseleave(function(event) {
        $('.dropdown').removeClass("open");
    });
});

/*
 var oJIRA_FDBCK = {
 KNOWNHOST: {
 LCL: "localhost",
 RPS_DEV_IP: "172.17.54.122",
 DEV: "jira-tc.rcsb.org",
 DEV_IP: "165.230.17.251",
 RCSB: "www.rcsb.org",
 RCSB_REL: "release.rcsb.org",
 RCSB_DEV: "searchprotowest.rcsb.org",
 TAHOE: "www3.rcsb.org",
 TAHOE_DEV: "tahoe-testing.rcsb.org"
 },
 URL: {
 JIRA_PROXY: {
 ROOT_DEV: "http://jira-proxy-dev.rcsb.org/",
 ROOT_PROD: "http://jira-proxy-east.rcsb.org/"
 },
 IMG_LOGO: {
 RCSB: "https://cdn.rcsb.org/rcsb-pdb/v2/common/images/rcsb_logo.png",
 WWPDB: "http://cdn.rcsb.org/rcsb-pdb/v2/common/images/Logo_wwpdb.png"
 }
 },
 PATH: {
 FDBCK_HTML_SRC_DEV: "includes/jira-fdbck.html",
 FDBCK_HTML_SRC_RCSB: "/pdb/v2/includes/jira-fdbck.html",
 FDBCK_HTML_SRC_TAHOE: "/v2/includes/jira-fdbck.html"
 },
 JIRA: {
 PROJKEY: {
 DEV: "TC",
 PROD: "HELP"
 },
 ISSUETYPE: {
 DEV: "Task",
 PROD: "Bug"
 }
 },
 LOGGINGPREFIX: "JIRA-FEEDBACK: ",
 MAXUPLOADS: 3,
 MAXFILESIZEBYTES: 5000000,
 DEBUG: true
 };
 $(function() {
 var thisHost = document.location.hostname;
 var fdbckHtmlSrc;
 var jiraProxyRootUrl;
 var logoSrc;
 var projKey;
 var issueType;
 switch (thisHost) {
 case oJIRA_FDBCK.KNOWNHOST.RCSB:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_RCSB;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_PROD;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = false;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.PROD;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.PROD;
 break;
 case oJIRA_FDBCK.KNOWNHOST.RCSB_REL:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_RCSB;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 break;
 case oJIRA_FDBCK.KNOWNHOST.RCSB_DEV:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_RCSB;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 break;
 case oJIRA_FDBCK.KNOWNHOST.TAHOE:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_TAHOE;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_PROD;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = false;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.PROD;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.PROD;
 break;
 case oJIRA_FDBCK.KNOWNHOST.TAHOE_DEV:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_TAHOE;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 break;
 case oJIRA_FDBCK.KNOWNHOST.LCL:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_DEV;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 break;
 case oJIRA_FDBCK.KNOWNHOST.DEV:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_DEV;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 break;
 case oJIRA_FDBCK.KNOWNHOST.DEV_IP:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_DEV;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 break;
 default:
 fdbckHtmlSrc = oJIRA_FDBCK.PATH.FDBCK_HTML_SRC_RCSB;
 jiraProxyRootUrl = oJIRA_FDBCK.URL.JIRA_PROXY.ROOT_DEV;
 logoSrc = oJIRA_FDBCK.URL.IMG_LOGO.RCSB;
 oJIRA_FDBCK.DEBUG = true;
 projKey = oJIRA_FDBCK.JIRA.PROJKEY.DEV;
 issueType = oJIRA_FDBCK.JIRA.ISSUETYPE.DEV;
 }
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + "Current host is: " + thisHost);
 $.get(fdbckHtmlSrc, function(data) {
 $("#jira-fdbck").html(data);
 $(".modal-logo").attr("src", logoSrc);
 $("#projectkey").val(projKey);
 $("#issuetype").val(issueType);
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + "ajax feedback html import was performed.");
 });
 $(document).on('click', '.jira-fdbck-btn', function(event) {
 $('#jira-fdbck-modal').modal("show");
 });
 $("#jira-fdbck").on("show.bs.modal", "#jira-fdbck-modal", function() {
 $(".form-control").val("");
 $("#maxuploads").text(oJIRA_FDBCK.MAXUPLOADS);
 clearValidationPrompts();
 });
 $("#jira-fdbck").on('click', '#jira-fdbck-submit', function() {
 var environmentProps = {
 "Location": window.location.href,
 "User-Agent": navigator.userAgent,
 "Referrer": document.referrer,
 "Screen Resolution": screen.width + " x " + screen.height
 };
 var environmentStr = "";
 var cnt = 0;
 var spacer;
 for (prop in environmentProps) {
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + " environmentProps[" + prop + "] = " + environmentProps[prop]);
 spacer = cnt >= 1 ? " \n" : "";
 environmentStr += spacer + "*" + prop + "*: " + environmentProps[prop];
 cnt++;
 }
 if (problemWithReqdField() || maxFilesExceeded() || surpassFileSizeLimit()) {
 return false;
 } else {
 var formData = {
 "fields": {
 "project": {
 "key": $('#projectkey').val()
 },
 "summary": $('#subject').val(),
 "description": $('#description').val(),
 "issuetype": {
 "name": $('#issuetype').val()
 },
 "environment": environmentStr,
 "customfield_10333": $('#fname').val(),
 "customfield_10327": $('#lname').val(),
 "customfield_10322": $('#email').val()
 }
 };
 var restPayload = JSON.stringify(formData);

 function doneFxn(jsonRtrn) {
 var issueKey = jsonRtrn.key;
 console.log(oJIRA_FDBCK.LOGGINGPREFIX + " feedback submission completed.");
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + "issueKey is: " + issueKey);
 if (document.getElementById("file").files.length == 0) {
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + "no files selected");
 } else {
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + "File(s) were selected for upload.");
 handleFileAttach(issueKey, jiraProxyRootUrl);
 }
 $("#jira-fdbck-modal").modal("hide");
 $("#jira-cnfrm-modal").modal("show");
 setTimeout(function() {
 $("#jira-cnfrm-modal").modal("hide");
 }, 5000);
 }

 function errorFxn(jqXHRrtrn, textStatus, errorThrown) {
 console.log(oJIRA_FDBCK.LOGGINGPREFIX + " feedback submission failed");
 var errorDisplStr = "";
 if (jqXHRrtrn.responseText && jqXHRrtrn.responseText.length > 1) {
 errorDisplStr = ": ";
 var errorObj = JSON.parse(jqXHRrtrn.responseText);
 for (prop in errorObj.errors) {
 console.log(oJIRA_FDBCK.LOGGINGPREFIX + " error on submit! " + errorObj.errors[prop]);
 errorDisplStr += errorObj.errors[prop] + " | ";
 }
 }
 alert("Problem on feedback submission" + errorDisplStr);
 }
 $.ajax({
 type: "POST",
 url: jiraProxyRootUrl + "jiraproxyissue",
 data: restPayload,
 dataType: "json",
 contentType: "application/json",
 success: doneFxn,
 error: errorFxn
 });
 }
 });
 $(document).on("change", ".reqd", function(event) {
 var elemId = $(this).attr("id");
 if ($(this).val().length > 1) {
 $("#" + elemId + "-group").removeClass("has-error");
 $("#" + elemId + "-group .help-block").remove();
 }
 });
 $(document).on("change", "#file", function(event) {
 if (parseInt($(this).get(0).files.length) > oJIRA_FDBCK.MAXUPLOADS) {
 $("#file-group").addClass("has-error").append('<div class="help-block">Can only upload a maximum of ' + oJIRA_FDBCK.MAXUPLOADS + ' files.</div>');
 } else {
 $("#file-group").removeClass("has-error");
 $("#file-group .help-block").remove();
 }
 });
 });

 function handleFileAttach(issueKey, jiraProxyRootUrl) {
 var form = document.forms.namedItem("feedbackfrm");
 var oData = new FormData(form);
 var url = jiraProxyRootUrl + "jiraproxyattchmnt";
 var oReq = new XMLHttpRequest();
 oReq.open("POST", url, true);
 oReq.onload = function(oEvent) {
 if (oReq.status == 200) {
 console.log(oJIRA_FDBCK.LOGGINGPREFIX + "File(s) successfully uploaded.");
 } else {
 console.log(oJIRA_FDBCK.LOGGINGPREFIX + "Error: " + oReq.status + " occurred when trying to upload file(s).");
 }
 };
 oData.append("issue", issueKey);
 oReq.send(oData);
 }

 function validateEmail(email) {
 var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
 if (!email_regex.test(email)) {
 return false;
 } else {
 return true;
 }
 }

 function clearValidationPrompts() {
 $(".has-error").removeClass("has-error");
 $(".help-block").remove();
 }

 function maxFilesExceeded() {
 var $fileUpload = $("#file");
 if (parseInt($fileUpload.get(0).files.length) > oJIRA_FDBCK.MAXUPLOADS) {
 $("#file-group").addClass("has-error").append('<div class="help-block">Can only upload a maximum of ' + oJIRA_FDBCK.MAXUPLOADS + ' files.</div>');
 return true;
 }
 return false;
 }

 function surpassFileSizeLimit() {
 var fileInput = document.getElementById("file");
 var bTooBig = false;
 var fileNameArr = [];
 if (fileInput.files.length > 0) {
 for (var x = 0; x < fileInput.files.length; x++) {
 var thisFile = fileInput.files[x];
 if (oJIRA_FDBCK.DEBUG) console.log(oJIRA_FDBCK.LOGGINGPREFIX + "Current file: " + thisFile.name + " is " + thisFile.size + " bytes in size");
 if (thisFile.size > oJIRA_FDBCK.MAXFILESIZEBYTES) {
 fileNameArr.push(thisFile.name);
 bTooBig = true;
 }
 }
 }
 if (bTooBig) {
 $("#file-group").addClass("has-error").append('<div class="help-block">Problem with file(s): ' + fileNameArr.join(', ') + '. Individual file size cannot exceed ' + oJIRA_FDBCK.MAXFILESIZEBYTES / 1000000 + ' MB.</div>');
 }
 return bTooBig;
 }

 function problemWithReqdField() {
 var bWeHaveAProblem = false;
 clearValidationPrompts();
 $(".reqd").each(function() {
 var elemId = $(this).attr("id");
 if ($(this).val().length < 1) {
 bWeHaveAProblem = true;
 $("#" + elemId + "-group").addClass("has-error").append('<div class="help-block">Required value missing</div>');
 } else {
 if (elemId === "email") {
 var bValidEmail = validateEmail($('#' + elemId).val());
 if (!bValidEmail) {
 bWeHaveAProblem = true;
 $("#" + elemId + "-group").addClass("has-error").append('<div class="help-block">Not valid email format</div>');
 }
 }
 }
 });
 return bWeHaveAProblem;
 };
 */
/*! =======================================================
 VERSION  9.1.3
 ========================================================= */
"use strict";
var _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
        return typeof a
    } : function(a) {
        return a && "function" == typeof Symbol && a.constructor === Symbol ? "symbol" : typeof a
    },
    windowIsDefined = "object" === ("undefined" == typeof window ? "undefined" : _typeof(window));
! function(a) {
    if ("function" == typeof define && define.amd) define(["jquery"], a);
    else if ("object" === ("undefined" == typeof module ? "undefined" : _typeof(module)) && module.exports) {
        var b;
        try {
            b = require("jquery")
        } catch (c) {
            b = null
        }
        module.exports = a(b)
    } else window && (window.Slider = a(window.jQuery))
}(function(a) {
    var b = "slider",
        c = "bootstrapSlider";
    windowIsDefined && !window.console && (window.console = {}), windowIsDefined && !window.console.log && (window.console.log = function() {}), windowIsDefined && !window.console.warn && (window.console.warn = function() {});
    var d;
    return function(a) {
        function b() {}

        function c(a) {
            function c(b) {
                b.prototype.option || (b.prototype.option = function(b) {
                    a.isPlainObject(b) && (this.options = a.extend(!0, this.options, b))
                })
            }

            function e(b, c) {
                a.fn[b] = function(e) {
                    if ("string" == typeof e) {
                        for (var g = d.call(arguments, 1), h = 0, i = this.length; i > h; h++) {
                            var j = this[h],
                                k = a.data(j, b);
                            if (k)
                                if (a.isFunction(k[e]) && "_" !== e.charAt(0)) {
                                    var l = k[e].apply(k, g);
                                    if (void 0 !== l && l !== k) return l
                                } else f("no such method '" + e + "' for " + b + " instance");
                            else f("cannot call methods on " + b + " prior to initialization; attempted to call '" + e + "'")
                        }
                        return this
                    }
                    var m = this.map(function() {
                        var d = a.data(this, b);
                        return d ? (d.option(e), d._init()) : (d = new c(this, e), a.data(this, b, d)), a(this)
                    });
                    return !m || m.length > 1 ? m : m[0]
                }
            }
            if (a) {
                var f = "undefined" == typeof console ? b : function(a) {
                    console.error(a)
                };
                return a.bridget = function(a, b) {
                    c(b), e(a, b)
                }, a.bridget
            }
        }
        var d = Array.prototype.slice;
        c(a)
    }(a),
        function(a) {
            function e(b, c) {
                function d(a, b) {
                    var c = "data-slider-" + b.replace(/_/g, "-"),
                        d = a.getAttribute(c);
                    try {
                        return JSON.parse(d)
                    } catch (e) {
                        return d
                    }
                }
                this._state = {
                    value: null,
                    enabled: null,
                    offset: null,
                    size: null,
                    percentage: null,
                    inDrag: !1,
                    over: !1
                }, "string" == typeof b ? this.element = document.querySelector(b) : b instanceof HTMLElement && (this.element = b), c = c ? c : {};
                for (var e = Object.keys(this.defaultOptions), f = 0; f < e.length; f++) {
                    var h = e[f],
                        i = c[h];
                    i = "undefined" != typeof i ? i : d(this.element, h), i = null !== i ? i : this.defaultOptions[h], this.options || (this.options = {}), this.options[h] = i
                }
                "vertical" !== this.options.orientation || "top" !== this.options.tooltip_position && "bottom" !== this.options.tooltip_position ? "horizontal" !== this.options.orientation || "left" !== this.options.tooltip_position && "right" !== this.options.tooltip_position || (this.options.tooltip_position = "top") : this.options.tooltip_position = "right";
                var j, k, l, m, n, o = this.element.style.width,
                    p = !1,
                    q = this.element.parentNode;
                if (this.sliderElem) p = !0;
                else {
                    this.sliderElem = document.createElement("div"), this.sliderElem.className = "slider";
                    var r = document.createElement("div");
                    r.className = "slider-track", k = document.createElement("div"), k.className = "slider-track-low", j = document.createElement("div"), j.className = "slider-selection", l = document.createElement("div"), l.className = "slider-track-high", m = document.createElement("div"), m.className = "slider-handle min-slider-handle", m.setAttribute("role", "slider"), m.setAttribute("aria-valuemin", this.options.min), m.setAttribute("aria-valuemax", this.options.max), n = document.createElement("div"), n.className = "slider-handle max-slider-handle", n.setAttribute("role", "slider"), n.setAttribute("aria-valuemin", this.options.min), n.setAttribute("aria-valuemax", this.options.max), r.appendChild(k), r.appendChild(j), r.appendChild(l);
                    var s = Array.isArray(this.options.labelledby);
                    if (s && this.options.labelledby[0] && m.setAttribute("aria-labelledby", this.options.labelledby[0]), s && this.options.labelledby[1] && n.setAttribute("aria-labelledby", this.options.labelledby[1]), !s && this.options.labelledby && (m.setAttribute("aria-labelledby", this.options.labelledby), n.setAttribute("aria-labelledby", this.options.labelledby)), this.ticks = [], Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
                        for (this.ticksContainer = document.createElement("div"), this.ticksContainer.className = "slider-tick-container", f = 0; f < this.options.ticks.length; f++) {
                            var t = document.createElement("div");
                            t.className = "slider-tick", this.ticks.push(t), this.ticksContainer.appendChild(t)
                        }
                        j.className += " tick-slider-selection"
                    }
                    if (this.tickLabels = [], Array.isArray(this.options.ticks_labels) && this.options.ticks_labels.length > 0)
                        for (this.tickLabelContainer = document.createElement("div"), this.tickLabelContainer.className = "slider-tick-label-container", f = 0; f < this.options.ticks_labels.length; f++) {
                            var u = document.createElement("div"),
                                v = 0 === this.options.ticks_positions.length,
                                w = this.options.reversed && v ? this.options.ticks_labels.length - (f + 1) : f;
                            u.className = "slider-tick-label", u.innerHTML = this.options.ticks_labels[w], this.tickLabels.push(u), this.tickLabelContainer.appendChild(u)
                        }
                    var x = function(a) {
                            var b = document.createElement("div");
                            b.className = "tooltip-arrow";
                            var c = document.createElement("div");
                            c.className = "tooltip-inner", a.appendChild(b), a.appendChild(c)
                        },
                        y = document.createElement("div");
                    y.className = "tooltip tooltip-main", y.setAttribute("role", "presentation"), x(y);
                    var z = document.createElement("div");
                    z.className = "tooltip tooltip-min", z.setAttribute("role", "presentation"), x(z);
                    var A = document.createElement("div");
                    A.className = "tooltip tooltip-max", A.setAttribute("role", "presentation"), x(A), this.sliderElem.appendChild(r), this.sliderElem.appendChild(y), this.sliderElem.appendChild(z), this.sliderElem.appendChild(A), this.tickLabelContainer && this.sliderElem.appendChild(this.tickLabelContainer), this.ticksContainer && this.sliderElem.appendChild(this.ticksContainer), this.sliderElem.appendChild(m), this.sliderElem.appendChild(n), q.insertBefore(this.sliderElem, this.element), this.element.style.display = "none"
                }
                if (a && (this.$element = a(this.element), this.$sliderElem = a(this.sliderElem)), this.eventToCallbackMap = {}, this.sliderElem.id = this.options.id, this.touchCapable = "ontouchstart" in window || window.DocumentTouch && document instanceof window.DocumentTouch, this.touchX = 0, this.touchY = 0, this.tooltip = this.sliderElem.querySelector(".tooltip-main"), this.tooltipInner = this.tooltip.querySelector(".tooltip-inner"), this.tooltip_min = this.sliderElem.querySelector(".tooltip-min"), this.tooltipInner_min = this.tooltip_min.querySelector(".tooltip-inner"), this.tooltip_max = this.sliderElem.querySelector(".tooltip-max"), this.tooltipInner_max = this.tooltip_max.querySelector(".tooltip-inner"), g[this.options.scale] && (this.options.scale = g[this.options.scale]), p === !0 && (this._removeClass(this.sliderElem, "slider-horizontal"), this._removeClass(this.sliderElem, "slider-vertical"), this._removeClass(this.tooltip, "hide"), this._removeClass(this.tooltip_min, "hide"), this._removeClass(this.tooltip_max, "hide"), ["left", "top", "width", "height"].forEach(function(a) {
                        this._removeProperty(this.trackLow, a), this._removeProperty(this.trackSelection, a), this._removeProperty(this.trackHigh, a)
                    }, this), [this.handle1, this.handle2].forEach(function(a) {
                        this._removeProperty(a, "left"), this._removeProperty(a, "top")
                    }, this), [this.tooltip, this.tooltip_min, this.tooltip_max].forEach(function(a) {
                        this._removeProperty(a, "left"), this._removeProperty(a, "top"), this._removeProperty(a, "margin-left"), this._removeProperty(a, "margin-top"), this._removeClass(a, "right"), this._removeClass(a, "top")
                    }, this)), "vertical" === this.options.orientation ? (this._addClass(this.sliderElem, "slider-vertical"), this.stylePos = "top", this.mousePos = "pageY", this.sizePos = "offsetHeight") : (this._addClass(this.sliderElem, "slider-horizontal"), this.sliderElem.style.width = o, this.options.orientation = "horizontal", this.stylePos = "left", this.mousePos = "pageX", this.sizePos = "offsetWidth"), this._setTooltipPosition(), Array.isArray(this.options.ticks) && this.options.ticks.length > 0 && (this.options.max = Math.max.apply(Math, this.options.ticks), this.options.min = Math.min.apply(Math, this.options.ticks)), Array.isArray(this.options.value) ? (this.options.range = !0, this._state.value = this.options.value) : this.options.range ? this._state.value = [this.options.value, this.options.max] : this._state.value = this.options.value, this.trackLow = k || this.trackLow, this.trackSelection = j || this.trackSelection, this.trackHigh = l || this.trackHigh, "none" === this.options.selection && (this._addClass(this.trackLow, "hide"), this._addClass(this.trackSelection, "hide"), this._addClass(this.trackHigh, "hide")), this.handle1 = m || this.handle1, this.handle2 = n || this.handle2, p === !0)
                    for (this._removeClass(this.handle1, "round triangle"), this._removeClass(this.handle2, "round triangle hide"), f = 0; f < this.ticks.length; f++) this._removeClass(this.ticks[f], "round triangle hide");
                var B = ["round", "triangle", "custom"],
                    C = -1 !== B.indexOf(this.options.handle);
                if (C)
                    for (this._addClass(this.handle1, this.options.handle), this._addClass(this.handle2, this.options.handle), f = 0; f < this.ticks.length; f++) this._addClass(this.ticks[f], this.options.handle);
                this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this.setValue(this._state.value), this.handle1Keydown = this._keydown.bind(this, 0), this.handle1.addEventListener("keydown", this.handle1Keydown, !1), this.handle2Keydown = this._keydown.bind(this, 1), this.handle2.addEventListener("keydown", this.handle2Keydown, !1), this.mousedown = this._mousedown.bind(this), this.touchstart = this._touchstart.bind(this), this.touchmove = this._touchmove.bind(this), this.touchCapable && (this.sliderElem.addEventListener("touchstart", this.touchstart, !1), this.sliderElem.addEventListener("touchmove", this.touchmove, !1)), this.sliderElem.addEventListener("mousedown", this.mousedown, !1), this.resize = this._resize.bind(this), window.addEventListener("resize", this.resize, !1), "hide" === this.options.tooltip ? (this._addClass(this.tooltip, "hide"), this._addClass(this.tooltip_min, "hide"), this._addClass(this.tooltip_max, "hide")) : "always" === this.options.tooltip ? (this._showTooltip(), this._alwaysShowTooltip = !0) : (this.showTooltip = this._showTooltip.bind(this), this.hideTooltip = this._hideTooltip.bind(this), this.sliderElem.addEventListener("mouseenter", this.showTooltip, !1), this.sliderElem.addEventListener("mouseleave", this.hideTooltip, !1), this.handle1.addEventListener("focus", this.showTooltip, !1), this.handle1.addEventListener("blur", this.hideTooltip, !1), this.handle2.addEventListener("focus", this.showTooltip, !1), this.handle2.addEventListener("blur", this.hideTooltip, !1)), this.options.enabled ? this.enable() : this.disable()
            }
            var f = {
                    formatInvalidInputErrorMsg: function(a) {
                        return "Invalid input value '" + a + "' passed in"
                    },
                    callingContextNotSliderInstance: "Calling context element does not have instance of Slider bound to it. Check your code to make sure the JQuery object returned from the call to the slider() initializer is calling the method"
                },
                g = {
                    linear: {
                        toValue: function(a) {
                            var b = a / 100 * (this.options.max - this.options.min),
                                c = !0;
                            if (this.options.ticks_positions.length > 0) {
                                for (var d, e, f, g = 0, h = 1; h < this.options.ticks_positions.length; h++)
                                    if (a <= this.options.ticks_positions[h]) {
                                        d = this.options.ticks[h - 1], f = this.options.ticks_positions[h - 1], e = this.options.ticks[h], g = this.options.ticks_positions[h];
                                        break
                                    }
                                var i = (a - f) / (g - f);
                                b = d + i * (e - d), c = !1
                            }
                            var j = c ? this.options.min : 0,
                                k = j + Math.round(b / this.options.step) * this.options.step;
                            return k < this.options.min ? this.options.min : k > this.options.max ? this.options.max : k
                        },
                        toPercentage: function(a) {
                            if (this.options.max === this.options.min) return 0;
                            if (this.options.ticks_positions.length > 0) {
                                for (var b, c, d, e = 0, f = 0; f < this.options.ticks.length; f++)
                                    if (a <= this.options.ticks[f]) {
                                        b = f > 0 ? this.options.ticks[f - 1] : 0, d = f > 0 ? this.options.ticks_positions[f - 1] : 0, c = this.options.ticks[f], e = this.options.ticks_positions[f];
                                        break
                                    }
                                if (f > 0) {
                                    var g = (a - b) / (c - b);
                                    return d + g * (e - d)
                                }
                            }
                            return 100 * (a - this.options.min) / (this.options.max - this.options.min)
                        }
                    },
                    logarithmic: {
                        toValue: function(a) {
                            var b = 0 === this.options.min ? 0 : Math.log(this.options.min),
                                c = Math.log(this.options.max),
                                d = Math.exp(b + (c - b) * a / 100);
                            return d = this.options.min + Math.round((d - this.options.min) / this.options.step) * this.options.step, d < this.options.min ? this.options.min : d > this.options.max ? this.options.max : d
                        },
                        toPercentage: function(a) {
                            if (this.options.max === this.options.min) return 0;
                            var b = Math.log(this.options.max),
                                c = 0 === this.options.min ? 0 : Math.log(this.options.min),
                                d = 0 === a ? 0 : Math.log(a);
                            return 100 * (d - c) / (b - c)
                        }
                    }
                };
            d = function(a, b) {
                return e.call(this, a, b), this
            }, d.prototype = {
                _init: function() {},
                constructor: d,
                defaultOptions: {
                    id: "",
                    min: 0,
                    max: 10,
                    step: 1,
                    precision: 0,
                    orientation: "horizontal",
                    value: 5,
                    range: !1,
                    selection: "before",
                    tooltip: "show",
                    tooltip_split: !1,
                    handle: "round",
                    reversed: !1,
                    enabled: !0,
                    formatter: function(a) {
                        return Array.isArray(a) ? a[0] + " : " + a[1] : a
                    },
                    natural_arrow_keys: !1,
                    ticks: [],
                    ticks_positions: [],
                    ticks_labels: [],
                    ticks_snap_bounds: 0,
                    scale: "linear",
                    focus: !1,
                    tooltip_position: null,
                    labelledby: null
                },
                getElement: function() {
                    return this.sliderElem
                },
                getValue: function() {
                    return this.options.range ? this._state.value : this._state.value[0]
                },
                setValue: function(a, b, c) {
                    a || (a = 0);
                    var d = this.getValue();
                    this._state.value = this._validateInputValue(a);
                    var e = this._applyPrecision.bind(this);
                    this.options.range ? (this._state.value[0] = e(this._state.value[0]), this._state.value[1] = e(this._state.value[1]), this._state.value[0] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[0])), this._state.value[1] = Math.max(this.options.min, Math.min(this.options.max, this._state.value[1]))) : (this._state.value = e(this._state.value), this._state.value = [Math.max(this.options.min, Math.min(this.options.max, this._state.value))], this._addClass(this.handle2, "hide"), "after" === this.options.selection ? this._state.value[1] = this.options.max : this._state.value[1] = this.options.min), this.options.max > this.options.min ? this._state.percentage = [this._toPercentage(this._state.value[0]), this._toPercentage(this._state.value[1]), 100 * this.options.step / (this.options.max - this.options.min)] : this._state.percentage = [0, 0, 100], this._layout();
                    var f = this.options.range ? this._state.value : this._state.value[0];
                    return this._setDataVal(f), b === !0 && this._trigger("slide", f), d !== f && c === !0 && this._trigger("change", {
                        oldValue: d,
                        newValue: f
                    }), this
                },
                destroy: function() {
                    this._removeSliderEventHandlers(), this.sliderElem.parentNode.removeChild(this.sliderElem), this.element.style.display = "", this._cleanUpEventCallbacksMap(), this.element.removeAttribute("data"), a && (this._unbindJQueryEventHandlers(), this.$element.removeData("slider"))
                },
                disable: function() {
                    return this._state.enabled = !1, this.handle1.removeAttribute("tabindex"), this.handle2.removeAttribute("tabindex"), this._addClass(this.sliderElem, "slider-disabled"), this._trigger("slideDisabled"), this
                },
                enable: function() {
                    return this._state.enabled = !0, this.handle1.setAttribute("tabindex", 0), this.handle2.setAttribute("tabindex", 0), this._removeClass(this.sliderElem, "slider-disabled"), this._trigger("slideEnabled"), this
                },
                toggle: function() {
                    return this._state.enabled ? this.disable() : this.enable(), this
                },
                isEnabled: function() {
                    return this._state.enabled
                },
                on: function(a, b) {
                    return this._bindNonQueryEventHandler(a, b), this
                },
                off: function(b, c) {
                    a ? (this.$element.off(b, c), this.$sliderElem.off(b, c)) : this._unbindNonQueryEventHandler(b, c)
                },
                getAttribute: function(a) {
                    return a ? this.options[a] : this.options
                },
                setAttribute: function(a, b) {
                    return this.options[a] = b, this
                },
                refresh: function() {
                    return this._removeSliderEventHandlers(), e.call(this, this.element, this.options), a && a.data(this.element, "slider", this), this
                },
                relayout: function() {
                    return this._resize(), this._layout(), this
                },
                _removeSliderEventHandlers: function() {
                    this.handle1.removeEventListener("keydown", this.handle1Keydown, !1), this.handle2.removeEventListener("keydown", this.handle2Keydown, !1), this.showTooltip && (this.handle1.removeEventListener("focus", this.showTooltip, !1), this.handle2.removeEventListener("focus", this.showTooltip, !1)), this.hideTooltip && (this.handle1.removeEventListener("blur", this.hideTooltip, !1), this.handle2.removeEventListener("blur", this.hideTooltip, !1)), this.showTooltip && this.sliderElem.removeEventListener("mouseenter", this.showTooltip, !1), this.hideTooltip && this.sliderElem.removeEventListener("mouseleave", this.hideTooltip, !1), this.sliderElem.removeEventListener("touchstart", this.touchstart, !1), this.sliderElem.removeEventListener("touchmove", this.touchmove, !1), this.sliderElem.removeEventListener("mousedown", this.mousedown, !1), window.removeEventListener("resize", this.resize, !1)
                },
                _bindNonQueryEventHandler: function(a, b) {
                    void 0 === this.eventToCallbackMap[a] && (this.eventToCallbackMap[a] = []), this.eventToCallbackMap[a].push(b)
                },
                _unbindNonQueryEventHandler: function(a, b) {
                    var c = this.eventToCallbackMap[a];
                    if (void 0 !== c)
                        for (var d = 0; d < c.length; d++)
                            if (c[d] === b) {
                                c.splice(d, 1);
                                break
                            }
                },
                _cleanUpEventCallbacksMap: function() {
                    for (var a = Object.keys(this.eventToCallbackMap), b = 0; b < a.length; b++) {
                        var c = a[b];
                        this.eventToCallbackMap[c] = null
                    }
                },
                _showTooltip: function() {
                    this.options.tooltip_split === !1 ? (this._addClass(this.tooltip, "in"), this.tooltip_min.style.display = "none", this.tooltip_max.style.display = "none") : (this._addClass(this.tooltip_min, "in"), this._addClass(this.tooltip_max, "in"), this.tooltip.style.display = "none"), this._state.over = !0
                },
                _hideTooltip: function() {
                    this._state.inDrag === !1 && this.alwaysShowTooltip !== !0 && (this._removeClass(this.tooltip, "in"), this._removeClass(this.tooltip_min, "in"), this._removeClass(this.tooltip_max, "in")), this._state.over = !1
                },
                _layout: function() {
                    var a;
                    if (a = this.options.reversed ? [100 - this._state.percentage[0], this.options.range ? 100 - this._state.percentage[1] : this._state.percentage[1]] : [this._state.percentage[0], this._state.percentage[1]], this.handle1.style[this.stylePos] = a[0] + "%", this.handle1.setAttribute("aria-valuenow", this._state.value[0]), this.handle2.style[this.stylePos] = a[1] + "%", this.handle2.setAttribute("aria-valuenow", this._state.value[1]), Array.isArray(this.options.ticks) && this.options.ticks.length > 0) {
                        var b = "vertical" === this.options.orientation ? "height" : "width",
                            c = "vertical" === this.options.orientation ? "marginTop" : "marginLeft",
                            d = this._state.size / (this.options.ticks.length - 1);
                        if (this.tickLabelContainer) {
                            var e = 0;
                            if (0 === this.options.ticks_positions.length) "vertical" !== this.options.orientation && (this.tickLabelContainer.style[c] = -d / 2 + "px"), e = this.tickLabelContainer.offsetHeight;
                            else
                                for (f = 0; f < this.tickLabelContainer.childNodes.length; f++) this.tickLabelContainer.childNodes[f].offsetHeight > e && (e = this.tickLabelContainer.childNodes[f].offsetHeight);
                            "horizontal" === this.options.orientation && (this.sliderElem.style.marginBottom = e + "px")
                        }
                        for (var f = 0; f < this.options.ticks.length; f++) {
                            var g = this.options.ticks_positions[f] || this._toPercentage(this.options.ticks[f]);
                            this.options.reversed && (g = 100 - g), this.ticks[f].style[this.stylePos] = g + "%", this._removeClass(this.ticks[f], "in-selection"), this.options.range ? g >= a[0] && g <= a[1] && this._addClass(this.ticks[f], "in-selection") : "after" === this.options.selection && g >= a[0] ? this._addClass(this.ticks[f], "in-selection") : "before" === this.options.selection && g <= a[0] && this._addClass(this.ticks[f], "in-selection"), this.tickLabels[f] && (this.tickLabels[f].style[b] = d + "px", "vertical" !== this.options.orientation && void 0 !== this.options.ticks_positions[f] ? (this.tickLabels[f].style.position = "absolute", this.tickLabels[f].style[this.stylePos] = g + "%", this.tickLabels[f].style[c] = -d / 2 + "px") : "vertical" === this.options.orientation && (this.tickLabels[f].style.marginLeft = this.sliderElem.offsetWidth + "px", this.tickLabelContainer.style.marginTop = this.sliderElem.offsetWidth / 2 * -1 + "px"))
                        }
                    }
                    var h;
                    if (this.options.range) {
                        h = this.options.formatter(this._state.value), this._setText(this.tooltipInner, h), this.tooltip.style[this.stylePos] = (a[1] + a[0]) / 2 + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px"), "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px");
                        var i = this.options.formatter(this._state.value[0]);
                        this._setText(this.tooltipInner_min, i);
                        var j = this.options.formatter(this._state.value[1]);
                        this._setText(this.tooltipInner_max, j), this.tooltip_min.style[this.stylePos] = a[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip_min, "margin-top", -this.tooltip_min.offsetHeight / 2 + "px") : this._css(this.tooltip_min, "margin-left", -this.tooltip_min.offsetWidth / 2 + "px"), this.tooltip_max.style[this.stylePos] = a[1] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip_max, "margin-top", -this.tooltip_max.offsetHeight / 2 + "px") : this._css(this.tooltip_max, "margin-left", -this.tooltip_max.offsetWidth / 2 + "px")
                    } else h = this.options.formatter(this._state.value[0]), this._setText(this.tooltipInner, h), this.tooltip.style[this.stylePos] = a[0] + "%", "vertical" === this.options.orientation ? this._css(this.tooltip, "margin-top", -this.tooltip.offsetHeight / 2 + "px") : this._css(this.tooltip, "margin-left", -this.tooltip.offsetWidth / 2 + "px");
                    if ("vertical" === this.options.orientation) this.trackLow.style.top = "0", this.trackLow.style.height = Math.min(a[0], a[1]) + "%", this.trackSelection.style.top = Math.min(a[0], a[1]) + "%", this.trackSelection.style.height = Math.abs(a[0] - a[1]) + "%", this.trackHigh.style.bottom = "0", this.trackHigh.style.height = 100 - Math.min(a[0], a[1]) - Math.abs(a[0] - a[1]) + "%";
                    else {
                        this.trackLow.style.left = "0", this.trackLow.style.width = Math.min(a[0], a[1]) + "%", this.trackSelection.style.left = Math.min(a[0], a[1]) + "%", this.trackSelection.style.width = Math.abs(a[0] - a[1]) + "%", this.trackHigh.style.right = "0", this.trackHigh.style.width = 100 - Math.min(a[0], a[1]) - Math.abs(a[0] - a[1]) + "%";
                        var k = this.tooltip_min.getBoundingClientRect(),
                            l = this.tooltip_max.getBoundingClientRect();
                        "bottom" === this.options.tooltip_position ? k.right > l.left ? (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = "", this.tooltip_max.style.bottom = "22px") : (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = this.tooltip_min.style.top, this.tooltip_max.style.bottom = "") : k.right > l.left ? (this._removeClass(this.tooltip_max, "top"), this._addClass(this.tooltip_max, "bottom"), this.tooltip_max.style.top = "18px") : (this._removeClass(this.tooltip_max, "bottom"), this._addClass(this.tooltip_max, "top"), this.tooltip_max.style.top = this.tooltip_min.style.top)
                    }
                },
                _resize: function(a) {
                    this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos], this._layout()
                },
                _removeProperty: function(a, b) {
                    a.style.removeProperty ? a.style.removeProperty(b) : a.style.removeAttribute(b)
                },
                _mousedown: function(a) {
                    if (!this._state.enabled) return !1;
                    this._state.offset = this._offset(this.sliderElem), this._state.size = this.sliderElem[this.sizePos];
                    var b = this._getPercentage(a);
                    if (this.options.range) {
                        var c = Math.abs(this._state.percentage[0] - b),
                            d = Math.abs(this._state.percentage[1] - b);
                        this._state.dragged = d > c ? 0 : 1, this._adjustPercentageForRangeSliders(b)
                    } else this._state.dragged = 0;
                    this._state.percentage[this._state.dragged] = b, this._layout(), this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), this.mousemove && document.removeEventListener("mousemove", this.mousemove, !1), this.mouseup && document.removeEventListener("mouseup", this.mouseup, !1), this.mousemove = this._mousemove.bind(this), this.mouseup = this._mouseup.bind(this), this.touchCapable && (document.addEventListener("touchmove", this.mousemove, !1), document.addEventListener("touchend", this.mouseup, !1)), document.addEventListener("mousemove", this.mousemove, !1), document.addEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !0;
                    var e = this._calculateValue();
                    return this._trigger("slideStart", e), this._setDataVal(e), this.setValue(e, !1, !0), this._pauseEvent(a), this.options.focus && this._triggerFocusOnHandle(this._state.dragged), !0
                },
                _touchstart: function(a) {
                    if (void 0 === a.changedTouches) return void this._mousedown(a);
                    var b = a.changedTouches[0];
                    this.touchX = b.pageX, this.touchY = b.pageY
                },
                _triggerFocusOnHandle: function(a) {
                    0 === a && this.handle1.focus(), 1 === a && this.handle2.focus()
                },
                _keydown: function(a, b) {
                    if (!this._state.enabled) return !1;
                    var c;
                    switch (b.keyCode) {
                        case 37:
                        case 40:
                            c = -1;
                            break;
                        case 39:
                        case 38:
                            c = 1
                    }
                    if (c) {
                        if (this.options.natural_arrow_keys) {
                            var d = "vertical" === this.options.orientation && !this.options.reversed,
                                e = "horizontal" === this.options.orientation && this.options.reversed;
                            (d || e) && (c = -c)
                        }
                        var f = this._state.value[a] + c * this.options.step;
                        return this.options.range && (f = [a ? this._state.value[0] : f, a ? f : this._state.value[1]]), this._trigger("slideStart", f), this._setDataVal(f), this.setValue(f, !0, !0), this._setDataVal(f), this._trigger("slideStop", f), this._layout(), this._pauseEvent(b), !1
                    }
                },
                _pauseEvent: function(a) {
                    a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), a.cancelBubble = !0, a.returnValue = !1
                },
                _mousemove: function(a) {
                    if (!this._state.enabled) return !1;
                    var b = this._getPercentage(a);
                    this._adjustPercentageForRangeSliders(b), this._state.percentage[this._state.dragged] = b, this._layout();
                    var c = this._calculateValue(!0);
                    return this.setValue(c, !0, !0), !1
                },
                _touchmove: function(a) {
                    if (void 0 !== a.changedTouches) {
                        var b = a.changedTouches[0],
                            c = b.pageX - this.touchX,
                            d = b.pageY - this.touchY;
                        this._state.inDrag || ("vertical" === this.options.orientation && 5 >= c && c >= -5 && (d >= 15 || -15 >= d) ? this._mousedown(a) : 5 >= d && d >= -5 && (c >= 15 || -15 >= c) && this._mousedown(a))
                    }
                },
                _adjustPercentageForRangeSliders: function(a) {
                    if (this.options.range) {
                        var b = this._getNumDigitsAfterDecimalPlace(a);
                        b = b ? b - 1 : 0;
                        var c = this._applyToFixedAndParseFloat(a, b);
                        0 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[1], b) < c ? (this._state.percentage[0] = this._state.percentage[1], this._state.dragged = 1) : 1 === this._state.dragged && this._applyToFixedAndParseFloat(this._state.percentage[0], b) > c && (this._state.percentage[1] = this._state.percentage[0], this._state.dragged = 0)
                    }
                },
                _mouseup: function() {
                    if (!this._state.enabled) return !1;
                    this.touchCapable && (document.removeEventListener("touchmove", this.mousemove, !1), document.removeEventListener("touchend", this.mouseup, !1)), document.removeEventListener("mousemove", this.mousemove, !1), document.removeEventListener("mouseup", this.mouseup, !1), this._state.inDrag = !1, this._state.over === !1 && this._hideTooltip();
                    var a = this._calculateValue(!0);
                    return this._layout(), this._setDataVal(a), this._trigger("slideStop", a), !1
                },
                _calculateValue: function(a) {
                    var b;
                    if (this.options.range ? (b = [this.options.min, this.options.max], 0 !== this._state.percentage[0] && (b[0] = this._toValue(this._state.percentage[0]), b[0] = this._applyPrecision(b[0])), 100 !== this._state.percentage[1] && (b[1] = this._toValue(this._state.percentage[1]), b[1] = this._applyPrecision(b[1]))) : (b = this._toValue(this._state.percentage[0]), b = parseFloat(b), b = this._applyPrecision(b)), a) {
                        for (var c = [b, 1 / 0], d = 0; d < this.options.ticks.length; d++) {
                            var e = Math.abs(this.options.ticks[d] - b);
                            e <= c[1] && (c = [this.options.ticks[d], e])
                        }
                        if (c[1] <= this.options.ticks_snap_bounds) return c[0]
                    }
                    return b
                },
                _applyPrecision: function(a) {
                    var b = this.options.precision || this._getNumDigitsAfterDecimalPlace(this.options.step);
                    return this._applyToFixedAndParseFloat(a, b)
                },
                _getNumDigitsAfterDecimalPlace: function(a) {
                    var b = ("" + a).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
                    return b ? Math.max(0, (b[1] ? b[1].length : 0) - (b[2] ? +b[2] : 0)) : 0
                },
                _applyToFixedAndParseFloat: function(a, b) {
                    var c = a.toFixed(b);
                    return parseFloat(c)
                },
                _getPercentage: function(a) {
                    !this.touchCapable || "touchstart" !== a.type && "touchmove" !== a.type || (a = a.touches[0]);
                    var b = a[this.mousePos],
                        c = this._state.offset[this.stylePos],
                        d = b - c,
                        e = d / this._state.size * 100;
                    return e = Math.round(e / this._state.percentage[2]) * this._state.percentage[2], this.options.reversed && (e = 100 - e), Math.max(0, Math.min(100, e))
                },
                _validateInputValue: function(a) {
                    if ("number" == typeof a) return a;
                    if (Array.isArray(a)) return this._validateArray(a), a;
                    throw new Error(f.formatInvalidInputErrorMsg(a))
                },
                _validateArray: function(a) {
                    for (var b = 0; b < a.length; b++) {
                        var c = a[b];
                        if ("number" != typeof c) throw new Error(f.formatInvalidInputErrorMsg(c))
                    }
                },
                _setDataVal: function(a) {
                    this.element.setAttribute("data-value", a), this.element.setAttribute("value", a), this.element.value = a
                },
                _trigger: function(b, c) {
                    c = c || 0 === c ? c : void 0;
                    var d = this.eventToCallbackMap[b];
                    if (d && d.length)
                        for (var e = 0; e < d.length; e++) {
                            var f = d[e];
                            f(c)
                        }
                    a && this._triggerJQueryEvent(b, c)
                },
                _triggerJQueryEvent: function(a, b) {
                    var c = {
                        type: a,
                        value: b
                    };
                    this.$element.trigger(c), this.$sliderElem.trigger(c)
                },
                _unbindJQueryEventHandlers: function() {
                    this.$element.off(), this.$sliderElem.off()
                },
                _setText: function(a, b) {
                    "undefined" != typeof a.textContent ? a.textContent = b : "undefined" != typeof a.innerText && (a.innerText = b)
                },
                _removeClass: function(a, b) {
                    for (var c = b.split(" "), d = a.className, e = 0; e < c.length; e++) {
                        var f = c[e],
                            g = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)");
                        d = d.replace(g, " ")
                    }
                    a.className = d.trim()
                },
                _addClass: function(a, b) {
                    for (var c = b.split(" "), d = a.className, e = 0; e < c.length; e++) {
                        var f = c[e],
                            g = new RegExp("(?:\\s|^)" + f + "(?:\\s|$)"),
                            h = g.test(d);
                        h || (d += " " + f)
                    }
                    a.className = d.trim()
                },
                _offsetLeft: function(a) {
                    return a.getBoundingClientRect().left
                },
                _offsetTop: function(a) {
                    for (var b = a.offsetTop;
                         (a = a.offsetParent) && !isNaN(a.offsetTop);) b += a.offsetTop, "BODY" !== a.tagName && (b -= a.scrollTop);
                    return b
                },
                _offset: function(a) {
                    return {
                        left: this._offsetLeft(a),
                        top: this._offsetTop(a)
                    }
                },
                _css: function(b, c, d) {
                    if (a) a.style(b, c, d);
                    else {
                        var e = c.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, function(a, b) {
                            return b.toUpperCase()
                        });
                        b.style[e] = d
                    }
                },
                _toValue: function(a) {
                    return this.options.scale.toValue.apply(this, [a])
                },
                _toPercentage: function(a) {
                    return this.options.scale.toPercentage.apply(this, [a])
                },
                _setTooltipPosition: function() {
                    var a = [this.tooltip, this.tooltip_min, this.tooltip_max];
                    if ("vertical" === this.options.orientation) {
                        var b = this.options.tooltip_position || "right",
                            c = "left" === b ? "right" : "left";
                        a.forEach(function(a) {
                            this._addClass(a, b), a.style[c] = "100%"
                        }.bind(this))
                    } else "bottom" === this.options.tooltip_position ? a.forEach(function(a) {
                        this._addClass(a, "bottom"), a.style.top = "22px"
                    }.bind(this)) : a.forEach(function(a) {
                        this._addClass(a, "top"), a.style.top = -this.tooltip.outerHeight - 14 + "px"
                    }.bind(this))
                }
            }, a && ! function() {
                var e = void 0;
                a.fn.slider ? (windowIsDefined && window.console.warn("bootstrap-slider.js - WARNING: $.fn.slider namespace is already bound. Use the $.fn.bootstrapSlider namespace instead."), e = c) : (a.bridget(b, d), e = b), a.bridget(c, d), a(function() {
                    a("input[data-provide=slider]")[e]()
                })
            }()
        }(a), d
});
