<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>
<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<% 
	String procDefid  = request.getParameter("processDefID") != null ?
					(String)request.getParameter("processDefID") : null;
	String procInstid = request.getParameter("processInstID") != null ?
					(String)request.getParameter("processInstID") : null;
	String actDefid = request.getParameter("activityDefID") != null ?
					(String)request.getParameter("activityDefID") : null;
	String maxNum = request.getParameter("maxNum") != null ?
					(String)request.getParameter("maxNum") : null ;
	String selectTypes = request.getParameter("selectTypes") != null ?
					(String)request.getParameter("selectTypes") : "" ;
	String actParticipant = ResourcesMessageUtil.getI18nResourceMessage("select_activity_participants_jsp.actParticipant");
	
%>
<script>   
	function initParam () {
		return "<processDefId><%=procDefid%></processDefId><processInstId><%=procInstid%></processInstId><activityDefId><%=actDefid%></activityDefId>";
	}
	
	function initParam2(node) {
		var id = node.getProperty('id') ;
		var type = node.getProperty('typeCode');
		return "<type>"+type+"</type><id>"+id+"</id>"
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
	
	function refreshNode(node) {
	
		var type = node.getProperty('typeCode') ;
		//node.setLeaf();
		setNodeIcon(node,type);

	}
	
	function selectCurrentItem () {
		var curNode = tree.getSelectNode();
		if (curNode == null) {
			alert("<b:message key="select_activity_participants_jsp.selectAdd"/>");//请选择添加内容！
			return;
		}
		selectItem(curNode);
	}
	
</script> 
<body onload="init()"> 
 <table width="100%"> 
	<tr>  
		 <td width="175" valign="top"> 
		 	<nobr>
			 <r:rtree  hasRoot="true" id="tree">
				<r:treeRoot  display="<%=actParticipant %>" action="com.primeton.eos.tag.WFTagComponent.selectActParticipants.biz" 
				  childEntities="participants" initParamFunc="initParam"/><!-- 活动参与者 -->
				<r:treeNode  action="com.primeton.eos.tag.WFTagComponent.selectChilds.biz" onDblclickFunc="selectItem" 
					onRefreshFunc="refreshNode" showField="name" nodeType="participants" childEntities="participants" initParamFunc="initParam2"/>
			 </r:rtree>  
			 </nobr>
			
		</td>
		<td width="7%">&nbsp;</td>
		<td width="65">
			<table border="0" width="100%">
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" value="<b:message key="select_activity_participants_jsp.add"/>" class="button" onclick="selectCurrentItem()"></td></tr><!-- 添加 -->
				<tr><td align="center">&nbsp;</td></tr>
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" size="15" value="<b:message key="select_activity_participants_jsp.del"/>" onclick="DelOption('selectedPar')"></td></tr><!-- 删除 -->
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" size="15" value="<b:message key="select_activity_participants_jsp.allDel"/>" onclick="DelAllOption('selectedPar')"></td></tr><!-- 全部删除 -->
				</table>
		</td>
		<td width="175" align="center">
			<select name="selectedPar" multiple="multiple" size="11" style="width:175px"> </select>
		</td>
	</tr>
	<tr><td colspan="4">&nbsp;</td></tr>
	<tr>
		<td align="center" colspan="4">
			<input type="button" name="close" style="width: 60px;text-align: center;" value=" <b:message key="select_activity_participants_jsp.ok"/> " onclick="closeWindowAndReturnValue('<%=maxNum%>')"><!-- 确定 -->
			<input type="button" name="close" style="width: 60px;text-align: center;" value=" <b:message key="select_activity_participants_jsp.cancel"/> " onclick="closeWindowOnly()"><!-- 取消 -->
		</td>
	</tr>
</table>
</body>