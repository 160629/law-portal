var appBtn = (function() {
	var appBtn = {
		// 全局配置
		btns: {
			prev: null,
			next: null,
			save: null,
			close: null
		},
		caseId: '',
		Url: {
			//createUrl : 'http://123.126.34.157:1183/case/addCaseMain',
			createUrl: baseUrl.caseMain.addOrUpdateCaseMain,
			createCaseId: baseUrl.caseMain.getPrimaryKey
		},
		curStep: 1, // 当前是第几步
		stepArr: [1], // 用户选择了哪几步
		stepNames: [{
				name: '创建卷宗',
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
				name: '案件结案',
				step: 8
			}
		]
	};

    // click 创建按钮 事件
    appBtn.creatFn = function (isSave) {
        // 修改 stepArr
        var ctype = $('input[name="ctype"]'),
            newArr = [1];
        ctype.each(function () {
            if ($(this).is(':checked')) {
                newArr.push(parseInt($(this).val()));
            }
        });
        appBtn.stepArr = newArr;

        // ajax 请求创建 后台
        var data;
        data = panel.getData(1, isSave);
        if (isSave) {
        	if (data){
                //全部校验
                if (appBtn.stepArr.length < 2) {
                    layer.msg('请至少选择一个裁决类别');
                    return false;
                }

                // 选择二审必须先选择一审
                if (!ctype.eq(1).is(":checked") && ctype.eq(2).is(":checked")) {
                    layer.msg('选择二审必须先选择一审');
                    return false;
                }
			}else {
        		return false;
			}
        }

        data.rulingClasses = appBtn.stepArr.join(',');
        /* test 令创建时间为空 */
        data.createTime = '';
        var id = window.location.href.split("?")[1].split("=")[1].split('&')[0];
        if (id != 'undefined' && id != '') {
            data.caseId = id
        } else {
            data.caseId = appBtn.caseId; // 设置 caseId
        }
        // 后台接口要求 创建的时候必须手动加上这个值
        data.caseStatus = '2'; // 创建的时候是 2
        if (!isSave) {
            data.caseStatus = 1; // 保存的时候是 1
        }
        ajax_req({
            url: appBtn.Url.createUrl,
            type: 'post',
            data: JSON.stringify(data),
            success: function (res) {
                if (res.resultStat == 'SUCCESS') {
                    if (isSave) {
                    	//不是保存创建卷宗给
                        layer.open({
                            type: 1,
                            content: '<div style="width:240px;height:60px;text-align:center;line-height:60px;">卷宗创建成功！</div>', //这里content是一个普通的String
                            btn: ['继续录入', '返回列表'],
                            yes: function (index) {
                                //appBtn.nextFn(); // next step
                                layer.close(index);
                                layer.msg("跳转至编辑页面", {
                                    icon: 1,
                                    time: 1000,
                                    shade: 0.4
                                }, function () {
                                    window.location.href = pageUrl.caseManage.edit + '?caseId=' + res.data;
                                });
                            },
                            btn2: function (index) {
                                layer.close(index);
                                window.location.href = pageUrl.caseManage.list;
                            }
                        });
                    } else {
                    	//  如果是保存
                        layer.msg('保存成功', {time: 2000});
                    }

                }
            }
        });
    };
	// 获取 caseid
	appBtn.getCaseIdFn = function() {
		ajax_req({
			url: appBtn.Url.createCaseId,
			type: 'post',
			data: {},
			success: function(res) {
				if(res.resultStat == 'SUCCESS') {
					appBtn.caseId = res.data;
					$('input[name="caseId"]').val(appBtn.caseId);
				} else {
					layer.msg('获取caseid错误');
				}
			}
		});
	};

	// 初始化 按钮事件
	appBtn.initBtns = function(btns) {
		var btnHtml = '';
		btnHtml += '<button type="button" id="' + btns.prev + '" class="closebtn none">上一步</button>';
		btnHtml += '<button type="button" id="' + btns.close + '" class="closebtn">关闭</button>';
		btnHtml += '<button type="button" id="' + btns.save + '" class="stagingbtn">暂存</button>';
		btnHtml += '<button type="button" id="' + btns.creat + '"  class="createbtn">创建卷宗</button>';
		btnHtml += '<button type="button" id="' + btns.next + '" class="createbtn none">下一步</button>';
		btnHtml += '<button type="button" id="' + btns.end + '" class="createbtn none">卷宗结束</button>';

		$('#appBtn').html(btnHtml);

		appBtn.btns.prev = $('#' + btns.prev);
		appBtn.btns.next = $('#' + btns.next);
		appBtn.btns.save = $('#' + btns.save);
		appBtn.btns.close = $('#' + btns.close);
		appBtn.btns.creat = $('#' + btns.creat);
		appBtn.btns.end = $('#' + btns.end);

		appBtn.btns.prev.click(function() {
			appBtn.prevFn();
		});
		appBtn.btns.next.click(function() {
			appBtn.nextFn();
		});
        appBtn.btns.save.click(function () {
            // 保存 事件
            appBtn.creatFn(false);
        });
		appBtn.btns.close.click(function() {
			// location.href = 'casefilemanageList.html';
			window.close()
		});
		appBtn.btns.creat.click(function() {
			appBtn.creatFn(true);
		});
		appBtn.btns.end.click(function() {
			appBtn.endFn();
		});
	};

	return appBtn;
})();

appBtn.initBtns({
	prev: 'prev',
	next: 'next',
	save: 'save',
	creat: 'creat',
	end: 'end',
	close: 'close'
});

// 获取 caseid
appBtn.getCaseIdFn();
// test
progress.loadProgress(appBtn.curStep, appBtn.stepArr);
panel.loadPanel(1);

function addRelationShip(data) {
	var caseId = $('input[name="caseId"]').val() || getQuery().caseId;
	var postdata = {
		businessType: data.mian ? data.mian.approveItemType : '', // approveItemType       业务表类型
		caseId: caseId, // caseId     案件ID
		businessId: data.guideId || '', // guideId
		tittle: data.guideTitle || '', //guideTittle
		code: data.guideCode || '', //guideCode
		moduleName: data.mian ? data.mian.moduleName : ''
	};
	ajax_req({
		url: baseUrl.caseMain.addRelationship,
		type: 'post',
		data: JSON.stringify(postdata),
		success: function(res) {
			if(res.resultStat == "SUCCESS") {
				/*layer.msg('关联成功');*/
				if(typeof ship != 'undefined') {
					ship.getData(); // 刷新 ship面板
				}
			} else {
				layer.msg('关联失败');
			}
		}
	});
}