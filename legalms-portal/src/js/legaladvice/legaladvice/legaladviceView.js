$(function () {
    var formInfo = {
        apiUrl: {
            findOne: baseUrl.tIssueConsult.findOne
        },
        flowStatus: "done",//默认流程状态-【已办查看】
        importantLevel: 'commonly',
        driveWhereParam: {},
        //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            var urlParam = "id=" + formId;
            if (formInfo.currActivityDefId){
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
        businessAdvicePage: function () {
            layer.open({
                type: 2,
                fixed: false, //不固定
                maxmin: false, //开启最大化最小化按钮
                area: ['850px', '610px'],
                title: '历史答复',
                content: systemConfigPageUrl.hisbusinesslog,
                success: function (layero, index) {
                    var iframe = window['layui-layer-iframe' + index];
                    iframe.child({
                        param: {formId:formInfo.formId},
                        callback: function (res) {
                            if (res.resultStat != "SUCCESS" || rs.data == null) {
                                layer.msg("当前没有历史答复");
                            }
                        }
                    });
                }
            });
        },
        // 业务类别下拉框数据
        loadConsultBusinessType: function () {
            var dictKey = "sys_consult_business_type";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=businessType]');
            loadDictSelect($select, dictData);
        },
        // 业务支撑下拉框数据
        loadSupportType: function () {
            var dictKey = "sys_support_type";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=supportType]');
            loadDictSelect($select, dictData);
        },
        // 重要程度下拉框数据
        loadImportanceType: function () {
            var dictKey = "sys_issue_size";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=importance]');
            loadDictSelect($select, dictData);
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
                businessTypeName: dataDict.getDictValueByKey("sys_consult_business_type", formInfo.formObj.businessType),
                supportTypeName: dataDict.getDictValueByKey("sys_support_type", formInfo.formObj.supportType),
                importanceName: dataDict.getDictValueByKey("sys_issue_size", formInfo.formObj.importance),
                state: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.state) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）")

            });
            $("#model_form").jsonSerializeForm(viewObj);

            //业务中公共方法需要的参数
            formInfo.importantLevel = formInfo.formObj.importance;//将自己业务的重要程度字段赋值给它
            formInfo.title = formInfo.formObj.title;//将自己业务的标题赋值给它

        },
        //撤回
        recallBtnFun:function () {
            if (formInfo.formObj&&formInfo.formObj.mian&&formInfo.formObj.mian.logs.length==1){
                flowDrive.recallRequest(formInfo.formObj, function (res) {
                    formInfo.closeBtnFun();
                },{
                    businessType:"tIssueConsult"
                });
            }
        },
        //退回
        backBtnFun:function () {
            formInfo.formCheck(function ($form) {
                //请求驱动流程/保存表单接口
                if (formInfo.flowStatus == "task") {
                    var flowingInfo = formInfo.getFlowingInfo();
                    flowDrive.selectUser(formInfo.flowStatus, function (nextNode) {
                        var model = formInfo.getBackFlowInfo(nextNode, flowingInfo);
                        flowDrive.driveNextNode(model, function (res) {
                           formInfo.closeBtnFun();
                        },{
                            businessType:"tIssueConsult"
                        });
                    }, formInfo, {
                        isReturn: 1
                    });
                }
            }, function (callback) {
                callback({
                    notRequiredField: {businessAdvice: true,businessType: true,supportType: true,importance: true}
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
                        },{
                            businessType:"tIssueConsult"
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
        //获取流程中可编辑对象
        getFlowingInfo: function () {
            var infoObj = $("#flowing_form").serializeJSON();
            infoObj.businessMap = $("#business_form").serializeJSON();
            if (infoObj.businessMap.importance){
                formInfo.importantLevel = infoObj.businessMap.importance;//流程中获取的重要程度，需要把赋值给公共重要程度字段
            }
            return infoObj;
        },
        //获取退回上一步流程所需参数对象
        getBackFlowInfo: function (nextNode, flowingInfo) {
            return flowDrive.getBackNodeParam(nextNode,flowingInfo,formInfo);
        },
        //获取驱动下一步流程所需参数对象
        getNextFlowInfo: function (nextNode, flowingInfo) {
            var model = flowDrive.getNextNodeParam(nextNode,flowingInfo,formInfo);
            //流程结束时让写死的流程参数
            if (nextNode.actDefParam == "finishActivity") {
                model = flowDrive.getEndNodeParam(nextNode,flowingInfo,formInfo);
                if (!model.businessMap){
                    model.businessMap = {};
                }
                model.businessMap.state = 30;//已办结的业务数据状态
                model.moduleName = formInfo.moduleName;
                model.busCode = formInfo.formObj.code;
                model.busTitle = formInfo.formObj.title;
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
            //表单控件事件加载
            formInfo.loadConsultBusinessType();//加载业务类别下拉框数据
            formInfo.loadSupportType();//加载业务支撑下拉框数据
            formInfo.loadImportanceType();//加载重要程度下拉框数据

            //文件上传
            $("#thelist_businessAdvice_w").find('input[type="file"]').on('change', function () {
                uploadFile.upload($("#thelist_businessAdvice_w"), this, {shareType: 'businessAdvice', formId: formInfo.formId});
            });
            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#btn_edit').on('click', formInfo.editBtnFun);//编辑-跳转到编辑页
            $('#back_btn').on('click', formInfo.backBtnFun);//退回
            $('#recall_btn').on('click', formInfo.recallBtnFun);//撤回
            $('#next_btn').on('click', formInfo.submitBtnFun);//下一步

            $('.businessAdvicePage').on('click', formInfo.businessAdvicePage);//下一步
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
                    //根据绑定流程id和启动节点的id,执行表单权限控制
                    //自定义块操作权限
                    formInfo.customOperationPermission = function (tag) {
                        if (tag == "r_businessType") {
                            //没重要程度时候，读的权限不执行
                            if (!formInfo.formObj.importance && !formInfo.formObj.supportType && !formInfo.formObj.businessType) {
                                return false;
                            }
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
