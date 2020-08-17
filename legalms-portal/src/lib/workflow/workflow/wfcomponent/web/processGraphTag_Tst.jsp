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
<title>Title</title>
</head>
<body>

	<table>
	    <tr>
        	<td>
        		<wf:processGraph processInstID="101" zoomQuotiety="1.0">
        			<wf:activityGraph activityType="start" onclick="alert('start')" />
					<wf:activityGraph activityType="manual" onclick="alert('manual')" />
					<wf:activityGraph activityType="route" onclick="alert('route')" />
					<wf:activityGraph activityType="subflow" onclick="alert('subflow')" />
					<wf:activityGraph activityType="toolapp" onclick="alert('toolapp')" />
					<wf:activityGraph activityType="finish" onclick="alert('finish')" />
        		</wf:processGraph>
        	</td>
        </tr>
     </table>
</body>
</html>