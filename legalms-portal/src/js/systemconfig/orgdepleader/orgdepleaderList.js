var paramObj = {};//检索参数对象
var moduleType = 'premise_dispute';
$(function () {
    //列表控件事件加载

    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询
    $('.showOrgTree').on('click', showOrgTree); //选择公司列表支持多选
    $("input[name='compName1']").val(getUserData('pid').CURRUSERORGNAME);//从pid获取当前登录人公司
    $("input[name='orgCode']").val(getUserData('pid').CURRUSERUNITID);
    //默认加载列表数据
    //paging("pageContainer", "loadData", paramObj);
});

//点击删除事件
function delBtnFun(orgParentCode, orgPath, orgCode, orgName, compName, empName) {

    if (empName == "-" || empName == "" || empName == null || empName == 'null' || empName == undefined || empName == 'undefined') {
        layer.msg("您选择的部门还没有设置分管领导!", { time: 1000 });
    } else {
        layer.confirm("确认需要清空吗？", { btn: ['确定', '取消'], title: "提示" }, function () {
            ajax_req({
                url: baseUrl.orgdepleader.deleteOrgDepLeader,
                type: 'delete',
                data: JSON.stringify({
                    compName: compName,
                    orgCode: orgCode,
                    orgName: orgName,
                    orgParentCode: orgParentCode,
                    orgPath: orgPath

                }),
                success: function (rs) {
                    if (rs.resultStat == "SUCCESS") {
                        paging("pageContainer", "loadData", paramObj);
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
        })

    }
}
//检索重置
function resetBtnFun() {
    $("input[name='orgCode']").val("");
    $("#queryForm").reset_form();
    $(".querybtn").click();
}


function showOrgTree() {
    openSelectWindow.showOrgTree({
        param: { flag: "" },
        isRadio: true,
        callback: function (res) {
            var valArray = [];
            var idArray = [];
            var typeArray = [];
            $.each(res, function (index, value) {
                valArray.push(value.val);
                idArray.push(value.id);
                typeArray.push(value.type)
            });
            $("input[name='compName1']").val(valArray);
            $("input[name='orgCode']").val(idArray);
        }
    }, {
        title: '选择公司'
    });
}
//检索查询
function queryBtnFun(e) {
    paramObj = $.extend(paramObj, $("#queryForm").serializeJSON());
    if (!isEmpty($("input[name='orgCode']").val()) && $("input[name='orgCode']").val() != "") {
        paramObj.orgCode = $("input[name='orgCode']").val();
    } else {
        delete paramObj.compName;
    }
    if (!isEmpty(paramObj.empName) && paramObj.empName != "") {
        paramObj.empName = paramObj.empName;
    } else {
        delete paramObj.empName;
    }
    if (!isEmpty(paramObj.orgName) && paramObj.orgName != "") {
        paramObj.orgName = paramObj.orgName;
    } else {
        delete paramObj.orgName;
    }
    if (!isEmpty(paramObj.isSetup) && paramObj.isSetup != "") {
        paramObj.isSetup = paramObj.isSetup;
    } else {
        delete paramObj.isSetup;
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
        url: baseUrl.orgdepleader.selectOrgDepLeader,
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
                    // console.log(rs.data.list);
                    for (var index in rs.data.list) {
                        var data = rs.data.list[index];
                        data = nullFormatStr(data);
                        /*<input type='checkbox' status='"+data.guideStatus+"'value='" + data.guideId + "' name='checkbox' class='checkboxipt' />*/
                        html += "<tr>" +
                            "<td>&nbsp;" + (i++) + "</td>" +
                            "<td>" + data.compName + "</a></td>" +
                            "<td>" + data.orgName + "</td>" +
                            "<td>" + data.empName + "</td>" +
                            "<td class='ourLitigationBodyPage'><input type='hidden' value='" + JSON.stringify(data) + "'><a href='#' class='setting-link'>设置</a>" +
                            "&nbsp;&nbsp;|&nbsp;&nbsp;<a href='#' onclick='delBtnFun(\"" + data.orgParentCode + "\",\"" + data.orgPath + "\",\"" + data.orgCode + "\",\"" + data.orgName + "\",\"" + data.compName + "\",\"" + data.empName + "\");'>清空</a></td></div>" +
                            "</tr>";
                    }
                }
                if (!html) {
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);

                $('#bus-table .setting-link').on('click', function () {

                    var value = $(this).parents("td").find("input[type=hidden]").val();
                    orgdepleaderList(eval("(" + value + ")"));
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

//列表点击设置事件
function orgdepleaderList(param) {
    if (isEmpty(param.empName)) {
        orgdepleaderOpen(param);
    } else {
        layer.confirm('已设置分管领导，确认需要更新吗？', { icon: 3, title: '提示' }, function (index) {

            //do something
            orgdepleaderOpen(param);
            layer.close(index);
        });
    }
}
function orgdepleaderOpen(param) {

    //若是多选啊需要设置回填字段和值
    var selectItem = {};
    var accountId = param.accountId;
    var empName =  param.empName;
    if (accountId){
        selectItem = {
            id:accountId.split(","),
            val:empName.split(",")
        };
    }
    layer.open({
        type: 2,
        area: ['645px', '480px'],
        fixed: false, //不固定
        maxmin: false, //开启最大化最小化按钮
        title: '人员选择',
        content: '../../systemconfig/orgdepleader/selectDepleader.html',
        success: function (layero, index) {
            // 获取子页面的iframe
            var iframe = window['layui-layer-iframe' + index];
            // 向子页面的全局函数child传参
            iframe.child({
                param: {orgCode: param.orgCode},
                selectItem: selectItem,
                callback: function (res) {
                    var idStr = [];
                    var parentCode = '';
                    var userCodeStr = [];
                    $.each(res, function (index, value) {
                        //回调函数设置
                        idStr.push(value.id);
                        parentCode = value.pid;
                        userCodeStr.push(value.val);
                    });
                    ajax_req({
                        url: baseUrl.orgdepleader.updateOrgDepLeader,
                        type: 'put',
                        async: false,
                        data:JSON.stringify({
                            empNameStr:userCodeStr.join(","),
                            userCodeStr:idStr.join(","),
                            orgCode:param.orgCode
                        }),
                        success: function (rs) {
                            paging("pageContainer", "loadData", paramObj);
                        }
                    });
                }
            });
        }
    });
}