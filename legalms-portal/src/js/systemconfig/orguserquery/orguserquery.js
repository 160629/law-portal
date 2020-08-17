var treeObj,roleOrgListTable,initUserListTable;
var orgInfoTab,userInfoTab;
var accountId;
var searchName="",nodeList = [];
$(function () {
    orgLog({
        flag:4
    });

    $("#searchName").bind("input", searchNode).val('');
});
//加载机构属性信息
function orgLog(param) {

// 树形图接口
    ajax_req({
        url: baseUrl.orgleader.selectLeaderTree,
        type: 'post',
        data: JSON.stringify(param),
        success: function (res) {
            if (null != res && null != res.data) {
                treeObj = $.fn.zTree.init($('#leftTree'), setting, res.data);
            }else{
                layer.msg("获取节点下机构信息失败");
            }

        }
    });
}
function ajaxDataFilter(treeId, parentNode, responseData) {
    if (responseData) {
        return responseData.data;
    }
}
//ztree树形配置-有时间改公共组件----------
var setting = {
    view: {
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
        treeObj.expandNode(nodeList[i], highlight, false, true);
    }
}
function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
//复选框被选中时候触发
function zTreeOnClick(e, treeId, treeNode) {

    var orgType = treeNode.type;
    var id  = treeNode.id;
    if (orgType == 1) {
        accountId = id;
        loadUserTab(id);
    } else if (orgType == 2) {
        loadOrgTab(id)
    }
}

function loadUserTab(accountId) {
//加载tab项
    layui.use('element', function () {
        userInfoTab = layui.element;
        userInfoTab.on('tab(userInfoTab)', function (data) {
            if (data.index == 0) {
                //人员信息
                initUserInfo(accountId);
            }
            if (data.index == 1) {
                initAllAuthRole(accountId);
            }
        });
    });

    userInfoTab.tabChange('userInfoTab', "1");

    $('#orgTab').hide();
    $('#userTab').show();
}
function loadOrgTab(orgCode) {

//加载tab项
    layui.use('element', function () {
        orgInfoTab = layui.element;

        orgInfoTab.on('tab(orgInfoTab)', function (data) {
            if (data.index == 0) {
                //权限信息
                initOrgInfo(orgCode);
            }
            if (data.index == 1) {
                //下级机构列表
                initOrgListItem(orgCode);
            }
            if (data.index == 2) {
                //下属用户列表
                initUserListItem(orgCode);
            }
        });
    });

    orgInfoTab.tabChange('orgInfoTab', "1");

    $('#userTab').hide();
    $('#orgTab').show();
}
//加载所有权限
function initAllAuthRole(accountId) {

    ajax_req({
        url: baseUrl.rolemenu.selectAllRole,
        type: 'post',
        data: JSON.stringify({
            accountId:accountId
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                var html = "<ul>";
                if (rs.data != null) {
                    for (var index in rs.data) {
                        var data = rs.data[index];
                        html += "<li><input type='checkbox' id='"+ data.roleCode.trim() +"' disabled>" + data.roleName + "</li>";
                    }
                }
                html += "</ul>";
                $("#autoInfo").html(html);

                initAlreadyAuthRole(accountId);
            }
        }
    });
}
//加载已授权角色
function initAlreadyAuthRole(accountId) {

    $("#autoInfo").find("input[type=checkbox]").prop("checked", false);
    ajax_req({
        url: baseUrl.account.selectAccRoleImpowerByAccountId,
        type: 'post',
        data: JSON.stringify({
            accountId:accountId
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                if (rs.data != null) {
                    for (var index in rs.data) {
                        var data = rs.data[index];
                        $("#" + data.roleCode).prop("disabled", false).prop("checked", true).prop("disabled", true);
                    }
                }
            }
        }
    });
}
//加载未授权角色
function initNoAuthRole(accountId) {
    $("#autoInfo").find("input[type=checkbox]").prop("checked", false);
    ajax_req({
        url: baseUrl.account.selectUnAccRoleImpowerByAccountId,
        type: 'post',
        data: JSON.stringify({
            accountId:accountId
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                if (rs.data != null) {
                    for (var index in rs.data) {
                        var data = rs.data[index];
                        $("#" + data.roleCode).prop("disabled", false).prop("checked", true).prop("disabled", true);
                    }
                }
            }
        }
    });
}
//加载机构信息
function initOrgInfo(orgCode) {

    ajax_req({
        url: baseUrl.orgbean.selectOrgInfoByorgCode,
        type: 'post',
        data: JSON.stringify({
            orgCode:orgCode
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                if (rs.data != null) {
                    var data = rs.data;
                    $("#orgInfo").jsonSerializeForm(data);
                }
            }
        }
    });
}
//加载人员信息
function initUserInfo(accountId) {

    ajax_req({
        url: baseUrl.accountlogic.selectUserInfoByAccountId,
        type: 'post',
        data: JSON.stringify({
            accountId:accountId
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                if (rs.data != null) {
                   var data = rs.data;
                    $("#userInfo").jsonSerializeForm(data);
                }
            }
        }
    });
}
//下级机构列表
function initOrgListItem(orgCode) {

    roleOrgListTable = layui.table;
    roleOrgListTable.render({
        elem: '#roleOrgListTable'
        , method: 'post'
        , contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.orgbean.selectSubordinateOrgInfoByorgCode + "?orgCode = " + orgCode
        , where: {
            orgCode: orgCode
        }
        , id: 'roleOrgListTable',
        height: 442,
        cellMinWidth: 120,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {field: 'orgName', title: '机构名称'},
            {field: 'orgCode', title: '机构代码'},
            {field: 'companyName', title: '机构类型'},
            {field: 'accountStatus', title: '机构状态'}
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
}

//用户信息列表
function initUserListItem(accountOrgId) {
    initUserListTable = layui.table;
    initUserListTable.render({
        elem: '#initUserListTable'
        , method: 'post'
        , contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.accountlogic.selectUserInfoByOrgCode + "?accountOrgId = " + accountOrgId
        , where: {
            accountOrgId: accountOrgId
        }
        , id: 'initUserListTable',
        height: 442,
        cellMinWidth: 120,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {field: 'accountCurUserName', title: '人员姓名'},
            {field: 'accountOrgId', title: '人员代码'},
            {field: 'accountId', title: '用户登录名'},
            {field: 'accountStatus', title: '用户状态'}
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
}
/** 查询按钮事件*/
function queryBtnFun() {

    var queryParam = {};
    queryParam.roleCode = $("input[name='roleCodeCode']").val();
    queryParam.roleName = $("input[name='roleCodeName']").val();
}