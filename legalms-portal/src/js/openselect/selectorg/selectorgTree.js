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
    setting.check.isSort = paramData.isSort;
    setting.check.isRadio = paramData.isRadio;
    setting.check.isOrg = paramData.isOrg;
    setting.check.isDepart = paramData.isDepart;
    setting.check.showLevel = paramData.showLevel;

    orgUserLog(paramData.param);//初始化公司信息

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
            paramData.callback(array);//返回选中用户，由表单启动流程
            parent.layer.close(index);
        } else {
            parent.layer.msg("请" + paramData.openSetting.title + "！");
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
                appendorgUser(value);
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
function orgUserLog(param) {
// 树形图接口
    ajax_req({
        url: baseUrl.floworg.selectOrgTree,
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
                    var nodes = treeObj.getNodesByParam('level', 0);
                    treeObj.expandNode(nodes[0], true, false, true);
                }

            }else{
                layer.msg("获取节点下人员失败");
            }

        }
    });
}

//ztree树形配置-有时间改公共组件----------
var setting = {
    check: {
        enable: false, //显示勾选框
        isRadio: false //自定义判读单选多选，没有组件化，有时间再改-【待改项】
    },
    view: {
        showIcon: false, //是否显示节点的图标
        showLine: true, //显示节点之间的连线。
        expandSpeed: "slow", //节点展开、折叠时的动画速度
        fontCss: getFontCss
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
    callback: {
        onClick: zTreeOnClick // 值点击事件
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
        treeObj.expandNode(nodeList[i], true, false, true);
    }
}
function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}

//复选框被选中时候触发
function zTreeOnClick(e, treeId, treeNode) {
    if (setting.check.isRadio) {
        $('tbody .checkboxipt').prop('checked', false);
        appendorgUser();//设置选人为空
    }
    appendorgUser(treeNode);
}

//从节点人员中【拼接处理】后添加到已选人员 单位1 省统称2 公司3 部门4 人5
function appendorgUser(treeNode) {
    if (null != treeNode){
        if (setting.check.isOrg == 1 && (treeNode.type == 2 || treeNode.type == 1)) {
            parent.layer.msg("当前不能选择父级节点！");
            $(".curSelectedNode").removeClass('curSelectedNode');
            return false;
        }
        if (setting.check.isUser == 1 && treeNode.type == 1) {
            parent.layer.msg("当前不能选择人员节点！");
            $(".curSelectedNode").removeClass('curSelectedNode');
            return false;
        }
        if (setting.check.isDepart == 1 && treeNode.type == 2) {
            parent.layer.msg("当前不能选择父级节点！");
            $(".curSelectedNode").removeClass('curSelectedNode');
            return false;
        }
        if ($("#" + treeNode.id+ "_data").length == 0) {
            var orgUserData = {
                id: treeNode.id,
                pid: treeNode.pid,
                type:treeNode.type,
                val: treeNode.val,
                orgLevel:treeNode.orgLevel
            };
            orgUserData.parentCompany = parentCompany(treeNode.pid);
            var sortHtml="";
            if (setting.check.isSort){
                sortHtml = "<i class='up layui-icon layui-icon-up'></i><i class='down layui-icon layui-icon-down'></i>";
            }
            var checkHtml = "<li id='" + treeNode.id + "_data'><input type='hidden' value='" + JSON.stringify(orgUserData) + "'><span class='text'>" + orgUserData.val + "</span><div class='option-icon'>" + sortHtml + "<i class='del layui-icon layui-icon-delete'></i></div></li>";
            $(".checkedlist").append(checkHtml);
        }
    } else {
        $(".checkedlist").html("");
    }
}
function parentCompany(pid) {
    if (pid){
        var treeNode = treeObj.getNodeByParam("id", pid, null);
        if (treeNode.type == 3) {
            return {
                id: treeNode.id,
                pid: treeNode.pid,
                type: treeNode.type,
                val: treeNode.val,
                orgLevel:treeNode.orgLevel
            };
        } else if (treeNode.type) {
            return parentCompany(treeNode.pid);
        }else{
            return {};
        }
    }
}
