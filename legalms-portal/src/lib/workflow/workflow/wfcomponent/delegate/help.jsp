<%@ taglib uri="http://eos.primeton.com/tags/workflow" prefix="wf"%>
<%@ include file = "/workflow/wfclient/common/common.jsp"%>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<html>
<head>
<title>协办任务</title>
<script>
function init() {

	var arg = window["dialogArguments"] ;
	//FIXME: document.getElementById --> $id
	$id('buttonOK').onclick = function () {
		 var temp = $id('reason').value;
		 if(trim(temp)=='')
		 	temp="无";
		 var wfplist = getElementsByNameEx("wfps");
		 if(trim($id("participant").value)==''){
		 	alert("请选择代办人");
		 	return;
		 }	
		 $id("buttonOK").disabled=true;	
		 returnValue = new Array();
		 returnValue[0] = arg;
		 returnValue[1] = temp ;
		 returnValue[2] = wfplist;
		 window.close();
	}
}

</script>

</head>
<body marginheight="0" marginwidth="0" leftmargin="0" rightmargin="0" onload="init()">
<form action="" name="frm">
<table width="497" border="0" cellspacing="0" cellpadding="0" class="EOS_panel_body" height="100%">
  <tr>
    <td class="EOS_panel_head" valign="middle" colspan="2">设置协办任务</td>
  </tr>
  <tr>
    <td class="EOS_table_row" nowrap="nowrap" width="15%">&nbsp;&nbsp;协办人:</td>
    <td class="EOS_table_row">
		<input id="participant" name="participant" type="text" size="40" class="textbox" readonly="readonly">
		<wf:selectParticipant form="frm" styleClass="button" output="participant" root="" value="选择..." hidden="wfps" hiddenType="PARTICIPANT">
		</wf:selectParticipant>
    </td>
  </tr>
  <tr>
    <td class="EOS_table_row" nowrap="nowrap" valign="top" width="15%">&nbsp;&nbsp;协办原因:</td>
    <td class="EOS_table_row" valign="top">
		<textarea rows="10" cols="50" id="reason" class="textbox" onMouseMove="textCounter(this,200);" onkeydown="textCounter(this,200);" onkeyup="textCounter(this,200);"></textarea>
    </td>
  </tr>
  <tr>
    <td class="EOS_table_row" align="center" colspan="2" valign="top">
		<input type="button" id="buttonOK" value="确定" class="button"> <input type="reset" value="重置" class="button">	<input type="button" value="取消" class="button" onclick="window.close();">
    </td>
  </tr>
</table>
</form>
</body>
</html>