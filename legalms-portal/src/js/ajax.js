var loadAjaxFile = "" +
    "<script src='/legalms/legalms-portal/src/lib/jquery.serializeJson.js'></script>" +
    "<script src='/legalms/legalms-portal/src/lib/carhartl-jquery-cookie-v1.3.0-0-gdf3e07a/carhartl-jquery-cookie-bf24a03/jquery.cookie.js'></script>" +
    "<script src='/legalms/legalms-portal/src/js/aes.js'></script>" +
    "<script src='/legalms/legalms-portal/src/js/mode-ecb-min.js'></script>" +
    "<script src='/legalms/legalms-portal/src/js/crypto.js'></script>" +
    "<script src='/legalms/legalms-portal/src/api/baseurl.js?v=1.1'></script>" +
    "<script src='/legalms/legalms-portal/src/js/public/dateFormat.js?v=1.1'></script>" +
    "<script src='/legalms/legalms-portal/src/js/public/common.js?v=1.1'></script>" +
    "<script src='/legalms/legalms-portal/src/js/login.js?v=1.1'></script>" +
    "<script src='/legalms/legalms-portal/src/js/public/openselect.js?v=1.1'></script>";

$("body").prepend(loadAjaxFile);
$("head").append("<link rel='shortcut icon' href='/legalms/legalms-portal/src/css/images/favicon.ico.png' type='image/x-icon'>");

$(function () {
    // platform.sendHeight();
    sendHeight();
});

function sendHeight() {
    var url = new Array('http://4atest.chinatowercom.cn:20061/uac_oa/resources/getHeight/agent.html#',
        'http://120.52.96.35:18104/uac_oa/resources/getHeight/agent.html#',
        'http://4a.tower0788.cn/uac_oa/resources/getHeight/agent.html#',
        'http://4a.chinatowercom.cn:20000/uac_oa/resources/getHeight/agent.html#');
    var referrer = document.referrer;
    var realUrl;
    if (referrer.indexOf("4atest.chinatowercom.cn:20061") != -1) {
        realUrl = url[0];
    } else if (referrer.indexOf("120.52.96.35:18104") != -1) {
        realUrl = url[1];
    } else if (referrer.indexOf("4a.tower0788.cn") != -1) {
        realUrl = url[2];
    } else if (referrer.indexOf("4a.chinatowercom.cn:20000") != -1) {
        realUrl = url[3];
    }
    if (!realUrl){
        return false;
    }
    var c_iframe = "<iframe id='c_iframe' src='http://120.52.96.35:18104/uac_oa/resources/getHeight/agent.html#1332|1122'\n" +
        "style='display:none' width='0' height='0'></iframe>";
    $("body").append(c_iframe);
    var height = document.body.clientHeight;
    height = height + 250;
    var width = document.body.clientWidth;
    var src = realUrl + width + '|' + height;
    c_iframe = document.getElementById("c_iframe");
    c_iframe.src = src;
    // document.body.parentNode.style.overflow = "-Scroll";
    // document.body.parentNode.style.overflowY = "hidden";
    // document.body.parentNode.style.overflowX = "hidden";
}
var platform = {

    getPlatformUrl: function (url, referrer) {
        var realUrl;
        if (referrer.indexOf("4atest.chinatowercom.cn:20061") != -1) {
            realUrl = url[0];
        } else if (referrer.indexOf("120.52.96.35:18104") != -1) {
            realUrl = url[1];
        } else if (referrer.indexOf("4a.tower0788.cn") != -1) {
            realUrl = url[2];
        } else if (referrer.indexOf("4a.chinatowercom.cn:20000") != -1) {
            realUrl = url[3];
        }
        return realUrl;
    },
    sendHeight: function () {
        var url = new Array('http://4atest.chinatowercom.cn:20061/uac_oa/resources/getHeight/agent.html#',
            'http://120.52.96.35:18104/uac_oa/resources/getHeight/agent.html#',
            'http://4a.tower0788.cn/uac_oa/resources/getHeight/agent.html#',
            'http://4a.chinatowercom.cn:20000/uac_oa/resources/getHeight/agent.html#');
        var thatDocument = document;
        if (!document) return;
        var referrer = thatDocument.referrer;
        var realUrl = platform.getPlatformUrl(url, referrer);
        if (!realUrl) {
            console.log(parent)
            //请求父级再验证一次
            thatDocument = parent.document;
            referrer = thatDocument.referrer;
            realUrl = platform.getPlatformUrl(url, referrer);
        }
        if (!realUrl) {
            return false;
        }

        var height = thatDocument.body.clientHeight;
        height = height + 250;
        var width = thatDocument.body.clientWidth;

        var src = realUrl + width + '|' + height;
        var c_iframe = "<iframe id='c_iframe' src='" + src + "' style='display:none'  width='0' height='0'></iframe>";
        $('body', thatDocument).find("#c_iframe").remove();
        $('body', thatDocument).append(c_iframe);
    },
    setMenuCode: function (menuCode, callback) {
        var CHNTPOC = "CHNTLEGALMS";
        var url = new Array('http://4atest.chinatowercom.cn:20061/uac_oa/resources/getHeight/agentNav.html#',
            'http://120.52.96.35:18104/uac_oa/resources/getHeight/agentNav.html#',
            'http://4a.tower0788.cn/uac_oa/resources/getHeight/agentNav.html#',
            'http://4a.chinatowercom.cn:20000/uac_oa/resources/getHeight/agentNav.html#');
        var thatDocument = document;
        if (!document) return;
        var referrer = thatDocument.referrer;
        var realUrl = platform.getPlatformUrl(url, referrer);
        if (!realUrl) {
            //请求父级再验证一次
            thatDocument = parent.document;
            referrer = thatDocument.referrer;
            realUrl = platform.getPlatformUrl(url, referrer);
        }
        if (!realUrl) {
            return false;
        }
        var src = realUrl + CHNTPOC + '|' + menuCode;
        var c_iframe = $("<iframe id='c_iframe2' src='" + src + "' style='display:none'></iframe>");
        c_iframe.load(function () {
            if (callback){
                callback();
            }
        });
        $('body', thatDocument).find("#c_iframe2").remove();
        $('body', thatDocument).append(c_iframe);
    },
    location: function (url, menuCode) {
        platform.setMenuCode(menuCode, function () {
            window.location.href = url;
        });
    }
};
/*
	公用ajax 函数
*/
function ajax_req(params) {
    var loading;
    var def = {
        type: 'get',
        url: '',
        cache: false,
        async: true,
        timeout: 60000,
        dataType: 'json',
        contentType: 'application/json',
        headers: {
            "pid": getLocalInfo("pid"),
            "token": getLocalInfo("token")
        },
        beforeSend: function () {
            // loading = layer.load(2,{shade:0.5});
            //loading层
            loading = layer.load(1, { //icon支持传入0-2
                shade: [0.5, 'gray'], //0.5透明度的灰色背景
                content: '加载中...',
                success: function (layero) {
                    layero.find('.layui-layer-content').css({
                        'padding-top': '39px',
                        'width': '60px'
                    });
                }
            });
        },
        complete: function (xhr) {
            layer.close(loading);
            if (xhr.status == 401) {
                console.log(xhr);
                layer.msg("获取当前用户失败，请重新登录", {time: 2000}, function () {
                    ajaxJs.logout();//注销重新登陆
                });
            }
            if (xhr.responseText) {
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    //插入ie的字典缓存方法
                } else {
                    if (!xhr.responseText) return;
                    var responseObject = JSON.parse(xhr.responseText);
                    var dictCache = getLocalInfo('DICTDATA');
                    if ((!!responseObject && responseObject.callBack == 1) || ((dictCache.length < 1))) {
                        //更新本地数据字典缓存
                        dictDataCache();
                    }
                }
            }
        },
        error: function (err) {
            console.error(def);
            console.error('接口错误');
        }
    };
    $.extend(true, def, params);
    return $.ajax(def);
}

function isIE() {
    var userAgent = navigator.userAgent;
    if (!!window.ActiveXObject || "ActiveXObject" in window || (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera))
        return true;
    else
        return false;
}

/**获取本地缓存*/
function getLocalInfo(key) {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        return getParamValue(key);
    } else {
        if (window.localStorage) {
            return localStorage.getItem(key) ? localStorage.getItem(key) : '';
        } else {
            return getParamValue(key);
        }
    }
}

/**设置本地缓存 后台加密*/
function setLocalInfo(key, value) {
    if (!!window.ActiveXObject || "ActiveXObject" in window) {
        document.cookie = key + "=" + value + ";path=/;";
    } else {
        if (window.localStorage) {
            localStorage.setItem(key, value);
        } else {
            var d = new Date();
            d.setTime(d.getTime() + (1 * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = key + "=" + value + ";" + expires + ";path=/";
        }
    }
}

function getParamValue(paramName) {
    var arr = document.cookie.match(new RegExp("(^| )" + paramName + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return "";
}


//根据pid获取用户属性
function getUserInfo(name) {//获取用户信息字段
    var userInfo = getLocalInfo("pid");
    //解密
    userInfo = AES.decrypt(userInfo);
    if (userInfo) {
        var user = userInfo ? JSON.parse(userInfo) : {};
        if (name && user.uid && user[name]) {
            return user[name];
        }
    }
    return null;
}

function getUserData(name) {
    var userInfo = getLocalInfo(name);
    //解密
    userInfo = AES.decrypt(userInfo);
    if (userInfo) {
        var user = userInfo ? JSON.parse(userInfo) : {};
        return user;
    }
    return {};
}


// 获取query
function getQuery(string) {
    var search;
    if (string) {
        search = string
    } else {
        search = window.location.search
    }
    if (!search.length) {
        return {}
    }
    var arr = search.replace(/^\?/, '').split('&');
    if (!arr.length) {
        return {}
    }
    var query = {};
    for (var i = 0; i < arr.length; i++) {
        var elArr = arr[i].split('=');
        query[elArr[0]] = elArr[1]
    }
    return query
}

var ajaxJs = {
    logout: function () {
        setLocalInfo('pid', null);
        setLocalInfo('token', null);
        setLocalInfo('loginAccount', null);
        window.open(oaLoginUrl);//打开登录页
    }
};

// 加载字典数据到缓存
function dictDataCache() {
    ajax_req({
        url: baseUrl.sysdictdata.selectAllSysDictData,
        type: 'post',
        async: false,
        dataType: 'json',
        contentType: 'application/json',
        success: function (res) {
            if (res.resultStat == "SUCCESS") {
                setLocalInfo('DICTDATA', JSON.stringify(res.data));
            }
        },
        wrong: function (err) {
        }
    });
}