	var isAllChecked = false ;
	var returnValues = new Array() ;
	var nameArray = new Array() ;
	var idArray = new Array() ;
	var backParticipants = new Array() ;
 
	/**
	*
	*数据缓存池
	*/
	var dataCatchPool = [];
	
	function DataCatchMgr() 
	{	
		var dataCatch = {} ;
		
		this.createDataCatch = function (id,data) {
		
			if (isExist(id)) return ;
			
			dataCatch.id= id ;
			if (!data) {
				dataCatch.data = new Array() ;
			} else {
				dataCatch.data = data ;
			}
			
			dataCatchPool.push( dataCatch) ;
			return dataCatch ;
		}
		
		this.getDataCatch = function(id){
			
		 	if (!isExist(id)) {
		 		var dtCatch = this.createDataCatch (id);
		 		return dtCatch.data ;
		 	} else {
		 		for (var i=0;i<dataCatchPool.length;++i) {
					dcatch = dataCatchPool[i] ;
					if (dcatch.id == id)  {
						//var temp = dcatch.data[0] ;
						return dcatch.data ;
					}
				}
		 	}
		}
		
		this.setDataCatch = function (id,value) {
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
		
		this.clearDataCatch = function (id) {
			if (!isExist(id)) {
				throw new Error(bps_taglib_workflow_cache_id_not_exist.replace("{0}",id));
				return false;
			}
			for (var i=0;i<dataCatchPool.length;++i) {
					dcatch = dataCatchPool[i] ;
					if (dcatch.id == id)  {
						dataCatchPool.splice(i,1);
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
 
	/**隐藏值表单字段*/
	function FormElement (formName,output,hiddenName,hiddenType) 
	{
	  this.formName=(formName!=null)?formName:"";
	  this.output=(output!=null)?output:"";
	  this.hiddenName=(hiddenName!=null)?hiddenName:"";
	  this.hiddenType=(hiddenType!=null)?hiddenType:"";
	}

	/**选择参与者*/
	function selectParticipant (id,parameter,formElement,callback) 
	{
	
		if(id == 'null' || id=="") {	
			id= "selectparticipant";
		}
		openSelectParticipantWindow(parameter,formElement.formName,
						formElement.output,formElement.hiddenName,
						formElement.hiddenType,"selectParticipants.jsp",new DataCatchMgr().getDataCatch(id),callback,bps_taglib_workflow_tag_select_participant) ;
	}
	
	
	//Firefox不支持InnerText需要用textContent代替
	function ie_innerText_hack(span,value) {
		if(document.all){
			return span.innerText = value;
		}else{
			return span.textContent = value;
		}
	}
	
	/**选择代理人*/
	function selectAgentParticipant (id,parameter,formElement) 
	{
		if(id == 'null' || id=="") {
		 id= "selectagentparticipant";
		 }
		openSelectParticipantWindow(parameter,formElement.formName,
						formElement.output,formElement.hiddenName,
						formElement.hiddenType,"selectAgentParticipants.jsp",new DataCatchMgr().getDataCatch(id),null,bps_taglib_workflow_tag_select_agent) ;
	}
	
	/**选择活动参与者*/
	function selectActivityParticipant (id,parameter,formElement) 
	{
		if(id == 'null' || id=="") {
			id= "selectactivityparticipant";
		}
			openSelectParticipantWindow(parameter,formElement.formName,
						formElement.output,formElement.hiddenName,
						formElement.hiddenType,"selectActivityParticipants.jsp",new DataCatchMgr().getDataCatch(id),null,bps_taglib_workflow_tag_select_activity_participant) ;
						
	}
	
	/**选择流程和活动*/
	function selectProcessAndActivity (id,parameter,formElement) 
	{
		if(id == 'null' || id=="") {
			id= "selectprocessandactivity";
		}
		var title;
		if(getPra(parameter,'isShowActivity')=='false'){
			title = bps_taglib_workflow_tag_select_process;
		}else{
			title =bps_taglib_workflow_tag_select_process_activity;
		}
		 openSelectParticipantWindow(parameter,formElement.formName,
						formElement.output,formElement.hiddenName,
						formElement.hiddenType,"selectProcessAndActivity.jsp",new DataCatchMgr().getDataCatch(id),null,title) ;

	}
	
	/**选择业务目录*/
	function selectBizCataLog (id,parameter,formElement) 
	{
		if(id == 'null' || id=="") {
			id= "selectbizCataLog";
		}
		var title = bps_taglib_workflow_tag_select_catalog;
		 openSelectParticipantWindow(parameter,formElement.formName,
						formElement.output,formElement.hiddenName,
						formElement.hiddenType,"selectBizCataLog.jsp",new DataCatchMgr().getDataCatch(id),null,title) ;

	}
	
	/**设置参与者*/
	function setParticipant (parameter) 
	{
		showModalCenter(contextPath+"/workflow/wfcomponent/web/setParticipant.jsp?"+parameter,null,function(returnValue){
			if (returnValue == true) {
				this.location.reload() ;
			}
		},'430','380',bps_taglib_workflow_tag_set_participant) ;
	}
	
	/**指派活动*/
	function appointActivity (parameter) 
	{
		showModalCenter("com.primeton.eos.tag.appointNextAct.flow?"+parameter,null,null,'700','430',bps_taglib_workflow_tag_assign_activity);
	}
	
	function openSelectParticipantWindow (parameter,formName,output,hiddenName,hiddenType,URL,argument,callback,title) 
	{
		showModalCenter(contextPath+"/workflow/wfcomponent/web/"+URL+"?"+parameter,argument,function(returnValue){
			 
			if (argument.length > 0 && returnValue != null ) 
		 	{
				argument.splice(0,argument.length) ;
			}
			if (returnValue != null && returnValue.length >=0) 
			{
				for(var i=0;i<returnValue.length-1;++i) {
					argument.push(returnValue[i]);								
				}
				//将选择的参与者的名称显示在文本框中
				prepareSetOutPutValue(returnValue,output) ;
			  	//将选择的参与者的ID显示在隐藏域中
			 	prepareCreateHiddenElement(returnValue,formName,hiddenName,hiddenType) ;
			}
			if(callback) {
				if(typeof callback == 'function') {
					return callback(returnValue);
					
				} else {
					return callback(returnValue);
				}
			}
		},'430','380',title) ; 
		
	}
	
	function getSelectedparticipant (name) 
	{
		if(obj(name).value =="") 
			return "null";
		return obj(name).value ;
	}
	
	function prepareSetOutPutValue (retnValue,output) 
	{
		if(output == null || output == "") 
			return ;
		//FIXME: document.getElementById --> $id
		var outType = $e(output).type ;		
		var legth = retnValue.length -1 ;
		if (legth==0)
		{
			var outputObj = obj(output);
			if (outType == "text" || outType == "textarea" || outType == "hidden") { 
				outputObj.value = "" ;
			} else if (outType == "select-one" || outType == "select-multiple") {
				DelAllOption(output);
			} else {
				if(outputObj.tagName == "span") {
					//FIXME:修正firefox不支持innerText错误
					//obj(output).innerText = "";
					ie_innerText_hack(outputObj,'');
				}
			}
			return ;
		}
		
		var showText ="";
		var isFirst = true ;
		
		if (outType == "text" || outType == "textarea" || outType == "hidden") {
			for (var i= 0;i < legth; i++) 
			{
				participant = retnValue[i] ;
				if (isFirst) 
				{
					showText += participant.name ;
					isFirst = false ;
				} else 
					{
						showText += "," ;
						showText += participant.name  ;
					}
			}
			obj(output).value = showText; 
		} else if (outType == "select-one" || outType == "select-multiple") {
			DelAllOption(output);
			for (var i= 0;i < legth; i++) 
			{
				participant = retnValue[i] ;
				AddOptionItem(participant,obj(output),true);
			}
		} else {
			if(obj(output).tagName == "SPAN") {
				for (var i= 0;i < legth; i++) 
				{
					participant = retnValue[i] ;
					if (isFirst) 
					{
						showText += participant.name ;
						isFirst = false ;
					} else 
						{
							showText += "," ;
							showText += participant.name  ;
						}
				}
				//FIXME:修正firefox不支持innerText错误
				//obj(output).innerText= showText;
				ie_innerText_hack(obj(output),showText);
			}
		}
	}
	
	function prepareCreateHiddenElement (returnValue,formName,name,type) 
	{
		var temp = new Array() ;
		clearPrevenientHiddenElement(formName,name) ;
		var MAX_NUM = returnValue[returnValue.length-1] ;
		var legth = returnValue.length-1 ;
		if (type == "ID") {
				for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName, name, participant.id);
				}
				 
	    } else if (type == "PARTICIPANT" && MAX_NUM != 1) {
				for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName,name+"["+(i+1)+"]/id",participant.id);
						appendHiddenChild(formName,name+"["+(i+1)+"]/name",participant.name);
						appendHiddenChild(formName,name+"["+(i+1)+"]/typeCode",participant.type);
				} 
		 } else if (type == "PARTICIPANT" && MAX_NUM == 1) {
		    
				for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName,name+"/id",participant.id);
						appendHiddenChild(formName,name+"/name",participant.name);
						appendHiddenChild(formName,name+"/typeCode",participant.type);
				} 
		 } else if ((type == "PROCESS" || type == "ACTIVITY") && MAX_NUM !=1) {
			 	for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName,name+"["+(i+1)+"]/id",participant.id);
						appendHiddenChild(formName,name+"["+(i+1)+"]/type",participant.type);
				} 
		}  else if ((type == "PROCESS" || type == "ACTIVITY") && MAX_NUM == 1) {
			 	for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName,name+"/id",participant.id);
						appendHiddenChild(formName,name+"/type",participant.type);
				} 
		}  else if ((type == "BIZCATALOG") && MAX_NUM !=1) {
			 	for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName,name+"["+(i+1)+"]/id",participant.id);
						appendHiddenChild(formName,name+"["+(i+1)+"]/name",participant.name);
						appendHiddenChild(formName,name+"["+(i+1)+"]/type",participant.type);
				} 
		}  else if ((type == "BIZCATALOG") && MAX_NUM == 1) {
			 	for (var i= 0;i < legth; i++)
				{
						participant = returnValue[i] ;
						appendHiddenChild(formName,name+"/id",participant.id);
						appendHiddenChild(formName,name+"/name",participant.name);
						appendHiddenChild(formName,name+"/type",participant.type);
				} 
		}  
			
	}
	
	function clearPrevenientHiddenElement (formName,name) 
	{
		
		//FIXME: document.getElementById --> $name  -->document.forms[formName]
 		//var d = $name(formName);
 		
 		var childrens = document.forms[formName].getElementsByTagName("INPUT"); 		
 		for (var i=0; i<childrens.length; i++) 
 		{
 			if(childrens[i].nodeType == "1") 
 			{
				//所取元素要不为空，名字要是所取对象名，且是hidden类型
				if(childrens[i].name!= null && childrens[i].type == "hidden" &&
								(childrens[i].name==name||childrens[i].name.indexOf(name+"[")!=-1||childrens[i].name.indexOf(name+"/")!=-1))
	 			{
	 				//alert(document.forms[formName][childrens[i].name].value);
	 				//FIXME:修正选人控件传递参数的问题  parentElement -->parentNode
	 				//childrens[i].parentElement.removeChild(childrens[i]);
	 				childrens[i].parentNode.removeChild(childrens[i]);
	 				//alert(document.forms[formName][childrens[i].name].value);
	 				clearPrevenientHiddenElement(formName,name);
	 				
	 			} 
 			}
 		}
 
	}
	
	function appendHiddenChild (formName,name,value) 
	{
			//FIXME:解决ie firefox 中 createElement,  appendChild上的差别
			//IE
			//var o = document.forms[formName].appendChild(document.createElement("<INPUT TYPE='HIDDEN'>")) ;
			//FIREFOX
			//var o = document.forms[formName].appendChild(document.createElement("INPUT")) ;
			var o = document.createElement("INPUT");
			o.type='hidden';
			o.id= name;			
			o.name= name;
			o.value = value ;
			document.forms[formName].appendChild(o);
			//alert(document.forms[formName][o.name].value);
	}
	
	
	function AddOptionItem(participant, DestList,vlLabel)
	{
		var bFound;
		if(!(typeof DestList == 'object')) {
			//FIXME:
			//var List = document.all(DestList);--> $e		
			var List = $e(DestList);
		} else {
			var List = DestList ;
		}
		var ListLen;
		ListLen = List.options.length;
		bFound = false;
		if( ListLen > 0)
		{
 
			for(i = 0; i < ListLen; i++)
			{
			
			//FIXME:() --> []
				if( List.options[i].value == participant.id ||
				   List.options[i].value == participant.name)
				{
					bFound=true;
					break;
				}
			}
		}
		if(!bFound)
		{
			var oOption=document.createElement("OPTION");
			oOption.text=participant.name;
			oOption.title=participant.name;
			if(!vlLabel) {
				oOption.value=participant.id;
			} else {
				oOption.value=participant.id+"&"+participant.name+"&"+participant.type;
			}
			List.options.add(oOption);
			
			addArrayPropertys(participant) ;
		}
	}
	
	function DelOption(ListName)
	{
	
		//FIXME:
		//var List = document.all(ListName);  --> $e
		var List =  $e(ListName);
		var ListLen = List.options.length;
		var selectedLen = 0;
		
		for(i = ListLen - 1; i >= 0; i--)
		{
				//FIXME:() ---> []
			if( List.options[i].selected )
			{ 
				delArrayPropertys (List.options[i].value);
				List.remove(i);
				selectedLen ++ ;
			}
		}
		if ( ListLen!=0 && selectedLen == 0) 
			alert(bps_taglib_workflow_tag_select_del_item) ;
	}
	
	function DelAllOption (ListName) 
	{
		//FIXME:
		//var List = document.all(ListName);  --> $e
		var List =  $e(ListName);
		var ListLen = List.options.length;
		
		for(i = ListLen - 1; i >= 0; i--)
		{	
				//FIXME:()-->[]
				delArrayPropertys (List.options[i].value);
				List.remove(i);
		}
		
	}

	function addArrayPropertys (participant) 
	{
			returnValues.push(participant);
	}
	
	/**根据索引删除数组中的值*/
	function delArrayPropertys (id) 
	{
		n = lookupIndex(returnValues,id);
		returnValues = returnValues.slice(0,n).concat(returnValues.slice(n+1,returnValues.length));
	}
	
	function lookupIndex ( destArray,value ) 
	{
		if(isArrayAvailable(destArray)) 
		{
			 for(var i = 0 ;i<destArray.length;i++) 
			 {
			 	  participant = destArray[i] ;
					if ( participant.id == value) 
					{
							return i ;
					}
			 }
		}
		return -1 ;
	}
	
	/**检查数组是否为null或空*/
	function isArrayAvailable ( destArray ) 
	{
		if(destArray == null ) 
		{
				//alert(destArray+'不存在') ;
				return false ;
		}
		
		if (destArray.length == 0) 
		{
				//alert(destArray+'为空') ;
				return false ;
		}
		
		return true;
		
	}
	
	function closeWindowAndReturnValue (num) 
	{
			if (num!= "" && returnValues.length > num) {
				alert(bps_taglib_workflow_tag_over_max_count + num) ;
				return false ;
			} else {
			//	alert(returnValues.length) ;
				returnValues[returnValues.length] = num ;	
				window.returnValue = returnValues ;
				window.close();
			}
	}
	
	function closeWindowAndSubmitForm (num) {
		
		if(returnValues == null || returnValues.length == 0) 
		{
			return false ;	
			window.close();
		}

		if (num!= "" && returnValues.length > num) 
		{
			alert(bps_taglib_workflow_tag_over_max_count2+num) ;
			return false ;
		} else {
			
			window.returnValue = true ;
			window.close();
		}
		
	}
	
	function getSelectedParticipants () {
		if(returnValues == null || returnValues.length == 0) 
		{
			return null ;	
		} 
		return returnValues;
	}
	
	function closeWindowOnly () 
	{
		returnValue = null ;
		window.close() ;
	}
	
	function obj(id) 
	{
		//FIXME: document.getElementById --> $e
		//有些需要取id或者name，不定，修改为webui不对外提供的$e
		return $e(id);
	}
	
	/**通过模板方法实现方法调用前拦截，该方法返回值为:true、false
	*如需调用前拦截，实现该方法即可
	*/
	function beforeMethodInvoke(node,extend) {
		return true ;
	}
	
	function selectItem (node)  
	{
		if(!beforeMethodInvoke(node)) return ;
		
		var id = node.getProperty('id');
		var name = node.getProperty('name') ;
		var type = node.getProperty('typeCode');
		
		var participant = {
			 id:"",
			 name:"",
			 type:""
			};
		participant.id=id;
		participant.name=name;
		participant.type=type;
		AddOptionItem(participant,'selectedPar') ;
	}
	
	function selectBizCataLogItem (node)  
	{
		var id = node.getProperty('catalogUUID');
		var name = node.getProperty('catalogName') ;
		var type = 'BIZCATALOG';
		
		var participant = {
			 id:"",
			 name:"",
			 type:""
			};
		participant.id=id;
		participant.name=name;
		participant.type=type;
		AddOptionItem(participant,'selectedPar') ;
	}
	
	function selectProcessItem (node)  
	{
		if(!beforeMethodInvoke(node,'PROCESS')) return ;
		if (isSelectProcess == "false") return false ;
		var id = node.getProperty('processDefID');
		var name = node.getProperty('processChName') ;
		var type = 'PROCESS';
		
		var participant = {
			 id:"",
			 name:"",
			 type:""
			};
		participant.id=id;
		participant.name=name;
		participant.type=type;
		AddOptionItem(participant,'selectedPar') ;
	}
	
	function selectActivityItem (node) 
	{
		if(!beforeMethodInvoke(node,'ACTIVITY')) return ;
		
		if(isSelectActivity == "false") return false ;
		var id = node.getProperty('id');
		var name = node.getProperty('name') ;
		var procDefId = node.getProperty('processDefId');
		var type = 'ACTIVITY';
		
		var participant = {
		 id:"",
		 name:"",
		 type:""
		};
		participant.id=id+"$"+procDefId;
		participant.name=name;
		participant.type=type;
		
		AddOptionItem(participant,'selectedPar') ;
	}
	
	function init() {
		  var selectedParticipant = window['dialogArguments'];
		  if (selectedParticipant != null) 
		  {
		  	for (var i= 0;i < selectedParticipant.length; i++)
		  	{
		  		participant = selectedParticipant[i] ;
		  		initSelectItem (participant) ;
		  	}
		  }
	}
	
	function initSelectItem (participant) 
	{
		AddOptionItem(participant,'selectedPar') ;
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
		  	alert(bps_taglib_workflow_tag_no_usable_data);
		  	return false ;
		  }
		  
		  if (cv.length<1) {
		  	   alert(bps_taglib_workflow_tag_select_data_item);
		  	   return false ;
		  }
		  
		  return fids.toString() ;
	}	
	
	 /*
	  *获取url中的参数
	  */	 
	 function getPra(url, parameter){
                var reg, url, url2, iLen, iStart, iEnd;
                reg = new RegExp(parameter);
                if (url.search(reg) == -1) {
                    return " ";
                }
                else {
                    iLen = parameter.length;
                    iStart = url.search(reg) + iLen + 1;
                    url2 = url.substr(iStart);
                    iEnd = iStart + url2.search(/&/i);
                    if ((iStart - 1) == iEnd) {
                        return url.substr(iStart);
                    }
                    else {
                        return url.substr(iStart, iEnd - iStart);
                    }
                }
     }
	
	
	/**
	*
	*	Ajax调用完成后返回异常信息
	*	重载Ajax调用的onFailure,onSuccess方法
	*
	*/
	var ajaxIsSuccess = true;
	Ajax.prototype.onFailure=function() {
		ajaxIsSuccess = false;  
		var dom = this.getResponseXMLDom();
		var exceptionsNode = dom.selectSingleNode("root/exceptions");
		var exceptionNodes = exceptionsNode.selectNodes("exception");
		var alertCode = "";
		var alertMessage = "";
		for(var i=0;i<exceptionNodes.length;i++){
			var node = exceptionNodes[i];
			var codeNode = node.selectSingleNode("code");
			var messageNode = node.selectSingleNode("message");
			var code = getNodeValue(codeNode);
			var message = getNodeValue(messageNode);
			//判断是否工作流异常
			if(code != null && code.indexOf("21")==0){
				alertCode = code + "\n\n";
				alertMessage = message + "\n\n";
			}
		}
		//没有找到工作流的异常，则提示显示未知异常和异常信息
		if(alertCode == null || alertCode == '')
			alertMessage = bps_taglib_workflow_tag_undefine_exception_id
		if(alertMessage == null || alertMessage == "")
			alertMessage = alertMessage + bps_taglib_workflow_tag_undefine_exception_id_desc;
		
		alert(alertMessage);
	}
	
	Ajax.prototype.onSuccess=function() {	
	      ajaxIsSuccess = true;  
	}
	
	
	