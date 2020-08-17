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
<h2 align="left">ShowProcessstartFormTag</h2>
<form action="" name="form1"></form>
<%--<table  border="0" cellspacing="0" cellpadding="0" class="form_table">	
	<wf:showProcStartForm id="view" processID="17" formName="form1" >
		<tr>

			<td><b:write iterateId="view" property="name" filter="false"/></td>
			<td><b:write iterateId="view" property="htmlComponentCode" filter="false"/></td>
		</tr>
	</wf:showProcStartForm>	
</table>
--%>
<br>
<br>
	<table  border="0" cellspacing="0" cellpadding="0" class="form_table">	
				<wf:showProcStartForm id="view" processID="17" formName="form1">
					<tr> 
						<b:set name="name" iterateId="view" property="name"/>
						<b:set name="html" iterateId="view" property="htmlComponentCode"/>
						<td align="left" width="15%" class="EOS_table_row">&nbsp;<%=(String)request.getAttribute("name")%></td>
						<td align="left" class="EOS_table_row">&nbsp;<%=(String)request.getAttribute("html")%></td>
					</tr>
				</wf:showProcStartForm>
	</table>
</form>
</body>
</html>
