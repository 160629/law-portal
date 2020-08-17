/**
 *声明一个top级别的变量，控制弹出窗口的队列
 */

var EOStopWin = _get_top_window() || window;
EOStopWin["_eos_modal_dialog"] = EOStopWin["_eos_modal_dialog"] || [];
function getModalDialogId() {
	return "_eos_modal_dialog" + Math.random() + EOStopWin["_eos_modal_dialog"].length;
}
/**
 * 获得当前窗口的函数,在EOStopWin["_eos_modal_dialog"]中存了所有弹出的窗口，以方便管理.
 */
var getCurrentModalArguments = function () {
	var len = EOStopWin["_eos_modal_dialog"].length;
	if (len > 0) {
		return EOStopWin["_eos_modal_dialog"][len - 1];
	} else {
		return null;
	}
}
/**
 * 根据id获得窗口对象.
 */
var getModalDialog = function (id) {
	var len = EOStopWin["_eos_modal_dialog"].length;
	for (var i = 0; i < len; i++) {
		var modal = EOStopWin["_eos_modal_dialog"][i];
		if (modal.id == id) {
			return modal;
		}
	}
	return null;
}
/**
 * 遮罩的函数，如果是从一般窗口弹出的，则全局遮罩，否则只遮罩上一个弹出窗口.
 */
var lockLatestModelDialog = function () {
	var modalArguments = getCurrentModalArguments();
	if (modalArguments) {
		modalArguments.showMask();
		hideSelect(modalArguments.frameWin);
	} else {
		/*EOStopWin["_eos_modal_dialog_mask"] = new Mask("_eos_modal_dialog_mask");
		EOStopWin["_eos_modal_dialog_mask"].show();*/
		maskTop();
	}
}
//top["lockLatestModelDialog"] = lockLatestModelDialog;
/**
 * 取消弹出窗口的遮罩.
 */
var unLockLatestModelDialog = function () {
	var modalArguments = getCurrentModalArguments();
	if (modalArguments) {
		modalArguments.hideMask();
		showSelect(modalArguments.frameWin);
	} else {
		//EOStopWin["_eos_modal_dialog_mask"].hide();
		unMaskTop();
	}
}
//top["unLockLatestModelDialog"] = unLockLatestModelDialog;
/**
 * 关闭弹出窗口的方法.需要取消遮罩，调用callback，销毁窗口对象.
 */
var hideModelDialog = function (id, noCallBack) {
	try {
		
		var modal = getModalDialog(id);
		
		EOStopWin["_eos_modal_dialog"].pop();
		if (!modal) {
			return;
		}
		var win = modal.frameWin || modal.iframe.contentWindow;
		
		try {
			var topWin = _get_top_window();
			topWin.currStack = win.bfCurrStack || [];
		} catch (e1) {}
		
		try {
			var retValue = win["returnValue"];
		} catch (e1) {}
		
		try {
			if (win.EOSTreeMenu) {
				win.EOSTreeMenu.hideAll();
			}
		} catch (e1) {}
		if (modal.container) {
			modal.container.style.display = "none";
			
		}
		if (modal.win) {
			unLockLatestModelDialog();
		}
	} catch (e) {
		var _e = e; //for dev debug;
	}
	
	if (!noCallBack) {
		try {
			if (modal["callBack"]) {
				modal["callBack"](retValue);
			}
		} catch (e) {
			var _e = e; //for dev debug;
		}
	}
	try {
		modal.iframe.src = blankURL;
		modal.ddDiv.style.display = "none";
		ReleaseElemEvents(modal.container);
		ReleaseElemEvents(modal.ddDiv);
		modal.ddDiv.parentNode.removeChild(modal.ddDiv);
		modal.container.parentNode.removeChild(modal.container);
	} catch (e) {
		var _e = e; //for dev debug;
	}
};
/**
 * 改为窗口大小的方法.
 */
var resizeModelDialog = function (id, width, height) {
	var modal = getModalDialog(id);
	modal.container.style.width = width + "px";
	modal.container.style.height = height + "px"; //winHeight;
	modal.maskDiv.style.width = width + "px";
	modal.maskDiv.style.height = height + "px"; //winHeight;
	var wbody = $id(modal.id + "__model_dialog_body", modal.win.document);
	if (height - 27 > 0)
		wbody.style.height = height - 27 - 7 + "px";
	var frame = $id(modal.id + "__model_dialog_frame", modal.win.document);
	if (frame) {
		if (height - 28 >= 0)
			frame.style.height = height - 32 + "px"; //winHeight;
		frame.style.width = width - 14 + "px"; //winHeight;
	}
	try {
		modal.ddDiv.style.width = width + "px";
		modal.ddDiv.style.height = height + "px"; //winHeight;
	} catch (e) {}
	
}
/**
 * 移动窗口的方法.
 */
var moveModelDialog = function (id, left, topx) {
	var modal = getModalDialog(id);
	modal.container.style.left = left + "px";
	modal.container.style.top = topx + "px"; //winHeight;
	try {
		modal.ddDiv.style.left = left + "px";
		modal.ddDiv.style.top = topx + "px"; //winHeight;
	} catch (e) {}
}
/**
 * 将窗口移到中间.
 */
var moveModelDialogToCenter = function (id) {
	var modal = getModalDialog(id);
	modal.container.style.top = ((EOStopWin.document.body.clientHeight - modal.container.offsetHeight) / 2 + EOStopWin.document.body.scrollTop) + "px";
	modal.container.style.left = ((EOStopWin.document.body.clientWidth - modal.container.offsetWidth) / 2 + EOStopWin.document.body.scrollLeft) + "px";
}
/**
 * 记录弹出窗口变量的对象，用于全局管理弹出窗口.
 */
function ModalArguments(id) {
	this.id = id;
	this.win = null;
	this.parentWin = null;
	this.callBack = null;
	this.Argument = null;
	this.iframe = null;
	this.container = null;
	this.mask = null;
	this.frameWin = null;
	this.maskDiv = null;
	this.ddDiv = null;
}
ModalArguments.prototype.init = function () {
	//	this.mask = new Mask(this.id,this.win);
}
ModalArguments.prototype.showMask = function () {
	this.maskDiv.style.display = "";
}
ModalArguments.prototype.hideMask = function () {
	this.maskDiv.style.display = "none";
}

/**
 * 弹出模态窗口,显示在屏幕中央.
 * @param {Object} strUrl 弹出窗口的地址.
 * @param {Object} dialogArguments 传递给模态对话框的参数.
 * @param {Object} callBack 回调函数.
 * @param {Object} winWidth 弹出窗口的大小.
 * @param {Object} winHeight 弹出窗口的高.
 * @param {Object} title 弹出窗口的title.
 */
function showModalCenter(strUrl, dialogArgs, callBack, winWidth, winHeight, title) {
	var winLeft = null;
	var winTop = null;
	return showModal(strUrl, dialogArgs, callBack, winWidth, winHeight, winLeft, winTop, title);
}

function showModal(strUrl, dialogArgs, callBack, winWidth, winHeight, winLeft, winTop, title) {
	
	//懒加载改造
	topWin.EOS.use('eos-modeldialog',function(){
		lazyShowModal(strUrl, dialogArgs, callBack, winWidth, winHeight, winLeft, winTop, title);
	});
}
/**
 * 弹出模态窗口,定义起始坐标.
 * @param {Object} strUrl 弹出窗口的地址.
 * @param {Object} dialogArgs 传递给模态对话框的参数.
 * @param {Object} callBack 回调函数.
 * @param {Object} winWidth 弹出窗口的大小.单位为px
 * @param {Object} winHeight 弹出窗口的高.单位为px
 * @param {Object} winLeft 窗口的左边距.单位为px
 * @param {Object} winTop 窗口的右边距.单位为px
 * @param {Object} title 弹出窗口的title.
 */
function lazyShowModal(strUrl, dialogArgs, callBack, winWidth, winHeight, winLeft, winTop, title) {
	/*	var left = "", top = "";
	if(winLeft) left = toLength(winLeft);
	if(winTop) top = toLength(winTop);
	//ie下用的模态对话框不能在firefox下用，所以模拟了一个模态对话框.
	if(false){
	return window.showModalDialog(strUrl,
	window,
	"dialogWidth:"+ winWidth + "px;" + "dialogHeight:"+winHeight + "px;"
	+ left + top
	+ "directories:yes;help:no;status:no;resizable:no;scrollbars:yes;");
	}else{
	}*/
	//winWidth = parseInt(winWidth,10);
	//winHeight = parseInt(winHeight,10);
	winWidth = winWidth ? parseInt(winWidth, 10) : 300;
	winHeight = winHeight ? parseInt(winHeight, 10) : 200;
	winWidth = winWidth + 14;
	winHeight = winHeight + 14;
	var topWin = _get_top_window();
	var theBody = topWin.document.getElementsByTagName("BODY")[0];
	if (winLeft == null || winLeft == "") {
		winLeft = ((topWin.document.body.clientWidth - winWidth) / 2 + topWin.document.body.scrollLeft);
		if (winLeft < 0)
			winLeft = 0;
	} else
		winLeft = parseInt(winLeft, 10);
	if (winTop == null || winTop == "") {
		winTop = ((EOStopWin.document.body.clientHeight - winHeight) / 2 + EOStopWin.document.body.scrollTop)
		if (winTop < 0)
			winTop = 0;
	} else
		winTop = parseInt(winTop, 10);
	var backTop = topWin.document.body.scrollTop;
	var modalId = getModalDialogId();
	var modalArguments = new ModalArguments(modalId);
	modalArguments.parentWin = window;
	modalArguments.callBack = callBack;
	modalArguments.Argument = dialogArgs;
	modalArguments.win = topWin;
	modalArguments.init();
	try {
		lockLatestModelDialog();
		//EOStopWin["lockLatestModelDialog"]();
	} catch (e) {}
	EOStopWin["_eos_modal_dialog"].push(modalArguments);
	__showModal(modalId, strUrl, modalArguments, winWidth, winHeight, winLeft, winTop, title);
	topWin.document.body.scrollTop = backTop;
}

(function(){
	EOS.dom=EOS.dom||{};
	
	function contains(p,c){  
		return p.contains ? 
			   p != c && p.contains(c) :
			   !!(p.compareDocumentPosition(c) & 16);  
	}
	
	function fixedMouse(e,target){  
        var related,
            type=e.type.toLowerCase();//这里获取事件名字
        if(type=='mouseover'){
            related=e.relatedTarget||e.fromElement
        }else if(type='mouseout'){
            related=e.relatedTarget||e.toElement
        }else return true;
        return related && related.prefix!='xul' && !contains(target,related) && related!==target;
    }
	EOS.apply(EOS.dom,{
		drag:function(drag,container,win){
			win=win||window;
			var doc=win.document;
			var start;
			var getXY=function(e){
				if(e&&e.pageX!=undefined){
					return {
						x:e.pageX,
						y:e.pageY
					}
				}
				e=win.event;
				return {
					x:e.clientX,
					y:e.clientY
				}
			};
			var md=function(e){
				start={
					top:parseInt(container.style.top),
					left:parseInt(container.style.left)
				};
				EOS.dom.addEvent(doc,'mousemove',mm);
				EOS.dom.addEvent(doc,'mouseup',mu);
				EOS.dom.showLayer(doc);
				EOS.apply(start,getXY(e));
				return false;
			};
			var mu=function(){
				EOS.dom.removeEvent(doc,'mousemove',mm);
				EOS.dom.removeEvent(doc,'mouseup',mu);
				EOS.dom.hideLayer(doc);
				return false;
			};
			var mm=function(e){
				var end=getXY(e);
				container.style.top=start.top+end.y-start.y+'px';
				container.style.left=start.left+end.x-start.x+'px';
				return false;
			};
			
			EOS.dom.addEvent(drag,'mousedown',md);
			// drag.onmousedown=md;
			// drag.onmouseup=mu;
		},
		showLayer:function(doc){
			if(!doc.____dragLayer){
				doc=doc||document;
				var div=doc.createElement('DIV');
				div.style.zIndex=1000000000;
				div.style.backgroundColor='#ffffff';
				div.style.width='100%';
				div.style.height='100%';
				div.style.position='absolute';
				div.style.top=0;
				div.style.left=0;
				div.style.opacity=0;
				div.style.filter = 'alpha(opacity=0)'
				doc.body.appendChild(div);
				doc.____dragLayer=div;
			}
			doc.____dragLayer.style.display='';
		},
		hideLayer:function(doc){
			if(doc.____dragLayer){
				doc.____dragLayer.style.display='none';
			}
		},
		addEvent:function(el,type,fn){
			var efn=fn;
		
			if(type=='mouseout'||type=='mouseover'){
				efn=function(e){
					if(fixedMouse(e,el)){
						fn();
					}
				}
			}
		
			if (el.attachEvent) {
				el['e' + type + fn] = efn;
				el[type + fn] = function () { el['e' + type + fn](window.event); }
				el.attachEvent('on' + type, el[type + fn]);
			} else{
				el.addEventListener(type, efn, false);
			}
		},
		removeEvent:function(el,type,fn){
			if (el.detachEvent) {
				el.detachEvent('on' + type, el[type + fn]);
				el[type + fn] = null;
			}else{
				el.removeEventListener(type, fn, false);
			}
		}
	});
})();

/**
 * @private 模拟模态对话框的函数.
 * @param {Object} strUrl
 * @param {Object} dialogArgs
 * @param {Object} callBack
 * @param {Object} winWidth
 * @param {Object} winHeight
 * @param {Object} winLeft
 * @param {Object} winTop
 * @param {Object} title 弹出窗口的title.
 */
function __showModal(modalId, strUrl, modalArguments, winWidth, winHeight, winLeft, winTop, title) {
	var container = $create("div", modalArguments.win.document);
	container.id = modalId + "__model_dialog_container";
	
	container.className = 'eos-popwin';
	//container.style.width='100px';
	container.onfocus = function () {
		container.blur()
	};
	var iframeStr = "";
	if (isIE) {
		//iframeStr = '<iframe src="'+blankURL+'" style=\"z-index:-1;filter:Alpha(Opacity=0);position:absolute;width:expression(this.nextSibling.offsetWidth);height:expression(this.nextSibling.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>';
	}
	
	var isIE6 = navigator.userAgent.toLowerCase().indexOf("msie 6") != -1;
	var style = "";
	if (isIE6)
		style = 'style="filter:alpha(opacity=50)"';
	var str = [
		iframeStr,
		'<div style="width:100%;height:100%">',
		'<div id="' + modalId + '__model_dialog_mask" onmousedown="eventManager.stopEvent();return false;" class="eos-div-mask" style="position:absolute;top:0px;left:0px;display:none;"></div>',
		'<TABLE  cellspacing="0" cellpadding="0" width="100%" height="100%" class="eos-dialog"><TR><TD ', style, ' class="left-top-conner"><div class="ieBlank"></div></TD><TD  ', style, ' class="top"></TD><TD  ', style, ' class="right-top-conner"><div class="ieBlank"></div></TD></TR><TR><TD  ', style, ' class="left"><div class="ieBlank"></div></TD><TD class="bgColor">',
		
		'<div style="width:100%;cursor:move" id="' + modalId + '__model_dialog_head" class="eos-popwin-head" ><a id="' + modalId + '__model_dialog_focus" href="#f"></a>',
		'<div class="eos-popwin-head-icon">&#160;</div>',
		'<div class="eos-popwin-head-title">' + (title || ' Dialog Window') + '</div>',
		'<div id="popupControls" class="eos-popwin-head-button"  >',
		'<a href="javascript:void(0);" id="' + modalId + '__model_dialog_closebutton" onmousedown="window.returnValue=undefined;hideModelDialog(\'' + modalId + '\',true)">&#160;</a>',
		'</div>',
		'</div>',
		'<div id="' + modalId + '__model_dialog_body" class="eos-popwin-body">',
		'</div>',
		'</TD><TD  ', style, ' class="right" id="', modalId, '_right"><div class="ieBlank"></div></TD></TR><TR><TD  ', style, ' class="left-bottom-conner"></TD><TD  ', style, ' class="bottom" id="', modalId, '_bottom"></TD><TD  ', style, ' class="right-bottom-conner" id="', modalId, '_rightBottom"></TD></TR></TABLE>',
		'</div>'
	].join('');
	
	var iframe = [
		'<iframe src="', blankURL, '" type="_eos_modal_dialog" eosid="' + modalId + '" name="' + modalId + '__model_dialog_frame" id="' + modalId + '__model_dialog_frame" scrolling="auto" ',
		'  HSPACE ="0" VSPACE="0" MARGINHEIGHT="0" MARGINWIDTH="0" ',
		' class="eos-popwin-body-iframe"  border ="0"   ',
		'frameborder="0" allowtransparency="true" ></iframe>'
	].join('\n');
	/**
	 *@desc 熊世宏修改于2012-03-02 解决showmode窗体中弹出窗体被遮盖的问题
	 */
	/*************start***********/
	//var maxIndex = getMaxZindex(modalArguments.win.document);
	var maxIndex = _get_top_window().getMaxZindex(modalArguments.win.document);
	/*************end***********/
	
	container.style.width = winWidth + "px";
	container.style.height = winHeight + "px"; //winHeight;
	container.style.left = winLeft + "px";
	container.style.top = winTop + "px";
	container.style.overflow = "hidden";
	
	var containerP = $mootools(container);
	containerP.setOpacity(0);
	
	container.innerHTML = str;
	
	modalArguments.win.document.body.appendChild(container);
	
	/**
	 *@desc 熊世宏修改于2012-03-02 解决showmode窗体中弹出窗体被遮盖的问题
	 */
	/*************start***********/
	// var maxZindex = getMaxZindex(modalArguments.win.document||document);
	var maxZindex = _get_top_window().getMaxZindex(modalArguments.win.document || document);
	/*************end***********/
	
	maxZindex++;
	container.tabIndex = maxZindex;
	container.onmousedown = function () {
		try {
			this.focus();
		} catch (e) {}
		eventManager.stopEvent();
	}
	container.onkeypress = function () {
		eventManager.stopEvent();
	}
	container.onkeydown = function (evt) {
		var code = (eventManager.getEvent(modalArguments.win) || evt).keyCode;
		if (code == 27) {
			eventManager.stopEvent();
			window.returnValue = undefined;
			hideModelDialog(modalId);
		}
	}
	var mask = $id(modalId + "__model_dialog_mask", modalArguments.win.document);
	mask.style.width = winWidth + "px";
	mask.style.height = winHeight + "px"; //winHeight;
	modalArguments.maskDiv = mask;
	mask.style.zIndex = maxIndex + 2;
	container.style.zIndex = maxIndex + 1;
	var wbody = $id(modalId + "__model_dialog_body", modalArguments.win.document);
	var frameParentWidth = wbody.offsetWidth;
	wbody.style.height = (winHeight - 27) > 0 ? (winHeight - 27 - 7) : 0 + "px";
	wbody.innerHTML = iframe;
	var frame = $id(modalId + "__model_dialog_frame", modalArguments.win.document);
	if (frame) {
		frame.src = strUrl;
		frame.style.height = (winHeight - 28) > 0 ? (winHeight - 28 - 7) : 0 + "px"; //winHeight;
		//frame.style.width = "100%";
		
		frame.style.width = frameParentWidth;
		frame.style.zIndex = maxIndex + 1;
	}
	var head = $id(modalId + "__model_dialog_head", modalArguments.win.document);
	head.onmousedown = function () {
		eventManager.stopEvent();
		return;
		try {
			container.focus();
		} catch (e) {}
		eventManager.stopEvent();
	}
	EOS.dom.drag(head,container,modalArguments.win);
	
	var ddDiv = $create("div", modalArguments.win.document);
	ddDiv.style.position = "absolute";
	ddDiv.style.width = winWidth + "px";
	ddDiv.style.height = winHeight + "px"; //winHeight;
	ddDiv.style.left = winLeft + "px";
	ddDiv.style.top = (winTop) + "px";
	ddDiv.style.cursor = "move";
	ddDiv.onmousedown = function () {
		eventManager.stopEvent();
	}
	ddDiv.style.zIndex = maxIndex;
	modalArguments.win.document.body.appendChild(ddDiv);
	
	/* var ddFunc = modalArguments.win.fx_DD || fx_DD;
	if (ddFunc) {
		ddFunc(ddDiv, {
			handle : head,
			limit : {
				x : [0, modalArguments.win.offsetWidth],
				y : [0, modalArguments.win.offsetHeight]
			},
			onStart : function () {
				ddDiv.style.height = container.style.height;
				ddDiv.style.zIndex = (ddDiv.style.zIndex * 1) + 2;
				modalArguments.win.document.body.onselectstart = function () {
					return false;
				}
				
			},
			onDrag : function () {
				ddDiv.style.border = "1px dotted #000093";
				container.style.display = "none";
			},
			onComplete : function () {
				this.isdraging = false;
				ddDiv.style.height = "24px";
				container.style.left = ddDiv.style.left;
				container.style.top = ddDiv.style.top;
				ddDiv.style.zIndex = ddDiv.style.zIndex - 2;
				ddDiv.style.border = "";
				container.style.display = "";
				modalArguments.win.document.body.onselectstart = null;
			}
		});
	} */
	modalArguments.iframe = frame;
	modalArguments.container = container;
	modalArguments.ddDiv = ddDiv;
	//container.style.display = "none";
	
	
	
	var f = $id(modalId + '__model_dialog_focus', modalArguments.win.document);
	var dragRightDiv = $id(modalId + '_right', modalArguments.win.document);
	var dragBottomDiv = $id(modalId + '_bottom', modalArguments.win.document);
	var dragRightBottomDiv = $id(modalId + 'rightBottom', modalArguments.win.document);
	
	/* ddFunc(container, {
		handle : dragBottomDiv,
		modifiers : true,
		onDrag : function () {
			var posY = this.mouse.start["y"];
			var nowPosY = this.mouse.now["y"];
			if (nowPosY - posY + this.value.now["y"] >= 27)
				this.element.style.height = nowPosY - posY + this.value.now["y"];
			resizeModelDialog(modalId, parseInt(container.style.width), parseInt(container.style.height));
			modalArguments.iframe.style.display = "none";
		},
		onComplete : function () {
			modalArguments.iframe.style.display = "";
		},
		onStart : function () {
			this.value.now["y"] = this.element.getStyle("height").toInt();
			modalArguments.iframe.style.display = "none";
		}
	});
	
	ddFunc(container, {
		handle : dragRightDiv,
		modifiers : true,
		onDrag : function () {
			var posX = this.mouse.start["x"];
			var nowPosX = this.mouse.now["x"];
			if (nowPosX - posX + this.value.now["x"] >= 150)
				this.element.style.width = nowPosX - posX + this.value.now["x"];
			
			resizeModelDialog(modalId, parseInt(container.style.width), parseInt(container.style.height));
			modalArguments.iframe.style.display = "none";
		},
		onComplete : function () {
			modalArguments.iframe.style.display = "";
		},
		onStart : function () {
			this.value.now["x"] = this.element.getStyle("width").toInt();
			modalArguments.iframe.style.display = "none";
		}
	});
	ddFunc(container, {
		handle : dragRightBottomDiv,
		modifiers : true,
		onStart : function () {
			this.value.now["x"] = this.element.getStyle("width").toInt();
			this.value.now["y"] = this.element.getStyle("height").toInt();
			modalArguments.iframe.style.display = "none";
		},
		onDrag : function () {
			
			var posY = this.mouse.start["y"];
			var nowPosY = this.mouse.now["y"];
			if (nowPosY - posY + this.value.now["y"] >= 27)
				container.style.height = nowPosY - posY + this.value.now["y"];
			var posX = this.mouse.start["x"];
			var nowPosX = this.mouse.now["x"];
			if (nowPosX - posX + this.value.now["x"] >= 150)
				container.style.width = nowPosX - posX + this.value.now["x"];
			resizeModelDialog(modalId, parseInt(container.style.width), parseInt(container.style.height));
			modalArguments.iframe.style.display = "none";
		},
		onComplete : function () {
			modalArguments.iframe.style.display = "";
		}
	}); */
	fx_fadeIn(container, function () {
		//container.style.display="";
	}, 650);
	/*if (window.isIE){
	var _input=$createElement('input' , { type : 'text' , style : {width:'10px',height:'10px'} ,value: '123' ,doc:modalArguments.win.document} );
	container.appendChild(_input);
	try{
	_input.focus();
	
	}catch(e){}
	try{
	_input.style.display="none";
	}catch(e){}
	}else{
	try{f.focus();}catch(e){}
	}*/
	
}

/**
 * 弹出新窗口.
 * @param {String} strUrl 弹出窗口内显示的网页的地址.
 * @param {int} winWidth 弹出窗口的宽度，单位为px
 * @param {int} winHeight 弹出窗口的高度，单位为px
 * @param {int} winLeft 弹出窗口的左坐标，单位为px
 * @param {int} winTop 弹出窗口的顶坐标，单位为px
 * @param {Boolean} showStatus 是否显示状态栏标识true(缺省): 显示状态栏,false:不显示状态栏.
 * @param {Boolean} showMenu 是否显示菜单栏 true/false(缺省)
 * @param {Boolean} showLocation 是否显示地址栏true/false(缺省)
 * @param {Boolean} showToolbar 是否显示工具栏 true/false(缺省)
 * @param {Boolean} showScrollbar 是否显示工具栏 true/false(缺省)
 */
function openNewWindow(strUrl, winWidth, winHeight, winLeft, winTop, showStatus, showMenu, showLocation, showToolbar, showScrollbar) {
	showStatus = (showStatus || showStatus == "yes") ? "yes" : "no";
	showMenu = (showMenu || showMenu == "yes") ? "yes" : "no";
	showLocation = (showLocation || showLocation == "yes") ? "yes" : "no";
	showToolbar = (showToolbar || showToolbar == "yes") ? "yes" : "no";
	showScrollbar = (showScrollbar || showScrollbar == "yes") ? "yes" : "no";
	newwin = window.open(strUrl,
			"popupnav",
			"width=" + winWidth + ","
			 + "height=" + winHeight + ","
			 + "left=" + winLeft + ","
			 + "top=" + winTop + ","
			 + "status=" + showStatus + ","
			 + "menubar=" + showMenu + ","
			 + "location=" + showLocation + ","
			 + "toolbar=" + showToolbar + ","
			 + "scrollbars=" + showScrollbar);
	newwin.focus();
	return newwin;
}

var _dialogArguments, _frameElement;

try {
	window.dialogArguments = window.dialogArguments;
} catch (e) {
	var dialogArguments;
}

try {
	_frameElement = window.frameElement || null;
} catch (e) {
	_frameElement = null;
}

if (_frameElement && !isCrossDomain(window.parent)) {
	var windowType,
	eosid;
	//IE10回显时元素不同，必须通过_frameElement.getAttribute("type");
	if(isIE&&!isIE10){
		windowType = _frameElement.type;
		eosid = _frameElement.eosid;
	} else {
		windowType = _frameElement.type || _frameElement.getAttribute("type");
		eosid = _frameElement.eosid || _frameElement.getAttribute("eosid");
	}
	
	if (windowType == "_eos_modal_dialog") {
		var modal = getModalDialog(eosid);
		if (modal) {
			window["dialogArguments"] = modal["Argument"];
			window["returnValue"] = null;
			window["parentWindow"] = modal.parentWin;
			window["_eos_dialog_id"] = modal.id;
			modal.frameWin = window;
		}
		initDialogWindowEvent();
		var winTop = _get_top_window();
		window.bfCurrStack = winTop.currStack;
		winTop.currStack = [];
		//eventManager.add(window,"load",initDialogWindowEvent);
		eventManager.add(window, "unload", function () {
			winTop.currStack = window.bfCurrStack || [];
		});
	}
}

function initDialogWindowEvent() {
	var closeWin = window.close;
	//修改IE10的回显问题 如果是IE10 并且是弹出窗。单独复写window.close()
	if(isIE10){
	   document.write("<script type=\"text/javascript\"> function close(){hideModelDialog(window[\"_eos_dialog_id\"]);}<\/script>");
	}else{
		window.close = function () {
			hideModelDialog(window["_eos_dialog_id"]);
		}
	}
	window.resize = function (width, height) {
		resizeModelDialog(window["_eos_dialog_id"], width, height);
	}
	var moveTo = window.moveTo;
	window.moveTo = function (left, topx) {
		moveModelDialog(window["_eos_dialog_id"], left, topx);
	}
	window.moveCenter = function () {
		moveModelDialogToCenter(window["_eos_dialog_id"]);
	}
}
/**
 * 重定向父窗口的方法，传入参数为url,
 * 若不传参数则为重新载入父窗口.
 * @param {Object} url
 */
function loadParent(url) {
	if (window.parentWindow) {
		if (url) {
			window.parentWindow.location = url;
		} else {
			window.parentWindow.location = window.parentWindow.location;
		}
	}
}
