$(function () {
    var formInfo = {
        apiUrl:{
            save:baseUrl.tIssueJointly.tempTIssueJointly,
            findOne:baseUrl.tIssueJointly.findOneTIssueJointly,
            draft:baseUrl.tIssueJointly.addTIssueJointly
        },
        flowStatus: "start",//默认流程状态-【起草】
        importantLevel: 'normal',
        driveWhereParam: {},
       //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            var urlParam = "jointlyId=" + formId;
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
        //暂存表单数据
        saveFormObj: function (model) {
            ajax_req({
                url: formInfo.apiUrl.save,
                type: 'post',
                data: JSON.stringify(model),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        layer.msg("暂存表单信息成功",{ icon:1, time:500, shade:0.4 },function () {
                            formInfo.closeBtnFun(res);
                        });
                    }
                }
            });
        },
        //起草-下一步请求
        requestStartFlow:function(param){
            ajax_req({
                url: formInfo.apiUrl.draft,
                type: 'post',
                data: JSON.stringify(param),
                success: function (res) {

                    if (res.resultStat == "SUCCESS") {
                        layer.msg("提交成功",{ icon:1, time:500, shade:0.4 },function () {
                            formInfo.closeBtnFun()
                        });
                    } else {
                        layer.msg("提交失败");
                    }
                }
            });
        },
        //关联案件
        casePage: function () {
            //弹出选择案件
            $(".casePage").on("click", function () {
                openSelectWindow.selectcaseList({
                    param: {flag: "2"},
                    callback: function (res) {
                        $("input[name=caseTitle]").val(res[0].caseTitle);
                        var resultObj = res[0];
                        if (!isEmpty(res[0])) {
                            resultObj.caseReviewGrade = dataDict.getDictValueByKey("sys_case_level", res[0].caseReviewGrade);
                            resultObj.deputeType = dataDict.getDictValueByKey("sys_case_type", res[0].deputeType);
                            //卷宗没有重要程度，找许明昊确定重要程度字段，统一数据字典，以其它业务模块为准
                            resultObj.largeLawsuitMark = dataDict.getDictValueByKey("sys_issue_size", "commonly");

                        }
                        formInfo.writeCaseMain(resultObj);// 写入案件信息
                    }
                })
            });
            //查看关联案件
            $(".openCasePage").on("click", function () {
                var formId =  $('input[name=caseId]').val();
                if (formId){
                    var path = pageUrl.caseManage.view;
                    var param =  "?caseId=" + formId;
                    openFullWindow(path + param);
                }
            })
        },
        //协办单位弹出
        assistUnitPage: function () {
            $(".assistUnitPage").on("click", function () {
                var jointlyUnitId = $("input[name=jointlyUnitId]").val();
                openSelectWindow.selectorgTree({
                    param: {flag: "13", flowId: formInfo.flowId},
                    callback: function (res) {
                        if (jointlyUnitId != res[0].id) {
                            $("input[name=jointlyOrg]").val("");
                            $("input[name=jointlyOrgId]").val("");
                        }
                        $("input[name=unitLevel]").val(res[0].orgLevel);
                        $("input[name=jointlyUnitName]").val(res[0].val);
                        $("input[name=jointlyUnitId]").val(res[0].id);
                        checkUnit()
                    }
                },{
                    title:'请选择协办单位'
                })
            });
            function checkUnit() {
                var jointlyUnitId = $("input[name=jointlyUnitId]").val();
                //判断如果选择单位不是当前组织级别则去掉部门必选规则
                var userInfo = getUserData('pid');
                if (userInfo.CURRUSERUNITID != jointlyUnitId) {
                    $("input[name=jointlyOrg]").removeAttr("lay-verify").parents(".layui-row").find("b").html("");
                } else {
                    $("input[name=jointlyOrg]").attr("lay-verify", "required").parents(".layui-row").find("b").html("*");
                }
            }
            checkUnit();
        },
        //协办部门弹出
        executiveArmPage: function () {
            $(".executiveArmPage").on("click", function () {
                var jointlyUnitId = $("input[name=jointlyUnitId]").val();
                if (!jointlyUnitId) {
                    layer.msg("请选择协办单位！",{ icon:5, time:1500, shade:0.4 });
                    return false;
                }
                //若是多选啊需要设置回填字段和值
                var selectItem = {};
                var jointlyOrgId = $("input[name=jointlyOrgId]").val();
                var jointlyOrg = $("input[name=jointlyOrg]").val();
                if (jointlyOrgId){
                    selectItem = {
                        id:jointlyOrgId.split(","),
                        val:jointlyOrg.split(",")
                    };
                }
                openSelectWindow.selectorgTree({
                    param: {flag: "4", orgCode: jointlyUnitId},
                    isRadio: false,
                    selectItem:selectItem,
                    callback: function (res) {
                        var ids = [],vals = [];
                        $.each(res, function (index, value) {
                            //回调函数设置
                            ids.push(value.id);
                            vals.push(value.val);
                        });
                        $("input[name=jointlyOrgId]").val(ids.join(","));
                        $("input[name=jointlyOrg]").val(vals.join(","));
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
            if (!$("input[name=jointlyTitle]").val()){
                $("input[name=jointlyTitle]").addClass("layui-form-danger").focus();
                layer.msg("标题内容不能为空！",{ icon:5, time:1000, shade:0.4 });
                return false;
            }
            var formBaseObj = formInfo.getFormBaseObj();//取表单信息对象
            var model = {
                flowName: formInfo.flowId,
                model: formBaseObj,
                curActDefParam : formInfo.beginId,
                moduleName:formInfo.moduleName
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
            layer.confirm("确定作废当前流程吗？",{btn: ['确定', '取消'], title: "提示"},function () {
                var model = {
                    businessMap: {
                        approveItemId:formInfo.formObj.mian.approveItemId,
                        approveItemType: formInfo.formObj.mian.approveItemType,
                        flowId: formInfo.processInstId,
                        jointlyStatus: 50,
                        versionId:formInfo.versionId
                    },
                    moduleName: formInfo.moduleName,
                    busCode: formInfo.formObj.jointlyCode,
                    busTitle: formInfo.formObj.jointlyTitle
                };
                model.businessMap[formInfo.formObj.mian.approveItemName] = formInfo.formObj.mian.approveItemId;

                flowDrive.nullifyFlow(model, function (res) {
                    formInfo.closeBtnFun();
                });
            });
        },
        //编辑
        editBtnFun: function () {
            var search = window.location.search;
            window.location.href = pageUrl[formInfo.moduleName].edit + search;
        },
        //下一步
        submitBtnFun: function () {
            formInfo.formCheck(function ($form) {
                if (formInfo.flowStatus == "start") {
                    var formBaseObj = formInfo.getFormBaseObj();
                    flowDrive.selectUser(formInfo.flowStatus,function (nextNode) {
                        var model = formInfo.getStartFlowInfo(nextNode, formBaseObj);
                        formInfo.requestStartFlow(model);
                    },formInfo)
                } else if (formInfo.flowStatus == "task") {
                    var flowingInfo = formInfo.getFlowingInfo();

                    flowDrive.selectUser(formInfo.flowStatus,function (nextNode) {
                        var model = formInfo.getNextFlowInfo(nextNode, flowingInfo);

                        flowDrive.driveNextNode(model, function (res) {
                            formInfo.closeBtnFun();
                        });
                    },formInfo);
                }
            });
        },
        //回写案件信息
        writeCaseMain: function (caseMainVO) {

            if (caseMainVO) {
                $.extend(caseMainVO, {
                    //需要转显示格式的字段
                    orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
                    deputeType:dataDict.getDictValueByKey("sys_case_type", caseMainVO.deputeType),
                    caseSpecialLine:dataDict.getDictValueByKey("sys_case_line",caseMainVO.caseSpecialLine),
                    caseReviewGrade:dataDict.getDictValueByKey("sys_case_level",caseMainVO.caseReviewGrade),
                    largeLawsuitMark:dataDict.getDictValueByKey("sys_issue_size",caseMainVO.largeLawsuitMark),
                    ourLawsuitIdentity:dataDict.getDictValueByKey("sys_our_litigation",caseMainVO.ourLawsuitIdentity)
                });
                $("input[name=caseDeputeMoney]").next(".aux").html(common.convertCurrency(caseMainVO.caseDeputeMoney));//金额数字转大写

                $("#caseMain").jsonSerializeForm(caseMainVO);
                $("input[name=caseTitle]").val(caseMainVO.caseTitle);
                $("input[name=caseId]").val(caseMainVO.caseId);

                $("#caseMain").show();
            }
        },
        //写入表单基础信息
        writeFormBaseInfo: function () {
            var viewObj = {};
            $.extend(viewObj, formInfo.formObj);
            $.extend(viewObj, formInfo.formObj.mian);
            $.extend(viewObj, {
                //需要转显示格式的字段
                orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
                caseRecordTime: dateFormat(formInfo.formObj.caseRecordTime),
                jointlyStatus: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.jointlyStatus) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）")

            });

            $("#model_form").jsonSerializeForm(viewObj);

            formInfo.title = formInfo.formObj.jointlyTitle;//将自己业务的标题赋值给它
            formInfo.driveWhereParam.jointlyOrgId = formInfo.formObj.jointlyOrgId;//将自己协办部门id赋值给它
            formInfo.driveWhereParam.unitCode = formInfo.formObj.jointlyUnitId;//将自己协办单位id赋值

        },
        //获取流程中可编辑对象
        getFlowingInfo: function () {
            var infoObj = $("#flowing_form").serializeJSON();
            infoObj.businessMap = formInfo.getFormBaseObj();
            return infoObj
        },
        //起草获取表单流程对象
        getStartFlowInfo: function (nextNode,formObj) {
            return flowDrive.getStartNodeParam(nextNode,formObj,formInfo);
        },
        //流程中下一步获取表单流程对象
        getNextFlowInfo: function (nextNode, flowingInfo) {
            var model = flowDrive.getNextNodeParam(nextNode,flowingInfo,formInfo);
            //流程结束时让写死的流程参数
            if (nextNode.actDefParam == "finishActivity") {
                if (!model.businessMap){
                    model.businessMap = {};
                }
                model.businessMap.jointlyStatus = 30;//已办结的业务数据状态
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
        //获取组装处理后的表单对象
        getFormBaseObj: function () {
            //表单校验
            var formObj = $("#model_form").serializeJSON();

            //准备基础对象
            var model = {
                "jointlyTitle": formObj.jointlyTitle || '',
                "jointlyCase": formObj.caseId || '',
                "jointlyUnitName": formObj.jointlyUnitName || '',
                "jointlyUnitId": formObj.jointlyUnitId || '',
                "unitLevel": formObj.unitLevel || '',
                "jointlyOrg": formObj.jointlyOrg || '',
                "jointlyItem": formObj.jointlyItem || '',
                "jointlyStatus": "20",
                "jointlyCode": formObj.jointlyCode || '',
                "jointlyOrgId": formObj.jointlyOrgId || '',
                "jointlyId": formObj.jointlyId ? formObj.jointlyId : formInfo.formId
            };

            formInfo.title = model.jointlyTitle;//传入标题-必须！
            model.moduleName = formInfo.moduleName;
            formInfo.driveWhereParam.jointlyOrgId = model.jointlyOrgId;//将自己协办部门id赋值给它
            formInfo.driveWhereParam.unitCode = model.jointlyUnitId;//将自己协办单位id赋值
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
            //文件上传
            $("#thelist_jointlyFile").find('input[type="file"]').on('change', function () {
                uploadFile.upload($("#thelist_jointlyFile"),this,{shareType:'jointlyFile',formId:formInfo.formId});
            });

            //底部按钮事件加载
            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#staging_btn').on('click', formInfo.stagingBtnFun);//暂存
            $('#abandon_btn').on('click', formInfo.abandonBtnFun); //作废
            $('#save_btn').on('click', formInfo.saveBtnFun); //保存
            $('#return_btn').on('click', formInfo.returnBtnFun); //返回
            $('#start_btn').on('click', formInfo.submitBtnFun);//开始

            formInfo.assistUnitPage();//执行单位弹出选中框
            formInfo.executiveArmPage();//执行部门弹出选中框
            formInfo.casePage();//关联案件
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

                    formInfo.writeFormBaseInfo(); //表单信息写入到页面

                    uploadFile.writeFileInfo($("#thelist_jointlyFile"), formInfo.formObj.files, {
                        shareType: 'jointlyFile',
                        formId: formInfo.formId
                    });


                    if(formInfo.formObj.caseMainVO){
                        formInfo.writeCaseMain(formInfo.formObj.caseMainVO);// 写入案件信息
                    }

                }
            } else {
                //新建表单-获取表单Id,为了上传文件用的
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
