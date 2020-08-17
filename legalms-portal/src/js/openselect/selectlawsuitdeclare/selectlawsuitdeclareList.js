//已选回写信息
var paramObj = {deleteStatus: 0};
$(function () {

    //关闭弹出框
    $('#alertCancelBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

    $(".resetbtn").on("click", resetBtnFun);//重置
    $(".querybtn").on("click", queryBtnFun);//查询
    $('.ourLawsuitBodyNamePage').on('click', selectCompany); //选择争议主体

});

//暴露给父页面的回调函数
function child(paramData) {
    //当前页提交响应事件，执行父页面回调函数
    $('#alertSubmitBtn').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            var $lawsuits = $(".checkedlist li");
            if ($lawsuits.length > 0) {
                var array = [];
                $.each($lawsuits, function (i, $li) {
                    var value = $($li).find("input[type=hidden]").val();
                    array.push(eval("(" + value + ")"));
                });
            paramData.callback(array);//转为数组给回调函数
            parent.layer.close(index);
        } else {
            parent.layer.msg("请选择纠纷处理！");
        }
    });

    $('tbody').on("mousedown", 'input[type=checkbox]', function () {
        var checkbox = $(this);
        var id = checkbox.attr("id");
        if (!checkbox.is(":checked")) {
            if (paramData.isRadio) {
                $('tbody').find('input[type=checkbox]').prop('checked', false);
                $(this).parents('table').find(".tr-select").removeClass('tr-select');
                appendGuide();//设置选中为空
            }
            var data = checkbox.next().val();
            appendGuide(eval("(" + data + ")"));
            $(this).parents('tr').addClass('tr-select')
        } else {
            $(this).parents('tr').removeClass('tr-select');
            $("#" + id + "_data").remove()
        }
    });

    $.extend(paramObj, paramData.param);
    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);

    selectedEvent();
}

//绑定事件
function selectedEvent() {
    //删除图标显示
    $('.checkedlist').on('mouseenter', 'li', function () {
        $(this).find('.option-icon').show()
    });
    //删除图标隐藏
    $('.checkedlist').on('mouseleave', 'li', function () {
        $(this).find('.option-icon').hide()
    });
    //删除已选中纠纷处理点击事件
    $('.checkedlist').on('click', '.del', function () {
        var tId = $(this).parents("li").attr("id");
        tId = tId.replace("_data", "");
        $("#" + tId + "_data").remove();
        $("#" + tId).prop("checked", false).parents("tr").removeClass("tr-select");
    }).on('click', '.up', function () {
        var $li = $(this).parents("li");
        if($li.prev()){
            $li.prev().before($li);
        }
    }).on('click', '.down', function () {
        var $li = $(this).parents("li");
        if($li.next()){
            $li.next().after($li);
        }
    });

}

//检索重置
function resetBtnFun() {
    $("#queryForm").reset_form();
    $(".querybtn").click();
}

//检索查询
function queryBtnFun() {
    paramObj = $.extend(paramObj, $("#queryForm").serializeJSON());

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
        url: baseUrl.tIssueLawsuit.findTIssueLawsuit,
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
                        var checked = '', trSelect = '';
                        if ($("#" + data.caseId + "_data").length > 0) {
                            checked = "checked";
                            trSelect = 'tr-select';
                        }
                        html += "<tr class=" + trSelect + ">" +
                            "<td><span><input type='checkbox' id='" + data.lawsuitId + "'  value='" + data.lawsuitTitle + "' name='checkbox' class='checkboxipt'  " + checked + "/>" +
                            "<input type='hidden' value='" + JSON.stringify(data) + "'></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td><a href='#' class='title-link' id='" + data.lawsuitId + "' status='" + data.lawsuitStatus+ "'moduleName='" + data.moduleName
                            + "'title='" + data.lawsuitTitle + "'>" + data.lawsuitTitle + "</a></td>" +
                            "<td>" + data.lawsuitCode + "</td>" +
                            "<td>" + data.theyLawsuitBody + "</td>" +
                            "<td>" + data.ourLawsuitBodyName + "</td>" +
                            "<td>" + common.isSuffix(data.lawsuitMoney) + "</td>" +
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

//将已选择添加到已选列表
function appendGuide(param) {

    if (null != param) {
        if ($("#" + param.lawsuitId + "_data").length == 0) {
            var checkHtml = "<li id='" + param.lawsuitId + "_data'><input type='hidden' value='"+JSON.stringify(param)+"'><span class='text'>" + param.lawsuitTitle + "</span><div class='option-icon'><i class='up layui-icon layui-icon-up'></i><i class='down layui-icon layui-icon-down'></i><i class='del layui-icon layui-icon-delete'></i></div></li>";
            $(".checkedlist").append(checkHtml);
        } else {
            $("#" + param.lawsuitId + "_data").remove()
        }
    } else {
        $(".checkedlist").html("");
    }
}

function selectCompany() {
    parent.openSelectWindow.selectcompanyList({
        param: {flag: "1"},
        callback: function (res) {
            $("input[name=ourLawsuitBodyName]").val(res[0].bodyName);
        }
    })
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