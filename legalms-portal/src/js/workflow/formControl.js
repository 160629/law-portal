var formControl = {
        setting: {
            start: {
                permissionJson: {
                    form: [],
                    //默认开始节点时显示【开始】【暂存】、【下一步】
                    operation: ['start_btn', 'staging_btn']
                }
            },
            task: {
                permissionJson: {
                    form: [],
                    //默认流程中时显示【流程中保存】、【编辑页返回详情页】、【下一步】、【处理意见、审批记录】
                    operation: ['save_btn', 'return_btn', 'next_btn', 'r_historyIdea', 'r_flowLog']
                }
            },
            //done和end拿不到流程节点信息 ，所以在这自定义
            done: {
                permissionJson: {
                    form: [],
                    //已办状态下可以看处理意见、审批记录、历史纠纷建议、文书执行案件、（文书、协办）反馈记录、协办案件信息、诉讼处理方案、交办信息、涉案负责人信息、业务类别、咨询答复
                    operation: ['r_historyIdea', 'r_flowLog', 'r_hisDisputeDeal', 'r_executeResult', 'r_executInfo', 'r_jointlyCase', 'r_feedbackLog', 'r_hisCaseAnalyze', 'r_assignInform', 'r_involve', 'r_businessType', 'r_businessProblem']
                }
            },
            end: {
                permissionJson: {
                    form: [],
                    //结束状态下可以看处理意见、审批记录、历史纠纷建议、文书执行案件、（文书、协办）反馈记录、、协办案件信息、诉讼处理方案、交办信息、涉案负责人信息、引诉执行结果、业务类别、咨询答复
                    operation: ['r_historyIdea', 'r_flowLog', 'r_hisDisputeDeal', 'r_executeResult','r_executInfo', 'r_jointlyCase',  'r_feedbackLog', 'r_hisCaseAnalyze', 'r_assignInform', 'r_involve', 'r_businessType', 'r_businessProblem']
                }
            }
        },
        //自定操作权限
        customOperationPermission: function (param, tag) {
            if (param.flowStatus == "start" && tag == "abandon_btn") {
                //如果流程处于起草，并且权限值中包含作废时，做控制不显示作废
                return false;
            }
            if (tag == "r_historyIdea") {
                if (param.formObj && param.formObj.mian.logs.length < 1) {
                    return false;
                }
            }
            if (typeof param.customOperationPermission == "function") {
                var rStatus = param.customOperationPermission(tag);
                if (rStatus != null) {
                    return rStatus;
                }
            }
            return true;
        },
        //自定义表单权限
        customFormPermission: function (param, tag) {
            if (typeof param.customFormPermission == "function") {
                var rStatus = param.customFormPermission(tag);
                if (rStatus != null) {
                    return rStatus;
                }
            }
            return true;
        },
        initControl: function (param) {
            var json = formControl.getJurisdictionControl(param);

            //业务模块传进来的自定义权限控制
            if (param.operation) {
                if (param.operation.operation) {
                    json.permissionJson.operation = json.permissionJson.operation.concat(param.operation.operation);
                }
                if (param.operation.form) {
                    json.permissionJson.operation = json.permissionJson.operation.concat(param.operation.form);
                }
            }

            formControl.operationControl(param, json.permissionJson.operation);
            formControl.formControl(param, json.permissionJson.form);
            // console.log(json.permissionJson.operation)

            //删除不用的card
            $(".div-flow .card").each(function () {
                if ($(this).is(':hidden')) {
                    $(this).remove();
                }
                //没有权限显示的textarea框，没有内容，card不显示
                var $textarea = $(this).find('textarea');
                var hasClass = $textarea.hasClass('borderNone');
                if (hasClass) {
                    var val = $textarea.val();
                    if (!val) {
                        //直接删了得了
                        $textarea.parents('.layui-row').remove();
                        var length = $(this).find('.layui-row').length;
                        if (length < 1) {
                            $(this).remove();
                        }
                    }

                }
            });
            $('textarea').autoHeight();

            formControl.exeCustomFun(param, json.customFun);
            return json;
        },
        //操作控制
        operationControl: function (param, json) {

            //插入自定义权限
            //如果是已办&&页面是从起草或已办点开的&&是当前人是起草人&&日志只有一条&&下一个节点的id不是bmjkr
            // console.log(param.flowStatus)
            // console.log(param.source)
            // console.log(param.formObj.isUnView)
            // console.log(param.formObj.mian.logs.length)
            if (param.flowStatus == "done" && (param.source == "create" || param.source == "done") && param.formObj && param.formObj.isUnView == 0 && param.formObj.mian && param.formObj.mian.logs.length == 1) {
                var currentUser = getUserData('pid').LOGINACCT;
                var createUser = param.formObj.mian.createUserId;
                if (createUser == currentUser) {
                    json.push("recall_btn");//插入撤回权限
                }
            }
            $.each(json, function (index, value) {
                var pd = formControl.customOperationPermission(param, value);
                if (pd) {
                    $('#' + value).show();
                }
            });

        },
        //表单控制
        formControl: function (param, json) {
            $.each(json, function (index, value) {
                var pd = formControl.customFormPermission(param, value);
                if (pd) {
                    if (value.indexOf("w_") > -1) {
                        var r_label = value.replace('w_', 'r_');
                        $('#' + r_label).remove();
                        $('#' + value).show();
                    }
                    if (value.indexOf("r_") > -1) {
                        var w_label = value.replace('r_', 'w_');
                        $('#' + w_label).remove();
                        $('#' + value).show();
                    }
                }
            })
        },
        exeCustomFun: function (param, customFun) {
            if (!!customFun) {
                $.each(customFun, function (i, fun) {
                    if (typeof fun == "function") {
                        fun();
                    }
                });
            }
        },
        //请求权限
        getJurisdictionControl: function (param) {
            var userInfo = getUserData('pid');
            param.roleCodes = userInfo.ROLECODELIST.toString();//取当前用户角色组code

            var jurisdiction = {};
            if (param.formObj && param.formObj.permissionJson) {
                jurisdiction.permissionJson = param.formObj.permissionJson;
                jurisdiction.versionId = param.formObj.mian.versionId;
            } else if (param.flowStatus == "start") {
                ajax_req({
                    url: baseUrl.flow.selActivityJurisdiction,
                    type: 'post',
                    async: false,
                    data: JSON.stringify({
                        beginId: param.beginId ? param.beginId : param.currActivityDefId,
                        flowId: param.flowId ? param.flowId : null,
                        roleCodes: param.roleCodes ? param.roleCodes : null,
                        moduleName: param.moduleName ? param.moduleName : null
                    }),
                    success: function (rs) {
                        if (rs.resultStat == "SUCCESS") {
                            if (rs.data != null) {
                                jurisdiction = rs.data;

                            }
                        } else {
                            layer.msg(rs.mess || "获取权限失败",{ icon:5, time:3000, shade: [0.5, 'gray'] },function () {
                                window.close();
                            });
                        }
                    }
                });
            }
            var defaultJson = formControl.setting[param.flowStatus].permissionJson;
            var customFun = {};
            if (param.flowStatus == "start" || param.flowStatus == "task") {
                //起草或流程中才可以获取权限啊
                if (!isEmpty(jurisdiction)) {
                    var importantLevel = param.importantLevel ? param.importantLevel : 'normal';
                    var permissionJson = eval(jurisdiction.permissionJson);
                    if (!!permissionJson && !permissionJson[importantLevel]) {
                        importantLevel = param.importantLevel ? param.importantLevel : 'weighty';
                    }
                    if (!!permissionJson && !!permissionJson[importantLevel]) {
                        var form = permissionJson[importantLevel].form ? permissionJson[importantLevel].form.split(",") : [];
                        var operation = permissionJson[importantLevel].operation ? permissionJson[importantLevel].operation.split(",") : [];
                        defaultJson.form = defaultJson.form.concat(form);
                        defaultJson.operation = defaultJson.operation.concat(operation);
                    } else {
                        layer.msg("未获取到权限信息");
                    }
                    customFun = permissionJson.customFun;
                }
            }
            jurisdiction.permissionJson = defaultJson;
            jurisdiction.customFun = customFun;
            return jurisdiction;
        }
    },
    flowLog = {
        //加载流程日志到页面
        writeFlowLog: function (logs, currentNode) {
            if (!isEmpty(logs)) {
                var logsHtml = [];
                var logsIdeaHtml = [];
                $.each(logs, function (index, log) {
                    var logStr = flowLog.flowLogHtml(log);
                    var logIdeaStr = flowLog.historyIdeahtml(log);
                    logsHtml.push(logStr);
                    logsIdeaHtml.push(logIdeaStr);
                });
                $("#r_flowLog .layui-timeline").html(logsHtml.join(""));//审批记录
                $("#r_historyIdea .log-content").html(logsIdeaHtml.join(""));//审批意见

                //会签意见展开/隐藏
                $('.pakeupbtn').on('click', function () {
                    var $div = $(this).parent().next(".hidehuiqian");
                    if ($div.is(":hidden")) {
                        $div.addClass("show");
                    } else {
                        $div.removeClass("show");
                    }
                });
            }
        },
        historyIdeahtml: function (log) {
            var logStr = '';
            if (log.opinion) {
                var opinion_content = log.opinion + "".replace("\n", "<br />");
                opinion_content = log.opinion + "".replace("\r", "<br />");
                var dispose_content = '';
                var activity_name_content = log.activityDefName;
                logStr = "<li class=''><div class='layui-text'>";
                if (log.workType == 2) {
                    dispose_content = "<span class='tages-red'>（代" + log.toerName + "审批）</span>";
                }
                if (log.logFlogName) {
                    activity_name_content = log.logFlogName + "-" + activity_name_content;
                }
                logStr += "<li class='layui-text'>" +
                    "<div class='heard'>" + activity_name_content + "</div>" +
                    "<div class='content'>";
                logStr += opinion_content || '';
                logStr += "</div>" +
                    "<div class='foot'>" +
                    "<span>" + log.orgName + "-" + (log.deptName || '') + "</span>" +
                    "<span>" + log.userName + "</span>" + dispose_content +
                    "<span>" + dateFormat(log.modifyTime) + "</span>" +
                    "</div>" +
                    "<div class='dashed-line'></div>" +
                    "</li>";


            }
            if (!isEmpty(log.groupingSubLogs)) {
                //有子流程日志时
                $.each(log.groupingSubLogs, function (index, groupingSubLogs) {
                    $.each(groupingSubLogs, function (index, subLog) {
                        subLog.pidDeptName = index;
                        subLog.logFlogName = '相关部门会签';
                        var $sonHtml = flowLog.historyIdeahtml(subLog);
                        logStr += $sonHtml + "";
                        if (subLog.subTFlowLogVOList && subLog.subTFlowLogVOList.length > 0) {
                            $.each(subLog.subTFlowLogVOList, function (index, subTFlowLogVOList) {
                                $sonHtml = flowLog.historyIdeahtml(subTFlowLogVOList);
                                logStr += $sonHtml + "";
                            });
                        }
                    });
                });
            }
            return logStr;

        },
        flowLogHtml: function (log) {
            var logStr = "<li class='layui-timeline-item'><i style='color: #e94345;' class='layui-icon layui-timeline-axis'></i><div class='layui-timeline-content layui-text'>";
            var dispose_content = "";
            var optionType_content = "送下一步";

            if (log.workType == 2) {
                dispose_content = "<span class='tages-red'>（代" + log.toerName + "审批）</span>";
            }
            if (log.optionType == 1) {
                optionType_content = "退回";
            } else if (log.optionType == 2) {
                optionType_content = "撤回";
            } else if (log.optionType == 3) {
                optionType_content = "作废";
            }
            logStr += "<div class='layui-timeline-title'>" +
                "<span>" + log.userName + "</span>" + dispose_content +
                "<span>：" + log.activityDefName + "</span>" +
                "<span class='optionType'>" + optionType_content + "</span>";
            if (log.optionType != 3) {
                //不是废弃才拼下一个节点的信息
                logStr += "<span class='endNode'>" + log.nextActivityDefName + "</span>" +
                    "<span>" + log.receiverName + "</span>";
            }
            logStr += "<span>（" + dateFormat(log.modifyTime) + "）</span>" +
                "</div>";
            logStr += "</div></li>";

            if (!isEmpty(log.groupingSubLogs)) {
                logStr += "<li class='layui-timeline-item'><i class='layui-icon layui-timeline-axis'>&#xe63f;</i><div class='layui-timeline-content layui-text'>" +
                    "<div class='layui-timeline-title'><input type='button' class='pakeupbtn' value='会签流程'/></div><div class='hidehuiqian hide'><ul class='layui-timeline'>";
                //有子流程日志时
                $.each(log.groupingSubLogs, function (index, groupingSubLogs) {

                    logStr += "<strong>" + index + "</strong>";
                    $.each(groupingSubLogs, function (index, subLog) {
                        var $sonHtml = flowLog.flogSonHtml(subLog);
                        logStr += $sonHtml + "";
                        if (subLog.subTFlowLogVOList && subLog.subTFlowLogVOList.length > 0) {
                            logStr += "<li class='layui-timeline-item'><i class='layui-icon layui-timeline-axis'>&#xe63f;</i><div class='layui-timeline-content layui-text'>" +
                                "<div class='layui-timeline-title'><input type='button' class='pakeupbtn' value='会签流程'/></div><div class='hidehuiqian hide'><ul class='layui-timeline'>";
                            $.each(subLog.subTFlowLogVOList, function (index, subTFlowLogVOList) {
                                $sonHtml = flowLog.flogSonHtml(subTFlowLogVOList);
                                logStr += $sonHtml + "";
                            });
                            logStr += "</ul></div>";
                        }
                    });
                });

                logStr += "</ul></div>";
            }
            return logStr;
        },
        flogSonHtml: function (log) {
            var dispose_content = "";
            var optionType_content = "送下一步";

            if (log.workType == 2) {
                dispose_content = "<span class='tages-red'>（代" + log.toerName + "审批）</span>";
            }
            if (log.optionType == 1) {
                optionType_content = "退回";
            }
            var logStr = "" +
                "   <li class='layui-timeline-item'>" +
                "     <div class='layui-timeline-content layui-text'>" +
                "        <div class='layui-timeline-title'>" +
                "        <span>" + log.userName + "</span>" + dispose_content +
                "        <span>：" + log.activityDefName + "</span>" +
                "        <span class='optionType'>" + optionType_content + "</span>" +
                "        <span class='endNode'>" + log.nextActivityDefName + "</span>" +
                "        <span>" + log.receiverName + "</span>" +
                "        <span>（" + dateFormat(log.modifyTime) + "）</span>" +
                "     </div>";
            logStr += "</div></li>";
            return logStr;
        }
    };
