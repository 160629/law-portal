var paramObj = {
    viewStatus: 1,
    pageNum: 1,
    pageSize: 10
};

$(function () {
    //列表控件事件加载
    selectTypes(1);//   已阅类型

    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询

    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);
});

//检索重置
function resetBtnFun() {
    $("#queryForm").reset_form();
    $(".querybtn").click();
}

//检索查询
function queryBtnFun(e) {
    paramObj = $.extend(paramObj,$("#queryForm").serializeJSON());

    if (!isEmpty(paramObj.startTime)) {
        paramObj.startTime = (paramObj.startTime) + " 00:00:00";
    }
    if (!isEmpty(paramObj.endTime)) {
        paramObj.endTime = (paramObj.endTime) + " 23:59:59";
    }
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

function selectTypes(viewStatus) {
    ajax_req({
        url: baseUrl.TFlowUnvie.selectViewTypes,
        type: 'get',
        async: false,
        data: {"viewStatus":viewStatus},
        success: function (rs) {
            if (rs.resultStat == "SUCCESS" && rs.data) {
                types=rs.data;
                var $select = $('select[name=viewType]');
                $select.empty();
                $select.append('<option value="">全部</option>');
                $.each(types, function (index, value) {
                    $select.append('<option value="' + value + '">' + value + '</option>');// 下拉菜单里添加元素
                });
            }
        }
    });
}

//列表数据加载
function loadData(param) {
    param.toerId = getLocalInfo('loginAccount');
    var pageData = param;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;

    paramObj.pageNum = pageData.pageNum;
    paramObj.pageSize = pageData.pageSize;
    ajax_req({
        url: baseUrl.TFlowUnvie.selectAll,
        type: 'post',
        async: false,
        data: JSON.stringify(pageData),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    pageData.count = rs.data.total;
                    pageData.pageNum = rs.data.pageNum;
                    var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                    var i = ((pageData.pageNum - 1) * pageData.pageSize) + 1;
                    for (var index in rs.data.list) {
                        var data = rs.data.list[index];
                        data = nullFormatStr(data);
                        var time = data.toerTime;
                        var formatTime = time.replace(pattern, '$1-$2-$3 $4:$5:$6');
                        html += "<tr>" +
                            "<td>" + (i++) + "</td>" +
                            "<td><a href='#' class='title-link' title ='" + data.viewTitle + "' viewUrl = '"
                            + data.viewUrl + "' viewId = '" + data.viewId + "'>" + data.viewTitle + "</a></td>" +
                            "<td>" + data.viewType + "</td>" +
                            "<td>" + data.loginName + "</td>" +
                            "<td>" + dateFormat(formatTime) + "</td>" +
                            "</tr>";
                    }
                }
                // $("#done_total").html(pageData.count);//加载数量
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //打开业务表单页面
                $('#bus-table .title-link').on('click', function () {
                    var viewId = $(this).attr("viewId");
                    var title =  $(this).attr("title");
                    jumpDetails(title,viewId,function () {
                        // paging("pageContainer", "loadData", paramObj);
                    });
                });
            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
    return pageData;
}

//------------点击事件
//导出表格点击事件
function Exportexsel() {
    // Export()
}

//--------列表基础信息加载
//跳转连接
function jumpDetails(title,viewId,endFun) {

    var path = pageUrl.unview.view;
    var param = "?formId=" + viewId;

    layer.open(
        {
            type: 2, //此处以iframe举例
            title: title,
            area:['840px','420px'],
            shade: 0.1,
            content: path + param,
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            },end : function(){
                if (endFun){
                    endFun()
                }
            }
        })
}