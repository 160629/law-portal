var defaultParam = {
    chooseType: "1",
    pageNum:1,
    pageSize:10
};
var defaultParam1 = {
    toerId: '',
    viewStatus: 0,
    pageNum: 1,
    pageSize: 10
};
$(function () {
    // 初始化
    $('.tabbtn').on('click','li', tabletab); //表格tab切换
    loadData0(defaultParam);
    // loadData1(defaultParam1);

    //-------------数据加载
    var userInfo = getUserData('pid');
    var currRoleList = userInfo.ROLECODELIST.toString();
    getSelannouncement(currRoleList);//加载快捷入口
    getnoticedata(); //获取首页公告展示最新5条消息});
});



//表格tab切换
function tabletab() {

    $(this).addClass('active').siblings('li').removeClass('active');
    var tab = $(this).attr('data-tab');
    if (tab == '0') {
        $("#div-table1").hide();
        $("#div-table0").show();
        loadData0(defaultParam);
        // 渲染表格
    } else if (tab == '1') {
        //渲染表格
        $("#div-table0").hide();
        $("#div-table1").show();
        loadData1(defaultParam1);
    }
}

// 渲染公告
function runderNotice(arg) {
    var arr = [];
    for (var i = 0; i < arg.length; i++) {
        arr.push(
            '<li class="layui-timeline-item">' +
            '<i class="layui-icon layui-timeline-axis">&#xe623;</i>' +
            '<div class="layui-timeline-title">' +
            '<a href="#" class="title-link" id="' + arg[i].announcementId + '" title="' + arg[i].announcementName + '">' + arg[i].announcementName + '</a>'
            +'<span class="riqi">'+ arg[i].announcementCreatetime+ '</span></div>' +
            '</li>'
        )
    }
    $('#announcementTable').html(arr.join(''));

    $('#announcementTable .title-link').on('click', function () {
        var id = $(this).attr("id");
        var path="src/html/systemconfig/announcement/announcementView.html";
        var param="?id="+id;
        layer.open(
            {
                type: 2, //此处以iframe举例
                title: '标题',
                area:['1240px','430px'],
                shade: 0.1,
                // maxmin: true,
                content: path + param,
                zIndex: layer.zIndex,
                success: function (layero) {
                    layer.setTop(layero);
                },
                cancel:function () {
                }
            })
    });

}
//拼接快捷入口html
function appendQuickHtml(objs) {
    var li = "";
    $.each(objs,function (index,cur) {

        if (index > 0 && index % 6 == 0) {
            li += li = "" ? "" : "</ul></div>";
            li += "<div class='swiper-slide'><ul class='mainul'>";
        }
        var current_li = "<li class='lileft link' moduleName='" + cur.moduleName + "'pageKey='" + cur.pageKey + "'openType='" + cur.openType + "'>" +
            "<img class='img-d' src='src/css/images/" + (cur.iconImg.replace(".png", "-d.png")) + "' alt='" + cur.moduleName + "' >" +
            "<img class='img-a hide' src='src/css/images/" + cur.iconImg + "' alt='" + cur.moduleName + "' >" +
            "<div>" + cur.displayName + "</div>" +
            "</li>";
        li += current_li;
    });
    var html = "<div class='swiper-slide'><ul class='mainul'>"+li+"</ul></div>";
    $("#quick_ul").append(html);

    $("#quick_ul").on("click",".link",function () {
        var moduleName = $(this).attr("moduleName");
        var pageKey = $(this).attr("pageKey");
        var pageType = $(this).attr("openType");
        if (!isEmpty(moduleName)){
            jumpDetails(moduleName, pageKey, pageType, "&moduleName=" + moduleName);
        }else{
         layer.msg("找不到表单页面，请联系管理员");
        }
    });
    $("#quick_ul .link").hover(function () {
        $(this).find(".img-a").show();
        $(this).find(".img-d").hide();
    },function () {
        $(this).find(".img-d").show();
        $(this).find(".img-a").hide();
    });
    var swiperStting = {
        loop: false, // 循环模式选项
        preventInteractionOnTransition : true,
        simulateTouch : false,//禁止鼠标模拟
        // 前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
            hideOnClick: true,
            hiddenClass: 'my-button-hidden'
        }
    };
    if (objs.length > 6) {
        swiperStting.loop = true;
        swiperStting.simulateTouch = true;
        $(".swiper-container").append("<div class='swiper-button swiper-button-prev'></div>" +
            "<div class='swiper-button swiper-button-next'></div>");
    }
//快捷入口滚动事件
    var mySwiper = new Swiper('.swiper-container',swiperStting);

}

//获取首页公告展示最新5条消息
function getnoticedata() {
    ajax_req({
        url: baseUrl.announcement.selannouncement,
        type: 'get',
        success: function (res) {
            runderNotice(res.data)
        },
        wrong: function (err) {
            console.log(err)
        }
    })
}

//获取快捷入口数据
function getSelannouncement(roleList) {
    var obj = {
        roleCode : roleList
    };
    if (roleList){
        ajax_req({
            url: baseUrl.index.selectByRoleCode,
            type: 'post',
            data: JSON.stringify(obj),
            success: function (res) {
                appendQuickHtml(res.data);
            }
        });
    }
}

//获取待办-列表数据加载
function loadData0(param) {
    ajax_req({
        url: baseUrl.taskList.taskList,
        type: 'post',
        async: false,
        data: JSON.stringify(param),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                    var i = 1;
                    for (var index in rs.data.taskList) {
                        var data = rs.data.taskList[index];
                        var time = data.time;
                        var formatTime = time.replace(pattern, '$1-$2-$3');
                        var businessId = data.type.substr(data.type.indexOf('#') + 1);
                        businessId = businessId.substr(0, businessId.indexOf('#'));
                        html += "<tr>" +
                            "<td>" + (i++) + "</td>" +
                            "<td><a href='#' class='title-link td-title index-task1' processInstId='"+data.processInstId
                            +"' businessType = '" + data.person
                            + "' businessId = '" + businessId
                            + "' currActivityDefId='"+data.currActivityDefId
                            +"' currActivityDefName='"+data.currActivityDefName
                            +"' title='"+data.title+"'>" + data.title + "</a></td>" +
                            "<td>" + data.code + "</td>" +
                            "<td>" + data.type.substr(data.type.lastIndexOf('#') + 1) + "</td>" +
                            "<td>" + formatTime + "</td>" +
                            "</tr>";
                    }
                    // $("#task_total0").html(rs.data.count);//加载数量
                }
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table0>tbody").html(html);
                $('#bus-table0 .title-link').on('click', function () {
                    var processInstId = $(this).attr("processInstId");
                    var businessId = $(this).attr("businessId");
                    var businessType = $(this).attr("businessType");
                    var currActivityDefId = $(this).attr("currActivityDefId");
                    var currActivityDefName = $(this).attr("currActivityDefName");
                    var mode = "task";
                    var pageKey = "view";
                    var pageType = 1;
                    jumpDetails(businessType, pageKey, pageType, "&moduleName=" + businessType + "&formId=" + businessId + "&processInstId=" + processInstId + "&currActivityDefId=" + currActivityDefId + "&currActivityDefName=" + encodeURI(currActivityDefName) + "&mode=" + mode);
                });

            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
}

//获取待阅-列表数据加载
function loadData1(param) {
    defaultParam1.toerId = getLocalInfo('loginAccount');//当前用户
    ajax_req({
        url: baseUrl.TFlowUnvie.selectAll,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        async: false,
        data: JSON.stringify(param),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "";
                if (rs.data != null) {
                    var pattern = /(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/;
                    var i = 1;
                    for (var index in rs.data.list) {
                        var data = rs.data.list[index];
                        data = nullFormatStr(data);
                        var time = data.createTime;
                        var formatTime = time.replace(pattern, '$1-$2-$3 $4:$5:$6');
                        html += "<tr>" +
                            "<td>" + (i++) + "</td>" +
                            "<td><a class='title-link  td-title index-task2' title = '"+data.viewTitle+"' viewUrl = '" + data.viewUrl  + "' viewId = '" + data.viewId + "'>" + data.viewTitle + "</a></td>" +
                            "<td>" + dateFormat(formatTime,"yyyy-MM-dd") + "</td>" +
                            "</tr>";
                    }
                    // $("#task_total1").html(rs.data.total);//加载数量

                }
                if (!html){
                    html = "<div class='noDate'>暂无数据信息</div>";
                }
                $("#bus-table1>tbody").html(html);
                $('#bus-table1 .title-link').on('click', function () {
                    var viewId = $(this).attr("viewId");
                    var title = $(this).attr("title");
                    //待阅跳转待实现
                    jumpUnviewDetails(title, viewId);
                });

            }else{
                var msg = "<div class='noDate'>" + rs.mess + ":获取数据错误，请联系管理员</div>";
                $("#bus-table>tbody").html(msg);
            }
        }
    });
}

//跳转连接--表单
function jumpDetails(moduleName,pageKey,openType,param) {
    if (moduleName) {
        var path = pageUrl.getBusinessUrl(moduleName, pageKey) + "?1=1" + (param || '');
        if (openType == 1) {
            openFullWindow(path, {
                closed: function () {
                    $('.tabbtn li').eq(0).click();//关闭后重新加载任务列表
                }
            });
        } else if (openType == 2) {
            window.location.href = path;
        }
    } else {
        layer.msg("请求数据业务类型错误");
    }
}
function openAnnouncementList() {
    layer.open(
        {
            type: 2, //此处以iframe举例
            title: '标题',
            area:['1240px','530px'],
            shade: 0.1,
            // maxmin: true,
            content: "src/html/systemconfig/announcement/announcementHistory.html",
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            },
            cancel:function () {
                getnoticedata();
            }
        })
}

//跳转连接
function jumpUnviewDetails(title,viewId) {

    var path = pageUrl.unview.view;
    var param = "?formId=" + viewId;

    layer.open(
        {
            type: 2, //此处以iframe举例
            title: title,
            area:['1240px','530px'],
            shade: 0.1,
            content: path + param,
            zIndex: layer.zIndex,
            success: function (layero) {
                layer.setTop(layero);
            },end : function(){
                $('.tabbtn li').eq(1).click();//关闭后重新加载任务列表
            }
        })
}