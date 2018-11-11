;!function () {
    "use strict";
    var e = {open: "{{", close: "}}"}, r = {
        exp: function (e) {
            return new RegExp(e, "g")
        }, query: function (r, t, c) {
            var o = ["#([\\s\\S])+?", "([^{#}])*?"][r || 0];
            return n((t || "") + e.open + o + e.close + (c || ""))
        }, escape: function (e) {
            return String(e || "").replace(/&(?!#?[a-zA-Z0-9]+;)/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&#39;").replace(/"/g, "&quot;")
        }, error: function (e, r) {
            var n = "Laytpl Error：";
            return "object" == typeof console && console.error(n + e + "\n" + (r || "")), n + e
        }
    }, n = r.exp, t = function (e) {
        this.tpl = e
    };
    t.pt = t.prototype, window.errors = 0, t.pt.parse = function (t, c) {
        var o = this, p = t, a = n("^" + e.open + "#", ""), l = n(e.close + "$", "");
        t = t.replace(/\s+|\r|\t|\n/g, " ").replace(n(e.open + "#"), e.open + "# ").replace(n(e.close + "}"), "} " + e.close).replace(/\\/g, "\\\\").replace(/(?="|')/g, "\\").replace(r.query(), function (e) {
            return e = e.replace(a, "").replace(l, ""), '";' + e.replace(/\\/g, "") + ';view+="'
        }).replace(r.query(1), function (r) {
            var t = '"+(';
            return r.replace(/\s/g, "") === e.open + e.close ? "" : (r = r.replace(n(e.open + "|" + e.close), ""), /^=/.test(r) && (r = r.replace(/^=/, ""), t = '"+_escape_('), t + r.replace(/\\/g, "") + ')+"')
        }), t = '"use strict";var view = "' + t + '";return view;';
        try {
            return o.cache = t = new Function("d, _escape_", t), t(c, r.escape)
        } catch (u) {
            return delete o.cache, r.error(u, p)
        }
    }, t.pt.render = function (e, n) {
        var t, c = this;
        return e ? (t = c.cache ? c.cache(e, r.escape) : c.parse(c.tpl, e), console.log(), n ? void n(t) : t) : r.error("no data")
    };
    var c = function (e) {
        return "string" != typeof e ? r.error("Template not found") : new t(e)
    };
    c.config = function (r) {
        r = r || {};
        for (var n in r) e[n] = r[n]
    }, c.v = "1.2", "function" == typeof define ? define(function () {
        return c
    }) : "undefined" != typeof exports ? module.exports = c : window.laytpl = c
}();
var util = {
    run: function () {
        util.initExtend();
        util.getData();
    },
    getData: function () {
        $.ajax({
            url: './data.json',
            type: 'GET', //GET
            data: {},
            timeout: 5000,
            dataType: 'json',
            success: function (data, textStatus, jqXHR) {
                util.makeHtml(data);
            },
            error: function (xhr, textStatus) {
                alert('网络错误')
            }
        });
    },
    makeHtml: function (data) {
        var leftData = [];
        var rightData = [];
        var curIndex = 0;
        var currentData = 0;
        for (var j = 0; j < data['steps'].length; j++) {
            if (data['steps'][j]['name'] === data['curstep']['name']) {
                curIndex = j;
                break;
            }
        }
        console.log(curIndex);
        for (var i = 0; i < data['steps'].length; i++) {
            if (i === curIndex) {
                currentData = data['steps'][i];
            } else if (i < curIndex) {
                leftData.push(data['steps'][i]);
            } else {
                rightData.push(data['steps'][i]);
            }
        }

        var tpl = $('#stepItemTpl').html();
        laytpl(tpl).render(currentData, function (html) {
            $('.step-current').html(html);
            $(".progress-ring").loadingRing();
        });

        util.makeR(rightData);
        util.makeL(leftData);
    },
    makeR: function (rightData) {
        if (rightData.length > 0) {

        }
    },
    makeL: function (leftData) {
        if (leftData.length > 0) {

        }
    },
    initExtend: function () {
        $.fn.loadingRing = function () {
            var defaultOpt = {
                trackColor: '#f0f0f0',
                progressColor: '#72B6E3',
                percent: 75,
                duration: 1500
            }; // 默认选项
            $(this).each(function () {
                var $target = $(this);
                var color = $target.data('color'); // 颜色
                var percent = parseInt($target.data('percent'), 10); // 百分比
                var duration = parseFloat($target.data('duration'), 10) * 1000; // 持续时间
                var trackColor, progressColor;
                if (color && color.split(',').length === 2) {
                    var colorSet = color.split(',');
                    trackColor = colorSet[0];
                    progressColor = colorSet[1];
                } else {
                    trackColor = defaultOpt.trackColor;
                    progressColor = defaultOpt.progressColor;
                }
                if (!percent)
                    percent = defaultOpt.percent;
                if (!duration)
                    duration = defaultOpt.duration;

                var textName = $target.attr('data-name');
                var textState = $target.attr('data-state');
                $target.append('<div class="progress-track"></div><div class="progress-left"></div><div class="progress-right"></div><div class="progress-cover"></div><div class="progress-text"><p>' + textName + '</p><span>' + textState + '</span></div>');

                var x = $target.find('.progress-cover').height(); // 触发 Layout
                // http://stackoverflow.com/questions/12088819/css-transitions-on-new-elements

                $target.find('.progress-track, .progress-cover').css('border-color', trackColor);
                $target.find('.progress-left, .progress-right').css('border-color', progressColor);

                $target.find('.progress-left').css({
                    'transform': 'rotate(' + percent * 3.6 + 'deg)',
                    '-o-transform': 'rotate(' + percent * 3.6 + 'deg)',
                    '-ms-transform': 'rotate(' + percent * 3.6 + 'deg)',
                    '-moz-transform': 'rotate(' + percent * 3.6 + 'deg)',
                    '-webkit-transform': 'rotate(' + percent * 3.6 + 'deg)',
                    'transition': 'transform ' + duration + 'ms linear',
                    '-o-transition': '-o-transform ' + duration + 'ms linear',
                    '-ms-transition': '-ms-transform ' + duration + 'ms linear',
                    '-moz-transition': '-moz-transform ' + duration + 'ms linear',
                    '-webkit-transition': '-webkit-transform ' + duration + 'ms linear'
                });

                if (percent > 50) {
                    var animation = 'toggle ' + (duration * 50 / percent) + 'ms'
                    $target.find('.progress-right').css({
                        'opacity': 1,
                        'animation': animation,
                        'animation-timing-function': 'step-end'
                    });
                    $target.find('.progress-cover').css({
                        'opacity': 0,
                        'animation': animation,
                        'animation-timing-function': 'step-start'
                    });
                }
            });
        }
    }
};
window.util = util;