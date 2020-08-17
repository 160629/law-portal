var paramObj = {
    chooseType: "1"
};//检索参数对象
$(function () {
    //列表控件事件加载
    // 申请类别下拉框数据加载
    loadApplyType();
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
        paramObj.startTime = (paramObj.startTime).replace(/\-/g, '') + "000000";
    }
    if (!isEmpty(paramObj.endTime)) {
        paramObj.endTime =getEndDate(paramObj.endTime);
        paramObj.endTime = (paramObj.endTime).replace(/\-/g, '') + "000000";
    }
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}


//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;

    paramObj.pageNum = pageData.pageNum;
    paramObj.pageSize = pageData.pageSize;
    ajax_req({
        url: baseUrl.taskList.taskList,
        type: 'post',
        async: false,
        data: JSON.stringify(pageData),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    pageData.count = rs.data.count;
                    pageData.pageNum = rs.data.currentPage;

                    var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                    var i = ((pageData.pageNum - 1) * pageData.pageSize) + 1;
                    for (var index in rs.data.taskList) {
                        var data = rs.data.taskList[index];
                        data = nullFormatStr(data);
                        var time = data.time;
                        var formatTime = time.replace(pattern, '$1-$2-$3 $4:$5:$6');
                        var businessId = data.type.substr(data.type.indexOf('#') + 1);
                        businessId = businessId.substr(0, businessId.indexOf('#'));
                        html += "<tr>" +
                            "<td>" + (i++) + "</td>" +
                            "<td><a href='#' class='title-link' processInstId='"+data.processInstId
                            +"' businessType = '" + data.person
                            + "' businessId = '" + businessId
                            + "' currActivityDefId ='"+data.currActivityDefId
                            +"' currActivityDefName='"+data.currActivityDefName
                            +"' work='"+data.work
                            +"' title ='"+data.title+"'>" + data.title + "</a></td>" +
                            "<td>" + data.code + "</td>" +
                            "<td>" + data.type.substr(data.type.lastIndexOf('#') + 1) + "</td>" +
                            "<td>" + dateFormat(formatTime) + "</td>" +
                            "<td>" + data.currActivityDefName + "</td>" +
                            "</tr>";
                    }
                }
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //打开业务表单页面
                $('#bus-table .title-link').on('click', function () {
                    var param = {
                        processInstId: $(this).attr("processInstId"),
                        businessId: $(this).attr("businessId"),
                        moduleName: $(this).attr("businessType"),
                        currActivityDefId: $(this).attr("currActivityDefId"),
                        currActivityDefName: $(this).attr("currActivityDefName"),
                        title: $(this).attr("title"),
                        mode: "task",
                        source:"task"
                    };
                    jumpDisputeDraft(param);
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
// 申请类别下拉框数据加载
function loadApplyType() {
    var dictKey = "sys_task_type";
    var dictData = dataDict.getSysdictdata(dictKey);
    var arr = [],
        type = $('select[name=type]');
    arr.push('<option value="">全部</option>');
    $.each(dictData, function (index, value) {
        arr.push('<option value="' + value.dictValue + '">' + value.dictCabel + '</option>');
    });
    type.append(arr.join(''));
}
//跳转连接
function jumpDisputeDraft(param) {
    if (!isEmpty(param.moduleName)) {
        var path = pageUrl.getBusinessUrl(param.moduleName, "view");
        var pathParam = "?formId=" + param.businessId
            + (param.processInstId ? "&processInstId=" + param.processInstId : "")
            + (param.moduleName ? "&moduleName=" + param.moduleName : "")
            + (param.currActivityDefId ? "&currActivityDefId=" + param.currActivityDefId : "")
            + (param.currActivityDefName ? "&currActivityDefName=" + encodeURI(param.currActivityDefName) : "")
            + "&source=" + param.source
            + "&mode=" + param.mode;

        openFullWindow(path + pathParam, {
            closed: function () {
                loadData(paramObj);//关闭后重新加载任务列表
            }
        });
    } else {
        layer.msg("请求数据业务类型错误");
    }
}