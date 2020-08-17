<%@page pageEncoding="UTF-8"%>
<%@ taglib uri="http://eos.primeton.com/tags/private" prefix="h"%>
<%@ taglib uri="http://eos.primeton.com/tags/bean" prefix="b"%>
<%@page import="com.primeton.ext.access.http.processor.MultipartRequest"%>
<%@page import="java.util.Enumeration"%>
<%@page import="java.util.Set"%>
<%@page import="java.util.HashSet"%>
<%@page import="com.primeton.ext.data.sdo.DataUtil"%>
<%@page import="java.lang.reflect.Proxy"%>
<html>

<head>
<title>Redirect</title>
</head>
<body>

<%! 
	public static String getPageflowID(HttpServletRequest request, boolean isWholeName) {

		String pageflowID = null;
		if(request instanceof MultipartRequest){
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=(String)request.getAttribute("_eosFlowID");

			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=request.getParameter("_eosFlowID");

			//为工作流取出eosflowid
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=(String)request.getAttribute("_flowID");

			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=request.getParameter("_flowID");
			//第一次页面流请求过来的flowid为null所以取lastrequesturl
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID = ((MultipartRequest)request).getParameter("_eosLastRequestURL");

			if(pageflowID==null||pageflowID.length()==0)
				pageflowID = (String)((MultipartRequest)request).getAttribute("_eosLastRequestURL");
		}else{
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=(String)request.getAttribute("_eosFlowID");

			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=request.getParameter("_eosFlowID");

			//为工作流取出eosflowid
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=(String)request.getAttribute("_flowID");

			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=request.getParameter("_flowID");

			//第一次页面流请求过来的flowid为null所以取lastrequesturl
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID=(String)request.getAttribute("_eosLastRequestURL");
			if(pageflowID==null||pageflowID.length()==0)
				pageflowID = request.getParameter("_eosLastRequestURL");
		}

		if ( !isWholeName ){
			if(pageflowID.lastIndexOf(".")>0){
				pageflowID = pageflowID.substring(0, pageflowID.lastIndexOf("."));
			}
		}
		return pageflowID;

	}
	
	public static boolean isAllowType(Object obj) {
		if (obj == null) {
			return false;
		}
		if (java.lang.reflect.InvocationHandler.class.isAssignableFrom(obj.getClass())) {
			return false;
		}
		if (Proxy.isProxyClass(obj.getClass())) {
			return false;
		}
		
		return true;
	}
	
%>

<form  method="post" name="fullform">
<b:set name="nextFlowActionTemp" property="nextFlowAction" />
<%
    String pageflowID = getPageflowID(request, true);
	String nextFlowAction = String.valueOf(request.getAttribute("nextFlowActionTemp"));
	if (nextFlowAction == null || "null".equals(nextFlowAction.toLowerCase()) || nextFlowAction.trim().length() == 0) {
		nextFlowAction = "next";
	}
	
	Set filterSet = new HashSet();
	filterSet.add("_eosFlowAction");
	
    Enumeration e = request.getAttributeNames();
    while (e.hasMoreElements()) {
    	String nameKey = (String)e.nextElement();
    	if (!filterSet.contains(nameKey)) {
    		Object nameValue = request.getAttribute(nameKey);
    		
    		if (nameValue == null) {
    			continue;
    		}
    		
    		filterSet.add(nameKey);
    		
    		if (DataUtil.isPrimitiveObject(nameValue.getClass())) {    			
%>
			<h:hidden name="<%=nameKey%>" value="<%=String.valueOf(nameValue)%>"/>
<%
			} else if (isAllowType(nameValue)){
%>
			<h:hiddendata  property="<%=nameKey%>"/>
<%			
			}
		}
    }
%>

<% 
    e = request.getParameterNames();
    while (e.hasMoreElements()) {
    	String nameKey = (String)e.nextElement();
    	if (!filterSet.contains(nameKey.split("/")[0]) && !filterSet.contains(nameKey.split("\\[")[0]) && !filterSet.contains(nameKey.split("\\.")[0])) {
    		Object nameValue = request.getParameter(nameKey);
    		if (nameValue == null) {
    			continue;
    		}
    		if (DataUtil.isPrimitiveObject(nameValue.getClass())) {
%>
			<h:hidden name="<%=nameKey%>" value="<%=String.valueOf(nameValue)%>"/>
<%
			} else if (isAllowType(nameValue)){
%>
			<h:hiddendata  property="<%=nameKey%>"/>
<%			
			}
		}
    }
%>

<h:hidden name="_eosFlowAction" value="<%=nextFlowAction%>"/>
</form>
</body>
</html>

<script language="JavaScript" type="text/javascript">

	window.onload = function(){
		updateConfirm();
	};
	
	function updateConfirm() {
		document.forms['fullform'].action = "<%=pageflowID %>";
		
		document.forms['fullform'].submit();
	}

</script>