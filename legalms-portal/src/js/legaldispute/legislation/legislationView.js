$(function () {
    var formInfo = {
            apiUrl: {
                findOne: baseUrl.legislation.findOneLegislation
            },
            flowStatus: "done",//默认流程状态-【已办查看】
            importantLevel: 'normal',
            driveWhereParam: {},
            //请求表单数据
            requestFormObj: function (formId) {
                var resourceData = {};
                var urlParam = "id=" + formId;
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

            checkUnit: function () {
                var executeUnitId = $("input[name=executeUnitId]").val();
                //判断如果选择单位不是当前组织级别则去掉部门必选规则
                var userInfo = getUserData('pid');
                if (userInfo.CURRUSERUNITID != executeUnitId) {
                    $("#w_executInfo").find("input[name=executiveArm]").removeAttr("lay-verify").parents(".layui-row").find("b").html("");
                } else {
                    $("#w_executInfo").find("input[name=executiveArm]").attr("lay-verify", "required").parents(".layui-row").find("b").html("*");
                }
            },
            //执行单位弹出
            assistUnitPage: function () {
                $(".assistUnitPage").on("click", function () {
                    var executeUnitId = $("input[name=executeUnitId]").val();
                    var $parent = $(".assistUnitPage").parent();
                    openSelectWindow.selectorgTree({
                        param: {flag: "13", flowId: formInfo.flowId},
                        callback: function (res) {
                            if (executeUnitId != res[0].id) {
                                $("#w_executInfo").find("input[name=executiveArm]").val("");
                                $("#w_executInfo").find("input[name=executiveArmId]").val("");
                            }
                            $parent.find("input[name=unitLevel]").val(res[0].orgLevel);
                            $parent.find("input[name=executeUnitName]").val(res[0].val);
                            $parent.find("input[name=executeUnitId]").val(res[0].id);
                            formInfo.checkUnit();
                        }
                    }, {
                        title: '请选择执行单位'
                    })
                });
            },
            //执行部门弹出
            executiveArmPage: function () {
                $(".executiveArmPage").on("click", function () {
                    var executeUnitId = $("input[name=executeUnitId]").val();
                    var unitLevel = $("input[name=unitLevel]").val();
                    if (!executeUnitId) {
                        layer.msg("请先选择执行单位！", {icon: 5, time: 1500, shade: 0.4});
                        return false;
                    }
                    var userInfo = getUserData('pid');
                    if (unitLevel) {
                        if (userInfo.CURRUSERORGLEVEL == "01" && unitLevel == "03") {
                            layer.msg("请修改执行单位！", {icon: 5, time: 1500, shade: 0.4});
                            return false;
                        } else if (userInfo.CURRUSERORGLEVEL == "03" && unitLevel == "01") {
                            layer.msg("请修改执行单位！", {icon: 5, time: 1500, shade: 0.4});
                            return false;
                        }
                    } else {
                        layer.msg("未获取到执行单位层级，请联系管理员！", {icon: 5, time: 1500, shade: 0.4});
                        return false;
                    }
                    //若是多选啊需要设置回填字段和值
                    var selectItem = {};
                    var executiveArmId = $("input[name=executiveArmId]").val();
                    var executiveArm = $("input[name=executiveArm]").val();
                    if (executiveArmId) {
                        selectItem = {
                            id: executiveArmId.split(","),
                            val: executiveArm.split(",")
                        };
                    }
                    openSelectWindow.selectorgTree({
                        param: {flag: "4", orgCode: executeUnitId},
                        isRadio: false,
                        selectItem: selectItem,
                        callback: function (res) {
                            var ids = [], vals = [];
                            $.each(res, function (index, value) {
                                //回调函数设置
                                ids.push(value.id);
                                vals.push(value.val);
                            });
                            $("input[name=executiveArmId]").val(ids.join(","));
                            $("input[name=executiveArm]").val(vals.join(","));
                        }
                    })
                })
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
                $.extend(viewObj, formInfo.formObj.caseMainVO);
                $.extend(viewObj, {
                    //需要转显示格式的字段
                    orgName: formInfo.formObj ? formInfo.formObj.orgName : '',
                    creationTime: dateFormat(formInfo.formObj.creationTime),
                    updateDate: dateFormat(formInfo.formObj.updateDate, 'yyyy-MM-dd'),
                    state: dataDict.getDictValueByKey("sys_flow_status", formInfo.formObj.state) + (formInfo.currActivityDefName == null ? "" : "（" + formInfo.currActivityDefName + "）"),
                });

                $("input[name=executionAmount]").next(".aux").html(common.convertCurrency(formInfo.formObj.executionAmount));//金额数字转大写

                $("#model_form").jsonSerializeForm(viewObj);

                $("label[name=caseTitle]").html('<a href="#" class="a-link">' + viewObj.caseTitle + '</a>');

                formInfo.title = formInfo.formObj.title;//将自己业务的标题赋值给它
                formInfo.driveWhereParam.executiveArmId = formInfo.formObj.executiveArmId;//将自己执行部门id赋值
                formInfo.driveWhereParam.unitCode = formInfo.formObj.executeUnitId;//将自己执行单位id赋值

                formInfo.checkUnit();
            },
            //撤回
            recallBtnFun: function () {
                if (formInfo.formObj && formInfo.formObj.mian && formInfo.formObj.mian.logs.length == 1) {
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
                        notRequiredField: {
                            executeUnitName: true,
                            executiveArm: true,
                            theContent: true,
                            feedBack: true,
                            updateDate: true
                        }
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
                }, function (callback) {
                    callback({
                        form_verify: {
                            unitLevel: function (value, item) {
                                var title = $(item).attr("title");
                                var unitLevel = $("#w_executInfo").find("input[name=unitLevel]").val();
                                if (unitLevel) {
                                    //判断如果选择单位不是当前组织级别则去掉部门必选规则
                                    var userInfo = getUserData('pid');
                                    if (userInfo.CURRUSERORGLEVEL == "01" && unitLevel != "02") {
                                        return "请修改" + title;
                                    } else if (userInfo.CURRUSERORGLEVEL == "03" && unitLevel != "02") {
                                        return "请修改" + title;
                                    }
                                } else {
                                    return "未获取到" + title + "层级，请联系管理员";
                                }
                            }
                        }
                    });
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
                var business_form = $("#business_form").serializeJSON();
                var temp_form = $("<form></form>").html($(".temp_form").clone()).serializeJSON();
                $.extend(business_form,temp_form);

                infoObj.businessMap = business_form;

                if (business_form.executeUnitId) {
                    formInfo.driveWhereParam.unitCode = business_form.executeUnitId;//将自己执行单位id赋值
                }

                if (business_form.executiveArmId) {
                    formInfo.driveWhereParam.executiveArmId = business_form.executiveArmId;//将自己执行部门id赋值
                }
                return infoObj;
            },
            //获取退回上一步流程所需参数对象
            getBackFlowInfo: function (nextNode, flowingInfo) {
                return flowDrive.getBackNodeParam(nextNode, flowingInfo, formInfo);
            },
            //获取驱动下一步流程所需参数对象
            getNextFlowInfo: function (nextNode, flowingInfo) {
                var model = flowDrive.getNextNodeParam(nextNode, flowingInfo, formInfo);
                //流程结束时让写死的流程参数
                if (nextNode.actDefParam == "finishActivity") {
                    model = flowDrive.getEndNodeParam(nextNode, flowingInfo, formInfo);
                    if (!model.businessMap) {
                        model.businessMap = {};
                    }
                    model.businessMap[formInfo.formObj.mian.approveItemName] = formInfo.formObj.mian.approveItemId;
                    model.businessMap.approveItemType = formInfo.formObj.mian.approveItemType;
                    model.businessMap.flowId = formInfo.processInstId;
                    model.businessMap.state = 30;//已办结的业务数据状态
                    model.businessMap.updateDate = formInfo.formObj.updateDate;//已办结的业务数据时间
                    model.moduleName = formInfo.moduleName;
                    model.busCode = formInfo.formObj.odd;
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
                $("#thelist_executeInfo_w").find('input[type="file"]').on('change', function () {
                    uploadFile.upload($("#thelist_executeInfo_w"), this, {
                        shareType: 'executeInfo',
                        formId: formInfo.formId
                    });
                });

                $("#thelist_feedBack_w").find('input[type="file"]').on('change', function () {
                    var userInfo = getUserData('pid');
                    // uploadFile.upload($("#thelist_feedBack_w"), this, {shareType: 'feedBack', formId: (formInfo.processInstId+formInfo.formId+formInfo.currActivityDefId+userInfo.LOGINACCT)});
                    uploadFile.upload($("#thelist_feedBack_w"), this, {
                        shareType: 'feedBack',
                        formId: (userInfo.LOGINACCT + formInfo.formId + (new Date).getTime())
                    });
                });

                $('#closebtn').on('click', formInfo.closeBtnFun);//关闭
                $('#btn_edit').on('click', formInfo.editBtnFun);//编辑-跳转到编辑页
                $('#back_btn').on('click', formInfo.backBtnFun);//退回
                $('#recall_btn').on('click', formInfo.recallBtnFun);//撤回
                $('#next_btn').on('click', formInfo.submitBtnFun);//下一步

                formInfo.assistUnitPage();//执行单位弹出选中框
                formInfo.executiveArmPage();//执行部门弹出选中框

                $('label[name=caseTitle]').on('click', function () {
                    var formId = $('input[name=caseId]').val();
                    if (formId) {
                        var path = pageUrl.caseManage.view;
                        var param = "?caseId=" + formId;
                        openFullWindow(path + param);
                    }
                });
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
                        uploadFile.writeFileInfo($("#thelist_executeBasis"), formInfo.formObj.files, {
                            onDel: false,
                            shareType: 'executeBasis'
                        });//写入附件信息

                        uploadFile.writeFileInfo($("#thelist_executeInfo_r"), formInfo.formObj.files, {
                            onDel: false,
                            shareType: 'executeInfo'
                        });
                        uploadFile.writeFileInfo($("#thelist_executeInfo_w"), formInfo.formObj.files, {
                            shareType: 'executeInfo',
                            formId: formInfo.formId
                        });

                        if (formInfo.formObj.mian != null) {
                            //加载流程审批历史/意见信息到HTMl
                            flowLog.writeFlowLog(formInfo.formObj.mian.logs, formInfo.currActivityDefId);//加载流程审批意见信息
                            feedbackLog.writeFeedbackLog(formInfo.formObj.feedBackMap, formInfo.formObj.currActivityDefId);//加载协办反馈记录
                        }
                        //根据绑定流程id和启动节点的id,执行表单权限控制
                        if (formInfo.formObj.mian && formInfo.formObj.mian.flowStatus == 30) {
                            //执行完毕日期控制
                            $('#r_updateDate').show();
                        }

                        //自定义权限
                        formInfo.customOperationPermission = function (tag) {
                            if (tag == "r_feedbackLog") {
                                //没反馈记录的的时候，读的权限不执行
                                if (!formInfo.formObj.feedBackMap) {
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
        },
        feedbackLog = {
            groups: {},
            //加载流程日志到页面
            writeFeedbackLog: function (logs, currentNode) {
                if (!isEmpty(logs)) {
                    $(".feedbackLog").html("");
                    $.each(logs, function (index, log) {
                        var logStr = feedbackLog.businessLogHtml(index, log);
                        $(".feedbackLog").append(logStr);
                    });
                }
            },
            businessLogHtml: function (key, dept_log) {
                //一个块
                var $groupBlock = $("<div class='group-block' name='block_" + key + "'></div>");
                var $groupMain = feedbackLog.logNode1Html(dept_log);
                $groupMain.prependTo($groupBlock);

                $.each(dept_log.subBusinessLog, function (i, log) {
                    var $logLine = feedbackLog.logNode2Html(log);
                    $groupBlock.append($logLine);
                });

                var $group = $("#" + dept_log.deptId);

                if ($("#" + dept_log.deptId).length < 1) {
                    $group = $("<div class='group'  id='" + dept_log.deptId + "'><div class='group-name' name='deptName'>" + dept_log.deptName + "</div></div>");
                    $group.append($groupBlock);
                    return $group.prop("outerHTML");
                } else {
                    $group.append("<div class='line'></div>");
                    $group.append($groupBlock);
                    return '';
                }
            },
            logNode1Html: function (log) {
                var $groupMain = $("<div class='group-main'>" +
                    "                 <div class='layui-row'>" +
                    "                     <div class='layui-col-md12'>" +
                    "                         <label class='layui-form-label' name='userInfo'></label>" +
                    "                         <div class='layui-input-block'>" +
                    "                     <textarea name='feedBack' readonly" +
                    "                               class='layui-textarea borderNone'></textarea>" +
                    "                         </div>" +
                    "                     </div>" +
                    "                 </div>" +
                    "             </div>");
                $groupMain.find("label[name=userInfo]").html("<b class='node'>" + log.actName + "</b>" + "<br />" + log.loginName + "<br />" + log.updateTime);
                $groupMain.find("textarea[name=feedBack]").html(log.businessField1);

                return $groupMain;
            },
            logNode2Html: function (log) {
                var $logLine = $("<div class='log-line'>" +
                    "                 <div class='layui-row'>" +
                    "                     <div class='layui-col-md12'>" +
                    "                         <label class='layui-form-label' name='userInfo'></label>" +
                    "                         <div class='layui-input-block'>" +
                    "                     <textarea name='feedBack' readonly" +
                    "                               class='layui-textarea borderNone'></textarea>" +
                    "                         </div>" +
                    "                     </div>" +
                    "                 </div>" +
                    "                 <div class='layui-row'>" +
                    "                     <div class='layui-col-md12'>" +
                    "                         <label class='layui-form-label'>附件：</label>" +
                    feedbackLog.filesHtml(log.files) +
                    "                     </div>" +
                    "                 </div>" +
                    "             </div>");
                $logLine.find("textarea[name=feedBack]").html(log.businessField1);
                $logLine.find("label[name=userInfo]").html("<b class='node'>" + log.actName + "</b>" + "<br />" + log.loginName + "<br />" + log.updateTime);

                return $logLine;
            },
            //拼接组装附件html内容
            filesHtml: function (files) {
                var fileHtml = [];
                var filesHtml = " ";
                if (files) {
                    $.each(files, function (i, file) {
                        fileHtml.push("<li><a href='#' fileUrl='" + baseUrl.file.filedown + "?path=" + encodeURIComponent(file.file_http_url) + "&fileName=" +
                            encodeURIComponent(file.file_name + "." + file.file_extension) + "' title='" + file.file_name + "' class='fileDown'>" + file.file_name + "." + file.file_extension + "</a></li>");
                    });
                }
                if (fileHtml.length > 0) {
                    filesHtml = "<div class='layui-input-block'>" +
                        "<ul class='uploadlist'>" + fileHtml.join("") +
                        "</ul> </div>";
                }
                return filesHtml;
            }
        };

    formInfo.initFormWrite();
});
