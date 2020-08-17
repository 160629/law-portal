<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ page import="com.eos.access.http.OnlineUserManager" %> 
<%@ page import="com.eos.data.datacontext.UserObject" %> 
<%
	UserObject uo = new UserObject();
	uo.setUserId("tiger");
	OnlineUserManager.login(uo);
%>

<html>
	<head><title></title></head>
	<body>
			<h2 align="center">ShowAppointActivityList</h2>
			<table border="1">
			<wf:showAppointActivityList id="view" workItemID="29" appointed="false">
					<tr> 			
						<td align="center"><b:write iterateId="view" property="id"/></td>
						<td align="center"><b:write iterateId="view" property="name"/></td>
					</tr>
				</wf:showAppointActivityList>
	</table>
	</body>
</html>
