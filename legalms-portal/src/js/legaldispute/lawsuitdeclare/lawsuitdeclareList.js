var paramObj = {};//检索参数对象
var moduleType = 'lawsuitdeclare';
$(function () {
    loadStatus();//信息状态下拉框数据加载
    loadCaseType();//案件类型下拉框数据加载

    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件

    $('.ourLawsuitBodyNamePage').on('click', selectCompany); //选择争议主体
    $('.declarationBtn').on('click', jumpDisputeDraft); //创建表单
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".table-del-btn").on("click", delBtnFun);//删除
    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询

    //默认加载列表数据
    paging("pageContainer", "loadData", {});
});

//删除
function delBtnFun() {
    var idList = [];
    $("#bus-table tbody input[type='checkbox']:checked").each(function () {
        var status = $(this).attr("status");
        if (!isEmpty(status) && status == "10") {
            idList.push($(this).val());
            delDataFun(idList);//执行删除请求
        } else {
            layer.msg("仅可删除【未提交】状态的单据！");
        }
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

    if (!isEmpty(paramObj.startDate)) {
        paramObj.startDate = paramObj.startDate + " 00:00:00";
    }
    if (!isEmpty(paramObj.endDate)) {
        paramObj.endDate = paramObj.endDate + " 23:59:59";
    }
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}
//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.count = param.count;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    ajax_req({
        url: baseUrl.tIssueLawsuit.findTIssueLawsuit,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(pageData),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    pageData.count = rs.data.total;
                    pageData.pageNum = rs.data.pageNum;
                    pageData.pageSize = rs.data.pageSize;
                    var i = ((rs.data.pageNum - 1) * rs.data.pageSize) + 1;
                    for (var index in rs.data.list) {
                        var data = rs.data.list[index];
                        data = nullFormatStr(data);
                        html += "<tr>" +
                            "<td><span><input type='checkbox' status='" + data.lawsuitStatus + "'value='" + data.lawsuitId + "' name='checkbox' class='checkboxipt' /></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.lawsuitId + "' status='" + data.lawsuitStatus + "'moduleName='" + data.moduleName
                            + "'title='" + data.lawsuitTitle + "'>" + data.lawsuitTitle + "</a></td>" +
                            "<td>" + data.lawsuitCode + "</td>" +
                            "<td>" + data.theyLawsuitBody + "</td>" +
                            "<td>" + data.ourLawsuitBodyName + "</td>" +
                            "<td>" + common.isSuffix(data.lawsuitMoney) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_type", data.caseType) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_flow_status", data.lawsuitStatus) + "</td>" +
                            "</tr>";
                    }
                }
                if (!html) {
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);

                $('#bus-table .title-link').on('click', function () {
                    var formId = $(this).attr("id");
                    var status = $(this).attr("status");
                    var moduleName = $(this).attr("moduleName");
                    jumpDisputeDraft(status, formId, moduleName);
                });

            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
    return pageData;
}
//导出表格点击事件
function Exportexsel() {
    // Export()
}
function delDataFun(idList) {
    layer.confirm("确定删除选中的信息吗？", { btn: ['确定', '取消'], title: "提示" }, function () {
        ajax_req({
            url: baseUrl.tIssueLawsuit.deleteTIssueLawsuit,
            type: 'post',
            data: JSON.stringify(idList),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    $(".querybtn").click();
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

//列头状态数据加载
function loadStatus() {
    var dictKey = "sys_flow_status";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        status = $('select[name=status]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        arr.push('<option value="' + value.dictValue + '">' + value.dictCabel + '</option>');
    });
    status.html(arr.join(''));
}

//启动诉讼程序数据加载
function loadCaseType() {
    var dictKey = "sys_case_type";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        caseType = $('ul[name=caseType]');
    $.each(dictData, function (index, value) {
        arr.push('<li val="' + value.dictValue + '"><p></p>' + value.dictCabel + '</li>');
    });
    caseType.append(arr.join(''));
}

function selectCompany() {
    openSelectWindow.selectcompanyList({
        param: { flag: "1" },
        callback: function (res) {
            $("input[name=ourLawsuitBodyName]").val(res[0].bodyName);
        }
    }, { title: '选择我方诉讼主体' })
}
//跳转到起草纠纷处理申报单页面
function jumpDisputeDraft(status, formId, moduleName) {

    //如果是空，去取当前用户角色，该访问的页面
    if (isEmpty(moduleName)) {
        //如果是空，去取当前用户角色，该访问的页面
        var module = common.getModuleObj(moduleType);
        if (module[0]) {
            moduleName = module[0].moduleName;
        } else {
            layer.msg("无访问权限！");
            return false;
        }
    }
    //去pageUrl匹配对应页面，默认拿编辑页，
    var path = pageUrl.getBusinessUrl(moduleName, "edit");
    var param = "?formId=" + formId + "&moduleName=" + moduleName;
    if (status > 10) {
        path = pageUrl.getBusinessUrl(moduleName, "view");
        param = param + "&source=create";
    }
    openFullWindow(path + param, {
        closed: function () {
            paging("pageContainer", "loadData", paramObj);
        }
    });
}
