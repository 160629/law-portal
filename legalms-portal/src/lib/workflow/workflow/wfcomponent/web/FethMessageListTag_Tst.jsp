<%@ page import="com.eos.access.http.OnlineUserManager" %> 
<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ page import="com.eos.data.datacontext.UserObject" %> 
<%@page import="com.eos.data.datacontext.IUserObject"%>


<%
//用户的Session登入；
	UserObject uo = new UserObject();
	uo.setUserId("tiger");
	session.setAttribute(IUserObject.KEY_IN_CONTEXT,uo);
%>


<html>
	<head><title></title></head>
	<body>			
			
			
			
  <table class="EOS_table" border="0" style="border-collapse: collapse" id="plist">
     <tr class="EOS_table_head">
        <th ><b:message key="feth_message_list_tag_tst_jsp.activityDefinitionID"/></th><!-- 活动定义ID -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.activityInstanceID"/></th><!-- 活动实例ID -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.content"/></th><!-- 内容 -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.extensionInfo"/></th><!-- 扩展信息 -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.sourcesOfInfo"/></th><!-- 信息来源 -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.No"/></th><!-- 序号 -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.operationType"/></th><!-- 操作类型 -->
        <th ><b:message key="feth_message_list_tag_tst_jsp.time"/></th><!-- 时间 -->
        <th ><b:message key="appointed_list_jsp.workitemID"/></th><!-- 工作项ID -->
      </tr>
   <wf:fetchMessageList id="message" workItemID="2307">
      <tr class="EOS_table_row" >
        <td ><b:write property="actDefID" iterateId="message"/></td>   
        <td ><b:write property="actInstID" iterateId="message"/></td>
        <td ><b:write property="content" iterateId="message"/></td>
        <td ><b:write property="extendAttrs" iterateId="message"/></td>
        <td ><b:write property="from" iterateId="message"/></td>
        <td ><b:write property="index" iterateId="message" /></td>   
        <td ><b:write property="operateType" iterateId="message"/></td>   
        <td ><b:write property="time" iterateId="message" /></td>
        <td ><b:write property="workItemID" iterateId="message" /></td> 
      </tr>
   </wf:fetchMessageList>
 </table>

			       		
	</body>
</html>