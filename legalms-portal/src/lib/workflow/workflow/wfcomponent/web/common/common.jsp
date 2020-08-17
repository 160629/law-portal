<%@include file="/common/common.jsp"%>
<%@include file="/workflow/wfcomponent/web/common/common-java.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/webcomp" prefix="w"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>
<%@ taglib uri="http://eos.primeton.com/tags/dict" prefix="d"%>
<h:css href="/common/theme/style-sys.css"></h:css>
<script type="text/javascript">
	var contextPath = "<%=request.getContextPath()%>"; // you should define the contextPath of web application
	var EOSDEBUG = false;
</script>
<h:script src="/workflow/wfcomponent/web/js/i18n/message.js" i18n="true"></h:script>
<h:script src="/common/javascripts/zh_CN/message.js"></h:script>
<h:script src="/common/skins/skin0/scripts/resource.js"></h:script>
<h:script src="/common/fckeditor/ckeditor.js"></h:script>
<h:script src="/common/scripts/eos-web.js"></h:script>
<h:script src="/common/lib/mootools.js"></h:script>

<%@ taglib uri="http://eos.primeton.com/tags/workflow" prefix="wf"%>

<h:css href="/workflow/wfcomponent/web/css/style-bps.css"/>
<h:script src="/workflow/wfcomponent/web/js/workflow.js"></h:script>
<h:script src="/workflow/wfcomponent/web/js/workflow-tag.js"></h:script>
<h:script src="/workflow/wfcomponent/web/js/Graphic.js"></h:script>
