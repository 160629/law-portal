layui.use('form', function () {
    var form = layui.form;

    //监听下拉框数据变化
    form.on('select(province)', function(data){
        var citys = getApproveAdm(null,data.value);
        var $select = $('select[name=approveCity]');
        loadApprove($select, citys,'市');
    });

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
function getApproveAdm(level,code){
    var dictData;
    var param = {};
    if(level){
    	param.admLevel=level
    }
    if(code){
    	param.parentAdmCode=code
    }
    ajax_req({
        url: baseUrl.tIssueLawsuit.selectAdm,
        type: 'post',
        async: false,
        data: JSON.stringify(param),
        success: function (res) {
            if (res.resultStat == "SUCCESS") {
                dictData = res.data;
            } else {
                layer.msg("获取地区数据失败");
            }
        },
        error: function (err) {
            layer.msg("获取地区数据失败");
        }
    });
    return dictData;
}

function loadApprove($select,dictData,defaultStr) {
	if(dictData){
		$select.empty();
	    layui.use('form', function () {
	        $select.append('<option value="">'+defaultStr+'</option>');
	        $.each(dictData, function (index, value) {
	            $select.append('<option value="' + value.admCode + '">' + value.admName + '</option>');// 下拉菜单里添加元素
	        });
	        layui.form.render("select");
	    })
	}
}

$(function () {
    var formInfo = {
        apiUrl:{
            save:baseUrl.caseAssign.tempTCaseAssign,
            findOne:baseUrl.caseAssign.findOne,
            draft:baseUrl.caseAssign.addTCaseAssign
        },
        flowStatus: "start",//默认流程状态-【起草】
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
                    console.log(res);
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
        // 所属业务大类下拉框数据
        loadBusinessType: function () {
            var dictKey = "sys_business_type";
            var dictData = dataDict.getSysdictdata(dictKey);
            var $select = $('select[name=caseLine]');
            loadDictSelect($select, dictData);
        },
        // 所属业务大类下拉框数据
        loadCaseType: function () {
        	var dictKey = "sys_case_type";
        	var dictData = dataDict.getSysdictdata(dictKey);
        	var $select = $('select[name=caseType]');
        	loadDictSelect($select, dictData);
        },
        loadApproveState: function () {
            var level = "1";
            var data = getApproveAdm(level);
            var $select = $('select[name=approveState]');
            loadApprove($select, data,'省');
        },
        //加载诉讼地位下拉框数据
        loadOurLitigation: function () {
        	var dictKey = "sys_our_litigation";
        	var dictData = dataDict.getSysdictdata(dictKey);
        	var $select = $('select[name=ourLawsuitStatus]');
        	loadDictSelect($select, dictData);
        },
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
                    param: {flag:"1"},
                    isRadio: false,
                    selectItem:selectItem,
                    callback:function (res) {
                        var bodyName = [],bodyCode = [];
                        $.each(res, function (index, value) {
                            //回调函数设置
                            bodyName.push(value.bodyName);
                            bodyCode.push(value.bodyCode);
                        });
                        $("input[name=ourLawsuitBody]").val(bodyCode.join(","));
                        $("input[name=ourLawsuitBodyName]").val(bodyName.join(","));
                    }
                },'我方涉案主体')
            })
        },
        //关闭
        closeBtnFun: function () {
            window.close();
        },
        //起草-暂存
        stagingBtnFun: function () {
            if (!$("input[name=assignTitle]").val()){
                $("input[name=assignTitle]").addClass("layui-form-danger").focus();
                layer.msg("标题内容不能为空！",{ icon:5, time:1000, shade:0.4 });
                return false;
            }
            var formBaseObj = formInfo.getFormBaseObj();//取表单信息对象
            var model = {
                    flowName: formInfo.flowId,
                    model: formBaseObj,
                    curActDefParam : formInfo.currActivityDefId,
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
            layer.confirm("确定作废当前流程吗？", {btn: ['确定', '取消'], title: "提示"}, function () {
                var model = {
                    businessMap: {
                        approveItemId:formInfo.formObj.mian.approveItemId,
                        approveItemType: formInfo.formObj.mian.approveItemType,
                        flowId: formInfo.processInstId,
                        assignStatus: 50,
                        versionId:formInfo.versionId
                    },
                    moduleName: formInfo.moduleName,
                    busCode: formInfo.formObj.assignCode,
                    busTitle: formInfo.formObj.assignTitle
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
        //写入表单基础信息
        writeFormBaseInfo: function () {

            var viewObj = {};
            $.extend(viewObj, formInfo.formObj);
            $.extend(viewObj, formInfo.formObj.mian);

            $.extend(viewObj, {
                //需要转显示格式的字段
                orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
                caseCreateTime: dateFormat(formInfo.formObj.caseCreateTime, 'yyyy-MM-dd'),
                sendTime: dateFormat(formInfo.formObj.sendTime, 'yyyy-MM-dd'),
                lawsuitSize: dataDict.getDictValueByKey("sys_issue_size", formInfo.formObj.lawsuitSize),
                assignStatus: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.assignStatus) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）")

            });


            $("#model_form").jsonSerializeForm(viewObj);
            $("input[name=lawsuitMoney]").next(".aux").html(common.convertCurrency(formInfo.formObj.lawsuitMoney));//金额数字转大写

            //业务中公共方法需要的参数
            formInfo.importantLevel = formInfo.formObj.lawsuitSize;//将自己业务的重要程度字段赋值给它
            formInfo.title = formInfo.formObj.assignTitle;//将自己业务的标题赋值给它
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
                model.businessMap.assignStatus = 30;//已办结的业务数据状态
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
            formObj.approveStateName = $("select[name=approveState] :selected").html();
            formObj.approveCityName = $("select[name=approveCity] :selected").html();
            //准备基础对象
            var model = {
                "approveState": formObj.approveState || '',
                "approveCity": formObj.approveCity || '',
                "approveStateName": formObj.approveStateName || '',
                "approveCityName": formObj.approveCityName || '',
                "approveOrg": formObj.approveOrg || '',
                "assignFile": formObj.assignFile || '',
                "assignItem": formObj.assignItem || '',
                "assignCode": formObj.assignCode || '',
                "assignOrg": formObj.assignOrg || '',
                "assignStatus": formObj.assignStatus || '',
                "assignTitle": formObj.assignTitle || '',
                "assignType": formObj.assignType || '',
                "caseCode": formObj.caseCode || '',
                "caseCreateTime": formObj.caseCreateTime || '',
                "caseFile": formObj.caseFile || '',
                "caseLine": formObj.caseLine || '',
                "caseType": formObj.caseType || '',
                "createAccountId": formObj.createAccountId || '',
                "createTime": formObj.createTime || '',
                "sendTime": formObj.sendTime || '',
                "lawsuitMoney": formObj.lawsuitMoney || '',
                "lawsuitSize": formObj.lawsuitSize || '',
                "mainSeedOrg": formObj.mainSeedOrg || '',
                "mainSeedOrgId": formObj.mainSeedOrgId || '',
                "ourLawsuitBodyName": formObj.ourLawsuitBodyName || '',
                "ourLawsuitBody": formObj.ourLawsuitBody || '',
                "ourLawsuitStatus": formObj.ourLawsuitStatus || '',
                "plaintiffRequest": formObj.plaintiffRequest || '',
                "signDept": formObj.signDept || '',
                "theyLawsuitBody": formObj.theyLawsuitBody || '',
                "thirdPerson": formObj.thirdPerson || '',
                "plaintiff": formObj.plaintiff || '',
                "defendant": formObj.defendant || '',
                "assignId": formObj.assignId ? formObj.assignId : formInfo.formId
            };
            formInfo.title = model.assignTitle;//传入标题-必须！
            model.moduleName = formInfo.moduleName;
            setThreeParam(model);
            return model;
        },
        //绑定按钮事件
        bindEvent: function () {

            //表单控件事件加载
            formInfo.loadBusinessType();//加载所属类型下拉框数据
            formInfo.loadCaseType();//加载案件类型下拉框数据
            formInfo.loadApproveState();//加载审理机构省数据
            formInfo.loadOurLitigation();
            formInfo.ourLitigationBodyPage();//关联我方主体弹出框加载
            //文件上传
            $("#thelist").find('input[type="file"]').on('change', function () {
                uploadFile.upload($("#thelist"),this,{shareType:1,formId:formInfo.formId});
            });

            //表单事件
            $('.jianbtn').on('click', function () {
                removeThreeLine(this);
            });
            //底部按钮事件加载
            $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
            $('#staging_btn').on('click', formInfo.stagingBtnFun);//暂存
            $('#abandon_btn').on('click', formInfo.abandonBtnFun); //作废
            $('#save_btn').on('click', formInfo.saveBtnFun); //保存
            $('#return_btn').on('click', formInfo.returnBtnFun); //返回
            $('#start_btn').on('click', formInfo.submitBtnFun);//开始
            $(".mainSeedOrgPage").on("click", formInfo.sendArmPage);//主送部门弹出选中框

            var userInfo = getUserData('pid');
            $("input[name=assignOrg]").val(userInfo.CURRUSERORGNAME);

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
                    formInfo.setThreeData(resourceData);
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

            //表单写入完成后再加载的事件

            $("input[name=approveOrg]").on("keyup change",function () {
                var approveState = $("select[name=approveState]").val();
                var approveCity = $("select[name=approveCity]").val();
                if (approveState){
                    if (!approveCity){
                        layer.msg("请先选择市");
                        this.value = '';
                    }
                }else{
                    layer.msg("请先选择省");
                    this.value = '';
                }
            });

        }
    };

    formInfo.initFormWrite();
});

