<%@ include file = "/workflow/wfclient/common/common.jsp"%>
<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@page import="com.eos.data.datacontext.IUserObject"%>
<html>
<head>
<title>工作项执行</title>
<script type="text/javascript">

function init() {
	 
}

function doGet(){
	disableButton();
	var form1 =$name('form1');
	form1.action="com.primeton.workflow.client.pageflow.getWorkItemToSelf.flow";
	form1._eosFlowAction.value="action0";
	form1._eosFlowKey.value="";
	form1.submit();
}

function doCancelGet(){
	disableButton();
	var form1 =$name('form1');
	form1.action="com.primeton.workflow.client.pageflow.cancelGetWorkItem.flow";
	form1._eosFlowAction.value="action0";
	form1._eosFlowKey.value="";
	form1.submit();
}
   
function doDelegate() {
	var argument = "DELEG";
	showModalCenter("<%=request.getContextPath()%>/workflow/wfclient/task/delegate/delegate.jsp",argument,callBack,'515','330','代办任务') ;   		
}

function doHelp(){
	var argument = "HELP";
	showModalCenter("<%=request.getContextPath()%>/workflow/wfclient/task/delegate/help.jsp",argument,callBack,'515','330','协办任务') ;
}

function doRedo(){
	var argument = "redo";
	showModalCenter("<%=request.getContextPath()%>/workflow/wfclient/task/workitem/actionReason.jsp",argument,callBack2,'515','330','重做任务') ;
}

function doReject(){
	var argument = "reject";
	showModalCenter("<%=request.getContextPath()%>/workflow/wfclient/task/workitem/actionReason.jsp",argument,callBack2,'515','330','拒绝任务') ;
}

function doSubmit(actionValue){
	if(!checkFormField(document.form1)){
		return;
	}
	var form1 =$name('form1');
	form1.action="com.eos.workflow.executetask.executeTask.flow";
	form1._eosFlowAction.value=actionValue;
	disableButton();
	form1.submit();
}

function callBack2 (arg) {
	if(!arg){
		return ;
	}
	var formName = 'form1';
	var form1 =$name(formName);
	form1.action="com.primeton.workflow.client.pageflow.delegateWorkItem.flow";
	form1._eosFlowAction.value = arg[0];
	form1._eosFlowKey.value = "";
	//FIXME:INPUT HIDDEN
	/*var o = form1.appendChild(document.createElement("<INPUT TYPE='HIDDEN'>")) ;
	o.id= 'reason';			
	o.name= 'reason';
	o.value = arg[1] ;
	form1.appendChild(o);*/
	appendHiddenChild(formName,'reason',arg[1]);
	disableButton();
	form1.submit();
}

function callBack (arg) {
	if(!arg){
		return ;
	}
	var formName = 'form1';
	var form1 =$name(formName);
	form1.action="com.primeton.workflow.client.pageflow.delegateWorkItem.flow";
	form1._eosFlowAction.value = "action0";
	form1._eosFlowKey.value = "";
	form1.delegType.value=arg[0];
	var wfps = arg[2];
	//FIXME:INPUT HIDDEN
	/*var o = form1.appendChild(document.createElement("<INPUT TYPE='HIDDEN'>")) ;
	o.id= 'reason';			
	o.name= 'reason';
	o.value = arg[1] ;
	form1.appendChild(o);*/
	appendHiddenChild(formName,'reason',arg[1]);
	for(var i = 0;i<wfps.length;i++){
	    var wfp = wfps[i];
		if(wfps.length == 3 && wfp.value=="<b:write property='<%=IUserObject.KEY_IN_CONTEXT+"/userId" %>' scope='session'/>"){
			alert("操作失败:不能代办(协办)给自己！");
			return;
		}
		/*
		var o1 = form1.appendChild(document.createElement("<INPUT TYPE='HIDDEN'>")) ;
		o1.id= wfp.name;			
		o1.name= wfp.name;
		o1.value = wfp.value ;
		form1.appendChild(o1);*/
		appendHiddenChild(formName,wfp.name,wfp.value);
	}
	disableButton();
	form1.submit();
}

function disableButton(){
	if($name("btGet"))
		$name("btGet").disabled=true;
	if($name("btCancel"))
		$name("btCancel").disabled=true;
	if($name("btDelegate"))
		$name("btDelegate").disabled=true;
	if($name("btHelp"))
		$name("btHelp").disabled=true;
	if($name("btRedo"))
		$name("btRedo").disabled=true;
	if($name("btReject"))
		$name("btReject").disabled=true;
	if($name("btSaveWorkItem"))
		$name("btSaveWorkItem").disabled=true;
	if($name("btSubmit"))
		$name("btSubmit").disabled=true;
}

function enableButton(){
	if($name("btGet"))
		$name("btGet").disabled=false;
	if($name("btCancel"))
		$name("btCancel").disabled=false;
	if($name("btDelegate"))
		$name("btDelegate").disabled=false;
	if($name("btHelp"))
		$name("btHelp").disabled=false;
	if($name("btRedo"))
		$name("btRedo").disabled=false;
	if($name("btReject"))
		$name("btReject").disabled=false;
	if($name("btSaveWorkItem"))
		$name("btSaveWorkItem").disabled=false;
	if($name("btSubmit"))
		$name("btSubmit").disabled=false;
}
</script>
</head>

<body style="repeat-x;margin-top:10px;margin-left:0px; margin-right:0x;margin-buttom:0px" onload="init()"  valign="top">
<table  class="workarea" width="100%" valign="top">
	<tr>
    	<td class="workarea_title">工作流客户端 &gt;待处理的任务&gt;
        	<h3>执行工作项</h3>
    	</td>
  	</tr>
	<tr>
		<td>
			<table border="0" class="form_table" width="100%">
				<tr>
					<td colspan="4" class="EOS_panel_head">【工作项详细信息】</td>
				</tr>
				<tr> 
					<td class="EOS_table_row" width="15%">工作项ID:</td>
					<td width="35%"><b:write property="workitem/workItemID"/></td>
					<td class="EOS_table_row" width="15%">参与者:</td>
					<td><b:write property="workitem/partiName"/></td>
				</tr>
				<tr> 
	    			<td class="EOS_table_row">工作项名称:</td>
	    			<td><b:write property="workitem/workItemName"/></td>
	    			<td class="EOS_table_row">优先级:</td>
	    			<td><d:write dictTypeId="WFDICT_Priority" property="workitem/priority"/></td>
				</tr>
				<tr> 
	   				<td class="EOS_table_row">当前状态:</td>
					<td><d:write dictTypeId="WFDICT_WorkItemState" property="workitem/currentState"/></td>
					<td class="EOS_table_row">创建时间:</td>
					<td><b:write property="workitem/createTime" formatPattern="yyyy-MM-dd HH:mm:ss" srcFormatPattern="yyyyMMddHHmmss"/></td>
				</tr>
				<tr> 
					<td class="EOS_table_row">时间限制:</td>
					<td><b:write property="workitem/limitNumDesc"/></td>
					<td class="EOS_table_row">提醒时间:</td>
					<td><b:write property="workitem/remindTime"  formatPattern="yyyy-MM-dd HH:mm:ss" srcFormatPattern="yyyyMMddHHmmss"/></td>
				</tr>
				<tr> 
					<td class="EOS_table_row">是否超时:</td>
					<td><d:write dictTypeId="WFDICT_YN" property="workitem/isTimeOut"/></td>
					<td class="EOS_table_row">超时数:</td>
					<td><b:write property="workitem/timeOutNumDesc"/></td>
				</tr>
				<tr> 
	   				<td class="EOS_table_row">流程实例ID:</td>
					<td><b:write property="workitem/processInstID"/></td>
					<td class="EOS_table_row">流程实例名称:</td>
					<td style="table-layout:fixed;word-wrap: break-word"><b:write property="workitem/processInstName"/></td>
				</tr>
				<tr> 
	   				<td class="EOS_table_row">活动实例ID:</td>
					<td><b:write property="workitem/activityInstID"/></td>
					<td class="EOS_table_row">活动实例名称:</td>
					<td><b:write property="workitem/activityInstName"/></td>
				</tr>
		<%--		<tr> 
	   				<td class="EOS_table_row">工作项描述:</td>
					<td colspan="3"><b:write property="workitem/workItemDesc"/></td>
				</tr>--%>
			</table>
		</td>
	</tr>
	<tr>
		<td>
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
    			<tr>
					<td  class="EOS_panel_head">【工作项操作信息】</td>
				</tr>
				<tr> 
	    			<td> 
  						<table width="100%" class="EOS_table" border="0" style="border-collapse: collapse" id="plist">
			  				<tr class="EOS_table_head">
			        			<th nowrap="nowrap" align="center" width="20%" >时间</th>
			        			<th nowrap="nowrap" align="center" width="20%" >操作类型</th>
			       				<th nowrap="nowrap" align="center" width="40%">内容</th>
			       				<th nowrap="nowrap" align="center" width="20%" >信息来源</th>
				          	</tr>
			  				<wf:fetchMessageList id="message" workItemID="@workitem/workItemID">
			  				<tr class="EOS_table_row" align="center">
				              	<td nowrap="nowrap" >
				                  	<b:write property="time" iterateId="message" formatPattern="yyyy-MM-dd HH:mm:ss" srcFormatPattern="yyyyMMddHHmmss"/>
				              	</td>
				              	<td nowrap="nowrap" >
				                  	<b:write property="operateType" iterateId="message"/>
				              	</td>     
				              	<td style="word-break:break-all; ">
				                  	<b:write property="content" iterateId="message"/>
				              	</td>     
				              	<td nowrap="nowrap" >
					              	<b:write property="from" iterateId="message"/>
					          	</td> 
				          	</tr>
			  				</wf:fetchMessageList>
			       		</table>
       				</td>
    			</tr>
			</table>
		</td>
	</tr>
<form name="form1" method="post" action="" target="_self">
<input type="hidden" name="_eosFlowAction">
<input type="hidden" name="_eosFlowKey" value='<%=request.getAttribute("_eosFlowKey") %>'>
<input type="hidden" name="workitemID" value='<b:write property="workitem/workItemID" />'>
<input type="hidden" name="delegType">
	<tr>
		<td>
             <!--<span id="oData"></span>-->
			<table width="100%" border="0" cellspacing="0" cellpadding="0" class="EOS_panel_body">
				<tr>
					<td  class="EOS_panel_head">【执行表单数据】</td>
				</tr>
				
				<tr>	
					<td>	
						<table width="100%" border="0" cellspacing="0" cellpadding="0" class="form_table">
							<wf:showWorkItemForm id="view" workItemID="@workitem/workItemID" formName="form1">
								<tr>
									<td align="left" width="15%" class="EOS_table_row"><b:write iterateId="view" property="name"/></td>
									<td align="left" ><b:write iterateId="view" property="htmlComponentCode" filter="false"/></td>
								</tr>
							</wf:showWorkItemForm>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	<tr>
		<td>
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
				<tr>
					<td>
						<l:equal property="isFreeFlow" targetValue="true" compareType="string">
							<wf:appointActivity workItemID="@workitem/workItemID" styleClass="button" name="app" value="指派活动"/>
						</l:equal>
						<l:notEqual property="isFreeFlow" targetValue="true" compareType="string">
							<l:equal property="isNeedAppoint" targetValue="true" compareType="string">
								<wf:appointActivity workItemID="@workitem/workItemID" styleClass="button" name="app" value="指派后继活动参与者"/>
							</l:equal>
						</l:notEqual>
					</td>
				</tr>
				<tr>
				<td>&nbsp;&nbsp;
				</td>
				</tr>
				<tr>
					<td>
        				<table width="100%" border="0" cellspacing="0" cellpadding="0">
          					
          					<tr>
          						<td width="50%"> 
                        			<wf:workItemActionList workItemID="@workitem/workItemID">
                        				<wf:workItemAction type="GET" value="Y">
                        					<input type="button"  name="btGet"  class="button" value = "领取" onClick="doGet();">
                        				</wf:workItemAction>
                        				<wf:workItemAction type="IS_ALLOW_SENDBACK" value="Y">
                        					<input type="button"  name="btCancel"  class="button" value = "取消领取" onClick="doCancelGet();">
                        				</wf:workItemAction>
                        				<wf:workItemAction type="DELEGATE" value="Y">
                        					<input type="button"  name="btDelegate" class="button" value = "代办" onclick="doDelegate();">
                        				</wf:workItemAction>
                        				<wf:workItemAction type="HELP" value="Y">
                        					<input type="button"  name="btHelp" class="button" value = "协办"  onclick="doHelp();">
                        				</wf:workItemAction>
                        				<wf:workItemAction   type="REDO" value="Y">
                              				<input type="button"  name="btRedo" class="button" value = "重做" onclick="doRedo('打回工作项');">
                       					</wf:workItemAction>
                       					<wf:workItemAction   type="REJECT" value="Y">
                              				<input type="button"  name="btReject" class="button" value = "拒绝" onclick="doReject('拒绝工作项');">
                       					</wf:workItemAction>
                       					<wf:workItemAction type="SUBMIT" value="Y">
                        					<input type="button" name="btSaveWorkItem" value="保存工作项" onClick="doSubmit('action7');" class="button">
                        				</wf:workItemAction>
                       					<wf:workItemAction   type="SUBMIT" value="Y">
                       						<l:equal property="workitem/bizState" targetValue="4" compareType="number">
                              					<input type="button"  name="btSubmit" class="button" value = "确认" onclick="doSubmit('action8');">
                              				</l:equal>
                              				<l:notEqual property="workitem/bizState" targetValue="4" compareType="number">
                              					<input type="button"  name="btSubmit" class="button" value = "执行" onclick="doSubmit('action8');">
                              				</l:notEqual>
                       					</wf:workItemAction>
                        			</wf:workItemActionList>
                    			</td>
          					</tr>
						</table>
					</td>
				</tr>
			</table>
</td>
</tr>
</form>
</table>
</body>
</html>