var paramObj = {};//检索参数对象
var moduleType ='premise_dispute';
$(function () {
    $('.declarationBtn').on('click', jumpDisputeDraft); //创建表单
    $('.Exportexsel').on('click', Exportexsel); //导出表格点击事件
    $(".table-del-btn").on("click",delBtnFun);//结束委托
    $(".resetbtn").on("click",resetBtnFun);//重置
    $(".querybtn").on("click",queryBtnFun);//查询
    //默认加载列表数据
    paging("pageContainer", "loadData", {});
});
//结束委托
function delBtnFun() {
    var idList = [];
    $("#bus-table tbody input[type='checkbox']:checked").each(function () {
        var status = $(this).attr("status");
        if (!isEmpty(status) && status != "19") {
        	var nv = $(this).next().val();
        	var nvdata = JSON.parse(nv);
            idList.push(nvdata);
            delDataFun(idList);//执行结束委托
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

    if (!isEmpty(paramObj.startTime)) {
        paramObj.startTime = paramObj.startTime + " 00:00:00";
    }
    if (!isEmpty(paramObj.endTime)) {
        paramObj.endTime = paramObj.endTime + " 23:59:59";
    }

    paramObj.pageNum = 0;
    paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
}
//列表数据加载
function loadData(param) {

    var pageData = param;
    pageData.count = param.count;
    var pageParam="?pageNum="+param.pageNum+"&pageSize="+param.pageSize;
    ajax_req({
        url: baseUrl.tFlowDelegate.selectAll+pageParam,
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
                        "<td><input type='checkbox' status='"+data.delegateStatus+"'value='" + data.delegateId + "' name='checkbox' class='checkboxipt' />"+
                        	"<input type='hidden' value='"+JSON.stringify(data)+"'>" + (i++) + "</td>" +
                            "<td>" + data.startTime +" 至 "+data.endTime+ "</td>" +
                            "<td>" + dateFormat(data.realEndTime) + "</td>" +
                            "<td>" + data.toerName + "</td>" +
                            "<td>" + dataDict.getDictValueByKey("sys_delegate_status", data.delegateStatus) + "</td>" +
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
function delDataFun(idList) {
    layer.confirm("确定结束选中的委托吗？",{btn: ['确定', '取消'], title: "提示"},function () {
    	ajax_req({
            url: baseUrl.tFlowDelegate.endDelegate,
            type:'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(idList),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    $(".querybtn").click();
                    layer.msg("结束委托成功", {time: 1000});
                } else {
                    layer.alert('结束委托失败，请联系管理员', {
                        icon: 2,
                        title: "提示"
                    });
                }
            },error:function(e){
                layer.alert('结束委托失败，请联系管理员', {
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
function jumpDisputeDraft () {
        layer.open({
            type: 2,
            area: ['580px', '440px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '新增委托',
            content: '../../../html/myworkbench/delegate/delegateEdit.html',
            success: function (layero, index) {
                var iframe = window['layui-layer-iframe' + index];
            },
            end: function(){
                paging("pageContainer", "loadData", paramObj);//加载分页数据绑定到列表
            }
    })
}