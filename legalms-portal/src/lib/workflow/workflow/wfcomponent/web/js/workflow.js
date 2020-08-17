	function setNodeIcon(node,type){
		if(type=="emp"||type=="org"||type=="organization"||type=="person"||type=="position"||type=="position_list"||type=="role"||type=="role_view"){
			node.setIcon("/workflow/wfcomponent/web/images/participant/"+type+".gif");
		}else{
			node.setIcon("/workflow/wfcomponent/web/images/participant/default.gif");
		}
	}

	/**
	*
	*数据缓存池
	*/
	if (dataCatchPool == undefined) {
		var dataCatchPool = [];
	}
	
	function FastDataCatchMgr() 
	{	
		var dataCatch = {} ;
		
		this.create = function (id,data) {
		
			if (isExist(id)) return ;
			
			dataCatch.id= id ;
			if (!data) {
				dataCatch.data = null ;
			} else {
				dataCatch.data = data ;
			}
			dataCatchPool.push( dataCatch) ;
			
			return dataCatch ;
		}
		
		this.get = function(id){
		 	if (!isExist(id)) {
		 		return null ;
		 	} else {
		 		for (var i=0;i<dataCatchPool.length;++i) {
					dcatch = dataCatchPool[i] ;
					if (dcatch.id == id)  {
						return dcatch.data ;
					}
				}
		 	}
		}
		
		this.set = function (id,value) {
			if (!isExist(id)) {
				throw new Error(bps_taglib_workflow_cache_id_not_exist.replace("{0}",id));
				return false;
			}
			for (var i=0;i<dataCatchPool.length;++i) {
					dcatch = dataCatchPool[i] ;
					if (dcatch.id == id)  {
						dcatch.data = value;
						break ;
					}
			}
		}

	}
	
	function isExist (id) {
		var isExist = false ;
		for (var i=0;i<dataCatchPool.length;++i) {
			dcatch = dataCatchPool[i] ;
			if (dcatch.id == id)  {
				isExist = true ; 
				break ;
			}
		}
		return isExist ;
	}

	
	function isExist2 (id) {
		prcDataCatchPool = getGlobalCacheVarible() ;
		if (prcDataCatchPool == null) {
			return false;
		}	
		var isExist = false ;
		for (var i=0;i<prcDataCatchPool.length;++i) {
			
			dcatch = prcDataCatchPool[i] ;
			if (dcatch && dcatch.id == id)  {
				isExist = true ; 
				break ;
			}
		}
		return isExist ;
	}
	
	function getGlobalCacheVarible () {
		topObj = window.top ;
		var _opener = topObj.opener;
		if (!_opener) {
			var topDoc=topObj.document.getElementById('top');
			
			//obj = topDoc.contentWindow.prcDataCatchPool ;
			return topDoc.contentWindow.prcDataCatchPool ;
		} else {
			//
		}
	}
	
	function SpecCacheMgr () {
		
		
		this.create = function (id,data) {
			var dataCatch = {} ;
			
			if (isExist2(id)){     //存在也要修改data数据，应为存在不同的流程有相同的活动id
			    dataCatch.id = id;
			    dataCatch.data = data;
			    this.set(id,data);
			    return dataCatch;
			}
			
			dataCatch.id= id ;
			if (!data) {
				dataCatch.data = null ;
			} else {
				dataCatch.data = data ;
			}
			
			cache = getGlobalCacheVarible();
			if (cache == null) return null;
			cache.push(dataCatch);
			return dataCatch ;
		}
		
		this.get = function(id){
			prcDataCatchPool = getGlobalCacheVarible();
			if (prcDataCatchPool == null) {
				return null;
			}
		 	if (!isExist2(id)) {
		 		return null ;
		 	} else {
		 		for (var i=0;i<prcDataCatchPool.length;++i) {
					dcatch = prcDataCatchPool[i] ;
					if (dcatch.id == id)  {
						return dcatch.data ;
					}
				}
		 	}
		}
		
		this.set = function (id,value) {
			prcDataCatchPool = getGlobalCacheVarible();
			if (prcDataCatchPool == null) {
				return false;
			}
			if (!isExist2(id)) {
				throw new Error(bps_taglib_workflow_cache_id_not_exist.replace("{0}",id));
				return false;
			}
			for (var i=0;i<prcDataCatchPool.length;++i) {
					dcatch = prcDataCatchPool[i] ;
					if (dcatch.id == id)  {
						dcatch.data = value;
						break ;
					}
			}
		}
	}
	

function openWindow (page,path,width,Height,title,arg) 
{
		path= path == null ? "..":path;
		width= width == null ? "430px":width;
		Height= Height == null ? "500px":Height;
			
		argument = new Array() ;
		argument[0] = page;
		argument[1] = window;
		if(arg)
			argument[2]=arg ;
		
		showModalCenter(page,argument,function(returnValue){
			if (returnValue == "refresh") {
				parent.left.refreshNode();
			} else if (returnValue == "refreshParent") {
				parent.left.refreshParentNode();
			} else {
				return returnValue ;
			}
		},width,Height,title);
}

function sizeDialog()
{
	//FIXME:document.getElementById --> $id
	dialogHeight = (parseInt(document.getElementById('tLayout').offsetHeight) + 38) + "px";
} 

function refreshTree (pNode) {
	if (pNode.hasChild()) {
			pNode.reloadChild();
	} else {
		pNode = pNode.getParent();
		refreshTree(pNode);
	}
}


function openConfirmWindow (frm,act,path,msg,callback,title){
	if (frm == null)
		return false ;
	path= path == null ? "..":path;
	msg = msg == null ? "" :msg ;
	showModalCenter(path+"/workflow/wfmanager/common/confirm.jsp",msg,function(returnValue){
		if (act == null || act == "") {
				if(callback != null) 
					 callback() ;
				return false ;				
			}
			
		if (returnValue == "true") {
			document.forms[frm].action=act;
			//如果点击过树 则刷新树
			pauseFresh();
			submitForm(frm);
		} else {
			return false ;
		}
	},'300','250',title);
}

function  notification (frm,act,path,msg,callback,title){
	if (frm == null)
		return false ;
	path= path == null ? "..":path;
	msg = msg == null ? "" :msg ;
	showModalCenter(path+"/workflow/wfmanager/common/confirm.jsp",msg,function(returnValue){
		if (act == null || act == "") {
				if(callback != null) 
					 callback() ;
				return false ;				
			}
			
		if (returnValue == "true") {
			document.forms[frm].action=act;
			//如果点击过树 则刷新树
			pauseFresh();
			submitForm(frm);
		} else {
			return false ;
		}
	},'300','250',title);
}


function submitForm(form) {
	document.forms[form].submit() ;
}
	
function closeWindows () 
{
	top.close();	
}

function obj (id) {
	//FIXME:document.getElementById --> $id
	//有些需要取id或者name，不定，修改为webui不对外提供的$e
	return $e(id) ;
}

function getdiv (pass) {
	var browserType;
	if (document.layers) {browserType = "nn4"}
	if (document.all) {browserType = "ie"}
	if (window.navigator.userAgent.toLowerCase().match("gecko")) {
	   browserType= "gecko"
	}
	
	var poppedLayer ;
	
	if (browserType == "nn4") {
		poppedLayer = document.layers[pass];
	} else {	
		poppedLayer = document.getElementById(pass);
	}
	return poppedLayer ;
}

function hidediv(poppedLayer) {
  
  showOrHiddenInnerTabel(poppedLayer,"none") ;
  if (document.getElementById) {//IE5, NS6以上
  		 setOpacity(poppedLayer,0);
		 poppedLayer.style.display="none";// show/hide
		}
	else if (document.layers) { //Netscape 4 {
			setOpacity(poppedLayer,0);
			document.layers[poppedLayer].display = 'none';
		}
	else {//IE 4
			setOpacity(poppedLayer,0);
			document.all.hideShow.poppedLayer.display = 'none';
		}
}

function showdiv(poppedLayer) {
  
  showOrHiddenInnerTabel(poppedLayer,"block") ;
  if (document.getElementById) {
		setOpacity(poppedLayer,1);
		poppedLayer.style.display="block";
		}
	else if (document.layers) {
		setOpacity(poppedLayer,1);
		document.layers[poppedLayer].display = 'block';
		}
	else {
		setOpacity(poppedLayer,1);
		document.all.hideShow.poppedLayer.display = 'block';
		}
} 

function showOrHiddenInnerTabel(layyer,display) {
  innerTables = layyer.getElementsByTagName("table");
  if(innerTables.length == undefined)
  	return ;
  for(var i = 0;i <innerTables.length ;++i) {
  	innerTables[i].style.display=display ;
  }
}

var state = 'none';

function showhide(layer_ref) {

	if (state == 'block') {
		state = 'none';
	}
	else {
		state = 'block';
	}
	if (document.layers) { //IS NETSCAPE 4 or below
		document.layers[layer_ref].display = state;
		return ;
	} else 
	if (document.getElementById ) {
		if (layer_ref == "remaind")  {
			tbl = document.getElementById("tlTable");
			//tbl.style.paddingBottom = "0px";
		}
		hza = document.getElementById(layer_ref);
		hza.style.display = state;
		return ;
	} else 
	if (document.all) { //IS IE 4 or 5 (or 6 beta)
		eval("document.all." + layer_ref + ".style.display = state");
		return ;
	}
} 

function showDivInfo (list,pass) 
{
 
	var browserType;
	if (document.layers) {browserType = "nn4"}
	if (document.all) {browserType = "ie"}
	if (window.navigator.userAgent.toLowerCase().match("gecko")) {
	   browserType= "gecko"
	}
	
	
	//FIXME:
	//var List = document.all(list);	--> $e
	var List = $e(list);	
	var ListLen;
	ListLen = List.options.length;
	
	var poppedLayer ;
	
	if (browserType == "nn4") {
		poppedLayer = document.layers[pass];
	} else {	
		poppedLayer = document.getElementById(pass);
	}
	
	showdiv(poppedLayer);
	
	for(i = 0; i < ListLen; i++)
	{
	
		//FIXME:() -->[]
		if( List.options[i].value != pass)
		{
			if (browserType == "nn4") {
				poppedLayer = document.layers[List.options[i].value];
			} else {	
			//FIXME:document.getElementById --> $id
				poppedLayer = document.getElementById(List.options[i].value);
			}
			hidediv(poppedLayer);
		}
	}

  //var divs = document.getElementsByTagName('div');
	//for(i=0;i<divs.length;i++){
	//	if(divs[i].id.match(pass)){//如果找到匹配的div
		//	 showdiv(divs[i]);
	//	} else {
	//			hidediv(divs[i]) ;
	//	}
//	}
}

/**
*custom HTML request object
*/
Request = {
 getParameters : function(item){
  var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)","i"));
  return svalue ? svalue[1] : svalue;
 }
}

function checkAll(f) 
	{
		var length = document.forms[f].elements.length;
		
		if ( !isAllChecked ) {
			isAllChecked = true ;
		} else {
			isAllChecked = false ;
		}
		for (var i=0; i<length; i++){ 
			if (document.forms[f].elements[i].name.indexOf("sid") != -1){ 
				document.forms[f].elements[i].checked = isAllChecked; 
				all_setID(document.forms[f].elements[i]);
			}
		}
	}

	
	function all_setID(p)
	{
		var oldColor=p.style.backgroundColor;
		getTopNode(p).style.backgroundColor=p.checked?"#C0D1E4":oldColor;
		function getTopNode(pNode){
			if(pNode.tagName=="TR"){
				return pNode;
			}else{
				return getTopNode(pNode.parentNode);
			}
		}
	}
	
	function getSid (f) 
	{
		var length = document.forms[f].elements.length;
		var num=0;
		var anum=0;
		var cv = new Array();	
		var fids ;
		for (var i=0; i<length; i++){ 
				if ( document.forms[f].elements[i].name == 'sid' && document.forms[f].elements[i].type == 'checkbox') {
							num++;
							if(document.forms[f].elements[i].checked != false) {
								cv[anum] = document.forms[f].elements[i].value;
								anum++;
						  }
			   }
		 }
		  fids = cv;
		  if (num == 0) {
		  	alert(bps_taglib_workflow_no_usable_data);
		  	return false ;
		  }
		  
		  if (cv.length<1) {
		  	   alert(bps_taglib_workflow_select_data_item);
		  	   return false ;
		  }
		  
		  return fids.toString() ;
	}

function deselect (f,ele) {
	var checked = false ;
	//FIXME:document.getElementById --> $id
	var frm = document.getElementById(f) ;
	if (ele.checked == true) {
			checked = false;
	}
	
	for (var i= 0; i<frm.elements.length;i++) {
		if (frm.elements[i].name == ele.name && frm.elements[i].type == 'checkbox' &&
			frm.elements[i] != ele)	
			frm.elements[i].checked = checked ;
	}
	
}

function CreateOptionItems (DestList,value,label)
{
	
	if(!(typeof DestList == 'object')) {
		var List = document.all(DestList);
	} else {
		var List = DestList ;
	}

	var oOption=document.createElement("OPTION");
	oOption.text = label;
	oOption.value= value;
	List.options.add(oOption);

}

function getStringLength(varField) {
	var totalCount = 0;
	for (i = 0; i< varField.length; i++) {
		if (varField.charCodeAt(i) > 127) 
			totalCount += 2;
		else
			totalCount++ ;
	}
	return totalCount;
}

function getRealLength(s){
			var i,j,s1;
			j=0;
			s1=escape(s);
			i=s1.indexOf("%u");
			while(i>=0)
			{
					j=j+2;
					i=s1.indexOf("%u",i+1);
			}
			return s.length+j;
}
/*
阿汤知识点
*/
function wordbreak(o,inputStr)
{
	var oldStr=inputStr //获得div中的内容
	var width=o.offsetWidth //获得div设定的宽度
	o.style.overflowX="auto"; //设置div的overflowX属性为auto,当div中的内容宽度超出div设定的宽度时,会出现自动出现滚动条.
	o.innerHTML=""; //先清空div中内容
	for(var i=0;i<oldStr.length;i++)
	 {
	  var str=o.innerHTML;
	  s=oldStr.charAt(i);
	  o.innerHTML=str+s;
	      //把原来div中内容一个字符一个符的往div中增加
	  if(o.scrollWidth>width) o.innerHTML=str+"<br/>"+s;
	     //判断是否出现了滚动条,如果出现流动条,增加内容之前先加上"<br/>"强制换行. 
	     //这里判断是否出现滚动条是根据div的滚动条宽度(scrollWidth属性)和div的宽度做比较,
	     //没有滚动条的情况下两者是相等的.
	  }
}

function getElementsByNameEx(searchName) {
	 var classElements = new Array();             
	 var els = document.getElementsByTagName("*");
	 var elsLen = els.length;
	 for (i = 0, j = 0; i < elsLen; i++) {
	      if ( els[i].name && els[i].name.indexOf(searchName)>=0 ) {
	         classElements[j] = els[i];
	         j++;
	      }
	 }
	 return classElements;
}

//textarea字数限制问题
function textCounter(field, maxlimit){

    var counter = 0;
    var i;
    var chckcode;
    chckcode = field.value.length;
    chckcode = chckcode - 1;
    for (i = 0; i < field.value.length; i++) {
        if (field.value.charCodeAt(i) > 127 || field.value.charCodeAt(i) == 94) {
            counter++;
            if (counter > maxlimit) 
                break;
        }
        else {
            counter++;
            if (counter > maxlimit) 
                break;
        }
    }
    
    if (counter > maxlimit) 
        field.value = field.value.substring(0, i);
    
}

//判断是否满足BPS名称类校验规则
//只包含字母、数字、中文、下划线、英文符号【-()[]{}.:】、中文符号【，。：‘’“”】
function isBPSNameFormat(str){
	//var reg4str = /^[\u4E00-\u9FA5\w]*$/;//中文和包括下划线的任何单词字符
    //var reg4symbol = /^[-:\.\(\)\[\]\{\}]*$/; //包含的英文符号-:.()[]{}/
    //var reg4symbol_cn = /^[\uff0c\u3002\uff1a\u2018\u2019\u201c\u201d]*$/; //包含的中文符号，。：‘’“”;
    var reg = /^[\u4E00-\u9FA5\w-:\.\(\)\[\]\{\}\uff0c\u3002\uff1a\u2018\u2019\u201c\u201d\u00D7]*$/;
    if(reg.test(str)){
    	return true;
    }else{
    	return false;
    }
}

//使用在eos校验标签内，在validateAttr="type=bpscommname"
function f_check_bpscommname(obj){
	var str = obj.value;
	if(isBPSNameFormat(str)){
		return true;
	}else{
		f_alert(obj,bps_taglib_workflow_check_bpscommname);
        return false;
	}
}

//判断是否满足BPS实现类校验规则
//只包含字母、数字、中文、下划线、英文符号【-()[]{}.:/<>$】、中文符号【，。：‘’“”】
function isBPSImplFormat(str){
    var reg = /^[\u4E00-\u9FA5\w-:\.\(\)\[\]\{\}\/\<\>\$\uff0c\u3002\uff1a\u2018\u2019\u201c\u201d]*$/;
    if(reg.test(str)){
    	return true;
    }else{
    	return false;
    }
}

//使用在eos校验标签内，在validateAttr="type=bpscommimpl"
function f_check_bpscommimpl(obj){
	var str = obj.value;
	if(isBPSImplFormat(str)){
		return true;
	}else{
		f_alert(obj,bps_taglib_workflow_check_bpscommimpl);
        return false;
	}
}

//判断是否满足BPS XPATH校验规则
//只包含字母、数字、中文、下划线、英文符号【-()[]{}.:/】、中文符号【，。：‘’“”】
function isBPSXpathFormat(str){
    var reg = /^[\u4E00-\u9FA5\w-:\.\(\)\[\]\{\}\/\uff0c\u3002\uff1a\u2018\u2019\u201c\u201d]*$/;
    if(reg.test(str)){
    	return true;
    }else{
    	return false;
    }
}

//使用在eos校验标签内，在validateAttr="type=bpscommxpath"
function f_check_bpscommxpath(obj){
	var str = obj.value;
	if(isBPSXpathFormat(str)){
		return true;
	}else{
		f_alert(obj,bps_taglib_workflow_check_bpscommxpath);
        return false;
	}
}

//是否包含特殊符号【<>】
function isXMLFormat(str){
    var reg = /^[^\<\>]*$/;
    if(reg.test(str)){
    	return true;
    }else{
    	return false;
    }
}

//使用在eos校验标签内，在validateAttr="type=bpscommxml"
function f_check_bpscommxml(obj){
	var str = obj.value;
	if(isXMLFormat(str)){
		return true;
	}else{
		f_alert(obj,bps_taglib_workflow_check_bpscommxml);
        return false;
	}
}

//判断是否颜色校验规则
//请检查一下颜色值，是否是#+六位十六进制数，比如：#A52A2A
function isBPSLinkColorFormat(str){
    var reg = /^#[0-9a-fA-F]{6}$/;
    if(reg.test(str)){
    	return true;
    }else{
    	return false;
    }
}

//使用在eos校验标签内，在validateAttr="type=bpslinkcolor"
function f_check_bpslinkcolor(obj){
	var str = obj.value;
	if(isBPSLinkColorFormat(str)){
		return true;
	}else{
		f_alert(obj,bps_taglib_workflow_check_bpslinkcolor);
        return false;
	}
}

/**
 * @private 模拟模态对话框的函数.（屏蔽了拖拽改变窗口大小功能）
 * @param {Object} strUrl
 * @param {Object} dialogArguments
 * @param {Object} callBack
 * @param {Object} winWidth
 * @param {Object} winHeight
 * @param {Object} winLeft
 * @param {Object} winTop
 * @param {Object} title 弹出窗口的title.
 */
function __showModal(modalId, strUrl,modalArguments, winWidth, winHeight, winLeft,winTop,title){
	var container = $create("div",modalArguments.win.document);
		container.id = modalId + "__model_dialog_container";
		container.className='eos-popwin';
		//container.style.width='100px';
		container.onfocus=function(){container.blur()};
var iframeStr = "";
if(isIE){
 //iframeStr = '<iframe src="'+blankURL+'" style=\"z-index:-1;filter:Alpha(Opacity=0);position:absolute;width:expression(this.nextSibling.offsetWidth);height:expression(this.nextSibling.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>';
}

var isIE6=navigator.userAgent.toLowerCase().indexOf("msie 6")!=-1;
var style="";
if(isIE6) style='style="filter:alpha(opacity=50)"';
var str= [  
	iframeStr,
	'<div style="width:100%;height:100%">',
	'<div id="'+ modalId +'__model_dialog_mask" class="eos-div-mask" style="position:absolute;top:0px;left:0px;display:none;"></div>',
	'<TABLE  cellspacing="0" cellpadding="0" width="100%" height="100%" class="eos-dialog"><TR><TD ',style,' class="left-top-conner"><div class="ieBlank"></div></TD><TD  ',style,' class="top"></TD><TD  ',style,' class="right-top-conner"><div class="ieBlank"></div></TD></TR><TR><TD  ',style,' class="left"><div class="ieBlank"></div></TD><TD style="background-color: #eaf0f2;">',
	
	'<div style="width:100%;cursor:move" id="'+ modalId +'__model_dialog_head" class="eos-popwin-head" ><a id="'+ modalId +'__model_dialog_focus" href="#f"></a>',
		'<div class="eos-popwin-head-icon">&#160;</div>',
		'<div class="eos-popwin-head-title">'+ (title || ' Dialog Window') +'</div>',
		'<div id="popupControls" class="eos-popwin-head-button"  >',
			'<a href="javascript:void(0);" id="'+modalId+'__model_dialog_closebutton" onmousedown="window.returnValue=undefined;hideModelDialog(\''+modalId+'\',true)">&#160;</a>',
		'</div>',
	'</div>',
	'<div id="'+modalId+'__model_dialog_body" class="eos-popwin-body">',
	'</div>',
	'</TD><TD  ',style,' class="right" id="',modalId,'_right"><div class="ieBlank"></div></TD></TR><TR><TD  ',style,' class="left-bottom-conner"></TD><TD  ',style,' class="bottom" id="',modalId,'_bottom"></TD><TD  ',style,' class="right-bottom-conner" id="',modalId,'_rightBottom"></TD></TR></TABLE>',
	'</div>'
	].join('');


var iframe=[
	'<iframe src="',blankURL,'" type="_eos_modal_dialog" eosid="'+modalId+'" name="'+modalId+'__model_dialog_frame" id="'+modalId+'__model_dialog_frame" scrolling="auto" ',
	'  HSPACE ="0" VSPACE="0" MARGINHEIGHT="0" MARGINWIDTH="0" ',
	' class="eos-popwin-body-iframe"  border ="0"   ',
	'frameborder="0" allowtransparency="true" ></iframe>'
].join('\n');

	var maxIndex = getMaxZindex(modalArguments.win.document);
	container.style.width = winWidth + "px";
	container.style.height = winHeight + "px";//winHeight;
	container.style.left = winLeft + "px";
	container.style.top =  winTop + "px";
	container.style.overflow = "hidden";

	container.innerHTML = str;

	modalArguments.win.document.body.appendChild(container);
	
	var maxZindex = getMaxZindex(modalArguments.win.document||document);
	maxZindex++;
	container.tabIndex = maxZindex;
	container.onmousedown = function(){
		try{
			this.focus();
		}catch(e){
		}
		eventManager.stopEvent();
	}
	container.onkeypress = function(){
		eventManager.stopEvent();
	}
	container.onkeydown = function(evt){
		var code = (eventManager.getEvent(modalArguments.win)||evt).keyCode;
		if(code==27){
			eventManager.stopEvent();
			window.returnValue=undefined;
			hideModelDialog(modalId);
		}
	}
	var mask = $id(modalId+"__model_dialog_mask",modalArguments.win.document);
	mask.style.width = winWidth + "px";
	mask.style.height = winHeight + "px";//winHeight;
	modalArguments.maskDiv = mask;
	mask.style.zIndex = maxIndex + 2;
	container.style.zIndex = maxIndex + 1;
	var wbody=$id(modalId+"__model_dialog_body",modalArguments.win.document);
    var frameParentWidth=wbody.offsetWidth;
	wbody.style.height = (winHeight-27)>0?(winHeight-27-7):0 + "px";
	wbody.innerHTML=iframe;
	var frame = $id(modalId+"__model_dialog_frame",modalArguments.win.document);
	if (frame) {
		frame.src = strUrl;
		frame.style.height = (winHeight-28)>0?(winHeight-28-7):0 + "px";//winHeight;
		//frame.style.width = "100%";
		
		frame.style.width = frameParentWidth;
		frame.style.zIndex =  maxIndex + 1;
	}
	var head = $id(modalId+"__model_dialog_head",modalArguments.win.document);
	head.onmousedown = function(){
		try{
			container.focus();
		}catch(e){
		}
		eventManager.stopEvent();
	}
	var ddDiv = $create("div",modalArguments.win.document);
	ddDiv.style.position = "absolute";
	ddDiv.style.width = winWidth + "px";
	ddDiv.style.height = winHeight + "px";//winHeight;
	ddDiv.style.left = winLeft + "px";
	ddDiv.style.top =  (winTop) + "px";
	ddDiv.style.cursor = "move";
	ddDiv.onmousedown = function(){
		eventManager.stopEvent();
	}
	ddDiv.style.zIndex = maxIndex;
	modalArguments.win.document.body.appendChild(ddDiv);
	var ddFunc = modalArguments.win.fx_DD||fx_DD;
	if(ddFunc){
		ddFunc(ddDiv,{handle:head,limit:{x:[0,modalArguments.win.offsetWidth],y:[0,modalArguments.win.offsetHeight]},
			onStart:function(){
				ddDiv.style.height = container.style.height;
				ddDiv.style.zIndex = (ddDiv.style.zIndex*1) + 2;
				modalArguments.win.document.body.onselectstart = function(){
					return false;
				}

			},
			onDrag:function(){
				ddDiv.style.border = "1px dotted #000093";
				container.style.display = "none";
			},
			onComplete:function(){
				this.isdraging = false;
				ddDiv.style.height = "24px";
				container.style.left = ddDiv.style.left;
				container.style.top =  ddDiv.style.top;
				ddDiv.style.zIndex = ddDiv.style.zIndex - 2;
				ddDiv.style.border = "";
				container.style.display = "";
				modalArguments.win.document.body.onselectstart = null;
			}
		});
	}
	modalArguments.iframe = frame;
	modalArguments.container = container;
	modalArguments.ddDiv = ddDiv;
	container.style.display = "none";

	var f=$id( modalId +'__model_dialog_focus',modalArguments.win.document);
	var dragRightDiv=$id( modalId +'_right',modalArguments.win.document);
	var dragBottomDiv=$id( modalId +'_bottom',modalArguments.win.document);
	var dragRightBottomDiv=$id( modalId +'rightBottom',modalArguments.win.document);

	ddFunc(container,{
		handle : dragBottomDiv,
		modifiers :false
		/*
		onDrag: function(){
                    var posY=this.mouse.start["y"];
                    var nowPosY=this.mouse.now["y"];
		  		   	if(nowPosY-posY+this.value.now["y"]>=27)
				   	    this.element.style.height=nowPosY-posY+this.value.now["y"];  
					resizeModelDialog(modalId,parseInt(container.style.width),parseInt(container.style.height));
			modalArguments.iframe.style.display = "none";
		},
		onComplete: function(){
			modalArguments.iframe.style.display = "";
		},
		onStart:function(){
		    this.value.now["y"]=this.element.getStyle("height").toInt();
			modalArguments.iframe.style.display = "none";
		}*/
	});

	ddFunc(container,{
		handle : dragRightDiv,
		modifiers :false
		/*
		onDrag: function(){
			        var posX=this.mouse.start["x"];
                    var nowPosX=this.mouse.now["x"];
		  		   	if(nowPosX-posX+this.value.now["x"]>=150)
				   	    this.element.style.width=nowPosX-posX+this.value.now["x"];  
				   	    
			resizeModelDialog(modalId,parseInt(container.style.width),parseInt(container.style.height));
			modalArguments.iframe.style.display = "none";
		},
		onComplete: function(){
			modalArguments.iframe.style.display = "";
		},
		onStart:function(){
		    this.value.now["x"]=this.element.getStyle("width").toInt();
			modalArguments.iframe.style.display = "none";
		}*/
	});
	ddFunc(container,{handle:dragRightBottomDiv,
	        modifiers :false
	        /*
			onStart:function(){
			this.value.now["x"]=this.element.getStyle("width").toInt();
	        this.value.now["y"]=this.element.getStyle("height").toInt();
			modalArguments.iframe.style.display = "none";
			},
			onDrag:function(){
			
	          var posY=this.mouse.start["y"];
              var nowPosY=this.mouse.now["y"];
		  	  if(nowPosY-posY+this.value.now["y"]>=27)
			   	    container.style.height=nowPosY-posY+this.value.now["y"]; 
			  var posX=this.mouse.start["x"];
              var nowPosX=this.mouse.now["x"];
		  	  if(nowPosX-posX+this.value.now["x"]>=150)
				   	    container.style.width=nowPosX-posX+this.value.now["x"];  
			resizeModelDialog(modalId,parseInt(container.style.width),parseInt(container.style.height));
			modalArguments.iframe.style.display = "none";
			},
			onComplete:function(){
             modalArguments.iframe.style.display = "";
			}*/
		});
			fx_fadeIn(container,function(){
        //container.style.display="";
	},550);

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

function GoOn(ind) {
	var obj=window.eventList[ind];
	window.eventList[ind]=null;
	if (obj.NextStep) obj.NextStep();
	else obj();
}
	
function Pause(obj,iMinSecond){
	if (window.eventList==null) window.eventList=new Array();
	var ind=-1;
	for (var i=0;i<window.eventList.length;i++){
		if (window.eventList[i]==null) {
			window.eventList[i]=obj;
			ind=i;
			break;
		}
	}
	 
	if (ind==-1){ 
		ind=window.eventList.length; 
		window.eventList[ind]=obj; 
	}
	setTimeout("GoOn(" + ind + ")",1000); 
}