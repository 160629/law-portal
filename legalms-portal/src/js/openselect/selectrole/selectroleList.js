//已选回写信息
var paramObj = {
    fromType: 1
};
$(function () {

    //关闭弹出框
    $('#alertCancelBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

    $("#querybtn").on("click", queryBtnFun);//查询
    $(".resetbtn").on("click",resetBtnFun);//重置

    selectedEvent();
});

//暴露给父页面的回调函数
function child(paramData) {
    //当前页提交响应事件，执行父页面回调函数
    $('#alertSubmitBtn').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        var $roles = $(".checkedlist li");
        if ($roles.length > 0) {
            var array = [];
            $.each($roles, function (i, $li) {
                var value = $($li).find("input[type=hidden]").val();
                array.push(eval("(" + value + ")"));
            });
            paramData.callback(array);//转为数组给回调函数
            parent.layer.close(index);
        } else {
            parent.layer.msg("请选择！");
        }
    });

    $('tbody').on("click", 'tr', function () {
        var checkbox = $(this).find("input[type=checkbox]");
        var id = checkbox.attr("id");
        if (!checkbox.is(":checked")) {

            if (paramData.isRadio) {
                $('tbody .checkboxipt').prop('checked', false);
                $('.tr-select').removeClass('tr-select');
                appendRole();//设置选人为空
            }
            var data = checkbox.next().val();
            appendRole(eval("(" + data + ")"));
            checkbox.prop("checked", true);
            $(this).addClass('tr-select')
            // if (paramData.isRadio) {
            //     //如果是单选，直接确定
            //     $('#alertSubmitBtn').click();
            // }
        } else {
            checkbox.prop("checked", false);
            $(this).removeClass('tr-select');
            $("#" + id + "_data").remove()
        }
    });
    //读取已选数据并加载
    // console.log(paramData.selectItem);
    if (paramData.selectItem){
        var data = paramData.selectItem;
        if (data.roleCode){
            var roleCodeS = data.roleCode;
            var objArray=[];
            //切出所有需要回填的所有存储数组对象的数组
            $.each(data, function (i, value) {
                if (value) {
                    var valArray = value;
                    $.each(roleCodeS, function (j, value) {
                        //用主键数量控制循环重新组装逻辑
                        var bodyObj = objArray[j];
                        if (!objArray[j]){
                            bodyObj = {};
                            bodyObj[i] = valArray[j];
                            objArray.push(bodyObj);
                        }else{
                            bodyObj[i] = valArray[j];
                            objArray[j] = bodyObj;
                        }
                    });
                }
            });
            $.each(objArray, function (index, value) {
                appendRole(value);
            });
        }
    }
    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);
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
    //删除已选中主体公司点击事件
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
        url: baseUrl.rolemenu.selectRole,
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
                        var trSelect = "";
                        if ($("#" + data.roleCode + "_data").length > 0) {
                            trSelect = 'tr-select';
                        }
                        html += "<tr class=" + trSelect + ">" +
                            "<td><span><input type='checkbox' id='" + data.roleCode + "' value='" + data.roleName + "' name='checkbox' class='checkboxipt hide' />" +
                            "<input type='hidden' value='" + JSON.stringify(data) + "'></span><span class='index'>" + (i++) + "</span></td>" +
                            "<td>" + data.roleCode + "</a></td>" +
                            "<td>" + data.roleName + "</a></td>" +
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

//将已选择添加到已选列表
function appendRole(param) {
    if (null != param) {
        if ($("#" + param.roleCode + "_data").length == 0) {
            var checkHtml = "<li id='" + param.roleCode + "_data'><input type='hidden' value='"+JSON.stringify(param)+"'><span class='text'>" + param.roleName + "</span><div class='option-icon'><i class='up layui-icon layui-icon-up'></i><i class='down layui-icon layui-icon-down'></i><i class='del layui-icon layui-icon-delete'></i></div></li>";
            $(".checkedlist").append(checkHtml);
        }else{
            $("#" + param.roleCode + "_data").remove()
        }
    } else {
        $(".checkedlist").html("");
    }
}