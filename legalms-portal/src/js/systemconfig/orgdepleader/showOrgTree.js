 //已选回写信息
var treeObj;//树形对象
$(function () {

    selectedUser();//用户选中后事件
    //关闭弹出框
    $('#alertCancelBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

});

//暴露给父页面的回调函数
function child(paramData) {
    setting.check.isRadio = paramData.isRadio;

    orgUserLog(paramData.param);//初始化公司信息

    //当前页提交响应事件，执行父页面回调函数
    $('#alertSubmitBtn').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            var $orgs = $(".checkedlist li");
            if ($orgs.length > 0) {
                var array = [];
                $.each($orgs, function (i, $li) {
                    var value = $($li).find("input[type=hidden]").val();
                    array.push(eval("(" + value + ")"));
                });
            paramData.callback(array);//返回选中用户，由表单启动流程
            parent.layer.close(index);
        } else {
            parent.layer.msg("请选择公司！");
        }
    });
}

//绑定事件
function selectedUser() {
    //删除img显示
    $('.checkedlist').on('mouseenter', 'li', function () {
        $(this).find('.del').show()
    });
    //删除img隐藏
    $('.checkedlist').on('mouseleave', 'li', function () {
        $(this).find('.del').hide()
    });
    //删除已选中人员点击事件
    $('.checkedlist').on('click', '.del', function () {
        var id = $(this).parents("li").attr("id");
        id = id.replace("_data","");
        var treeNode = treeObj.getNodeByParam("id", id, null);
        $("#" + treeNode.id+"_data").remove();

    });
}
//加载人员列表
function orgUserLog(param) {
// 树形图接口
    ajax_req({
        url: baseUrl.orgdepleader.selectOrgTree,
        type: 'post',
        data: JSON.stringify(param),
        success: function (res) {
            if (null != res && null != res.data) {
                treeObj = $.fn.zTree.init($('#leftTree'), setting, res.data);
                // //默认显示第一级
                // var node = treeObj.getNodeByParam('level', 0);
                // treeObj.expandNode(node, true, false, false);
                treeObj.expandAll(true);
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
        expandSpeed: "slow" //节点展开、折叠时的动画速度
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
//复选框被选中时候触发
function zTreeOnClick(e, treeId, treeNode) {
    if (setting.check.isRadio) {
        $('tbody .checkboxipt').prop('checked', false);
        appendorgUser();//设置选人为空
    }
    appendorgUser(treeNode);
}

//从节点人员中【拼接处理】后添加到已选人员
function appendorgUser(treeNode) {
    if (null != treeNode){
         if ($("#" + treeNode.id + "_data").length == 0) {
            var orgUserData = {
                id: treeNode.id,
                pid: treeNode.pid,
                type:treeNode.type,
                val: treeNode.val
            };
             var checkHtml = "<li id='" + treeNode.id + "_data'><input type='hidden' value='"+JSON.stringify(orgUserData)+"'><span class='text'>" + orgUserData.val + "</span><div class='option-icon'><i class='up layui-icon layui-icon-up'></i><i class='down layui-icon layui-icon-down'></i><i class='del layui-icon layui-icon-delete'></i></div></li>";
             $(".checkedlist").append(checkHtml);
        }
    } else {
        $(".checkedlist").html("");
    }
}
