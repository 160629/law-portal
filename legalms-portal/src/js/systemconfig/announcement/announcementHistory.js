var noticeTable,currentPage,rowCount=0;


layui.use('table', function () {
    noticeTable = layui.table;
    noticeTable.render({
        elem: '#historyDiv'
        , method: 'post',
        contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.announcement.selannouncementMore
        , id: 'noticeTable',
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {field: 'test', title: '',templet:function(d){
            var resultData = d.announcementContent.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
            return "<div class='layui-row' style='position: relative;height: 200px;width:1157px'> " +
                "<div  style='position:absolute;top: 10%;left:2%;font-size: 18px;color: #3C3C3C;font-weight: bold;'>"+d.announcementName +"</div> " +
                "<div> <div  style='position:absolute;top: 30%;left:5%;overflow:auto;height:55%;width: 96%;word-break: break-all;' class='gonggao'>"+resultData +"</div>" +
                " <div  style='position:absolute;bottom: 5%;left:90%;'>"+d.announcementStarttime +"</div></div></div>";
            }}
        ]],
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": res.resultStat == 'SUCCESS' ? 0 : 500, //解析接口状态
                "msg": res.mess, //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.list //解析数据列表
            }
        },
        page: {limit:5,layout:['prev','page','next','skip','count']},
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        }
    });
});
$(function(){
  /*  var index = parent.layer.getFrameIndex(window.name);
    parent.layer.style(index, {
        area: ['1240','500px']
    });*/
   console.log( $('#historyDiv .layui-table').css('width'))


});
