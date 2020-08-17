var paramObj = {};//检索参数对象
$(function () {
    //列表控件事件加载
    loadApplyType();// 申请类别下拉框数据加载
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件relative
    $('.table-del-btn').on("click",delBtnFun);//删除
    //$('.relative').on("click",test);//删除
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询

    //默认加载列表数据
    paging("pageContainer", "loadData", {});
});

//删除
function delBtnFun() {

    var idList = [];
    var typeList = [];
    var nameList = [];
    $("#bus-table tbody input[type='checkbox']:checked").each(function () {
        var approveItemType = $(this).attr("approveItemType");
        var approveItemName = $(this).attr("approveItemName");
        idList.push($(this).val());
        typeList.push(approveItemType);
        nameList.push(approveItemName);
        delDataFun({approveItemIdList: idList, approveItemTypesList: typeList, approveItemNameList: nameList});//执行删除请求
    });
}
//检索重置
function resetBtnFun() {
    $("#queryForm").reset_form();
    $(".querybtn").click();
}
//检索查询
function queryBtnFun() {
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
        url: baseUrl.drafts.selectDrafts,
        type: 'post',
        async: false,
        data: JSON.stringify(pageData),
        success: function (res) {
            if (res.resultStat == "SUCCESS") {
                var html = "";
                if (res.data != null) {
                    pageData.count = res.data.total;
                    pageData.pageNum = res.data.pageNum;
                    var i = ((res.data.pageNum - 1) * res.data.pageSize) + 1;
                    for (var index in res.data.list) {
                        var data = res.data.list[index];
                        data = nullFormatStr(data);
                        html += "<tr>" +
                            "<td><span><input type='checkbox' approveItemName='"+data.approveItemName+"' approveItemType='"+data.approveItemType+"' value='" + data.approveItemId + "' name='checkbox' class='checkboxipt' /></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.approveItemId + "' approveItemType='" + data.approveItemType + "'moduleName='" + data.moduleName
                            + "' title='"+data.lawCaseTitle+"'>" +data.lawCaseTitle + "</a></td>" +
                            "<td>" + data.lawCaseCode + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_task_type",data.applyType) + "</td>" +
                            "<td>" + dateFormat(data.createTime) + "</td>" +
                            "</tr>";
                    }
                }
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //跳转到表单页面
                $('#bus-table .title-link').on('click', function () {
                    var formId = $(this).attr("id");
                    var moduleType = $(this).attr("moduleName");
                    jumpDisputeDraft(status, formId,moduleType);
                });
            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
    return pageData;
}
function delDataFun(idObj) {
    layer.confirm("确定删除选中的信息吗？",{btn: ['确定', '取消'], title: "提示"},function () {
        ajax_req({
            url: baseUrl.drafts.deleteDrafts,
            type:'post',
            data: JSON.stringify(idObj),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    $(".querybtn").click();
                    layer.msg("删除成功", {time: 1000});
                } else {
                    layer.alert('删除信息失败，请联系管理员', {
                        icon: 2,
                        title: "提示"
                    });
                }
            },error:function(e){
                layer.alert('删除信息失败，请联系管理员', {
                    icon: 2,
                    title: "提示"
                });
            }
        });
    });
}
//导出表格点击事件
function Exportexsel() {
    // Export()
}

// 申请类别下拉框数据加载
function loadApplyType() {
    var dictKey = "sys_task_type";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        applyType = $('select[name=applyType]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        arr.push('<option value="' + value.dictValue + '">' + value.dictCabel + '</option>');
    });
    applyType.append(arr.join(''));
}

//跳转到起草表单页面
function jumpDisputeDraft(status, formId, moduleName) {
    //如果是空，去取当前用户角色，该访问的页面
    //去pageUrl匹配对应页面，默认拿编辑页，
    var path = pageUrl.getBusinessUrl(moduleName, "edit");
    var param = "?formId=" + formId + "&moduleName=" + moduleName;

    openFullWindow(path + param, {
        closed: function () {
            paging("pageContainer", "loadData", paramObj);
        }
    });
}