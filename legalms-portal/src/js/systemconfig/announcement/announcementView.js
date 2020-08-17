$(function () {
    init();

    //关闭弹出框
    $('#alertCancelBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });
});
<!--初始化页面-->
function init(){
    <!--查询当前公告的详情-->
    var announcementId= window.location.href.split("?")[1].split("=")[1];
    ajax_req({
        url: baseUrl.announcement.selannouncementById+"?id="+announcementId,
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        //data: JSON.stringify(params),
        success: function (rs) {

            if (rs.resultStat == "SUCCESS") {
                var result = rs.data;
                $("#announcementName").html(result.announcementName);
                $("#announcementTime").html(result.announcementCreatetime);
                $("#announcementContent").html(result.announcementContent.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;'));
                $("#announcementType").html(result.announcementTypeid == 1 ? '系统公告' : result.announcementTypeid == 2 ? '消息公告' : '');
                getFiles(result.announcementId);
            } else {
                layer.alert('删除信息失败，请联系管理员', {
                    icon: 2,
                    title: "提示"
                });
            }
        }, error: function (e) {
            layer.alert('删除信息失败，请联系管理员', {
                icon: 2,
                title: "提示"
            });
        }
    });
}
<!--查询附件信息-->
function getFiles(primaryKey){
    ajax_req({
        url: baseUrl.file.selectFile+"?fileShareBusinessKey="+primaryKey+"&shareType=announcement",
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        //data: JSON.stringify(params),
        success: function (rs) {

            if (rs.resultStat == "SUCCESS") {
                console.log(rs)
                var result = rs.data;
                result.forEach(function(item) {
                    $('#activeFiles').append("<a download=\""+item.file_name+"\" href=\""+item.file_http_url+"\"style='color: #0099CC;margin-left: 10px'>"+item.file_name+ "</a>")
                });
            } else {
                layer.alert('删除信息失败，请联系管理员', {
                    icon: 2,
                    title: "提示"
                });
            }
        }, error: function (e) {
            layer.alert('删除信息失败，请联系管理员', {
                icon: 2,
                title: "提示"
            });
        }
    });
}

function downLoadMethod(saveName,url) {
    // for ie 10 and later
    if (window.navigator.msSaveBlob) {
        try {
            window.navigator.msSaveBlob(url, downloadFileName);
        }
        catch (e) {
            console.log(e);
        }
    }
    // 谷歌浏览器 创建a标签 添加download属性下载
    else {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window.MouseEvent) {
            event = new MouseEvent('click');
        }
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
}