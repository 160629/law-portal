var paramObj = {
    pageSize: 50,
    count: 1
};//检索参数对象
$(function () {
    //列表控件事件加载
    $('.declarationBtn').on('click', jumpDetails); //创建表单
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询
    $(".left a").on("click", function () {
        var html = $(this).html();
        $("input[name=flowId]").val(html);
    });

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
    paramObj = $.extend(paramObj, $("#queryForm").serializeJSON());

    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

function getCount(param) {
    param.pageNum = 1;
    ajax_req({
        url: baseUrl.processtemplate.selectOrgInProcesstemplate,
        type: 'post',
        data: JSON.stringify(param),
        success: function (rs) {
            localStorage.setItem("newCount", rs.data.total);;
        }
    });
};

getCount(paramObj);

//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.count = localStorage.getItem("newCount") || param.count;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    ajax_req({
        url: baseUrl.processtemplate.selectOrgInProcesstemplate,
        type: 'post',
        data: JSON.stringify(pageData),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                console.log(rs.data.list)
                if (rs.data != null) {
                    pageData.count = rs.data.total;
                    pageData.pageNum = rs.data.pageNum;
                    pageData.pageSize = rs.data.pageSize;
                    var i = ((rs.data.pageNum - 1) * rs.data.pageSize) + 1;
                    for (var index in rs.data.list) {
                        var data = rs.data.list[index];
                        data = nullFormatStr(data);
                        html += "<tr>" +
                            "<td><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' id = '" + data.id + "' class='title-link' flowId='" + data.flowId + "'  beginId = '" + data.beginId + "' endId = '" + data.endId + "' '>" + data.flowId + "</a></td>" +
                            "<td>" + data.beginId + "</td>" +
                            "<td>" + data.beginName + "</td>" +
                            "<td>" + data.endId + "</td>" +
                            "<td>" + data.endName + "</td>" +
                            "<td type='" + data.condition + "'>" + isCondition(data.condition) + "</td>" +
                            "<td type='" + data.hidden + "' >" + (data.hidden == 0 ? '不隐藏' : '隐藏') + "</td>" +
                            "<td type='" + data.isMut + "'>" + (data.isMut == 0 ? '单选' : '多选') + "</td>" +
                            "<td type='" + data.importantLevel + "'>" + (data.importantLevel === 'share' ? '简单支撑决策' : (data.importantLevel == 'normal' ? '一般支撑决策' : '重大支撑决策')) + "</td>" +
                            "<td type='" + data.isCountersign + "'>" + (data.isCountersign == 0 ? '否' : '是') + "</td>" +
                            "<td type='" + data.handoverLevel + "'>" + (data.handoverLevel == 'share' ? 'share' : (data.handoverLevel == '02' ? '省份标志' : '地市标志')) + "</td>" +
                            "<td type='" + data.isReturn + "'>" + (data.isReturn == 0 ? '不是' : '是') + "</td>" +
                            "<td type='" + data.versionId + "'>" + data.versionId + "</td>" +
                            "<td><a href='#' class='del-link' id = '" + data.id + "' status='" + data.flowId + "'del='" + data.flowId + ";" + data.beginId + ";" + data.endId + "'>删除</a></td>" +
                            "</tr>";
                    }
                }
                if (!html) {
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //打开业务表单页面
                $('#bus-table .title-link').on('click', function () {

                    var flowId = $(this).attr("flowId").trim();
                    var id = $(this).attr('id');
                    var detailsObj = {
                        flowId: $(this).parents('tr').children('td').eq(1).children('a').html(),
                        beginId: $(this).parents('tr').children('td').eq(2).html(),
                        beginName: $(this).parents('tr').children('td').eq(3).html(),
                        endId: $(this).parents('tr').children('td').eq(4).html(),
                        endName: $(this).parents('tr').children('td').eq(5).html(),
                        condition: $(this).parents('tr').children('td').eq(6).html(),
                        hidden: $(this).parents('tr').children('td').eq(7).attr('type'),
                        isMut: $(this).parents('tr').children('td').eq(8).html(),
                        isCountersign: $(this).parents('tr').children('td').eq(10).html(),
                        importantLevel: $(this).parents('tr').children('td').eq(9).html(),
                        handoverLevel: $(this).parents('tr').children('td').eq(11).html(),
                        isReturn: ($(this).parents('tr').children('td').eq(12).html() == "不是" ? "否" : "是"),
                        versionId: $(this).parents('tr').children('td').eq(13).html(),
                        id: $(this).attr('id')
                    }

                    localStorage.setItem('detailsObj', JSON.stringify(detailsObj));
                    localStorage.setItem('isDelete', 'no');
                    jumpDetails("&flowId=" + flowId + "&id=" + id + "");

                });
                $('#bus-table .del-link').on('click', function () {
                    delDataFun({ id: $(this).attr('id') });
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
    console.log(idList)
    layer.confirm("确定删除选中的信息吗？", { btn: ['确定', '取消'], title: "提示" }, function () {
        ajax_req({
            url: baseUrl.processtemplate.deleteProcesstemplate,
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
function jumpDetails() {
    var path = pageUrl.processtemplate.processtemplateEdit;

    if ($(this).attr('class') == 'declarationBtn') {
        localStorage.removeItem('detailsObj');
    }

    layer.open(
        {
            type: 2, //此处以iframe举例
            area: ['980px', '570px'],
            shade: 0.1,
            content: path,
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            }, end: function () {
                paging("pageContainer", "loadData", paramObj);
            }
        })
}

//条件限制判断
function isCondition(conType) {
    if (conType == 0) {
        return "不限制";
    } else if (conType == 10) {
        return "省限制";
    } else if (conType == 10) {
        return "省限制";
    } else if (conType == 1) {
        return "同公司限制";
    } else if (conType == 3) {
        return "同部门限制";
    } else if (conType == 4) {
        return "同处室限制";
    } else if (conType == 8) {
        return "送分办部门领导限制";
    } else if (conType == 5) {
        return "返回经办";
    } else if (conType == 6) {
        return "送结束";
    } else if (conType == 7) {
        return "退回承办人";
    } else if (conType == 1002) {
        return "总送省限制";
    } else if (conType == 2003) {
        return "省送地限制";
    } else if (conType == 3002) {
        return "地送省限制";
    } else if (conType == 2001) {
        return "省送总限制";
    } else if (conType == 11) {
        return "协办部门限制";
    } else if (conType == 12) {
        return "各流程涉及回退节点限制";
    } else if (conType == 13) {
        return "送申报人确认限制";
    } else if (conType == "14") {
        return "送前某活动转办人限制";
    } else if (conType == 15) {
        return "法律文书执行部门限制";
    } else if (conType == 2003) {
        return "省份送地市限制取拟稿人公司";
    } else {
        return conType;
    }
}