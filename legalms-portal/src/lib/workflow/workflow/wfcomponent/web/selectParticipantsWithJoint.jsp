<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>

<%
	String root = request.getParameter("root") != null ? (String) request
			.getParameter("root")
			: null;
	String maxNum = request.getParameter("maxNum") != null ? (String) request
			.getParameter("maxNum")
			: null;
	String selectTypes = request.getParameter("selectTypes") != null ? (String) request
			.getParameter("selectTypes")
			: "";
%>
<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil" %>
<%
	String organization = ResourcesMessageUtil.getI18nResourceMessage("select_participants_with_joint_jsp.organization");
%>
<script>
		function initParType(){				
			selectParType('simple');
		}

		function initParam () {
			return "<root><%=root%></root>" ;
		}
		
		function initParam2(node) {
			var id = node.getProperty('id') ;
			var type = node.getProperty('typeCode') ;
			return "<type>"+type+"</type><id>"+id+"</id>";
		}
		
		function refreshNode(node) {
			var type = node.getProperty('typeCode') ;
			//node.setLeaf();
			setNodeIcon(node,type);

		}
	
		function beforeMethodInvoke(node) {
			types = "<%=selectTypes %>" ;
			if(types == "") return true ;			
			type = node.getProperty('typeCode') ;	
			isMathType = types.match(type) ;
			if (isMathType == null) 
				return false; 
			
			return true ;
		}
	
		function getElementViaId (id) {
			var element ;
			if (id.indexOf(".") > 1) {
				if (!document.all(id)) return false ;
				element = document.all(id);
			}else {
				//FIXME: document.getElementById --> $id
				if (!$id(id)) return false ;
				element = $id(id);
			}
			return element ; 
		}
	
	 
		function disabledTd(fdivs, disabled){
		    if (!fdivs) 
		        return;
		    var divs = fdivs.split(",");
		    for (var i = 0; i < divs.length; i++) {
		        var objColl = $id(divs[i]).getElementsByTagName('*');
		        //var  objColl   = document.getElementsByTagName('complexParType');
		        //alert(objColl.length);   
		        for (var i = 0; i < objColl.length ; i++) {
		            // alert(objColl[i].src);   
		            objColl[i].disabled = disabled;
		        }
		    }
		}
	 
		function selectParType(radioValue) {
			if(radioValue=='complex'){
				disabledTd('complexParType',false);
			}else if(radioValue=='simple'){
				disabledTd('complexParType',true);
			}
			//disableDivFields('complexParType',true);
		}
		
			
		function hidediv(poppedLayer) {
		  if (document.getElementById) //IE5, NS6
		        poppedLayer.style.display="none";// show/hide
		    else if (document.layers) //Netscape 4
		        document.layers[poppedLayer].display = 'none';
		    else //IE 4
		        document.all.hideShow.poppedLayer.display = 'none';
		}
		
		function showdiv(poppedLayer) {
		  if (document.getElementById)
		        poppedLayer.style.display="block";
		    else if (document.layers)
		        document.layers[poppedLayer].display = 'block';
		    else
		        document.all.hideShow.poppedLayer.display = 'block';
		} 
		
		function showDivInfo(pass) 
		{
		    var browserType;
			if (document.layers) {browserType = "nn4"}
			if (document.all) {browserType = "ie"}
			if (window.navigator.userAgent.toLowerCase().match("gecko")) {
			   browserType= "gecko"
			}    
		    var List = $e("proItem");
		    var ListLen;
		    ListLen = List.options.length;	    
		    var poppedLayer ;    
		    poppedLayer = $e(pass);
		    showdiv(poppedLayer);
		    for(i = 0; i < ListLen; i++)
		    {
		    	//FIXME:() --> []
		        if( List.options[i].value != pass)
		        {
		            poppedLayer = $id(List.options[i].value);
		            hidediv(poppedLayer);
		        }
		        
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
		}
		
		function  setInputTextValue(textName, textValue){		 
		 	var parInput = $id(textName);	
		 	if(parInput == null || !parInput ) return false ;
			//FIXME: parInput.innerText=textValue;	
			parInput.value=textValue;
		 	/*if(document.all){
				 parInput.innerText = textValue;
			}else{
				 parInput.textContent = textValue;
			}	
			*/	
			
		}
		
		function selectItem (node)  
		{
			if(!beforeMethodInvoke(node)) return ;
			var id = node.getProperty('id');
			var name = node.getProperty('name') ;
			var type = node.getProperty('typeCode');
	<%--		var participant = {
				 id:"",
				 name:"",
				 type:""
				};
			participant.id=id;
			participant.name=name;
			participant.type=type;--%>
			//alert(getSelectRadioValue('participantType'));
			var	selectedRadio = getSelectRadioValue('participantType');
			if(selectedRadio=='simple'){
				//AddOptionItem(participant,'selectedPar') ;			
				setInputTextValue('simple_ParticipantId',id);
				setInputTextValue('simple_ParticipantName',name);				
				setInputTextValue('simple_ParticipantType',type);				
			}else if(selectedRadio=='complex'){
				var selectedItemValue =getSelectedItemValue('proItem');
				//var destDiv =document.getElementById(selectedItemValue);			
				var targetInput = selectedItemValue+'_'+type+'_id';	
				setInputTextValue(targetInput,id);
				targetInput = selectedItemValue+'_'+type+'_name';	
				setInputTextValue(targetInput,name);
							
				<%--var parInput = document.getElementsByName(targetInput);				
				var  parInput_num  = parInput.length; 				
				for(i=0;i&lt;parInput_num;i++)   {   
					if(parInput[i].type == 'text'){			
						parInput[i].innerText=participant.id;
					}
				}--%>
			}
		}
		
	
		
		
			//选中的radio
		  function  getSelectRadioValue(radioName)
		  {   
			  //取得radio组的元素个数   
			  var radios =document.getElementsByName(radioName);
			  var   radio_num   =   radios.length;   
			  var   values;   
			  for(i=0;i<radio_num;i++)   {   
			  //如果第i个按钮被选中，则将它的值赋给values   
				  if(radios[i].checked)   {   
				  values=radios[i].value ;  
				  }   
			  }   
			  //提示是哪个按钮被选中   
			 return values;
  		}	
  		
  		// 选中的select
  		function getSelectedItemValue(selectId){
  			var objSelect= $e(selectId);
  			//var currSelectText = objSelect.options[objSelect.selectedIndex].text;   
  			var currSelectValue = objSelect.value; 
			return currSelectValue;	
  		}
  		   
  		   
  		function spliceJointType(jointTypePar){
  			//FIXME　document.getElementsByName--> $name
	  		var jointTypePars = $names(jointTypePar);
	  		var jointType='@';		
			for (var i = 0; i < jointTypePars.length ; i++) {
				
				if(jointTypePars[i] == null ||!jointTypePars[i].value ||jointTypePars[i].value ==''){
					alert('<b:message key="select_participants_with_joint_jsp.input"/>');//请您输入复杂参与者类型
					return false;
				}
					
				jointType=jointType+'{'+jointTypePars[i].value+'}';		
			}
  			return jointType;
  		}   
  		   
		function overrideCloseWindowAndReturnValue(){
			var	selectedRadio = getSelectRadioValue('participantType');
			if(selectedRadio=='simple'){
				var simple_ParticipantId= $id('simple_ParticipantId');
				var participant = {
					 id:"",
					 name:"",
					 type:""
					};
				participant.id=simple_ParticipantId.value;
				participant.name=simple_ParticipantName.value;
				participant.type=simple_ParticipantType.value;				
				AddOptionItem(participant,'selectedPar') ;
				
			}else if(selectedRadio=='complex'){
				//类型
				var selectedParType =getSelectedItemValue('proItem');
				//名称、ID
				var jointTypeParID = selectedParType+'_jointTypeParticipantId';
				var jointTypeParName = selectedParType+'_jointTypeParticipantName';
				var participant = {
					 id:"",
					 name:"",
					 type:""
					};
				participant.id=spliceJointType(jointTypeParID);
				if(participant.id == false) 
				{	
					return false;
				}
				participant.name=spliceJointType(jointTypeParName);
				if(participant.name == false) 
				{	
					return false;
				}
				participant.type=selectedParType;
				AddOptionItem(participant,'selectedPar') ;
			}
			closeWindowAndReturnValue('<%=maxNum%>');
		}
	
</script>
<body onload="init();initParType();"
	style="overflow: hidden;overflow-x:no;overflow-y:auto;">
<table class="workarea" height="100%" width="100%" cellpadding="0"
	cellspacing="0">
	<tr>
		<td valign="top" bgcolor="#FFFFFF" height="270px"
			style="border:1px #808080 solid">
		<div id="wins" style="height:100%;width:100%;overflow:auto;"><nobr>
		<r:rtree hasRoot="true" id="tree">
			<r:treeRoot display="<%=organization %>"
				action="com.primeton.eos.tag.WFTagComponent.selectParticipants.biz"
				initParamFunc="initParam" childEntities="participants"
				icon="/workflow/wfcomponent/web/images/participant/process_eos.gif" /><!-- 组织机构 -->
			<r:treeNode
				action="com.primeton.eos.tag.WFTagComponent.selectChilds.biz"
				showField="name" onDblclickFunc="selectItem"
				onRefreshFunc="refreshNode" initParamFunc="initParam2"
				nodeType="participants" childEntities="participants"
				icon="/workflow/wfcomponent/web/images/participant/role_view.gif" />
		</r:rtree> </nobr></div>
		</td>
		<%--	<td width="7%">&nbsp;</td>
		<td width="19%">
			<table border="0" width="100%">
				<tr><td align="center"><input type="button" class="button" size="15" value="&nbsp;&nbsp;<&nbsp;&nbsp; " onclick="DelOption('selectedPar')"></td></tr>
				<tr><td align="center"><input type="button" class="button" size="15" value=" &nbsp;<<&nbsp; " onclick="DelAllOption('selectedPar')"></td></tr>
			</table>
		</td>--%>
		<td align="right" valign="top" style="display:none"><select
			name="selectedPar" multiple="multiple" size="20">
		</select></td>
	</tr>
	<%--	<tr>
		<td colspan="1" rowspan="1">&nbsp;</td>
	</tr>--%>
	<tr>
		<td><input type="radio" id="simple" name="participantType"
			value="simple" onclick="selectParType(this.value)"
			onselect="selectParType(this.value)" checked="checked"> <label
			for="simple"><b:message key="select_participants_with_joint_jsp.simpleParticipants"/></label> <input type="radio" id="complex"
			name="participantType" value="complex"
			onselect="selectParType(this.value)"
			onclick="selectParType(this.value)"> <label for="complex"><b:message key="select_participants_with_joint_jsp.complexParticipants"/></label>
		</td><!-- 简单参与者 --><!-- 复杂参与者 -->
	</tr>
	<tr>
		<td valign="top" style="display:none"><input
			name='simple_ParticipantId' id="simple_ParticipantId" type="text"
			size="15"> <input name='simple_ParticipantName'
			id="simple_ParticipantName" type="text" size="15"> <input
			name='simple_ParticipantType' id="simple_ParticipantType" type="text"
			size="15"></td>
	</tr>
	<tr>
		<td id="complexParType"><!--围绕数据的Fieldset -->
		<fieldset><legend><b:message key="select_participants_with_joint_jsp.complexParticipantsType"/></legend><!-- 复杂参与者类型: -->
		<table>
			<tr valign="top">
				<td valign="top"><select id="proItem"
					onchange="showDivInfo(this.options[this.options.selectedIndex].value);"
					name="proItem">
					<l:present property="jointParticipantTypes">
						<l:iterate property="jointParticipantTypes" id="list">
							<option value='<b:write iterateId="list" property="code"/>'><b:write
								iterateId="list" property="displayName" /></option>
						</l:iterate>
					</l:present>
				</select></td>
				<td valign="top" align="center">
				<%
					int flag = 0;
					String display = "";
				%> <l:present property="jointTypeParticipant" scope="request">
					<l:iterate id="result" property="jointTypeParticipant"
						scope="request">
						<%
								if (flag == 0) {
								display = "";
							} else {
								display = "display:none";
							}
						%>
						<div id='<b:write iterateId="result" property="key" />'
							style="<%=display%>">
						<table>
							<l:iterate id="element" iterateId="result" property="value">
								<tr>
									<td><label><b:write iterateId="element"
										property="displayName" /></label>&nbsp;:</td>
									<td><input
										name='<b:write iterateId="result" property="key" />_jointTypeParticipantId'
										id='<b:write iterateId="result" property="key" />_<b:write iterateId="element" property="code" />_id'
										type="text" size="15"> <input
										name='<b:write iterateId="result" property="key" />_jointTypeParticipantName'
										id='<b:write iterateId="result" property="key" />_<b:write iterateId="element" property="code" />_name'
										type="hidden" size="15" value="s"></td>
								</tr>
							</l:iterate>
						</table>
						</div>
						<%
						flag++;
						%>
					</l:iterate>
				</l:present></td>
			</tr>
		</table>
		</fieldset>
		</td>
	</tr>
	<tr>
		<td align="center" valign="top" colspan="4"><input type="button"
			class="button" name="close" value=" <b:message key="select_participants_jsp.ok"/> "
			onclick="return overrideCloseWindowAndReturnValue();"> <!-- 确定 --><input
			type="button" class="button" name="close" value=" <b:message key="select_participants_jsp.cancel"/> "
			onclick="closeWindowOnly()"><!-- 取消 --></td>
	</tr>
</table>
</body>
