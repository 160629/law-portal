$(function () {
    layui.use('laydate', function () {
        var laydate = layui.laydate;

        //format: 'yyyy年MM月dd日 HH:mm:ss' //可任意组合
        //年选择器-[yyyy]
        lay('.date_month').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this
                , type: 'year'
            });
        });

        //年月选择器-[yyyy-mm]
        lay('.date_month').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this
                , type: 'month'
            });
        });
        //日期选择器-[yyyy-mm-dd]
        lay('.date_date').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this
                , type: 'date'
                , trigger: 'click'
            });
        });

        //时间选择器-[hh:mm:ss]
        lay('.date_time').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this
                , type: 'time'
            });
        });
        lay('.date_datetime').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this,
                type: 'datetime',
                trigger: 'click'
            });
        });
        //当前和之前的
        lay('.date_date_currentBefore').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this,
                type: 'date',
                trigger: 'click',
                max: Date.now()
            });
        });
        //当前和之后的
        lay('.date_date_currentLater').each(function () {
            $(this).attr("readonly", 'readonly');
            laydate.render({
                elem: this,
                type: 'date',
                trigger: 'click',
                min: Date.now()
            });
        });

    });

    var default_interval_time = new IntervalTime('start_time', 'end_time', 'datetime');
    var default_interval_date = new IntervalTime('start_date', 'end_date', 'date');

    //有时间优化一下扩容方式
    var default_interval_time1 = new IntervalTime('start_time1', 'end_time1', 'datetime');
    var default_interval_time2 = new IntervalTime('start_time2', 'end_time2', 'datetime');
    var default_interval_time3 = new IntervalTime('start_time3', 'end_time3', 'datetime');

    var default_interval_date1 = new IntervalTime('start_date1', 'end_date1', 'date');
    var default_interval_date2 = new IntervalTime('start_date2', 'end_date2', 'date');
    var default_interval_date3 = new IntervalTime('start_date3', 'end_date3', 'date');

    //重置-目前所有重置按钮都叫resebtn
    $(".resetbtn").on("click", function () {
        default_interval_time.restFun();
        default_interval_date.restFun();

        default_interval_time1.restFun();
        default_interval_time2.restFun();
        default_interval_time3.restFun();

        default_interval_date1.restFun();
        default_interval_date2.restFun();
        default_interval_date3.restFun();

    })
});


//间隔时间--年月日时分秒 --有时间优化一下直接传入选择器，命名生成方式
function IntervalTime(start, end, type) {
    this.startName = start;
    this.endName = end;
    this.type = type;
    var that = this;
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        that.startDate = laydate.render({
            elem: '#' + that.startName,
            type: that.type,
            trigger: 'click',
            done: function (value, date) {
                if (value) {
                    that.endDate.config.min = {
                        year: date.year,
                        month: date.month - 1,//关键
                        date: date.date,
                        hours: date.hours,
                        minutes: date.minutes,
                        seconds: date.seconds
                    };
                } else {
                    that.endDate.config.min = '1900-1-1';
                }
            }
        });
        that.endDate = laydate.render({
            elem: '#' + that.endName,
            type: that.type,
            done: function (value, date) {
                if (value) {
                    that.startDate.config.max = {
                        year: date.year,
                        month: date.month - 1,//关键
                        date: date.date,
                        hours: date.hours,
                        minutes: date.minutes,
                        seconds: date.seconds
                    };
                } else {
                    that.startDate.config.max = that.endDate.config.max;
                }
            }
        });
        //初始化页面时，如果输入框中有值
        var start_time = $('#' + that.startName).val();
        var end_time = $('#' + that.endName).val();
        if (start_time) {
            var date = new Date(start_time);
            that.endDate.config.min = {
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate(),
                hours: date.getHours(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
            };
        }
        if (end_time) {
            var date = new Date(end_time);
            that.startDate.config.max = {
                year: date.getFullYear(),
                month: date.getMonth(),
                date: date.getDate(),
                hours: date.getHours(),
                minutes: date.getMinutes(),
                seconds: date.getSeconds()
            };
        }
        that.restFun = function () {
            that.endDate.config.min = '1900-1-1';
            that.startDate.config.max = that.endDate.config.max;
        }
    });

}
// 日期，在原有日期基础上，增加days天数，默认增加1天
function getEndDate(date, days) {
    if (days == undefined || days == '') {
        days = 1;
    }
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return date.getFullYear() + '-' + getFormatDate(month) + '-' + getFormatDate(day);
}

// 日期月份/天的显示，如果是1位数，则在前面加上'0'
function getFormatDate(arg) {
    if (arg == undefined || arg == '') {
        return '';
    }

    var re = arg + '';
    if (re.length < 2) {
        re = '0' + re;
    }

    return re;
}