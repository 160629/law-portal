<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@ include file="/workflow/wfcomponent/common/common.jsp"%>
<html>
<body>
<form action="com.primeton.workflow.client.pageflow.worklist4self.flow" name="form1" target="_self"></form>
</body>
<script language="JavaScript">
	alert("<b:message key="error_back_client_jsp.operation_fail"/>");//操作失败！
	form1.submit();
</script>
</html>