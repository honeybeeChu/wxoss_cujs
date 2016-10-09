define("common/qq/Class.js", [], function (e, t, n) {
    try {
        var r = +(new Date);
        "use strict", t.create = function (e) {
            var t = function () {
                this.construct && this.construct.apply(this, arguments);
            };
            return e.apply(t.prototype, arguments), t;
        }, function () {
            function e(e) {
                for (var t = 1, n = arguments.length; t < n; t++) for (var r in arguments[t]) Object.prototype.hasOwnProperty.call(arguments[t], r) && (e[r] = arguments[t][r]);
                return e;
            }

            function n() {
                return this.__instance__ || (this.__instance__ = new this(arguments[0], arguments[1], arguments[2]));
            }

            function r(e) {
                var t = i.call(this, e);
                return t.prototype.parent = this, t;
            }

            function i(t) {
                var i = typeof this == "function" ? this : function () {
                }, s = function () {
                    function e(t, r) {
                        t.Super && e(t.Super, r), t.init && t.init.apply(r, n);
                    }

                    var t = this, n = arguments;
                    t.Root = i.__base__, t.Super = i.prototype, e(t, t);
                };
                return e(s.prototype, i.prototype || {}, t), s.__base__ = i.__base__ || s.prototype, s.GetStaticInstance = n, s.Inherit = s.inherit = r, s;
            }

            t.declare = i;
        }();
    } catch (i) {
        wx.jslog({
            src: "common/qq/Class.js"
        }, i);
    }
});
