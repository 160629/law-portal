var EOSMaskCache={};


/**
 * 页面遮罩类
 */
function Mask(id,win){
	var Me=this;
	this.id=id;
	this.inited=false;

	EOSMaskCache[this.id]=this;
	this.isFrameSetPage =false;

	this.win= win || window;


	this.init=function(){
		this.frameList= this.win.document.getElementsByTagName('frame');
		if (this.frameList.length>0)	{
			this.isFrameSetPage=true;
			this.inited=true;
			return this.inited;
		}

		this.container= this.container || this.win.document.body;
		if ( !this.inited && this.win.document.body){
			this.core= this.win.document.createElement('div');
			this.core.id=this.id+'_div';
			this.core.onmousedown = function(){
				eventManager.stopBubble();
			}
			if(isIE){
				/*var str = '<iframe src="'+blankURL+'" style=\"filter:Alpha(Opacity=0);position:absolute;z-index:-1;width:expression(this.parentNode.offsetWidth);height:expression(this.parentNode.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>';
				str += '<div style="width:expression(this.parentNode.offsetWidth);height:expression(this.parentNode.offsetHeight);z-index:1" class="eos-page-mask"></div>';
				this.core.innerHTML = str;*/
			}
			this.core.className='eos-page-mask';
			this.core.style.display='none';
			this.win.document.body.appendChild(this.core);
			this.inited=true;
		}
		return this.inited;
	}


	this.setContainer=function(container){
		if (this.container && this.container.setAttribute){
			this.container.setAttribute('_mask',null);
		}
		this.container=container;
		if (this.container && this.container.setAttribute){
			this.container.setAttribute('_mask',this.id);
		}
	}





	this.isHidden = function(){
		return this.core.style.display=='none';
	}
	this.autoResize=function(){
		if (this.isHidden()){
			return;
		}
		var mt= parseInt(this.container.style.marginTop);
		var ml= parseInt(this.container.style.marginLeft);
		mt=mt||0;
		ml=ml||0

		var t=0,l=0,w,h;
		if (this.container == this.win.document.body){
			w = this.win.screen.width ;
			h = this.win.screen.height;
		}else{
			t = getElementXY(this.container);
			l=t[0];
			t=t[1];
			w = this.container.offsetWidth;
			h = this.container.offsetHeight;

		}

		w +=mt;
		h +=ml;
		var mask= this.core;
		mask.style.top=t-mt+'px';
		mask.style.left=l-ml+'px';
		mask.style.width= w+'px';
		mask.style.height= h+'px';
		if (this.container == this.win.document.body){
				this.container.scrollTop=0;
				this.container.scrollLeft=0;
		}
	},

/**
 * 显示遮罩
 * @param {Object} container 遮罩要遮挡的页面元素,默认为整个页面
 */
	this.show=function(container){

		if (this.isFrameSetPage){
			for (var i=0;i<this.frameList.length;i++ ){
				try{
					if (!this.frameList[i].contentWindow.eos_pageMask){
						this.frameList[i].contentWindow.eos_pageMask=new Mask('eos_pageMask'+'_f_'+i,this.frameList[i].contentWindow);
					}
					this.frameList[i].contentWindow.eos_pageMask.show();
				}catch(e){}
			}

			return;
		}
			if (!this.init() || !this.isHidden()){
				return;
			}
			if ( container ){
				this.setContainer( container );
			}
			this.oldOverFlowX= this.container.style.overflowX;
			this.oldOverFlowY= this.container.style.overflowY;
			this.container.style.overflowX='hidden';
			this.container.style.overflowY='hidden';
			var maxZindex = getMaxZindex(this.container.ownerDocument||document);
			maxZindex++;
			this.container.style.zIndex = maxZindex ;



		this.core.style.display='block';
		maxZindex++;
		this.core.style.zIndex = maxZindex;
		this.core.focus();
		//this.container.disabled=true;


		this.autoResize();



	}

/**
 * 隐藏遮罩
 */

	this.hide=function(){
		if (this.isFrameSetPage){
			for (var i=0;i<this.frameList.length;i++ ){
				try{
					if (!this.frameList[i].contentWindow.eos_pageMask){
						this.frameList[i].contentWindow.eos_pageMask=new Mask('frame_'+this.frameList[i].contentWindow.location,this.frameList[i].contentWindow);
					}
					this.frameList[i].contentWindow.eos_pageMask.hide();
				}catch(e){}
			}
			return;
		}
			if (this.isHidden() || !this.container){
				return;
			}
			this.container.style.overflowX= this.oldOverFlowX;
			this.container.style.overflowY= this.oldOverFlowY;
			//this.container.disabled=false;
			this.core.style.display='none';
	}
	this.hideAfterTime=function(millisecond){
		this.win.setTimeout( function(){ Me.hide()},millisecond || 100 );
	};

	if (window.addEventListener){
		 window.addEventListener('load',function(){ Me.init() }, false);
	}
	else{
		 window.attachEvent('onload', function(){ Me.init() });
	}
}

window.eos_pageMask=new Mask('eos_pageMask');



function maskElement(el,win){
		win=win||window;
		el=$id(el);
		el.maskId="_eos_"+el.id+"_mask";

		var div = $id( el.maskId ,win.document);
				var w=el.offsetWidth , h=el.offsetHeight;
		if(!div){
			div = $create("div",win.document);
			div.style.display = "none";
			div.id = el.maskId;
			/*if(isIE){
				var str = '<iframe style=\"filter:Alpha(Opacity=0);position:absolute;z-index:-1;width:100%;height:100%;\" frameborder=\"0\" ></iframe>';
				str += '<div style="z-index:1" class="eos-page-mask" style="width:100%;height:100%;"></div><a href="#f" style="height:1px;text-decoration : none;"><span style="font-size:1px">&#160;</span></a>';
				div.innerHTML = str;
			}*/
			if(document!=win.document){
				moveCss(document,win.document);
			}

			win.document.body.appendChild(div);

		}

		div.style.position='absolute';

		div.style.width=w+'px';
		div.style.height=h+'px';

		var xy=getElementXY(el);
		setElementXY(div,xy);

		div.className = "eos-page-mask";
		div.style.display = "block";

		win._bakscroll = win.onscroll;
		var maxZindex = getMaxZindex(win.document);

			div.onmousedown = function(){
				eventManager.stopBubble();
			}
			div.onkeydown = function(){
				eventManager.stopBubble();
			}
			div.onkeypress = function(){
				eventManager.stopBubble();
			}
		div.style.zIndex = maxZindex + 2;
		div.pActiveElement=document.activeElement;
		try{	div.focus(); }catch(e){}
		try{ div.getElementsByTagName('a')[0].focus(); }catch(e){}


}

function unMaskElement(el,win){
		win=win||window;
		el=$id(el);
		var div=$id(el.maskId);
		if (div){
			div.style.display="none";
		}

}

/**
 *遮住整个窗口
 */
function maskTop(){
	maskWindow( _get_top_window(true) );
}
/**
 *遮住指定窗口
 * @param {Object} 指定window
 */
function maskWindow(win){
	win = win||window;
	hideSelect(win);
	if(isFrameSet(win)){
		var frames = win.document.getElementsByTagName("frame");
		for(var i=0;i<frames.length;i++){
			try{
				maskWindow(frames[i].contentWindow);
			}catch(e){}
		}
	}else{
		var div = $id("_eos_page_mask",win.document);
		if(!div){
			div = $create("div",win.document);
			div.style.display = "none";
			div.id = "_eos_page_mask";
			div.className = "eos-page-mask";
			if(document!=win.document){
				moveCss(document,win.document);
			}
			win.document.body.appendChild(div);


		}

		function resizeMask(){
			var mt= parseInt(win.document.body.style.marginTop);
			var ml= parseInt(win.document.body.style.marginLeft);
			mt=mt||0;
			ml=ml||0

			var t=0,l=0,w,h;
			var scrollLeft = (Math.max(win.document.documentElement.scrollLeft, win.document.body.scrollLeft)||0);
			var scrollTop = (Math.max(win.document.documentElement.scrollTop, win.document.body.scrollTop)||0);
			w = Math.max(win.document.body.scrollWidth,(win.document.body.clientWidth + scrollLeft));
			h = Math.max(win.document.body.scrollHeight,(win.document.body.clientHeight + scrollTop));
			w +=mt;
			h +=ml;
			div.style.top=t-mt+'px';
			div.style.left=l-ml+'px';
			div.style.width= w+'px';
			div.style.height= h+'px';
		}
		div.className = "eos-page-mask";
		div.style.display = "block";
		resizeMask();
		win._bakresize = win.onresize;
		window.onresize = function(){
			resizeMask();
		}
		var maxZindex = getMaxZindex(win.document);

			div.onmousedown = function(){
				eventManager.stopBubble();
			}
			div.onkeydown = function(){
				eventManager.stopBubble();
			}
			div.onkeypress = function(){
				eventManager.stopBubble();
			}
		div.style.zIndex = maxZindex + 2;
		div.pActiveElement=document.activeElement;
		try{	div.focus(); }catch(e){}
		/* try{ 
			//div.getElementsByTagName('a')[0].focus(); 
			}catch(e){} */



	}

}

function hideSelect(win){

	var ie6=!-[1,]&&!window.XMLHttpRequest;

	if(!ie6){
		return;
	}
	if(win){
		if(!win["mask-select-style"]){
			win["mask-select-style"] = createStyle("select",win.document,true);
		}
		if(win["mask-select-style"]){
			win["mask-select-style"].style.visibility = "hidden";
		}
		var frames = win.document.getElementsByTagName("frame");
		for(var i=0;i<frames.length;i++){
			try{
				hideSelect(frames[i].contentWindow);
			}catch(e){}
		}
		var iframes = win.document.getElementsByTagName("iframe");
		for(var i=0;i<iframes.length;i++){
			try{
				hideSelect(iframes[i].contentWindow);
			}catch(e){}
		}
	}
}

function showSelect(win){
	var ie6=!-[1,]&&!window.XMLHttpRequest;

	if(!ie6){
		return;
	}
	if(win){
		if(!win["mask-select-style"]){
			win["mask-select-style"] = createStyle("select",win.document,true);
		}
		if(win["mask-select-style"]){
			win["mask-select-style"].style.visibility = "visible";
		}
		var frames = win.document.getElementsByTagName("frame");
		for(var i=0;i<frames.length;i++){
			try{
				showSelect(frames[i].contentWindow);
			}catch(e){}
		}
		var iframes = win.document.getElementsByTagName("iframe");
		for(var i=0;i<iframes.length;i++){
			try{
				showSelect(iframes[i].contentWindow);
			}catch(e){}
		}
	}
}

/**
 * 取消指定窗口的遮罩
 * @param {Object} 指定window
 */
function unMaskWindow(win){
	win = win||window;
	showSelect(win);
	if(isFrameSet(win)){
		var frames = win.document.getElementsByTagName("frame");
		for(var i=0;i<frames.length;i++){
			try{
				unMaskWindow(frames[i].contentWindow);
			}catch(e){}
		}
	}else{
		var div = $id("_eos_page_mask",win.document);
		if(div){
			try{
				div.style.display = "none";
				div.pActiveElement && div.pActiveElement.focus();
				div.pActiveElement=null;
			}catch(e){

			}
		}
		if(win._bakresize){
			win.onresize = win._bakresize;
		}

	}

}

/**
 *
 *取消整个窗口的遮罩
 */
function unMaskTop(){
	unMaskWindow(_get_top_window(true));
}

function isFrameSet(win){
	//win = win||window;
	return win.document.getElementsByTagName("frameset").length!=0;
}