$(function () {
    var power = {
        flowId: '',
        id: null,
        //请求更新表单数据
        requestUpdateFormObj: function (param, callback) {
            var data = {
                flowId: '',
                pageNum: 1,
                pageSize: 1000
            };
            $.extend(data, param);
            ajax_req({
                url: baseUrl.quickaccess.addFuickAccess,
                type: 'post',
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        callback(res);
                    } else {
                        layer.msg("更新数据信息错误");
                    }
                }
            });
        },
        //请求添加表单数据
        requestAddFormObj: function (param, callback) {
            var data = {
                flowId: $("*[name='flowId']").val(),
                iconImg: $("*[name='iconImg']").val(),
                displayName: $("*[name='displayName']").val(),
                moduleName: $("*[name='moduleName']").val(),
                flowStartAct: $("*[name='flowStartAct']").val(),
                openType: $('#isSelect1 option:selected').attr('type'),
                pageKey: $('#isSelect2 option:selected').attr('type'),
                isJiyuehua: $('#isSelect3 option:selected').attr('type'),
                sort: 0
            };

            ajax_req({
                url: baseUrl.quickaccess.addFuickAccess,
                type: 'post',
                data: JSON.stringify(data),
                success: function (res) {
                    console.log(res)
                    if (res.resultStat == "SUCCESS") {
                        callback(res);
                    } else {
                        layer.msg("添加数据 信息错误");
                    }
                }
            });
        },
        //请求表单数据
        requestFormObj: function (param, callback) {
            var data = {
                flowId: '',
            };
            $.extend(data, param);
            ajax_req({
                url: baseUrl.quickaccess.updateFuickAccess,
                type: 'post',
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        callback(res);
                    } else {
                        layer.msg("获取数据详情信息错误");
                    }
                }
            });
        },
        //获取组装处理后的表单对象
        getFormBaseObj: function () {
            //准备基础对象
            var model = {
                flowId: $("*[name='flowId']").val() || "",
                iconImg: $("*[name='iconImg']").val() || "",
                displayName: $("*[name='displayName']").val() || "",
                moduleName: $("*[name='moduleName']").val() || "",
                flowStartAct: $("*[name='flowStartAct']").val() || "",
                openType: $('#isSelect1 option:selected').attr('type') || "",
                pageKey: $('#isSelect2 option:selected').attr('type') || "",
                isJiyuehua: $('#isSelect3 option:selected').attr('type') || "",
                sort: 0
            };
            return model;
        },
        //表单校验
        formCheck: function (callback) {
            layui.use(['form'], function () {
                var form = layui.form;
                form.verify(formBase.form_verify);

                form.on('submit()', function (data) {
                    callback(data);
                });
            })
        },
        selectRolePage: function () {
            $(".rolePage").on("click", function () {
                //若是多选啊需要设置回填字段和值
                var selectItem = {};
                var roleIds = $("input[name=roleIds]").val();
                var roleNames = $("input[name=roleNames]").val();
                if (roleIds) {
                    selectItem = {
                        roleCode: roleIds.split(","),
                        roleName: roleNames.split(",")
                    };
                }
                parent.openSelectWindow.selectroleList({
                    param: {},
                    selectItem: selectItem,
                    callback: function (res) {
                        var roleNames = [], roleIds = [];
                        $.each(res, function (index, value) {
                            //回调函数设置
                            roleNames.push(value.roleName);
                            roleIds.push(value.roleCode);
                        });
                        $("input[name=roleIds]").val(roleIds.join(","));
                        $("input[name=roleNames]").val(roleNames.join(","));
                    }
                }, { title: '选择参与者角色' })
            })
        },
        //关闭
        closeBtnFun: function () {
            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            parent.layer.close(index);
        },
        //修改
        updateBtnFun: function () {
            var data = power.getFormBaseObj();
            var id = getUrlParam("id");
            data.id = id;

            ajax_req({
                url: baseUrl.quickaccess.updateFuickAccess,
                type: 'post',
                data: JSON.stringify(data),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        power.closeBtnFun();
                    } else {
                        layer.msg("获取数据详情信息错误");
                    }
                }
            });
        },
        //保存
        addBtnFun: function () {

            power.formCheck(function ($form) {

                var model = power.getFormBaseObj();
                power.requestAddFormObj(model, function (res) {
                    power.closeBtnFun(res);
                });
            })

        },
        //取地址栏参数
        getParam: function () {
            //接收参数
            var flowId = getUrlParam("flowId");//取表单业务数据Id

            if (!isEmpty(flowId)) {
                power.flowId = flowId;
            }
            return power;
        },
        //绑定按钮事件
        bindEvent: function () {
            power.selectRolePage();//关联参与者角色选择
            //底部按钮事件加载
            $('#closebtn').on('click', power.closeBtnFun);//关闭
            if (!isEmpty(power.flowId)) {
                $('#save_btn').on('click', power.updateBtnFun); //更新
            } else {
                $('#save_btn').on('click', power.addBtnFun); //保存
            }
        },
        //写入表单基础信息
        writeFormBaseInfo: function () {
            var viewObj = JSON.parse(localStorage.getItem('detailsObj'));
            if (viewObj) {
                $('.layui-select-title').eq(0).children('input').val(viewObj.openType);
                $('.layui-select-title').eq(1).children('input').val(viewObj.pageKey);
                $('.layui-select-title').eq(2).children('input').val((viewObj.isJiyuehua == 1 ? '是' : '否'));
                $("#model_form").jsonSerializeForm(viewObj);
            }
        },
        //初始化表单
        initFormWrite: function () {
            power.getParam();
            power.bindEvent();

            if (!isEmpty(power.flowId) && !isEmpty(power.actId)) {
                power.requestFormObj(power, function (res) {
                    //根据表单Id获取表单信息,给的查列表的接口，凑合着用
                    if (res.data.length == 1) {
                        power.formObj = res.data[0];//写入表单信息
                        power.writeFormBaseInfo();//表单信息写入到页面
                    } else {
                        layer.msg("未获取到节点信息");
                    }
                })
            }
        }
    };
    power.initFormWrite();
    power.writeFormBaseInfo();
});