var common = {

    convertCurrency: function (money) {

        //汉字的数字
        var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        var cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        var cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        var cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        var cnInteger = '整';
        //整型完以后的单位
        var cnIntLast = '元';
        //最大处理的数字
        var maxNum = 999999999999999.9999;
        //金额整数部分
        var integerNum;
        //金额小数部分
        var decimalNum;
        //输出的中文金额字符串
        var chineseStr = '';
        //分离金额后用的数组，预定义
        var parts;
        if (money == '') {
            return '';
        }
        money = parseFloat(money);
        if (money >= maxNum) {
            //超出最大处理数字
            return '';
        }
        if (money == 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            var zeroCount = 0;
            var IntLen = integerNum.length;
            for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                        chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
            chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            var decLen = decimalNum.length;
            for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    },
    //文件大小字节自动转换
    formatFileSize: function (limitS) {
        var limit = 0;
        if (!isEmpty(limitS)) {
            limit = parseInt(limitS)
        }
        var size = "";
        if (limit < 0.1 * 1024) {                            //小于0.1KB，则转化成B
            size = limit.toFixed(2) + "B"
        } else if (limit < 0.1 * 1024 * 1024) {            //小于0.1MB，则转化成KB
            size = (limit / 1024).toFixed(2) + "KB"
        } else if (limit < 0.1 * 1024 * 1024 * 1024) {        //小于0.1GB，则转化成MB
            size = (limit / (1024 * 1024)).toFixed(2) + "MB"
        } else {                                            //其他转化成GB
            size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
        }

        var sizeStr = size + "";                        //转成字符串
        var index = sizeStr.indexOf(".");                    //获取小数点处的索引
        var dou = sizeStr.substr(index + 1, 2);            //获取小数点后两位的值
        if (dou == "00") {                                //判断后两位是否为00，如果是则删除00
            return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
        }
        return size;
    },
    //判断后缀添加小数点
    isSuffix: function (monNum) {
        if (monNum) {
            if (monNum.indexOf('.') < 0) {
                return monNum + '.00';
            } else {
                return monNum;
            }
        } else {
            return monNum;
        }
    },
    //获取业务表单页面标识
    getModuleObj: function (moduleType) {
        var moduleObj = {};
        var userInfo = getUserData('pid');
        var roleCode = userInfo.ROLECODELIST.toString();
        ajax_req({
            url: baseUrl.index.selectByRoleCode,
            type: 'post',
            async: false,
            data: JSON.stringify({
                businessType: moduleType,
                roleCode: roleCode
            }),
            success: function (res) {
                if (res.resultStat == "SUCCESS" && res.data != null) {
                    moduleObj = res.data;
                } else {
                    layer.msg("未获取到当前用户权限")
                }
            },
            wrong: function (err) {
            }
        });
        return moduleObj;
    }
};
//获取数据字典-返回字典对象
var dataDict = {
    dictCache:{},//缓存当前页加载过的字典信息
    getSysdictdata: function (dictType) {

        var dictCache = getLocalInfo('DICTDATA');
        if (dictCache.length > 0) {
            dataDict.dictCache = JSON.parse(dictCache);
        }
        if (!dataDict.dictCache[dictType]) {
            ajax_req({
                url: baseUrl.sysdictdata.selectdictByType,
                type: 'get',
                async: false,
                data: 'dictType=' + dictType,
                success: function (res) {
                    dataDict.dictCache[dictType] = res.data;
                }
            });
        }
        return dataDict.dictCache[dictType]
    },
    //按照key和code取字典信息值
    getDictValueByKey: function (key, code) {
        var text = code, data = {};
        if (!isEmpty(key) && !isEmpty(code)) {
            if (!isEmpty(dataDict.dictCache[key])) {
                data = dataDict.dictCache[key]
            } else {
                data = dataDict.getSysdictdata(key);
            }
            $.each(data, function (index, value) {
                if (value.dictValue == code.toString()) {
                    text = value.dictCabel;
                }
            });
        }
        return text;
    }
};
var inputControl = {
    //获取光标位置
    getCursorPos: function (obj) {
        var CaretPos = 0;
        // IE Support   
        if (document.selection) {
            obj.focus(); //获取光标位置函数   
            var Sel = document.selection.createRange();
            Sel.moveStart('character', -obj.value.length);
            CaretPos = Sel.text.length;
        }
        // Firefox/Safari/Chrome/Opera support   
        else if (obj.selectionStart || obj.selectionStart == '0')
            CaretPos = obj.selectionEnd;
        return (CaretPos);
    },
    //定位光标    
    setCursorPos: function (obj, pos) {
        if (obj.setSelectionRange) { //Firefox/Safari/Chrome/Opera  
            obj.focus(); //  
            obj.setSelectionRange(pos, pos);
        } else if (obj.createTextRange) { // IE  
            var range = obj.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    },
    //替换后定位光标在原处,可以这样调用οnkeyup=replaceAndSetPos(this,/[^/d]/g,'');     
    replaceAndSetPos: function (obj, pattern, text) {
        if ($(obj).val() == "" || $(obj).val() == null) {
            return;
        }
        var pos = inputControl.getCursorPos(obj);//保存原始光标位置   
        var temp = $(obj).val(); //保存原始值   
        obj.value = temp.replace(pattern, text);//替换掉非法值   
        //截掉超过长度限制的字串（此方法要求已设定元素的maxlength属性值）  
        var max_length = obj.getAttribute ? parseInt(obj.getAttribute("maxlength")) : "";
        if (obj.value.length > max_length) {
            var str1 = obj.value.substring(0, pos - 1);
            var str2 = obj.value.substring(pos, max_length + 1);
            obj.value = str1 + str2;
        }
        pos = pos - (temp.length - obj.value.length);//当前光标位置   
        inputControl.setCursorPos(obj, pos);//设置光标   
        //el.onkeydown = null;
    }
};
function getUrlParam(name) {
    var str = window.location.search;
    if (str.indexOf(name) != -1) {
        var pos_start = str.indexOf(name) + name.length + 1;
        str = str.substring(pos_start);
        var pos_end = str.indexOf("&") == -1 ? str.length : str.indexOf("&");
        var result = str.substring(0, pos_end);
        if (!isEmpty(result)) {
            return str.substring(0, pos_end);
        } else {
            return "";
        }
    }
}

//判断字符是否为空的方法
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj === null || obj == "" || obj == "undefined" || obj == "null" || JSON.stringify(obj) == "{}") {
        return true;
    } else {
        return false;
    }
}

Date.prototype.Format = function (fmt) {

    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "H+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};

//格式化时间
function dateFormat(timestamp, format) {
    return timestamp;
    if (timestamp) {
        var time;
        if (typeof timestamp === 'string') {
            timestamp = timestamp.replace(/-/g, '/').replace(/T|Z/g, ' ').trim();
            if (timestamp.indexOf(".") > -1) {
                timestamp = timestamp.substring(0, timestamp.indexOf("."));
            }
            time = new Date(timestamp);
        } else if (typeof timestamp === 'object') {
            time = new Date(timestamp);
        }
        format = ((format) ? format : "yyyy-MM-dd HH:mm:ss");
        var formatStr = time.Format(format);
        if (formatStr.indexOf("NaN") > -1) {
            return timestamp;
        }
        return formatStr;
    } else {
        return '';
    }
}

/**
 * null转空字符串
 * null => ''
 * @param {*} data 要处理的数据
 */
function nullFormatStr(data) {
    for (var x in data) {
        if (isEmpty(data[x])) { // 如果是null 把直接内容转为 ''
            data[x] = '';
        } else {
            if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
                var z = [];
                for (var i in data[x]) {
                    z.push(nullFormatStr(data[x][i]));
                }
                data[x] = z;
            }
            if (typeof (data[x]) === 'object') { // 是json 递归继续处理
                data[x] = nullFormatStr(data[x])
            }
        }
    }
    return data;
}

/**
 * 删除两边空格
 * null => ''
 * @param {*} data 要处理的数据
 */
function delBothTrim(data) {
    for (var x in data) {
        if (typeof data[x] == "string") { // 如果是null 把直接内容转为 ''
            data[x] = data[x].trim();
        } else {
            if (Array.isArray(data[x])) { // 是数组遍历数组 递归继续处理
                var z = [];
                for (var i in data[x]) {
                    z.push(nullFormatStr(data[x][i]));
                }
                data[x] = z;
            }
            if (typeof (data[x]) === 'object') { // 是json 递归继续处理
                data[x] = nullFormatStr(data[x])
            }
        }
    }
    return data;
}

//打开全屏窗口
function openFullWindow(url, callback, size) {
    var strRegex = "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?";
    var re = new RegExp(strRegex);//验证是否指定了页面
    if (!re.test(url)) {
        return null;
    }
    var sizeSetting = {
        width: screen.availWidth - 10,
        height: screen.availHeight - 50
    };
    if (url.indexOf("?") != -1) {
        url += "&";
    } else {
        url += "?";
    }

    url += "_ijt=" + new Date().getTime();

    $.extend(sizeSetting, size);
    var width = sizeSetting.width;
    var height = sizeSetting.height;
    var iTop = ((window.screen.height - height) / 2) - 45;       //获得窗口的垂直位置;
    var iLeft = (window.screen.width - width) / 2 - 5;        //获得窗口的水平位置;
    iTop = iTop < 0 ? 0 : iTop;
    iLeft = iLeft < 0 ? 0 : iLeft;

    var features = "width=" + width + ",";
    features += "height=" + height + ",";
    features += "top=" + iTop + ",";
    features += "left=" + iLeft + ",";
    features += "directories=no,";
    features += "status=yes,toolbar=no,location=no,";
    features += "menubar=no,";
    features += "scrollbars=yes,";
    features += "resizable=yes";
    var redirectUrl = url;
    var winObj = window.open(redirectUrl, "", features);

    var loop = setInterval(function () {
        if (winObj.closed) {
            clearInterval(loop);
            setTimeout(function () {
                callback.closed();
            }, 200);
        }
    }, 200);
}

$.fn.autoHeight = function () {
    this.each(function () {
        $(this).attr("style", "height:" + (this.scrollHeight) + "px !important");
    });
};

function autoHeightEvent() {

    $('textarea').each(function () {
        $(this).on('input', function () {
            var heightPx = $(this).css("height");
            var height = heightPx ? parseInt(heightPx.replace("px", "")) : 0;
            var scrollHeight = this.scrollHeight;
            // let $fixedheader = $('#topface'); // fixed容器
            // 3         // console.log(fixedheader);
            // 4         var wintop=$(window).scrollTop(); // 已滚动卷去的高度
            if (height !== scrollHeight) {
                // $(this).attr("style", "height:60px !important");
                $(this).attr("style", "height:" + (this.scrollHeight) + "px !important");
                // var win_scroll = scrollHeight + $(this).offset().top;
                // console.log($(this).offset().top)
                // console.log(scrollHeight)
                // console.log(win_scroll)
                // $("html,body").animate({scrollTop: win_scroll}, 100);//1000是ms,也可以用slow代替});
            }
        });
    });
}

$.fn.reset_form = function (formObj) {
    var $form = $(this);
    $(":input", $form)
        .not(":button", ":reset", ":hidden", ":submit")
        .val("")
        .removeAttr("checked")
        .removeAttr("selected");
};
$.fn.jsonSerializeForm = function (formObj) {
    var element = $(this);
    if (!!formObj) {
        for (var key in formObj) {
            var $name = element.find('[name=' + key + ']');

            var value = formObj[key];
            $name.each(function (i,v) {
                var tag = v;
                if (tag) {
                    var type = tag.localName;
                    var tag_type = $(tag).attr("type");
                    if (tag_type){
                        type = tag_type;
                    }
                    switch (type) {
                        case "label":
                            $name.html(value);
                            break;
                        case "textarea":
                            $name.val(value).autoHeight();
                            break;
                        case "checkbox":
                            element.find("[name=" + key + "][value=" + value + "]").attr("checked", 'checked').click();
                            break;
                        case "radio":
                            element.find("[name=" + key + "][value=" + value + "]").attr('checked', 'true').click();
                            break;
                        case "select":
                            $name.val(value).trigger("change");
                            $name.next().find("dl").find("dd[lay-value='" + value + "']").click();//表单用了layer的下拉框
                            break;
                        default:
                            $name.val(value).trigger("input");
                            break;
                    }
                }
            });
        }
        return false;
    }
};
//String内置对象中添加去两边空格
String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};
//String内置对象中添加去左边空格
String.prototype.ltrim = function () {
    return this.replace(/(^\s*)/g, "");
};
//String内置对象中添加去右边空格
String.prototype.rtrim = function () {
    return this.replace(/(\s*$)/g, "");
};
