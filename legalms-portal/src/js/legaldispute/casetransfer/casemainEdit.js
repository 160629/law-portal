var caseUser={};
$(function () {
    formInfo.initFormWrite();

});

function child(paramData) {
    $.each(paramData.param.datas, function (i, v) {
        caseUser[v.creatorAccountId] = v.creatorAccountName;
    });
    $("input[name=caseNum]").val(paramData.param.datas.length);
    //保存
    $('#save_btn').on('click', function () {
        formInfo.submitBtnFun(paramData);
    });
}

var formInfo = {
    //暂存表单数据
    saveFormObj: function (model, success,warn) {
        ajax_req({
            url: baseUrl.caseTransfer.addCaseTransferInfo,
            type: 'post',
            data: JSON.stringify(model),
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    success(res);
                }else if (res.resultStat == "WARN"){
                    warn(res)
                }else {
                    layer.msg("保存失败", {time: 200})
                }
            }
        });
    },
    selectOrgUserTreePage: function () {
        parent.openSelectWindow.selectorguserTree({
            param: {flag: "2"},
            isDepart: 1,
            callback: function (res) {

                if (caseUser[res[0].id]) {
                    console.log(123)
                    layer.msg('接收人不能为卷宗员负责人',{ icon:5, time:1500, shade:0.4 });
                }else{
                    $("input[name=accountName]").val(res[0].val);
                    $("input[name=accountId]").val(res[0].id);
                    $("input[name=deptId]").val(res[0].pid);
                }
            }
        })
    },
    //关闭
    closeBtnFun: function () {
        var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
        parent.layer.close(index);
    },
    //提交
    submitBtnFun: function (paramData) {
        formInfo.formCheck(function ($form) {
            var formBaseObj = formInfo.getFormBaseObj();
            var datas = paramData.param.datas;
            formBaseObj.caseIdList = [];
            formBaseObj.unitIdList = [];
            formBaseObj.caseStatusList = [];
            formBaseObj.caseCodeList = [];
            $.each(datas, function (index, value) {
                formBaseObj.caseIdList.push(value.caseId);
                formBaseObj.unitIdList.push(value.creatorUnitId);
                formBaseObj.caseStatusList.push(value.caseStatus);
                formBaseObj.caseCodeList.push(value.caseCode)
            });
            formInfo.saveFormObj(formBaseObj, function (res) {
                //显示提交成功页面
                $("#transferForm").hide();
                $("span[name=num]").html(formBaseObj.caseIdList.length);
                $("span[name=loginAct]").html(formBaseObj.accountId);
                $("span[name=loginName]").html(formBaseObj.accountName);
                $("#transferResult").show();
            },function (res) {
                $("#transferForm").hide();
                var msgs=[];
                //显示不可移交情况页面
                $.each(res.data,function (index,value) {
                    var key = Object.keys(value)[0];
                    msgs.push("<li>卷宗：" + key + value[key] + res.mess + "</li>");
                });
                $("#transferWARNResult").show().find(".transfer-info").html(msgs.join(''));
            });
        })
    },
    //表单校验
    formCheck: function (callback) {
        layui.use(['form'], function () {
            var form = layui.form;
            form.verify(formBase.form_verify);

            form.on('submit()', function (data) {
                 callback(data);
            });
        });
    },
    //获取组装处理后的表单对象
    getFormBaseObj: function () {
        var formObj = $("#model_form").serializeJSON();
        //准备基础对象
        var model = {
            "accountName": formObj.accountName || '',
            "accountId": formObj.accountId || 0,
            "deptId": formObj.deptId || '',
            "tansferReason": formObj.tansferReason || ''
        };
        return model;
    },
    //取地址栏参数
    getParam: function () {
        //接收参数
        var formId = getUrlParam("formId");//取表单业务数据Id

        if (!isEmpty(formId)) {
            formInfo.formId = formId;
        }
    },
    //绑定按钮事件
    bindEvent: function () {

        $(".selectOrgUserTreePage").on("click", formInfo.selectOrgUserTreePage);

        //底部按钮事件加载
        $('.closebtn').on('click', formInfo.closeBtnFun);//关闭
    },
    //初始化表单
    initFormWrite: function () {
        formInfo.getParam();
        formInfo.bindEvent();

        if (!isEmpty(formInfo.formId)) {
            var resourceData = formInfo.requestFormObj(formInfo.formId);//根据表单Id获取表单信息
            if (!isEmpty(resourceData)) {

                formInfo.formObj = resourceData;//写入表单信息

            } else {
                layer.msg("未获取到表单信息");
            }
        }

    }
};
