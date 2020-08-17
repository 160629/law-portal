var progress = (function(){
	var progress = {
		id:$('#progress'),
		stepNames:[
			{ name:'创建卷宗',step:1 },
			{ name:'仲裁',step:2 },
			{ name:'一审',step:3 },
			{ name:'二审',step:4 },
			{ name:'再审',step:5 },
			{ name:'行政处罚（复议）',step:6 },
			{ name:'裁决执行',step:7 },
			{ name:'案件结案',step:8 }
		]
	};
	progress.init = function(id){
			progress.id = $(id);
	};
	// 根据 step的值 获取 step 的名称
	progress.getStepName = function(step){
		for(var i=0;i<progress.stepNames.length;i++){
			if(step == progress.stepNames[i].step){
				return progress.stepNames[i].name;
			}
		}
		return '';
	}
	
	/*
	根据 step和stepArr 加载 进度条
	step 当前的 step
	stepArr 当前的 stepArr
	*/ 
	progress.loadProgress = function(step,stepArr){
		var html = '',stepCls = 'step',cls = '';
		// html += "<div class='h1'>案件跟踪</div>";
		for(var i=0;i<stepArr.length;i++){
				// step1 和 step8 特殊处理一下 icon
				if(stepArr[i]==1){
					cls = 'pro-icon pro-start';
				}else if(stepArr[i]==8){
					cls = 'pro-icon pro-end';
				}else{
					cls = 'pro-icon';
				}
				
				if(stepArr[i]>step){ // 当前step以后都置灰
					stepCls = 'step step-cancel';
				}

				html += "<div class='"+ stepCls +"'>";
					html += "<div class='"+ cls +"'><span>"+ progress.getStepName(stepArr[i]) +"</span></div>";
					if(stepArr[i]!=8){
						html += "<div class='pro-bar'></div>";
					}
				html += "</div>";					
		}
		progress.id.html(html);
		
		// 当前页是第一页时，显示案件跟踪
		if(typeof appBtn !='undefined'){
			if(appBtn.curStep==1&&stepArr[0]==1&&stepArr[1]==7&&stepArr[2]==8){
				var sHtml = '';
					sHtml += "<div class='step step-cancel'>";
						sHtml += "<div class='pro-icon'><span>案件跟踪</span></div>";
						sHtml += "<div class='pro-bar'></div>";
					sHtml += "</div>";
					progress.id.find('.pro-start').parent().after(sHtml);
			}			
		}else if(typeof desBtn !='undefined'){
			if(desBtn.curStep==1&&stepArr[0]==1&&stepArr[1]==7&&stepArr[2]==8){
				var sHtml = '';
					sHtml += "<div class='step step-cancel'>";
						sHtml += "<div class='pro-icon'><span>案件跟踪</span></div>";
						sHtml += "<div class='pro-bar'></div>";
					sHtml += "</div>";
					progress.id.find('.pro-start').parent().after(sHtml);
			}			
		}

		// 重新计算 进度条宽度
		progress.id.width(progress.id.find('.step').length*142+10);
	};
	
	return progress;
})();


// test
