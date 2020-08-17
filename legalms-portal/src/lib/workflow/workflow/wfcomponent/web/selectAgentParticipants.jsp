<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>
<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<% 
	String agentFrom = request.getParameter("agentFrom") != null ?
					 (String)request.getParameter("agentFrom") : "" ;
	String flatToLeaf = request.getParameter("flatToLeaf") != null ?
					 (String)request.getParameter("flatToLeaf") :  "false" ;
	String maxNum = request.getParameter("maxNum") != null ?
					 (String)request.getParameter("maxNum") : null ;
	String selectTypes = request.getParameter("selectTypes") != null ?
					 (String)request.getParameter("selectTypes") : "" ;		
	String agent = ResourcesMessageUtil.getI18nResourceMessage("select_agent_participants_jsp.agent"); 
%>
<script>
	function initParam () {
		return "<agentFrom><%=agentFrom%></agentFrom><flatToLeaf><%=flatToLeaf%></flatToLeaf>" ;
	}
	
	function initParam2(node) {
		var id = node.getProperty('id') ;
		var type = node.getProperty('typeCode') ;
		return "<type>"+type+"</type><id>"+id+"</id>";
	}
	
	function beforeMethodInvoke(node) {
		types = "<%=selectTypes %>" ;
		if(types == "") return true ;
		
		type = node.getProperty('typeCode') ;
		
		alert(type) ;
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
		
		if (curNode == null||curNode.isroot) {
			alert("<b:message key="select_agent_participants_jsp.selectAdd"/>");//请选择添加内容！
			return;
		}
		if(curNode&&curNode.entity&&curNode.entity.name=="root"){
			return;
		}
		selectItem(curNode);
	}
</script>

<body onload="init()">
 <table width="100%"> 
	<tr>
		 <td height="261" valign="top"  style="border:1px solid #CCCCCC;" bgcolor="#FFFFFF" width="190">
		 <div id="wins"  style="height:100%;width:100%;overflow:auto;"> 
		  <nobr>
			 <r:rtree  hasRoot="true" id="tree">
				<r:treeRoot  display="<%=agent %>" action="com.primeton.eos.tag.WFTagComponent.selectAgentParticipants.biz" 
				   childEntities="participants" initParamFunc="initParam"/><!-- 代理人 -->
				<r:treeNode  onDblclickFunc="selectItem" showField="name"  action="com.primeton.eos.tag.WFTagComponent.selectChilds.biz"
				      onRefreshFunc="refreshNode" initParamFunc="initParam2" nodeType="participants" childEntities="participants"/>
			</r:rtree>  
			</nobr>
		</div>
		</td>
		<td>
			<table border="0" width="100%">
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" value="<b:message key="select_activity_participants_jsp.add"/>" class="button" onclick="selectCurrentItem()"></td></tr><!-- 添加 -->
				<tr><td align="center">&nbsp;</td></tr>
				<tr><td align="center"><input type="button"  class="button" style="width: 60px;text-align: center;" value="<b:message key="select_activity_participants_jsp.del"/>" onclick="DelOption('selectedPar')"></td></tr><!-- 删除 -->
				<tr><td align="center"><input type="button"  class="button" style="width: 60px;text-align: center;" value="<b:message key="select_activity_participants_jsp.allDel"/>" onclick="DelAllOption('selectedPar')"></td></tr><!-- 全部删除 -->
				</table>
		</td>
		<td align="center" width="170px" valign="top">
			<select name="selectedPar" multiple="multiple" size="18" style="width: 170px;" class="select"> </select>
		</td>
	</tr>
	<tr>
		<td align="center" colspan="3">
		<hr><br>
			<input type="button" name="close" class="button" style="width: 60px;text-align: center;" value="<b:message key="select_activity_participants_jsp.ok"/>" onclick="closeWindowAndReturnValue('<%=maxNum%>')"><!-- 确定 -->
			<input type="button" name="close" class="button" style="width: 60px;text-align: center;" value="<b:message key="select_activity_participants_jsp.cancel"/>" onclick="closeWindowOnly()"><!-- 取消 -->
		</td>
	</tr>
</table>
</body>