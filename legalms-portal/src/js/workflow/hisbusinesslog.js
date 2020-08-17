$(function () {

    $('#closebtn').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

});
//暴露给父页面的回调函数
function child(paramData) {
    requestAjax(paramData);

}

//请求历史日志查询接口
function requestAjax(paramData) {
    ajax_req({
        url: baseUrl.businessLog.selectBusinessLog,
        type: 'post',
        data: JSON.stringify({
            approveItemId:paramData.param.formId
        }),
        success: function (res) {
            if (res.resultStat == "SUCCESS" && res.data != null) {
                mainContentHtml(res.data)
            }else{
                parent.layer.close(index);
                paramData.callback(res)
            }
        }
    });
}
//拼接组装意见html内容
function mainContentHtml(datas) {
    var htmls = [];
    $.each(datas,function (i,data) {
        htmls.push( "<li class='main-content-li'>" +
            "            <div class='layui-row'>" +
            "                <div class='layui-col-md12'>" +
            "                    <label class='layui-form-label'>" + data.deptName + "</label>" +
            "                    <div class='layui-input-block'>&nbsp;&nbsp;" +
            "                        " + data.loginName + "&nbsp;&nbsp;&nbsp;&nbsp;<span>" + dateFormat(data.updateTime) +
            "                    </span></div>" +
            "                </div>" +
            "            </div>" +
            "            <div class='layui-row'>" +
            "                <div class='layui-col-md12'>" +
            "" +
            "                    <textarea class='connect borderNone' readonly >"+data.businessField1+"</textarea>" +
            "                </div>" +
            "            </div>" +
            "            <div class='layui-row'>" +
            "                <div class='layui-col-md12'>" +
            "                    <label class='layui-form-label'>附件：</label>"
                               +filesHtml(data.files)+
            "                </div>" +
            "            </div>" +
            "        </li>");
            
    });
    $("#main-content").html(htmls.join(""));

    $('.uploadlist a').on("click", function () {
        var url = $(this).attr("fileUrl");
        var fileName = $(this).html();
        uploadFile.downloadFile(url, fileName);
    });
}
//拼接组装附件html内容
function filesHtml(files) {
    var fileHtml = [];
    var filesHtml = " ";
    if (files){
        $.each(files, function (i, file) {
            fileHtml.push("<li><a href='#' fileUrl='" + baseUrl.file.filedown + "?path=" + encodeURIComponent(file.file_http_url) + "&fileName=" +
            encodeURIComponent(file.file_name + "." + file.file_extension) + "' title='" + file.file_name + "' class='fileDown'>" + file.file_name + "." + file.file_extension + "</a></li>");
        });
    }
    if (fileHtml.length > 0) {
        filesHtml = "<div class='layui-input-block'>" +
        "<ul class='uploadlist'>" + fileHtml.join("") +
        "</ul> </div>";
    }
    return filesHtml;
}