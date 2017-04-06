/*! =======================================================
 VERSION  9.1.3
 ========================================================= */
"use strict";

// modified for local use - add rcsb url
var rcsbUrl = 'http://www.rcsb.org';

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

function xhrPromise(url, responseType) {
    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("load", function() {
            if (xhr.status === 200 || xhr.status === 304) {
                resolve(xhr.response);
            } else {
                reject(xhr.status);
            }
        }, true);
        xhr.addEventListener("error", function(event) {
            reject(event);
        }, true);
        xhr.responseType = responseType;
        xhr.open("GET", url);
        xhr.send();
    });
}

function retrieveSymmetryData(pdbid, bioassembly) {
    var bionumber = bioassembly2bionumber(bioassembly);
    var basePath = rcsbUrl + "/pdb/json/symmetryOrientation";
    var url = basePath + "?pdbID=" + pdbid + "&bioassembly=" + bionumber;
    return xhrPromise(url, "json");
}

function retrieveValidationData(pdbid) {
    pdbid = pdbid.toLowerCase();
    var baseUrl = "http://ftp.wwpdb.org/pub/pdb/validation_reports/";
    var filename = pdbid + "_validation.xml.gz";
    var url = baseUrl + pdbid.substr(1, 2) + "/" + pdbid + "/" + filename;
    return NGL.autoLoad(url, {
        ext: "xml",
        useDomParser: true,
        compressed: false
    }).then(function(xml) {
        return new ValidationData(xml);
    }).catch(function(e) {
        var xml = document.implementation.createDocument("http://wwpdb.org/validation/schema/wwpdb_validation_v002.xsd", "wwPDB-validation-information");
        return new ValidationData({
            data: xml
        });
    });
}

function bionumber2bioassembly(bionumber) {
    if (!bionumber || bionumber === "asym") {
        return "__AU";
    } else {
        return "BU" + bionumber;
    }
}

function bioassembly2bionumber(bioassembly) {
    if (!bioassembly || bioassembly === "__AU") {
        return "asym";
    } else {
        return bioassembly.substr(2);
    }
}
var SymmetryBuffer = function(axes, params) {
    var p = Object.assign({}, params);
    var c = new NGL.Color(p.color || "lime");
    var radius = p.radius || 0.5;
    var shape = new NGL.Shape("symmetry", {
        disableImpostor: false,
        openEnded: true
    });
    axes.forEach(function(ax) {
        shape.addSphere(ax.start, c, radius);
        shape.addSphere(ax.end, c, radius);
        shape.addCylinder(ax.start, ax.end, c, radius);
    });
    this.attach = function(component) {
        shapeRepr = component.addBufferRepresentation(shape.getBufferList());
    };
    this.dispose = function() {
        if (shapeRepr) shapeRepr.dispose();
    };
};
var ValidationData = function(xml) {
    var rsrzDict = {};
    var rsccDict = {};
    var clashDict = {};
    var geoDict = {};
    var geoAtomDict = {};

    function getSele(a, atomname, useAltcode) {
        var icode = a.icode.value;
        var chain = a.chain.value;
        var altcode = a.altcode.value;
        var sele = a.resnum.value;
        if (icode.trim()) sele += "^" + icode;
        if (chain.trim()) sele += ":" + chain;
        if (atomname) sele += "." + atomname;
        if (useAltcode && altcode.trim()) sele += "%" + altcode;
        sele += "/" + (parseInt(a.model.value) - 1);
        return sele;
    }

    function setBitDict(dict, key, bit) {
        if (dict[key] === undefined) {
            dict[key] = bit;
        } else {
            dict[key] |= bit;
        }
    }

    function countSetBits(i) {
        i = i - ((i >> 1) & 0x55555555);
        i = (i & 0x33333333) + ((i >> 2) & 0x33333333);
        return (((i + (i >> 4)) & 0x0F0F0F0F) * 0x01010101) >> 24;
    }
    var groups = xml.data.getElementsByTagName("ModelledSubgroup");
    for (var i = 0, il = groups.length; i < il; ++i) {
        var g = groups[i];
        var ga = g.attributes;
        var sele = getSele(ga);
        var clashes = g.getElementsByTagName("clash");
        for (var j = 0, jl = clashes.length; j < jl; ++j) {
            var ca = clashes[j].attributes;
            var cid = parseInt(ca.cid.value);
            if (clashDict[cid] === undefined) {
                clashDict[cid] = {
                    mag: parseFloat(ca.clashmag.value),
                    dist: parseFloat(ca.dist.value),
                    sele1: getSele(ga, ca.atom.value, true),
                    atom1: ca.atom.value,
                    res1: sele
                };
            } else {
                clashDict[cid].sele2 = getSele(ga, ca.atom.value, true);
                clashDict[cid].atom2 = ca.atom.value;
                clashDict[cid].res2 = sele;
            }
        }
    }
    for (var i = 0, il = groups.length; i < il; ++i) {
        var g = groups[i];
        var ga = g.attributes;
        var sele = getSele(ga);
        if (ga.rsrz !== undefined) {
            rsrzDict[sele] = parseFloat(ga.rsrz.value);
        }
        if (ga.rscc !== undefined) {
            rsccDict[sele] = parseFloat(ga.rscc.value);
        }
        var isPolymer = ga.seq.value !== ".";
        var clashAtoms = [];
        var geoProblemCount = 0;
        var clashes = g.getElementsByTagName("clash");
        for (var j = 0, jl = clashes.length; j < jl; ++j) {
            var ca = clashes[j].attributes;
            var cid = parseInt(ca.cid.value);
            if (clashDict[cid] !== undefined) {
                var c = clashDict[cid];
                if (c.res1 === c.res2 || c.atom1 === undefined || c.atom2 === undefined || NGL.guessElement(c.atom1) === "H" || NGL.guessElement(c.atom2) === "H") {
                    delete clashDict[cid];
                } else {
                    clashAtoms.push(ca.atom.value);
                }
            }
        }
        if (isPolymer) {
            if (clashAtoms.length > 0) {
                geoProblemCount += 1;
            }
            var angleOutliers = g.getElementsByTagName("angle-outlier");
            if (angleOutliers.length > 0) {
                geoProblemCount += 1;
            }
            var bondOutliers = g.getElementsByTagName("bond-outlier");
            if (bondOutliers.length > 0) {
                geoProblemCount += 1;
            }
            var planeOutliers = g.getElementsByTagName("plane-outlier");
            if (planeOutliers.length > 0) {
                geoProblemCount += 1;
            }
            if (ga.rota !== undefined && ga.rota.value === "OUTLIER") {
                geoProblemCount += 1;
            }
            if (ga.rama !== undefined && ga.rama.value === "OUTLIER") {
                geoProblemCount += 1;
            }
            if (ga.RNApucker !== undefined && ga.RNApucker.value === "outlier") {
                geoProblemCount += 1;
            }
            if (geoProblemCount > 0) {
                geoDict[sele] = geoProblemCount;
            }
        } else {
            var mogBondOutliers = g.getElementsByTagName("mog-bond-outlier");
            var mogAngleOutliers = g.getElementsByTagName("mog-angle-outlier");
            if (mogBondOutliers.length > 0 || mogAngleOutliers.length > 0 || clashes.length > 0) {
                var atomDict = {};
                geoAtomDict[sele] = atomDict;
                for (var j = 0, jl = clashAtoms.length; j < jl; ++j) {
                    setBitDict(atomDict, clashAtoms[j], 1);
                }
                for (var j = 0, jl = mogBondOutliers.length; j < jl; ++j) {
                    var mbo = mogBondOutliers[j].attributes;
                    mbo.atoms.value.split(",").forEach(function(atomname) {
                        setBitDict(atomDict, atomname, 2);
                    });
                }
                for (var j = 0, jl = mogAngleOutliers.length; j < jl; ++j) {
                    var mao = mogAngleOutliers[j].attributes;
                    mao.atoms.value.split(",").forEach(function(atomname) {
                        setBitDict(atomDict, atomname, 4);
                    });
                }
            }
        }
    }
    var clashList = [];
    for (var k in clashDict) {
        var c = clashDict[k];
        clashList.push(c.res1, c.res2);
    }
    var clashSele = clashList.length ? clashList.join(" OR ") : "NONE";
    var fitScheme = NGL.ColorMakerRegistry.addScheme(function(params) {
        this.scale = "RdYlBu";
        this.domain = [2, 0];
        var rsrzScale = this.getScale();
        this.domain = [0.678, 1.0];
        var rsccScale = this.getScale();
        this.atomColor = function(atom) {
            var sele = atom.resno;
            if (atom.inscode) sele += "^" + atom.inscode;
            if (atom.chainname) sele += ":" + atom.chainname;
            sele += "/" + atom.modelIndex;
            var rsrz = rsrzDict[sele];
            if (rsrz !== undefined) {
                return rsrzScale(rsrz);
            }
            var rscc = rsccDict[sele];
            if (rscc !== undefined) {
                return rsccScale(rscc);
            }
            return 0x909090;
        };
    });
    var geoScheme = NGL.ColorMakerRegistry.addScheme(function(params) {
        this.atomColor = function(atom) {
            var geoProblemCount;
            var sele = atom.resno;
            if (atom.inscode) sele += "^" + atom.inscode;
            if (atom.chainname) sele += ":" + atom.chainname;
            sele += "/" + atom.modelIndex;
            geoAtom = geoAtomDict[sele];
            if (geoAtom !== undefined) {
                var atomProblems = geoAtom[atom.atomname] || 0;
                geoProblemCount = countSetBits(atomProblems);
            } else {
                geoProblemCount = geoDict[sele] || 0;
            }
            if (geoProblemCount === 0) {
                return 0x2166ac;
            } else if (geoProblemCount === 1) {
                return 0xfee08b;
            } else if (geoProblemCount === 2) {
                return 0xf46d43;
            } else if (geoProblemCount >= 3) {
                return 0xa50026;
            }
            return 0x909090;
        };
    });
    this.clashDict = clashDict;
    this.clashSele = clashSele;
    this.fitScheme = fitScheme;
    this.geoScheme = geoScheme;
};
var ClashBuffer = function(clashDict, structure, params) {
    var p = Object.assign({}, params);
    var color = new NGL.Color(p.color || "#f0027f");
    var sele = p.sele ? " and (" + p.sele + ")" : undefined;
    var shape = new NGL.Shape("clashes", {
        openEnded: false,
        disableImpostor: true
    });
    var s = structure;
    var ap1 = s.getAtomProxy();
    var ap2 = s.getAtomProxy();
    var vDir = new NGL.Vector3();
    var vPos1 = new NGL.Vector3();
    var vPos2 = new NGL.Vector3();
    for (var k in clashDict) {
        var c = clashDict[k];
        var sele1 = c.sele1;
        var sele2 = c.sele2;
        if (sele !== undefined) {
            sele1 += sele;
            sele2 += sele;
        }
        ap1.index = s.getAtomIndices(new NGL.Selection(sele1))[0];
        ap2.index = s.getAtomIndices(new NGL.Selection(sele2))[0];
        if (ap1.index === undefined || ap2.index === undefined) continue;
        vDir.subVectors(ap2, ap1).setLength(ap1.vdw);
        vPos1.copy(ap1).add(vDir);
        vDir.subVectors(ap1, ap2).setLength(ap2.vdw);
        vPos2.copy(ap2).add(vDir);
        var dHalf = ap1.distanceTo(ap2) / 2;
        var r1 = Math.sqrt(ap1.vdw * ap1.vdw - dHalf * dHalf);
        var r2 = Math.sqrt(ap2.vdw * ap2.vdw - dHalf * dHalf);
        shape.addCylinder(vPos1, vPos2, color, (r1 + r2) / 2);
    }
    this.attach = function(component) {
        shapeRepr = component.addBufferRepresentation(shape.getBufferList());
    };
    this.setVisibility = function(value) {
        if (shapeRepr) shapeRepr.setVisibility(value);
    };
    this.dispose = function() {
        if (shapeRepr) shapeRepr.dispose();
    };
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var NglController = function(id, params) {
    var signals = {
        taskCountChanged: new NGL.Signal(),
        fullscreenChanged: new NGL.Signal(),
        structureChanged: new NGL.Signal(),
        symmetryDataLoaded: new NGL.Signal(),
        validationDataLoaded: new NGL.Signal(),
        colorSchemeChanged: new NGL.Signal(),
        modelChanged: new NGL.Signal(),
        hydrogenVisibilityChanged: new NGL.Signal(),
        ionVisibilityChanged: new NGL.Signal(),
        waterVisibilityChanged: new NGL.Signal(),
        clashVisibilityChanged: new NGL.Signal(),
        qualityChanged: new NGL.Signal(),
        assemblyChanged: new NGL.Signal(),
        symmetryChanged: new NGL.Signal(),
        interactionChanged: new NGL.Signal(),
        styleChanged: new NGL.Signal(),
        ligandStyleChanged: new NGL.Signal(),
        focusChanged: new NGL.Signal(),
        clicked: new NGL.Signal(),
        hovered: new NGL.Signal()
    };
    var pdbid;
    var reduced;
    var structureComponent;
    var symmetryBuffer;
    var symmetryData = {};
    var spatialHash;
    var clashBuffer;
    var validationData;
    var validationDataLoading;
    var atomCount;
    var instanceCount;
    var axesRepr;
    var isBackboneOnly;
    var p = Object.assign({}, params);
    var colorScheme = p.colorScheme || "chainname";
    var assembly = p.assembly || "BU1";
    var style = p.style !== undefined ? p.style : "cartoon";
    var ligandStyle = p.ligandStyle !== undefined ? p.ligandStyle : "ball+stick";
    var model = p.model || 0;
    var symmetry = p.symmetry || 0;
    var interaction = p.interaction || false;
    var hydrogenVisibility = p.hydrogenVisibility === undefined ? true : p.hydrogenVisibility;
    var ionVisibility = p.ionVisibility === undefined ? false : p.ionVisibility;
    var waterVisibility = p.waterVisibility === undefined ? false : p.waterVisibility;
    var clashVisibility = p.clashVisibility === undefined ? false : p.clashVisibility;
    var quality = p.quality === undefined ? "auto" : p.quality;
    var spin = p.spin === undefined ? false : p.spin;
    var focus = p.focus === undefined ? 0 : p.focus;
    var hasStructureFactors = p.hasStructureFactors === undefined ? false : p.hasStructureFactors;
    // rl - stage created in ngl-ui.js
    //var stage = new NGL.Stage(id, {
    //    backgroundColor: "white",
    //    hoverTimeout: 500
    //});
    //this.stage = stage;
    var stage;
    var tasks;
    // rl - setStage (and tasks) called from ngl-ui.js
    function setStage(_stage) {
        stage = _stage;
        stage.signals.fullscreenChanged.add(function(fullscreen) {
            signals.fullscreenChanged.dispatch(fullscreen);
        });
        stage.signals.clicked.add(function(pickingData) {
            signals.clicked.dispatch(pickingData);
        });
        stage.signals.hovered.add(function(pickingData) {
            signals.hovered.dispatch(pickingData);
        });
        window.addEventListener("resize", function() {
            stage.handleResize();
        }, false);
        tasks = new NGL.Counter();
        tasks.listen(stage.tasks);
        tasks.signals.countChanged.add(function(delta, count) {
            signals.taskCountChanged.dispatch(delta, count);
        });
        setSpin(spin);
    }
    var polymerReprDict = {};
    var polymerReprDefs = {
        "unitcell": {
            disableImpostor: true,
            radiusSegments: 16
        },
        "cartoon": {
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            aspectRatio: 5,
            scale: 0.7,
            quality: "custom",
            subdiv: function() {
                if (quality === "auto") {
                    if (atomCount < 15000) {
                        return 12;
                    } else if (atomCount < 70000) {
                        return 6;
                    } else {
                        return 3;
                    }
                } else {
                    if (quality === "high") {
                        return 12;
                    } else if (quality === "medium") {
                        return 6;
                    } else {
                        return 3;
                    }
                }
            },
            radialSegments: function() {
                if (quality === "auto") {
                    if (atomCount < 15000) {
                        return 20;
                    } else if (atomCount < 70000) {
                        return 10;
                    } else {
                        return 6;
                    }
                } else {
                    if (quality === "high") {
                        return 20;
                    } else if (quality === "medium") {
                        return 10;
                    } else {
                        return 6;
                    }
                }
            },
            sele: function() {
                var sele = "";
                if (model !== "all") {
                    sele += "/" + model;
                }
                return sele;
            }
        },
        "base": {
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            quality: "custom",
            sphereDetail: function() {
                if (quality === "auto") {
                    return atomCount < 15000 ? 1 : 0;
                } else {
                    if (quality === "high") {
                        return 1;
                    } else if (quality === "medium") {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            radialSegments: function() {
                if (quality === "auto") {
                    if (atomCount < 15000) {
                        return 20;
                    } else if (atomCount < 70000) {
                        return 10;
                    } else {
                        return 5;
                    }
                } else {
                    if (quality === "high") {
                        return 20;
                    } else if (quality === "medium") {
                        return 10;
                    } else {
                        return 5;
                    }
                }
            },
            sele: function() {
                var sele = "polymer and nucleic";
                if (model !== "all") {
                    sele += " and /" + model;
                }
                return sele;
            }
        },
        "backbone": {
            lineOnly: function() {
                if (quality === "auto") {
                    return atomCount > 250000;
                } else {
                    return quality === "low";
                }
            },
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            scale: 2.0,
            sele: function() {
                var sele = "";
                if (model !== "all") {
                    sele += "/" + model;
                }
                return sele;
            }
        },
        "surface": {
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            surfaceType: "sas",
            probeRadius: 1.4,
            useWorker: true,
            scaleFactor: function() {
                var sf;
                if (quality === "low") {
                    sf = 0.1;
                } else if (quality === "medium") {
                    sf = 0.7;
                } else if (quality === "high") {
                    sf = 1.7;
                } else {
                    sf = Math.min(1.5, Math.max(0.1, 50000 / atomCount));
                }
                return sf;
            },
            sele: function() {
                var sele = "polymer and ( protein or nucleic )";
                if (model !== "all") {
                    sele += " and /" + model;
                }
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                return sele;
            }
        },
        "spacefill": {
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            quality: "custom",
            sphereDetail: function() {
                if (quality === "auto") {
                    return atomCount < 15000 ? 1 : 0;
                } else {
                    if (quality === "high") {
                        return 1;
                    } else if (quality === "medium") {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            sele: function() {
                var sele = "polymer and ( protein or nucleic )";
                if (model !== "all") {
                    sele += " and /" + model;
                }
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                return sele;
            }
        },
        "licorice": {
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            multipleBond: "symmetric",
            quality: "custom",
            sphereDetail: function() {
                if (quality === "auto") {
                    return atomCount < 15000 ? 1 : 0;
                } else {
                    if (quality === "high") {
                        return 1;
                    } else if (quality === "medium") {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            radialSegments: function() {
                if (quality === "auto") {
                    if (atomCount < 15000) {
                        return 20;
                    } else if (atomCount < 70000) {
                        return 10;
                    } else {
                        return 5;
                    }
                } else {
                    if (quality === "high") {
                        return 20;
                    } else if (quality === "medium") {
                        return 10;
                    } else {
                        return 5;
                    }
                }
            },
            sele: function() {
                var sele = "polymer and ( protein or nucleic )";
                if (model !== "all") {
                    sele += " and /" + model;
                }
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                return sele;
            }
        },
        "ball+stick": {
            colorScheme: getColorScheme,
            colorScale: getColorScale,
            multipleBond: "symmetric",
            quality: "custom",
            sphereDetail: function() {
                if (quality === "auto") {
                    return atomCount < 15000 ? 1 : 0;
                } else {
                    if (quality === "high") {
                        return 1;
                    } else if (quality === "medium") {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            radialSegments: function() {
                if (quality === "auto") {
                    if (atomCount < 15000) {
                        return 20;
                    } else if (atomCount < 70000) {
                        return 10;
                    } else {
                        return 5;
                    }
                } else {
                    if (quality === "high") {
                        return 20;
                    } else if (quality === "medium") {
                        return 10;
                    } else {
                        return 5;
                    }
                }
            },
            sele: function() {
                var sele;
                if (!reduced && validationData) {
                    sele = "( " + validationData.clashSele + " )";
                    if (model !== "all") {
                        sele += " and /" + model;
                    }
                    if (hydrogenVisibility === false) {
                        sele += " and not hydrogen";
                    }
                } else {
                    sele = "NONE";
                }
                return sele;
            }
        }
    };
    var ligandReprDict = {};
    var ligandReprDefs = {
        "spacefill": {
            colorScheme: getLigandColorScheme,
            quality: function() {
                return "medium";
            },
            sele: function() {
                var sele = "( not polymer or not ( protein or nucleic ) )";
                if (model !== "all") {
                    sele += " and /" + model;
                }
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                if (ionVisibility === false) {
                    sele += " and not ion";
                }
                if (waterVisibility === false) {
                    sele += " and not water";
                }
                return sele;
            }
        },
        "ball+stick": {
            multipleBond: "symmetric",
            colorScheme: getLigandColorScheme,
            quality: function() {
                return "medium";
            },
            scale: 2.5,
            aspectRatio: 1.2,
            sele: function() {
                var sele = "( not polymer or not ( protein or nucleic ) )";
                if (model !== "all") {
                    sele += " and /" + model;
                }
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                if (ionVisibility === false) {
                    sele += " and not ion";
                }
                if (waterVisibility === false) {
                    sele += " and not water";
                }
                return sele;
            }
        }
    };
    var interactionReprDict = {};
    var interactionReprDefs = {
        "licorice": {
            multipleBond: "symmetric",
            colorScheme: getLigandColorScheme,
            colorValue: "lightsteelblue",
            quality: function() {
                return "medium";
            },
            scale: 1.5,
            sele: function() {
                if (interaction && structureComponent) {
                    var s = structureComponent.structure;
                    var withinSele = new NGL.Selection(interaction + (model !== "all" ? " and /" + model : ""));
                    var as = s.getAtomSetWithinSelection(withinSele, 5);
                    if (model !== "all") {
                        as.intersection(s.getAtomSet(new NGL.Selection("/" + model)));
                    }
                    var asGroup = s.getAtomSetWithinGroup(as);
                    var sele = asGroup.toSeleString();
                    if (hydrogenVisibility === false) {
                        sele += " and not hydrogen";
                    }
                    if (ionVisibility === false) {
                        sele += " and not ion";
                    }
                    if (waterVisibility === false) {
                        sele += " and not water";
                    }
                    if (model !== "all") {
                        sele += " and /" + model;
                    }
                    return sele;
                } else {
                    return "NONE";
                }
            }
        },
        "ball+stick": {
            multipleBond: "symmetric",
            colorScheme: getLigandColorScheme,
            quality: function() {
                return "medium";
            },
            scale: 2.5,
            aspectRatio: 1.2,
            sele: function() {
                var sele = interaction ? interaction : "NONE";
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                if (model !== "all") {
                    sele += " and /" + model;
                }
                return sele;
            }
        },
        "label": {
            color: "#333333",
            zOffset: 2.0,
            attachment: "middle-center",
            showBackground: true,
            backgroundColor: "white",
            backgroundOpacity: 0.5,
            scale: 0.6,
            sele: function() {
                if (interaction && structureComponent) {
                    var s = structureComponent.structure;
                    var withinSele = new NGL.Selection(interaction + (model !== "all" ? " and /" + model : ""));
                    var as = s.getAtomSetWithinSelection(withinSele, 5);
                    if (model !== "all") {
                        as.intersection(s.getAtomSet(new NGL.Selection("/" + model)));
                    }
                    var asGroup = s.getAtomSetWithinGroup(as);
                    var sele = asGroup.toSeleString();
                    if (hydrogenVisibility === false) {
                        sele += " and not hydrogen";
                    }
                    if (ionVisibility === false) {
                        sele += " and not ion";
                    }
                    if (waterVisibility === false) {
                        sele += " and not water";
                    }
                    if (model !== "all") {
                        sele += " and /" + model;
                    }
                    sele += " and ( ( protein and .CA ) or ( nucleic and .P ) )";
                    return sele;
                } else {
                    return "NONE";
                }
            }
        },
        "surface": {
            colorScheme: getLigandColorScheme,
            opacity: 0.5,
            side: "front",
            surfaceType: "sas",
            probeRadius: 1.4,
            useWorker: false,
            scaleFactor: 2.5,
            sele: function() {
                var sele = interaction ? interaction : "NONE";
                if (hydrogenVisibility === false) {
                    sele += " and not hydrogen";
                }
                if (model !== "all") {
                    sele += " and /" + model;
                }
                return sele;
            }
        },
    };

    function evalParam(paramValue) {
        if (typeof paramValue === "function") {
            return paramValue();
        } else {
            return paramValue;
        }
    }

    function getPolymerParam(reprName, paramName) {
        return evalParam(polymerReprDefs[reprName][paramName]);
    }

    function getLigandParam(reprName, paramName) {
        return evalParam(ligandReprDefs[reprName][paramName]);
    }

    function getInteractionParam(reprName, paramName) {
        return evalParam(interactionReprDefs[reprName][paramName]);
    }

    function makeRepresentations(reprDefs, reprDict) {
        if (!structureComponent) return;
        for (var reprName in reprDefs) {
            var reprParams = reprDefs[reprName];
            var params = {
                lazy: true,
                visible: false,
                assembly: assembly
            };
            for (var paramName in reprParams) {
                params[paramName] = evalParam(reprParams[paramName]);
            }
            if (reprDict[reprName]) {
                reprDict[reprName].dispose();
            }
            reprDict[reprName] = structureComponent.addRepresentation(reprName, params);
        }
    }

    function makeCounts() {
        var structure = structureComponent.structure;
        var _assembly = structure.biomolDict[assembly];
        if (_assembly) {
            atomCount = _assembly.getAtomCount(structure)
            if (model !== "all") {
                atomCount /= structure.modelStore.count;
            }
            instanceCount = _assembly.getInstanceCount();
        } else {
            if (model === "all") {
                atomCount = structure.atomStore.count;
            } else {
                atomCount = structure.getModelProxy(0).atomCount;
            }
            instanceCount = 1;
        }
        if (typeof window.orientation !== 'undefined') {
            atomCount *= 4;
        }
        isBackboneOnly = structure.atomStore.count / structure.residueStore.count < 2;
        if (isBackboneOnly) {
            atomCount *= 10;
        }
    }

    function setStructure(comp) {
        console.log('setStructure');
        structureComponent = comp;
        initStructure();
        signals.structureChanged.dispatch(structureComponent);
    }

    function initStructure() {
        console.log('initStructure');
        if (!structureComponent) return;
        var s = structureComponent.structure;
        spatialHash = new NGL.SpatialHash(s.atomStore, s.boundingBox);
        makeCounts();
        if (getStyleNames(true)[style] === undefined) {
            style = getDefaultStyle();
        }
        if (getSymmetryNames()[symmetry] === undefined) {
            symmetry = 0;
        }
        if (getSymmetryInfo() === undefined) {
            loadSymmetryData(assembly).then(updateSymmetry);
        }
        setSymmetry(symmetry);
        makeRepresentations(polymerReprDefs, polymerReprDict);
        makeRepresentations(ligandReprDefs, ligandReprDict);
        makeRepresentations(interactionReprDefs, interactionReprDict);
        structureComponent.setDefaultAssembly(assembly);
        axesRepr = structureComponent.addRepresentation("axes", {
            visible: false
        });
        setStyle(style);
        setLigandStyle(ligandStyle);
        setColorScheme(colorScheme);
        if (assembly === "UNITCELL") {
            polymerReprDict["unitcell"].setVisibility(true);
        } else if (assembly === "SUPERCELL") {
            setLigandStyle("");
        } else {
            axesRepr.repr.align();
        }
        setClashVisibility();
        centerView();
        setInteraction(interaction);
    }

    function loadPdbid(_pdbid, _assembly, _reduced) {
        console.log('loadPdbid');
        pdbid = _pdbid;
        reduced = _reduced;
        symmetryData = {};
        if (symmetryBuffer) {
            symmetryBuffer.dispose();
            symmetryBuffer = undefined;
        }
        validationData = undefined;
        if (clashBuffer) {
            clashBuffer.dispose();
            clashBuffer = undefined;
        }
        if (_assembly !== undefined) {
            assembly = _assembly;
        }
        var mmtfUrl = "rcsb://" + pdbid + (_reduced ? ".bb" : "") + ".mmtf";
        var mmcifUrl = "rcsb://" + pdbid + ".cif";
        var params = {
            assembly: assembly,
            defaultRepresentation: false
        };
        return stage.loadFile(mmtfUrl, params).then(setStructure).catch(function(e) {
            console.error(e);
            return stage.loadFile(mmcifUrl, params).then(setStructure).catch(function(e) {
                console.error(e);
            });
        });
    }

    // rl - added setPdbid because loadPdbid is not called
    function setPdbid(_pdbid, _assembly, _reduced) {
        console.log('setPdbid');
        pdbid = _pdbid;
        reduced = _reduced;
        symmetryData = {};
        if (symmetryBuffer) {
            symmetryBuffer.dispose();
            symmetryBuffer = undefined;
        }
        validationData = undefined;
        if (clashBuffer) {
            clashBuffer.dispose();
            clashBuffer = undefined;
        }
        if (_assembly !== undefined) {
            assembly = _assembly;
        }
    }


    function loadSymmetryData(_assembly) {
        tasks.increment();
        return retrieveSymmetryData(pdbid, _assembly).then(function(data) {
            tasks.decrement();
            if (!data || !data.symmetries || !data.symmetries.length) {
                symmetry = -1;
            } else {
                data.symmetries = data.symmetries.filter(function(sym) {
                    return sym.pointGroup !== "C1";
                });
                if (!data.symmetries.length) {
                    symmetry = -1;
                }
            }
            symmetryData[_assembly] = data;
            signals.symmetryDataLoaded.dispatch(data);
        }).catch(function(e) {
            tasks.decrement();
            console.error(e);
        });
    }

    function loadValidationData() {
        validationData = undefined;
        validationDataLoading = true;
        tasks.increment();
        return retrieveValidationData(pdbid).then(function(data) {
            tasks.decrement();
            validationData = data;
            validationDataLoading = false;
            signals.validationDataLoaded.dispatch(data);
        });
    }

    function updateSelections() {
        var name;
        for (name in polymerReprDict) {
            polymerReprDict[name].setSelection(getPolymerParam(name, "sele"));
        }
        for (name in ligandReprDict) {
            ligandReprDict[name].setSelection(getLigandParam(name, "sele"));
        }
        for (name in interactionReprDict) {
            interactionReprDict[name].setSelection(getInteractionParam(name, "sele"));
        }
    }

    function setStyle(value) {
        style = value;
        for (var name in polymerReprDict) {
            if (name === "unitcell" && assembly === "UNITCELL") {
                polymerReprDict["unitcell"].setVisibility(true);
            } else if (name === "ball+stick" && clashVisibility) {
                polymerReprDict["ball+stick"].setVisibility(true);
            } else if (name === "base" && style === "cartoon") {
                polymerReprDict["base"].setVisibility(true);
            } else {
                polymerReprDict[name].setVisibility(name === style);
            }
        }
        signals.styleChanged.dispatch(style);
    }

    function setLigandStyle(value) {
        ligandStyle = value;
        for (var name in ligandReprDict) {
            ligandReprDict[name].setVisibility(name === ligandStyle);
        }
        signals.ligandStyleChanged.dispatch(ligandStyle);
    }

    function setColorScheme(value) {
        if (value !== undefined) colorScheme = value;
        if (["fit", "geo"].includes(colorScheme) && validationData === undefined) {
            if (validationDataLoading) {
                signals.validationDataLoaded.addOnce(setColorScheme);
            } else {
                loadValidationData().then(setColorScheme);
            }
        } else {
            for (var name in polymerReprDict) {
                polymerReprDict[name].setParameters({
                    colorScheme: getPolymerParam(name, "colorScheme"),
                    colorScale: getPolymerParam(name, "colorScale")
                });
            }
            for (var name in ligandReprDict) {
                ligandReprDict[name].setParameters({
                    colorScheme: getLigandParam(name, "colorScheme"),
                    colorScale: getLigandParam(name, "colorScale")
                });
            }
            for (var name in interactionReprDict) {
                interactionReprDict[name].setParameters({
                    colorScheme: getInteractionParam(name, "colorScheme"),
                    colorScale: getInteractionParam(name, "colorScale")
                });
            }
        }
        signals.colorSchemeChanged.dispatch(colorScheme);
    }

    function setModel(value) {
        if (value !== "all") value = parseInt(value);
        if (value !== model && (model === "all" || value === "all")) {
            model = value;
            initStructure();
        } else {
            model = value;
            updateSelections();
        }
        if (clashBuffer) {
            clashBuffer.dispose();
            clashBuffer = undefined;
        }
        setClashVisibility();
        signals.modelChanged.dispatch(model);
    }

    function setHydrogenVisibility(value) {
        hydrogenVisibility = value;
        updateSelections();
        signals.hydrogenVisibilityChanged.dispatch(hydrogenVisibility);
    }

    function setIonVisibility(value) {
        ionVisibility = value;
        updateSelections();
        signals.ionVisibilityChanged.dispatch(ionVisibility);
    }

    function setWaterVisibility(value) {
        waterVisibility = value;
        updateSelections();
        signals.waterVisibilityChanged.dispatch(waterVisibility);
    }

    function setClashVisibility(value) {
        if (value !== undefined) clashVisibility = value;
        if (clashVisibility) {
            if (validationData === undefined) {
                if (validationDataLoading) {
                    signals.validationDataLoaded.addOnce(setClashVisibility);
                } else {
                    loadValidationData().then(setClashVisibility);
                }
            } else {
                if (clashBuffer) {
                    clashBuffer.setVisibility(true);
                } else {
                    var sele = (model === "all" ? undefined : "/" + model);
                    clashBuffer = new ClashBuffer(validationData.clashDict, structureComponent.structure, {
                        sele: sele
                    });
                    clashBuffer.attach(structureComponent);
                }
                updateSelections();
                polymerReprDict["ball+stick"].setVisibility(true);
            }
        } else {
            if (clashBuffer) {
                clashBuffer.setVisibility(false);
            }
            polymerReprDict["ball+stick"].setVisibility(false);
        }
        signals.clashVisibilityChanged.dispatch(clashVisibility);
    }

    function setQuality(value) {
        quality = value;
        polymerReprDict["surface"].setParameters({
            scaleFactor: getPolymerParam("surface", "scaleFactor")
        });
        polymerReprDict["cartoon"].setParameters({
            subdiv: getPolymerParam("cartoon", "subdiv"),
            radialSegments: getPolymerParam("cartoon", "radialSegments")
        });
        polymerReprDict["backbone"].setParameters({
            lineOnly: getPolymerParam("backbone", "lineOnly")
        });
        polymerReprDict["spacefill"].setParameters({
            sphereDetail: getPolymerParam("spacefill", "sphereDetail"),
        });
        signals.qualityChanged.dispatch(quality);
    }

    function getDefaultStyle() {
        if (atomCount < 200000) {
            return "cartoon";
        } else {
            return "surface";
        }
    }

    function getColorScale() {
        if (colorScheme === "hydrophobicity") {
            return "RdYlGn";
        } else if (colorScheme === "bfactor") {
            return "OrRd";
        } else {
            return "RdYlBu";
        }
    }

    function getColorScheme() {
        if (colorScheme === "fit") {
            return validationData ? validationData.fitScheme : "chainname";
        } else if (colorScheme === "geo") {
            return validationData ? validationData.geoScheme : "chainname";
        } else {
            return colorScheme;
        }
    }

    function getLigandColorScheme() {
        if (colorScheme === "bfactor") {
            return "bfactor";
        } else if (colorScheme === "fit") {
            return validationData ? validationData.fitScheme : "element";
        } else if (colorScheme === "geo") {
            return validationData ? validationData.geoScheme : "chainname";
        } else {
            return "element";
        }
    }

    function setAssembly(value) {
        assembly = value;
        initStructure();
        signals.assemblyChanged.dispatch(assembly);
    }

    function setInteraction(value) {
        interaction = value;
        if (structureComponent) {
            var s = structureComponent.structure;
            var available = Object.keys(getInteractionNames());
            if (interaction && !available.includes(interaction)) {
                var residues = [];
                s.eachResidue(function(rp) {
                    var sele = "";
                    if (rp.resno !== undefined) sele += rp.resno;
                    if (rp.inscode) sele += "^" + rp.inscode;
                    if (rp.chain) sele += ":" + rp.chainname;
                    residues.push(sele);
                }, new NGL.Selection(interaction + " and ( not polymer or not ( protein or nucleic ) )"));
                if (available.includes(residues[0])) {
                    interaction = residues[0]
                } else {
                    interaction = "";
                }
            }
            for (var name in interactionReprDict) {
                var sele = getInteractionParam(name, "sele");
                if (interaction) {
                    interactionReprDict[name].setSelection(sele);
                    interactionReprDict[name].setVisibility(true);
                } else {
                    interactionReprDict[name].setVisibility(false);
                    interactionReprDict[name].setSelection(sele);
                }
            }
            if (interaction) {
                structureComponent.centerView(true, interaction);
                stage.viewer.zoom(5);
                var sceneSize = stage.viewer.boundingBox.size().length();
                var interactionSize = sceneSize;
                if (structureComponent && interaction) {
                    var bb = s.getBoundingBox(new NGL.Selection(interaction));
                    interactionSize = Math.max(10, Math.min(sceneSize, bb.size().length() - 5));
                }
                if (ligandStyle) {
                    setLigandStyle("");
                }
                setFocus(Math.min(95, 100 - ((interactionSize / sceneSize) * 100)));
            } else {
                setFocus(0);
                if (!style) {
                    setStyle(getDefaultStyle());
                }
                if (!ligandStyle) {
                    setLigandStyle("ball+stick");
                }
                centerView();
            }
        }
        signals.interactionChanged.dispatch(interaction);
    }

    function setSpin(value) {
        spin = value;
        if (spin === true) {
            stage.setSpin([0, 1, 0], 0.005);
        } else if (value === false) {
            stage.setSpin(null, null);
        }
    }

    function setFocus(value) {
        focus = parseInt(value);
        stage.setParameters({
            clipNear: focus / 2,
            fogFar: 100 - (focus / 2),
            fogNear: 100 - (focus / 2) - (focus / 20)
        });
        signals.focusChanged.dispatch(focus);
    }

    function getSymmetryInfo() {
        var data = symmetryData[assembly];
        if (data && data.nrSymmetries) {
            return data.symmetries[symmetry];
        } else {
            return undefined;
        }
    }

    function updateSymmetry() {
        if (symmetryBuffer) {
            symmetryBuffer.dispose();
            symmetryBuffer = undefined;
        }
        var data = getSymmetryInfo();
        if (data && data.symmetryAxes) {
            symmetryBuffer = new SymmetryBuffer(data.symmetryAxes, {});
            symmetryBuffer.attach(structureComponent);
        }
        if (data && data.rotation && data.center) {
            var r = data.rotation;
            var m3 = new NGL.Matrix3().set(parseFloat(r.m00), parseFloat(r.m01), parseFloat(r.m02), parseFloat(r.m10), parseFloat(r.m11), parseFloat(r.m12), parseFloat(r.m20), parseFloat(r.m21), parseFloat(r.m22));
            var c = new NGL.Vector3().copy(data.center);
            var v1 = new NGL.Vector3(parseFloat(r.m00), parseFloat(r.m01), parseFloat(r.m02));
            var v2 = new NGL.Vector3(parseFloat(r.m10), parseFloat(r.m11), parseFloat(r.m12));
            var v3 = new NGL.Vector3(parseFloat(r.m20), parseFloat(r.m21), parseFloat(r.m22));
            stage.viewer.alignView(v3, v1, c, false);
            stage.viewer.centerView(true);
        }
    }

    function setSymmetry(value) {
        symmetry = parseInt(value) || 0;
        var data = getSymmetryInfo();
        if (symmetry === -1) {
            if (symmetryBuffer) {
                symmetryBuffer.dispose();
                symmetryBuffer = undefined;
            }
        } else if (data === undefined) {
            if (symmetryBuffer) {
                symmetryBuffer.dispose();
                symmetryBuffer = undefined;
            }
            loadSymmetryData(assembly).then(updateSymmetry);
        } else {
            updateSymmetry();
            setFocus(0);
            if (!style) {
                setStyle(getDefaultStyle());
            }
        }
        signals.symmetryChanged.dispatch(symmetry);
    }

    function centerView() {
        stage.centerView();
    }

    function downloadScreenshot() {
        stage.makeImage({
            factor: 2,
            antialias: true,
            trim: false,
            transparent: false
        }).then(function(blob) {
            NGL.download(blob, pdbid + "_screenshot.png");
        });
    }

    function toggleFullscreen(element) {
        stage.toggleFullscreen(element);
    }

    function getStyleNames(recommended) {
        var styleDict = {
            "": "None",
            backbone: "Backbone",
            surface: "Surface",
        };
        if (recommended) {
            if (atomCount < 100000) {
                styleDict["cartoon"] = "Cartoon";
            }
            if (atomCount < 80000) {
                styleDict["spacefill"] = "Spacefill";
            }
            if (atomCount < 80000) {
                styleDict["licorice"] = "Licorice";
            }
        } else {
            styleDict["cartoon"] = "Cartoon";
            if (!isBackboneOnly) {
                styleDict["spacefill"] = "Spacefill";
                styleDict["licorice"] = "Licorice";
            }
        }
        return styleDict;
    }

    function getLigandStyleNames() {
        return {
            "": "None",
            "ball+stick": "Ball & Stick",
            spacefill: "Spacefill"
        };
    }

    function getModelNames() {
        var modelDict = {};
        if (structureComponent) {
            var modelStore = structureComponent.structure.modelStore;
            if (modelStore.count > 1) {
                modelDict["all"] = "All Models";
            }
            for (var i = 0; i < modelStore.count; ++i) {
                modelDict[i] = "Model " + (i + 1);
            }
        }
        return modelDict;
    }

    function getAssemblyNames() {
        var assemblyDict = {};
        if (structureComponent) {
            var structure = structureComponent.structure;
            var biomolDict = structure.biomolDict;
            if (!structure.unitcell && Object.keys(biomolDict).length === 1 && biomolDict["BU1"] && biomolDict["BU1"].isIdentity(structure)) {
                assemblyDict["BU1"] = "Full Structure";
            } else {
                assemblyDict["__AU"] = (structure.unitcell ? "Asymmetric Unit" : "Full Structure");
                for (var name in biomolDict) {
                    if (name === "UNITCELL") {
                        assemblyDict[name] = "Unitcell";
                    } else if (name === "SUPERCELL") {
                        assemblyDict[name] = "Supercell";
                    } else if (name.substr(0, 2) === "BU") {
                        assemblyDict[name] = "Bioassembly " + name.substr(2);
                    } else {
                        assemblyDict[name] = name;
                    }
                }
            }
        }
        return assemblyDict;
    }

    function getColorSchemeNames() {
        var schemeDict = {
            chainname: "By Chain",
            residueindex: "Rainbow",
            element: "By Element",
            bfactor: "By B-factor",
            sstruc: "By Secondary Structure",
            hydrophobicity: "By Hydrophobicity",
            fit: "By Density Fit",
            geo: "By Geometry Quality"
        };
        if (structureComponent) {
            var methods = structureComponent.structure.header.experimentalMethods;
            if (methods && !methods.includes("X-RAY DIFFRACTION") && !methods.includes("ELECTRON CRYSTALLOGRAPHY") && !methods.includes("NEUTRON DIFFRACTION")) {
                delete schemeDict.bfactor;
                delete schemeDict.fit;
            }
        }
        if (!hasStructureFactors) {
            delete schemeDict.fit;
        }
        return schemeDict;
    }

    function getSymmetryNames() {
        var symmetryDict = {
            "-1": "None"
        };
        var data = symmetryData[assembly];
        if (data && data.symmetries) {
            for (var i = 0; i < data.symmetries.length; ++i) {
                var sym = data.symmetries[i];
                var type = sym.local ? "local" : "global";
                if (sym.pseudoSymmetric) {
                    type += ", pseudo";
                }
                symmetryDict[i] = sym.pointGroup + " (" + type + ")";
            }
        }
        return symmetryDict;
    }

    function getInteractionNames() {
        var interactionDict = {
            "": "None"
        };
        if (structureComponent) {
            var s = structureComponent.structure;
            var ligandSele = "( not polymer or not ( protein or nucleic ) ) and not ( water or ACE or NH2 )";
            var _assembly = s.biomolDict[assembly];
            if (_assembly) {
                ligandSele += " and (" + _assembly.getSelection().string + ")";
            }
            var ligandSelection = new NGL.Selection();
            s.eachResidue(function(rp) {
                if (rp.isWater()) return;
                var sele = "";
                if (rp.resno !== undefined) sele += rp.resno;
                if (rp.inscode) sele += "^" + rp.inscode;
                if (rp.chain) sele += ":" + rp.chainname;
                var name = (rp.resname ? "[" + rp.resname + "]" : "") + sele;
                interactionDict[sele] = name;
            }, new NGL.Selection(ligandSele));
        }
        return interactionDict;
    }
    // functions
    this.signals = signals;
    this.loadPdbid = loadPdbid;
    this.centerView = centerView;
    this.downloadScreenshot = downloadScreenshot;
    this.toggleFullscreen = toggleFullscreen;
    this.setStyle = setStyle;
    this.setLigandStyle = setLigandStyle;
    this.setModel = setModel;
    this.setHydrogenVisibility = setHydrogenVisibility;
    this.setIonVisibility = setIonVisibility;
    this.setWaterVisibility = setWaterVisibility;
    this.setClashVisibility = setClashVisibility;
    this.setQuality = setQuality;
    this.setAssembly = setAssembly;
    this.setColorScheme = setColorScheme;
    this.setSpin = setSpin;
    this.setSymmetry = setSymmetry;
    this.setInteraction = setInteraction;
    this.setFocus = setFocus;
    this.getStyleNames = getStyleNames;
    this.getLigandStyleNames = getLigandStyleNames;
    this.getModelNames = getModelNames;
    this.getAssemblyNames = getAssemblyNames;
    this.getColorSchemeNames = getColorSchemeNames;
    this.getSymmetryNames = getSymmetryNames;
    this.getInteractionNames = getInteractionNames;
    // rl - added these
    this.setStage = setStage;
    this.setStructure = setStructure;
    this.setPdbid = setPdbid;
    // vars
    this.getStyle = function() {
        return style;
    };
    this.getLigandStyle = function() {
        return ligandStyle;
    };
    this.getModel = function() {
        return model;
    };
    this.getHydrogenVisibility = function() {
        return hydrogenVisibility;
    };
    this.getIonVisibility = function() {
        return ionVisibility;
    };
    this.getWaterVisibility = function() {
        return waterVisibility;
    };
    this.getClashVisibility = function() {
        return clashVisibility;
    };
    this.getQuality = function() {
        return quality;
    };
    this.getAssembly = function() {
        return assembly;
    };
    this.getSymmetry = function() {
        return symmetry;
    };
    this.getInteraction = function() {
        return interaction;
    };
    this.getColorScheme = function() {
        return colorScheme;
    };
    this.getSpin = function() {
        return spin;
    };
    this.getFocus = function() {
        return focus;
    };
    // rl added
    this.getPdbid = function() { return pdbid; };

};
