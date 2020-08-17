$(function () {
    var formInfo = {
        apiUrl: {
            findOne: baseUrl.tIssueLawsuit.findOne
        },
        flowStatus: "done",//默认流程状态-【已办查看】
        importantLevel: 'commonly',
        driveWhereParam: {},
        //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            var urlParam = "lawsuitId=" + formId;
            if (formInfo.currActivityDefId) {
                urlParam += "&actId=" + formInfo.currActivityDefId;
            }
            ajax_req({
                url: formInfo.apiUrl.findOne,
                type: 'get',
                data: urlParam,
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
        //诉讼处理方案弹出
        businessAdvicePage: function () {
            layer.open({
                type: 2,
                fixed: false, //不固定
                maxmin: false, //开启最大化最小化按钮
                area: ['850px', '610px'],
                title: '历史诉讼处理方案',
                content: systemConfigPageUrl.hisbusinesslog,
                success: function (layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.child({
                        param: {formId:formInfo.formId},
                        callback: function (res) {
                            if (res.resultStat != "SUCCESS" || rs.data == null) {
                                layer.msg("当前没有历史纠纷处理建议");
                            }
                        }
                    });
                }
            });
        },
        //纠纷处理附件应对方案参考模板
        referenceTemp: function () {
            uploadFile.requestFileById(function (files) {
                $.each(files,function (index,file) {
                    var $aHtml = $("<a class='a-link' href='" + baseUrl.file.filedown + "?path=" + encodeURIComponent(file.file_http_url) + "&fileName=" +
                        encodeURIComponent(file.file_name + "." + file.file_extension)
                        + "' title='" + file.file_name + "." + file.file_extension + "' class='fileDown'>"
                        + file.file_name + "." + file.file_extension + "</a>");

                    $aHtml.on("click", function (event) {
                        event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
                        var url = $(this).attr("href");
                        var fileName = $(this).html();
                        uploadFile.downloadFile(url, fileName);
                    });
                    if (index == 0) {
                        $("#referenceTemp").append("参考模板：")
                    }
                    $("#referenceTemp").append($aHtml);
                });
            },'lawsuitdeclare1','reference');
        },
        //关闭
        closeBtnFun: function () {
            window.close();
        },
        //编辑
        editBtnFun: function () {
            var search = window.location.search;
            window.location.href = pageUrl[formInfo.moduleName].edit + search;
        },
        //写入表单基础信息
        writeFormBaseInfo: function () {
            var viewObj = {};
            $.extend(viewObj, formInfo.formObj);
            $.extend(viewObj, formInfo.formObj.mian);

            $.extend(viewObj, {
                //需要转显示格式的字段
                orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
                createTime: dateFormat(formInfo.formObj.createTime),
                lawsuitSize: dataDict.getDictValueByKey("sys_issue_lawsuit_size", formInfo.formObj.lawsuitSize),
                caseLine: dataDict.getDictValueByKey("sys_business_type", formInfo.formObj.caseLine),
                caseType: dataDict.getDictValueByKey("sys_case_type", formInfo.formObj.caseType),
                approveLevel: dataDict.getDictValueByKey("sys_case_level", formInfo.formObj.approveLevel),
                caseCause: dataDict.getDictValueByKey("sys_case_reason", formInfo.formObj.caseCause),
                ourLawsuitStatus: dataDict.getDictValueByKey("sys_our_litigation", formInfo.formObj.ourLawsuitStatus),
                lawsuitStatus: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.lawsuitStatus) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）")
            });

            $("input[name=lawsuitMoney]").next(".aux").html(common.convertCurrency(formInfo.formObj.lawsuitMoney));//金额数字转大写

            $("#model_form").jsonSerializeForm(viewObj);
            //业务中公共方法需要的参数
            formInfo.importantLevel = formInfo.formObj.lawsuitSize;//将自己业务的重要程度字段赋值给它
            formInfo.title = formInfo.formObj.lawsuitTitle;//将自己业务的标题赋值给它
        },
        //撤回
        recallBtnFun:function () {
            if (formInfo.formObj&&formInfo.formObj.mian&&formInfo.formObj.mian.logs.length==1){
                flowDrive.recallRequest(formInfo.formObj, function (res) {
                    formInfo.closeBtnFun();
                });
            }
        },
        //退回
        backBtnFun: function () {
            formInfo.formCheck(function ($form) {
                //请求驱动流程/保存表单接口
                if (formInfo.flowStatus == "task") {
                    var flowingInfo = formInfo.getFlowingInfo();
                    flowDrive.selectUser(formInfo.flowStatus, function (nextNode) {
                        var model = formInfo.getBackFlowInfo(nextNode, flowingInfo);
                        flowDrive.driveNextNode(model, function (res) {
                            formInfo.closeBtnFun();
                        });
                    }, formInfo, {
                        isReturn: 1
                    });
                }
            }, function (callback) {
                callback({
                    notRequiredField: {businessAdvice: true}
                });
            });
        },
        //下一步
        submitBtnFun: function () {
            formInfo.formCheck(function ($form) {
                //请求驱动流程/保存表单接口
                if (formInfo.flowStatus == "task") {
                    var flowingInfo = formInfo.getFlowingInfo();
                    flowDrive.selectUser(formInfo.flowStatus, function (nextNode) {
                        var model = formInfo.getNextFlowInfo(nextNode, flowingInfo);
                        flowDrive.driveNextNode(model, function (res) {
                            formInfo.closeBtnFun();
                        });
                    }, formInfo, {
                        isReturn: 0
                    });
                }
            });
        },
        //表单校验
        /**
         *
         * @param callback 成功后回调
         * @param verifyFun 自定义校验
         */
        formCheck: function (callback, verifyFun) {
            layui.use(['form'], function () {
                var form = layui.form;
                form.config.verify = {};//不知道怎么重置，先这么着把
                formBase.form_verify.notRequiredField = {};

                if (typeof verifyFun == "function") {

                    verifyFun(function (verifyParam) {
                        formBase.form_verify.notRequiredField = verifyParam.notRequiredField || null;

                        form.verify(formBase.form_verify);

                        form.verify(verifyParam.form_verify);

                        form.on('submit()', function (data) {
                            callback(data);
                        });
                    });
                } else {
                    form.verify(formBase.form_verify);
                    form.on('submit()', function (data) {
                        callback(data);
                    });
                }
            });
        },
        loadCaseData: function (caseId) {
            ajax_req({
                url: baseUrl.caseMain.selectCaseMain,
                type: 'post',
                data: JSON.stringify({"caseId": caseId}),
                success: function (res) {
                    if (res && res.data && res.data.caseMainVO) {
                        $("label[name=caseTitle]").html('<a href="#" class="a-link">'+res.data.caseMainVO.caseTitle+'</a>');
                    }
                }
            });

        },
        loadGuideData: function (guideId) {
            ajax_req({
                url: baseUrl.tIssueGuide.selectByPrimaryKey,
                type: 'get',
                data: {"guideId": guideId},
                success: function (res) {
                    if (res && res.data && res.data) {
                        $("label[name=guideTitle]").html('<a href="#" class="a-link">'+res.data.guideTitle+'</a>');
                    }
                }
            });

        },
        //写入其它涉案方到表单
        setThreeData: function (resourceData) {
            if (resourceData.thirdPerson) {
                $("#thirdPersonAppend").show();
            }
            if (resourceData.plaintiff) {
                $("#plaintiffAppend").show();
            }
            if (resourceData.defendant) {
                $("#defendantAppend").show();
            }
        },
        //获取流程中可编辑对象
        getFlowingInfo: function () {
            var infoObj = $("#flowing_form").serializeJSON();
            var business_form = $("#business_form").serializeJSON();
            // var isEdit = 1;//没有修改过
            // if (formInfo.formObj.businessAdvice != business_form.businessAdvice) {
            //     //判断历史纠纷意见内容是否修改过
            //     isEdit = 2;
            // }
            // if (formInfo.formObj.uploadFileParam) {
            //     if (formInfo.formObj.uploadFileParam.file_businessAdvice != business_form.file_businessAdvice) {
            //         isEdit = 2;
            //     }
            // }
            // if (isEdit == 1) {
            //     //如果历史纠纷意见附件是否修改过
            //     delete business_form.businessAdvice;
            //     delete business_form.file_businessAdvice;
            // }
            infoObj.businessMap = business_form;
            return infoObj;
        },
        //获取退回上一步流程所需参数对象
        getBackFlowInfo: function (nextNode, flowingInfo) {
            return flowDrive.getBackNodeParam(nextNode,flowingInfo,formInfo);
        },
        //获取驱动下一步流程所需参数对象
        getNextFlowInfo: function (nextNode, flowingInfo) {
            var model = flowDrive.getNextNodeParam(nextNode, flowingInfo, formInfo);
            //流程结束时让写死的流程参数
            if (nextNode.actDefParam == "finishActivity") {
                model = flowDrive.getEndNodeParam(nextNode,flowingInfo,formInfo);
                if (!model.businessMap) {
                    model.businessMap = {};
                }
                model.businessMap.lawsuitStatus = 30;//已办结的业务数据状态
                model.moduleName = formInfo.moduleName;
                model.busCode = formInfo.formObj.lawsuitCode;
                model.busTitle = formInfo.formObj.lawsuitTitle;
            }
            return model;
        },
        //取地址栏参数
        getParam: function () {
            var pd = true;
            //接收参数
            var formId = getUrlParam("formId");//取表单业务数据Id
            var moduleName = getUrlParam("moduleName");//取业务表单模板标识
            var processInstId = getUrlParam("processInstId");//取流程实例Id
            var currActivityDefId = getUrlParam("currActivityDefId");//取流程节点
            var currActivityDefName = getUrlParam("currActivityDefName");//取流程节点
            var mode = getUrlParam("mode");//取表单状态
            var source = getUrlParam("source");//来源状态

            if (!isEmpty(formId)) {
                formInfo.formId = formId;
            }
            if (!isEmpty(moduleName)) {
                formInfo.moduleName = moduleName;
            }
            if (!isEmpty(processInstId)) {
                formInfo.processInstId = processInstId;
            }
            if (!isEmpty(mode)) {
                formInfo.flowStatus = mode;
            }
            if (!isEmpty(source)) {
                formInfo.source = source;
            }
            if (!isEmpty(currActivityDefId)) {
                formInfo.currActivityDefId = currActivityDefId;
                formInfo.currActivityDefName = decodeURI(currActivityDefName);
            }
        },
        //绑定按钮事件
        bindEvent: function () {
            //文件上传
            $("#thelist_businessAdvice_w").find('input[type="file"]').on('change', function () {
                uploadFile.upload($("#thelist_businessAdvice_w"), this, {shareType: 'businessAdvice', formId: formInfo.formId});
            });
            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#btn_edit').on('click', formInfo.editBtnFun);//编辑-跳转到编辑页
            $('#back_btn').on('click', formInfo.backBtnFun);//退回
            $('#recall_btn').on('click', formInfo.recallBtnFun);//撤回
            $('#next_btn').on('click', formInfo.submitBtnFun);//下一步

            $('label[name=guideTitle]').on('click',function () {
                var formId = $('input[name=guideId]').val();
                if (formId){
                    var path = pageUrl.premise_dispute_city.view;
                    var param = "?formId=" + formId;
                    openFullWindow(path + param);
                }
            });
            $('label[name=caseTitle]').on('click',function () {
                var formId =  $('input[name=caseId]').val();
                if (formId){
                    var path = pageUrl.caseManage.view;
                    var param =  "?caseId=" + formId;
                    openFullWindow(path + param);
                }
            });

            $('.businessAdvicePage').on('click', formInfo.businessAdvicePage);//诉讼处理方案弹出
        },
        //初始化表单
        initFormWrite: function () {
            formInfo.getParam();//获取参数
            formInfo.bindEvent();//加载基础事件
            if (!isEmpty(formInfo.formId)) {
                var resourceData = formInfo.requestFormObj(formInfo.formId);//根据表单Id获取表单信息
                if (!isEmpty(resourceData)) {
                    formInfo.flowId = resourceData.mian ? resourceData.mian.flowName : '';

                    if (resourceData.mian.flowStatus == 30 || resourceData.mian.flowStatus == 50) {
                        //流程结束的状态下
                        formInfo.flowStatus = 'end';
                    }
                    formInfo.formObj = resourceData;//写入表单信息

                    formInfo.writeFormBaseInfo();//表单信息写入到页面

                    formInfo.setThreeData(resourceData);
                    uploadFile.writeFileInfo($("#thelist"), formInfo.formObj.files, {onDel: false, shareType: 1});//写入附件信息
                    uploadFile.writeFileInfo($("#thelist_businessAdvice_w"), formInfo.formObj.files, {
                        shareType: 'businessAdvice'
                        ,formId:formInfo.formId
                    });
                    uploadFile.writeFileInfo($("#thelist_businessAdvice_r"), formInfo.formObj.files, {
                        onDel: false,
                        shareType: 'businessAdvice'
                    });


                    if (formInfo.formObj.mian != null) {
                        //加载流程审批历史/意见信息到HTMl
                        flowLog.writeFlowLog(formInfo.formObj.mian.logs, formInfo.currActivityDefId);//加载流程审批意见信息
                    }
                    if (formInfo.formObj.caseId) {
                        formInfo.loadCaseData(formInfo.formObj.caseId);
                    }
                    // if (formInfo.formObj.guideId) {
                    //     formInfo.loadGuideData(formInfo.formObj.guideId);
                    // }
                    //自定义权限
                    formInfo.customOperationPermission=function(tag){
                        if (tag == "w_caseAnalyze") {
                            formInfo.referenceTemp();//加载参考模板
                        }
                    };
                    //根据绑定流程id和启动节点的id,执行表单权限控制
                    var jurisdiction = formControl.initControl(formInfo);
                    formInfo.versionId = jurisdiction.versionId;

                    flowDrive.bindFlowFixbar(formInfo);//加载流程图
                } else {
                    layer.msg("未获取到表单信息");
                }
            }
        }
    };

    formInfo.initFormWrite();
});

