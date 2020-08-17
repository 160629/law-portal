$(function() {
	bro(); //检测用户使用的什么浏览器
	iebanben(); // ie各个版本检测
	//------------------列表全局基础事件
	checkedAll(); //列表复选框全选事件绑定
	loadTableOption(); //列表->列头下拉框事件绑定
	selfUnfoldBOX(); //展示隐藏的点击事件
	enterQueryEvent(); //列表下回车查询事件
	selectInputDelEvent();//列表可点弹出选择框取消绑定事件
	selectInputFormEvent();//列表弹出选择框查看关联表单事件
});
//------------------列表全局基础事件
// 展开/收起查询框
function selfUnfoldBOX() {
	$('.toggleHeightBtn').on('click', function() {
		var unfold = $('.toggleHeightBtn');
		if($('.queryBorder').hasClass('queryBorderHeight')) {
			unfold.find('span').text('展开');
			$('.queryBorder').removeClass("queryBorderHeight");
			$('.queryBorder').addClass("selfQueryBorderHeight");
		} else {
			unfold.find('span').text('收起');
			$('.queryBorder').removeClass("selfQueryBorderHeight");
			$('.queryBorder').addClass("queryBorderHeight");
		}
	})
}
//表格全选按钮点击事件
function checkedAll() {
	//表格全选按钮
	$('.allBtn').on('click', function() {
		if($(this).prop('checked')) {
			$('tbody .checkboxipt').prop('checked', true)
		} else {
			$('tbody .checkboxipt').prop('checked', false)
		}
	});
	$('.checkboxipt').on('click', function() {
		if(!$(this).prop('checked')) {
			$('.allBtn').prop('checked', false)
		}
	});
}
/*
 * 列表上查询框内回车时掉当前查询框下的查询
 * */
function enterQueryEvent() {
	$('.query-card').keyup(function(event) {
		if(event.keyCode == 13) {
			$(this).find(".querybtn").click();
		}
	})
}
/**
 * 列表可点弹出选择框取消绑定事件
 * 取消数据绑定，调用当前列表查询
 * **/
function selectInputDelEvent() {
    var $span_input = $(".icon-inputDel").parent();
    $span_input.on("mouseover", function () {
        if ($(this).find("input[type=text]").val()) {
        	$(this).find(".icon-inputDel").show();
        }
    });
    $span_input.on("mouseout", function () {
        $(this).find(".icon-inputDel").hide();
    });
    $span_input.find(".icon-inputDel").on("click",function () {
		if (!$(this).is(":hidden")){
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
//鼠标划入时触发表格下拉菜单
function loadTableOption() {

	//暂时屏蔽掉列头查询的功能，有的业务模块不能用，演示完了，在放开，各业务模块完成此功能
	$(".tubiao").hide();
	// //鼠标划入时触发表格下拉菜单
	// $('.th-select-btn').mouseover(function () {
	//     $(this).find('li').css({
	//         'border': '1px solid #f3f3f3'
	//     });
	//     $(this).find('.tubiao').prop('src', '../../../css/images/SORT.png');
	//     $(this).find('ul').removeClass('selectheight').css({
	//         'background': '#fbfbfb'
	//     });
	// });
	// //鼠标滑出隐藏
	// $('.th-select-btn').mouseout(function () {
	//     $(this).find('li').css({
	//         'border': ''
	//     });
	//     $(this).find('.tubiao').prop('src', '../../../css/images/up.png');
	//     $(this).find('ul').addClass('selectheight').css({  
	//         'background': ''
	//     });
	// });
	//点击添加选中事件
	$('.th-select-btn').on("click", "li", function() {
		$(this).parents('.th-select-btn').find(".checked").removeClass("checked");
		$(this).find("p").addClass("checked");
		if(!isEmpty($(this).attr("val"))) {
			$(this).parents('.th-select-btn').find(" li").eq(0).addClass("checkedAll");
		} else {
			$(this).parents('.th-select-btn').find(" li").eq(0).removeClass("checkedAll");
		}
	});
}
//表格鼠标划入划出事件
$('tbody').on('mouseenter', 'td',function() {
	$(this).prop("title",this.textContent);
});
function paging(container, funcName, param) {
	$('.allBtn').prop('checked', false); //去除全选框的选中
	delBothTrim(param); //去掉两边空格

	if(null == param.pageNum) {
		param.pageNum = 1;
	}
	if(null == param.pageSize) {
		param.pageSize = 10;
	}
	var func = eval(funcName);
	var pageData = func(param);
	layui.use('laypage', function() {
		layui.laypage.render({
			elem: container, //分页容器的id
			count: pageData.count,
			limit: pageData.pageSize,
			limits: [10, 20, 50, 100],
			curr: pageData.pageNum,
			layout: ['prev', 'page', 'next', 'skip', 'count', 'limit'],
			prev: '<',
			next: '>',
			jump: function(obj, first) {

				if(!first) {
					var model = param;
					model.pageNum = obj.curr;
					model.pageSize = obj.limit;
					var data = func(model);
					obj.count = data.count;
				}
			}
		});
	});

	$('.layui-laypage-skip .layui-input').on('input', function () {
		//按页数跳转的时候判断不能超过19位
        var reg = new RegExp("^[0-9]{0,18}$");
        if(reg.test(this.value)) {
            this.value = this.value;
            this.t_value = this.value;
		}else{
            this.value = this.t_value;
		}
        if (!this.t_value){
            this.t_value = 1;
        }
	})
}

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
	if(userAgent.indexOf('Firefox') != -1) {
		isFireFox = true;
		/*broName = 'FireFox浏览器';*/
		strStart = userAgent.indexOf('Firefox');
		temp = userAgent.substring(strStart);
		broName = temp.replace('/', '版本号')

	}

	//Edge
	if(userAgent.indexOf('Edge') != -1) {
		isEdge = true;
		/*broName = 'Edge浏览器';*/
		strStart = userAgent.indexOf('Edge');
		temp = userAgent.substring(strStart);
		broName = temp.replace('/', '版本号');
	}

	//IE浏览器

	if(userAgent.indexOf('NET') != -1 && userAgent.indexOf("rv") != -1) {
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
	if(userAgent.indexOf('WOW') != -1 && userAgent.indexOf("NET") < 0 && userAgent.indexOf("Firefox") < 0) {
		if(navigator.javaEnabled()) {
			is360 = true;
			broName = '360安全浏览器-极速模式';
		} else {
			is360 = true;
			broName = '360极速浏览器-极速模式';
		}
	}

	//360兼容
	if(userAgent.indexOf('WOW') != -1 && userAgent.indexOf("NET") != -1 && userAgent.indexOf("MSIE") != -1 && userAgent.indexOf("rv") < 0) {
		is360 = true;
		broName = '360兼容模式';
	}

	//Chrome浏览器
	if(userAgent.indexOf('WOW') < 0 && userAgent.indexOf("Edge") < 0) {
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
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1]: 0;

	if(Sys.ie <= 10.0) {
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