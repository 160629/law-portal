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
	<body>
		<h1 align="left">setParticipant</h1>
	 <p>
	 		<wf:setParticipant name="setpar" value="<b:message key="appointed_list_jsp.settingParticipants"/>"  activityID="42"  workItemID="29"  styleClass="button" /><!-- 设置参与者 -->
	 </p>
	</body>
</html>