<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://eos.primeton.com/tags/workflow" prefix="w"%>
<html>
	<head><title></title>
		<script language="javascript" src="<%=request.getContextPath()%>/workflow/wfcomponent/web/js/Graphic.js"></script>
		</head>
	<body>
		 <h2 align="center">ShowProcessGraphScript</h2>
		 	<w:processGraph processInstID="2"  zoomQuotiety="2.0">
				<w:activityGraph activityType="manual"/>
			</w:processGraph>
	</body>
</html>