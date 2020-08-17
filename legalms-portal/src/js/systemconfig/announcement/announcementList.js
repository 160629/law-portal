var noticeTable;
var noticeStates = {0: '待发布', 1: '发布中', 2: '发布完毕'};
layui.use('table', function () {
    noticeTable = layui.table;
    noticeTable.render({
        elem: '#noticeTable'
        , method: 'post',
        contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.announcement.findannouncement
        , id: 'noticeTable',
        height: 400,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {type: 'numbers', title: '序号',width:40}
            , {
                field: 'announcementName', title: '标题',width:163, templet: function (d) {
                    var title = d.announcementName;
                    var url = "../../../html/systemconfig/announcement/announcementView.html?param=" + d.announcementId;
                    return d.announcementFilestate == '1' ? '<a onclick="showDetail(\'' + url + '\')" class="aShowLine" href="#"  >' + title + '</a>' + '&nbsp;<image src="../../../css/images/download.png"></image>' : '<a onclick="showDetail(\'' + url + '\')" class="aShowLine" href="#">' + title + '</a>';
                }
            }
            , {
                field: 'announcementTypeid', title: '公告类型', templet: function (d) {
                    return d.announcementTypeid == 1 ? '系统公告' : d.announcementTypeid == 2 ? '消息公告' : '';
                }
            }
            , {field: 'announcementContent', title: '公告内容',width:163}
            , {field: 'announcementCreatetime', title: '发布时间'}
            , {field: 'announcementIssuerid', title: '发布人'}
            , {
                field: 'announcementState', title: '状态', templet: function (d) {
                    return noticeStates[d.announcementState];
                }
            }
            , {
                field: 'remark', title: '操作', templet: function (d) {
                    /*<input type='button' value='确定' onclick='say(\'"+str+"\')'>*/
                    var updateId = d.announcementId;
                    return d.announcementState == 1 ? '<a href="javascript:void(0);" onclick="cancelRelease(\'' + updateId + '\')" class="layui-table-link">取消发布</a>' : '--';
                }
            }
        ]],
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": res.resultStat == 'SUCCESS' ? 0 : 500, //解析接口状态
                "msg": res.mess, //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.list //解析数据列表
            }
        },
        page: true,
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        }
    });
});
//取消发布
function cancelRelease(announcementId) {
    var params = {'announcementId': announcementId, 'announcementState': 2};
    layer.confirm("确认取消发布该公告吗？", {skin: 'btn-class', btn: ['确定', '取消'], title: "提示"}, function () {
        ajax_req({
            url: baseUrl.announcement.updateannouncement,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(params),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    layer.msg("取消成功", {time: 1000});
                    restForm();
                    queryNoticeList();
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
    });
};

<!-- 查询公告列表-->
function queryNoticeList() {
    var queryParam = {};
    var queryParams = $.extend($("#queryForm").serializeJSON(), queryParam);
    console.log(queryParams)
    if (!isEmpty(queryParams.announcementStarttime)) {
        queryParams.announcementStarttime += " 00:00:00";
    }

    if (!isEmpty(queryParams.announcementFinishtime)) {
        queryParams.announcementFinishtime += " 23:59:59";
    }
    if (!isEmpty(queryParams.announcementTypeid)) {
        queryParams.announcementTypeid = parseInt(queryParams.announcementTypeid);
    }
    noticeTable.reload('noticeTable', {
        where: queryParams
        , page: {
            curr: 1 //重新从第 1 页开始
        }
    });
}

<!-- 重置-->
function restForm() {
    $("#queryForm").reset_form();
    queryNoticeList();
}

<!-- 重置按钮点击事件-->
$('.resetbtn').on('click',function(){
	 restForm()
});

<!-- 新加公告-->
function addNewAnnouncement() {
    layer.open({
        type: 2,
        content: "../../../html/systemconfig/announcement/announcementEdit.html", //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        area: ['1240px', '520px'],
        end: function () {
            queryNoticeList();
        }
    });
}

<!-- 展示详情-->
function showDetail(url) {
    layer.open({
        type: 2,
        content: url, //这里content是一个URL，如果你不想让iframe出现滚动条，你还可以content: ['http://sentsin.com', 'no']
        area: ['1240px', '430px']
    });
}