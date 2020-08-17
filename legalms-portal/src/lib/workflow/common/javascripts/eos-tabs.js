
var TABPANE_TYPE_DIV = "DIV";
var TABPANE_TYPE_IFRAME = "IFRAME";
var TABPANE_STATUS_NOMAL = 1;
var TABPANE_STATUS_OVER = 2;
var TABPANE_STATUS_ACTIVE = 3;
var TABPANE_STATUS_DISABLED = 4;
var TABPANE_STATUS_CLOSED = 5;
var TABPANE_STATUS_HIDDEN = 5;
var TAB_STYLE_NOMAL = "nomal";
var TAB_STYLE_OVER = "hover";
var TAB_STYLE_ACTIVE = "active";
var TAB_STYLE_DISABLED = "disabled";
var TAB_STYLE_LEFT = "left";
var TAB_STYLE_MID = "mid";
var TAB_STYLE_RIGHT = "right";
var TAB_STYLE_TABLE = "container";
/**
 * TagGroup的构造函数，声明变量，并向PageControl注册自己.
 * @param {Object} id
 */
function TabPane(id){
	this.id = id;
	PageControl.add(id,this);
	this.subTabs = new Array();
	this.currTab = null;
	this.defaultTab = 0;
	this.isTitleOut = false;
	this.titleContainer = null;
	this.bodyContainer = null;
	this.bgColor = "#f1f1f1";
	this.borderColor = "#C0C0C0";
	this.container = null;
	this.width = "100%";
	this.height = "100%";
	this.titleWidth = 120;
	this.__titleTR = null;
	this.noCacheIframe = $create("<iframe name='" + this.id + "'/>");
	this.noCacheIframe.name = this.id;
	this.noCacheIframe.style.border = 0;
	this.noCacheIframe.frameBorder = 0;
	this.noCacheIframe.style.width = "100%";
	this.noCacheIframe.style.height = "100%";
	this.pilot = null;
	this.pilotIndex = 0;
	this.firstButton = null;
	this.nextButton = null;
	this.privousButton = null;
	this.lastButton = null;
	this.maxTabs = 0;
	this.inited = false;
	this.pilotInited = false;
	this._titleTD = null;
	this.titleAlign = "top";
	this.styleSuffix = "";
}
/**
 * 向TabPane添加一个TabPage对象的方法.
 * @param {Object} tabpage
 */
TabPane.prototype.append = function(tabpage){
	this.subTabs.push(tabpage);
	tabpage.group = this;
}
/**
 * 得到子标签页的个数.
 * @return 返回子标签页的个数.
 * @type int
 */
TabPane.prototype.getLength = function(){
	return this.subTabs.length;
}

TabPane.prototype.getTabs = function(){
	return this.subTabs;
}

TabPane.prototype.getActiveTab = function(){
	return this.currTab;
}

TabPane.prototype.getActiveTabIndex = function(){
	return this.getCurrIndex();
}
/**
 * 移除TabPane中某一个TabPage对象的方法.
 * @param {Object} tabpage
 */
TabPane.prototype.remove = function(tabpage){
	for(var i=0;i<this.subTabs.length;i++){
		if(this.subTabs[i]==tabpage){
			this.subTabs.splice(i,1);
			if(this.currTab==tabpage){
				this.currTab = null;
				var index = i-1;
				index = index<0?0:index;
				this.selectTab(index);
			}
			return true;
		}
	}
	return false;
}
/**
 * 构造标签的方法，如果标签的数目大于能显示的最大数目，则显示pilot
 */
TabPane.prototype.buildTitles = function(){
	var width = this.getWidth();
	var totalWidth = 0;
	for(var i=0;i<this.subTabs.length;i++){
		this.appendTitle(this.subTabs[i]);
		totalWidth += this.subTabs[i].getWidth();
		if(width - totalWidth <60){
			this.subTabs[i].hideTitle();
			this.isTitleOut = true;
		}else{
			this.subTabs[i].showTitle();
		}
	}
	if(this.isTitleOut){
		this.initPilot();
	}
	this.inited = true;
}

TabPane.prototype.getWidth = function(){
	var width = 0;
	if(String(this.width).indexOf("%")>0){
		width = parseInt(this.container.offsetWidth);
	}else{
		width = parseInt(this.width);
	}
	if(width==0){
		var parent = this.container.parentNode;
		while(parent){
			var parentWidth = parseInt(parent.offsetWidth);
			if(parentWidth!=0){
				return parentWidth;
			}
			parent = parent.parentNode;
		}
		return document.body.offsetWidth;
	}else{
		return width;
	}
}
/**
 * 获得tagpage的index的方法.
 * @param {Object} tagpage
 * @return 返回tagpage的索引.
 * @type int
 */
TabPane.prototype.getIndex = function(tagpage){
	for(var i=0;i<this.subTabs.length;i++){
		if(this.subTabs[i]==tagpage){
			return i;
		}
	}
	return -1;
}

/**
 * 返回当前的tab的索引.
 * @return 返回当前tagpage的索引.
 * @type int
 */
TabPane.prototype.getCurrIndex = function(){
	return this.getIndex(this.currTab);
}

TabPane.prototype.getShowTabIndex = function(){
	for(var i=0;i<this.subTabs.length;i++){
		if(!this.subTabs[i].isHidden){
			return i;
		}
	}
	return -1;
}
TabPane.prototype.showTitleEnd = function(){
	var page = this.subTabs[this.subTabs.length-1];
	if(page){
		return !page.isHidden;
	}
	return true;
}
/**
 * 刷新标签的方法，用于新增或删除标签时的操作.
 */
TabPane.prototype.refreshTitles = function(){
	this.isTitleOut = false;
	var width = this.getWidth();
	var totalWidth = 0;
	var index = this.getShowTabIndex();
	for(var i=0;i<this.subTabs.length;i++){
		if(i<index){
			this.subTabs[i].hideTitle();
		}else{
			totalWidth += this.subTabs[i].getWidth();
			if(width - totalWidth <60){
				this.subTabs[i].hideTitle();
				this.isTitleOut = true;
			}else{
				this.subTabs[i].showTitle();
			}
		}
	}
	if(this.isTitleOut){
		if(!this.pilotInited){
			this.initPilot();
		}
		this.showPilot(this.pilotIndex);
		this.pilot.style.display = "";
	}else{
		if(this.pilot){
			this.pilot.style.display = "none";
		}
	}
}
TabPane.showNextTab = function(id){
	var group = $id(id);
	if(!group.showTitleEnd()){
		var index = group.getShowTabIndex() +1;
		group.showPilot(index);
	}
}
TabPane.showPrivousTab = function(id){
	var group = $id(id);
	var index = group.getShowTabIndex() -1;
	group.showPilot(index);
}
/**
 * 构造pilot的方法，该方法增加四张图片，并为图片增加事件.
 */
TabPane.prototype.initPilot = function(){
	this.pilot = $id(this.id + "_nav_pilot");
	var strHTML = '<table  border="0" cellspacing="0" cellpadding="0" style="width:40px;height:20px;overflow:hidden"><tr><td>';
	strHTML += '<div onclick="TabPane.showPrivousTab(\''+ this.id +'\')" onmouseover="this.className=\'button-privous-hover\'" onmouseout="this.className=\'button-privous\'" class="button-privous">&nbsp;</div>';
	strHTML += '</td><td>';
	strHTML += '<div onclick="TabPane.showNextTab(\''+ this.id +'\')" class="button-next" onmouseover="this.className=\'button-next-hover\'" onmouseout="this.className=\'button-next\'">&nbsp;</div>';
	strHTML += '</td></tr></table>';
	this.pilot.innerHTML = strHTML;
	this.pilot.style.display = "";
	this.pilotInited = true;
}
/**
 * 处理piot的action，以index开始显示标签.
 * 如果index<0则从头开始,如果大于最大值则显示最后的.
 * @param {Object} index
 */
TabPane.prototype.showPilot = function(index){
	var width = this.getWidth();
	var totalWidth = 0;
	for(var i=0;i<this.subTabs.length;i++){
		if(i<index){
			this.subTabs[i].hideTitle();
			this.isTitleOut = true;
		}else{
			totalWidth += this.subTabs[i].getWidth();
			if(width - totalWidth <60){
				this.subTabs[i].hideTitle();
				this.isTitleOut = true;
			}else{
				this.subTabs[i].showTitle();
			}
		}
	}
	//this.currTab.showTitle();
	this.pilotIndex = index;
}
/**
 * 添加一个标签的方法，该方法用了外层的CSS来实现,
 * css须定义如下:
 * .TAB_NAV_NOMAL{} 正常情况下的样式.
 * .TAB_NAV_NOMAL .LEFT 正常情况下的左单元格样式.一般是圆角.
 * .TAB_NAV_NOMAL .LEFT 正常情况下的中单元格样式.一般是背景.
 * .TAB_NAV_NOMAL .RIGHT 正常情况下的右单元格样式.一般是圆角.
 * .TAB_NAV_ACTIVE{} 激活状态的样式.
 * .TAB_NAV_ACTIVE .LEFT 激活状态的左单元格样式.一般是圆角.
 * .TAB_NAV_ACTIVE .LEFT 激活状态的中单元格样式.一般是背景.
 * .TAB_NAV_ACTIVE .RIGHT 激活状态的右单元格样式.一般是圆角.
 * @param {Object} tabpage
 */
TabPane.prototype.appendTitle = function(tabpage){
		var td = $create("td");
		var strHTML = '<table class="' + TAB_STYLE_TABLE  + '" border="0" cellspacing="0" cellpadding="0"><tr>';
		strHTML +='<td><div class="'+TAB_STYLE_LEFT+'"></div></td>';
		strHTML +='<td nowarp class="'+TAB_STYLE_MID+'">';
		strHTML +='<div style="white-space:nowrap;page-break-before: always;page-break-after: always;">';
		strHTML += tabpage.getTitle();
		strHTML +='</div></td>';
		if(tabpage.showCloseButton){
			strHTML +='<td nowarp class="'+TAB_STYLE_MID+'">';
			strHTML +='<a class="close" href="#" onclick="$o(\'' + this.id + '\').getTab(\'' + tabpage.id + '\').close();">';
			if(isIE){
				strHTML +='<div></div></a>';
			}else{
				strHTML +='<div class="close"></div></a>';
			}
			strHTML +='</td>';
		}
		if(tabpage.allowReload){
			strHTML +='<td nowarp class="'+TAB_STYLE_MID+'">';
			strHTML +='<a class="reload" href="#" onclick="$o(\'' + this.id + '\').getTab(\'' + tabpage.id + '\').reload();">';
			if(isIE){
				strHTML +='<div></div></a>';
			}else{
				strHTML +='<div class="reload"></div></a>';
			}
			strHTML +='</td>';
		}
		strHTML +='<td><div class="'+TAB_STYLE_RIGHT+'"></div></div>';
		strHTML +='</td></tr></table>';
		td.className = TAB_STYLE_NOMAL + this.styleSuffix;
		td.innerHTML = strHTML;
		tabpage.__titleTD = td;
		tabpage.setTitleTD();
		tabpage.initStatus();
		this.__titleTR.insertBefore(td,this._titleTD);
		tabpage.titleWidth = td.offsetWidth;
}
/**
 * 初始化TabPane的方法,主要是根据ID取到各个容器及得到maxTabs
 */
TabPane.prototype.init = function(){

	this.container = $id(this.id + "_container");
	this.titleContainer = $id(this.id + "_title_container");
	this.bodyContainer = $id(this.id + "_body");
	this.__titleTR = $id(this.id + "_nav_tr");
	this._titleTD = $create("td");
	this.__titleTR.style.width = "100%";
	this.__pilotContainer = $id(this.id + "_nav_pilot_container");
	if(this.titleAlign=="top"){
		this.styleSuffix = "";
		this._titleTD.className = "right-top";
		this._titleTD.style.overflow = "hidden";
	}else{
		this.styleSuffix = "-down";
		this.bodyContainer.className = "tab-body-down";
		this._titleTD.className = "right-buttom";
	}
	this.__titleTR.insertBefore(this._titleTD,this.__pilotContainer);
	this.buildTitles();
	this._titleTD.innerHTML = "&nbsp;";
	this._titleTD.style.width="100%";
	//this._titleTD.className = "right-top";
	this.selectTab(this.defaultTab);
}
/**
 * 关闭某一个tab的方法,传入的id可以是TabPage对象,
 * TabPage的索引或者id
 * @param {Object} id
 */
TabPane.prototype.closeTab = function(id){
	var tab;
	if(typeof(id)=="object"){
		tab = id;
	}else{
		tab = this.getTab(id);
	}
	if(tab instanceof TabPage){
		tab.close();
	}
}
/**
 * 选中某一个tab的方法,传入的id可以是TabPage对象,
 * TabPage的索引或者id
 * @param {Object} id
 */
TabPane.prototype.selectTab = function(id){
	var tab;
	if(typeof(id)=="object"){
		tab = id;
	}else{
		tab = this.getTab(id);
	}
	if(tab instanceof TabPage){
		this.activeTab(tab);
		if(this.isTitleOut){
			this.showPilot(this.pilotIndex);
		}
	}
}
/**
 * 获得某一个tab的方法,传入的id可以是TabPage对象,
 * TabPage的索引或者id
 * @param {Object} id
 */
TabPane.prototype.getTab = function(id){
	if(typeof(id)=="object"){
		if(id instanceof TabPage){
			return id;
		}
	}else 
	{
		for(var i=0;i<this.subTabs.length;i++){
			if(this.subTabs[i].id==id){
				return this.subTabs[i];
			}
			}
			if(!isNaN(id))
			{
			if(this.subTabs[id]){
				return this.subTabs[id];
			}
	     }
	}	
	return null;
}

/**
 * @private
 * 激活一个tab的方法，激活前会调用当前Tab的onUnSelect方法,
 * 如果该方法返回true则继续进行,返回false则停止执行.
 * @param {Object} tab
 */
TabPane.prototype.activeTab = function(tab){
	if(!tab.allowSelect){
		return false;
	}
	if(this.currTab){
		if(this.currTab == tab ){
			return false;
		}
		if(this.currTab.__onUnselect()){
			if(tab.show()){
				this.currTab.hide();
				this.currTab = tab;
				return true;
			}
		}
	}else{
		tab.show();
		this.currTab = tab;
		return true;
	}
	return false;
}
/**
 * 创建一个空白标签页.
 * @param {Object} id 标签页的id
 * @param {Object} title 标签页的标题.
 * @param {Object} type 标签页的类型，支持div和iframe
 * @param {Object} src 标签页的src,当类型为iframe时起作用.
 * @param {Object} closeButton 是否显示关闭按纽.
 * @param {Object} cache 是否用缓存.
 * @return 返回新创建的tabpage
 * @type TabPage
 */
TabPane.prototype.createBlankTab = function(id,title,type,src,closeButton,cache){
	id = id || this.id + Math.random();
	var oldTab = this.getTab(id);
	if(oldTab){
		alert("The TabPage of id:" + id + ",title:" + oldTab.getTitle() + " is exists!");
		return null;
	}
	var str = "";
	 str +="<table border='0' cellspacing='0' cellpadding='0' width='100%' height='100%'>";
	 str +="	<tr>";
	 str +="		<td id='" + id + "_container' valign='top'  style='display:none;width:100%;height:100%'>";
	 str +="		</td>";
	 str +="	</tr>";
	 str +="</table>";
	var table = $create(str);
	table.style.width = "100%";
	table.style.height = "100%";
	var firstEl = firstElement(this.bodyContainer);
	firstEl.appendChild(table);
	var tabpage = new TabPage(id);
	tabpage.type = type;
	tabpage.src = src;
	tabpage.title = title;
	tabpage.cache = cache;
	tabpage.showCloseButton = closeButton;
	tabpage.init();
	this.append(tabpage);
	if(this.inited){
		this.appendTitle(tabpage);
	}
	this.refreshTitles();
	return tabpage;
}
/**
 * 创建一个iframe类型的标签页.
 * @param {Object} title 标签页的标题.
 * @param {Object} url 标签页的iframe地址
 * @param {Object} cache 是否用缓存.
 * @param {Object} id 标签页的id
 * @return 返回新创建的tabpage
 * @type TabPage
 */
TabPane.prototype.createIframeTab = function(title,url,cache,id){
	return this.createBlankTab(id,title,"IFRAME",url,false,cache);
}
/**
 * 创建一个div类型的标签页.
 * @param {Object} title 标签页的标题.
 * @param {Object} htmlStr 标签页体中的html
 * @param {Object} id 标签页的id
 * @return 返回新创建的tabpage
 * @type TabPage
 */
TabPane.prototype.createDivTab = function(title,htmlStr,id){
	var tabpage = this.createBlankTab(id,title,"DIV",null,false,null);
	tabpage.container.innerHTML = htmlStr;
	return tabpage;
}
/**
 * TabPage的构造函数，声明变量及注册自己.
 * @param {Object} id
 */
function TabPage(id){
	this.id = id;
	PageControl.add(id,this);
	this.title = id;
	this.type = TABPANE_TYPE_DIV;
	this.src = null;
	this.container = null;
	this.iframe = null;
	this.onSelectFunc = null;
	this.onUnSelectFunc = null;
	this.onRefreshFunc = null;
	this.__titleTD = null;
	this.showCloseButton = true;
	this.status = TABPANE_STATUS_NOMAL;
	this.group = null;
	this.cache = false;
	this.allowSelect = true;
	this.params = [];
	this.containerTable = null;
	this.titleWidth = 80;
	this.isHidden = false;
	this.isLoad = false;
	this.allowReload = false;
}
/**
 * @private
 * 私有方法，专供TabPane调用.在切换激活状态时调用.
 */
TabPage.prototype.__onSelect = function(){
	if(this.onSelectFunc){
		try{
			return eval(this.onSelectFunc + "(this" + ")");
		}catch(e){
			$handle(e);
			return false;
		}
	}
	return true;
}
/**
 * @private
 * 私有方法，专供TabPane调用.在切换激活状态时调用.
 */
TabPage.prototype.__onUnselect = function(){
	if(this.onUnSelectFunc){
		try{
			var ret = eval(this.onUnSelectFunc + "(this" + ")");
			if(ret===false){
				return false;
			}else{
				this.container.style.display = "none";
				return true;
			}
		}catch(e){
			$handle(e);
			return false;
		}
	}
	return true;
}
TabPage.prototype.reload = function(){
	if(this.type==TABPANE_TYPE_IFRAME){
		//if(this.cache){
			if(this.isLoad){
				var url = this.getUrl();
				if(url.indexOf("?")>=0){
					url += "&_date=" + new Date();
				}else{
					url += "?_date=" + new Date();
				}
				this.iframe.src = url;
			}else{
				this.iframe.src = this.getUrl();
				this.isLoad = true;
			}
		//}
	}
}
TabPage.prototype.disabled = function(){
	if(this.status == TABPANE_STATUS_NOMAL){
		this.allowSelect = false;
		this.status = TABPANE_STATUS_DISABLED;
		this.__titleTD.className = TAB_STYLE_DISABLED + this.group.styleSuffix;
	}
}
TabPage.prototype.enabled = function(){
	if(this.status == TABPANE_STATUS_DISABLED){
		this.allowSelect = true;
		this.status = TABPANE_STATUS_NOMAL;
		this.__titleTD.className = TAB_STYLE_NOMAL + this.group.styleSuffix;
	}
}
TabPage.prototype.initStatus = function(){
	if(this.allowSelect){
		this.enabled();
	}else{
		this.disabled();
	}
}
/**
 * 初始化的方法，如果是iframe类型且有缓存，则新建一个私有的iframe
 * 否则使用公共的iframe，使用缓存会影响性能.
 */
TabPage.prototype.init = function(){
	this.container = $id(this.id + "_container");
	this.containerTable = getParentByTagName(this.container,"table");
	if(!isIE){
		this.containerTable.style.display = "none";
	}
	if(this.type==TABPANE_TYPE_IFRAME){
		if(this.cache){
			this.iframe = $create("<iframe name='" + this.id + "'/>");
			this.iframe.style.border = 0;
			this.iframe.frameBorder = 0;
			this.iframe.style.width = "100%";
			this.iframe.style.height = "100%";
			this.container.appendChild(this.iframe);
			//this.iframe.src = this.getUrl();
			this.isLoad = false;
		}
	}
}
/**
 * 载入数据的方法.
 * @param {Object} url
 */
TabPage.prototype.load = function(url){
	this.src = url;
	this.group.selectTab(this);
	if(this.type==TABPANE_TYPE_IFRAME){
		if(this.cache){
			this.iframe.src = this.getUrl();
		}else{
			this.group.noCacheIframe.src = this.getUrl();
		}
	}
}
/**
 * 获得标题的方法.返回当前标题.
 * @return 返回当前标题
 * @type String
 */
TabPage.prototype.getTitle = function(){
	if(this.onRefreshFunc){
		try{
			return eval(this.onRefreshFunc + "(this.title,this)");
		}catch(e){

		}
	}
	return this.title;
}
TabPage.prototype.onClose = function(){

}
/**
 * 关闭标签页的方法.关闭后将从TabPane中删除.
 * 关闭前先调用onClose函数.
 */
TabPage.prototype.close = function(){
	try{
		this.onClose();
	}catch(e){
		$handle(e);
		return false;
	}
	if(this.group.getLength()>1){
		this.group.remove(this);
		this.__titleTD.parentNode.removeChild(this.__titleTD);
		//this.container.parentNode.removeChild(this.container);
		this.container.id = "";
		this.container.style.display = "none";
		if(!isIE){
			this.containerTable.style.display = "none";
		}
		this.group.refreshTitles();
	}
}

TabPage.prototype.active = function(){
     var panel=this.getTabPane();
     panel.activeTab(this);
}
/**
 * 切换到正常状态的方法，隐藏自己的container,
 * 更改自己的标题样式.
 */
TabPage.prototype.hide = function(){
	this.container.style.display = "none";
	//修改了tabs测试的展示问题
		this.containerTable.style.display = "none";
	
	if(this.status!=TABPANE_STATUS_DISABLED){
		this.status = TABPANE_STATUS_NOMAL;
		this.__titleTD.className = TAB_STYLE_NOMAL + this.group.styleSuffix;
	}else{
		this.__titleTD.className = TAB_STYLE_DISABLED + this.group.styleSuffix;
	}
	this.setTitleTD();
}
/**
 * 切换到激活状态的方法，显示自己的container,
 * 更改自己的样式.
 */
TabPage.prototype.show = function(){
	var ret = this.__onSelect();
	if(ret===false){
		return false;
	}
	this.container.style.display = "";
 
		this.containerTable.style.display = "";
 
	if(this.type==TABPANE_TYPE_IFRAME){
		if(!this.cache){
			this.container.appendChild(this.group.noCacheIframe);
			this.group.noCacheIframe.src = this.getUrl();
		}else{
			if(!this.isLoad){
				this.reload();
				this.isLoad = true;
			}
		}
	}
	this.status = TABPANE_STATUS_ACTIVE;
	this.__titleTD.className = TAB_STYLE_ACTIVE + this.group.styleSuffix;
	this.setTitleTD();
	return true;
}
/**
 * 设置自己的标题的事件如果处于激活状态则无onmouseover和onmouseout事件,
 */
TabPage.prototype.setTitleTD = function(){
	var group = this.group;
	var td = this.__titleTD;
	var tab = this;
	td.onclick = function(){
        	var row =this.childNodes[0].rows[0];
			var div=row.cells[0].getElementsByTagName("div")[0];
			div.style.backgroundImage="";
            div=row.cells[row.cells.length-1].getElementsByTagName("div")[0];
			for(var i=1;i<row.cells.length-1;i++)row.cells[i].style.backgroundImage="";
			div.style.backgroundImage="";
		    group.selectTab(tab);
	}
	td.onmouseover = function(){
		if(tab.status==TABPANE_STATUS_NOMAL){
			//this.className = TAB_STYLE_OVER + group.styleSuffix;
			 
		    var row =this.childNodes[0].rows[0];
			var div=row.cells[0].getElementsByTagName("div")[0];
			var image=getCurrentStyle(div,"backgroundImage");
			div.style.backgroundImage=image.replace("tabs_nomal_left","tabs_hover_left");
            div=row.cells[row.cells.length-1].getElementsByTagName("div")[0]
			for(var i=1;i<row.cells.length-1;i++) row.cells[i].style.backgroundImage=image.replace("tabs_nomal_left","tabs_hover_center")
			div.style.backgroundImage=image.replace("tabs_nomal_left","tabs_hover_right");
			
		}
		eventManager.stopPropagation();
	}
	td.onmouseout = function(){
		if(tab.status==TABPANE_STATUS_NOMAL){
			//this.className = TAB_STYLE_NOMAL + group.styleSuffix;
			var row =this.childNodes[0].rows[0];
			var div=row.cells[0].getElementsByTagName("div")[0];
			div.style.backgroundImage="";
            div=row.cells[row.cells.length-1].getElementsByTagName("div")[0];
			for(var i=1;i<row.cells.length-1;i++)row.cells[i].style.backgroundImage="";
			div.style.backgroundImage="";
		}
		eventManager.stopPropagation();
	}
}
/**
 * 为TabPane添加参数的方法.
 * @param {Object} key
 * @param {Object} value
 */
TabPage.prototype.addParam = function(key,value){
	this.params.push({key:key,value:value});
}
/**
 * 得到URL的方法，加上所有参数.
 */
TabPage.prototype.getUrl = function(){
	if(this.src){
		var str = "";
		for(var i=0;i<this.params.length;i++){
			var param = this.params[i];
			str += "&" + param.key + "=" + encodeURI(param.value);
		}
		var url = this.src;
		if(url.indexOf("/")==0){
			if(url.indexOf(contextPath)!=0){
				url = contextPath + url;
			}
		}
		if(url.indexOf("?")<0){
			if(str.length>0){
				str = "?" + str;
			}
			str = str.replace("&","");
		}
		return url + str;
	}
	return null;
}
/**
 * 隐藏自己标题的方法，配合TabPane的pilot使用.
 */
TabPage.prototype.hideTitle = function(){
	this.isHidden = true;
	this.__titleTD.style.display = "none";
}
/**
 * 显示自己标题的方法，配合TabPane的pilot使用.
 */
TabPage.prototype.showTitle = function(){
	this.isHidden = false;
	this.__titleTD.style.display = "";
}
/**
 * 获得window对象的方法,获得标签页的window,
 * 如果用了iframe则返回iframe的window
 * 否则返回当前页window
 * @return 返回window对象.
 * @type Window
 */
TabPage.prototype.getWindow = function(){
	var win = window;
	if(this.type==TABPANE_TYPE_IFRAME){
		if(this.cache){
			win =  this.iframe.contentWindow;
		}else{
			win = this.group.noCacheIframe.contentWindow;
		}
	}
	return win;
}
/**
 * 获得document对象的方法,获得标签页的document,
 * 如果用了iframe则返回iframe的document
 * 否则返回当前页document
 * @return 返回document对象.
 * @type Document
 */
TabPage.prototype.getDocument = function(){
	var doc = document;
	if(this.type==TABPANE_TYPE_IFRAME){
		if(this.cache){
			doc =  this.iframe.document||this.iframe.contentDocument;
		}else{
			doc = this.group.noCacheIframe.document||this.group.noCacheIframe.contentDocument;
		}
	}
	return doc;
}
/**
 * 获得控件的group的方法.
 * @return 返回控件的group
 * @type TagGroup
 */
TabPage.prototype.getTabPane = function(){
	return this.group;
}

TabPage.prototype.getWidth = function(){
	if(this.titleWidth==0){
		if(this.title){
			return (getTextWidth(this.title) + 12);

		}else{
			return 80;
		}
	}
	return this.titleWidth;
}
function getTextWidth(text) {
   var ea = document.createElement("span");
   ea.innerHTML = text;
   document.body.appendChild(ea);
   var len = ea.offsetWidth;
   document.body.removeChild(ea);
   return len;
}