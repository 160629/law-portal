
<%@include file="/common/common.jsp"%>
<%@include file="/common/skins/skin0/component.jsp"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<html>
<body>
<div style="border:red solid 0px;width:275px">
<div style="word-wrap:normal;height:120px" >
<span style='border:red solid 0px; height:100px;width:55px'><img style='margin-top:10px;margin-left:15px' src='<%=request.getContextPath()%>/common/skins/skin0/images/msgbox/alert.gif'></span>
<span id='msg' style='border:red solid 0px; height:120px ;width:210px;padding-top:30px;line-height:20px;word-break:break-all;font:14px'></span>
</div>

<div style='border:red solid 0px; height:50px'><div align="center" style='margin-left:20px;width:260px;background:url(<%=request.getContextPath()%>/common/skins/skin0/images/msgbox/dot.gif) repeat-x'></div>

<input type=button value="<b:message key="eos_ricweb_msgbox_confirm"/>" class=button style='margin-left:115px;background:url(<%=request.getContextPath()%>/common/skins/skin0/images/msgbox/button.gif);border:0px;width:71px;height:23px' onclick='window.close();'>
</div>
<script>
	var arguments = dialogArguments;
	$id("msg").innerHTML = "<xmp>"+arguments[0]+"</xmp>";
	function closewin(){
	}
</script>
</body>
</html>