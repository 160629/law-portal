<%@ page language="java" contentType="text/html;charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
<head>
<title></title>
</head>
<body>
<h2 align="left" >WorkItemActionList & workItemAction Tag</h2>

<wf:workItemActionList workItemID="3501">
	<wf:workItemAction type="GET" value="Y">
		<input type="button" name="btGet" class="button" value="<b:message key="workitem_action_list_tag_tst_jsp.receive"/>"
			onClick="alert('<b:message key="workitem_action_list_tag_tst_jsp.receive"/>')"><!-- 领取 -->
	</wf:workItemAction>
	<wf:workItemAction type="IS_ALLOW_SENDBACK" value="Y">
		<input type="button" name="btCancel" class="button" value="<b:message key="workitem_action_list_tag_tst_jsp.cancelReceive"/>"
			onClick="alert('<b:message key="workitem_action_list_tag_tst_jsp.cancelReceive"/>')"><!-- 取消领取 -->
	</wf:workItemAction>
	<wf:workItemAction type="DELEGATE" value="Y">
		<input type="button" name="btDelegate" class="button" value="<b:message key=""/>"
			onclick="alert('<b:message key="workitem_action_list_tag_tst_jsp.delegate"/>')"><!-- 代办 -->
	</wf:workItemAction>
	<wf:workItemAction type="HELP" value="Y">
		<input type="button" name="btHelp" class="button" value="<b:message key="workitem_action_list_tag_tst_jsp.help"/>"
			onclick="alert('<b:message key="workitem_action_list_tag_tst_jsp.help"/>')"><!-- 协办 -->
	</wf:workItemAction>
	<wf:workItemAction type="REDO" value="Y">
		<input type="button" name="btRedo" class="button" value="<b:message key="workitem_action_list_tag_tst_jsp.redo"/>"
			onclick="alert('<b:message key="workitem_action_list_tag_tst_jsp.redo"/>')"><!-- 重做 -->
	</wf:workItemAction>
	<wf:workItemAction type="REJECT" value="Y">
		<input type="button" name="btReject" class="button" value="<b:message key="workitem_action_list_tag_tst_jsp.refused"/>"
			onclick="alert('<b:message key="workitem_action_list_tag_tst_jsp.refused"/>')"><!-- 拒绝 -->
	</wf:workItemAction>
	<wf:workItemAction type="SUBMIT" value="Y">
		<input type="button" name="btSaveWorkItem" value="<b:message key="workitem_action_list_tag_tst_jsp.saveWorkitem"/>"
			onClick="alert('<b:message key="workitem_action_list_tag_tst_jsp.saveWorkitem"/>')" class="button"><!-- 保存工作项 -->
	</wf:workItemAction>
	<wf:workItemAction type="URL_TYPE" value="N">
		<input type="button" name="btUrlType" value="<b:message key="appointed_list_jsp.URLType"/>"
			onClick="alert('<b:message key="appointed_list_jsp.URLType"/>')" class="button"><!-- 自定义URL类型 -->
	</wf:workItemAction>
</wf:workItemActionList>

</body>
</html>
