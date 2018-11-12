var state = '', interval = 0, tmInterval = 0, headerTitle = '';
var util = {
    run: function () {
        util.initExtend();
        util.request();
        interval = setInterval(function () {
            if (state === 'DONE') {
                clearInterval(interval);
            }
            util.request();
        }, 3 * 1000); //3秒/次请求
    },
    request: function () {
        $.ajax({
            url: './data.json', //这里面是请求的接口地址
            type: 'GET',
            data: {},
            timeout: 2000,
            dataType: 'json',
            success: function (data) {
                util.makeHtml(data);
            },
            error: function (xhr) {
                alert('网络错误')
            }
        });
    },
    makeHtml: function (data) {
        var curStep = data.curstep;
        state = data.state;
        if (headerTitle === '') {
            headerTitle = data.name;
            $('.header-title h2').text(headerTitle);
        }

        var progressBar = $('.progress-par');
        var percent = parseInt(curStep.percent);
        progressBar.attr('style', 'width:' + percent + '%');
        progressBar.find('i').text(percent + '%');
        progressBar.addClass(state.toLocaleLowerCase());

        $('.progress-left-time').text(curStep.starttime);
        $('.progress-right-time').text(curStep.endtime);

        util.makeTimer(curStep.state, curStep.starttime, curStep.endtime);

        var leftData = [];
        var rightData = [];
        var curIndex = 0;
        for (var j = 0; j < data.steps.length; j++) {
            if (data.steps[j].name === curStep.name) {
                curIndex = j;
                break;
            }
        }
        for (var i = 0; i < data.steps.length; i++) {
            if (i === curIndex) {
                continue;
            } else if (i < curIndex) {
                leftData.push(data.steps[i]);
            } else {
                rightData.push(data.steps[i]);
            }
        }

        //current step
        var loadingNow = $(".progress-ring");
        var color = {
            run: '#5091C7',
            done: '#00ac00',
            stop: '#ff0000',
            error: '#ff0000',
            confirm: '#e0b200',
            edit: '#c4c4c4'
        };
        var curState = curStep.state.toLocaleLowerCase();
        console.log(curState);
        loadingNow.attr('data-name', curStep.name);
        loadingNow.attr('data-percent', curStep.percent);
        loadingNow.attr('data-color', '#f0f0f0,' + color[curState]);
        loadingNow.loadingNow();

        util.makeR(rightData);
        util.makeL(leftData);

        var stateArr = ['DONE','STOP'];
        if ($.inArray(state,stateArr)) {
            $('.progress-par span').css({
                'background': 'url("images/done.png") no-repeat',
                'background-size': '70px 50px'
            });
            clearInterval(interval);
            clearInterval(tmInterval);
        }
    },
    makeR: function (rightData) {
        if (rightData.length > 0) {
            var rindex = 1;
            for (var i = 0; i < rightData.length; i++) {
                if (rindex > 4) {
                    break;
                }
                var rbox = $('.rbox-' + (i + 1));
                var html = rightData[i].name;
                lbox.find('.con-text').html(html);
                rbox.addClass('step-' + rightData[i].state.toLocaleLowerCase());
                rbox.show();
                rindex++;
            }
        }
    },
    makeL: function (leftData) {
        if (leftData.length > 0) {
            leftData = leftData.reverse();
            var index = 1;
            for (var i = 0; i < leftData.length; i++) {
                if (index > 4) {
                    break;
                }
                var lbox = $('.lbox-' + (i + 1));
                lbox.show();
                var html = '<p>' + leftData[i].name + '</p>';
                if (leftData[i].state.toLocaleLowerCase() === 'done') {
                    var timer = util.getTimerByIndex(i, leftData[i].starttime, leftData[i].endtime);
                    html += '<em>' + timer + '</em>';
                }
                lbox.find('.con-text').html(html);
                lbox.addClass('step-' + leftData[i].state.toLocaleLowerCase());
                index++;
            }
        }
    },
    getTimerByIndex: function (index, startTime, endTime) {
        var timer = util.timeFn(startTime, endTime);
        var str = '';
        switch (index) {
            case 0:
            case 1:
                str = timer.hours + '小时' + timer.minutes + '分' + timer.seconds + '秒';
                break;
            case 2:
                str = timer.minutes + '分' + timer.seconds + '秒';
                break;
            case 3:
                str = timer.seconds + '秒';
                break;
            default:
                str = timer.hours + '小时' + timer.minutes + '分' + timer.seconds + '秒';
        }

        return str;
    },
    makeTimer: function (state, starTime, endTime) {
        var timer;
        if (state === 'DONE') {
            clearInterval(tmInterval);
            timer = util.timeFn(starTime, endTime);
            util.showTimer(timer);
        } else {
            if (!tmInterval) {
                clearInterval(tmInterval);
                tmInterval = setInterval(function () {
                    timer = util.timeFn(starTime, util.getNow());
                    util.showTimer(timer);
                }, 1 * 1000); //定时刷新时间
            }
        }
    },
    showTimer: function (timer) {
        var hours = timer.hours.split('');
        var minutes = timer.minutes.split('');
        var seconds = timer.seconds.split('');
        var headerTimeLi = $('.header-timeout li');
        headerTimeLi.eq(1).find('span').text(hours[0]);
        headerTimeLi.eq(2).find('span').text(hours[1]);
        headerTimeLi.eq(4).find('span').text(minutes[0]);
        headerTimeLi.eq(5).find('span').text(minutes[1]);
        headerTimeLi.eq(7).find('span').text(seconds[0]);
        headerTimeLi.eq(8).find('span').text(seconds[1]);
    },
    initExtend: function () {
        $.fn.loadingNow = function () {
            var defaultOpt = {
                trackColor: '#f0f0f0',
                progressColor: '#72B6E3',
                percent: 75,
                duration: 2000
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

                $target.append('<div class="inner-progress"></div><div class="progress-track"></div><div class="progress-left"></div><div class="progress-right"></div><div class="progress-cover"></div><div class="progress-text"><p>' + textName + '</p><p>' + percent + '%</p></div>');

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
    },
    timeFn: function (d1, d2) {
        var dateBegin = new Date(d1.replace(/-/g, "/"));
        var dateEnd = new Date(d2.replace(/-/g, "/"));
        var dateDiff = dateEnd.getTime() - dateBegin.getTime();
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));
        var leave1 = dateDiff % (24 * 3600 * 1000);   //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000));//计算出小时数
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000);   //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000));//计算相差分钟数
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000);      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000);
        hours = hours < 10 ? '0' + hours : '' + hours;
        minutes = minutes < 10 ? '0' + minutes : '' + minutes;
        seconds = seconds < 10 ? '0' + seconds : '' + seconds;
        return {hours: hours, minutes: minutes, seconds: seconds};
    },
    getNow: function () {
        var d = new Date();
        var now = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        return now;
    }
};
window.util = util;