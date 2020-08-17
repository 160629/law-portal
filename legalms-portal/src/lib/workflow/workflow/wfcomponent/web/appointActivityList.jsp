<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%
	String workItemId = request.getParameter("workItemId") != null ?
		(String)request.getParameter("workItemId") : null ;
%>
<html>
	<head><title></title></head>
	<body>
		
		<table align="center" border="0" cellpadding="0" cellspacing="0" width="90%">
			<tr> 
				<td height="30">
					<font size="30"><b:message key="appoint_activity_list_jsp.appointSucceedActivity"/></font><!-- 指派后继活动 -->
				</td>
			</tr>
			<tr> 
				<td>
					<iframe name="appointed" width="100%" height="200" src="<%=request.getContextPath()%>/workflow/wfcomponent/web/appointedList.jsp?id=<%=workItemId%>" style="margin-top:0" align="top" scrolling="auto" frameborder="1" allowtransparency="true"></iframe>
				</td>
			</tr>
			<tr> 
				<td height="30">
					<font size="30"><b:message key="appoint_activity_list_jsp.optionListSucceedActivity"/></font><!-- 可选的后继活动列表 -->
				</td>
			</tr>
			<tr>  
			  <td valign="top">
			    	<iframe name="unappointed"  width="100%" height="200" src="<%=request.getContextPath()%>/workflow/wfcomponent/web/unappointedList.jsp?id=<%=workItemId%>" style="margin-top:0" align="top" scrolling="auto" frameborder="1" allowtransparency="true"></iframe>
			  </td>
			</tr>
		</table>
	</body>
</html> 