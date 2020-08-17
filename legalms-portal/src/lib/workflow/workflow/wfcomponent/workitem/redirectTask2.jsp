<%@include file="/common/common.jsp"%>
<%@include file="/common/skins/skin0/component.jsp"%>
<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@page import="com.eos.workflow.data.WFWorkItem"%>
<%@page import="com.primeton.workflow.commons.utility.StringUtil"%>
<%
	String url = null;
	WFWorkItem workitem = null;
	if(request.getAttribute("workitem")!=null){
		workitem = (WFWorkItem)request.getAttribute("workitem");
		url = workitem.getActionURL();
	}
	
	if(StringUtil.isNullOrBlank(url)) throw new Exception("**自定义URL为空**");
	
	
%>
<html>
<body>
<form id="form1" method="post" >
<input type="hidden" name="workItemID" value='<%=workitem.getWorkItemID() %>'/>
</form>
<script>
	var form1 = document.getElementById('form1');
	form1.action = '<%=url %>';
	form1.submit();
</script>
<body>
</html>