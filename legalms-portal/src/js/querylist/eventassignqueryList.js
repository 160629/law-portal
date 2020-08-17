var paramObj = {};//检索参数对象
var moduleType ='event_assign';
$(function () {
    //----------列表控件事件加载
    loadStatus();//信息状态下拉框数据加载
    loadCaseType();//案件类型下拉框数据加载
    loadAssignType();// 交办类型下拉框数据加载

    $('.mainSeedOrgPage').on('click', mainSeedOrgPage); //导出表格点击事件
    $('.assignOrgPage').on('click', assignOrgPage); //导出表格点击事件

    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询

});

//选择主送单位
function mainSeedOrgPage() {
    openSelectWindow.selectorgTree({
        param: {flag: "7"},
        showLevel: 0,
        isOrg: 1,//不能选父类节点
        callback: function (res) {
            console.log(res);
            $("input[name=mainSeedOrg]").val(res[0].val);
        }
    },{title:'选择主送单位'})
}
//选择转出单位
function assignOrgPage() {
    openSelectWindow.selectorgTree({
        param: {flag: "6"},
        callback: function (res) {
            console.log(res);
            $("input[name=assignOrg]").val(res[0].val);
        }
    },{title:'选择转出单位'})
}
//检索重置
function resetBtnFun() {
    $("#queryForm").reset_form();
    $(".querybtn").click();
}
//检索查询
function queryBtnFun(e) {
    paramObj = $.extend(paramObj,$("#queryForm").serializeJSON());

    if (!isEmpty(paramObj.startDate)) {
        paramObj.startDate = paramObj.startDate + " 00:00:00";
    }
    if (!isEmpty(paramObj.endDate)) {
        paramObj.endDate = paramObj.endDate + " 23:59:59";
    }
    paramObj.pageNum = 0;
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.count = param.count;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    ajax_req({
        url: baseUrl.caseAssign.findTCaseAssignList,
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
                            "<td><span style='text-align:center'><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.assignId + "' status='" + data.assignStatus+ "'moduleName='" + data.moduleName
                            + "'title='" + data.assignTitle + "'>" + data.assignTitle + "</a></td>" +
                            "<td>" + data.assignCode + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_assign_type", data.assignOrg) + "</td>" +
                            "<td>" + data.mainSeedOrg + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_type", data.caseType) + "</td>" +
                            "<td>" + dateFormat(data.createTime) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_flow_status", data.assignStatus) + "</td>" +
                            "</tr>";
                    }
                }
                if (!html){
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

//列头状态数据加载
function loadStatus() {
    var dictKey = "sys_flow_status";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        status = $('select[name=assignStatus]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        var key = value.dictValue;
        if ((key==20||key==30||key==50)){
            arr.push('<option value="'+ value.dictValue+'">'+ value.dictCabel + '</option>');
        }
    });
    status.html(arr.join(''));
}

//案件类型数据
function loadCaseType() {
    var dictKey = "sys_case_type";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        caseType = $('select[name=caseType]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        arr.push('<option value="', value.dictValue, '">', value.dictCabel, '</option>');
    });
    caseType.append(arr.join(''));
}

//交办类型数据
function loadAssignType() {
    var dictKey = "sys_assign_type";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        assignType = $('ul[name=assignType]');
    $.each(dictData, function (index, value) {
        arr.push('<li val="' + value.dictValue +  '"><p></p>' + value.dictCabel + '</li>');
    });
    assignType.append(arr.join(''));
}

//跳转到起草纠纷处理申报单页面
function jumpDisputeDraft(status, formId, moduleName) {

    //如果是空，去取当前用户角色，该访问的页面
    if (isEmpty(moduleName)){
        //如果是空，去取当前用户角色，该访问的页面
        var module = common.getModuleObj(moduleType);
        if (module[0]){
            moduleName = module[0].moduleName;
        } else{
            layer.msg("无访问权限！");
            return false;
        }
    }
    //去pageUrl匹配对应页面，默认拿编辑页，
    var path = pageUrl.getBusinessUrl(moduleName, "edit");
    var param = "?formId=" + formId + "&moduleName=" + moduleName;
    if (status > 10) {
        path = pageUrl.getBusinessUrl(moduleName, "view");
    }
    openFullWindow(path + param, {
        closed: function () {
            paging("pageContainer", "loadData", paramObj);
        }
    });
}
