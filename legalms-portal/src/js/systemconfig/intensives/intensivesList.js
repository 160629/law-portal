var paramObj = {};//检索参数对象
var moduleType = 'premise_dispute';
$(function () {
    //列表控件事件加载
    
    $('.orgNamePage').on('click', orgNamePage); //选择所属公司
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询

    $(".table-true-btn").on("click", function () {
        settingBtnFun({type:1})//设置为集约
    });
    $(".table-false-btn").on("click", function (){
        settingBtnFun({type:0})//设置为非集约
    });
    //默认加载列表数据
    paging("pageContainer", "loadData", {});

});
//选择所属公司
function orgNamePage() {
    openSelectWindow.selectCompanyDepartTree({
        param: {flag: "8","param":"1"},
        showLevel: 0,
        isDepart: 0,
        callback: function (res) {
            $("input[name=orgCode]").val(res[0].id);
            $("input[name=orgName]").val(res[0].val);
        }
    },{title:'选择所属公司'})
}
//设置集约状态
function settingBtnFun(param) {
    if ($("#bus-table tbody input[type='checkbox']:checked").length > 0) {
        var userInfo = getUserData('pid');
        param.currUser = false;
        var idList = [];
        var typeName = '非集约';
        if (param.type==1){
            typeName = '集约';
        }
        layer.confirm("确定设置选中的信息为" + typeName + "吗？", {btn: ['确定', '取消'], title: "提示"}, function () {
            $("#bus-table tbody input[type='checkbox']:checked").each(function () {
                idList.push($(this).val());
                if ($(this).val()==userInfo.CURRUSERUNITID){
                    param.currUser=true;
                }
            });
            param.ids = idList;
            if (param.currUser){
                layer.confirm("将要设置的信息中包含当前用户公司，设置会将需要重新登陆", {btn: ['确定', '取消'], title: "提示"}, function () {
                    settingDateFun(param);//执行设置集约状态
                });
            }else{
                settingDateFun(param);//执行设置集约状态
            }
        });
    }
}

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

//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.count = param.count;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    ajax_req({
        url: baseUrl.intensives.selectOrgIntensives,
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
                            "<td><span><input type='checkbox' status='" + data.idJiYueHua + "' value='" + data.orgCode + "' name='checkbox' class='checkboxipt' /></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td>" + data.unitName + "</td>" +
                            "<td>" + data.provinceName + "</td>" +
                            "<td>" + data.orgName + "</td>" +
                            "<td>" + (data.isJiYueHua == 0 ? '否' : '是') + "</td>" +
                            "</tr>";
                    }
                }
                if (!html) {
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

function settingDateFun(param) {
    ajax_req({
        url: baseUrl.intensives.addFlowActivityPower,
        type: 'post',
        data: JSON.stringify({
            orgCodeList: param.ids,
            isJiYueHua: param.type
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                $(".querybtn").click();
                layer.msg("设置成功", {time: 1000}, function () {
                    if (param.currUser) {
                        ajaxJs.logout();//注销重新登陆
                    }
                });
            } else {
                layer.alert('设置信息失败，请联系管理员', {
                    icon: 2,
                    title: "提示"
                });
            }
        }, error: function (e) {
            layer.alert('设置信息失败，请联系管理员', {
                icon: 2,
                title: "提示"
            });
        }
    });
}

//导出表格点击事件
function Exportexsel() {
    // Export()
}