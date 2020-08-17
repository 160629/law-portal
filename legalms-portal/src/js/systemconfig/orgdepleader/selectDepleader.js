//已选回写信息
var treeObj;//树形对象
$(function () {
    selectedUser();//用户选中后事件

    // console.log($('.ourLitigationBodyPage').html(),'11');

    //关闭弹出框
    $('#alertCancelBtn').click(function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    });

});

//暴露给父页面的回调函数
function child(paramData) {
    //初始化公司信息
    userLoad(paramData.param.orgCode);//节点点击加载参与人

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
            parent.layer.msg("请选择人员！");
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
            $.each(objArray, function (index, value) {
                appendOrg(value);
            });
        }
    }
}

//绑定事件
function selectedUser() {
    //删除img显示
    $('.checkedlist').on('mouseenter', 'li', function () {
        $(this).find('.option-icon').show()
    });
    //删除img隐藏
    $('.checkedlist').on('mouseleave', 'li', function () {
        $(this).find('.option-icon').hide()
    });
    //删除已选中人员点击事件
    $('.checkedlist').on('click', '.del', function () {
        var id = $(this).parents("li").attr("id");
        id = id.replace("_data","");
        var treeNode = treeObj.getNodeByParam("id", id, null);
        $("#" + treeNode.id+"_data").remove();

    })
}
//加载人员列表
function userLoad(orgCode) {
    var data = new FormData();
    data.append('orgCode', orgCode);
    // 树形图接口
    ajax_req({
        url: baseUrl.orgdepleader.selectLeaderTree,
        type: 'post',
        contentType: 'application/json;charset=utf-8',
        data: JSON.stringify({
            orgCode: orgCode
        }),
        success: function (res) {
            if (null != res && null != res.data) {
                treeObj = $.fn.zTree.init($('#leftTree'), setting, res.data);
                treeObj.expandAll(true); //默认是收起的
                $.each(res.data, function (i, n) {
                    /*if(n.disabled==true||n.disabled=='true'){
                        var orgData = {
                            orgId: n.id,
                            orgParentId: n.pid,
                            orgName: n.val
                        };
                        var node = treeObj.getNodes();
                        var nodes = treeObj.transformToArray(node);
                        $.each(nodes,function(x,y){
                            if(y.id== n.id){
                                var userInfo = "<li id='" + y.id + "_data' orgId='"+n.id+"'>" + orgData.orgName + "<img data-index='1' src='../../../css/images/cancel.png'></li>";
                                $(".checkedlist").append(userInfo);
                                return false;
                            }
                        });

                    }*/
                });
            } else {
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
    appendOrg(treeNode);
}

//从节点人员中【拼接处理】后添加到已选人员
function appendOrg(treeNode) {
    if (treeNode.type && treeNode.type != 1) {
        parent.layer.msg("只能选择用户节点！");
        return false;
    }
    if ($("#" + treeNode.id + "_data").length == 0) {
        var orgData = {
            id: treeNode.id,
            pid: treeNode.pid,
            val: treeNode.val
        };
        var checkHtml = "<li id='" + treeNode.id + "_data'><input type='hidden' value='" + JSON.stringify(orgData) + "'><span class='text'>" + orgData.val + "</span><div class='option-icon'><i class='del layui-icon layui-icon-delete'></i></div></li>";

        $(".checkedlist").append(checkHtml);
    }
}












