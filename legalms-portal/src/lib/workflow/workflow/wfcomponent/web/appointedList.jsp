<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<%
	String workItemId = request.getParameter("id") != null ? (String)request.getParameter("id") : null ;
	String setParticipants = ResourcesMessageUtil.getI18nResourceMessage("appointed_list_jsp.settingParticipants");
%>
<html>
	<head><title></title>
		<script>
		
			function checkAll(){
				if(document.forms['appointedActivity'].sid != null){
					var isChecked = document.forms['appointedActivity'].operation.checked;
				if(document.forms['appointedActivity'].sid.length == undefined)
					document.forms['appointedActivity'].sid.checked = isChecked;				
				else
					for(i = 0;i<document.forms['appointedActivity'].sid.length;i++)
						document.forms['appointedActivity'].sid[i].checked = isChecked;		
				}
			}
			
			function setParticipant (parameter) 
			{
				showModalCenter("<%=request.getContextPath()%>/workflow/wfcomponent/web/setParticipant.jsp?"+parameter,null,function (returnValue){
					if (returnValue == true) {
						window.location.reload() ;
					}
				},'500','430','<b:message key="appointed_list_jsp.appointParticipant"/>')  ;//指派参与者
				
			}	
				
			function removeElement() 
			{	
				if ( !getSid ('appointedActivity') ) {
					return false ;
				} else {
					if (confirm('<b:message key="appointed_list_jsp.confirmDel"/>')) {//你确认要删除所选的活动吗？
						submitFrm();
					}
				}
			}
			
			function submitFrm () 
			{
				hs = new HideSubmit ("com.primeton.eos.tag.WFTagComponent.removeAppointedActivity.biz") ;
				hs.addParam("workItemId",'<%=workItemId%>') ;
				var sid = getSid('appointedActivity') ;
				var sidarray = new Array() ;
				sidarray = sid.split(",") ;
				
				for (var i=0;i<sidarray.length;i++) 
				{
					hs.addParam("activityDefId["+i+"]",sidarray[i]) ;
				}
				
				hs.submit();
				
				var success = hs.getValue("root/data/success");
				if (success == "true")
				{
					//parent.frames['appointed'].location.reload();
					parent.frames['appointed'].location="appointedList.jsp?id=<%=workItemId%>";
					parent.frames['unappointed'].location="unappointedList.jsp?id=<%=workItemId%>";
				}	
			}
		</script>
	</head>
	<body>
	  <form name="appointedActivity">
		<table border="1" cellpadding="0" cellspacing="0" align="center" width="100%">
			<tr height="20">
				<th align="center" nowrap="nowrap"><input type="checkbox" name="operation" value="checkbox" onClick="checkAll();"><b:message key="appointed_list_jsp.select"/></th><!-- 选择 -->
				<th align="center"><b:message key="appointed_list_jsp.activityDefinitionID"/></th><!-- 活动定义ID -->
				<th align="center"><b:message key="appointed_list_jsp.activityDefinitionName"/></th><!-- 活动定义名称 -->
				<th align="center"><b:message key="appointed_list_jsp.participantsAppointed"/></th><!-- 已指派的参与者 -->
				<th align="center"><b:message key="appointed_list_jsp.operation"/></th><!-- 操作 -->
			</tr>
			<wf:showAppointActivityList id="view" workItemID="<%=workItemId%>" appointed="true">
			<tr>
				<b:set name="id" iterateId="view" property="id"/>
				<td align="center"><input type="checkbox" name="sid" value='<b:write iterateId="view" property="id"/>'></td>
				<td align="center">&nbsp;<b:write iterateId="view" iterateId="view" property="id"/></td>
				<td align="center">&nbsp;<b:write iterateId="view" iterateId="view" property="name"/></td>
				<td align="center">&nbsp;
					<l:iterate id="participant" iterateId="view" property="appointedParticipants">
						<b:write iterateId="participant" property="participantName"/>&nbsp;
					</l:iterate>
				</td>
				<td align="center">&nbsp;
						<wf:setParticipant styleClass="button" name="setpar" value="<%=setParticipants%>" activityID='<%=(String)request.getAttribute("id")%>' workItemID="<%=workItemId%>"/><!-- 设置参与者 -->
				</td>
			</tr>
		</wf:showAppointActivityList>
		</table><br>
		<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%">
			<tr>
				<td width="8%" align="center"><a href="#" onclick="removeElement()"> <b:message key="appointed_list_jsp.del"/> </a></td><!-- 删除 -->
				<td colspan="4">&nbsp;</td>
			</tr>
		</table>
		</form>
	</body>
</html>