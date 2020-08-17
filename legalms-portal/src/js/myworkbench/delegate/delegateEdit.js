$(function () {
    var formInfo = {
        closebtnFun: function () {
            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            parent.layer.close(index);
        },
        saveBtnFun: function () {
            formInfo.formCheck(function ($form) {
                var formBaseObj = formInfo.getFormBaseObj();//取表单信息对象
                if (!isEmpty(formBaseObj)) {
                    ajax_req({
                        url: baseUrl.tFlowDelegate.addOrUpdate,
                        type: 'post',
                        data: JSON.stringify(formBaseObj),
                        success: function (res) {
                            if (res.resultStat == "SUCCESS") {
                                layer.msg("新增成功");
                                formInfo.closebtnFun();
                            } else if (res.resultStat == "WARN") {
                                layer.msg(res.mess);
                            } else {
                                layer.msg("新增失败");
                            }
                        }
                    });
                }
            })
        },
        formCheck: function (callback) {
            layui.use(['form'], function () {
                var form = layui.form;
                form.verify(formBase.form_verify);

                form.on('submit()', function (data) {
                    callback(data);
                });
            });
        },
        getFormBaseObj: function () {
            //获取组装处理后的表单对象
            var formObj = $("#model_form").serializeJSON();
            return formObj;
        }
    };

    //底部按钮事件加载
    $('#save_btn').on('click', formInfo.saveBtnFun);//保存
    $('#closebtn').on('click', formInfo.closebtnFun);//关闭

    $('.selectOrgUserTree').on('click', function () {
        //委托待办选择当前部门下所有人
        parent.openSelectWindow.selectorguserTree({
            param: {'flag': 1},
            isRadio: true,
            isDepart: 1,
            callback: function (res) {
                $("input[name=toerName]").val(res[0].val);
                $("input[name=toerId]").val(res[0].id);
            }
        }, {title: '选择被委托人'})
    });
});







