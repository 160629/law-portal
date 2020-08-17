<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>

<%@ page import="com.eos.data.datacontext.UserObject" %> 
<%@page import="com.eos.data.datacontext.IUserObject"%>


<%
//用户的Session登入；
	UserObject uo = new UserObject();
	uo.setUserId("tiger");
	session.setAttribute(IUserObject.KEY_IN_CONTEXT,uo);
%>
<html>
<head>
<title></title>
</head>
<body>
<h2 align="left">FetchWorkListTag</h2>

<table class="EOS_table" border="0" style="border-collapse: collapse" id="plist">
	<tr class="EOS_table_head">		
		<th><b:message key="appointed_list_jsp.workitemID"/></th><!-- 工作项ID -->
		<th><b:message key="appointed_list_jsp.workitemName"/></th><!-- 工作项名称 -->		
		<th><b:message key="appointed_list_jsp.workitemDesc"/></th><!-- 工作项描述信息 -->
		<th><b:message key="appointed_list_jsp.currentState"/></th><!-- 当前状态 -->
		<th><b:message key="appointed_list_jsp.participant"/></th><!-- 参与者 -->
		<th><b:message key="appointed_list_jsp.priority"/></th><!-- 优先级 -->
		<th><b:message key="appointed_list_jsp.isTimeout"/></th><!-- 是否超时 -->
		<th><b:message key="appointed_list_jsp.URLType"/></th><!-- 自定义URL类型 -->
		<th><b:message key="appointed_list_jsp.URL"/></th><!-- 自定义URL -->		
	</tr>
	<wf:fetchWorkList id="view" personID="tiger" taskSource="ALL" taskProperty="ALL" workListType="ALL" >
		<tr class="EOS_table_row">			
			<td><b:write iterateId="view" property="workItemID" /></td>
			<td><b:write iterateId="view" property="workItemName" /></td>			
			<td><b:write iterateId="view" property="workItemDesc" /></td>			
			<td><b:write iterateId="view" property="currentState" /></td>
			<td><b:write iterateId="view" property="participant" /></td>
			<td><b:write iterateId="view" property="priority" /></td>
			<td><b:write iterateId="view" property="isTimeOut" /></td>		
			<td><b:write iterateId="view" property="urlType" /></td>
			<td><b:write iterateId="view" property="actionURL" /></td>
		</tr>
	</wf:fetchWorkList>	
</table>





</body>
</html>
