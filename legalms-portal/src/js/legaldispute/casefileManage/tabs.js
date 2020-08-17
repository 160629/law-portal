var Tabs = (function(){
	var Tabs = {
		curStep:1, // 当前是第几步
		stepArr:[1,7,8], // 用户选择了哪几步
		stepNames:[
			{ name:'卷宗信息',step:1 },
			{ name:'仲裁',step:2 },
			{ name:'一审',step:3 },
			{ name:'二审',step:4 },
			{ name:'再审',step:5 },
			{ name:'行政处罚（复议）',step:6 },
			{ name:'裁决执行',step:7 },
			{ name:'案件结案',step:8 }
		]
	};

	
	// 根据 step的值 获取 step 的名称
	Tabs.getStepName = function(step){
		for(var i=0;i<Tabs.stepNames.length;i++){
			if(step == Tabs.stepNames[i].step){
				return Tabs.stepNames[i].name;
			}
		}
		return '';
	};
	// 加载 tabs
	Tabs.loadTabs = function(stepArr){
		var html = '';
		for(var i=0;i<stepArr.length;i++){
			html += "<div class='fl' alt='"+ stepArr[i] +"'>"+ Tabs.getStepName(stepArr[i]) +"</div>";
		}
		var tabs = $('#tabs');
		tabs.html(html);
		tabs.find('.fl').each(function(){
			$(this).click(function(){
				tabs.find('.cur').removeClass('cur');
				$(this).addClass('cur');
				var curI = parseInt($(this).attr('alt'));
				if(typeof panel != 'undefined' ){
					panel.loadPanel(curI);
				}
				if(typeof panelDes != 'undefined' ){
					panelDes.loadPanelDes(curI);
				}
				progress.loadProgress(curI,stepArr);
			});
		});
		tabs.find('.fl').eq(0).click(); // 默认第一个选中
	};
	return Tabs;
})();


