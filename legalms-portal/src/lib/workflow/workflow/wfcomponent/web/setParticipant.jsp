<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>

<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<% 
	String workItemId = request.getParameter("workItemId") != null ?
					 (String)request.getParameter("workItemId") : "" ;
	String activityDefId = request.getParameter("activityDefId") != null ?
					 (String)request.getParameter("activityDefId") : "" ;
	String processDefId = request.getParameter("processDefId") != null ?
					 (String)request.getParameter("processDefId") : "" ;
	String maxNum = request.getParameter("maxNum") != null ?
					 (String)request.getParameter("maxNum") : "" ;
	String participants = ResourcesMessageUtil.getI18nResourceMessage("appointed_list_jsp.participant");
	
%>
<script>   
	function submitForm(num) 
	{
		if (num!= "" && returnValues.length > num) 
		{
			alert("<b:message key="set_participants_jsp.maxParticipant"/>"+num) ;//选择的参与者最大数不能超过:
			return false ;
		}  else  {
		
			hs = new HideSubmit ("com.primeton.eos.tag.WFTagComponent.setParticipants.biz") ;
			
			hs.addParam("workItemId",'<%=workItemId%>') ;
			hs.addParam("activityDefId",'<%=activityDefId%>') ;
			
			var participants = getSelectedParticipants() ;
			for (var i=0;i<participants.length;i++) 
			{
				hs.addParam("participants["+i+"]/id",participants[i].id) ;
				hs.addParam("participants["+i+"]/name",participants[i].name) ;
				hs.addParam("participants["+i+"]/typeCode",participants[i].type) ;
			}
			
			hs.submit();
			
			window.returnValue = true ;
			window.close() ;
		
		}
	}
			
	function initParam () {
		return "<activityDefId><%=activityDefId%></activityDefId><processDefId><%=processDefId%></processDefId>";
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
</script> 
<body>
 <table width="100%"> 
	<tr>
		 <td width="34%" valign="top">
		 	<nobr>
			 <r:rtree  hasRoot="true" id="tree">
				<r:treeRoot  display="<%=participants %>" action="com.primeton.eos.tag.WFTagComponent.selectActParticipants.biz" 
				  initParamFunc="initParam" childEntities="participants"/><!-- 参与者 -->
				<r:treeNode onDblclickFunc="selectItem" action="com.primeton.eos.tag.WFTagComponent.selectChilds.biz" 
				onRefreshFunc="refreshNode" showField="name" initParamFunc="initParam2" nodeType="participants" childEntities="participants" icon="/workflow/wfcomponent/web/images/participant/role_view.gif,/workflow/wfcomponent/web/images/participant/role_view.gif"/>
			</r:rtree> 
			</nobr> 
			
		</td>
		<td width="7%">&nbsp;</td>
		<td width="19%">
			<table border="0" width="100%">
				<tr><td align="center"><input type="button" class="button" size="15" value=" <  " onclick="DelOption('selectedPar')"></td></tr>
				<tr><td align="center"><input type="button" class="button" size="15" value=" << " onclick="DelAllOption('selectedPar')"></td></tr>
				</table>
		</td>
		<td width="40%" align="center">
			<select name="selectedPar" multiple="multiple" size="20" style="width:220px"> </select>
		</td>
	</tr>
	<tr><td colspan="4">&nbsp;</td></tr>
	<tr>
		<td align="center" colspan="4">
			<input type="button" class="button" name="close" value=" <b:message key="select_activity_participants_jsp.ok"/> " onclick="submitForm('<%=maxNum%>')"><!-- 确定 -->
			<input type="button" class="button" name="close" value=" <b:message key="select_activity_participants_jsp.cancel"/> " onclick="closeWindowOnly()"><!-- 取消 -->
		</td>
	</tr>
</table>
</body>