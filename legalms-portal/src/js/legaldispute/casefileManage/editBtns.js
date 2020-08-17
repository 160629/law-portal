var appBtn = (function() {
	var appBtn = {
		// 全局配置
		btns: {
			prev: null,
			next: null,
			save: null,
			close: null
		},
		saveRulingClassesUrl: baseUrl.caseMain.updaterulingClasses, // 修改裁决类型,
		updateCaseStatusUrl: baseUrl.caseMain.updateCaseStatusUrl,
		caseDeleteUrl: [{
				name: '仲裁',
				url: baseUrl.caseMain.deleteArbittate
			},
			{
				name: '一审',
				url: baseUrl.caseMain.deleteFirstInstance
			},
			{
				name: '二审',
				url: baseUrl.caseMain.deleteSecondInstance
			},
			{
				name: '再审',
				url: baseUrl.caseMain.deleteAgainInstance
			},
			{
				name: '行政复议',
				url: baseUrl.caseMain.deletePunish
			}
		],
		curStep: 1, // 当前是第几步
		stepArr: [1], // 用户选择了哪几步
		stepNames: [{
				name: '卷宗信息',
				step: 1
			},
			{
				name: '仲裁',
				step: 2
			},
			{
				name: '一审',
				step: 3
			},
			{
				name: '二审',
				step: 4
			},
			{
				name: '再审',
				step: 5
			},
			{
				name: '行政处罚（复议）',
				step: 6
			},
			{
				name: '裁决执行',
				step: 7
			},
			{
				name: '案件结束',
				step: 8
			}
		],
		arr: [],
        nameArr: [],
        del_arr: [],
        del_arr_name: [],
        panCur: [],
        choosezido: 0,
        choosezeyi: 0
	};
	// 修改 裁决类型 功能数组
	appBtn.upDateArr = function(arr) {

		var rArr = [];
		appBtn.stepArr = arr;
		progress.loadProgress(1, appBtn.stepArr);
		panel.loadPanel(1);
		Tabs.loadTabs(appBtn.stepArr);

        appBtn.arr = [];
        appBtn.nameArr = [];
		/* 卷宗类别调整面板 初始化 */
		$('.adjustmentbox .selPanel').removeClass('panCur').find('.pan').each(function() {
			if(appBtn.stepArr.indexOf(parseInt($(this).attr('alt'))) != -1) {
				appBtn.arr.push(parseInt($(this).attr('alt')));
				appBtn.nameArr.push($(this).text());
				$(this).addClass('panCur');

			}
		});
        if(appBtn.stepArr.indexOf(8) != -1) {
            //有案件标签页时才显示案件结案按钮
            appBtn.btns.end.show();
        }else{
            appBtn.btns.end.hide();
        }
		return appBtn.stepArr;
	};

    // 保存 事件
    appBtn.saveFn = function () {
        var isVerify = true;
        var requestStatus = true;
        $('#tabs .fl').each(function () {
            var r_pd = panel.savePanel($(this).attr('alt'), {isVerify: false}, function (res) {
                if (res.resultStat != 'SUCCESS') {
                    requestStatus = false;
                    layer.msg('保存失败：' + res.mess, {time: 3000});
                }
            });
            if (r_pd == false) {
                $(this).addClass('cur');
                $(this).siblings('.fl').removeClass('cur');
                $('.cur').click();
                isVerify = false;
                return false
            }
        });
        if (isVerify && requestStatus) {
            layer.msg('保存成功');
        }
    };
	// 卷宗结案 事件
	appBtn.endFn = function() {
		var step = $('#tabs .fl');
		var num = 0;
		var flag;
		$('#tabs .fl').each(function() {
            //保存不需要校验
		    var r_pd = panel.savePanel($(this).attr('alt'),{isVerify:true},function (res) {
                if (res.resultStat != 'SUCCESS') {
                    flag = false;
                    layer.msg('结案失败：' + res.mess, {time: 3000});
                }
            });
			if(r_pd == false) {
				$(this).addClass('cur');
				$(this).siblings('.fl').removeClass('cur');
				$('.cur').click();
				return false
			} else {
				num++;
				if(num == step.length) {
					flag = true;
				}
			}
		});

        if(flag) {
			layer.open({
				content: '结案后所有案件信息不予许再修改，确认结案吗?',
                btn: ['确定','取消'],
				yes: function(index, layero) {
					//按钮【按钮一】的回调
					var data = {
						caseStatus: 3,
						caseId: getQuery().caseId
					};
					panel.endCaseRquest(data,function (res) {
                        if(res.resultStat == 'SUCCESS') {
                            layer.msg("卷宗结案成功", {
                                icon: 1,
                                time: 1000,
                                shade: 0.4
                            }, function () {
                                window.close();
                            });
                        } else {
                            layer.msg('卷宗结案失败，' + res.mess, {time:3000});
                        }
                    });
				},
				btn2: function(index, layero) {
					//按钮【按钮二】的回调
					var index = layer.open();
					layer.close(index);
					//return false 开启该代码可禁止点击该按钮关闭
				}
			});

		}

	};

    // 裁决类型选择 点击 事件
    appBtn.adjustmentFn = function () {
        appBtn.adjustmentFn.mainOpen = layer.open(
            {
                type: 1,
                title: '裁决类别调整',
                area: ['700px', '380px'],
                shade: 0.1,
                content: $('.adjustmentbox').html(),
                id:'layPage-adjustment',
                success: function (layero) {
                    appBtn.initSelPanel(appBtn.stepArr);
                    var selectvalue = $('.input').find('select[name="caseReviewGrade"]').val();
                    if (selectvalue == '') {
                        $(".msga").text('请选择案件审级！')
                    } else {
                        $(".msga").text("当前案件审级为“" + $(".editCaseReviewGrade").find("option:selected").text() + "”，请根据具体案件的推进情况选择以上的案件办理阶段，勾选后请补充相应信息")
                    }
                },
                cancel: function () {
                }
            });

    };
    //删除已选裁决类别
    appBtn.delRulingClasses = function(callback){
        for(var o = 0; o < appBtn.del_arr.length; o++) {
            var arrIndex = appBtn.del_arr[o];
            if (arrIndex!=7&&arrIndex!=8){
                //需求变了这俩也要去掉标签页，但是没有关联删除接口，执行完回调就行了，后面保存表单就更新了
                ajax_req({
                    url: appBtn.caseDeleteUrl[appBtn.del_arr[o] - 2].url + '?caseId=' + getQuery().caseId,
                    type: 'post',
                    success: function(res) {
                        if(res.resultStat == 'SUCCESS') {
                            callback(res);
                        }
                    },
                    error: function(res) {
                        layer.msg(appBtn.caseDeleteUrl[parseInt(arrIndex - 2)].name + '删除失败');
                    }
                });
            }else{
                callback();
            }
        }
    };
    //检查裁决类别
    appBtn.checkRulingClasses = function (callback) {
        appBtn.panCur = [];
        appBtn.del_arr = [];
        appBtn.del_arr_name = [];
        if ($('#layPage-adjustment').length < 1) {
            var selectVal = $(".editCaseReviewGrade").val();
            $(".adjustmentbox .selPanel .panCur[status!='default']").each(function () {
                //如果案件审级有变动，则根据级别删除对应页签
                var that = $(this);
                var alt = parseInt(that.attr("alt"));
                if (selectVal == 6 || selectVal == 7) {
                    if (alt < 6) {
                        //当是复议的时候，凡是不是6的全部删除
                        appBtn.del_arr.push(alt);
                        appBtn.del_arr_name.push(that.text());
                        that.removeClass("panCur")
                    }
                } else {
                    if (alt > selectVal) {
                        //删除所有比当前审级大的类别
                        appBtn.del_arr.push(alt);
                        appBtn.del_arr_name.push(that.text());
                        that.removeClass("panCur")
                    }
                }
            });
            $('.adjustmentbox .selPanel .panCur').each(function () {
                var alt = parseInt($(this).attr("alt"));
                    appBtn.panCur.push(alt);
            });
            console.log(appBtn.panCur)
            console.log(appBtn.del_arr)
        }else{
            $('#layPage-adjustment .selPanel .panCur').each(function () {
                var that = $(this);
                var alt = parseInt(that.attr("alt"));
                if (!that.is(":hidden")) {
                    appBtn.panCur.push(alt);
                }
            });
            if (appBtn.panCur.length > 0) {
                for (var i = 0; i < appBtn.arr.length; i++) {
                    if (appBtn.panCur.indexOf(parseInt(appBtn.arr[i])) < 0) {
                        appBtn.del_arr.push(appBtn.arr[i]);
                        appBtn.del_arr_name.push(appBtn.nameArr[i]);
                    }
                }
            }else{
                appBtn.del_arr = appBtn.arr;
                appBtn.del_arr_name = appBtn.nameArr;
            }
        }
        callback();
        return appBtn.del_arr;
    };
	// 初始化裁决分类面板
	appBtn.initSelPanel = function(arr) {
		var selPanel = $('#layPage-adjustment .selPanel');

		//页面默认显示项控制
        selPanel.find('.panCur').removeClass('panCur');
		for(var i = 0; i < arr.length; i++) {
			selPanel.find('li[alt="' + arr[i] + '"]').addClass('panCur');
		}
        var selectVal = $(".editCaseReviewGrade").val();
        if (selectVal != '') {
            if (selectVal < 6) {

                selPanel.find(".pan-ul .pan[status!='default']").each(function () {
                    var alt = parseInt($(this).attr("alt"));
                    if (alt > selectVal) {
                        $(this).hide();
                    }else{
                        $(this).show();
                    }
                })
            }else{
                selPanel.find('.pan-ul').find("li[alt!='6'][status!='default']").each(function () {
                    $(this).hide();
                });
                selPanel.find('.pan-ul').find("li[alt='6']").show();
            }
        }else{
            selPanel.find('.pan-ul').find(".pan[status!='default']").hide();
        }

        //可点击项控制
        selPanel.find(".pan[status!='default']").click(function() {
            var selectVal = $(".editCaseReviewGrade").val();
            if(selectVal == 2) {
                if(parseInt($(this).attr("alt")) == 2) {
                    $(this).toggleClass('panCur');
                } else {
                    return false
                }
            } else if(selectVal == 6 || selectVal == 7) {
                if(parseInt($(this).attr("alt")) == 6) {
                    $(this).toggleClass('panCur');
                } else {
                    return false
                }
            } else {
                if(parseInt($(this).attr("alt")) <= (parseInt(selectVal))) {
                    $(this).toggleClass('panCur');
                }

            }
        });
        //可点击项控制
        selPanel.find(".pan[status='default']").click(function() {
            $(this).toggleClass('panCur');
        });
        selPanel.find('.closebtn').click(function() {
            parent.layer.close(appBtn.adjustmentFn.mainOpen);
        });
        // 点击 确定 按钮
        selPanel.find('.save_btn').click(function () {
            // 选择二审必须先选择一审
            if (!selPanel.find(".pan[alt=3]").hasClass("panCur") && selPanel.find(".pan[alt=4]").hasClass("panCur")) {
                layer.msg('选择二审必须先选择一审');
                return false;
            }
            appBtn.checkRulingClasses(function () {
                var str = '';

                for(var p = 0; p < appBtn.del_arr_name.length; p++) {
                    if(p == 0) {
                        str += appBtn.del_arr_name[p]
                    } else {
                        str += '、' + appBtn.del_arr_name[p]
                    }
                }
                if (appBtn.del_arr.length > 0) {
                    var msg = "当前案件审级为:" + $(".editCaseReviewGrade").find("option:selected").text() + "。" + str + '信息已保存完毕，确认删除？';
                    var msgOpen = layer.open({
                        title: '提示',
                        content: msg,
                        btn: ['确定', '取消'],
                        yes: function (index, layero) {
                            //按钮【按钮一】的回调
                            appBtn.saveRulingClasses();
                            appBtn.delRulingClasses(function (res) {
                                selPanel.find(".pan[status!='default']").hide();//关闭后隐藏所有类别
                                selPanel.find(".closebtn").click();
                                layer.close(msgOpen);
                            });
                        }
                    });
                } else {
                    appBtn.saveRulingClasses();
                    selPanel.find(".pan[status!='default']").hide();//关闭后隐藏所有类别
                    selPanel.find(".closebtn").click();
                }
            });
        });
	};
	//保存修改类别
	appBtn.saveRulingClasses = function() {
        /* 修改裁决类型 */
        var arr = [1];
        arr = arr.concat(appBtn.panCur);//最新选中的裁决类型
        var selectvalue = $('.input').find('select[name="caseReviewGrade"]').val();
        var data = {
            rulingClasses: arr.join(','),
            caseId: getQuery().caseId,
            caseReviewGrade:selectvalue
        };
        ajax_req({
            url: appBtn.saveRulingClassesUrl,
            type: 'post',
            data: JSON.stringify(data),
            success: function(res) {
                if(res.resultStat == 'SUCCESS') {
                    appBtn.upDateArr(arr);
                    layer.msg('保存成功',{
                        icon: 1,
                        time: 1000,
                        shade: 0.4
                    }, function () {
                        $('.selPanel .cancel').click();
                    })
                }
            }
        });
    };
	// 初始化 按钮事件
	appBtn.initBtns = function(btns) {
		var btnHtml = '';
		btnHtml += '<button type="button" id="' + btns.close + '" class="closebtn">关闭</button>';
		btnHtml += '<button type="button" id="' + btns.save + '" class="stagingbtn">保存</button>';
		btnHtml += '<button type="button" id="' + btns.adjustment + '"  class="createbtn">案件阶段调整</button>';
		btnHtml += '<button type="button" id="' + btns.end + '" class="createbtn hide">案件结案</button>';

		$('#appBtn').html(btnHtml);

		appBtn.btns.save = $('#' + btns.save);
		appBtn.btns.close = $('#' + btns.close);
		appBtn.btns.adjustment = $('#' + btns.adjustment);
		appBtn.btns.end = $('#' + btns.end);

		appBtn.btns.save.click(function() {
            appBtn.checkRulingClasses(function () {
                if (appBtn.del_arr.length > 0) {
                    var str = '';
                    for (var p = 0; p < appBtn.del_arr_name.length; p++) {
                        if (p == 0) {
                            str += appBtn.del_arr_name[p]
                        } else {
                            str += '、' + appBtn.del_arr_name[p]
                        }
                    }
                    if (appBtn.del_arr.length > 0) {
                        var msg = "当前案件审级为:" + $(".editCaseReviewGrade").find("option:selected").text() + "。" + str + '信息已保存完毕，确认删除？';
                        var msgOpen = layer.open({
                            title: '提示',
                            content: msg,
                            btn: ['确定', '取消'],
                            yes: function (index, layero) {
                                //按钮【按钮一】的回调
                                appBtn.saveRulingClasses();
                                appBtn.delRulingClasses(function (res) {
                                    appBtn.saveFn();
                                    layer.close(msgOpen);
                                });
                            }
                        });
                    } else {
                        appBtn.saveRulingClasses();
                        appBtn.saveFn();
                    }
                }else{
                    var selectvalue = $('.input').find('select[name="caseReviewGrade"]').val();
                    if (selectvalue && appBtn.arr.length < 1) {
                        layer.msg("请选择裁决类别！",{ time:1000, shade:0.4 }, function () {
                            appBtn.btns.adjustment.click();
                        });
                    }else{
                        appBtn.saveFn();
                    }
                }
            });
		});
		appBtn.btns.close.click(function() {
			window.close()
		});
		appBtn.btns.adjustment.click(function() {
			appBtn.adjustmentFn();
		});
		appBtn.btns.end.click(function() {
            appBtn.checkRulingClasses(function () {
                if (appBtn.del_arr.length > 0) {
                    appBtn.btns.adjustment.click();
                }else{
                    appBtn.endFn();
                }
            });
		});

		$('input[name="caseId"]').val(getQuery().caseId);
		//争议金额的修改
		$('.input').find('input[name="caseDeputeMoney"]').on('change', function() {
            panel.stepPanel.each(function (i,wpanel) {
                var executiveMoney = $(wpanel).find('.input').find('input[name="executiveMoney"]').val();
                if (executiveMoney){
                    autoCaseDeputeMoney($(wpanel));
				}
            });

		});
		//执行金额输入时的自动计算
		$('.input').find('input[name="executiveMoney"]').on('change', function() {
            var $wpanel = $(this).parents(".step-panel");
            autoCaseDeputeMoney($wpanel);
		});

        $("input[name=lawsuitMoney][id!=lawsuitMoneyTotal]").on('change', function () {
            var lawsuitMoney = 0;
            $("input[name=lawsuitMoney][id!=lawsuitMoneyTotal]").each(function (i, than) {
                lawsuitMoney = lawsuitMoney + parseInt($(than).val() || 0);
                $("#lawsuitMoneyTotal").val(lawsuitMoney).trigger("change"); //诉讼费总和
            });
        });

        $("input[name=lawyerMoney][id!=lawyerMoneyTotal]").on('change', function () {
            var lawyerMoney = 0;
            $("input[name=lawyerMoney][id!=lawyerMoneyTotal]").each(function (i, than) {
                lawyerMoney = lawyerMoney + parseInt($(than).val() || 0);
                $("#lawyerMoneyTotal").val(lawyerMoney).trigger("change"); //律师费总和
            });
        })
	};

	return appBtn;

})();

/**
 * 自动计算争议金额关联金额
 * */
function autoCaseDeputeMoney($wpanel){
    appBtn.choosezido = $('.input').find('select[name="ourLawsuitIdentity"]').val(); //判断是不是原告或者被告
    appBtn.choosezeyi = $('.input').find('input[name="caseDeputeMoney"]').val(); //争议金额
    var executiveMoney = $wpanel.find('.input').find('input[name="executiveMoney"]').val();
    var num = appBtn.choosezeyi - executiveMoney;
    if(appBtn.choosezido == 1) {
        /**
         * 原告
         * 挽回损失金额 执行金额
         * 损失金额 争议金额-执行金额
         * */
        $wpanel.find('.input').find('input[name="helpLossMoney"]').val(executiveMoney > 0 ? executiveMoney : 0).trigger("change"); //挽回金额的值
        $wpanel.find('.input').find('input[name="lossMoney"]').val(num > 0 ? num : 0).trigger("change"); //损失金额的值
    } else if(appBtn.choosezido == 2) {
        /**
         * 被告
         * 挽回损失金额 争议金额-执行金额
         * 损失金额 执行金额
         * */
        $wpanel.find('.input').find('input[name="helpLossMoney"]').val(num > 0 ? num : 0).trigger("change"); //挽回金额的值
        $wpanel.find('.input').find('input[name="lossMoney"]').val(executiveMoney > 0 ? executiveMoney : 0).trigger("change"); //损失金额的值
    }
}
panel.getCaseMain();

appBtn.initBtns({
	save: 'save',
    adjustment: 'adjustment',
	end: 'end',
	close: 'close'
});