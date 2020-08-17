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
    $(".left a").on("click", function () {
        var html = $(this).html();
        $("input[name=flowId]").val(html);
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
    
    paramObj.displayName = paramObj.actId;
    delete(paramObj["actId"]);

    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    // console.log(param)
    ajax_req({
        url: baseUrl.quickaccess.selectOrgInFuickAccess,
        type: 'post',
        data: JSON.stringify(pageData),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    // console.log(rs.data)
                    pageData.count = rs.data.total;
                    pageData.pageNum = rs.data.pageNum;
                    pageData.pageSize = rs.data.pageSize;
                    var i = ((rs.data.pageNum - 1) * rs.data.pageSize) + 1;
                    for (var index in rs.data.list) {
                        var data = rs.data.list[index];
                        data = nullFormatStr(data);
                        html += "<tr>" +
                            "<td><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.id + "' flowId='" + data.flowId + "' >" + data.flowId + "</a></td>" +
                            "<td>" + data.iconImg + "</td>" +
                            "<td>" + data.displayName + "</td>" +
                            "<td>" + data.moduleName + "</td>" +
                            "<td>" + data.flowStartAct + "</td>" +
                            "<td type='" + data.openType + "'>" + (data.openType == 1 ? '弹出' : '重定向') + "</td>" +
                            "<td type='" + data.pageKey + "'>" + (data.pageKey == 'edit' ? '编辑' : '列表') + "</td>" +
                            "<td type='" + data.isJiyuehua + "'>" + (data.isJiyuehua == 0 ? '非集约化' : (data.isJiyuehua == 1 ? '集约化' : '没有配置')) + "</td>" +
                            "<td><a href='#' class='del-link' id='" + data.id + "' flowId='" + data.flowId + "'>删除</a></td>" +
                            "</tr>";
                    }
                }
                if (!html) {
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //跳转到详情页
                $('#bus-table .title-link').on('click', function () {
                    var flowId = $(this).attr("flowId").trim();
                    var id = $(this).attr('id').trim();
                    var detailsObj = {
                        flowId: $(this).parents('tr').children('td').eq(1).children('a').html(),
                        iconImg: $(this).parents('tr').children('td').eq(2).html(),
                        displayName: $(this).parents('tr').children('td').eq(3).html(),
                        moduleName: $(this).parents('tr').children('td').eq(4).html(),
                        flowStartAct: $(this).parents('tr').children('td').eq(5).html(),
                        openType: $(this).parents('tr').children('td').eq(6).html(),
                        pageKey: $(this).parents('tr').children('td').eq(7).html(),
                        isJiyuehua: $(this).parents('tr').children('td').eq(8).attr('type')
                    }
                    localStorage.setItem('detailsObj', JSON.stringify(detailsObj));
                    localStorage.setItem('isDelete', 'no');
                    jumpDetails("&flowId=" + flowId + "&id=" + id + "");
                });
                $('#bus-table .del-link').on('click', function () {
                    var id = $(this).attr("id");
                    delDataFun({ id: id });
                });
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
        ajax_req({
            url: baseUrl.quickaccess.deleteFuickAccess,
            type: 'post',
            data: JSON.stringify(idList),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    paging("pageContainer", "loadData", paramObj);
                    layer.msg("删除成功", { time: 1000 });
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
    });
}
//------------点击事件
//导出表格点击事件
function Exportexsel() {
    // Export()
}

//跳转连接
function jumpDetails(param) {
    // var path = pageUrl.activitypower.activitypowerEdit + "?1=1" + param;
    var path = pageUrl.quickaccess.quickaccessEdit + "?1=1" + param;
    // console.log(path)
    // window.location.href = path;
    if ($(this).attr('class') == 'declarationBtn') {
        localStorage.removeItem('detailsObj');
    }
    window.history.pushState(null, null, path);
    layer.open(
        {
            type: 2, //此处以iframe举例
            area: ['980px', '570px'],
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