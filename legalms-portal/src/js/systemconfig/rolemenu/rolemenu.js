var roleCodeTable, roleUserItemTable,roleMenuTreeObj;
var queryRoleCode;
var roleInfoTab;
//加载默认列表
layui.use('table', function () {
    roleCodeTable = layui.table;
    roleCodeTable.render({
        elem: '#roleCodeTable'
        , method: 'post',
        contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.rolemenu.selectRole
        , id: 'roleCodeTable',
        cellMinWidth: 80,
        height: 400,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {type: 'numbers', title: '序号'}
            , {field: 'roleCode', title: '角色代码',width:200}
            , {field: 'roleName', title: '角色名称'}
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
    roleCodeTable.on('row(roleCodeTable)', function (obj) {
        queryRoleCode = obj.data.roleCode;
        $(obj.tr).addClass("tr-select").siblings().removeClass("tr-select");
        roleInfoTab.tabChange('roleInfoTab', "1");
        $("#roleTab").show();
    });

    initMenuItem();//加载所有菜单
});
//加载tab项
layui.use('element', function () {
    roleInfoTab = layui.element;

    roleInfoTab.on('tab(roleInfoTab)', function (data) {
        if (data.index == 0) {
            initMenuItem(queryRoleCode);
        }
        if (data.index == 1) {
            initRoleUserItem(queryRoleCode);
        }
    });
});
$(function () {
});
//获取所有菜单
//应该是树形菜单，再改
function initMenuItem(roleCode) {
    ajax_req({
        url: baseUrl.rolemenu.selectMenu,
        data: JSON.stringify({}),
        type: 'post',
        success: function (res) {
            if (res.resultStat == "SUCCESS") {
                if (res.data != null) {
                    res.data.shift();
                    roleMenuTreeObj = $.fn.zTree.init($('#leftTree'), setting, res.data);
                    roleMenuTreeObj.expandAll(true);
                    initRoleMenuItem(roleCode)
                }
            }
        }
    });
}

//ztree树形配置-有时间改公共组件----------
var setting = {
    view: {
        showLine:false,
        showIcon:false
    },
    check:{
        enable:true,
        chkStyle: "checkbox",
        chkboxType: { "Y": "p", "N": "s" },
        chkDisabledInherit: true
    },
    data: {
        simpleData: {
            enable: true, //使用简单数据模式
            idKey: "menuId", //节点数据中保存唯一标识的属性名称
            pIdKey: "parentMenuId", //节点数据中保存其父节点唯一标识的属性名称
            rootPId: "" //用于修正根节点父节点数据 默认值：null
        },
        key: {
            name: 'menuName'
        }
    }
};

//加载角色下菜单
function initRoleMenuItem(roleCode) {

    ajax_req({
        url: baseUrl.rolemenu.selectRoleMenu,
        type: 'post',
        data: JSON.stringify({
            roleCode: roleCode
        }),
        success: function (rs) {
            if (rs.resultStat == "SUCCESS") {
                if (rs.data != null) {
                    for (var index in rs.data) {
                        var data = rs.data[index];
                        if (data){
                            var node = roleMenuTreeObj.getNodeByParam("menuId", data.menuId, null);
                            if (node){
                                roleMenuTreeObj.checkNode(node, true, true);
                                roleMenuTreeObj.setChkDisabled(node, true, true);
                            }
                        }
                    }
                    var nodes = roleMenuTreeObj.getCheckedNodes(false);
                    for (var i in nodes){
                        roleMenuTreeObj.setChkDisabled(nodes[i], true, true);
                    }

                }
            }
        }
    });
}

//加载角色用户
function initRoleUserItem(roleCode) {
    roleUserItemTable = layui.table;
    roleUserItemTable.render({
        elem: '#roleUserItem'
        , method: 'post'
        , contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.rolemenu.selectUser + "?roleCode = " + roleCode
        , where: {
            roleCode: roleCode
        }
        , id: 'roleUserItemTable',
        height: 442,
        cellMinWidth: 120,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {field: 'userName', title: '人员姓名'},
            {field: 'companyName', title: '所属公司'},
            {field: 'orgName', title: '所属部门'},
            {field: 'accountId', title: '用户登录名'}
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
    queryParam.roleCode = $("input[name='roleCode']").val();
    queryParam.roleName = $("input[name='roleName']").val();
    roleCodeTable.reload('roleCodeTable', {
        where: queryParam
        , page: {
            curr: 1 //重新从第 1 页开始
        }
    });
}

//检索重置
function resetBtnFun() {
    $("input[name='roleCodeCode']").val('');
    $("input[name='roleCodeName']").val('');
    $("input[name='roleCabel']").val('');
    $("input[name='roleValue']").val('');
}