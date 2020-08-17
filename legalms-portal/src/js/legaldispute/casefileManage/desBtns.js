var desBtn = (function(){
	var desBtn = {
		// 全局配置
		btns:{
			close:null
		},
		curStep:1, // 当前是第几步
		stepArr:[1,7,8], // 用户选择了哪几步
		stepNames:[
			{ name:'创建卷宗',step:1 },
			{ name:'仲裁',step:2 },
			{ name:'一审',step:3 },
			{ name:'二审',step:4 },
			{ name:'再审',step:5 },
			{ name:'行政处罚（复议）',step:6 },
			{ name:'裁决执行',step:7 },
			{ name:'案件结束',step:8 }
		]
	};
	// 修改 裁决类型 功能数组
	desBtn.upDateArr = function(arr){
		var rArr = [];
		desBtn.stepArr = arr;
		progress.loadProgress(1,desBtn.stepArr);
		panelDes.loadPanelDes(1);
		Tabs.loadTabs(desBtn.stepArr); 	
		return desBtn.stepArr;
	};
	// 初始化 按钮事件
	desBtn.initBtns = function(btns){
		var btnHtml = '';
		btnHtml += '<button type="button" id="'+ btns.close +'" class="closebtn">关闭</button>';
		$('#desBtn').html(btnHtml);
		desBtn.btns.close = $('#'+btns.close);
		desBtn.btns.close.click(function(){
			// layer.msg('关闭');
			// location.href='casefilemanageList.html';
            window.close();
        });
		// 修正bug
		$('input[name="caseId"]').val(getQuery().caseId);
	};
	return desBtn;
})();

desBtn.initBtns({
	close:'close'
});
panelDes.getCaseMainDes();

