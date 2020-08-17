var paramObj={deleteStatus:0};//检索参数对象
$(function () {
    //列表控件事件加载
    loadStatus();//信息状态下拉框数据加载
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $('.declarationBtn').on('click', jumpDisputeDraft); //创建表单
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询
    $("ul[name=caseStatus]").on('click', 'li', 'caseStatus',queryBtnFun);//状态列表查询
    $(".table-export-btn").on("click",expBtnFun);//导出

    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);
});
//导出
function expBtnFun() {
    //let url = "http://123.126.34.157:1189/gateway/LEGALMS-CASE-SERVICE/v1/casetransfer/getExcelDate";
    var url = baseUrl.caseTransfer.exportTransferInfo,
    fileName = "卷宗移交";
    uploadFile.downloadFile (url, fileName) ;
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
    if (e.data=="caseStatus"){
        paramObj.caseStatus = $(e.currentTarget).attr("val");
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
        url: baseUrl.caseTransfer.selectCaseTransferInfo,
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
                            "<td>" +
                           // "<span><input type=\"checkbox\" value=\"" + data.caseId + "\" name=\"checkbox\"  class=\"checkboxipt\" /></span>" +
                            "<span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='"+data.caseId+"'>" + data.caseTitle + "</a></td>" +
                            "<td>" + data.caseCode + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_status",data.caseStatus) + "</td>" +
                            "<td>" + data.caseTransferUser + "</td>" +
                            "<td>" + data.caseReceptUser + "</td>" +
                            "<td>" + data.caseTransferTime + "</td>" +
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
                    var status = $(this).attr("status");
                    jumpCaseFileManage(status, formId);
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
function jumpCaseFileManage(status, formId) {
    if (!isEmpty(formId)) {
        var path = pageUrl.caseManage.view;
        var param = "?caseId=" + formId;

        openFullWindow(path + param, {
            closed: function () {
            }
        });
    }
}
//打开案件移交操作窗口
function jumpDisputeDraft() {
    //去pageUrl匹配对应页面，默认拿编辑页，
    var path = pageUrl.caseTransfer.select;
    var param = "?";
    openFullWindow(path + param,{
        closed: function () {
            paging("pageContainer", "loadData", paramObj);
        }
    },{
        height:550,
        width:1200
    });
}