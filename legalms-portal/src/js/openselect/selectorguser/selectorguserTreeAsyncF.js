//已选回写信息
var treeObj;//树形对象
var searchName="",nodeList = [];
$(function () {

    selectedUser();//用户选中后事件
    //关闭弹出框
    $('#alertCancelBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

    $("#searchName").bind("input", searchNode).val('');
});
//暴露给父页面的回调函数
function child(paramData) {
    setting.check.isRadio = paramData.isRadio;
    setting.check.isUser = paramData.isUser;
    setting.check.isDepart = paramData.isDepart;
    setting.check.isOrg = paramData.isOrg;
    setting.check.showLevel = paramData.showLevel;

    orgUserTree(paramData.param);//初始化公司信息

    //当前页提交响应事件，执行父页面回调函数
    $('#alertSubmitBtn').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        var $orgUsers = $(".checkedlist li");
        if ($orgUsers.length > 0) {
            var array = [];
            $.each($orgUsers, function (i, $li) {
                var value = $($li).find("input[type=hidden]").val();
                array.push(eval("(" + value + ")"));
            });
            paramData.callback(array);
            parent.layer.close(index);
        } else {
            parent.layer.msg("请选择公司！");
        }
    });

    //读取已选数据并加载
    if (paramData.selectItem){
        var data = paramData.selectItem;
        if (data.id){
            var idS = data.id;
            var objArray=[];
            //切出所有需要回填的所有存储数组对象的数组
            $.each(data, function (i, value) {
                if (value) {
                    var valArray = value;
                    $.each(idS, function (j, value) {
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
            // console.log(objArray);
            $.each(objArray, function (index, value) {
                appendOrgUser(value);
            });
        }
    }
}

//绑定事件
function selectedUser() {
    //删除图标显示
    $('.checkedlist').on('mouseenter', 'li', function () {
        $(this).find('.option-icon').show()
    });
    //删除图标隐藏
    $('.checkedlist').on('mouseleave', 'li', function () {
        $(this).find('.option-icon').hide()
    });
    //删除已选中人员点击事件
    $('.checkedlist').on('click', '.del', function () {
        var id = $(this).parents("li").attr("id");
        id = id.replace("_data","");
        var treeNode = treeObj.getNodeByParam("id", id, null);
        $("#" + treeNode.id+"_data").remove();

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
//加载人员列表
function orgUserTree(param) {
    setting.async.otherParam = param;

// 树形图接口
    ajax_req({
        url: baseUrl.orgleader.selectLeaderTree,
        type: 'post',
        data: JSON.stringify(param),
        success: function (res) {
            if (null != res && null != res.data) {
                treeObj = $.fn.zTree.init($('#leftTree'), setting, res.data);
                if (!isEmpty(setting.check.showLevel)){
                    var nodes = treeObj.getNodesByParam('level', setting.check.showLevel);

                    $.each(nodes,function (i,node) {
                        treeObj.expandNode(node, true, false, true);
                    });
                    $("#leftTree").animate({scrollTop: 0}, 100);//1000是ms,也可以用slow代替});
                }else {
                    var nodes= treeObj.getNodesByParam('level', 0);
                    treeObj.expandNode(nodes[0], true, false, true);
                }
            }else{
                layer.msg("获取节点下人员失败");
            }

        }
    });
}
function ajaxDataFilter(treeId, parentNode, responseData) {
    if (responseData) {
        return responseData.data;
    }
}
function zTreeOnAsyncSuccess() {
}
//ztree树形配置-有时间改公共组件----------
var setting = {
    view: {
        showIcon: false, //是否显示节点的图标
        showLine: true, //显示节点之间的连线。
        expandSpeed: "slow", //节点展开、折叠时的动画速度
        dblClickExpand: true,
        fontCss: getFontCss
    },
    async: {
        enable: true,
        type: 'post',
        url:baseUrl.orgleader.selectLeaderTree,
        contentType: 'application/json',
        headers: {
            "pid": getLocalInfo("pid"),
            "token": getLocalInfo("token")
        },
        autoParam:["id=orgCode"],
        otherParam:{"flag":"4"},
        dataFilter: ajaxDataFilter
    },
    data: {
        simpleData: {
            enable: true, //使用简单数据模式
            idKey: "id", //节点数据中保存唯一标识的属性名称
            pIdKey: "pid", //节点数据中保存其父节点唯一标识的属性名称
            rootPId: "" //用于修正根节点父节点数据 默认值：null
        },
        key: {
            name: 'val'
        }
    },
    check: {
        enable: false, //显示勾选框
        isRadio: false //自定义判读单选多选，没有组件化，有时间再改-【待改项】
    },
    callback: {
        onClick: zTreeOnClick, // 复选框被选中时候触发
        onAsyncSuccess: zTreeOnAsyncSuccess
    }
};

function searchNode() {
    searchName = $("#searchName").val();
    var value = $.trim(searchName);
    if (value){
        updateNodes(false);
        nodeList = treeObj.getNodesByParamFuzzy("val", value);
        updateNodes(true);
    }
}
function updateNodes(highlight) {
    for (var i = 0, l = nodeList.length; i < l; i++) {
        nodeList[i].highlight = highlight;
        treeObj.updateNode(nodeList[i]);
        treeObj.expandNode(nodeList[i], highlight, false, true);
    }
}
function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
//复选框被选中时候触发
function zTreeOnClick(e, treeId, treeNode) {
    if (setting.check.isRadio) {
        $('tbody .checkboxipt').prop('checked', false);
        appendOrgUser();//设置选人为空
    }
    appendOrgUser(treeNode);
}

//从节点人员中【拼接处理】后添加到已选人员
function appendOrgUser(treeNode) {

    if (null != treeNode){
        if (setting.check.isDepart == 1 && treeNode.type == 2) {
            parent.layer.msg("当前不能选择父级节点！");
            $(".curSelectedNode").removeClass('curSelectedNode');
            return false;
        }
         if ($("#" + treeNode.id + "_data").length == 0) {
            var orgData = {
                id: treeNode.id,
                pid: treeNode.pid,
                val: treeNode.val,
                type: treeNode.type,
                deptName: treeNode.deptName,
                orgId: treeNode.orgId,
                orgName: treeNode.orgName
            };
             var checkHtml = "<li id='" + treeNode.id + "_data'><input type='hidden' value='"+JSON.stringify(orgData)+"'><span class='text'>" + orgData.val + "</span><div class='option-icon'><i class='up layui-icon layui-icon-up'></i><i class='down layui-icon layui-icon-down'></i><i class='del layui-icon layui-icon-delete'></i></div></li>";
             $(".checkedlist").append(checkHtml);
        }
    } else {
        $(".checkedlist").html("");
    }
}
