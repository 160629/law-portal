$(function () {
    var formInfo = {
        flag: true, //防止多次请求的开关
        //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            ajax_req({
                url: baseUrl.TFlowUnvie.findOne,
                type: 'get',
                data: "viewId=" + formId,
                async: false,
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        resourceData = res.data;
                    } else {
                        layer.msg("获取数据详情信息错误");
                    }
                }
            });
            return resourceData;
        },
        //关闭
        closeBtnFun: function () {
            var index = parent.layer.getFrameIndex(window.name); //获取窗口索引
            parent.layer.close(index);
            window.close();
        },
        //写入表单基础信息
        writeFormBaseInfo: function (formObj) {
            $("#viewTitle").html(formObj.viewTitle);
            $("#toerTime").html("接收时间：" + dateFormat(formObj.createTime));
            $("#viewComent").html(formObj.viewComent);
            if (formObj.viewUrl) {
                $("#viewUrl").html("<span class='link-span' url='" + formObj.viewUrl + "' openType='" + formObj.openType + "'>" + (formObj.viewUrlName || '') + "</span>");
                $('.link-span').on('click', function () {
                    var url = $(this).attr("url");
                    var openType = $(this).attr("openType");
                    if (openType == 0) {
                        //打开新窗口
                        openFullWindow(url);
                    } else {
                        parent.window.location = url;
                    }
                });
            }

            if (formObj.viewStatus == 0) {
                $('#readbtn').show();
            }
        },
        //取地址栏参数
        getParam: function () {
            var pd = true;
            //接收参数
            var formId = getUrlParam("formId"); //取表单业务数据Id

            if (!isEmpty(formId)) {
                formInfo.formId = formId;
            }

        },
        //绑定按钮事件
        bindEvent: function () {
            $('#closebtn').on('click', formInfo.closeBtnFun); //关闭
            $('#readbtn').on('click', formInfo.readBtnFun); //已阅
        },
        //初始化表单
        initFormWrite: function () {
            formInfo.getParam(); //获取参数
            formInfo.bindEvent(); //加载基础事件

            if (!isEmpty(formInfo.formId)) {
                var resourceData = formInfo.requestFormObj(formInfo.formId); //根据表单Id获取表单信息
                if (!isEmpty(resourceData)) {
                    formInfo.writeFormBaseInfo(resourceData); //表单信息写入到页面
                } else {
                    layer.msg("未获取到表单信息");
                }
            }
        },
        //已阅按钮点击事件
        readBtnFun: function () {
            if (formInfo.flag) {
                formInfo.flag = false;
                var arr = [];
                arr.push(formInfo.formId);
                ajax_req({
                    url: baseUrl.TFlowUnvie.updateStatus,
                    type: 'post',
                    data: JSON.stringify(arr),
                    async: false,
                    success: function (res) {
                        if (res.resultStat == "SUCCESS") {
                            layer.msg("操作成功");
                            setTimeout(function () {
                                formInfo.closeBtnFun()
                            }, 1000)

                        } else {
                            layer.msg("操作失败");
                        }
                        formInfo.flag = true
                    },
                    error: function () {
                        formInfo.flag = true
                    }
                });
            }
        }
    };

    formInfo.initFormWrite();
});
