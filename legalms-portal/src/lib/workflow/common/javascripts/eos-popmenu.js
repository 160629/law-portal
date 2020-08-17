/**
 * 右键菜单的构造函数.
 * @param {Object} id
 */
function PopMenu(id){
	this.id = id;
	PageControl.add(id,this);
	this.container = null;
	this.subMenuContainer = null;
	this.submenu = [];
	this.canClose = true;
	this.currMenu = null;
	this.level = 0;
	this.openLevel = [];
	this.menuContainer = null;
	this.doc = document;
	this.win = window;
	this.onClickFunc = null;
	this.args = null;
	this.isShow = false;
}
PopMenu.prototype.lazyInit=function(){
	this.win = _get_top_window()||window;
	_this=this;
	this.win.EOS.use('eos-popmenu',function(){
		this.init();
	},_this);
}


/**
 * 右键菜单的初始化函数.
 */
PopMenu.prototype.init = function(){
	this.win = _get_top_window()||window;
	this.doc = this.win.document;
	var uid = getDocumentId(document);
	this.container = $id(this.id + uid + "_container",this.doc);
	if(!this.container){
		this.container = $create("<div id='" + this.id + uid +  "_container' style='width:164px;overflow:hidden;position:absolute;display:none'></div>",this.doc);
		// bodyAddNode(this.container,this.doc);
		this.doc.body.appendChild(this.container);
	}
	this.container.style.width = "164px";
	this.container.style.overflow = "hidden";
	var maxZindex = getMaxZindex(this.win.document);
	this.container.style.zIndex = maxZindex + 1;
	//this.container.className = "eos-popmenu";
	var div = $create("div",this.doc);
	this.menuContainer = $create("div",this.doc);
	if(isIE&&!isIE10){
    	this.menuContainer.innerHTML = '<iframe src="'+blankURL+'" style=\"position:absolute;z-index:'+this.zIndex+';width:expression(this.nextSibling.childNodes[0].offsetWidth);height:expression(this.nextSibling.childNodes[0].offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>';
    }
	this.menuContainer.appendChild(this.container);
	
	var ul = $create("ul",this.doc);
	var shadowdiv = $create("div",this.doc);
	this.shadowdiv=shadowdiv;
	ul.className = "eos-popmenu-list";
	this.container.appendChild(shadowdiv);
	shadowdiv.appendChild(ul);
	shadowdiv.className = "eos-popmenu";
	div.appendChild(this.menuContainer);
	// bodyAddNode(div,this.doc);
	this.doc.body.appendChild(div);
	
	div.style.zIndex = maxZindex + 1;
	for(var i=0;i<this.submenu.length;i++){
		var menuItem = this.submenu[i];
		ul.appendChild(menuItem.container);
		menuItem.container.style.zIndex = maxZindex + 1;
		menuItem.zIndex = maxZindex + 1;
		menuItem.root = this;
		menuItem.level = this.level + 1;
		menuItem.init();
	}
	this.initEvent();
	this.openLevel[0] = this;
}
/**
 * 添加子节点的函数.
 * @param {Object} menuItem
 */
PopMenu.prototype.appendChild = function(menuItem){
	this.submenu.push(menuItem);
	menuItem.parent = this;
}
/**
 * 初始化事件的函数.
 */
PopMenu.prototype.initEvent = function(){
	var menu = this;
	function outClick(){
		menu.hide(true);
	}
	/*eventManager.addOutClick(this.menuContainer,outClick);
	if(this.win!=window){
		var eventM = this.win["eventManager"];
		if(eventM){
			eventM.addOutClick(this.menuContainer,outClick);
		}
	}*/
}
/**
 * 添加右键菜单对象的函数.
 * @param {Object} obj
 */
PopMenu.prototype.addObject = function(obj){
	if(!obj){
		return;
	}
	var menu = this;
}
/**
 * 显示右键菜单的函数.
 */
PopMenu.prototype.show = function(){
	PageControl.setFocus(this);
	this.container.style.display = "";
	
/*	if(this.container.offsetWidth<this.container.scrollWidth){
		this.container.style.width = this.container.scrollWidth + "px";
	}
*/
	this.isShow = true;
	if(this.isShadowInit!=true){

		if(isFF){
		initShadow(this.shadowdiv,this.doc);
		this.shadowdiv.style.width=this.shadowdiv.parentNode.offsetWidth-7
		}
		else
		{
		initShadowIe(this.shadowdiv,this.doc)
	   // this.shadowdiv.style.width=this.shadowdiv.offsetWidth-4;
		//this.shadowdiv.nextSibling.style.height=this.shadowdiv.offsetHeight;
		}
		this.isShadowInit=true;
	}

}
/**
 * 设置菜单位置的函数.
 * @param {Object} x
 * @param {Object} y
 */
PopMenu.prototype.setPosition = function(x,y){
	this.container.style.left = x + "px";
	this.container.style.top = y + "px";
//	setElementXY(this.container,[x,y])
}
/**
 * 隐藏菜单的函数.
 * @param {Object} isForce 是否强行关闭.
 */
PopMenu.prototype.hide = function(isForce){
	if(this.canClose||isForce){
		for(var i=0;i<this.submenu.length;i++){
			var submenu = this.submenu[i];
			submenu.hide(isForce);
		}
		if(this.container&&this.container.style){
			this.container.style.display = "none";
			this.isShow = false;
			return true;
		}
		return false;
		/* this.container.style.display = "none";
		this.isShow = false;
		return true; */
	}else{
		return false;
	}

}
/**
 * 计算打开的级数.
 * @param {Object} level
 */
PopMenu.prototype.openByLevel = function(level){
	$debug(level);
	for(var i=0;i<this.openLevel.length;i++){
		var openChild = this.openLevel[i];
		if(!openChild){
			continue;
		}
		if(i<=level){
			openChild.show();
		}else{
			openChild.hide(true);
		}
	}
}
/**
 * 菜单项的构造函数.
 * @param {Object} id
 */
function PopMenuItem(id){
	this.id = id;
	PageControl.add(id,this);
	this.parent = null;
	this.submemu = [];
	this.win = _get_top_window()||window;
	this.doc = this.win.document;
	this.container = $create("li",this.doc);
	this.subMenuContainer = null;
	this.url = null;
	this.name = null;
	this.seperator = false;
	this.params = [];
	this.icon = null;
	this.canClose = true;
	this.currMenu = null;
	this.level = 0;
	this.root = null;
	this.onClickFunc = null;
	this.menuKey = null;
	this.onRefreshFunc = null;
	this.zIndex = 0;
}
/**
 * 菜单项的初始化函数.
 */
PopMenuItem.prototype.init = function(){
		if(this.seperator){
				var str = '<span></span>';
				this.container.className = "eos-popmenu-line";
		    this.container.innerHTML =str;
		    if(isIE){
		    	this.container.style.height = "2px";
		    }else{
			    this.container.style.height = "1px";
		    }
    }else{
        this.initContainer();
        this.initEvent();
        this.initSubMenu();
    }
}
/**
 * 初始化子菜单的函数.
 */
PopMenuItem.prototype.initSubMenu = function(){
    if(this.hasChild()){
        var div = $create("div",this.doc);
        this.subMenuContainer = $create("div",this.doc);
		this.subMenuContainer.style.width = "164px";
		this.subMenuContainer.style.overflow = "hidden";
        if(isIE&&!isIE10){
        	div.innerHTML = '<iframe src="'+blankURL+'" style=\"position:absolute;z-index:'+this.zIndex+';width:expression(this.nextSibling.childNodes[0].offsetWidth);height:expression(this.nextSibling.childNodes[0].offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>';
        }
        div.appendChild(this.subMenuContainer);
        this.subMenuContainer.style.display = "none";
        this.subMenuContainer.style.position = "absolute";
        this.subMenuContainer.style.zIndex = parseInt(this.zIndex) + 1;
		var ul = $create("ul",this.doc);
		var shadowdiv= $create("div",this.doc);
		ul.className = "eos-popmenu-list";
		this.shadowdiv=shadowdiv;
		this.subMenuContainer.appendChild(shadowdiv);
		shadowdiv.appendChild(ul);
        for(var i=0;i<this.submemu.length;i++){
            var menuItem = this.submemu[i];
            menuItem.root = this.root;
            menuItem.level = this.level + 1;
            menuItem.container.style.zIndex =  parseInt(this.zIndex) + 1;
            menuItem.zIndex = this.zIndex + 1;
            menuItem.init();
            ul.appendChild(menuItem.container);
        }
        this.root.menuContainer.appendChild(div);
        //this.subMenuContainer.className = "eos-popmenu";
        shadowdiv.className = "eos-popmenu";
    }
}
/**
 * 初始化容器的函数.
 */
PopMenuItem.prototype.initContainer = function(){
	var a = $create("a",this.doc);
	a.className = "eos-popmenu-item";
	a.hidefocus= true;
	a.unselectable="on";
	a.href="#";
	this.container.appendChild(a);
    a.innerHTML = this.getNomalDiv();
    this.container.className = "eos-popmenu-list-item";
   // this.container.style.zIndex = 999;
}
PopMenuItem.prototype.getNomalDiv = function(){
    var str = "";
	str += '<table cellpadding="0" cellspacing="0" style="width: 100%;height:25px;background-color:transparent;border-style:none;border:-width:0px">';
	str += '    <tr>';
		str += '    <td  class="overLeft" style="width: 5px;height:25px;"></td>';
    str += '        <td  class="overCenter"style="width: 20px;height:25px;">';
    str += '            <div style="width: 20px;height:25px;overflow:hidden;background-color:transparent;border-style:none;border:-width:0px">';
    this.icon = this.icon?addContextPath(this.icon):PICTURE_BLANK;
    str += "<img border='0' width='16px' height='20px' src='" + this.icon + "'>";
    str += '            </div>';
    str += '        </td>';
    str += '        <td class="overCenter" style="padding-left:10px;height:25px;background-color:transparent;border-style:none;border:-width:0px">';
    var content = this.getContent();
    if(!content||content==null||content=="null"){
    	content="";
    }
    str += '           <div>' + content + '</div>';
    str += '        </td>';
    str += '        <td class="overCenter" align="right" style="padding-right:10px;height:25px;background-color:transparent;border-style:none;border:-width:0px">';
    var childPic = PICTURE_BLANK;
    if(this.hasChild()){
        childPic = POPMENU_ARROW_RIGHT;
    }
    str += "<img border='0' src='" + childPic + "'></td>"
	str += '    <td  class="overRight" style="width: 5px;height:25px;"></td></tr></table>';
    return str;

}
/**
 *  获取菜单内容的函数.
 */
PopMenuItem.prototype.getContent = function(){
	if(this.onRefreshFunc){
		try{
			return eval(this.onRefreshFunc + "(this);");
		}catch(e){
			alert(e);
			return this.name;
		}
	}
    var url = this.getURL();
    if(url){
        if(this.target){
            return "<a href='" + url + "' target='" + this.target + "'>" + this.name + "</a>";
        }else{
            return "<a href='" + url + "'>" + this.name + "</a>";
        }
    }else{
        return this.name;
    }
}
/**
 * 初始化事件.
 */
PopMenuItem.prototype.initEvent = function(){
    var menuItem = this;
    function hideSubMenu(){
        menuItem.hide();
    }
    function MouseOutFunc(){
        menuItem.parent.canClose = true;
    	  var currMenu = menuItem.parent.currMenu;
        if(currMenu&&currMenu!=menuItem){
            menuItem.parent.currMenu.hide(true);
        }
        var currMenu = menuItem.root.openLevel[menuItem.level];
        if(currMenu&&currMenu!=menuItem){
            currMenu.hide(true);
        }
    }
    function mouseoverFunc(){
    	  var currMenu = menuItem.parent.currMenu;
        if(currMenu&&currMenu!=menuItem){
            menuItem.parent.currMenu.hide(true);
        }
        var currMenu = menuItem.root.openLevel[menuItem.level];
        if(currMenu&&currMenu!=menuItem){
            currMenu.hide(true);
        }
        if(menuItem.root.isShow){
            menuItem.root.openLevel[menuItem.level] = menuItem;
		        menuItem.root.openByLevel(menuItem.level);
		        menuItem.parent.canClose = false;
		        menuItem.parent.currMenu = menuItem;
        }

        return false;
    }
    this.container.onmouseover = function(){
    		eventManager.stopEvent();
        mouseoverFunc();
        return false;
    }
    //eventManager.add(this.container,"mouseout",MouseOutFunc);
    this.container.onmouseout = function(){
    		eventManager.stopEvent();
    		MouseOutFunc();
        menuItem.root.openLevel[menuItem.level] = null;
        return false;
    }
    this.container.onclick = function(){
    		eventManager.stopEvent();
        menuItem.root.hide(true);
        menuItem.onClick();
        return false;
    }
}
/**
 * 获得菜单的url
 */
PopMenuItem.prototype.getURL = function(){
    if(this.url){
        var str = "";
        for(var i=0;i<this.params.length;i++){
            var param = this.params[i];
            str += "&" + param.key + "=" + param.value;
        }
        if(this.url.indexOf("?")<0){
            if(str.length>0){
                str = "?" + str;
            }
            str = str.replace("&","");
        }
        return this.url + str;
    }
    return null;
}
/**
 * 向菜单项中添加参数.
 * @param {Object} key
 * @param {Object} value
 */
PopMenuItem.prototype.addParam = function(key,value){
    this.params.push({key:key,value:value});
}
/**
 * 是否有子菜单.
 */
PopMenuItem.prototype.hasChild = function(){
    return this.submemu.length !=0;
}
/**
 * 添加子菜单的方法.
 * @param {Object} menuItem
 */
PopMenuItem.prototype.appendChild = function(menuItem){
    this.submemu.push(menuItem);
    menuItem.parent = this;
}
/**
 * 显示子菜单的方法.
 */
PopMenuItem.prototype.showSubMenu = function(){
    if(this.hasChild()){
        var pos = getPosition(this.container);
        this.subMenuContainer.style.left = (pos.left-3 + this.container.offsetWidth) + "px";
        this.subMenuContainer.style.top = pos.top + "px";
        this.subMenuContainer.style.display = "";
		if(this.subMenuContainer.offsetWidth<this.subMenuContainer.scrollWidth){
			this.subMenuContainer.style.width = this.subMenuContainer.scrollWidth + "px";
		}
		var posSub = getPosition(this.subMenuContainer);
		var doc = this.doc||document;
		var right = posSub.left + this.subMenuContainer.offsetWidth;
		var bodyRight = doc.body.clientWidth;
		if(right>bodyRight){
			var tempLeft = pos.left - this.subMenuContainer.offsetWidth;
			if(tempLeft<0){
				tempLeft = 0;
			}
			this.subMenuContainer.style.left = tempLeft + "px";
		}
	if(this.isShadowInit!=true)
	        {
	    
	        	if(isFF)
	        	{
        	    initShadow(this.shadowdiv,this.doc);
	            $debug(this.shadowdiv.parentNode.offsetWidth);
	            this.shadowdiv.style.width=this.shadowdiv.parentNode.offsetWidth-7
                }
                else
                {
                initShadowIe(this.shadowdiv,this.doc);
                }
                this.isShadowInit=true;
	        }
    }
}
/**
 * 触发的onclick事件.
 */
PopMenuItem.prototype.onClick = function(){
	var root = this.root;
    if(this.onClickFunc){
		try{
	        eval(this.onClickFunc + "(this,root.args)");
		}catch(e){

		}
    }
	if(root.onClickFunc){
		try{
	        eval(root.onClickFunc + "(this.menuKey,root.args)");
		}catch(e){

		}
	}

}
/**
 * 隐藏子菜单的方法.
 * @param {Object} isForce 是否是强制的.
 */
PopMenuItem.prototype.hide = function(isForce){
    if(this.canClose||isForce){
        if(this.hasChild()){
            for(var i=0;i<this.submemu.length;i++){
                var submenu = this.submemu[i];
                submenu.hide(isForce);
            }
			if(this.subMenuContainer&&this.subMenuContainer.style){
				this.subMenuContainer.style.display = "none";
			}
        }
    }
}
PopMenuItem.prototype.show = function(){
    this.showSubMenu();
}
/**
 * 显示popMenu的方法.
 * @param {Object} popMenuId
 */
function showPopMenu(popMenuId,args){
    var menu = $o(popMenuId);
    if(menu){
		menu.args = args;
		var evt = eventManager.getEvent();

        var x = evt.x||evt.clientX;
        var y = evt.y||evt.clientY;
        if(isIE){
        	var xyOff = getAbsPos(document.body,menu.win);
	        x = x + xyOff.left + menu.doc.body.scrollLeft;
	        y = y + xyOff.top + menu.doc.body.scrollTop;
        }else{
        	var xyOff = getScreenPos(window,menu.win);
			x = x + xyOff.left;
			y = y +  xyOff.top;
        }
        if(menu.hide(true)){
            menu.show();
            menu.setPosition(x,y);
        }
    }
}
function hideMenu(popMenuId){
    var menu = $o(popMenuId);
    if(menu){
		menu.hide(true);
    }
}
function getDocumentId(doc){
	var topWin = _get_top_window();
	if(!topWin.docs){
		topWin.docs = [];
	}
	var i = 0;
	for(;i<topWin.docs.length;i++){
		try{
		if(topWin.docs[i]==doc){
			//alert("docs");
			return i;
		}
		}catch(e){
			//alert(e);
			break;
		}
	}
	topWin.docs.push(doc);
	return topWin.docs.length-1;
}

PopMenu.prototype.bind = function(obj,args){
        var id=this.id
		if(obj!=null)
		{
		obj.oncontextmenu= function(){
		              showPopMenu(id,args);
		              return false;
	                  }
		}
}

function initShadowIe(o,doc)
{
  doc=doc||document;
		var tmpnode=o.nextSibling;
		if(tmpnode==null||!tmpnode.isShadow)
		 {
		  var parentNode=o.parentNode;
		  var width=o.offsetWidth
		  var height=o.offsetHeight
		  
		  var shadowContainter=$createElement("div",{doc:doc});
		  shadowContainter.isShadow=true;
		  parentNode.style.width=width;
		  parentNode.style.height=height;
		  shadowContainter.style.width=width-8;
		  shadowContainter.style.height=height-8;
		  shadowContainter.style.position="absolute";
		  shadowContainter.style.left=0;
		  shadowContainter.style.top=0;
	  	  shadowContainter.style.zIndex=-999;
		  shadowContainter.style.background="#777";
		  shadowContainter.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=4)"
		  parentNode.insertBefore(shadowContainter,o.nextSibling);
		   o.shadowContainter=shadowContainter;
		  o.style.width=width-4;
		  o.style.height=height-4;

		  }
}