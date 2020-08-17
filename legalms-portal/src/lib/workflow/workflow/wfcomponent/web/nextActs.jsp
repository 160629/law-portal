<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<%
	String workItemId = request.getParameter("workItemId") != null ? (String)request.getParameter("workItemId") : null ;
	String settingParticipants = ResourcesMessageUtil.getI18nResourceMessage("appointed_list_jsp.settingParticipants");
%>
<html>
	<head><title></title>
		<script>
			function setParticipant (parameter) 
			{
				var href=window.location.href+"?workItemId="+<%=workItemId%>;
				showModalCenter("<%=request.getContextPath()%>/workflow/wfcomponent/web/setParticipant.jsp?"+parameter,null,function (returnValue){
					if (returnValue == true) {
						window.location.href=href;
					}
				},'500','430','<b:message key="appointed_list_jsp.appointParticipant"/>')  ;//指派参与者
				
			}
				
		</script>
	</head>
	<body>
	<table border="0" class="EOS_panel_body" width="100%">
        <tr>
          <td class="EOS_panel_head"><b:message key="next_acts_jsp.appointSucceedActParticipant"/> </td><!-- 指派后继活动参与者 -->
        </tr>
        <tr>
          <td>
	  	<form name="appointedActivity">
		<table border="0" cellpadding="0" cellspacing="0" align="center" class="EOS_table" width="100%">
			<tr class="EOS_table_head" align="center">
				<th align="center"><b:message key="appointed_list_jsp.activityDefinitionID"/></th><!-- 活动定义ID -->
				<th align="center"><b:message key="appointed_list_jsp.activityDefinitionName"/></th><!-- 活动定义名称 -->
				<th align="center"><b:message key="appointed_list_jsp.participantsAppointed"/></th><!-- 已指派的参与者 -->
				<th width="13%" align="center"><b:message key="appointed_list_jsp.operation"/></th><!-- 操作 -->
			</tr>
			<%int flag = 0; %>
			<l:iterate id="act" property="acts">
			<tr class="EOS_table_row" onmouseover="this.className='EOS_table_selectRow'" onmouseout="this.className='EOS_table_row'">
				<b:set name="id" iterateId="act" property="id"/>
				<td align="center">&nbsp;<b:write iterateId="act" property="id"/></td>
				<td align="center">&nbsp;<b:write iterateId="act" property="name"/></td>
				<td align="center">&nbsp;
					<l:iterate id="participant" iterateId="act" property="appointedParticipants">
						<b:write iterateId="participant" property="participantName"/>&nbsp;
					</l:iterate>
				</td>
				<td align="center">&nbsp;
					<wf:setParticipant name="setpar" value="<%=settingParticipants%>" styleClass="button" activityID='<%=(String)request.getAttribute("id")%>' workItemID="<%=workItemId%>"/><!-- 设置参与者 -->
				</td>
			</tr>
			<%flag++; %>
			</l:iterate>
			<%for(int i = flag;i <10;i++ ){ %>
            <tr class="EOS_table_row"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>
            <%} %>
		</table>
		</form>
		</td>
        </tr>
      </table>
	</body>
</html>