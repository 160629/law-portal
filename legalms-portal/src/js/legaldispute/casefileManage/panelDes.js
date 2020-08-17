var panelDes = (function () {
    var panelDes = {
        steppanelDes: $('.step-panel'),
        selectDataArr: {}, // select 对象数组
        dataArr:[
            '',
            'caseMainVO', // 基本信息
            'arbittateVO', // 仲裁
            'firstInstanceVO', // 一审
            'secondInstanceVO', // 二审
            'againInstanceVO', // 再审
            'punishVO' // 行政处罚（复议）
        ],
        desUrl: [
            '', // 这个位置先占着 ，今后有可能这里加上 获取step的接口【这个不属于panel的数据】
            baseUrl.case.selectCaseMain, //基本信息
            baseUrl.case.selectArbittate, //仲裁详情
            baseUrl.case.selectFirstInstance, // 一审详情
            baseUrl.case.selectSecondInstance, // 二审详情
            baseUrl.case.selectAgainInstance, // 再审详情
            baseUrl.case.selectPunish, // 行政复议详情
            baseUrl.case.selectRulingExecutive // 裁决执行详情
        ],
        saveUrl: [
            baseUrl.case.updaterulingClasses, // step 修改 保存【这个不属于panel的数据】
            baseUrl.case.updateCaseMain, //基本信息 修改
            baseUrl.case.addOrUpdateArbittate, // 仲裁添加或修改
            baseUrl.case.addOrUpdateFirstInstance, // 一审添加或修改
            baseUrl.case.addOrUpdateSecondInstance, // 二审添加或修改
            baseUrl.case.addOrUpdateAgainInstance, // 再审添加或修改
            baseUrl.case.addOrUpdatePunish, // 行政复议添加或修改
            baseUrl.case.addOrUpdateRulingExecutive, // 裁决执行添加或修改
            baseUrl.case.updateExplain // 案件结案修改
        ],
        fileUrl: {
            upFileUrl: baseUrl.case.uploadFileCaseMain, // 上传附件接口
            getFileInfo: baseUrl.file.selectFile, // 获取文件信息
            delFileUrl: baseUrl.case.deleteFileCaseMain// 删除文件信息
        }
    };
    // 根据 step 返回 对应的 关键字str
    panelDes.step2shareType = function (step) {
        return panelDes.desUrl[step] ? panelDes.desUrl[step].replace(/.+select/g, '').toLowerCase() : '';
    };
    //  根据 指定的 step 加载steppanelDes
    panelDes.loadPanelDes = function (curStep) {
        panelDes.steppanelDes.hide();
        panelDes.steppanelDes.eq(curStep - 1).show();
    };

    panelDes.selV2N = function (n, v) {
        if (!panelDes.selectDataArr[n]) {
            return '';
        }

        for (var i = 0; i < panelDes.selectDataArr[n].length; i++) {
            if (panelDes.selectDataArr[n][i].value == v) {
                return panelDes.selectDataArr[n][i].name;
            }
        }
    };

    // 设置 panelDes 详情数据
    panelDes.setpanelDesData = function (step, panelDesData) {
        var wpanelDes = panelDes.steppanelDes.eq(step - 1);

        for (var i in panelDesData) {
            var inputD = wpanelDes.find('.inputdiv[name="' + i + '"]');
            if (inputD) {
                inputD.html(panelDesData[i]);
                // 对有大写转换要求的进行操作
                if (inputD.parents('.input').hasClass('numFormat')) {
                    var v = common.convertCurrency(inputD.html());
                    $(inputD).next(".aux").html(common.convertCurrency(v));//金额数字转大写
                }
                if (inputD.attr('type') == 'radio') {
                    inputD.html(panelDesData[i] == 1 ? '是' : '否');
                }
            }
            if (wpanelDes.find('.textareadiv[name="' + i + '"]')) {
                var valHtml = panelDesData[i];
                if (valHtml){
                    valHtml = valHtml.replace(/\n/g,"<br/>");
                }
                wpanelDes.find('.textareadiv[name="' + i + '"]').html(valHtml);
            }

            if (wpanelDes.find('.selectdiv[name="' + i + '"]')) {
                wpanelDes.find('.selectdiv[name="' + i + '"]').html(panelDes.selV2N(i, panelDesData[i]));
            }
        }


        /*
            第6步行政处罚 行政复议决定书  文件附件 需要单独处理

            这段是因为接口不好做，前端做个特殊处理
        */
        if (step == 6) {
            // 获取附件信息 并 将其插入到指定的dom
            panelDes.getFileData(function (res) {
                if (res.resultStat == 'SUCCESS') {
                    panelDes.insertFile($('#thelist_administrativeReconsiderAward'), res.data, 'administrativeReconsiderAward');
                }
            }, 'administrativeReconsiderAward');
            // 获取附件信息 并 将其插入到指定的dom
            panelDes.getFileData(function (res) {
                if (res.resultStat == 'SUCCESS') {
                    panelDes.insertFile($('#thelist_punish'), res.data, 'punish');
                }
            }, 'punish');
            return false;
        }


        var shareType = panelDes.step2shareType(step);

        // 获取附件信息 并 将其插入到指定的dom
        panelDes.getFileData(function (res) {
            if (res.resultStat == 'SUCCESS') {
                panelDes.insertFile(wpanelDes.find('.upfileinput').parents('.input'), res.data, shareType);
            }
        }, shareType);

    };
    // 获取 panel 详情数据
    panelDes.getCaseMainDes = function() {


        if (!getQuery().caseId){
            layer.msg('获取卷宗跟踪记录失败', {time: 2000});
            return false
        }
        var postdata = {
            caseId: getQuery().caseId,
            shareType: panelDes.step2shareType(1)
        };
        ajax_req({
            url: baseUrl.caseMain.selectCaseMain, // + '?caseId='+getQuery().caseId,
            type: 'post',
            data: JSON.stringify(postdata),
            success: function (res) {
                if (res.resultStat == 'SUCCESS') {
                    // 设置详情数据到panel
                    if (res.data) {

                        var panelData = res.data;
                        // 获取step数据
                        var arr = res.data.caseMainVO.rulingClasses.split(',');
                        var newArr = [];
                        for (var ii = 0; ii < arr.length; ii++) {
                            newArr.push(parseInt(arr[ii]));
                        }
                        desBtn.upDateArr(newArr);
                        /*
                         填充 其他涉案方 信息
                         */
                        panelDes.setSanx({
                            caseTheThird: res.data.caseMainVO.caseTheThird, // 第三人
                            caseSamePlaintiff: res.data.caseMainVO.caseSamePlaintiff, // 同案原告
                            caseSameDefendant: res.data.caseMainVO.caseSameDefendant // 同案被告
                        });


                        // 获取结案说明 字段值
                        if (res.data.caseMainVO && res.data.caseMainVO.caseExplain) {
                            var valHtml = res.data.caseMainVO.caseExplain;
                            valHtml = valHtml.replace(/\n/g,"<br/>");
                            $('.step-panel-end .textareadiv[name="caseExplain"]').html(valHtml || '');
                        }
                        // 结案方式
                        var v = panelDes.selV2N('caseFinishWay', res.data.caseMainVO.caseFinishWay || '');
                        $('.step-panel-end .selectdiv[name="caseFinishWay"]').html(v);
                        // 结案时间
                        $('.step-panel-end .inputdiv[name="caseFinishTime"]').html(res.data.caseMainVO.caseFinishTime || '');

                        /*
                         每个接口返回的panel详细信息的字段名不一样，
                         将每个接口返回的 详细信息字段名 归为一个数组，
                         循环取值，以节省代码量。
                         */
                        panelDes.setpanelDesData(1, panelData[panelDes.dataArr[1]]);//写入基本信息
                        $("#baseInfo").jsonSerializeForm(panelData[panelDes.dataArr[1]]);//写入案件结案
                        ship.getData({onDel: false});
                        //取其它标签页信息
                        for (var k = 0; k < newArr.length; k++) {
                            if(newArr[k]){
                                var rulingClasses =parseInt(newArr[k]);
                                //去掉基本信息和结案页
                                if (1 < rulingClasses && 8 > rulingClasses) {
                                    //除去-获取出卷宗基本信息以外的信息
                                    panelDes.getPanelDes(rulingClasses, postdata);
                                }
                            }
                        }

                    }
                }
            }
        });
    };
    // 获取 panel 详情数据
    panelDes.getPanelDes = function (i,postdata) {
        (function(i) {
            postdata.shareType = panelDes.step2shareType(i);
            ajax_req({
                url: panelDes.desUrl[i], // + '?caseId='+getQuery().caseId,
                type: 'post',
                data: JSON.stringify(postdata),
                success: function(res) {
                    if (res.resultStat == 'SUCCESS') {
                        // 设置详情数据到panelDes
                        if (res.data) {
                            var panelData = {};

                            if (i == 7) {
                                panelData = res.data;
                            } else if (panelDes.dataArr[i] && res.data[panelDes.dataArr[i]]) {
                                panelData = res.data[panelDes.dataArr[i]];
                            }
                            if (i == 6) { //行政处罚（复议） step

                                /* 行政处罚（复议） 填充 */
                                if (res.data.punishVO && res.data.punishVO.isHearing == 'Y') {
                                    $('.hearingOpinion').show();
                                }
                                /* 是否复议 填充 */
                                if (res.data.punishVO && res.data.punishVO.isReconsider == 'Y') {
                                    $('.administrativeReconsiderAward').show();
                                }

                            }
                            panelDes.setpanelDesData(i, panelData);

                        }
                    }
                }
            });
        })(i);
        panelDes.setConvertMoney();
    };
    panelDes.setConvertMoney =function(){
        $(".aux").each(function (i,t) {
            //所有金额类字段转大写赋值
            var moneyTag = $(t).parents(".input").find(".inputdiv")[0];
            var that= this;
            $(moneyTag).bind('DOMNodeInserted', function(e) {
                    var money = $(e.target).html();
                    if (money){
                        $(that).html(common.convertCurrency(money));//金额数字转大写
                    }
            });
        });
    };
    //为 其他涉案方 赋值
    panelDes.setSanx = function (obj) {
        var sanx = $('.sanx');
        var sanxItem = sanx.find('.sanx-item .fl');
        var sanArr = [],
            i = 0,
            inputs = null,
            rmBtn = null,
            plugBtn = null,
            arrLen = 0,
            caseKey = '';

        /* caseTheThird  caseSamePlaintiff  caseSameDefendant */
        function key2val(keyArr) {
            for (var k = 0; k < keyArr.length; k++) {
                if (obj[keyArr[k]] && obj[keyArr[k]].length > 0) {
                    sanxItem.eq(k).addClass('cur');
                    sanArr = obj[keyArr[k]].split(',');
                    inputs = sanx.find('div[alt="' + keyArr[k] + '"] input');
                    rmBtn = sanx.find('div[alt="' + keyArr[k] + '"] .rm');
                    plugBtn = sanx.find('div[alt="' + keyArr[k] + '"] .plug');
                    arrLen = sanArr.length;

                    // 显示指定的 面板
                    sanx.find('div[alt="' + keyArr[k] + '"]').show();
                    for (i = 0; i < arrLen; i++) {
                        (function (i) {
                            inputs.eq(i).val(sanArr[i]).show();
                        })(i);
                    }

                    rmBtn.hide();
                    plugBtn.hide();

                }
            }

        }

        key2val(['caseTheThird', 'caseSamePlaintiff', 'caseSameDefendant']);

    };

    // 初始化 panelDes 组件
    panelDes.initComponent = function () {
        var html = '';
        // 其他涉案诉讼方
        html += "<div class='input'>";
        html += "<div class='label'>其他涉案方</div>";
        html += "<div class='sanx-item of'>";
        html += "<div class='fl'>第三人</div>";
        html += "<div class='fl'>同案原告</div>";
        html += "<div class='fl'>同案被告</div>";
        html += "<input type='hidden' name='caseTheThird' />";
        html += "<input type='hidden' name='caseSamePlaintiff' />";
        html += "<input type='hidden' name='caseSameDefendant' />";
        html += "</div>";
        html += "</div>";
        html += "<div alt='caseTheThird' class='input none'>";
        html += "<div class='label'>第三人</div>";
        html += "<div class='layui-input-block'>";
        html += "<input readOnly placeholder='请输入第三人全称' class='fl' placeholder='' type='text' />";
        html += "<input readOnly placeholder='请输入第三人全称' class='fl none' placeholder='' type='text' />";
        html += "<input readOnly placeholder='请输入第三人全称' class='fl none' placeholder='' type='text' />";
        html += "<div class='rm fl none'>-</div>";
        html += "<div class='plug fl'>+</div>";
        html += "</div>";
        html += "</div>";

        html += "<div alt='caseSamePlaintiff' class='input none'>";
        html += "<div class='label'>同案原告</div>";
        html += "<div class='layui-input-block'>";
        html += "<input readOnly placeholder='请输入同案原告全称' class='fl' placeholder='' type='text' />";
        html += "<input readOnly placeholder='请输入同案原告全称' class='fl none' placeholder='' type='text' />";
        html += "<input readOnly placeholder='请输入同案原告全称' class='fl none' placeholder='' type='text' />";
        html += "<div class='rm fl none'>-</div>";
        html += "<div class='plug fl'>+</div>";
        html += "</div>";
        html += "</div>";

        html += "<div alt='caseSameDefendant' class='input none'>";
        html += "<div class='label'>同案被告</div>";
        html += "<div class='layui-input-block'>";
        html += "<input readOnly placeholder='请输入同案被告全称' class='fl' placeholder='' type='text' />";
        html += "<input readOnly placeholder='请输入同案被告全称' class='fl none' placeholder='' type='text' />";
        html += "<input readOnly placeholder='请输入同案被告全称' class='fl none' placeholder='' type='text' />";
        html += "<div class='rm fl none'>-</div>";
        html += "<div class='plug fl'>+</div>";
        html += "</div>";
        html += "</div>";

        $('.sanx').html(html);
        // 显示隐藏 对应的 input
        $('.sanx-item .fl').click(function () {
            return false;
            var i = $(this).index() + 1;
            var input = $(this).parents('.sanx').find('.input').eq(i);
            if ($(this).hasClass('cur')) {
                $(this).removeClass('cur');
                input.hide();
            } else {
                $(this).addClass('cur');
                input.show();
            }
        });


        html = '';

        // ajax 获取 下拉列表值
        function getSelectData(kArr) {
            for (var i = 0; i < kArr.length; i++) {
                var dictData = dataDict.getSysdictdata(kArr[i].key);
                var arr = [];
                //html += '<option value="">请选择</option>';
                for (var k = 0; k < dictData.length; k++) {
                    arr.push({
                        name: dictData[k].dictCabel,
                        value: dictData[k].dictValue
                    });
                }
                panelDes.selectDataArr[kArr[i].name] = arr;

            }
        }

        var kArr = [{
            name: 'caseReviewGrade',
            key: 'sys_case_level'
        }, {
            name: 'caseSpecialLine',
            key: 'sys_case_line'
        }, {
            name: 'caseReason',
            key: 'sys_case_reason'
        }, {
            name: 'deputeType',
            key: 'sys_case_type'
        }, {
            name: 'ourLawsuitIdentity',
            key: 'sys_our_litigation'
        }, {
            name: 'lawsuitType',
            key: 'sys_prose_response'
        }, {
            name: 'caseFinishWay',
            key: 'sys_closing_method'
        }, {
            name: 'executiveWay',
            key: 'sys_executive_way'
        }, {
            name: 'isHearing',
            key: 'sys_yes_no'
        }, {
            name: 'isReconsider',
            key: 'sys_yes_no'
        }, {
            name: 'largeLawsuitMark',
            key: 'sys_case_size'
        }, {
            name: 'flowStatus',
            key: 'sys_flow_status'
        }];

        getSelectData(kArr);
    };


    // 插入 附件图标
    panelDes.insertFile = function ($thelist, data, shareType) {

        var caseId = getQuery().caseId;
        if (typeof(caseId) == "undefined" || "undefined" == caseId) {
            caseId = $('input[name="caseId"]').val();
        }
        var formData = {
            shareType: shareType,
            formId: caseId,
            onDel:false
        };
        uploadFile.writeFileInfo($thelist, data, formData);

    };

    // 上传 附件
    panelDes.up = function (that, shareType, num) {

    };
    // 获取附件信息 并 将其插入到指定的dom
    panelDes.getFileData = function (ck, shareType) {
        var caseId = getQuery().caseId || $('input[name="caseId"]').val();
        if (!isEmpty(caseId) && !isEmpty(shareType)) {
            ajax_req({
                url: panelDes.fileUrl.getFileInfo + '?fileShareBusinessKey=' + caseId + '&shareType=' + shareType,
                type: 'get',
                success: function (res) {
                    ck(res);
                }
            });
        }
    };
    return panelDes;
})();


// panelDes 组件 初始化
panelDes.initComponent();