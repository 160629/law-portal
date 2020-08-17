
if (!Array.prototype.push){
    Array.prototype.push = function(elem)
    {
        this[this.length] = elem;
    }
}

// Program:      document.elementFromPoint(int clientX, int clientY) in Gecko
// Author:       Jason Karl Davis (www.jasonkarldavis.com)
// Date:         15 June 2003
// Purpose:      Emulate Internet Explorer's document.elementFromPoint method as described here:
//               http://msdn.microsoft.com/workshop/a...tfrompoint.asp
// Requirements: A browser built off of the 1.4 branch of Mozilla (or better)
// Distribution: You may freely distribute and use this script as long as these comments remain intact

if (navigator.product == "Gecko") {

 Document.prototype.elementFromPoint = function(x, y) {
  this.addEventListener("mousemove", this.elementFromPoint__handler, false);
  var event = this.createEvent("MouseEvents");
  var box = this.getBoxObjectFor(this.documentElement);
  var screenDelta = { x: box.screenX, y: box.screenY };
  event.initMouseEvent("mousemove", true, false, this.defaultView, 0,
                        x + screenDelta.x, y + screenDelta.y, x, y,
                        false, false, false, false, 0, null);
  this.dispatchEvent(event);
  this.removeEventListener("mousemove", this.elementFromPoint__handler, false);
  return this.elementFromPoint__target;
 }
 Document.prototype.elementFromPoint__handler = function (event) {
  this.elementFromPoint__target = event.explicitOriginalTarget;

  // reparent target if it is a text node to emulate IE's behavior
  if (this.elementFromPoint__target.nodeType == Node.TEXT_NODE)
   this.elementFromPoint__target = this.elementFromPoint__target.parentNode;

  // change an HTML target to a BODY target to emulate IE's behavior (if we are in an HTML document)
  if (this.elementFromPoint__target.nodeName.toUpperCase() == "HTML" && this.documentElement.nodeName.toUpperCase() == "HTML")
   this.elementFromPoint__target = this.getElementsByTagName("BODY").item(0);

  event.preventDefault();
  event.stopPropagation();
 }
 Document.prototype.elementFromPoint__target = null;
}
if(!document.all){
	try{
	  if   (window.Node)
	  {
	  Node.prototype.contains   =   function(node)
	  {
	  	 if(!node)   return   false;
	  	  if(this==node) return true;
		  var   o_tag   =   node.tagName;
		  var   o   =   this.getElementsByTagName(o_tag);
		  var   l   =   o.length;
		  for   (var   i=0;   i<l;   i++) {
			  if   (o[i]   ==   node){
			  	return   true;
			  }
		  }
		   return  false;

		}

	  }
	}catch(e){
		alert(EVENTMANAGER_CONTIANS_ERROR);
	}
}
if(typeof(_registryEvent)=="undefined"){
	_registryEvent = [];
}
if(typeof(_registryOutClick)=="undefined"){
	_registryOutClick = [];
}
/**
 * @class
 * @private
 * 统一的事件管理类.添加和删除事件,获得事件的相关信息.
 */
function eventManager(){
}


// 为window.onload事件加入"顺序执行机制"

eventManager.onLoadFuncList=[];

/**
 * @private
 */
eventManager.onLoadFunc=function(){
	var Me=this;
	for (var i=0;i<eventManager.onLoadFuncList.length;i++ ){
		var func= eventManager.onLoadFuncList[i];
		func.apply(Me, arguments);
	}

};
eventManager.onLoadFunc.hasAdd=false;
/**
 * @private
 */
eventManager.onLoad = function(win , func,useCapture){
	eventManager.onLoadFuncList.push(func);
	if (!eventManager.onLoadFunc.hasAdd){
		eventManager.onLoadFunc.hasAdd=true;

		var type='load';
		func = eventManager.onLoadFunc ;

		if (win.addEventListener){
			win.addEventListener(type, func, useCapture);
			_registryEvent.push({obj: win, type: type, fn: func, useCapture: useCapture});
			return true;
		}else if (win.attachEvent && win.attachEvent("on" + type, func)){
			useCapture=false;
			_registryEvent.push({obj: win, type: type, fn: func, useCapture: useCapture});
			return true;
		}

	}
	return false;
}

/**
 * @private
 * 添加一个事件
 * @param {Element} obj Dom对象.
 * @param {String} type 事件的名称,去掉on,如click,mouseover.
 * @param {function} fn 触发的函数.
 * @param {boolean} useCapture 在mozilla下用的参数.默认false
 */
eventManager.add = function(obj, type, fn, useCapture){
    // If a string was passed in, it's an id.
    if (typeof obj == "string")
       obj = document.getElementById(obj);
    if (obj == null || fn == null)
       return false;
    // Mozilla/W3C listeners?
	if (type=='mousewheel' || type=='mousescroll'){
		type=(window.isGecko) ? 'DOMMouseScroll' : 'mousewheel';
	}else if(type=='load'){
		return eventManager.onLoad(obj,fn,useCapture);
	}

    if (obj.addEventListener){
        obj.addEventListener(type, fn, useCapture);
        _registryEvent.push({obj: obj, type: type, fn: fn, useCapture: useCapture});
        return true;
    }
     // IE-style listeners?
    if (obj.attachEvent && obj.attachEvent("on" + type, fn)){
        _registryEvent.push({obj: obj, type: type, fn: fn, useCapture: false});
        return true;
    }

    return false;
};

eventManager.addFocusEvent=function(obj,fn,useCapture){
	if(typeof(obj)=='string'){
		obj=$id(obj);
	}
	var type='focus';
	if(obj.constructor==window['ComboSelect']){
	
	}else if(obj.constroctor==window['CheckGroup']){
	
	}else if(obj.constroctor==window['DictRadioGroup']){
	
	}else{
		eventManager.add(obj,type,fn,useCapture);
	}
}

eventManager.addBlurEvent=function(obj,fn,useCapture){
	if(typeof(obj)=='string'){
		obj=$id(obj);
	}
	var type='blur';
	if(obj.constructor==window['ComboSelect']){
		
	}else if(obj.constroctor==window['CheckGroup']){
	
	}else if(obj.constroctor==window['DictRadioGroup']){
	
	}else{
		eventManager.add(obj,type,fn,useCapture);
	}
}
/**
 * @private
 * 添加一个外单击事件.当点击Element的外部时调用该方法.
 * 判断是否在外部的标准是:看obj是否包含了事件触发元素.
 * 如果包含则不触发事件,如果不包含则调用函数fn.
 * @param {Element} obj 外单击事件的对象.
 * @param {function} fn 回调函数.
 * @param {Object} params 回调函数传递的参数.
 */
eventManager.addOutClick = function(obj,fn,params){
	_registryOutClick.push({obj:obj,fn:fn,params:params});
}
/**
 * @private
 * 该方法在document的onclick事件中触发.判断是否有外单击事件需要调用.
 */
eventManager.outClick = function(e){
	/*var srcObj;
	var x = eventManager.getPointX();
	var y = eventManager.getPointY();
	if(document.elementFromPoint){
		srcObj = document.elementFromPoint(x,y);
	}else{
		srcObj = eventManager.getElement();
	}
	if(!srcObj){
		return;
	}
	if(srcObj.nodeType!=1){
		return;
	}
	for(var i=0;i<_registryOutClick.length;i++){
		var evt = _registryOutClick[i];
		if(!evt.obj.contains(srcObj)){
			var pos = getPosition(evt.obj);
			var top = pos.top;
			var left = pos.left;
			var right = left + evt.obj.offsetWidth;
			var bottom = top + evt.obj.offsetHeight;
			if(top>y||left>x||right<x||bottom<y){
				try{
					evt.fn(evt.params,srcObj,{x:x,y:y});
				}catch(e){

				}
			}
			//$info(evt.fn + "left:" + left + "right:" + right + "top:" + top + "bottom:" + bottom + "x:" + x + "y:" + y);
		}
		evt = null;
	}
	srcObj = null;*/
	PageControl.setFocus('','',e);
}

/**
 * @private
 * 移除事件.
 * @param {Element} obj
 * @param {String} type
 * @param {function} fn
 * @param {boolean} useCapture
 */
eventManager.remove = function(obj, type, fn, useCapture){
    if (obj.removeEventListener)
    	obj.removeEventListener(type, fn, useCapture);
    // IE-style listeners?
    else if (obj.detachEvent)
        obj.detachEvent("on" + type, fn);
	if(obj["on" + type]) obj["on" + type] = null;

};
/**
 * @private
 * 清空所有事件,释放资源.
 */
eventManager.CleanUp = function(){
	if(_registryEvent){
		for (var i = 0; i < _registryEvent.length; i++){
		    eventManager.remove(_registryEvent[i].obj,_registryEvent[i].type,_registryEvent[i].fn);
			_registryEvent[i].obj = null;
	        _registryEvent[i].fn = null;
		}
	}
	ReleaseEvents();
	_registryEvent = null;
	_registryOutClick = null;
	__page__components = null;
	window.onerror = null;
	eventManager.outClick = null;
	if ( window["CollectGarbage"] ){
		CollectGarbage();
	}
};
/**
 * @private
 * 根据事件获得元素.该方法必须在事件触发的函数中调用.
 */
 
/*
** 静态树修改，增加对firefox的支持
*/
eventManager.getElement=function(win){
	win = win||window;
	var func=eventManager.getElement.caller;
	/*if(isFF){
		var evt = func.arguments[0]|| window.event;
		return evt;
	}*/
	var targetEl;
	if(win.event){
		targetEl= win.event.srcElement;
	}else{
		var event = eventManager.getEvent(win);
		targetEl= event.target;
	}
	return targetEl.nodeType == 3 ? targetEl.parentNode: targetEl;
}
/**
 * @private
 * 停止事件冒泡的方法.该方法必须在事件触发的函数中调用.
 */
eventManager.stopPropagation = function(win){
	win = win||window;
	var func=eventManager.stopPropagation.caller;
 
		var evt = window.event ? window.event: eventManager.getEvent(win);
 
	if(!evt){
		return;
	}
	evt.stopPropagation ?evt.stopPropagation() : (evt.cancelBubble=true);
	if(evt.stopPropagation){
		evt.preventDefault();
		evt.stopPropagation();
	}else{
		evt.returnValue = false;
		evt.cancelBubble = true;
	}
	
}
eventManager.stopEvent=eventManager.stopPropagation;

/**
 * @private
 */
eventManager.getPageScroll = function(win) {
		win = win||window;
		var dd = win.document.documentElement, db = win.document.body;
		var l = 0;
		var t = 0;
		l = Math.max(dd.scrollLeft,db.scrollLeft);
		t = Math.max(dd.scrollTop,db.scrollTop);
		return [l,t];
		/*if (dd && (dd.scrollLeft || dd.scrollTop )) {
			return [dd.scrollLeft,dd.scrollTop];
		} else if (db) {
			return [db.scrollLeft,dd.scrollTop];
		} else {
			return [0, 0];
		}*/
};

/**
 * @private
 * 获得事件触发点的x坐标,.该方法必须在事件触发的函数中调用.
 */
eventManager.getPointX = function(win){
	win = win||window;
	var evt = eventManager.getEvent(win);
	var x = evt.pageX;
	if (!x && 0 !== x) {
		x = evt.clientX || 0;
		if (isIE) {
			x += eventManager.getPageScroll(win)[0];
		}
	}
	return x;
}
/**
 * @private
 * 获得事件触发点的y坐标,.该方法必须在事件触发的函数中调用.
 */
eventManager.getPointY = function(win){
	win = win||window;
	var evt = eventManager.getEvent(win);
	var y = evt.pageY;
	if (!y && 0 !== y) {
		y = evt.clientY || 0;
		if (isIE) {
			y += eventManager.getPageScroll(win)[1];
		}
	}
	return y;
}

/**
 * @private
 * 获得滚轮事件的滚动变化量.
 * return -1 向下滚动,  1 向上滚动
 */
eventManager.getWheel = function(event){
	event = event || window.event || eventManager.getEvent();
	return (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3;
}

/**
 * @private
 * 获得事件.该方法必须在事件触发的函数中调用.
 */
eventManager.getEvent = function(win){
	win = win||window;
	if(win.event){
		return win.event;
	}else{
	    var func=eventManager.getEvent.caller;
	    while(func!=null)
	    {
	        var arg0=func.arguments[0];
	        if(arg0)
	        {
	        	/*
	        	 * 修改了判断事件的内容
	        	 */
	        	// 如果就是event 对象
	        	 if((arg0.constructor==Event||arg0.constructor==MouseEvent||arg0.constructor==KeyboardEvent)||(typeof(arg0)=="object" && arg0.preventDefault && arg0.stopPropagation)){
	        		 return arg0;
	        	 }
	        }
	        func=func.caller;
	    }
	    return null;
	}
}
/**
 * @private
 * 获得键盘事件的keyCode,.该方法必须在事件触发的函数中调用.
 */
eventManager.getKeyCode = function(win){
	win = win||window;
	
	if(win.event){
		return win.event.keyCode;
	}else{
		var event = eventManager.getEvent(win);
		if(!event) return null;
		return event.keyCode;
	}
}

/**
 * @private
 */
function ReleaseEvents()
{
    return; //bug 22339
    var events = ["focus", "blur", "click","mousedown","mouseup", "mouseover", "keydown","keypress","keyup", "mouseout","change"];

	var releaseEvt = function(obj){
		var i;
        for (i = 0; i < events.length; i++){
        	if(obj["on" + events[i]]){
            	obj["on" + events[i]] = null;
        	}
        }
	}
	var arr = document.all||document.getElementsByTagName("*");
	if(arr){
		for(var j=0;j<arr.length;j++){
			releaseEvt(arr[j]);
		}
	}
}
function ReleaseElemEvents(elem)
{
    var events = ["focus", "blur", "click","mousedown","mouseup", "mouseover", "keydown","keypress","keyup", "mouseout","change"];

	var releaseEvt = function(obj){
		var i;
        for (i = 0; i < events.length; i++){
        	if(obj["on" + events[i]]){
            	obj["on" + events[i]] = null;
        	}
        }
	}
	releaseEvt(elem);
	var arr = elem.getElementsByTagName("*");
	if(arr){
		for(var j=0;j<arr.length;j++){
			releaseEvt(arr[j]);
		}
	}
}
eventManager.add(window, "unload", eventManager.CleanUp);
eventManager.add(document, "mousedown", eventManager.outClick);


/**
 * @private
 * 停止事件冒泡的方法.该方法必须在事件触发的函数中调用.
 */
eventManager.stopBubble = function(win){
	win = win||window;
	var evt = win.event?win.event:eventManager.getEvent(win);
	if(!evt){
		return;
	}
	if(evt.stopPropagation){
		evt.stopPropagation();
	}else{
		evt.cancelBubble = true;
	}
};

(function(){

	if(!EOS){
		return;
	}
	var ael=function(elId,e,fn,sc,data,id){
		if(arguments.length<2){
			return;
		}
		
		this.__eventBus[elId]=this.__eventBus[elId]||{};
		var eb=this.__eventBus[elId];
		if(!eb){
			return;
		}
		var ebe=eb[e];
		ebe=ebe||{
			name:e,
			map:{},
			handler:[]
		};
		
		id=id||EOS.createId();
		var h={
			id:id,
			fn:fn,
			data:data,
			scope:sc
		};
		ebe.map=ebe.map||{};
		if(ebe.map[id]!==undefined){//exists;
			EOS.apply(ebe.map[id],h);
			// ebe.map[id]=h;
			// ebe.handler[ebe.map[id]]=h;
		}else{
			ebe.map[id]=h;
			ebe.handler.push(h);
		}
		eb[e]=ebe;
		return id;
	};
	
	EOS.event={};
	EOS.apply(EOS.event,{
		__eventBus:{},
		/**
		*@desc 触发事件
		*@param e 事件名称
		*@param data 触发事件所传递的默认事件参数
		*@return undefined
		*/
		fireEvent:function(elId,e,data){
			if(!arguments.length){
				return;
			}
			
			// this.__eventBus[elId]=this.__eventBus[elId]||{};
			var eb=this.__eventBus[elId];
			if(!eb){
				return;
			}
			var ebe=eb[e];
			if(!ebe){
				return;
			}
			for(var i=0,len=ebe.handler.length;i<len;i++){
				var h=ebe.handler[i];
				h.fn.call(h.scope||this,{
					e:e,
					eventData:data,
					data:h.data
				});
			}
		},
		/**
		*@desc 添加事件监听
		*@param e 事件名称
		*@param fn 处理事件的回调方法
		*@param sc 处理事件的回调方法的作用域，默认为this
		*@param data 添加事件监听是传递的处理参数
		*@return undefined
		*/
		addEventListener:function(elId,e,fn,sc,data,id){
			var id;
			switch(typeof(e)){
				case 'string':
					id=ael.call(this,elId,e,fn,sc,data,id);
					break;
				case 'object':
					id=ael.call(this,elId,e.name,e.handler,e.scope,e.data,e.id);
					break;
				default:
					break;
			}
			return id;
		},
		/**
		*@desc 移除事件监听，该方法至少需要传递一个参数，
		       传递一个参数是，将会移除当前事件名称下的所有监听，两个参数都传递的时候会针对当前处理方法进行事件监听的移除
		*@param e 事件名称
		*@param fn 处理事件的回调方法
		*@param sc 处理事件的回调方法的作用域，默认为this
		*@param data 添加事件监听是传递的处理参数
		*@return undefined
		*/
		removeEventListener:function(elId,e,key){
			if(!arguments.length){
				return;
			}
			var eb=this.__eventBus[elId];
			if(!eb){
				return;
			}
			var ebe=eb[e];
			if(!ebe){
				return;
			}
			
			var t=typeof(key);
			switch(t){
				case 'function'://match fn
					for(var i=0,len=ebe.handler.length;i<len;i++){
						if(ebe.handler[i].fn==fn){
							ebe.handler[i].splice(i,0);
						}
					}
					break;
				case 'string'://match id
					if(ebe.map[key]!==undefined){
						for(var i=0,len=ebe.handler.length;i<len;i++){
							var h=ebe.handler[i];
							
							if(h.id==key){
								ebe.handler.splice(i,1);
								delete ebe.map[key];
								break;
							}
						}
					}
					break;
				default:
					delete eb[e];
					break;
			}
		},
		/**
		*@desc addEventListener方法的简写
		*/
		on:function(){		
			this.addEventListener.apply(this,arguments);
		},
		/**
		*@desc removeEventListener方法的简写
		*/
		un:function(){
			this.addEventListener.apply(this,arguments);
		}
	});
})()