<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>

<%@ page import="com.eos.data.datacontext.UserObject" %> 
<%@page import="com.eos.data.datacontext.IUserObject"%>


<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<%
//用户的Session登入；
	UserObject uo = new UserObject();
	uo.setUserId("tiger");
	session.setAttribute(IUserObject.KEY_IN_CONTEXT,uo);
	
	String appointActivity = ResourcesMessageUtil.getI18nResourceMessage("");
%>
<html>
	<body>
		<h1 align="left">AppointActivityTag </h1>
	 <p>
	 		<wf:appointActivity workItemID="1705" name="app" value="<%=appointActivity %>" styleClass="button"  /><!-- 指派活动 -->
	 </p>
	</body>
</html>