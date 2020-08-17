var paramObj = {
    pageSize: 50
};//检索参数对象
$(function () {
    //列表控件事件加载
    $('.Exportexsel').on('click', Exportexsel); //导出点击事件
    $("#querybtn").on("click", queryBtnFun);//查询

    $("input[name=shareType]").val("reference");
    $(".left a").on("click", function () {
        var html = $(this).html();
        $("input[name=formId]").val(html);
    });

    //默认加载列表数据
    paging("pageContainer", "loadData", paramObj);
});

//检索查询
function queryBtnFun(e) {
    paramObj = $.extend(paramObj, $("#queryForm").serializeJSON());
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}

//列表数据加载
function loadData(param) {
    var pageData = param;
    pageData.pageNum = param.pageNum;
    pageData.pageSize = param.pageSize;
    // console.log(param)
    ajax_req({
        url: baseUrl.warnSelect.selectBySql,
        type: 'post',
        data: param,
        contentType: 'application/x-www-form-urlencoded',
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    // console.log(rs.data)
                    pageData.count = rs.data.total;
                    pageData.pageNum = rs.data.pageNum;
                    pageData.pageSize = rs.data.pageSize;
                    var i = 1;
                    if (rs.data[0]){
                        var head_html='<th></th>';
                        $.each(rs.data[0],function (field,value) {
                            head_html += "<th>" + field + "</th>";
                        });
                        $("#bus-table>thead").html(head_html);

                    }
                    for (var index in rs.data) {
                        var data = rs.data[index];
                        html += "<tr><td>" + index + "</td>";
                        $.each(rs.data[0], function (field, value) {
                            html += "<td>" + data[field] + "</td>";
                        });

                        html += "</tr>";
                    }
                }
                if (!html) {
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table>tbody").html(html);
                //跳转到详情页
            } else {
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

