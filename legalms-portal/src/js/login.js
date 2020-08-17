$(function() {
    login();
});
function login() {
    var urlData = getQuery();
    var userInfo = getUserData('pid');
    var token = getLocalInfo("token");
    if (!isEmpty(userInfo)) {

        if (urlData.token && urlData.token == token) {
            //如果传了token，并且和缓存里的一样
            if (urlData.loginName == userInfo.LOGINACCT) {
                //如果当前登录名和缓存里的也一样的话就走缓存，否则跳过判断走模拟登录
                return true;
            }
        }
        if (urlData.loginName == null && userInfo.LOGINACCT) {
            //如果没传登录名，没法做登录操作，从缓存里取（在实际页面如果使用的token的没有或失效了会重新登录）-自己的系统里页面链接地址没有参数
            return true;
        }
    }
    if (!isEmpty(urlData) && urlData.token && urlData.loginName) {

        $.ajax({
            url: baseUrl.index.reqEncryptUserMsg,
            type: 'get',
            async: false,
            cache: false,
            headers: {
                'pid': '',
                'accessIpAddr': '',
                'loginAcct': '',
                'token': urlData.token,
                'loginAccount': urlData.loginName
            },
            success: function (res) {

                if (res.resultStat == "SUCCESS") {

                    setLocalInfo('pid', res.data.decryptUser);
                    var userInfo = getUserData('pid');
                    setLocalInfo('token', urlData.token);
                    setLocalInfo('loginAccount', urlData.loginName);

                }
            },
            complete: function (xhr) {
                if (xhr.status == 200) {
                    // console.info('登录成功');
                } else if (xhr.status == 401) {
                    console.log(xhr);
                    setLocalInfo('pid', null);
                    setLocalInfo('token', null);
                    setLocalInfo('loginAccount', null);
                    layer.msg("获取当前用户失败，请重新登录", {
                        time: 2000
                    }, function () {
                        ajaxJs.logout();//注销重新登陆
                    });
                } else {
                    // console.log(xhr)
                    layer.msg("获取当前用户失败，请重新登录", {
                        time: 2000
                    }, function () {
                        ajaxJs.logout();//注销重新登陆
                    });
                }
            }
        });
    }else{
        layer.msg("获取登录用户信息失败！");
    }
}