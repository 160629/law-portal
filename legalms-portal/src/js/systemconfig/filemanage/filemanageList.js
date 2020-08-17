var paramObj = {
    pageSize: 50
};//检索参数对象
$(function () {
    //列表控件事件加载
    $('.declarationBtn').on('click', jumpDetails); //创建表单
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".table-del-btn").on("click", delBtnFun);//删除
    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询

    $("input[name=shareType]").val("reference");
    $(".left a").on("click", function () {
        var html = $(this).html();
        $("input[name=formId]").val(html);
    });

    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);
});

//删除
function delBtnFun() {
    var idList = [];
    $("#bus-table tbody input[type='checkbox']:checked").each(function () {
        idList.push({ flowId: $(this).val(), caseId: $(this).val() });
        delDataFun(idList);//执行删除请求
    });
}
//检索重置
function resetBtnFun() {
    $("#queryForm").reset_form();
    $(".querybtn").click();
}
//检索查询
function queryBtnFun(e) {
    paramObj = $.extend(paramObj, $("#queryForm").serializeJSON());
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    // console.log(param)
    ajax_req({
        url: baseUrl.file.selectFile,
        type: 'get',
        data: "fileShareBusinessKey=" + param.formId + "&shareType=" + param.shareType,
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    // console.log(rs.data)
                    pageData.count = rs.data.total;
                    pageData.pageNum = rs.data.pageNum;
                    pageData.pageSize = rs.data.pageSize;
                    var i = 1;
                    for (var index in rs.data) {
                        var data = rs.data[index];
                        data = nullFormatStr(data);
                        html += "<tr>" +
                            "<td><span><input type='checkbox' id='" + data.file_id + "' name='checkbox' class='checkboxipt' />" +
                            "<input type='hidden' value='"+JSON.stringify(data)+"'></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td>" + data.file_share_business_key + "</td>" +
                            "<td>" + data.file_share_type + "</td>" +
                            "<td><a href='#' class='title-link' id='" + data.file_id + "' flowId='" + data.file_share_id + "' >" + data.file_name + "</a></td>" +
                            "<td>" + data.file_extension + "</td>" +
                            "<td>" + data.file_http_url + "</td>" +
                            "</tr>";
                    }
                }
                if (!html) {
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //跳转到详情页
            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
    return pageData;
}

function delDataFun(idList) {
    layer.confirm("确定删除选中的信息吗？", { btn: ['确定', '取消'], title: "提示" }, function () {
        $.each(idList,function (i,id) {
            uploadFile.requestDelFile(id,function (){
                paging("pageContainer", "loadData", paramObj);
            })
        });
    });
}
//------------点击事件
//导出表格点击事件
function Exportexsel() {
    // Export()
}

//跳转连接
function jumpDetails(param) {
    var path = pageUrl.filemanage.filemanageEdit + "?1=1" + param;
    layer.open(
        {
            type: 2, //此处以iframe举例
            area: ['980px', '370px'],
            shade: 0.1,
            content: path + param,
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            }, end: function () {
                paging("pageContainer", "loadData", paramObj);
            }
        })
}