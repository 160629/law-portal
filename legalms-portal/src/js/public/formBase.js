$(function () {
    bro(); //检测用户使用的什么浏览器
    iebanben(); // ie各个版本检测
    //------------------列表全局基础事件
    //表单基础信息展开/收缩
    $('.slideBtn').each(function (i,that) {
        if ($(that).parents('.card').hasClass('card-height')) {
            $(that).val("展开");
        } else {
            $(that).val("收起");
        }
        $(that).on('click', function () {
            if ($(this).parents('.card').hasClass('card-height')) {
                $(this).parents('.card').removeClass('card-height');
                $(this).val("收起");
            } else {
                $(this).parents('.card').addClass('card-height');
                $(this).val("展开");
            }
        });
    });
    formBase.inputRule();
    CommonOp.CommonOps();
    selectInputDelEvent();
    selectInputFormEvent();
    autoHeightEvent();

    $('textarea').autoHeight();//文本域自动扩展

    if ($("form").length > 0) {
        //每次表单清空表单数据，防止浏览器缓存
        $("form")[0].reset();
        $("form").find("input[type=hidden],textarea").val("");
    }
    //ie下输入框中回车页面刷新问题
    $('.layui-form input[type=text]').append("<input style='display: none;' disabled>");

});

//------------------表单全局基础事件
/**
 * 表单可点弹出选择框取消绑定事件
 * **/
function selectInputDelEvent() {
    var $span_input = $(".icon-inputDel").parent();
    $span_input.on("mouseover", function () {
        if ($(this).find("input[type=text]").val()) {
            $span_input.find(".icon-inputDel").show();
        }
    });
    $span_input.on("mouseout", function () {
        $(this).find(".icon-inputDel").hide();
    });
    $span_input.find(".icon-inputDel").on("click", function () {
        if (!$(this).is(":hidden")) {
            $(this).parent().find("input").val("");
        }
    });
}

/**
 * 列表弹出选择框查看关联表单事件
 * **/
function selectInputFormEvent() {
    var $span_input = $(".icon-inputForm").parent();
    $span_input.on("mouseover", function () {
        if ($(this).find("input[type=text]").val()) {
            $(this).find(".icon-inputForm").show();
        }
    });
    $span_input.on("mouseout", function () {
        $(this).find(".icon-inputForm").hide();
    });
}
/**
 * 表单中数据字典加载layui下拉框
 * setting={
 *     checked:'要选中的值'
 *     onDefaultItem:true //默认显示项:显示
 *     defaultItem:{
 *         key:''
 *         value:''
 *     }
 * }
 * */
function loadDictSelect($select, dictData, setting) {
    var config = {
        checked: '',
        onDefaultItem: true,
        defaultItem: {
            key: '',
            value: '请选择'
        }
    };
    $.extend(config, setting);
    layui.use('form', function () {
        //默认显示项
        if (config.onDefaultItem) {
            $select.append('<option value="' + config.defaultItem.key + '">' + config.defaultItem.value + '</option>');
        }
        $.each(dictData, function (index, value) {
            $select.append('<option value="' + value.dictValue + '">' + value.dictCabel + '</option>'); // 下拉菜单里添加元素
        });
        layui.form.render("select");
    })
}

/**
 * 请求服务器获得新增主键Id
 * */
var formBase = {
    getPrimaryKey: function () {
        var primaryKey;
        ajax_req({
            url: baseUrl.tFlowMain.getPrimaryKey,
            type: 'post',
            async: false,
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    primaryKey = res.data;
                } else {
                    layer.msg("获取表单主键信息失败");
                }
            },
            error: function (err) {
                layer.msg("获取表单主键信息失败");
            }
        });
        return primaryKey;
    },
    inputRule: function () {
        //输入时，数字金额转换为大写人民币汉字
        $('.numFormat').each(function () {
            $(this).on('input', function () {
                var reg = new RegExp("^[0-9]{0,15}$|^[0-9]{0,15}\\.[0-9]{0,2}$");
                if (reg.test(this.value)) {
                    this.t_value = this.value;
                    var money = this.value;
                    var formatStr = common.convertCurrency(money);
                    $(this).next(".aux").html(formatStr);
                } else {
                    this.value = this.t_value || '';
                }
            });
        });
        $('.c-title').each(function () {
            //不允许特殊输入字符
            $(this).on('input', function () {
                inputControl.replaceAndSetPos(this,/&quot;|&lt;|&gt;|[\……\~\`\·\|\【\】\!\！\{\}\#\$\￥\%\^\&\*\(\)\[\]\\\/\?\？\=\+]|@|/g,'');
            })
        });   

    },
    form_verify: {
        notRequiredField: {},
        phone: [/^1\d{10}$/, "请输入正确的手机号"],
        email: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, "邮箱格式不正确"],
        url: [/(^#)|(^http(s*):\/\/[^\s]+\.[^\s]+)/, "链接格式不正确"],
        number: function (e) {
            if (!e || isNaN(e)) return "只能填写数字"
        },
        date: [/^(\d{4})[-\/](\d{1}|0\d{1}|1[0-2])([-\/](\d{1}|0\d{1}|[1-2][0-9]|3[0-1]))*$/, "日期格式不正确"],
        identity: [/(^\d{15}$)|(^\d{17}(x|X|\d)$)/, "请输入正确的身份证号"],
        //标题类字段校验-在
        title: function (value, item) {
            var title = $(item).attr("title");
            var pattern = new RegExp(/&quot;|&lt;|&gt;|[\……\~\`\·\|\【\】\!\！\{\}\#\$\￥\%\^\&\*\(\)\[\]\\\/\?\？\=\+]|@|/g);
            if (!pattern.test(this.value)) {
                return (title || '内容') + '中不能有特殊字符';
            }
        },
        //长度类字段校验
        maxlength: function (value, item) {
            var length_val = $(item).attr("maxlength");
            var title = $(item).attr("title");
            if (value.length > length_val) {
                return (title || '内容') + '长度不能超过' + length_val + '字';
            }
        },
        required: function (value, item) {
            var pd = true;
            if (formBase.form_verify.notRequiredField) {
                var name = $(item).attr("name");
                if (formBase.form_verify.notRequiredField[name]) {
                    pd = false;
                }
            }
            if (pd) {
                var title = $(item).attr("title");
                if (item.type == "file") {
                    //如果是校验附件
                    var fileLength = $(item).parents(".duilie").find(".uploadlist").find("li").length;
                    if (fileLength < 1) {
                        return (title || '内容') + '不能为空';
                    }
                } else {
                    if (!value) {
                        return (title || '内容') + '不能为空';
                    } else {
                        var re = new RegExp("^[ ]+$");
                        if (re.test(value)) {
                            return (title || '内容') + '中不能全部为空格';
                        }
                    }
                }
            }
        },
        required_radio: function (value, item) {
            var name = $(item).attr("name");
            var label = $(item).attr("label");
            var val = $('input:radio[name="' + name + '"]:checked').val();
            if (!val) {
                return (label || '内容') + '不能为空';
            }
        }
    }
};

//附件
var uploadFile = {
    //删除
    requestDelFile: function (fileId, fun) {
        ajax_req({
            url: baseUrl.file.deleteFileCaseMain,
            type: 'post',
            async: false,
            data: JSON.stringify({
                fileShareId: fileId
            }),
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    fun(res.data);
                    layer.msg(res.mess, {
                        time: 1000
                    });
                } else {
                    layer.alert('删除信息失败，请联系管理员', {
                        icon: 2,
                        title: "提示"
                    });
                }
            },
            error: function (e) {
                layer.alert('删除信息失败，请联系管理员', {
                    icon: 2,
                    title: "提示"
                });
            }
        });
    },
    //根据附件标识查询附件信息
    requestFileById: function (fun, fileId, shareType) {
        ajax_req({
            url: baseUrl.file.selectFile,
            type: 'get',
            async: false,
            data: "fileShareBusinessKey=" + fileId + "&shareType=" + shareType,
            success: function (res) {
                if (res.data != null) {
                    fun(res.data);
                }
            },
            wrong: function (err) {
            }
        })
    },
    requestUploadFile: function ($fileList,that,param) {
        if (param.file.size < 1) {
            layer.msg("不允许上传空文件", {
                time: 1000
            });
            return false;
        }
        if (param.file.size >= 52428800) {
            layer.msg("附件大小不允许超过50M", {
                time: 1000
            });
            return false;
        }
        var formData = new FormData();
        formData.append('file', param.file);
        formData.append('shareType', param.shareType);
        formData.append('primaryKey ', param.formId);
        ajax_req({
            url: baseUrl.file.uploadFileMain,
            contentType: false,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false
        }).done(function (res) {
            if (res.resultStat == "SUCCESS") {
                uploadFile.getFileList($fileList, that, param);
            } else {
                layer.msg("上传失败！");
            }
        }).fail(function (res) {
            console.log(res);
        });
    },
    //ie重置上传按钮
    resetFile: function ($fileList, $that, param) {
        var input = $($that.outerHTML);
        var parent = $($that).parent();
        $(parent).find("input[type=file]").remove();
        $(parent).append(input);
        input.value = '';
        var isChangeEvent = $(input).attr("onchange");
        if (!isChangeEvent){
              input.on("change", function () {
                uploadFile.upload($fileList, this, param);
            });
        }
    },
    // 文件上传
    upload: function ($fileList, that, param) {
        var nums = $fileList.find(".uploadlist").find("li").length;
        if (nums >= 10) {
            layer.msg("附件最多只可以上传10个", {
                time: 1000
            });
            return false;
        }
        var fileCount = that.files.length + nums;
        if (fileCount > 10) {
            layer.msg("已上传" + nums + "个附件，选中" + that.files.length + "个,附件最多只可上传10个", {
                time: 3000
            });
            return false;
        }
        var loading = layer.load(2,{shade:0.2});
        var isFileRepetition = {};//遍历文件名，做重复校验
        $fileList.find("a").each(function (i,that) {
            isFileRepetition[that.text] = true;
        });
        $.each(that.files,function (i,v) {
            if (!isFileRepetition[v.name]) {
                param.file = v;
                uploadFile.requestUploadFile($fileList, that, param);
            }else{
                layer.msg("附件：" + v.name + "已存在，不能重复添加", {
                    time: 2000
                });
            }
        });
        uploadFile.resetFile($fileList, that, param);
        layer.close(loading);
    },
    getFileList: function ($fileList, that, param) {
        uploadFile.requestFileById(function (rs) {
            uploadFile.writeFileInfo($fileList, rs, param, that);
        }, param.formId, param.shareType);
    },
    delFile: function ($fileList, that, index, file_share_id, param) {
        layer.confirm("确定删除选中的信息吗？", {
            btn: ['确定', '取消'],
            title: "提示"
        }, function () {
            $fileList.find(".uploadlist").find("li").eq(index - 1).remove();

            uploadFile.requestDelFile(file_share_id, function f() {
                uploadFile.getFileList($fileList, that, param);
            });
        });
    },
    createObjectURL: function (object) {
        return (window.URL) ? window.URL.createObjectURL(object) : window.webkitURL.createObjectURL(object);
    },
    //下载
    downloadFile: function (url, fileName) {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        xhr.open('get', url);  //url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("pid", getLocalInfo("pid"));
        xhr.setRequestHeader("token", getLocalInfo("token"));
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
            var blob = this.response;
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, fileName);
            } else {
                var a = document.createElement('a');
                var url = uploadFile.createObjectURL(blob);
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            }
        };
        xhr.send(formData);
    },
    //回写附件信息
    writeFileInfo: function ($fileList, files, param, that) {
        if (param.onDel == null) {
            param.onDel = true;
        }
        $fileList.find(".uploadlist").html("");
        param["file_" + param.shareType] = [];
        $.each(files, function (index, value) {
            if (value.file_share_type === (param.shareType + "")) {
                uploadFile.writefileHtml($fileList, that, value, param);
            }
        });
        if (param.onDel){
            var shareId = "";
            if (param["file_" + param.shareType]) {
                shareId = param["file_" + param.shareType].join(",");
            }
            $fileList.find("input[name=file_" + param.shareType + "]").remove();
            $fileList.append("<input name='file_" + param.shareType + "' type='hidden' value='" + shareId + "'>");

            //其它模块上传id回调
            if (that && that.callbackFun) {
                that.callbackFun(param);
            }
        }
    },
    //加载文件列表
    writefileHtml: function ($fileList, that, file, data) {
        //取fileIds
        if (data.onDel) {
            if (data["file_" + data.shareType] == null) {
                data["file_" + data.shareType] = [file.file_id];
            } else {
                var filesStr = data["file_" + data.shareType].join(',');
                if (filesStr.indexOf(file.file_id) < 0) {
                    data["file_" + data.shareType].push(file.file_id);
                }
            }
        }
        var fileHtml = "<li><div class='upload-file'>" +
            "<div class='filename'><i class='layui-icon layui-icon-link'></i>" +
            "<a href='" + baseUrl.file.filedown + "?path=" + encodeURIComponent(file.file_http_url) + "&fileName=" +
            encodeURIComponent(file.file_name + "." + file.file_extension) + "' title='" + file.file_name + "." + file.file_extension + "' class='fileDown'>" + file.file_name + "." + file.file_extension + "</a></div>";
        if (data.onDel) {
            //是否显示删除按钮
            fileHtml += "<i file_share_id='" + file.file_share_id + "'class='deletimg layui-icon layui-icon-close'></i> ";
        }
        fileHtml += "</li>";
        $fileList.find(".uploadlist").append(fileHtml);

        $fileList.find('.uploadlist .deletimg').click(function () {
            //文件上传
            var index = $(this).parents("li").index();
            var file_share_id = $(this).attr("file_share_id");
            uploadFile.delFile($fileList, that, index, file_share_id, data);
        });
        $fileList.find('.uploadlist a').on("click", function (event) {
            event.preventDefault();//使a自带的方法失效，即无法调整到href中的URL
            var url = $(this).attr("href");
            var fileName = $(this).html();
            uploadFile.downloadFile(url, fileName);
        });
    }
};
var flowDrive = {
    //组装流程中保存的参数对象
    getFlowingParam: function (flowingInfo, formInfo) {

        var paramObj = {
            businessMap: flowingInfo.businessMap,
            title: formInfo.title
        };
        paramObj.tFlowLog = {
            status: flowingInfo.status || '',
            opinion: flowingInfo.opinion || '',
            businessAdvice: flowingInfo.businessAdvice || '',
            flowId: formInfo.processInstId || '',
            activityDefId: formInfo.currActivityDefId || '',
            activityDefName: formInfo.currActivityDefName || '',
            approveItemId: formInfo.formObj.mian.approveItemId || '',
            approveItemType: formInfo.formObj.mian.approveItemType || '',
            userId: getLocalInfo('loginAccount'),
            versionId:formInfo.versionId
        };
        return paramObj;
    },
    //组装驱动结束节点的参数对象
    getEndNodeParam: function (nextNode, flowingInfo, formInfo) {
        var paramObj = {
            signDept: nextNode.signDept,
            moduleName: formInfo.moduleName,
            orgs: [],
            title: formInfo.title,
            optionType:0
        };

        //是会签，把所有人插进去
        for (var key in nextNode.userData) {
            var userData = nextNode.userData[key];
            var org = {
                "depaInterPersonP": {
                    "email": userData.email || "test@sian.com",
                    "id": userData.receiverId || '',
                    "name": userData.receiverName || '',
                    "typeCode": "emp"
                },
                "orgCode": userData.orgCode || "",
                "orgName": userData.orgName || "",
                "receiverCompanyId": userData.receiverCompanyId || "0000001",
                "receiverCompanyName": userData.receiverCompanyName || "测试名称",
                "receiverId": userData.receiverId || '',
                "receiverName": userData.receiverName || '',
                "receiverOrgId": userData.receiverOrgId || '',
                "receiverOrgName": userData.receiverOrgName || ''
            };
            paramObj.orgs.push(org);
        }
        paramObj.tFlowLog = {
            nextActivityDefId: nextNode.actDefParam || '',
            nextActivityDefName: nextNode.actDefName || '',
            status: flowingInfo.status || '',
            opinion: flowingInfo.opinion || '',
            businessAdvice: flowingInfo.businessAdvice || '',
            flowId: formInfo.processInstId ? formInfo.processInstId : formInfo.formObj.mian.flowId || '',
            activityDefId: formInfo.currActivityDefId || '',
            activityDefName: formInfo.currActivityDefName || '',
            approveItemId: formInfo.formObj.mian.approveItemId || '',
            approveItemType: formInfo.formObj.mian.approveItemType || '',
            userId: getLocalInfo('loginAccount'),
            versionId:formInfo.versionId
        };

        paramObj.businessMap = flowingInfo.businessMap;
        return paramObj;
    },
    //组装驱动下一个节点的参数对象
    getNextNodeParam: function (nextNode, flowingInfo, formInfo) {
        var paramObj = {
            signDept: nextNode.signDept,
            moduleName: formInfo.moduleName,
            orgs: [],
            title: formInfo.title,
            optionType:0
        };

        //是会签，把所有人插进去
        for (var key in nextNode.userData) {
            var userData = nextNode.userData[key];
            var org = {
                "depaInterPersonP": {
                    "email": userData.email || "test@sian.com",
                    "id": userData.receiverId || '',
                    "name": userData.receiverName || '',
                    "typeCode": "emp"
                },
                "orgCode": userData.orgCode || "",
                "orgName": userData.orgName || "",
                "receiverCompanyId": userData.receiverCompanyId || "0000001",
                "receiverCompanyName": userData.receiverCompanyName || "测试名称",
                "receiverId": userData.receiverId || '',
                "receiverName": userData.receiverName || '',
                "receiverOrgId": userData.receiverOrgId || '',
                "receiverOrgName": userData.receiverOrgName || ''
            };
            paramObj.orgs.push(org);
        }
        paramObj.tFlowLog = {
            nextActivityDefId: nextNode.actDefParam || '',
            nextActivityDefName: nextNode.actDefName || '',
            status: flowingInfo.status || '',
            opinion: flowingInfo.opinion || '',
            businessAdvice: flowingInfo.businessAdvice || '',
            flowId: formInfo.processInstId ? formInfo.processInstId : formInfo.formObj.mian.flowId || '',
            activityDefId: formInfo.currActivityDefId || '',
            activityDefName: formInfo.currActivityDefName || '',
            approveItemId: formInfo.formObj.mian.approveItemId || '',
            approveItemType: formInfo.formObj.mian.approveItemType || '',
            userId: getLocalInfo('loginAccount'),
            versionId:formInfo.versionId
        };

        $.each(flowingInfo.businessMap, function (index, value) {
            if (!value) {
                delete flowingInfo.businessMap[index]
            }
        });

        //默认提交表单id吗，如果只有id就不提交表单信息，提交了后台会炸
        if (Object.keys(flowingInfo.businessMap).length > 1) {
            paramObj.businessMap = flowingInfo.businessMap;

            if (flowingInfo.businessMap.file_businessAdvice){
                //后台要加的定制参数，处理建议、方案之类的流程中业务类型审批意见的附件
                paramObj.fileBusinessAdvice = flowingInfo.businessMap.file_businessAdvice;
                delete paramObj.businessMap.file_businessAdvice
            }
        }
        return paramObj;
    },
    //组装退回一个节点的参数对象
    getBackNodeParam: function (nextNode, flowingInfo, formInfo) {
        var paramObj = {
            signDept: nextNode.signDept,
            moduleName: formInfo.moduleName,
            orgs: [],
            title: formInfo.title,
            mian:formInfo.formObj.mian,
            optionType:1
        };

        //是会签，把所有人插进去
        for (var key in nextNode.userData) {
            var userData = nextNode.userData[key];
            var org = {
                "depaInterPersonP": {
                    "email": userData.email || "test@sian.com",
                    "id": userData.receiverId || '',
                    "name": userData.receiverName || '',
                    "typeCode": "emp"
                },
                "orgCode": userData.orgCode || "",
                "orgName": userData.orgName || "",
                "receiverCompanyId": userData.receiverCompanyId || "0000001",
                "receiverCompanyName": userData.receiverCompanyName || "测试名称",
                "receiverId": userData.receiverId || '',
                "receiverName": userData.receiverName || '',
                "receiverOrgId": userData.receiverOrgId || '',
                "receiverOrgName": userData.receiverOrgName || ''
            };
            paramObj.orgs.push(org);
        }
        paramObj.tFlowLog = {
            nextActivityDefId: nextNode.actDefParam || '',
            nextActivityDefName: nextNode.actDefName || '',
            status: flowingInfo.status || '',
            opinion: flowingInfo.opinion || '',
            businessAdvice: flowingInfo.businessAdvice || '',
            flowId: formInfo.processInstId ? formInfo.processInstId : formInfo.formObj.mian.flowId || '',
            activityDefId: formInfo.currActivityDefId || '',
            activityDefName: formInfo.currActivityDefName || '',
            approveItemId: formInfo.formObj.mian.approveItemId || '',
            approveItemType: formInfo.formObj.mian.approveItemType || '',
            userId: getLocalInfo('loginAccount'),
            versionId:formInfo.versionId
        };

        $.each(flowingInfo.businessMap, function (index, value) {
            if (!value) {
                delete flowingInfo.businessMap[index]
            }
        });

        //默认提交表单id吗，如果只有id就不提交表单信息，提交了后台会炸
        if (Object.keys(flowingInfo.businessMap).length > 1) {
            paramObj.businessMap = flowingInfo.businessMap;

            if (flowingInfo.businessMap.file_businessAdvice){
                //后台要加的定制参数，处理建议、方案之类的流程中业务类型审批意见的附件
                paramObj.fileBusinessAdvice = flowingInfo.businessMap.file_businessAdvice;
                delete paramObj.businessMap.file_businessAdvice
            }
        }
        return paramObj;
    },
    //组装开始节点驱动下一个节点的参数对象
    getStartNodeParam: function (nextNode, model, formInfo) {

        model.signDept = nextNode.signDept;
        formInfo.formObj = model;
        var paramObj = {
            flowName: formInfo.flowId,
            model: model,
            actDefName: nextNode.actDefName,
            actDefParam: nextNode.actDefParam,
            curActDefParam: formInfo.currActivityDefId,
            moduleName: formInfo.moduleName,
            orgs: [],
            title: formInfo.title,
            optionType:0,
            versionId:formInfo.versionId
        };
        //是会签，把所有人插进去
        for (var key in nextNode.userData) {
            var userData = nextNode.userData[key];
            var org = {
                "depaInterPersonP": {
                    "email": userData.email || "test@sian.com",
                    "id": userData.receiverId || '',
                    "name": userData.receiverName || '',
                    "typeCode": "emp"
                },
                "orgCode": userData.orgCode || "",
                "orgName": userData.orgName || "",
                "receiverCompanyId": userData.receiverCompanyId || "0000001",
                "receiverCompanyName": userData.receiverCompanyName || "测试名称",
                "receiverId": userData.receiverId || '',
                "receiverName": userData.receiverName || '',
                "receiverOrgId": userData.receiverOrgId || '',
                "receiverOrgName": userData.receiverOrgName || ''
            };
            paramObj.orgs.push(org);
        }
        return paramObj;
    },
    bindFlowFixbar: function (formInfo) {
        if (!formInfo.processInstId && formInfo.formObj && formInfo.formObj.mian) {
            formInfo.processInstId = formInfo.formObj.mian.flowId
        }
        var flowId = formInfo.processInstId ? formInfo.processInstId : formInfo.flowId;
        var mode = formInfo.flowStatus;
        layui.use(['util', 'layer'], function () {
            var util = layui.util;
            //固定块
            util.fixbar({
                bar1: '<img src="/legalms/legalms-portal/src/css/images/flow.png">',
                css: {
                    right: 10,
                    bottom: 15
                },
                bgcolor: '#4e5364',
                click: function (type) {
                    if (type === 'bar1') {
                        flowDrive.showFlowChart(mode, flowId);//请求内网静态流程图
                    }
                }
            });
        });
    },
    showFlowChart: function (mode, flowId) {
        var param = {};
        if (mode == 'task' || mode == 'done' || mode == 'end') {
            param.flowInstId = flowId;
        } else if (mode == 'start') {
            param.flowDefName = flowId;
        }
        ajax_req({
            url: baseUrl.flow.getFlowChart,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(param),
            success: function (rs) {
                if (rs.data != null) {
                    var chartHtml = rs.data.flowChartHtml;
                    if (chartHtml) {
                        // chartHtml = chartHtml.replace(/.gif/g,".png");//流程图的git图片格式有问题转一下
                        localStorage.removeItem('workflowChartHTML');
                        localStorage.setItem('workflowChartHTML', chartHtml);
                        layer.open({
                            type: 2, //此处以iframe举例
                            title: '',
                            area: ['1240px', '630px'],
                            shade: 0.1,
                            content: systemConfigPageUrl.flowchart,
                            zIndex: layer.zIndex,
                            success: function (layero) {
                                layer.setTop(layero);
                            },
                            cancel: function () {
                            }
                        })
                    }
                }
            }
        });
    },
    //撤回请求
    recallRequest:function(model, success,param){
        var url = baseUrl.tFlowLog.flowDrawBack;
        if (param && param.businessType == "tIssueConsult") {
            url = baseUrl.tIssueConsultFlowLog.flowDrawBack;
        }
        var activityInstId = model.mian.logs[0].activityInstId;
        ajax_req({
            url: url + "?activityInstId=" + activityInstId,
            type: 'post',
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    layer.msg("撤回成功", {
                        icon: 1,
                        time: 1000,
                        shade: 0.4
                    }, function () {
                        success(res);
                    });
                } else {
                    layer.msg(res.mess || '撤回失败');
                }
            }
        });
    },
    //驱动请求
    driveNextNode: function (model, success,param) {
        var url = baseUrl.tFlowLog.addTFlowLog;
        if (param && param.businessType == "tIssueConsult") {
            url =baseUrl.tIssueConsultFlowLog.addTFlowLog;
        }
        ajax_req({
            url: url,
            type: 'post',
            data: JSON.stringify(model),
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    layer.msg("提交成功", {
                        icon: 1,
                        time: 1000,
                        shade: 0.4
                    }, function () {
                        success(res);
                    });
                } else {
                    layer.msg("驱动失败");
                    $("body").append("<input type='hidden' name='success' value='"+JSON.stringify(res)+"' />")
                }
            },
            error:function (err) {
                $("body").append("<input type='hidden' name='error' value='"+JSON.stringify(err)+"' />")
            }
        });
    },
    //流程中保存
    flowingSave: function (model, success,param) {
        var url = baseUrl.tFlowLog.tempSelective;
        if (param && param.businessType == "tIssueConsult") {
            url = baseUrl.tIssueConsultFlowLog.tempSelective;
        }
        ajax_req({
            url: url,
            type: 'post',
            data: JSON.stringify(model),
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    layer.msg("保存成功", {
                        icon: 1,
                        time: 1000,
                        shade: 0.4
                    }, function () {
                        if (!isEmpty(success)) {
                            success(res);
                        } else {
                        }
                    });
                } else {
                    layer.msg("保存失败");
                }
            }
        });
    },
    //作废
    nullifyFlow: function (model, success,param) {
        var url = baseUrl.tFlowLog.nullifyFlow;
        if (param && param.businessType == "tIssueConsult") {
            url = baseUrl.tIssueConsultFlowLog.nullifyFlow;
        }
        ajax_req({
            url: url,
            type: 'post',
            data: JSON.stringify(model),
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    layer.msg("作废当前流程成功", {
                        icon: 1,
                        time: 1000,
                        shade: 0.4
                    }, function () {
                        success(res);
                    });
                } else {
                    layer.alert('作废当前流程失败，请联系管理员', {
                        icon: 2,
                        title: "提示"
                    });
                }
            }
        });
    },
    /**
     * 选人页
     * @param flowStatus 流转状态
     * @param  submitFun 提交回调方法
     * @param  formInfo 表单全局对象
     * @param  param 流程驱动参数
     * */
    selectUser: function (flowStatus, submitFun, formInfo, param) {

        var driveParam = {
            beginId: formInfo.currActivityDefId,
            flowId: formInfo.flowId,
            importantLevel: formInfo.importantLevel,
            driveWhereParam: {},
            formId: formInfo.formId,
            versionId: formInfo.versionId
        };

        if (flowStatus == "start") {
            //开始状态时需要准备的参数
            driveParam.driveWhereParam = formInfo.driveWhereParam;
        } else if (flowStatus == "task") {
            driveParam.loginAcct = formInfo.formObj.mian.createUserId;
            driveParam.beginId = formInfo.currActivityDefId;
            driveParam.processInstId = formInfo.processInstId;
            driveParam.driveWhereParam = formInfo.driveWhereParam;
            driveParam.mian = formInfo.formObj.mian;

        }
        $.extend(driveParam, param);
        layer.open({
            type: 2,
            area: ['970px', '460px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '选择处理人',
            content: '../../workflow/selectRole.html',
            success: function (layero, index) {
                var iframe = window['layui-layer-iframe' + index];
                driveParam.submitFun = function (nextNode) {
                    submitFun(nextNode);
                };
                iframe.child(driveParam); //提交表单操作
            }
        });
    }
};
//------------------------浏览器兼容相关
//检测用户使用的什么浏览器
function bro() {
    var is360 = false;
    var isIE = false;
    var isFirefox = false;
    var isChrome = false;
    var isEdge = false;
    var broName = 'Runing';
    var str = '';
    var strStart = 0;
    var strStop = 0;
    var arr = new Array();
    var temp = '';
    // userAgent（用户代理，指浏览器）
    var userAgent = window.navigator.userAgent; //包含以下属性中所有或一部分的字符串：appCodeName,appName,appVersion,language,platform

    /*alert(userAgent);*/

    //FireFox
    if (userAgent.indexOf('Firefox') != -1) {
        isFireFox = true;
        /*broName = 'FireFox浏览器';*/
        strStart = userAgent.indexOf('Firefox');
        temp = userAgent.substring(strStart);
        broName = temp.replace('/', '版本号')

    }

    //Edge
    if (userAgent.indexOf('Edge') != -1) {
        isEdge = true;
        /*broName = 'Edge浏览器';*/
        strStart = userAgent.indexOf('Edge');
        temp = userAgent.substring(strStart);
        broName = temp.replace('/', '版本号');
    }

    //IE浏览器

    if (userAgent.indexOf('NET') != -1 && userAgent.indexOf("rv") != -1) {
        isIE = true;
        /*broName = 'IE浏览器'; */
        strStart = userAgent.indexOf('rv');
        strStop = userAgent.indexOf(')');
        temp = userAgent.substring(strStart, strStop);
        broName = temp.replace('rv', 'IE').replace(':', '版本号');
        $('.biaoqian').css({
            'margin-top': 0
        });
        $('.tableCheckbox').css({
            'top': '7px'
        });
        $('.th img').css({
            'top': '11px'
        });
        $('.tableselect').css({
            'top': '3px'
        });

    }

    //360极速模式可以区分360安全浏览器和360极速浏览器
    if (userAgent.indexOf('WOW') != -1 && userAgent.indexOf("NET") < 0 && userAgent.indexOf("Firefox") < 0) {
        if (navigator.javaEnabled()) {
            is360 = true;
            broName = '360安全浏览器-极速模式';
        } else {
            is360 = true;
            broName = '360极速浏览器-极速模式';
        }
    }

    //360兼容
    if (userAgent.indexOf('WOW') != -1 && userAgent.indexOf("NET") != -1 && userAgent.indexOf("MSIE") != -1 && userAgent.indexOf("rv") < 0) {
        is360 = true;
        broName = '360兼容模式';
    }

    //Chrome浏览器
    if (userAgent.indexOf('WOW') < 0 && userAgent.indexOf("Edge") < 0) {
        isChrome = true;
        /*broName = 'Chrome浏览器';*/
        strStart = userAgent.indexOf('Chrome');
        strStop = userAgent.indexOf(' Safari');
        temp = userAgent.substring(strStart, strStop);
        broName = temp.replace('/', '版本号');
    }

}

function iebanben() {
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    //userAgent包含了各种浏览器类型的信息
    var s;
    (s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : 0;

    if (Sys.ie <= 10.0) {
        //是ie6.0，添加你要做的事件
        // info.innerHTML = "abcde"; //这句没测试过，自己调试下
        $('.biaoqian').css({
            'margin-top': 0
        });
        $('.tableCheckbox').css({
            'top': '7px'
        });
        $('.th img').css({
            'top': '11px'
        });
        $('.tableselect').css({
            'top': '3px'
        });
        $('.ul').css({
            'position': 'absolute',
            'right': '380px',
            'z-index': '999',
            'top': '20px'
        })

    } else {
        //do nothing
    }
}

// 常用语
var CommonOp = {
    //常用语按钮点击
    CommonOps: function ($textarea) {
        var index;
        $('.CommonOp').on('click', function () {
            CommonOp.getInfo();
            index = layer.open({
                title: '我的常用语',
                area: ['800px', '410px'],
                btnAlign: 'c',
                type: 1,
                content: "<div class='commonDiv'><div class='CommonOpup'></div><div class='CommonOpdown'><div class='addCommonDiv'><input class='CommonInput'/><div class='CommonOpadd'>添加</div></div></div>" +
                    "<div class='alertbtnbox'>" +
                    "        <button class='alertCancelBtn' id='commonCancel'>关闭</button>" +
                    "        <button class='alertSubmitBtn' id='commonSubmit'>确定</button>" +
                    "    </div></div>"
            });
            $('.CommonOpup').parent('layui-layer-content').css({'height': '330px'})
        });
        $(document).on("click", '#commonCancel', function () {
            layer.close(index);
        });
        $(document).on("click", '#commonSubmit', function () {
            var text = $('.itemclick').children('i').text();
            if (text) {
                $('.CommonOp-textarea').val(text).trigger("change");
                layer.close(index);
            } else {
                layer.msg("请选中一条常用语");
            }
        });
        //列表每一项点击
        $(document).on("click", '.CommonOpupitem', function () {
            $('.CommonOpupitem').each(function () {
                $(this).removeClass('itemclick');
                $(this).children('span').css({
                    'visibility': 'hidden'
                })
            });
            $(this).addClass('itemclick');
            $(this).children('span').css({
                'visibility': 'visible'
            })
        });
        CommonOp.addremoveInfo()
    },
    getInfo: function () {
        ajax_req({
            url: baseUrl.ideas.selectIdeas,
            data: JSON.stringify({
                ideaType: 1
            }),
            type: 'post',
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    $.each(res.data, function (index, item) {
                        $('.CommonOpup').append("<div class='CommonOpupitem'><i class='CommonOpupitemcon' id=" + item.ideaId + ">" + item.ideaContent + "</i><span>删除</span></div>");

                    })
                } else {
                    layer.msg("操作失败");
                }
            },
            error: function (err) {
                layer.msg("操作失败");
            }
        });
    },
    addremoveInfo: function () {
        $(document).on('click', '.CommonOpadd', function () {
            var val = $('.CommonOpdown').find('input').val();
            if (val == '') {
                layer.msg("请输入要添加的常用语");
            } else {
                CommonOp.postInfo('add', baseUrl.ideas.addIdeas, val)
            }
        });
        $(document).on('click', '.CommonOpup span', function () {
            if ($(this).siblings('i').text() == '同意!' || $(this).siblings('i').text() == '不同意!') {
                layer.msg("此项不得删除");
            } else {
                var id = $(this).siblings('i').attr('id');
                CommonOp.postInfo('remove', baseUrl.ideas.deleteIdeas, id)
            }

        })
    },
    postInfo: function (data, url, con) {
        var ajaxdata = '';
        if (data == 'add') {
            ajaxdata = JSON.stringify({
                ideaType: 2,
                ideaContent: con
            })
        } else if (data == 'remove') {
            ajaxdata = JSON.stringify({
                ideaType: 2,
                ideaId: con
            })
        }
        ajax_req({
            url: url,
            data: ajaxdata,
            type: 'post',
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    $('.CommonOpup').html('');
                    CommonOp.getInfo();
                    if (data == 'add') {
                        $('.CommonOpdown').find('input').val('')
                    }
                } else {
                    layer.msg("操作失败");
                }
            },
            error: function (err) {
                layer.msg("操作失败");
            }
        });
    }
};