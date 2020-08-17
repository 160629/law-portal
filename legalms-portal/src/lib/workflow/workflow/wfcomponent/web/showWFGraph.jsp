<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib uri="/WEB-INF/tlds/workflow.tld" prefix="wf"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<title><b:message key="show_wf_graph_jsp.processFigure"/></title><!-- 流程图 -->

		<meta http-equiv="pragma" content="no-cache">
		<meta http-equiv="cache-control" content="no-cache">
		<meta http-equiv="expires" content="0">
		<meta http-equiv="keywords" content="keyword1,keyword2,keyword3">
		<meta http-equiv="description" content="This is my page">
		<!--
	<link rel="stylesheet" type="text/css" href="styles.css">
	-->
	<script type="text/javascript" src="<%=request.getContextPath()%>/workflow/wfcomponent/web/js/Graphic.js"></script>
	</head>
	<%
		String processInstID = request.getParameter("processInstID");
		String zoom = request.getParameter("zoomvalue");
		if(null == zoom||"".equals(zoom))
		{
			zoom = "1";
		}
	 %>
	<body>
		<wf:processGraph processInstID='<%=processInstID%>' zoomQuotiety='<%=zoom%>' ></wf:processGraph>
	</body>
</html>
