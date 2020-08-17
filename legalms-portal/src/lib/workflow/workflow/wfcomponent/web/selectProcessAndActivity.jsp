<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>

<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<%
	String showActivity = request.getParameter("isShowActivity") != null ?
					(String)request.getParameter("isShowActivity") : "" ;
	String selectProcess = request.getParameter("isSelectProcess") != null ?
					(String)request.getParameter("isSelectProcess") : "" ;
	String maxNum = request.getParameter("maxNum") != null ?
					(String)request.getParameter("maxNum") : null ;
	String selectActivity = request.getParameter("isSelectActivity") != null ?
					(String)request.getParameter("isSelectActivity") : "" ;
	String actType = request.getParameter("actType") != null ?
					(String)request.getParameter("actType") : "" ;
	String showTitle = null;
	if(showActivity.equals("false")){
		showTitle = ResourcesMessageUtil.getI18nResourceMessage("select_process_and_activity_jsp.process");//流程
	}else{
		showTitle = ResourcesMessageUtil.getI18nResourceMessage("select_process_and_activity_jsp.process_activity");//流程/活动
	}
	//out.println(showActivity);
	//out.println(showTitle);

%>
<script> 
	var isSelectProcess = '<%=selectProcess%>' ;
	var isSelectActivity = '<%=selectActivity%>' ;
	function initParam () {
		return "<isShowActivity><%=showActivity%></isShowActivity><actType><%=actType%></actType>" ;
	}
	
	function refreshNode(node){
		node.setLeaf();
		node.setIcon("/workflow/wfcomponent/web/images/graph/"+node.getProperty('type')+"_activity.gif");
	}
	
	function beforeMethodInvoke(node,type) {
		if(returnValues == 'undefined'|| returnValues == null)
			 return false;
		if (type == "ACTIVITY") {
			var processDefId = node.getProperty('processDefId');
		} else {
			var processDefId = node.getProperty('processDefID');
		}

		for(var i=0;i<returnValues.length;++i) {
			if (type != returnValues[i].type) {
				rId = returnValues[i].id ;
				if(type == "PROCESS"){
					rId = rId.substring(rId.indexOf("$")+1);
				}
				//alert(rId+":::"+processDefId);
				if (rId==processDefId) {
					return false;
				}
			}
		}
		return true ;
	}
	
	function selectCurrentItem () {
		var curNode = tree.getSelectNode();
		if (curNode == null) {
			alert("<b:message key="select_process_and_activity_jsp.select_add_content"/>");//请选择添加内容！
			return;
		}
		
		if (curNode.isRootNode()) {
			alert("<b:message key="select_process_and_activity_jsp.select_process_activity"/>");//请选择流程或活动！
			return;
		}
		
		var catalogUUID = curNode.getProperty("catalogUUID");
		if (catalogUUID == null || catalogUUID == "undefined") {
			selectActivityItem(curNode);
		}
		else {
			selectProcessItem(curNode);
		}
	}
</script>
<body onload="init()" style="overflow: hidden;overflow-x:no;overflow-y:auto;">
 <table width="428" class="workarea" height="100%"  cellpadding="0" cellspacing="0" style='table-layout:fixed;'> 
	<tr>
	    <th width="175" height="23" scope="col" style="vertical-align:middle;padding-top:3px;text-align:left;"><b:message key="select_process_and_activity_jsp.please_select"/><%=showTitle%></th><%-- 请选择 --%>
	    <th width="65" scope="col">&nbsp;</th>
	    <th width="175" scope="col" style="vertical-align:middle; padding-top:3px; text-align:left; "><b:message key="select_process_and_activity_jsp.selected"/><%=showTitle%></th><%-- 已选择的 --%>
	</tr>
	<tr>
		 <td height="260" valign="top"  style="border:1px solid #CCCCCC;" bgcolor="#FFFFFF">
		 	<div id="wins"  style="height:260px;width:100%;overflow:auto;"> 
		 	 <nobr>
			 <r:rtree  hasRoot="true" id="tree" width="100%" height="100%">
				<r:treeRoot  display="<%=showTitle%>" action="com.primeton.eos.tag.WFTagComponent.selectProcessAndActivity.biz" 
				  childEntities="processes"/>
				<r:treeNode  action="com.primeton.eos.tag.WFTagComponent.selectActivityByProcessId.biz"  
					initParamFunc="initParam" showField="processChName" onDblclickFunc="selectProcessItem"
					 nodeType="processes" childEntities="activities" icon="/workflow/wfcomponent/web/images/participant/processdef.gif,/workflow/wfcomponent/web/images/participant/processdef.gif"/>
				<r:treeNode  showField="name" onDblclickFunc="selectActivityItem" onRefreshFunc="refreshNode"
						nodeType="activities" childEntities="activities"/>
			</r:rtree> 
			</nobr> 
			</div>
		</td>
		
		<td >
			<table border="0" width="100%">
				<tr><td align="center"><input type="button" id="addBtn" style="width: 60px;text-align: center;" value="<b:message key="select_process_and_activity_jsp.add"/>" class="button" onclick="selectCurrentItem()"></td></tr><%-- 添加 --%>
				<tr><td align="center">&nbsp;</td></tr>
				<tr><td align="center"><input type="button" id="deleteBtn" style="width: 60px;text-align: center;" value="<b:message key="select_process_and_activity_jsp.delete"/>" class="button" onclick="DelOption('selectedPar')"></td></tr><%-- 删除 --%>
				<tr><td align="center"><input type="button" id="allDeleteBtn" style="width: 60px;text-align: center;" value="<b:message key="select_process_and_activity_jsp.delete_all"/>" class="button" onclick="DelAllOption('selectedPar')"></td></tr><%-- 全部删除 --%>
				</table>
		</td>
		<td align="center" valign="top">
			<select name="selectedPar" multiple="multiple" size="17" style="width:180px"> </select>
		</td>
	</tr>
	<tr><td colspan="4"><hr></td></tr>
	<tr>
		<td align="center" colspan="4">
			<input type="button" id="okBtn" name="close" style="width: 60px;text-align: center;" value="<b:message key="select_process_and_activity_jsp.ok"/>" class="button" onclick="closeWindowAndReturnValue('<%=maxNum%>')"><%-- 确定 --%>
			<input type="button" id="cancelBtn" name="close" style="width: 60px;text-align: center;" value="<b:message key="select_process_and_activity_jsp.cancel"/>" class="button"  onclick="closeWindowOnly()"><%-- 取消 --%>
		</td>
	</tr>
</table>
</body>