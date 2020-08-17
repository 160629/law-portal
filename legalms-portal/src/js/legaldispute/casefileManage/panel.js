var panel = (function() {
	var panel = {
		stepPanel: $('.step-panel'),
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
			delFileUrl: baseUrl.case.deleteFileCaseMain // 删除文件信息
		}
	};
	// 根据 step 返回 对应的 关键字str
	panel.step2shareType = function(step) {
		return panel.desUrl[step] ? panel.desUrl[step].replace(/.+select/g, '').toLowerCase() : '';
	};
	//  根据 指定的 step 加载stepPanel
	panel.loadPanel = function(curStep) {
		panel.stepPanel.hide();
		panel.stepPanel.eq(curStep - 1).show();
	};
	//  
	panel.vaildate = function(curPanel) {
		var errLabel = '';
		curPanel.find('.input .label span').each(function() {
			if($(this).html().indexOf('*') != -1) {
				var inputs = $(this).parents('.input').find('input[type="text"],input[type="hidden"]');
				if(inputs.val() == "") {
					errLabel = inputs.parents('.input').find('.label').text().replace('*', '');
					return false
				}else{
                    var re = new RegExp("^[ ]+$");
                    if (re.test(inputs.val())){
                        return false;
                    }
				}
                 var radios = $(this).parents('.input').find('input[type=radio]');
                if (radios.length > 0) {
                    if ($(this).parents('.input').find('input[type=radio]:checked').length == 0) {
                        errLabel = radios.parents('.input').find('.label').text().replace('*', '');
                        return false
                    }
				}
				var selects = $(this).parents('.input').find('select');
				if(selects.val() == "") {
					errLabel = selects.parents('.input').find('.label').text().replace('*', '');
					return false
				}
				var textareas = $(this).parents('.input').find('textarea');
				if(textareas.val() == "") {
					errLabel = textareas.parents('.input').find('.label').text().replace('*', '');
					return false
				}
			}
		});
		return errLabel;
	};
	// 根据 指定的 step 返回对应的 postData
	panel.getData = function(step, flag) {
		var curPanel = panel.stepPanel.eq(step - 1);
        if (flag) {
			//需要校验
			var errLabel = panel.vaildate(curPanel);
			if(errLabel) {
                layer.msg(errLabel + "内容不能为空");
				return false;
			}
		}else{
			//只校验标题
            if($('#caseTitle').val() == '') {
                layer.msg('请输入卷宗标题');
                return false;
            }else{
                var re = new RegExp("^[ ]+$");
                if (re.test($('#caseTitle').val())){
                    layer.msg('卷宗标题中不能全部为空格');
                    return false;
                }
            }
		}

		var panelObj = {};
		curPanel.find('input[type="radio"]').each(function() {
			if($(this).is(':checked')) {
				panelObj[$(this).attr('name')] = $(this).val();
			}
		});
		curPanel.find('input[type="checkbox"]').each(function() {
			if($(this).is(':checked')) {
				panelObj[$(this).attr('name')] = $(this).val();
			}
		});
		curPanel.find('input[type="text"]').each(function() {
			panelObj[$(this).attr('name')] = $(this).val();
		});
		curPanel.find('input[type="hidden"]').each(function() {
			panelObj[$(this).attr('name')] = $(this).val();
		});

		curPanel.find('textarea').each(function() {
			panelObj[$(this).attr('name')] = $(this).val();
		});
		curPanel.find('select').each(function() {
			panelObj[$(this).attr('name')] = $(this).val();
		});
		return panelObj;
	};
	// 设置 panel 详情数据
	panel.setPanelData = function(step, panelData) {
        var wpanel = panel.stepPanel.eq(step - 1);
		for(var i in panelData) {
			var inputD = wpanel.find('input[name="' + i + '"]');
			if(inputD) {
				if(inputD.attr('type') == 'radio') {
					inputD.each(function() {
						if($(this).val() == panelData[i]) {
							$(this).prop('checked', true);
						}
					});
				} else {
					inputD.val(panelData[i]).trigger("input").trigger("change");
				}
			}
            if(wpanel.find('textarea[name="' + i + '"]')) {
                wpanel.find('textarea[name="' + i + '"]').val(panelData[i]).trigger("input").trigger("change");
            }
			if(wpanel.find('select[name="' + i + '"]')) {
				wpanel.find('select[name="' + i + '"]').val(panelData[i]).trigger("change");
			}
		}
		/*
		 第6步行政处罚 行政复议决定书  文件附件 需要单独处理

		 这段是因为接口不好做，前端做个特殊处理
		 */
		if(step == 6) {
			// 获取附件信息 并 将其插入到指定的dom
			panel.getFileData(function(res) {
				if(res.resultStat == 'SUCCESS') {
					panel.insertFile($('#thelist_administrativeReconsiderAward'), res.data, 'administrativeReconsiderAward');
				}
			}, 'administrativeReconsiderAward');
			// 获取附件信息 并 将其插入到指定的dom
			panel.getFileData(function(res) {
				if(res.resultStat == 'SUCCESS') {
                    panel.insertFile($('#thelist_punish'), res.data, 'punish');
				}
			}, 'punish');
			return false;
		}

        var shareType = panel.step2shareType(step);
		// 获取附件信息 并 将其插入到指定的dom
		panel.getFileData(function(res) {
			if(res.resultStat == 'SUCCESS') {
				panel.insertFile(wpanel.find('.upfileinput').parents('.input'), res.data,shareType);
			}
		}, shareType);

	};
    // 获取 panel 详情数据
    panel.getCaseMain = function() {

        if (!getQuery().caseId){
            layer.msg('获取卷宗跟踪记录失败', {time: 2000});
            return false
        }
        var postdata = {
            caseId: getQuery().caseId,
            shareType: panel.step2shareType(1)
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
                        panel.newArr = newArr;
                        appBtn.upDateArr(panel.newArr);
                        /*
                         填充 其他涉案方 信息
                         */
                        panel.setSanx({
                            caseTheThird: res.data.caseMainVO.caseTheThird, // 第三人
                            caseSamePlaintiff: res.data.caseMainVO.caseSamePlaintiff, // 同案原告
                            caseSameDefendant: res.data.caseMainVO.caseSameDefendant // 同案被告
                        });

                        /*
                         第8步的详情信息从第一步的详情接口取得。
                         接口就是这么写的，没有第8步的详情接口
                         */
                        // 获取结案说明 字段值
                        $('.step-panel-end textarea[name="caseExplain"]').val(res.data.caseMainVO.caseExplain || '');
                        // 结案方式
                        $('.step-panel-end select[name="caseFinishWay"]').val(res.data.caseMainVO.caseFinishWay || '');
                        // 结案时间
                        $('.step-panel-end input[name="caseFinishTime"]').val(res.data.caseMainVO.caseFinishTime || '');
                        /*
                         每个接口返回的panel详细信息的字段名不一样，
                         将每个接口返回的 详细信息字段名 归为一个数组，
                         循环取值，以节省代码量。
                         */
                        panel.setPanelData(1, panelData[panel.dataArr[1]]);//写入基本信息
                        $("#baseInfo").jsonSerializeForm(panelData[panel.dataArr[1]]);//写入案件结案
                        ship.getData();

						//取其它标签页信息
                        for (var k = 0; k < newArr.length; k++) {
                        	if(newArr[k]){
                                var rulingClasses =parseInt(newArr[k]);
                                //去掉基本信息和结案页
                                if (1 < rulingClasses && 8 > rulingClasses) {
                                    //除去-获取出卷宗基本信息以外的信息
                                    panel.getPanelDes(rulingClasses, postdata);
                                }
							}
                        }

                    }
                }
            }
        });
    };
	// 获取 panel 详情数据
    panel.getPanelDes = function (i,postdata) {
			(function(i) {
				postdata.shareType = panel.step2shareType(i);
				ajax_req({
					url: panel.desUrl[i], // + '?caseId='+getQuery().caseId,
					type: 'post',
					data: JSON.stringify(postdata),
					success: function(res) {
                        if (res.resultStat == 'SUCCESS') {
                            // 设置详情数据到panelDes
                            if (res.data) {
                                var panelData = {};if (i == 7) {
                                    panelData = res.data;
                                } else if (panel.dataArr[i] && res.data[panel.dataArr[i]]) {
                                    panelData = res.data[panel.dataArr[i]];
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
                                panel.setPanelData(i, panelData);

                            }
                        }
					}
				});
			})(i);
	};

	// 保存panel信息
	panel.savePanel = function(step,param,callback) {
		var postdata = panel.getData(step,param.isVerify);
		if(!postdata) {
			return false;
		}
		postdata.caseId = getQuery().caseId;
		postdata = JSON.stringify(postdata);
		var type = 'post';
		ajax_req({
			url: panel.saveUrl[step],
			type: type,
			data: postdata,
			success: function(res) {
                if (callback) {
                    callback(res);
				}
			}
		});
	};
	//请求服务器结案
	panel.endCaseRquest = function(param,callback){
        ajax_req({
            url: appBtn.updateCaseStatusUrl,
            type: 'post',
            data: JSON.stringify(param),
            success: function(res) {
            	if (callback){
                    callback(res);
				}
            }
        });
	};
	//为 其他涉案方 赋值
	panel.setSanx = function(obj) {
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

			for(var k = 0; k < keyArr.length; k++) {
                if (obj[keyArr[k]] && obj[keyArr[k]].length > 0) {
					sanxItem.eq(k).addClass('cur');
					sanArr = obj[keyArr[k]].split(',');
					inputs = sanx.find('div[alt="' + keyArr[k] + '"] input');
					rmBtn = sanx.find('div[alt="' + keyArr[k] + '"] .rm');
					plugBtn = sanx.find('div[alt="' + keyArr[k] + '"] .plug');
					arrLen = sanArr.length;

					// 显示指定的 面板
					sanx.find('div[alt="' + keyArr[k] + '"]').show();
					for(i = 0; i < arrLen; i++) {
						(function(i) {
							inputs.eq(i).val(sanArr[i]).show();
						})(i);
					}
					if(arrLen <= 1) {
						rmBtn.hide();
					} else {
						rmBtn.show();
					}
					if(arrLen >= 10) {
						plugBtn.hide();
					} else {
						plugBtn.show();
					}
				}
			}

		}
		key2val(['caseTheThird', 'caseSamePlaintiff', 'caseSameDefendant']);

	};

	// 初始化 panel 组件
	panel.initComponent = function() {
		var html = '';
		// 其他涉案诉讼方
		html += "<div class='input'>";
		html += "<div class='label'>其他涉案方</div>";
		html += "<div class='sanx-item'>";
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
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入第三人全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<div class='rm fl none'>-</div>";
		html += "<div class='plug fl'>+</div>";
        html += "</div>";
		html += "</div>";

		html += "<div alt='caseSamePlaintiff' class='input none'>";
		html += "<div class='label'>同案原告</div>";
        html += "<div class='layui-input-block'>";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案原告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<div class='rm fl none'>-</div>";
		html += "<div class='plug fl'>+</div>";
        html += "</div>";
		html += "</div>";

		html += "<div alt='caseSameDefendant' class='input none'>";
		html += "<div class='label'>同案被告</div>";
        html += "<div class='layui-input-block'>";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<input placeholder='请输入同案被告全称' maxlength='80' class='fl none' placeholder='' type='text' />";
		html += "<div class='rm fl none'>-</div>";
		html += "<div class='plug fl'>+</div>";
        html += "</div>";
		html += "</div>";

		$('.sanx').html(html);
		// 显示隐藏 对应的 input
		$('.sanx-item .fl').click(function() {
			var i = $(this).index() + 1;
			var input = $(this).parents('.sanx').find('.input').eq(i);
			if($(this).hasClass('cur')) {
				$(this).removeClass('cur');
				input.hide();
			} else {
				$(this).addClass('cur');
				input.show();
			}
		});
		// 把 输入的值 存储
		function save2Input(nameI) {
			var arr = [];
			$('.sanx').find('div[alt="' + nameI + '"] input:visible').each(function() {
				if($(this).val() != '') {
					arr.push($(this).val())
				}
			});
			$('.sanx input[name="' + nameI + '"]').val(arr.join(','))
		}
		// 监听 input 事件
		$('.sanx input[type="text"]').each(function() {
			$(this).get(0).oninput = function() {
				var nameI = $(this).parents('.input').attr('alt');
				save2Input(nameI);
			}
		});
		// plug功能实现
		$('.sanx .plug').click(function() {
			var inputs = $(this).parents('.input').find('input:hidden');
			inputs.eq(0).show();
			if(inputs.length == 1) {
				$(this).hide();
			}
			$(this).parents('.input').find('.rm').show();
		});
		// rm功能实现
		$('.sanx .rm').click(function() {
			var inputs = $(this).parents('.input').find('input:visible');
			inputs.eq(inputs.length - 1).hide();
			if(inputs.length == 2) {
				$(this).hide();
			}
			$(this).parents('.input').find('.plug').show();
			var nameI = $(this).parents('.input').attr('alt');
			save2Input(nameI);
		});

		html = '';

		// 是否 听证 监听 是否显示 听证意见
		$('select[name="isHearing"]').change(function() {
			var hearingOpinion = $('.hearingOpinion');
			if($(this).val().indexOf('Y') != -1) {
				hearingOpinion.show();
			} else {
				hearingOpinion.hide();
			}
		});
		// 是否复议 监听 是否显示 复议决定书
		$('select[name="isReconsider"]').change(function() {
			var administrativeReconsiderAward = $('.administrativeReconsiderAward');
			if($(this).val().indexOf('Y') != -1) {
				administrativeReconsiderAward.show();
			} else {
				administrativeReconsiderAward.hide();
			}
		});

		// 争议金额与重要程度联动
		$('input[name="caseDeputeMoney"]').bind('keyup', function() {
			var v = parseFloat($(this).val());
			var lM = $('select[name="largeLawsuitMark"]');
			if(v < 0) {
				$(this).val(-1 * v);
			}
			if(v <= 1000000) { // 一般
				lM.val('commonly');
			} else if(v > 1000000) { // 重大
				lM.val('weighty');
			} else {
				lM.val('');
			}

		});

		// ajax 获取 下拉列表值

        function getSelectData(kArr) {
            for (var i = 0; i < kArr.length; i++) {
                var dictData = dataDict.getSysdictdata(kArr[i].key);
                var html = '';
                html += '<option value="">请选择</option>';
                for (var k = 0; k < dictData.length; k++) {
                    html += '<option value="' + dictData[k].dictValue + '">' + dictData[k].dictCabel + '</option>';
                }
                $('.step-panel select[name="' + kArr[i].name + '"]').html(html);
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
		}];
		getSelectData(kArr);
	};

	// 插入 附件图标
    panel.insertFile = function ($thelist, data, shareType) {
        var caseId = getQuery().caseId;
        if (typeof(caseId) == "undefined" || "undefined" == caseId) {
            caseId = $('input[name="caseId"]').val();
        }
        var formData = {
            shareType: shareType,
            formId: caseId
        };
        var that = $thelist.find("input[type=file]");
        that.callbackFun = function (param) {
            var fileIdKey = "file_" + param.shareType;
            $thelist.find('.upfileinput').val(param[fileIdKey]);
        };
        uploadFile.writeFileInfo($thelist, data, formData, that);
    };

	// 上传 附件
	panel.up = function(that, shareType, num) {
		var $thelist = $(that).parents(".input");
        var caseId = getQuery().caseId;
        if(typeof(caseId) == "undefined" || "undefined" == caseId) {
            caseId = $('input[name="caseId"]').val();
        }
		var formData = {
			shareType: shareType,
			formId: caseId
		};
        that.callbackFun = function (param) {
            var fileIdKey = "file_" + param.shareType;
            $thelist.find('.upfileinput').val(param[fileIdKey]);
        };
		uploadFile.upload($thelist, that, formData);
	};
	// 获取附件信息 并 将其插入到指定的dom
	panel.getFileData = function(ck, shareType) {
		var caseId = getQuery().caseId;
		if(typeof(caseId) == "undefined" || "undefined" == caseId) {
			caseId = $('input[name="caseId"]').val();
		}
		//var caseId = getQuery().caseId||$('input[name="caseId"]').val();
        if (!isEmpty(caseId) && !isEmpty(shareType)) {
            ajax_req({
                url: panel.fileUrl.getFileInfo + '?fileShareBusinessKey=' + caseId + '&shareType=' + shareType,
                type: 'get',
                success: function(res) {
                    ck(res);
                }
            });
		}
	};
	return panel;
})();

// panel 组件 初始化
panel.initComponent();