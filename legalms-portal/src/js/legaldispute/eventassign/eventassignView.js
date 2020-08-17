$(function () {
    var formInfo = {
        apiUrl:{
            findOne:baseUrl.caseAssign.findOne
        },
        flowStatus: "done",//默认流程状态-【已办查看】
        importantLevel: 'normal',
        driveWhereParam: {},
        //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            var urlParam = "assignId=" + formId;
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
                        if (res.data.approveStateName && res.data.approveCityName && res.data.approveOrg) {
                            resourceData.approveOrg = res.data.approveStateName.toString() + res.data.approveCityName.toString() + res.data.approveOrg
                        } else {
                            resourceData.approveOrg = ''
                        }
                    } else {
                        layer.msg("获取数据详情信息错误");
                    }
                }
            });
            return resourceData;
        },
        //主送单位弹出
        sendArmPage: function () {
            openSelectWindow.selectorgTree({
                param: {flag: "5"},
                callback: function (res) {
                    $("input[name=mainSeedOrg]").val(res[0].val);
                    $("input[name=mainSeedOrgId]").val(res[0].id);
                }
            }, {title: '公司选择'})
        },
        //涉案负责人
        involvedAccountPage: function () {
            parent.openSelectWindow.selectorguserTreeAsyncF({
                param: {'flag': 5},
                isRadio: true,
                isDepart: 1,
                callback: function (res) {
                    $("input[name=involvedAccountId]").val(res[0].id);
                    $("input[name=involvedAccountName]").val(res[0].val);
                    $("input[name=involvedDeptName]").val(res[0].deptName);
                    $("input[name=involvedDeptId]").val(res[0].pid);
                    $("input[name=involvedOrgId]").val(res[0].orgId);
                    $("input[name=involvedOrgName]").val(res[0].orgName);
                }
            }, {title: '选择涉案负责人'})
        },
        //关联案件弹出
        casePage: function () {
            $(".casePage").on("click", function () {
                var $parent = $(".casePage").parents(".card");
                openSelectWindow.selectcaseList({
                    param: {flag: "3"},
                    callback: function (res) {
                        $parent.find("input[name=caseId]").val(res[0].caseId);
                        $parent.find("input[name=caseTitle]").val(res[0].caseTitle);
                        $parent.find("input[name=involvedAccountId]").val(res[0].involvedAccountId);
                        $parent.find("input[name=involvedAccountName]").val(res[0].involvedAccountName);
                        $parent.find("input[name=involvedDeptName]").val(res[0].involvedDeptName);
                        $parent.find("input[name=involvedDeptId]").val(res[0].involvedDeptId);
                        $parent.find("input[name=involvedOrgId]").val(res[0].involvedOrgId);
                        $parent.find("input[name=involvedOrgName]").val(res[0].involvedOrgName);
                    }
                })
            });
            $(".delInvolvedAccountPage").on("click", function () {
                var $parent = $(".casePage").parents(".card");
                $parent.find("input[name=involvedAccountId]").val("");
                $parent.find("input[name=involvedAccountName]").val("");
                $parent.find("input[name=involvedDeptName]").val("");
                $parent.find("input[name=involvedDeptId]").val("");
                $parent.find("input[name=involvedOrgId]").val("");
                $parent.find("input[name=involvedOrgName]").val("");
            })
        },
        //生成案件类型
        createCaseTypeEvent: function () {
            $('label[name=caseTitle]').on('click', function () {
                var formId = $('input[name=caseId]').val();
                if (formId) {
                    var path = pageUrl.caseManage.view;
                    var param = "?caseId=" + formId;
                    openFullWindow(path + param);
                }
            });

            //生产卷宗生成方式相关事件
            layui.form.on('radio(createCaseType)', function (data) {
                createCaseTypeChecked(data.value);
            });
            $("input[name='createCaseType']").click(function () {
                createCaseTypeChecked($(this).val());
            });

            function createCaseTypeChecked(checked) {
                var $card = $("div[name=createCaseTypeDiv]").parents(".card");
                var $row = $("input[name=caseTitle]").parents(".layui-row");
                if (checked == 1) {
                    $row.show();
                    $card.find("input[name=involvedAccountName]").attr("lay-verify", '');
                    $card.find("input[name=involvedAccountName]").parents('.layui-row').find("b").html('');
                    $card.find("input[name=caseTitle]").attr("lay-verify", 'required');
                    $card.find("input[name=caseTitle]").parents('.layui-row').find("b").html('*');
                } else {
                    $row.hide();
                    $row.find("input[name=caseTitle]").val('');
                    $row.find("input[name=caseId]").val('');
                    $card.find("input[name=involvedAccountId]").val("");
                    $card.find("input[name=involvedAccountName]").val("");
                    $card.find("input[name=involvedDeptName]").val("");
                    $card.find("input[name=involvedDeptId]").val("");
                    $card.find("input[name=involvedOrgId]").val("");
                    $card.find("input[name=involvedOrgName]").val("");
                    $card.find("input[name=involvedAccountName]").attr("lay-verify", 'required');
                    $card.find("input[name=involvedAccountName]").parents('.layui-row').find("b").html('*');
                    $card.find("input[name=caseTitle]").attr("lay-verify", '');
                    $card.find("input[name=caseTitle]").parents('.layui-row').find("b").html('');
                }
            }
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
            $.extend(viewObj,formInfo.formObj);
            $.extend(viewObj,formInfo.formObj.mian);
            $.extend(viewObj, {
                //需要转显示格式的字段
                orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
            	caseCreateTime: dateFormat(formInfo.formObj.caseCreateTime, 'yyyy-MM-dd'),
                createTime: dateFormat(formInfo.formObj.createTime),
                sendTime:dateFormat(formInfo.formObj.sendTime,'yyyy-MM-dd'),
                lawsuitSize: dataDict.getDictValueByKey("sys_issue_size", formInfo.formObj.lawsuitSize),
                caseLine: dataDict.getDictValueByKey("sys_business_type", formInfo.formObj.caseLine),
                assignStatus: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.assignStatus) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）"),
                ourLawsuitStatus: dataDict.getDictValueByKey("sys_our_litigation", formInfo.formObj.ourLawsuitStatus),
                caseType: dataDict.getDictValueByKey("sys_case_type", formInfo.formObj.caseType),
                createCaseType: dataDict.getDictValueByKey("sys_create_case_type", formInfo.formObj.createCaseType)
            });

            $("#model_form").jsonSerializeForm(viewObj);

            $("input[name=lawsuitMoney]").next(".aux").html(common.convertCurrency(formInfo.formObj.lawsuitMoney));//金额数字转大写

            $("label[name=caseTitle]").html('<a href="#" class="a-link">' + (formInfo.formObj.caseTitle || '') + '</a>');

            layui.form.render();
            //业务中公共方法需要的参数
            formInfo.importantLevel = formInfo.formObj.lawsuitSize;//将自己业务的重要程度字段赋值给它
            formInfo.title = formInfo.formObj.assignTitle;
            formInfo.driveWhereParam.mainSeedOrgId = formInfo.formObj.mainSeedOrgId;//将自己主办单位id赋值给它

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
        backBtnFun:function () {
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
                    notRequiredField: {caseTitle: true, involvedAccountName: true}
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
        //写入其它涉案方到表单
        setThreeData: function (resourceData) {
            var pd = false;
            if (resourceData.thirdPerson) {
                $("#thirdPersonAppend").show();
                pd=true;
            }
            if (resourceData.plaintiff) {
                $("#plaintiffAppend").show();
                pd=true;
            }
            if (resourceData.defendant) {
                $("#defendantAppend").show();
                pd=true;
            }
            if (pd){
                $("#thirdPersonAppend").parents(".layui-row").show();
            }
        },
        //获取流程中可编辑对象
        getFlowingInfo: function () {
            var infoObj = $("#flowing_form").serializeJSON();
            var business_form = $("#business_form").serializeJSON();
            infoObj.businessMap = business_form;

            if (business_form.mainSeedOrgId){
                formInfo.driveWhereParam.mainSeedOrgId = business_form.mainSeedOrgId;//将自己主办单位id赋值给它
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
                model.businessMap.assignStatus = 30;//已办结的业务数据状态
                model.moduleName = formInfo.moduleName;
                model.busCode = formInfo.formObj.assignCode;
                model.busTitle = formInfo.formObj.assignTitle;
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

            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#btn_edit').on('click', formInfo.editBtnFun);//编辑-跳转到编辑页
            $('#back_btn').on('click', formInfo.backBtnFun);//退回
            $('#recall_btn').on('click', formInfo.recallBtnFun);//撤回
            $('#next_btn').on('click', formInfo.submitBtnFun);//下一步

            $(".mainSeedOrgPage").on("click", formInfo.sendArmPage);//主送部门弹出选中框
            $(".involvedAccountPage").on("click", formInfo.involvedAccountPage);//抄送部门弹出选中框

            formInfo.createCaseTypeEvent();//卷宗生成相关是事件
            $('.casePage').on('click', formInfo.casePage());//关联卷宗
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
                    if (formInfo.formObj.mian != null) {
                        //加载流程审批历史/意见信息到HTMl
                        flowLog.writeFlowLog(formInfo.formObj.mian.logs, formInfo.currActivityDefId);//加载流程审批意见信息
                    }

                    //自定义权限
                    formInfo.customOperationPermission=function(tag){
                        if (tag == "r_involve") {
                            //没涉案负责人的时候，读的权限不执行
                            if (!formInfo.formObj.involvedAccountName) {
                                return false;
                            }
                        }
                    };
                    //根据绑定流程id和启动节点的id,执行表单权限控制
                    var jurisdiction = formControl.initControl(formInfo);
                    formInfo.versionId = jurisdiction.versionId;
                    if (formInfo.formObj){

                    }
                    flowDrive.bindFlowFixbar(formInfo);//加载流程图
                } else {
                    layer.msg("未获取到表单信息");
                }
            }
        }
    };

    formInfo.initFormWrite();
});

