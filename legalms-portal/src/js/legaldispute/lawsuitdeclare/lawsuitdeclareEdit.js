layui.use('form', function () {
    var form = layui.form;

    //监听下拉框数据变化
    form.on('checkbox(thirdPerson)', function (data) {
        if (data.elem.checked) {
            $("#thirdPersonAppend").show();
        } else {
            removeThreeAll("#thirdPersonAppend",function () {
                $("#thirdPersonAppend").hide();
            },function () {
                $('#thirdPersonId').attr("checked", true);
                form.render(); //重新渲染显示效果
            });
        }
    });
    form.on('checkbox(plaintiff)', function (data) {
        if (data.elem.checked) {
            $("#plaintiffAppend").show();
        } else {
            removeThreeAll("#plaintiffAppend",function () {
                $("#plaintiffAppend").hide();
            },function () {
                $('#plaintiffId').attr("checked", true);
                form.render(); //重新渲染显示效果
            });

        }
    });
    form.on('checkbox(defendant)', function (data) {
        if (data.elem.checked) {
            $("#defendantAppend").show();
        } else {
            removeThreeAll("#defendantAppend",function () {
                $("#defendantAppend").hide();
            },function () {
                $('#defendantId').attr("checked", true);
                form.render(); //重新渲染显示效果
            });

        }
    });
    $('.jabtn').on('click', function () {
        var inputLength = $(this).parents(".content-low").find('.layui-input-inline').length;
        if (inputLength < 10) {
            $(this).parent().before(appendInputHtml(''));
            $('.jianbtn').on('click', function () {
                removeThreeLine(this);
            });
        }else{
            layer.msg("最多可添加10个！");
        }
    });

    //表单事件
    $('.jianbtn').on('click', function () {
        removeThreeLine(this);
    });


});

function removeThreeAll(that, trueFun,falseFun) {

    var $line = $(that).find(".layui-input-inline");
    var inputArray = $line.find("input");
    if (inputArray.length < 1) {
        $line.remove();
        trueFun();
    }
    $.each(inputArray, function (i, $input) {
        var inputVal = $input.value;
        if (isEmpty(inputVal)) {
            $line.remove();
            trueFun();
        } else {
            layer.confirm("当前格中含有信息，确定删除吗？", {btn: ['确定', '取消'], title: "提示"}, function () {
                $line.remove();
                layer.msg("删除成功", {time: 100});
                trueFun();
            },function () {
                falseFun();
            });
            return false;
        }
    });
}

function removeThreeLine(that) {
    var $line = $(that).parent().parent();
    var inputVal = $line.find("input").val();
    if (isEmpty(inputVal)){
        $line.remove();
    } else{
        $line.remove();
    }
}
function setThreeParam(model) {
    var appendThird = [];
    $("#thirdPersonAppend input").each(function () {
        if ($(this).val()){
            appendThird.push($(this).val());
        }
    });
    var plaintiffAppend = [];
    $("#plaintiffAppend input").each(function () {
        if ($(this).val()) {
            plaintiffAppend.push($(this).val());
        }
    });

    var defendantAppend = [];
    $("#defendantAppend input").each(function () {
        if ($(this).val()) {
            defendantAppend.push($(this).val());
        }
    });
    model.thirdPerson = appendThird.join(",");
    model.plaintiff = plaintiffAppend.join(",");
    model.defendant = defendantAppend.join(",");
}

function appendInputHtml(res) {
    var inputHtml = "<div class='layui-input-inline'>" +
        "<div style='float:left'>" +
        "<input type='text' maxlength='80' lay-verify='maxlength' class='layui-input appendThird' placeholder='请输入' autocomplete='off' value='" + (res) + "'>" +
        "</div>" +
        "<div style='float: left' class='jiajinbtn'>" +
        "   <button type='button' class='float jiajianbtn jianbtn'>-</button>" +
        "</div>" +
        "</div>";
    return inputHtml;
}

$(function () {
    var formInfo = {
        apiUrl: {
            save: baseUrl.tIssueLawsuit.tempTIssueLawsuit,
            findOne: baseUrl.tIssueLawsuit.findOne,
            draft: baseUrl.tIssueLawsuit.addTIssueLawsuit
        },
        flowStatus: "start",//默认流程状态-【起草】
        importantLevel: 'commonly',
        driveWhereParam: {},
        //请求表单数据
        requestFormObj: function (formId) {
            var resourceData = {};
            var urlParam = "lawsuitId=" + formId;
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
        requestStartFlow: function (param) {
            ajax_req({
                url: formInfo.apiUrl.draft,
                type: 'post',
                data: JSON.stringify(param),
                success: function (res) {
                    if (res.resultStat == "SUCCESS") {
                        layer.msg("提交成功", {icon: 1, time: 1000, shade: 0.4}, function () {
                            formInfo.closeBtnFun()
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
            var $select = $('select[name=caseLine]');
            loadDictSelect($select, dictData);
        },

        loadCaseType: function () {
            var dictKey = "sys_case_type";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=caseType]');
            loadDictSelect($select, dictData);
        },
        // 申请纠纷缘由下拉框数据
        loadCaseReason: function () {
            var dictKey = "sys_case_reason";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=caseCause]');
            loadDictSelect($select, dictData);
        },
        //加载诉讼地位下拉框数据
        loadOurLitigation: function () {
            var dictKey = "sys_our_litigation";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=ourLawsuitStatus]');
            loadDictSelect($select, dictData);
        },
        // 加载重要程度下拉框数据
        loadGuideSize: function () {
            var dictKey = "sys_issue_lawsuit_size";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=lawsuitSize]');
            loadDictSelect($select, dictData, {checked: "commonly", onDefaultItem: false});
        },

        loadCaseData: function (caseId) {
            ajax_req({
                url: baseUrl.caseMain.selectCaseMain,
                type: 'post',
                data: JSON.stringify({"caseId": caseId}),
                success: function (res) {
                    if (res && res.data && res.data.caseMainVO) {
                        $("input[name=caseTitle]").val(res.data.caseMainVO.caseTitle);
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
                        $("input[name=guideTitle]").val(res.data.guideTitle);
                        $("label[name=guideTitle]").html('<a href="#">'+res.data.guideTitle+'</a>');
                    }
                }
            });

        },
        //写入其它涉案方到表单
        setThreeData: function (resourceData) {
            var thirdPerson = resourceData.thirdPerson;
            if (thirdPerson) {
                $("#thirdPersonAppend").show();
                $("#thirdPersonId").prop("checked", true);
                $("#thirdPersonAppend .layui-input-inline").remove();
                var thirdPersons = thirdPerson.split(',');
                for (var i = 0;i < thirdPersons.length; i++) {
                    var html = appendInputHtml(thirdPersons[i]);
                    $("#thirdPersonAppend .jiabtn_div").before(html);
                }
            }

            var plaintiff = resourceData.plaintiff;
            if (plaintiff) {
                $("#plaintiffAppend").show();
                $("#plaintiffId").prop("checked", true);
                $("#plaintiffAppend .layui-input-inline").remove();
                var plaintiffs = plaintiff.split(',');
                for (var i = 0; i < plaintiffs.length; i++) {
                    var html = appendInputHtml(plaintiffs[i]);
                    $("#plaintiffAppend .jiabtn_div").before(html);
                }
            }

            var defendant = resourceData.defendant;
            if (defendant) {
                $("#defendantAppend").show();
                $("#defendantId").prop("checked", true);
                $("#defendantAppend .layui-input-inline").remove();
                var defendants = defendant.split(',');
                for (var i = 0; i < defendants.length; i++) {
                    var html = appendInputHtml(defendants[i]);
                    $("#defendantAppend .jiabtn_div").before(html);
                }
            }

            //表单事件
            $('.jianbtn').on('click', function () {
                removeThreeLine(this);
            });

            if (resourceData) {
                layui.form.render('checkbox');
                return;
            }
        },
        //关联引诉弹出
        issueguidePage: function () {
            $(".issueguidePage").on("click", function () {
                openSelectWindow.selectissueguideList({
                    param: {correlate: "1"},
                    callback: function (res) {
                        // console.log(res[0])
                        var viewObj = {};
                        $.extend(viewObj, res[0]);
                        $.extend(viewObj, {
                            caseCause: res[0].caseReason,
                            theyLawsuitBody: res[0].otherDeputeBody,
                            lawsuitMoney: res[0].caseDeputeMoney,
                            caseLine: res[0].guideMethod,
                            guideId: res[0].guideId
                        });
                        // viewObj.lawsuitMoney = 10000001;
                        $("#model_form").jsonSerializeForm(viewObj);
                    }
                })
            })
        },
        //关联案件弹出
        casePage: function () {
            $(".casePage").on("click", function () {
                openSelectWindow.selectcaseList({
                    param: {flag: "1"},
                    callback: function (res) {

                        var viewObj = {};
                        $.extend(viewObj, res[0]);
                        $.extend(viewObj, {
                            caseTitle: res[0].caseTitle,
                            caseId: res[0].caseId,
                            caseLine: res[0].caseSpecialLine,
                            ourLawsuitBody: res[0].ourLawsuitBody,
                            ourLawsuitBodyName: res[0].ourLawsuitBodyName,
                            theyLawsuitBody: res[0].otherLawsuitBody,
                            ourLawsuitStatus: res[0].ourLawsuitIdentity,
                            lawsuitMoney: res[0].caseDeputeMoney,
                            caseType: res[0].deputeType,
                            caseCause: res[0].caseReason,
                            defendant: res[0].caseSameDefendant,
                            plaintiff: res[0].caseSamePlaintiff,
                            thirdPerson: res[0].caseTheThird
                        });
                        $("#model_form").jsonSerializeForm(viewObj);
                        formInfo.setThreeData(viewObj);
                    }
                })
            })
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
                        $("input[name=ourLawsuitBody]").val(bodyCode.join(","));
                        $("input[name=ourLawsuitBodyName]").val(bodyName.join(","));
                    }
                },{title:'选择我方诉讼主体'})
            })
        },
        //关闭
        closeBtnFun: function () {
            window.close();
        },
        //起草-暂存
        stagingBtnFun: function () {
            if (!$("input[name=lawsuitTitle]").val()){
                $("input[name=lawsuitTitle]").addClass("layui-form-danger").focus();

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
                        lawsuitStatus: 50,
                        versionId:formInfo.versionId
                    },
                    moduleName: formInfo.moduleName,
                    busCode: formInfo.formObj.lawsuitCode,
                    busTitle: formInfo.formObj.lawsuitTitle
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
            window.location.href = pageUrl[formInfo.moduleName].edit + search
        },
        //下一步
        submitBtnFun: function () {
            formInfo.formCheck(function ($form) {
                if (formInfo.flowStatus == "start") {
                    var formBaseObj = formInfo.getFormBaseObj();
                    flowDrive.selectUser(formInfo.flowStatus, function (nextNode) {
                        var model = formInfo.getStartFlowInfo(nextNode, formBaseObj);
                        formInfo.requestStartFlow(model);
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
            });
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
                lawsuitStatus: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.lawsuitStatus) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）"),
                lawsuitSizeName: dataDict.getDictValueByKey("sys_issue_lawsuit_size", formInfo.formObj.lawsuitSize)
            });

            $("#model_form").jsonSerializeForm(viewObj);

            $("input[name=lawsuitMoney]").next(".aux").html(common.convertCurrency(formInfo.formObj.lawsuitMoney));//金额数字转大写

            //业务中公共方法需要的参数
            formInfo.importantLevel = formInfo.formObj.lawsuitSize;//将自己业务的重要程度字段赋值给它
            formInfo.title = formInfo.formObj.lawsuitTitle;//将自己业务的标题赋值给它
        },
        //获取流程中可编辑对象
        getFlowingInfo: function () {
            var infoObj = $("#flowing_form").serializeJSON();
            infoObj.businessMap = formInfo.getFormBaseObj();
            return infoObj
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
                model.businessMap.lawsuitStatus = 30;//已办结的业务数据状态
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
            var formObj = $("#model_form").serializeJSON();
            //准备基础对象
            var model = {
                "caseDeputeAdvice": formObj.caseDeputeAdvice || '',
                "caseDeputeMoney": formObj.caseDeputeMoney || 0,
                "caseDeputeTruth": formObj.caseDeputeTruth || '',
                "guideId": formObj.guideId || '',
                "caseId": formObj.caseId || '',
                "caseCreateTime": formObj.caseCreateTime || '',
                "indictOrUnindict": formObj.indictOrUnindict || '',
                "caseType": formObj.caseType || '',
                "caseCause": formObj.caseCause || '',
                "caseLine": formObj.caseLine || '',
                "approveState": formObj.approveState || '',
                "approveCity": formObj.approveCity || '',
                "approveLevel": formObj.approveLevel || '',
                "approveOrg": formObj.approveOrg || '',
                "lawsuitTitle": formObj.lawsuitTitle || '',
                "theyLawsuitBody": formObj.theyLawsuitBody || '',
                "ourLawsuitBodyName": formObj.ourLawsuitBodyName || '',
                "ourLawsuitBody": formObj.ourLawsuitBody || '',
                "ourLawsuitStatus": formObj.ourLawsuitStatus || '',
                "signDept": formObj.signDept || '',
                "lawsuitMoney": formObj.lawsuitMoney || '',
                "lawsuitDetail": formObj.lawsuitDetail || '',
                "lawsuitAdvise":formObj.lawsuitAdvise || '',
                "lawsuitAnalyze":formObj.lawsuitAnalyze || '',
                "lawsuitSize": formObj.lawsuitSize || '',
                "lawsuitCode": formObj.lawsuitCode || '',
                "lawsuitId": formObj.lawsuitId ? formObj.lawsuitId : formInfo.formId
            };
            setThreeParam(model);
            formInfo.title = model.lawsuitTitle;//传入标题-必须！
            formInfo.importantLevel = model.lawsuitSize;//将自己业务的重要程度字段赋值给它
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
            formInfo.loadCaseType();//加载所属类型下拉框数据
            formInfo.loadCaseReason();//加载纠纷元下拉框数据
            formInfo.loadOurLitigation();//加载诉讼地位下拉框数据
            formInfo.loadGuideSize();//加载重要程度数据

            formInfo.issueguidePage();//关联引诉弹出框加载
            formInfo.ourLitigationBodyPage();//关联我方主体弹出框加载
            formInfo.casePage();//关联案件弹出框加载
            //文件上传
            $("#thelist").find('input[type="file"]').on('change', function () {
                uploadFile.upload($("#thelist"), this, {shareType: 1, formId: formInfo.formId});
            });


            //表单事件
            $('.jianbtn').on('click', function () {
                removeThreeLine(this);
            });
            //金额与重要程度联动
            $("input[name=lawsuitMoney]").on("input", function () {
                var money = parseInt($(this).val());
                var value;
                if (money >= (10000 * 100)) {
                    value = "weighty";
                } else{
                    value = "commonly";
                }
                $('select[name=lawsuitSize]').val(value).trigger("change").next().find("dl").find("dd[lay-value='" + value + "']").click();//表单用了layer的下拉框
            });

            //底部按钮事件加载
            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#staging_btn').on('click', formInfo.stagingBtnFun);//暂存
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

                    //写入附件信息
                    uploadFile.writeFileInfo($("#thelist"), formInfo.formObj.files, {
                        shareType: 1,
                        formId: formInfo.formId
                    });

                    formInfo.setThreeData(resourceData);

                    if (formInfo.formObj.caseId) {
                        formInfo.loadCaseData(formInfo.formObj.caseId);
                    }
                    if (formInfo.formObj.guideId) {
                        formInfo.loadGuideData(formInfo.formObj.guideId);
                    }

                } else {
                    layer.msg("未获取到表单信息");
                }
            } else {
                // formInfo.setThreeData();//默认不显示
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

