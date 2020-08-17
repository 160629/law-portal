<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://eos.primeton.com/tags/workflow" prefix="w"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<head><title></title>
		<script language="javascript" src="<%=request.getContextPath()%>/workflow/wfcomponent/web/js/Graphic.js"></script>
		</head>
	<body>
		 <h2 align="center">ShowProcessGraphScript</h2>
				<w:showProcessGraphScript processDefId="2"  url="http://www.sina.com.cn" target="_blank" zoomQuotiety="2.0" showUrl="true" xpath="" />
	</body>
</html>