//已选回写信息
var nextNode = {
    actDefName: '',//下一步活动名
    actDefParam: '',//下一步活动
    userData: {},
    signDept: 0
};
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
function child(flowData) {
    //当前页提交响应事件，执行父页面回调函数
    $('#alertSubmitBtn').on('click', function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        if (!isEmpty(nextNode.userData)) {
            flowData.submitFun(nextNode);//返回选中用户，由表单启动流程
            parent.layer.close(index);
        } else if (nextNode.actDefParam == "finishActivity") {
            //结束节点时
            flowData.submitFun(nextNode);//结束节点返回节点信息
            parent.layer.close(index);
        } else {
            parent.layer.msg("请选择人员！");
        }
    });

    //节点点击加载参与人
    $('.contentbox .next').on('click', 'li', function () {
        var endId = $(this).attr("endId");
        var endName = $(this).html();
        var isCountersign = $(this).attr("isCountersign");
        var isMut = $(this).attr("isMut");
        //判断是否是会签，目前暂时用会签来设定单选或多选

        nextNode.signDept = isCountersign;//会签
        nextNode.isMut = isMut;//选人方式

        //结束节点没得人，所以不是结束节点才能进来获取人员
        userLoad({beginName: endName, endId: endId},flowData);
        appendUser();//已选人清空

        //点击后选中事件
        $(this).toggleClass('active').siblings().removeClass("active");
    });
    //初始化可驱动流程节点列表
    getSelectNextList({
        importantLevel:flowData.importantLevel,
        flowId:flowData.flowId,
        beginId:flowData.beginId,
        loginAcct:flowData.loginAcct,
        businessId:flowData.formId,
        driveWhereParam:{
            jointlyOrgId:flowData.driveWhereParam.jointlyOrgId,//案件协办的协办部门
            mainSeedOrgId:flowData.driveWhereParam.mainSeedOrgId,//案件交办的主送部门
            executiveArmId:flowData.driveWhereParam.executiveArmId,//法律文书执行部门
            unitCode:flowData.driveWhereParam.unitCode//执行、协办单位id
        },
        isReturn:flowData.isReturn,
        mian:flowData.mian,
        versionId:flowData.versionId

    });

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
        treeObj.checkNode(treeNode, false, true);
        treeNode.checked = false;
        appendUser(treeNode);
        // console.log(nextNode.userData)
    });

}

// 获取树形图左侧列表数据
function getSelectNextList(param) {

    var arr = [];
    //树形图左侧列表接口
    ajax_req({
        url: baseUrl.flow.selActivityConfig,
        type: 'post',
        data: JSON.stringify({
            importantLevel: param.importantLevel,
            flowId: param.flowId,
            beginId: param.beginId,
            loginAcct: param.loginAcct,
            processInstId: param.processInstId,
            businessId:param.businessId,
            whereParam: JSON.stringify(param.driveWhereParam),
            isReturn:param.isReturn,
            mian:param.mian,
            versionId:param.versionId
        }),
        success: function (res) {
            if (res.resultStat == "SUCCESS") {
                if (res.data.length > 0) {
                    for (var i = 0; i < res.data.length; i++) {
                        arr.push("<li endId='" + res.data[i].endId + "' isCountersign='" + res.data[i].isCountersign + "'isMut='" + res.data[i].isMut + "'>" + res.data[i].endName + "</li>");
                    }
                }
            }else{
                layer.msg("获取下一步节点信息失败");
            }
            $('.contentbox .next').html(arr.join(''));

            //默认加载第一个选中节点的人员列表--【待改项】
            $('.contentbox .next li').eq(0).click();
        }
    })
}

//从节点人员中【拼接处理】后添加到已选人员
function appendUser(treeNode) {
    if (null != treeNode) {
        if (!treeNode.checked) {
            $("#" + treeNode.id+ "_data").remove();
            delete nextNode.userData[treeNode.id + "_data"];
        } else {
            if (!nextNode.userData[treeNode.id + "_data"]) {
                var userData = {
                    receiverId: treeNode.id,
                    receiverOrgId: treeNode.pid,
                    receiverName: treeNode.val
                };
                nextNode.userData[treeNode.id + "_data"] = userData;
                var userInfo = "<li id='"+treeNode.id+"_data' receiverId='" + userData.receiverId + "'>" + userData.receiverName + "<div class='option-icon'><i class='del layui-icon layui-icon-delete'></i></div></li>";
                $(".checkedlist").append(userInfo);
            }
        }
    } else {
        nextNode.userData = {};//清空已选数据
        $(".checkedlist").html("");
    }
}

//ztree树形配置-有时间改公共组件----------
var setting = {
    check: {
        enable: true, //显示勾选框
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
        //用于捕获父节点折叠之前的事件回调函数，并且根据返回值确定是否允许折叠操作
        // beforeCollapse: beforeCollapse,
        //用于捕获父节点展开之前的事件回调函数，并且根据返回值确定是否允许展开操作
        // beforeExpand: beforeExpand,
        onCheck: checkboxTrue // 复选框被选中时候触发
    }
};

//复选框被选中时候触发
function checkboxTrue(e, treeId, treeNode) {
    if (nextNode.signDept == "0") {
        //不是会签-单选
        setting.check.isRadio = true;//设置选人为单选（单选或多选）
    } else if(nextNode.signDept == "1")  {
        //是会签-多选
        setting.check.isRadio = false;
    }
    //不能拿会签做选择方式判断，暂时这里拦一下，有时间找流程协调参数问题
    if (nextNode.isMut == "1") {
        //可选多个部门下，多个人员
        setting.check.isRadio = false;
    }else if (nextNode.isMut == "2") {
        //可选多个部门下，单个人员
        setting.check.isRadio = false;
    }

    var checked = treeNode.checked;
    if (setting.check.isRadio) {
        //单选情况
        appendUser();//设置选人为空
        treeObj.checkAllNodes(false);
        treeObj.checkNode(treeNode, checked, true);
    }
    if (treeNode.type == 1) {
        //如果是人
        if (nextNode.isMut == 1 || nextNode.isMut != 2) {
            //多部门，同部门人员单选，目前不考虑二级部门--后面配置不完善，暂时定为只要不是2，就是同部门单选
            var parentNode = treeObj.getNodeByParam("id", treeNode.pid, null);
            zTtreeEach(parentNode, function (pNode, cNode) {
                treeObj.checkNode(cNode, false, true);
                appendUser(cNode);
            });
        }
        if (nextNode.isMut == 2) {
            //多部门，人员多选，目前不考虑二级部门
        }
        if(nextNode.isMut == 3){
            //只能选一个部门，同部门人员多选
        }
        treeObj.checkNode(treeNode, checked, true);
        appendUser(treeNode);
    } else if (treeNode.type == 2) {
        //如果是部门
        zTtreeEach(treeNode, function (pNode, cNode) {
            if (cNode.type == 1) {
                if (pNode.checked) {
                    if (pNode.isChildChecked){
                        treeObj.checkNode(cNode, false, true);
                        return false;
                    }
                }
                appendUser(cNode);
                pNode.isChildChecked = treeNode.checked;//标记已选中一个子元素
                return false;
            } else if (cNode.type == 2) {
                return true
            }
        });
    }

}

//根据选择节点加载人员列表
function userLoad(node, param) {

    //添加当前选择节点
    nextNode.actDefName = node.beginName;
    nextNode.actDefParam = node.endId;

// 树形图接口
    ajax_req({
        url: baseUrl.flow.selectParticipatorByCode,
        type: 'post',
        data: JSON.stringify({
            endId: node.endId,
            flowId: param.flowId,
            beginId: param.beginId,
            loginAcct: param.loginAcct,
            processInstId: param.processInstId,
            whereParam: param.driveWhereParam,
            versionId:param.versionId
        }),
        success: function (res) {
            if (res.resultStat == "WARN") {
                if (node.endId != "finishActivity") {
                    layer.msg(res.mess);
                }
                res.data = [];
            }
            treeObj = $.fn.zTree.init($('#leftTree'), setting, res.data);

            if (node.endId == "finishActivity") {
                return true;
            }
            if (res.data.length > 0) {
                if (nextNode.signDept == 0) {
                    //不是会签展开全部
                    treeObj.expandAll(true);
                } else if (nextNode.signDept == 1) {
                    //会签只展开部门
                    var rootnodes = treeObj.getNodes();
                    var defaultLevel = 4;
                    zTtreeEach(rootnodes[0], function (pNode, cNode) {
                        if (pNode.id == 100001) {
                            defaultLevel = 3;//总部比省份地市少一级
                        }
                        if (pNode.level < defaultLevel) {
                            treeObj.expandNode(pNode, true, false, false, true);
                            return true
                        } else {
                            return false;
                        }
                    });
                }
            } else {
                layer.msg("当前节点未查询到配置人员，请联系管理员");
            }
        }
    });
}

// 递归+回调操作树形支点
function zTtreeEach(node, where) {
    // 递归调用子结点
    if (node){
        var childnodes = node.children;
        if (childnodes) {
            var len = childnodes.length;
            for (var i = 0; i < len; i++) {
                var childnode = childnodes[i];
                if (where(node, childnode)) {
                    zTtreeEach(childnode, where);//递归
                }
            }
        }
    }

}