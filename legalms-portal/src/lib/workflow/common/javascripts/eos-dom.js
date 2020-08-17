/**
 * 创建一个dom对象.如果没有doc则在本document创建，如果有则用doc创建.
 * @param {Object} htmlStr
 * @param {Object} doc
 * @return 返回新创建的dom对象.
 * @type Element
 */
function $create(htmlStr,doc){
	doc = doc||document;
	if(htmlStr.indexOf("<")>-1){
		var div = doc.createElement("div");
		div.innerHTML = htmlStr;
		return firstElement(div);
	}
	return doc.createElement(htmlStr);
}

/**
 * @private
 * 创建一个dom对象.可同时指定初始化属性. <br/>
 * 例如,创建一个 名为 testDiv ,文字颜色为红色的 div <br/>
 * var myDiv= $createElement( "div" , {name :'testDiv' , style :{color:'red'} } ; <br/>
 *
 * 例如,创建一个 名为 testInput ,默认值 为 "hello" 的 input hidden框 <br/>
 * var myHiddenInput= $createElement( "input" , {type:'hidden' , name :'testHidden' , value: 'hello' } ; <br/>
 **/
function $createElement(el,props){
		var doc = props?( props.doc || document ):document;
		if(el.indexOf("<")>-1){
			var div = doc.createElement("div");
			div.innerHTML = el;
			el=div.firstChild;
		}else if (isIE && props && (props.name || props.type)){
				var name = (props.name) ? ' name="' + props.name + '"' : '';
				var type = (props.type) ? ' type="' + props.type + '"' : '';
				//修复了IE10下的显示问题
				switch(el){
					case 'input':
						el=document.createElement('input');
						if(props.type){
							el.type=props.type;
							el.name = props.name;
						}
						break;
					default:
						el = '<' + el + name + type + '>';
						el = doc.createElement(el);
						break;
				}
				delete props.name;
				delete props.type;
		}else{
			el = doc.createElement(el);
		}

		if (props){
			if (props.style){
				for (var key in props.style){
					el.style[key]=props.style[key];
				}
				delete props.style;
			}
			for (var key in props){
					el[key]=props[key];
			}
		}
		return el;
	}

/**
 * @private
 * 私有方法.根据一个json对象,创建select元素.
 */
function createSelect(map, defaultValue,opt){
		var selectEl=$createElement("select",opt||{});
		for (var k in map ){
				var op= $createElement("option",{'value' : k ,'text':''+ map[k], innerHTML : map[k] });
				if ( (defaultValue||defaultValue===0) && k==defaultValue){
					op.selected=true;
				}
				selectEl.appendChild(op);
		}
		return selectEl;
	};


/**
 * @private
 * 私有方法，得到可见区的高.
 */
function getViewportHeight() {
	if (window.innerHeight!=window.undefined) return window.innerHeight;
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
	if (document.body) return document.body.clientHeight;
	return window.undefined;
}
/**
 * @private
 * 私有方法，得到可见区的宽.
 */
function getViewportWidth() {
	if (window.innerWidth!=window.undefined) return window.innerWidth;
	if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth;
	if (document.body) return document.body.clientWidth;
	return window.undefined;
}

/**
 * @private
 * 向body中插入一个节点，由于body可能未完全载入,
 * 插入的时候会有问题，所以要优先在第一个节点插入.
 * @param {Object} node
 * @param {Document} doc
 */
function bodyAddNode(node,doc){
	if(!node){
		return;
	}
	doc = doc||document;
	var first = doc.body.firstChild;
	if(first){
		doc.body.insertBefore(node,first);
	}else{
		doc.body.appendChild(node);
	}
}

/**
 * @private
 * 为元素添加一个className.
 * @param {Element} obj 要添加样式的元素.
 * @param {String} className 样式名称.
 */
function addClass(obj,className){
	if(!obj){
		return;
	}
    var arr = obj.className.split(" ");
    for(var i=0;i<arr.length;i++){
    	if(arr[i]==className){
    		return;
    	}
    }
    arr.push(className);
    obj.className = arr.join(" ");
}
/**
 * @private
 * 为元素删除className的样式.
 * @param {Element} obj 要删除样式的元素.
 * @param {String} className 样式名称.
 */
function removeClass(obj,className){
	if(!obj){
		return;
	}
    var arr = obj.className.split(" ");
    for(var i=0;i<arr.length;i++){
    	if(arr[i]==className){
			arr.splice(i,1);
    	}
    }
    obj.className = arr.join(" ");
}


/**
 * @private
 * 返回dom对象在页面中的位置,返回的对象包含两个属性,top,left
 * @param {Object} obj
 * @return 返回对象的位置.
 */
function getPosition(elem){
	  /* var parentNode = null;
            var box;
            if (obj.getBoundingClientRect) { // IE
               box = obj.getBoundingClientRect();
               var doc = document;
               if ( parent.document && parent.document!= document) {// might be in a frame, need to get its scroll
                  doc = parent.document;
               }
               var scrollTop = 0;
               var scrollLeft =0;
	           scrollTop = Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
	           scrollLeft = Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
               if(window==top&&isIE){
                  box.left = box.left - 2;//2pxbug
                  box.top = box.top - 2;//2pxbug
               }
			   return {left:box.left + scrollLeft ,top: box.top + scrollTop};
            }
            else { // safari, opera, & gecko
               pos = {left:obj.offsetLeft,top: obj.offsetTop};
               parentNode = obj.offsetParent;
               if (parentNode != obj) {
                  while (parentNode) {
                     pos.left += parentNode.offsetLeft;
                     pos.top += parentNode.offsetTop;
                     parentNode = parentNode.offsetParent;
                  }
               }
               if (window["isSafari"] && obj.style.position == 'absolute' ) { // safari doubles in some cases
                  pos.left -= document.body.offsetLeft;
                  pos.top -= document.body.offsetTop;
               }
            }

            if (obj.parentNode) { parentNode = obj.parentNode; }
            else { parentNode = null; }

            while (parentNode && parentNode.tagName.toUpperCase() != 'BODY' && parentNode.tagName.toUpperCase() != 'HTML')
            { // account for any scrolled ancestors
               if (parentNode.style.display != 'inline') { // work around opera inline scrollLeft/Top bug
                  pos.left -= parentNode.scrollLeft;
                  pos.top -= parentNode.scrollTop;
               }
               if (parentNode.parentNode) { parentNode = parentNode.parentNode; }
               else { parentNode = null; }
            }
            return pos;*/
        var top = elem.offsetTop;
		var left = elem.offsetLeft;
		var target = elem;
		while (target = target.offsetParent)
		{
			if(target.tagName=="BODY")
			  {
			 //  top-=target.scrollTop;
			  // left-=target.scrollLeft;
			   continue;
			   }
			top += target.offsetTop-target.scrollTop;
			left += target.offsetLeft-target.scrollLeft;
		}
		
		  return {"top":top,"left":left};

}

/**
 * @private
 * 返回dom对象在顶层页面中的绝对位置,返回的对象包含两个属性,top,left
 * @param {Object} obj
 * @return 返回对象的位置.
 */

function getAbsPos(elem)
{
		var topx = elem.offsetTop;
		var left = elem.offsetLeft;
		var target = elem;

		while (target = target.offsetParent)
		{
			if(target&&target.tagName=="BODY")
			  {
			   topx-=target.scrollTop;
			   left-=target.scrollLeft;
			   continue;
			   }
			topx += target.offsetTop-target.scrollTop;
			left += target.offsetLeft-target.scrollLeft;
		}
		var topWin=_get_top_window();
		if(topWin!=window)
		  {
		  if(isIE){
			  var win = window;
			  do{
				var frame = win.frameElement;
				if(frame){
					var rect = getPosition(frame);
					topx = topx + rect.top - (win.scrollTop||0);
					left = left + rect.left - (win.scrollLeft||0);
				}
				win = win.parent;
			  }while(win&&win!=topWin);
			  left += topWin.scrollLeft||0;
			  topx += topWin.scrollTop ||0;
			  if(isBorderBox){
				left = left +2;
				topx = topx + 2;
			  }
		  }else{
			  topx=window.screen.top-topWin.screen.top+topx;
			  left=window.screen.left-topWin.screen.left+left;
		  }
		}
		  return {"top":topx,"left":left};
}
/**
 * @private
 * 返回dom对象在顶层页面中的绝对位置,返回的对象包含两个属性,top,left
 * @param {Object} window
 * @param {Object} topWin
 * @return 返回对象的位置.
 */
function getScreenPos(window,topWin){
			var left = 0;
			var topx = 0;
        	if(window==topWin){
        		return {left:0,top:0}
        	}else{
        		var win = window;
        		while(win&&win!=topWin){
					var frm = win.frameElement;
					var parent = win.parent;
					if(frm){
						var pos = getPosition(frm);
						left = left + pos.left;
						topx = topx + pos.top;
					}
        			win = win.parent;
        		}
        	}
        	return {left:left,top:topx};
        }

/**
 * @private
 * 跨浏览器的添加样式的方法.该方法返回添加的样式.
 * 如果没有doc则在本document创建，如果有则用doc创建.
 * @param {Object} name
 * @param {Object} doc
 * @param {Object} hasDot 是否有点
 * @type styleSheet
 * @return 返回新添加的样式.
 */
function createStyle(name,doc,hasDot){
	var style = "display:";
	var rule;
	doc = doc||document;
	if(doc.styleSheets.length==0){
		var styleS = doc.createElement("style");
		doc.body.appendChild(styleS);
	}
	var styleSheet = doc.styleSheets[0];
	if(!hasDot){
		name = "." + name
	}
	if(styleSheet.insertRule){
		var i = styleSheet.insertRule(name + "{" + style + "}",styleSheet.length);
		return styleSheet.cssRules[i];
	}else{
		var i= styleSheet.addRule(name,style,-1);
		if(i==-1){
			i = styleSheet.rules.length -1;
		}
		return styleSheet.rules[i];
	}
}


/**
 * @private
 * 私有方法，取得当前页面滚动的左边距和上边距.
 */
function getScroll(el){
        var d = el, doc = document;
        if(d == doc || d == doc.body){
            var l = window.pageXOffset || doc.documentElement.scrollLeft || doc.body.scrollLeft || 0;
            var t = window.pageYOffset || doc.documentElement.scrollTop || doc.body.scrollTop || 0;
            return [ l, t];
        }else{
            return [ d.scrollLeft,d.scrollTop];
        }
}
/**
 * @private
 * 对元素的坐标进行转换
 */
function translatePoints(el,x, y){
        if(typeof x == 'object' || x instanceof Array){
            y = x[1]; x = x[0];
        }
        var p = el.style.position;
        var o = getElementXY(el);

        var l = parseInt(el.style.left, 10);
        var t = parseInt(el.style.top, 10);

        if(isNaN(l)){
            l = (p == "relative") ? 0 : el.offsetLeft;
        }
        if(isNaN(t)){
            t = (p == "relative") ? 0 : el.offsetTop;
        }

        return {left: (x - o[0] + l), top: (y - o[1] + t)};
    };


/**
 * @private
 * 取得页面元素的坐标.
 * @param {Object} el 页面元素
 * @type Array
 * @return 返回页面元素的坐标 [left,top].
 */
function getElementXY(el,pEl) {
		var p, pe, b, scroll, bd =  document.body;
	if(el&&el.style.display=="none"){
		return [0,0];
	}
	if (el.getBoundingClientRect) {
		try{
			b = el.getBoundingClientRect();
			scroll = getScroll(document);
			return [b.left + scroll[0], b.top + scroll[1]];
		}catch(e){	}

	}

		var x = 0, y = 0;
		p = el;
		pEl=pEl||bd;
		var hasAbsolute =el.style.position == "absolute";
		while (p) {
			x += p.offsetLeft;
			y += p.offsetTop;
			if (!hasAbsolute && p.style.position == "absolute") {
				hasAbsolute = true;
			}
			if (isGecko) {
					pe = p;
				var bt = parseInt(pe.style.borderTopWidth, 10) || 0;
				var bl = parseInt(pe.style.borderLeftWidth, 10) || 0;
				x += bl;
				y += bt;
				if (p != el && pe.style.overflow!= 'visible') {
					x += bl;
					y += bt;
				}
			}
			p = p.offsetParent;
		}

		if (isSafari && hasAbsolute) {
			x -= bd.offsetLeft;
			y -= bd.offsetTop;
		}
		if (isGecko && !hasAbsolute) {
			var dbd = bd;
			x += parseInt(dbd.style.borderTopWidth, 10) || 0;
			y += parseInt(dbd.style.borderTopWidth, 10) || 0;
		}

		p = el.parentNode;
		while (p && p != bd) {
			if (!isOpera || (p.tagName.toUpperCase() != 'TR' && p.style.display != "inline")) {
				x -= p.scrollLeft||0;
				y -= p.scrollTop||0;
			}
			p = p.parentNode;
		}
		return [x, y];
	};

/**
 * @private
 * 设置页面元素的坐标.
 * @param {Object} el 页面元素
 * @param {Array} xy 页面元素新坐标[left,top]
 */
function setElementXY(el, xy,donotReset) {
		if(el.style.position == 'static'){
		   el.style.position='relative';
	   }
	   if (donotReset!==true) {
		   el.style.left='0px';
		   el.style.top='0px';
	   }
		var pts = translatePoints(el,xy);
		if (xy[0] !== false) {
			el.style.left = pts.left + "px";
		}
		if (xy[1] !== false) {
			el.style.top = pts.top + "px";
		}
	};


/**
 * 获得第一个非文本和空白的子元素
 * @param {Object} p 父亲元素
 * @return 返回元素.
 * @type Object
 */
function firstElement(p, index){
		if (p){
			index = index || 1;
			var i = 0;
			var n = p.firstChild;
			while(n){
				if(n.nodeType == 1){
				   if(++i == index){
					   return n;
				   }
				}
				n = n.nextSibling;
			}
		}
		return null;
	};

/**
 * 获得当前元素前一个非文本和空白的兄弟元素
 * @param {Object} p 当前元素
 * @return 返回元素.
 * @type Object
 */
function prevElement(p, index){
		if (p){
			var n = p.previousSibling;
			while(n){
				if(n.nodeType == 1){
					   return n;
				}
				n = n.previousSibling;
			}
		}
		return null;
	};
/**
 * 获得当前元素后一个非文本和空白的兄弟元素
 * @param {Object} p 当前元素
 * @return 返回元素.
 * @type Object
 */
function nextElement(p, index){
		if (p){
			var n = p.nextSibling;
			while(n){
				if(n.nodeType == 1){
					   return n;
				}
				n = n.nextSibling;
			}
		}
		return null;
	};

/**
 * 获得node文本的方法.如果没有子节点,譬如:<a>b</a>则返回b,
 * 如果有子节点譬如:<a><b>myb</b><c>myc</c></a>则返回myb myc
 * @param {Object} node
 * @return 返回节点的值.
 * @type String
 */
function getNodeValue(node){
	var result = null;
	if(!node){
		return null;
	}
	var nullOrEmpty = node.getAttribute("__isNullOrEmpty");
	if(nullOrEmpty=="null"){
		return null;
	}
	if(nullOrEmpty=="empty"){
		return '';
	}
	if(node.text){
		result = node.text;
	}else{
		if(node.childNodes.length>1){
			/**for(var i=0;i<node.childNodes.length;i++){
				result = result + " " + getNodeValue(node.childNodes[i]);
			}**/
			result = node.xml.replace(/<\/?[^>]+>/gi, '');
		}else if(node.firstChild){
			result = node.firstChild.data;
		}
	}
	return result;
}

/**
 * 删除页面元素
 * @param {Object} el 要删除的元素
 */
function removeElement(el){
	if (!el){
		return;
	}
	var events=['onclick', 'ondblclick','onmousedown','onmouseup','onmouseover','onmouseout','onchange','onfocus','onblur','onkeypress','onkeydown','onkeyup'];
	for (var i=0;i<events.length;i++ ){
		el.setAttribute(events[i],null);
		el[events[i]]=null;
	}
	if (el.parentNode){
		el.parentNode.removeChild(el);
	}
}


function getFormElementsValue(formid) {
    formid = $e(formid);
	var result={};
	for (var i=0;i<formid.elements.length; i++ ){
		var element=formid.elements[i];
		if (!element.disabled && element.name) {
			var _value= getElementValue(element);
			if (result[element.name]!==undefined){
				result[element.name]=[].concat(result[element.name]);
				result[element.name].push(_value)
			}else{
				result[element.name]=_value;
			}
		}
    }
	return result;
}



function getElementValue(element){

    element = $e(element);
    var method = element.tagName.toLowerCase();

	function inputSelector(element) {
		return element.checked ? element.value : null;
	}
	function optionValue(opt) {
		//modify : return Element.extend(opt).hasAttribute('value') ? opt.value : opt.text;
		 return opt.getAttribute('value')!=null ? opt.value : opt.text;
	}

	var elementReader = {
	  input: function(element) {
		switch (element.type.toLowerCase()) {
		  case 'checkbox':
		  case 'radio':
			return inputSelector(element);
		  default:
			return element.value;
		}
	  },
	  textarea: function(element) {
		return element.value;
	  },
	  select: function(element) {
		 switch (element.type.toLowerCase()) {
			case 'select-one':
				var index = element.selectedIndex;
				return index >= 0 ? optionValue(element.options[index]) : null;
			default:
				var values, length = element.length;
				if (!length) return null;

				for (var i = 0, values = []; i < length; i++) {
				  var opt = element.options[i];
				  if (opt.selected) values.push(optionValue(opt));
				}
				return values;
		 }

		return this[element.type == 'select-one' ?
		  'selectOne' : 'selectMany'](element);
	  }
	};
	var fn=elementReader[method];
	if(fn==null) return null
	return fn(element);

}


/**
 * @private
 * 页面CSS的工具类
 */
var CSSUtil = function(docTT){
	var rules = null;
   	var doc = docTT || document;

    var camelRe = /(-[a-z])/gi;
    var camelFn = function(m, a){ return a.charAt(1).toUpperCase(); };

   return {
		createStyleSheet : function(cssText, id, docT){
		   var ss;
		   docT = docT || doc;
		   var heads=docT.getElementsByTagName("head");

			if (!heads || heads.length<1){
				docT.documentElement.insertBefore(docT.createElement('head'),docT.body);
				heads=docT.getElementsByTagName("head");
			}
			var head=heads[0];

		   var rules = docT.createElement("style");
		   rules.setAttribute("type", "text/css");
		   if(id){
			   rules.setAttribute("id", id);
		   }
		   if(isIE){
			   head.appendChild(rules);
			   ss = rules.styleSheet;
				try{
					ss.cssText = cssText;
				}catch(e){}
		   }else{
			   try{
					rules.appendChild(docT.createTextNode(cssText));
			   }catch(e){
				   rules.cssText = cssText;
			   }
			   head.appendChild(rules);
			   ss = rules.styleSheet ? rules.styleSheet : (rules.sheet || docT.styleSheets[docT.styleSheets.length-1]);
		   }
		   this.cacheStyleSheet(ss);
		   return ss;
	   },

	   removeStyleSheet : function(id,docT){
		   docT = docT || doc;
		   var existing = docT.getElementById(id);
		   if(existing){
			   existing.parentNode.removeChild(existing);
		   }
	   },

	   swapStyleSheet : function(id, url,docT){
		   docT = docT || doc;
		   this.removeStyleSheet(id);
		   var ss = docT.createElement("link");
		   ss.setAttribute("rel", "stylesheet");
		   ss.setAttribute("type", "text/css");
		   ss.setAttribute("id", id);
		   ss.setAttribute("href", url);
		   docT.getElementsByTagName("head")[0].appendChild(ss);
	   },

	   refreshCache : function(){
		   return this.getRules(true);
	   },

	   // private
	   cacheStyleSheet : function(ss){
		   if(!rules){
			   rules = {};
		   }
		   try{// try catch for cross domain access issue
			   var ssRules = ss.cssRules || ss.rules;
			   for(var j = ssRules.length-1; j >= 0; --j){
				   rules[ssRules[j].selectorText] = ssRules[j];
			   }
		   }catch(e){}
	   },

	   getRules : function(refreshCache,docT){
		   docT = docT || doc;
			if(rules == null || refreshCache){
				rules = {};

				var ds = docT.styleSheets;
				for(var i =0, len = ds.length; i < len; i++){
					try{
						this.cacheStyleSheet(ds[i]);
					}catch(e){}
				}
			}
			return rules;
		},

	   getRule : function(selector, refreshCache){
			var rs = this.getRules(refreshCache);

			if(!(selector instanceof Array)){
				return rs[selector];
			}
			for(var i = 0; i < selector.length; i++){
				if(rs[selector[i]]){
					return rs[selector[i]];
				}
			}
			return null;
		},

	   updateRule : function(selector, property, value){
			if(!(selector instanceof Array)){
				var rule = this.getRule(selector);
				if(rule){
					rule.style[property.replace(camelRe, camelFn)] = value;
					return true;
				}
			}else{
				for(var i = 0; i < selector.length; i++){
					if(this.updateRule(selector[i], property, value)){
						return true;
					}
				}
			}
			return false;
		},
		getCssText : function (cssName){
			var rule=CSSUtil.getRule(cssName);
			return rule?cssName + ' { '+ CSSUtil.getRule(cssName).style.cssText + ' } ':'';
		}
   };
}();
