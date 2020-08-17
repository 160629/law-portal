<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://eos.primeton.com/tags/workflow" prefix="w"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.HashMap"%>
<%@page import="com.primeton.workflow.commons.utility.StringUtil"%>
<html>
	<head><title></title>
		<script language="javascript" src="<%=request.getContextPath()%>/workflow/wfcomponent/web/js/Graphic.js"></script>
		</head>
	<body>
		 <h2 align="center">ShowProcessGraphScript</h2>
			<w:processGraph processID="2"  zoomQuotiety="2.0">
				<w:activityGraph activityType="manual"/>
			</w:processGraph>
<%
			Map processCache=(HashMap)session.getAttribute("wfprocess");
			int processDefId = 2;
			Map activityCache = (HashMap)processCache.get(processDefId);
			String activityStr = (String)activityCache.get("manualActivity0");
			out.println(StringUtil.escapeXML(activityStr));
%>
	</body>
</html>