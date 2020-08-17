<%@ taglib uri="http://eos.primeton.com/tags/workflow" prefix="wf"%>
<%@ include file = "/workflow/wfcomponent/common/common.jsp"%>
<%@ page language="java" contentType="text/html;charset=UTF-8"%>
<html>
<head>
<title>填写原因</title>
<script>
function init() {

	var arg = window["dialogArguments"] ;
	refreshText(arg);
	//FIXME: document.getElementById --> $id
	$id('buttonOK').onclick = function () {
		 var temp = $id('reason').value;
		 if(trim(temp)=='')
		 	temp="无";
		 returnValue = new Array();
		 returnValue[0] = arg;
		 returnValue[1] = temp ;
		 window.close() ;
	}
}

function refreshText(arg){
    if(arg=="reject"){
    	$id('j1').style.display='block';
    	$id('j2').style.display='block';
    	$id('c1').style.display='none';
    	$id('c2').style.display='none';
    	$id('s1').style.display='none';
    	$id('s2').style.display='none';
    }
	if(arg=="redo"){
    	$id('j1').style.display='none';
    	$id('j2').style.display='none';
    	$id('s1').style.display='none';
    	$id('s2').style.display='none';
    	$id('c1').style.display='block';
    	$id('c2').style.display='block';
    }
    if(arg=="withdraw"){
    	$id('j1').style.display='none';
    	$id('j2').style.display='none';
    	$id('s1').style.display='block';
    	$id('s2').style.display='block';
    	$id('c1').style.display='none';
    	$id('c2').style.display='none';
    }
	
}
</script>

</head>
<body marginheight="0" marginwidth="0" leftmargin="0" rightmargin="0" onload="init()">
<form action="" name="frm">
<table width="497" border="0" cellspacing="0" cellpadding="0" class="EOS_panel_body" height="100%">
  <tr>
    <td class="EOS_panel_head" align="left" colspan="4"><div id="j1">拒绝工作项</div><div id="c1">重做工作项</div><div id="s1">收回工作项</div></td>
  </tr>
  <tr>
    <td class="EOS_table_row" align="left" colspan="4">&nbsp;</td>
  </tr>
  <tr valign="middle">
    <td class="EOS_table_row" nowrap="nowrap" width="15%" valign="top"><div id="j2">&nbsp;&nbsp;拒绝原因:</div><div id="c2">&nbsp;&nbsp;重做原因:</div><div id="s2">&nbsp;&nbsp;收回原因:</div></td>
    <td class="EOS_table_row" valign="top">
		<textarea rows="10" cols="55" id="reason" class="textbox" onMouseMove="textCounter(this,200);" onkeydown="textCounter(this,200);" onkeyup="textCounter(this,200);"></textarea>
    </td>
  </tr>
  <tr>
    <td class="EOS_table_row" align="center" colspan="4">
		<input type="button" id="buttonOK" value="确定" class="button"> <input type="button" value="重置" class="button">	<input type="button" value="取消" class="button" onclick="window.close();">
    </td>
  </tr>
</table>
</form>
</body>
</html>