<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<head><title></title>
	</head>
	<%
		String workItemId = request.getParameter("id") != null ?
			(String)request.getParameter("id") : null ;
	%>
	<script>	
	
			function checkAll(){
				if(document.forms['activityForm'].sid != null){
					var isChecked = document.forms['activityForm'].operation.checked;
				if(document.forms['activityForm'].sid.length == undefined)
					document.forms['activityForm'].sid.checked = isChecked;				
				else
					for(i = 0;i<document.forms['activityForm'].sid.length;i++)
						document.forms['activityForm'].sid[i].checked = isChecked;		
				}
			}
			
			function submitForm() {
				
				hs = new HideSubmit ("com.primeton.eos.tag.WFTagComponent.appointActivity.biz") ;
				
				hs.addParam("workItemId",'<%=workItemId%>') ;
				
				if (!getSid('activityForm'))
					return false;
					
				var sid = getSid('activityForm') ;
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
			
			function closeWindow()  {
				if (confirm('<b:message key="un_appointed_list_jsp.windowClose"/>')) {//当前操作将关闭此窗口，确认要继续吗？
					parent.window.close();
				}
			}
	</script>	 
	<body>
		<form name="activityForm"><%int flag=0; %>
			<table border="1" cellpadding="0" cellspacing="0" class="EOS_table" align="center" width="100%">
				<tr height="20">
					<th width="10%" align="center" ><input type="checkbox" name="operation" value="checkbox" onClick="checkAll();"><b:message key="un_appointed_list_jsp.select"/></th><!-- 选择 -->
					<th align="center"><b:message key="appointed_list_jsp.activityDefinitionID"/></th><!-- 活动定义ID -->
					<th align="center"><b:message key="appointed_list_jsp.activityDefinitionName"/></th><!-- 活动定义名称 -->
				</tr> 
				<wf:showAppointActivityList id="view" workItemID="<%=workItemId%>" appointed="false">
					<tr> 
						<b:set name="id"  iterateId="view" property="id"/>
						<b:set name="name"  iterateId="view" property="name"/>
						<td align="center"><input type="checkbox" name="sid" value="<b:write iterateId="view" property="id"/>"></td>
						<td align="center"><b:write iterateId="view" property="id"/></td>
						<td align="center"><b:write iterateId="view" property="name"/></td>
					</tr><%flag++; %>
				</wf:showAppointActivityList>
					<%for(; flag<5;flag++){ %>
					<tr><td></td><td></td><td></td><tr>
					<%} %>
			</table><br>
			<table border="0" cellpadding="0" cellspacing="0" align="center" width="100%">
				<tr align="center">
					<td>
						<input type="button" class="button" name="ok" value=" <b:message key="select_activity_participants_jsp.ok"/> " onclick="submitForm()">&nbsp;&nbsp;<!-- 确定 -->
						<input type="button" class="button" name="cancel" value=" <b:message key="un_appointed_list_jsp.close"/> " onclick="closeWindow()"><!-- 关闭 -->
					</td>
				</tr>
			</table>
		</form>
	</body>
</html>