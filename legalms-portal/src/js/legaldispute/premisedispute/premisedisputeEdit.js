/**
 * 流程驱动出去做公共模块---------------待修改
 * 提供基础数据 提出取做公共模块--------待修改
 * */
$(function () {
    var formInfo = {
        apiUrl: {
            save: baseUrl.tIssueGuide.tempTIssueGuide,
            findOne: baseUrl.tIssueGuide.findOne,
            draft: baseUrl.tIssueGuide.addTIssueGuide
        },
        flowStatus: "start",//默认流程状态-【起草】
        importantLevel: 'commonly',
        driveWhereParam: {},
        //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            var urlParam = "guideId=" + formId;
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
        //暂存表单数据
        saveFormObj: function (model) {
            ajax_req({
                url: formInfo.apiUrl.save,
                type: 'post',
                data: JSON.stringify(model),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        layer.msg("暂存表单信息成功", {icon: 1, time: 500, shade: 0.4}, function () {
                            formInfo.closeBtnFun(res);
                        });
                    }
                }
            });
        },
        //起草-下一步请求
        requestStartFlow: function (param,success) {
            ajax_req({
                url: formInfo.apiUrl.draft,
                type: 'post',
                data: JSON.stringify(param),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        layer.msg("提交成功", {icon: 1, time: 1000, shade: 0.4}, function () {
                            success(res);

                        });
                    } else {
                        layer.msg("提交失败");
                    }
                }
            });
        },
        // 所属业务大类下拉框数据
        loadBusinessType: function () {
            var dictKey = "sys_business_type";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=guideMethod]');
            loadDictSelect($select, dictData);
        },
        // 申请纠纷缘由下拉框数据
        loadCaseReason: function () {
            var dictKey = "sys_case_reason";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=caseReason]');
            loadDictSelect($select, dictData);
        },
        // 加载重要程度下拉框数据
        loadGuideSize: function () {
            var dictKey = "sys_issue_size";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=guideSize]');
            loadDictSelect($select, dictData, {checked: "commonly", onDefaultItem: false});
        },
        // 加载建议解决方式下拉框数据
        loadGuideSolve: function () {
            var dictKey = "sys_guide_solve";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=guideSolve]');
            loadDictSelect($select, dictData);
        },
        ourLitigationBodyPage: function () {
            $(".ourLitigationBodyPage").on("click", function () {
                //若是多选啊需要设置回填字段和值
                var selectItem = {};
                var ourLawsuitBody = $("input[name=ourLawsuitBody]").val();
                var ourLawsuitBodyName = $("input[name=ourLawsuitBodyName]").val();
                if (ourLawsuitBody){
                    selectItem = {
                        bodyCode:ourLawsuitBody.split(","),
                        bodyName:ourLawsuitBodyName.split(",")
                    };
                }
                openSelectWindow.selectcompanyList({
                    param: {flag: "1"},
                    isRadio: false,
                    selectItem:selectItem,
                    callback: function (res) {
                        var bodyName = [], bodyCode = [];
                        $.each(res, function (index, value) {
                            //回调函数设置
                            bodyName.push(value.bodyName);
                            bodyCode.push(value.bodyCode);
                        });
                        $("input[name=ourLawsuitBodyName]").val(bodyName.join(","));
                        $("input[name=ourLawsuitBody]").val(bodyCode.join(","));
                    }
                })
            })
        },
        //关闭
        closeBtnFun: function () {
            window.close();
        },
        //起草-暂存
        stagingBtnFun: function () {
            if (!$("input[name=guideTitle]").val()){
                $("input[name=guideTitle]").addClass("layui-form-danger").focus();
                layer.msg("标题内容不能为空！",{ icon:5, time:1000, shade:0.4 });
                return false;
            }
            var formBaseObj = formInfo.getFormBaseObj();//取表单信息对象
            var model = {
                flowName: formInfo.flowId,
                model: formBaseObj,
                curActDefParam: formInfo.currActivityDefId,
                moduleName: formInfo.moduleName
            };
            if (!isEmpty(model)) {
                formInfo.saveFormObj(model);
            }
        },
        //流程中保存
        saveBtnFun: function () {
            formInfo.formCheck(function ($form) {
                var flowingInfo ={
                    businessMap : formInfo.getFormBaseObj()
                };
                var model = flowDrive.getFlowingParam(flowingInfo, formInfo);
                flowDrive.flowingSave(model,function (res) {
                    formInfo.returnBtnFun();
                });
            })

        },
        //返回详情页
        returnBtnFun: function () {
            var search = window.location.search;
            window.location.href = pageUrl[formInfo.moduleName].view + search;
        },
        //作废
        abandonBtnFun: function () {
            //组装作废参数
            layer.confirm("确定作废当前流程吗？", {btn: ['确定', '取消'], title: "提示"}, function () {
                var model = {
                    businessMap: {
                        approveItemId:formInfo.formObj.mian.approveItemId,
                        approveItemType: formInfo.formObj.mian.approveItemType,
                        flowId: formInfo.processInstId,
                        guideStatus: 50,
                        versionId:formInfo.versionId
                    },
                    moduleName: formInfo.moduleName,
                    busCode: formInfo.formObj.guideCode,
                    busTitle: formInfo.formObj.guideTitle
                };
                model.businessMap[formInfo.formObj.mian.approveItemName] = formInfo.formObj.mian.approveItemId

                flowDrive.nullifyFlow(model, function (res) {
                    formInfo.closeBtnFun();
                });
            });
        },
        //编辑
        editBtnFun: function () {
            var search = window.location.search;
            window.location.href = pageUrl[formInfo.moduleName].edit + search
        },
        //下一步
        submitBtnFun: function () {
            formInfo.formCheck(function ($form) {
                if (formInfo.flowStatus == "start") {
                    var formBaseObj = formInfo.getFormBaseObj();
                    flowDrive.selectUser(formInfo.flowStatus, function (nextNode) {
                        var model = formInfo.getStartFlowInfo(nextNode, formBaseObj);
                       formInfo.requestStartFlow(model,function (res) {
                           formInfo.closeBtnFun(res);
                       });
                    }, formInfo)
                } else if (formInfo.flowStatus == "task") {
                    var flowingInfo = formInfo.getFlowingInfo();
                    flowDrive.selectUser(formInfo.flowStatus, function (nextNode) {
                        var model = formInfo.getNextFlowInfo(nextNode, flowingInfo);

                        flowDrive.driveNextNode(model, function (res) {
                            formInfo.closeBtnFun();
                        });
                    }, formInfo);
                }
            })
        },
        //写入表单基础信息
        writeFormBaseInfo: function () {
            var viewObj = {};
            $.extend(viewObj, formInfo.formObj);
            $.extend(viewObj, formInfo.formObj.mian);

            $.extend(viewObj, {
                //需要转显示格式的字段
                orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
                caseHappenTime: dateFormat(formInfo.formObj.caseHappenTime, 'yyyy-MM-dd'),
                createTime: dateFormat(formInfo.formObj.createTime),
                guideStatus: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.guideStatus) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）"),
                guideSizeName: dataDict.getDictValueByKey("sys_issue_size", formInfo.formObj.guideSize)
            });

            $("input[name=implMoney]").next(".aux").html(common.convertCurrency(formInfo.formObj.implMoney));//金额数字转大写
            $("input[name=caseDeputeMoney]").next(".aux").html(common.convertCurrency(formInfo.formObj.caseDeputeMoney));//金额数字转大写

            $("#model_form").jsonSerializeForm(viewObj);
            //业务中公共方法需要的参数
            formInfo.importantLevel = formInfo.formObj.guideSize;//将自己业务的重要程度字段赋值给它
            formInfo.title = formInfo.formObj.guideTitle;//将自己业务的标题赋值给它
        },
        //起草获取表单流程对象
        getStartFlowInfo: function (nextNode, formObj) {
            return flowDrive.getStartNodeParam(nextNode, formObj, formInfo);
        },
        //流程中下一步获取表单流程对象
        getNextFlowInfo: function (nextNode, flowingInfo) {
            var model = flowDrive.getNextNodeParam(nextNode, flowingInfo, formInfo);
            //流程结束时让写死的流程参数
            if (nextNode.actDefParam == "finishActivity") {
                if (!model.businessMap){
                    model.businessMap = {};
                }
                model.businessMap.guideStatus = 30;//已办结的业务数据状态
            }
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
            });
        },
        //获取流程中表单对象
        getFlowingInfo: function () {
            var infoObj = $("#flowing_form").serializeJSON();
            infoObj.businessMap = formInfo.getFormBaseObj();
            return infoObj
        },
        //获取组装处理后的表单对象
        getFormBaseObj: function () {
            var formObj = $("#model_form").serializeJSON();
            //准备基础对象
            var model = {
                "caseDeputeAdvice": formObj.caseDeputeAdvice || '',
                "caseDeputeMoney": formObj.caseDeputeMoney || '',
                "caseDeputeTruth": formObj.caseDeputeTruth || '',
                "caseHappenTime": formObj.caseHappenTime || '',
                "caseReason": formObj.caseReason || '',
                "guideCode": formObj.guideCode || '',
                "guideMethod": formObj.guideMethod || '',
                "guideSize": formObj.guideSize || '',
                "guideTitle": formObj.guideTitle || '',
                "implMoney": formObj.implMoney || '',
                "otherDeputeBody": formObj.otherDeputeBody || '',
                "ourLawsuitBodyName": formObj.ourLawsuitBodyName || '',
                "ourLawsuitBody": formObj.ourLawsuitBody || '',
                "guideSolve": formObj.guideSolve || '',
                "guideId": formObj.guideId ? formObj.guideId : formInfo.formId
            };

            formInfo.title = model.guideTitle;//传入标题-必须！
            formInfo.importantLevel = model.guideSize;//将自己业务的重要程度字段赋值给它
            model.moduleName = formInfo.moduleName;
            return model;
        },
        //取地址栏参数
        getParam: function () {
            //接收参数
            var formId = getUrlParam("formId");//取表单业务数据Id
            var moduleName = getUrlParam("moduleName");//取业务表单模板标识
            var processInstId = getUrlParam("processInstId");//取流程实例Id
            var currActivityDefId = getUrlParam("currActivityDefId");//取流程节点
            var currActivityDefName = getUrlParam("currActivityDefName");//取流程节点
            var mode = getUrlParam("mode");//取表单状态

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
            if (!isEmpty(currActivityDefId)) {
                formInfo.currActivityDefId = currActivityDefId;
                formInfo.currActivityDefName = decodeURI(currActivityDefName);
            }
            return formInfo;
        },
        //绑定按钮事件
        bindEvent: function () {

            //表单控件事件加载
            formInfo.loadBusinessType();//加载所属类型下拉框数据
            formInfo.loadCaseReason();//加载纠纷元下拉框数据
            formInfo.loadGuideSize();//加载重要程度数据
            formInfo.loadGuideSolve();//加载建议解决方式数据


            formInfo.ourLitigationBodyPage();
            //文件上传
            $("#thelist").find('input[type="file"]').on('change', function () {
                uploadFile.upload($("#thelist"), this, {shareType: 1, formId: formInfo.formId});
            });

            //表单事件
            //金额与重要程度联动
            $("input[name=caseDeputeMoney]").on("input", function () {
                var money = parseInt($(this).val());
                var value;
                if (money >= (10000 * 100)) {
                    value = "weighty";
                } else{
                    value = "commonly";
                }
                $('select[name=guideSize]').val(value).trigger("change").next().find("dl").find("dd[lay-value='" + value + "']").click();//表单用了layer的下拉框
            });

            //底部按钮事件加载
            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#staging_btn').on('mouseup', formInfo.stagingBtnFun);//暂存
            $('#abandon_btn').on('click', formInfo.abandonBtnFun); //作废
            $('#save_btn').on('click', formInfo.saveBtnFun); //保存
            $('#return_btn').on('click', formInfo.returnBtnFun); //返回
            $('#start_btn').on('click', formInfo.submitBtnFun);//开始
        },
        //初始化表单
        initFormWrite: function () {
            formInfo.getParam();
            formInfo.bindEvent();

            if (!isEmpty(formInfo.formId)) {
                var resourceData = formInfo.requestFormObj(formInfo.formId);//根据表单Id获取表单信息
                if (!isEmpty(resourceData)) {
                    formInfo.flowId = resourceData.mian ? resourceData.mian.flowName : '';
                    formInfo.formObj = resourceData;//写入表单信息
                    formInfo.writeFormBaseInfo();//表单信息写入到页面
                    uploadFile.writeFileInfo($("#thelist"), formInfo.formObj.files, {
                        shareType: 1,
                        formId: formInfo.formId
                    });//写入附件信息
                } else {
                    layer.msg("未获取到表单信息");
                }
            } else {
                formInfo.formId = formBase.getPrimaryKey();
            }

            //根据绑定流程id和启动节点的id,执行表单权限控制
            var jurisdiction = formControl.initControl(formInfo);
            formInfo.versionId = jurisdiction.versionId;
            if (jurisdiction.flowId){
                formInfo.flowId = jurisdiction.flowId;
            }
            if (formInfo.flowStatus == "start") {
                formInfo.currActivityDefId = jurisdiction.flowStartAct;
                formInfo.currActivityDefName = jurisdiction.flowStartActName;
            }
            flowDrive.bindFlowFixbar(formInfo);//加载流程图
        }
    };

    formInfo.initFormWrite();
});

