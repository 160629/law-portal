var paramObj = {};//检索参数对象
var moduleType ='lawsuitdeclare';
$(function () {
    loadStatus();//信息状态下拉框数据加载
    loadCaseLine();//所属专业线下拉框数据加载
    $('.ourLawsuitBodyNamePage').on('click', selectCompany); //选择争议主体
    $('.executiveArmPage').on('click', executiveArmPage); //选择所属公司
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询

    $("input[name='orgName']").val(getUserData('pid').CURRUSERORGNAME);//从pid获取当前登录人公司
    $("input[name='id']").val(getUserData('pid').CURRUSERUNITID);//从pid获取当前登录人公司Id
});
//选择所属公司
function executiveArmPage() {
        openSelectWindow.selectCompanyDepartTree({
            param: {flag: "1"},
            showLevel: 0,
            callback: function (res) {
                $("input[name=orgName]").val(res[0].val);
                $("input[name=type]").val(res[0].type);
                $("input[name=id]").val(res[0].id);
            }
        },{title:'选择所属公司'})
}
//选择我方诉讼主体
function selectCompany() {
    openSelectWindow.selectcompanyList({
        param: {flag:"1"},
        callback:function (res) {
            $("input[name=ourLawsuitBodyName]").val(res[0].bodyName);
        }
    },'选择我方诉讼主体')
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
        url: baseUrl.tIssueLawsuit.findTIssueLawsuitList,
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
                            "<td style='text-align:center'><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.lawsuitId + "' status='" + data.lawsuitStatus+ "'moduleName='" + data.moduleName
                            + "'title='" + data.lawsuitTitle + "'>" + data.lawsuitTitle + "</a></td>" +
                            "<td>" + data.lawsuitCode + "</td>" +
                            "<td>" + data.theyLawsuitBody + "</td>" +
                            "<td>" + data.ourLawsuitBodyName + "</td>" +
                            "<td>" + common.isSuffix(data.lawsuitMoney)+ "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_line",data.caseLine) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_type", data.caseType) + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_flow_status", data.lawsuitStatus) + "</td>" +
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
//列头状态数据加载
function loadStatus() {
    var dictKey = "sys_flow_status";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        status = $('select[name=lawsuitStatus]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        var key = value.dictValue;
        if ((key==20||key==30||key==50)){
            arr.push('<option value="'+ value.dictValue+'">'+ value.dictCabel + '</option>');
        }
    });
    status.html(arr.join(''));
}

// 所属专业线
function loadCaseLine() {
    var dictKey = "sys_case_line";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        caseLine = $('select[name=caseLine]');
    $.each(dictData, function (index, value) {
        arr.push('<option value="'+ value.dictValue+'">'+ value.dictCabel + '</option>');
    });
    caseLine.append(arr.join(''));
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