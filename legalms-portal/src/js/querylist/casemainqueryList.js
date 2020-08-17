var paramObj={deleteStatus:0};//检索参数对象
$(function () {
    //列表控件事件加载
    loadStatus();//信息状态下拉框数据加载
    loadCaseDeputeType();//案件类型下拉框数据加载
    loadCaseSpecialLine();//所属专业线
    $(".involvedOrgPage").on("click", involvedOrgPage);
    $('.ourLawsuitBodyNamePage').on('click', selectCompany); //选择争议主体
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询
    $("ul[name=caseStatus]").on('click', 'li', 'caseStatus',queryBtnFun);//状态列表查询

    $("input[name='involvedOrgName']").val(getUserData('pid').CURRUSERORGNAME);//从pid获取当前登录人公司
    $("input[name='id']").val(getUserData('pid').CURRUSERUNITID);//从pid获取当前登录人公司Id
});

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

//涉案单位/部门选择
function involvedOrgPage() {
    openSelectWindow.selectCompanyDepartTree({
        param: {flag: "1"},
        showLevel: 0,
        callback: function (res) {
            $("input[name=involvedOrgName]").val(res[0].val);
            $("input[name=type]").val(res[0].type);
            $("input[name=id]").val(res[0].id);
        }
    },{title:'选择涉案单位/部门'})
}

//列表数据加载2
function loadData(param) {
    var pageData = param;
    pageData.count = param.count;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    ajax_req({
        url: baseUrl.caseMain.selectAllCaseMainByDept,
        type: 'post',
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
                            "<td><span style='text-align:center'></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='"+data.caseId+"'>" + data.caseTitle + "</a></td>" +
                            "<td>" + data.caseCode + "</td>" +
                            "<td>" + data.otherLawsuitBody + "</td>" +
                            "<td>" + data.ourLawsuitBodyName + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_type",data.deputeType) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_line",data.caseSpecialLine) + "</td>" +
                            "<td>" + common.isSuffix(data.caseDeputeMoney) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_status",data.caseStatus) + "</td>" +
                            "</tr>";
                    }
                }
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //打开业务表单页面
                $('#bus-table .title-link').on('click', function () {
                    var formId = $(this).attr("id");
                    jumpDisputeDraft(status, formId);
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
//列头状态数据加载
function loadStatus() {
    var dictKey = "sys_case_status";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        status = $('select[name=caseStatus]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        var key = value.dictValue;
        if ((key==2||key==3)){
            arr.push('<option value="'+ value.dictValue+'">'+ value.dictCabel + '</option>');
        }
    });
    status.html(arr.join(''));
}

// 案件类型下拉框数据
function loadCaseDeputeType() {
    var dictKey = "sys_case_type";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        deputeType = $('select[name=deputeType]');
    $.each(dictData, function (index, value) {
        arr.push('<option value="'+ value.dictValue+'">'+ value.dictCabel + '</option>');
    });
    deputeType.append(arr.join(''));
}
// 所属专业线
function loadCaseSpecialLine() {
    var dictKey = "sys_case_line";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        caseSpecialLine = $('select[name=caseSpecialLine]');
    $.each(dictData, function (index, value) {
        arr.push('<option value="'+ value.dictValue+'">'+ value.dictCabel + '</option>');
    });
    caseSpecialLine.append(arr.join(''));
}
function selectCompany() {
    openSelectWindow.selectcompanyList({
        param: {flag:"1"},
        callback:function (res) {
            $("input[name=ourLawsuitBodyName]").val(res[0].bodyName);
        }
    },{title:'选择我方诉讼主体'})
}

//跳转到起草案件卷宗页面
function jumpDisputeDraft(status, formId) {
    if (!isEmpty(formId)) {
        var path = pageUrl.caseManage.view;
        var param = "?caseId=" + formId;

        openFullWindow(path + param, {
            closed: function () {
                paging("pageContainer", "loadData", paramObj);
            }
        });
    }
}
