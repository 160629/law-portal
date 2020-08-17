var paramObj={deleteStatus:0};//检索参数对象
var moduleType = 'premise_dispute';
$(function () {
    //卷宗列表菜单标识
    // 如果待阅增加跳转业务模块，让服务器端加字段或者直接把菜单标识传过来
    var menuCode = 'CHNTLEGALMS_3_5';
    // platform.setMenuCode(menuCode);

    //列表控件事件加载
    loadStatus();//信息状态下拉框数据加载
    loadCaseDeputeType();//案件类型下拉框数据加载
    $('.ourLawsuitBodyNamePage').on('click', selectCompany); //选择我方主体
    $('.involvedOrgPage').on('click', involvedOrgPage); //选择所属公司
    $('.declarationBtn').on('click', jumpDisputeDraft); //创建表单
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".table-del-btn").on("click",delBtnFun);//删除
    $(".table-edit-btn").on("click",editBtnFun);//编辑
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询
    $("ul[name=caseStatus]").on('click', 'li', 'caseStatus',queryBtnFun);//状态列表查询

    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);

   //加的临时控制代码， 控制节约地市不能创建卷宗
    // var userInfo = getUserData('pid');
    // if (userInfo.ISJIYUEHUA != 1) {
    //     $(".right-card,.right-card").show()
    // }else{
    //     $(".right-card,.right-card").remove();
    // }
});
//编辑
function editBtnFun() {
    var $selectRow = $("#bus-table tbody input[type='checkbox']:checked");
    if ($selectRow.length > 1) {
        layer.msg("只可选中一条数据进行编辑！");
    }else if ($selectRow.length < 1) {
        layer.msg("请选中要编辑的数据！");
    } else if ($selectRow.length == 1) {
        var $title = $selectRow.parents("tr").find(".title-link");
        //打开业务表单页面
        var status = $title.attr("status");
        if (status == 1 || status == 2) {
            var formId = $title.attr("id");
            jumpDisputeDraft(status, formId);
        }else if(status == 3){
            layer.msg("案件已结案，不可进行操作");
        }else{
            layer.msg("只可编辑“暂存”，“在办”状态的数据！");
        }
    }
}
//删除
function delBtnFun(id) {
    var idList = [];
    $("#bus-table tbody input[type='checkbox']:checked").each(function () {
        var status = $(this).attr("status");
        if (!isEmpty(status) && status == "1") {
            idList.push({caseId: $(this).val()});
            delDataFun(idList);//执行删除请求
        }else{
            layer.msg("仅可删除【未提交】状态的卷宗！");
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
        url: baseUrl.caseMain.selCaseMain,
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
                            "<td><span><input type='checkbox' status='" + data.caseStatus + "' value='" + data.caseId + "' name='checkbox' class='checkboxipt' /></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td class='Tdtitle'><a href='#' class='title-link' id='" + data.caseId + "' status='" + data.caseStatus + "'>" + data.caseTitle + "</a></td>" +
                            "<td>" + data.caseCode + "</td>" +
                            "<td>" + data.otherLawsuitBody + "</td>" +
                            "<td class='TdMy'>" + data.ourLawsuitBodyName + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_type",data.deputeType) + "</td>" +
                            "<td>" + common.isSuffix(data.caseDeputeMoney) + "</td>" +
                            "<td>" + data.lastUpdateTime + "</td>" +
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
                    var status = $(this).attr("status");
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

function delDataFun(idList) {
    layer.confirm("确定删除选中的信息吗？",{btn: ['确定', '取消'], title: "提示"},function () {
        ajax_req({
            url: baseUrl.caseMain.deleteCaseMains,
            type:'post',
            data: JSON.stringify(idList),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    paging("pageContainer", "loadData", paramObj);
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

function selectCompany() {
    openSelectWindow.selectcompanyList({
        param: {flag:"1"},
        callback:function (res) {
            $("input[name=ourLawsuitBodyName]").val(res[0].bodyName);
        }
    },{title:'选择我方诉讼主体'})
}

//涉案单位/部门选择
function involvedOrgPage() {
    openSelectWindow.selectCompanyDepartTree({
        param: {flag: "12"},
        showLevel: 0,
        callback: function (res) {
            $("input[name=involvedOrgName]").val(res[0].val);
            $("input[name=type]").val(res[0].type);
            $("input[name=id]").val(res[0].id);
        }
    },{title:'选择涉案单位/部门'})
}

//跳转到起草案件卷宗页面
function jumpDisputeDraft(status, formId) {
    //如果是空，去取当前用户角色，该访问的页面
    var path = pageUrl.caseManage.add;
    switch (status) {
        case "1":
            path = pageUrl.caseManage.add;
            break;
        case "2":
            path = pageUrl.caseManage.edit;
            break;
        case "3":
            path = pageUrl.caseManage.view;
            break;
    }
    var param = "?caseId=" + formId;
    openFullWindow(path + param, {
        closed: function () {
            paging("pageContainer", "loadData", paramObj);
        }
    });
}