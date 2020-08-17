var baseUrl = 'http://10.236.9.153';//测试
baseUrl = 'http://10.236.9.150';//测试
// var baseUrl = 'http://10.236.0.77';//开发环境
// var baseUrl = 'http://192.168.3.16';http://10.236.0.92/group1/M00/00/05/CuwJnFxHFLmAes6lAAAkD8sEYv8781.jpg

var baseUrl = 'http://10.236.9.150';//测试
// var baseUrl = 'http://10.236.0.77';//开发环境
// var baseUrl = 'http://192.168.3.16';
var VSNUM = 'version=201911079999';//版本号
var fileUrl = 'http://10.236.9.156/';
// var editUserInfoUrl = 'http://10.124.131.213:8081/updateUcUserMessge';//修改用户信息--调中心
var editUserInfoUrl = 'http://10.236.11.156/sso/modifyUserInfo/toPage';//修改用户信息--调中心
var changePasswordUrl = 'http://10.124.131.213:8081/updateUcUserPassword';//修改密码--调中心
var pcm = '/pcm', pbm = '/pbm', ucenter = '/ucenter', site = '/site', ddc = '/ddc', taskquery = '/taskquery',
    appcenter = "/appcenter", ctools = "/ctools", sms = "/sms", flowquery = '/flowquery', wslc = '/wslc';
//ucenter = '';
var URLS = {
    loginPic: pbm + '/loginPic/opi/list'
};

function getiebanben() {
    var browser = navigator.appName ? navigator.appName : '';
    var b_version = navigator.appVersion ? navigator.appVersion : '';
    var version = b_version.split(";");
    var trim_Version = '';
    if (version.length >= 2) {
        trim_Version = version[1].replace(/[ ]/g, "");
    }
    if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE6.0") {
        return true;
    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE7.0") {
        return true;
    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE8.0") {
        return true;
    } else if (browser == "Microsoft Internet Explorer" && trim_Version == "MSIE9.0") {
        return true;
    } else {
        return false;
    }
}

/**公共url */
var publicUrl = {
    proposalUrl: '/modules/portal/helpcenter.html?version=201911079999',//建议反馈
    aboutPortalUrl: 'jacascript::void(0)',//关于智慧门户
    helpCenterUrl: "jacascript::void(0)",//帮助中心
    overView: 'http://10.249.216.55:8021/cloudleader',//'http://10.249.214.14:8101/cloudleader',//getiebanben()?'http://val1.portal.unicom.local:8099/dss_new3/Login!input.action':'http://10.249.216.55:8021/cloudleader',//经分
    overViewIE: 'http://val1.portal.unicom.local:8099/dss_new3/Login!input.action',
    // tongxunlu: 'http://www.portal.unicom.local/unisapptongxunhrlu',//'http://sit5.portal.unicom.local:89/unisapptongxunhrlu',,//不根据组织id跳转
    tongxunlu: 'http://10.236.11.156/sso/', //不根据组织id跳转
    tongxunlu1: 'http://www.portal.unicom.local/unisapptongxunhrlu/0/default/tongxunluuser/tourl/?orgid=00695356478',//根据组织id跳转
    forgetpassword: 'http://10.124.131.213:8081/findPassword'
};