var paramObj = {deleteStatus: 0};//检索参数对象
$(function () {
    //列表控件事件加载
    loadStatus();//信息状态下拉框数据加载

    $('#waring-btn').on('click', closeBtnFun);//关闭
    $("#selectCase").on('click', caseTransferEdit);//下一步、提交

    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询

    $('.ourLawsuitBodyPage').on('click', selectCompany); //选择争议主体
    $('.belongToCompanyPage').on('click', belongToCompany); //选择公司列表支持多选

    $('.belongToUserPage').on('click', belongToUser); //选择公司列表支持多选

    $("ul[name=caseStatus]").on('click', 'li', 'caseStatus', queryBtnFun);//状态列表查询
});

function closeBtnFun() {
    window.close();
}

//删除
function delBtnFun(id) {
    delDataFun(id);//执行删除请求
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
    if (e.data == "caseStatus") {
        paramObj.caseStatus = $(e.currentTarget).attr("val");
    }
    if (paramObj.orgCodeStr) {
        paramObj.orgCodeList = paramObj.orgCodeStr.split(",");
    }else{
        paramObj.orgCodeList = null;
    }
    if (paramObj.typeStr) {
        paramObj.typeList = paramObj.typeStr.split(",");
    }else{
        paramObj.typeList = null;
    }

    paramObj.pageNum = 0;
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

//列表数据加载1
function loadData(param) {
    var pageData = param;
    pageData.count = param.count;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    ajax_req({
        url: baseUrl.caseMain.selCaseMains,
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
                            "<td><span><input type=checkbox value='" + data.caseId+ "' name=checkbox  class=checkboxipt />" +
                            "<input type='hidden' value='"+JSON.stringify(data)+"'>" +
                            "</span><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.caseId + "'>" + data.caseTitle + "</a></td>" +
                            "<td>" + data.caseCode + "</td>" +
                            "<td>" + data.otherLawsuitBody + "</td>" +
                            "<td>" + data.ourLawsuitBodyName + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_case_type", data.deputeType) + "</td>" +
                            "<td>" + common.isSuffix(data.caseDeputeMoney) + "</td>" +
                            "<td>" + data.creatorAccountName+ "</td>" +
                            "</tr>";
                    }
                }
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
    return pageData;
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

function selectCompany() {
    openSelectWindow.selectcompanyList({
        param: {flag: "1"},
        callback: function (res) {
            $("input[name=ourLawsuitBodyName]").val(res[0].bodyName);
        }
    },{title:"选择我方诉讼主体"}
    )
}
function belongToUser() {
    parent.openSelectWindow.selectorguserTree({
        param: {flag: "3"},
        isDepart: 1,
        callback: function (res) {
            $("input[name=creatorAccountId]").val(res[0].id);
            $("input[name=creatorAccountName]").val(res[0].val);
        }
    })
}

function belongToCompany() {
    //若是多选啊需要设置回填字段和值
    var selectItem = {};
    var idArray = $("input[name=orgCodeStr]").val();
    var valArray = $("input[name=belongToCompany]").val();
    var typeArray = $("input[name=typeStr]").val();
    if (idArray){
        selectItem = {
            id:idArray.split(","),
            val:valArray.split(","),
            type:typeArray.split(",")
        };
    }
    openSelectWindow.selectorgTree({
        param: {flag: "2"},
        showLevel: 0,
        isRadio: false,
        selectItem:selectItem,
        callback: function (res) {
            var valArray = [];
            var idArray = [];
            var typeArray = [];
            $.each(res, function (index, value) {
                valArray.push(value.val);
                idArray.push(value.id);
                typeArray.push(value.type)
            });
            $("input[name=orgCodeStr]").val(idArray.join(","));
            $("input[name=belongToCompany]").val(valArray.join(","));
            $("input[name=typeStr]").val(typeArray.join(","));
        }
    }, {
        title: '选择归属公司'
    });
}

//跳转到起草案件卷宗页面
function caseTransferEdit() {
    var datas = [];
    $("#bus-table tbody input[type='checkbox']:checked").each(function () {
        var data = $(this).next().val();
        datas.push( eval("("+data+")"));
    });

    if (datas.length > 0) {
        layer.open({
            type: 2,
            area: ['500px', '500px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '案件卷宗移交',
            content: pageUrl.caseTransfer.edit,
            success: function (layero, index) {
                var iframe = window['layui-layer-iframe' + index];
                iframe.child({
                    param: {
                        datas: datas
                    },
                    callback: function (res) {
                       window.close();
                    }
                });
            }
        })
    }else{
        layer.msg("请选择要迁移的案件卷宗",{time:800})
    }
}

