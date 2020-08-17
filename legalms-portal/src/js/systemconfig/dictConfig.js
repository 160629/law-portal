var dictTypeTable;
var dictItemTable;
var openPanelType = 0;
var queryDictItemType;
var dictTypeIndex, dictItemIndex, tempDictName;
layui.use('table', function () {
    dictTypeTable = layui.table;
    dictTypeTable.render({
        elem: '#dictType'
        , method: 'post',
        contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.sysdictdata.selectDictType
        , id: 'dictTypeTable',
        cellMinWidth: 80,
        height: 400,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {type: 'checkbox'},
            {type: 'numbers', title: '序号'}
            , {field: 'dictType', title: '类型代码'}
            , {field: 'dictName', title: '类型名称'}
            , {field: 'remark', title: '备注'}
        ]],
        parseData: function (res) { //res 即为原始返回的数据
            return {
                "code": res.resultStat == 'SUCCESS' ? 0 : 500, //解析接口状态
                "msg": res.mess, //解析提示文本
                "count": res.data.total, //解析数据长度
                "data": res.data.list //解析数据列表
            }
        },
        /** res即为你接口返回的信息
         *  curr 得到当前页码
         *  count 数据总量
         */
        done: function (res, curr, count) {
            if(res.data.length>0){
                queryDictItemType = res.data[0].dictType;
                tempDictName = res.data[0].dictName;
            }else{
                queryDictItemType = '';
                tempDictName='';
            }
            initDictItem(queryDictItemType)

        },
        page: true,
        request: {
            pageName: 'pageNum' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        }
    });
    dictTypeTable.on('checkbox(dictTypeFilter)', function (obj) {

        if (dictTypeTable.checkStatus('dictTypeTable').data.length > 1) {
            $('#delDictType ,#editDictType').attr("disabled", true);
            $('#delDictType,#editDictType').css('color', 'grey');
        } else {
            $('#delDictType,#editDictType').attr("disabled", false);
            $('#delDictType,#editDictType').css('color', '#e9484f');
        }
    });
    dictTypeTable.on('row(dictTypeFilter)', function(obj){

        queryDictItemType = obj.data.dictType;
        tempDictName = obj.data.dictName;
        initDictItem(queryDictItemType)
    });
});
$(function () {

});
/** 修改字典项类型*/
function editDataType() {

    var selectRow = dictTypeTable.checkStatus('dictTypeTable').data;
    if(selectRow.length==1){
        openPanelType = 1;
        $("input[name='dictType']").attr("disabled", true);
        $("input[name='dictType']").css("background-color", '#cccccc');
        var currentRow = selectRow[0];
        $("input[name='dictType']").val(currentRow.dictType);
        $("input[name='dictName']").val(currentRow.dictName);
        $("input[name='remark']").val(currentRow.remark);
        showAddForm('修改');
    }
}
function editDataItem() {
    var selectRow = dictTypeTable.checkStatus('dictItemTable').data;
    if(selectRow.length==1){
        openPanelType = 3;
        var currentRow = selectRow[0];
        $("input[name='dictParentType']").val(currentRow.dictType);
        $("input[name='dictCode']").val(currentRow.dictCode);
        $("input[name='dictParentName']").val(tempDictName);
        $("input[name='dictCabel']").val(currentRow.dictCabel);
        $("input[name='dictValue']").val(currentRow.dictValue);
        $("input[name='dictSort']").val(currentRow.dictSort);
        showAddItemForm('修改');
    }


}
/** 新加或修改字典类型*/
function saveOrUpdateFormTab() {
    var formData = {};
    formData.dictType = $("input[name='dictType']").val();
    if(formData.dictType==''){
        layer.alert('请输入类型代码！', {
            icon: 2,
            title: "提示"
        });
        return;
    }
    formData.dictName = $("input[name='dictName']").val();
    if(formData.dictName ==''){
        layer.alert('请输入类型名称！', {
            icon: 2,
            title: "提示"
        });
        return;
    }
    formData.remark = $("input[name='remark']").val();
    /** 0 添加 1 修改*/
    if (openPanelType == 0) {
        invokeDictEditMethod(baseUrl.sysdictdata.addDictType, formData, 'post')
    } else if (openPanelType == 1) {
        formData.dictId = dictTypeTable.checkStatus('dictTypeTable').data[0].dictId;
        invokeDictEditMethod(baseUrl.sysdictdata.updateDictType, formData, 'post')
    }
}
function saveOrUpdateItemFormTab() {
    var formItemData = {};
    formItemData.dictCabel = $("input[name='dictCabel']").val();
    if(formItemData.dictCabel==''){
        layer.alert('请输入字典项代码！', {
            icon: 2,
            title: "提示"
        });
        return;
    }
    formItemData.dictValue = $("input[name='dictValue']").val();
    if(formItemData.dictValue==''){
        layer.alert('请输入字典项名称！', {
            icon: 2,
            title: "提示"
        });
        return;
    }
    formItemData.dictSort = $("input[name='dictSort']").val();
    /** 3 添加 4 修改*/
    if (openPanelType == 2) {
        formItemData.dictType = $("input[name='dictParentType']").val();
        invokeDictEditMethod(baseUrl.sysdictdata.addSysDictData, formItemData, 'post')
    } else if (openPanelType == 3) {
        formItemData.dictCode = $("input[name='dictCode']").val();
        invokeDictEditMethod(baseUrl.sysdictdata.updateSysDictData, formItemData, 'post')
    }
}
function invokeDictEditMethod(url, data, method) {
    ajax_req({
        url: url,
        type: method,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (rs) {

            if (rs.resultStat == "SUCCESS") {

                layer.msg("保存成功", {time: 1000});
                resetBtnFun();
                if (openPanelType == 0 || openPanelType == 1) {
                    queryDictType();
                    closeFormTab();
                } else if (openPanelType == 3 || openPanelType == 2) {
                    closeFormItemTab();
                    queryDictItem();
                }
            } else {
                layer.alert(rs.mess, {
                    icon: 2,
                    title: "提示"
                });
            }
        }, error: function (e) {
            layer.alert('保存失败，请联系管理员', {
                icon: 2,
                title: "提示"
            });
        }
    });
}
/** 删除选择的字典类型*/
function delDataType() {
    var currentRow = dictTypeTable.checkStatus('dictTypeTable').data;
    if (currentRow.length==1){
        layer.confirm("所有关联的字典类型和字典项都将被删除，确认删除数据字典类型？", {skin: 'btn-class',btn: ['确定', '取消'], title: "提示"}, function () {
            ajax_req({
                url: baseUrl.sysdictdata.deleteDictType + '?dictId=' + currentRow[0].dictId,
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                success: function (rs) {
                    if (rs.resultStat == "SUCCESS") {
                        layer.msg("删除成功", {time: 1000});
                        resetBtnFun();
                        queryDictType();
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
    }
}
function delDataItem() {

    var currentRow = dictTypeTable.checkStatus('dictItemTable').data;
    if (currentRow.length==1){
        layer.confirm("所有关联的数据字典项都被删除，确认删除数据字典项？", { skin: 'btn-class',btn: ['确定', '取消'], title: "提示"}, function () {
            ajax_req({
                url: baseUrl.sysdictdata.deleteSysDictData,
                type: 'post',
                dataType: 'json',
                data: JSON.stringify({"dictCode":currentRow[0].dictCode}),
                contentType: 'application/json',
                success: function (rs) {
                    if (rs.resultStat == "SUCCESS") {
                        layer.msg("删除成功", {time: 1000});
                        resetBtnFun();
                        queryDictItem();
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
    }
}
function initDictItem(dictType) {
    dictTypeTable.render({
        elem: '#dictItem'
        , method: 'post'
        , contentType: 'application/json',
        headers: {token: getLocalInfo("token"), pid: getLocalInfo("pid")}
        , url: baseUrl.sysdictdata.selectSysDictData,
        where: {"dictType": dictType}
        //, data: [{"dictCabel": "123", "dictValue": "123"}]
        , id: 'dictItemTable',
        height: 442,
        cellMinWidth: 120,
        size: 'sm',
        limits: [10, 20, 50, 100],
        cols: [[
            {type: 'checkbox'}
            , {field: 'dictValue', title: '字典项代码'}
            , {field: 'dictType', title: '字典类型', hide: true}
            , {field: 'dictCabel', title: '字典项名称'}
            , {field: 'dictSort', title: '排序'}
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
    dictTypeTable.on('checkbox(dictItemFilter)', function (obj) {
        if (dictTypeTable.checkStatus('dictItemTable').data.length > 1) {
            $('#delDictItem ,#editDictItem').attr("disabled", true);
            $('#delDictItem,#editDictItem').css('color', 'grey');
        } else {
            $('#delDictItem,#editDictItem').attr("disabled", false);
            $('#delDictItem,#editDictItem').css('color', '#e9484f');
        }
    });
}
/** 查询按钮事件*/
function queryDictType() {

    var queryParam = {};
    queryParam.dictType = $("input[name='dictTypeCode']").val();
    queryParam.dictName = $("input[name='dictTypeName']").val();
    dictTypeTable.reload('dictTypeTable', {
        where: queryParam
        , page: {
            curr: 1 //重新从第 1 页开始
        }
    });
}
function queryDictItem() {

    var queryParam = {};
    queryParam.dictType = queryDictItemType;
    dictTypeTable.reload('dictItemTable', {
        where: queryParam
        , page: {
            curr: 1 //重新从第 1 页开始
        }
    });
}
//检索重置
function resetBtnFun() {
    $("input[name='dictTypeCode']").val('');
    $("input[name='dictTypeName']").val('');
    $("input[name='dictCabel']").val('');
    $("input[name='dictValue']").val('');
    $("input[name='dictSort']").val('');
}
function closeFormTab() {
    $("input[name='dictType']").attr("disabled", false);
    $("input[name='dictType']").css("background-color", '#ffffff');
    $("#addDictTypePanel").css("display", "none");
    layer.close(dictTypeIndex);
}
function closeFormItemTab() {
    $("#addDictItemPanel").css("display", "none");
    layer.close(dictItemIndex);
}
//添加数据字典类型
function addDictType() {
    $("#addDictTypePanel")[0].reset();
    openPanelType = 0;
    showAddForm("添加");
}
function addDictItem() {
    $("#addDictItemPanel")[0].reset();
    $("input[name='dictParentName']").val(tempDictName);
    $("input[name='dictParentType']").val(queryDictItemType);
    openPanelType = 2;
    showAddItemForm("添加");
}
/** 展示的添加/修改item form*/
function showAddItemForm(type) {
    layui.use('layer', function () {
        var layer = layui.layer;
        dictItemIndex = layer.open({
            type: 1,
            area: ['475px', '420px']
            , title: [type + '字典项', "text-align:left"]
            , content: $("#addDictItemPanel"),
            cancel: function (layero, index) {
                closeFormItemTab();
            }
        });
    });
}
/** 展示的添加/修改form*/
function showAddForm(type) {
    layui.use('layer', function () {
        var layer = layui.layer;
        dictTypeIndex = layer.open({
            type: 1,
            area: ['475px', '420px']
            , title: [type + '字典类型', "text-align:left"]
            , content: $("#addDictTypePanel"),
            cancel: function (layero, index) {
                closeFormTab()
            }
        });
    });
}
