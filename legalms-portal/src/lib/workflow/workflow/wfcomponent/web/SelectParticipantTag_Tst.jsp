<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<body>
	 <form name="par2Form">
			<p>&nbsp;&nbsp;<input type="text" name="selectedValue2" value="" readonly="true" size="45">&nbsp;&nbsp;
				<wf:selectParticipant name="select" value=" <b:message key="select_participants_with_joint_jsp.selectParticipant"/> " root="role{roleb}" form="par2Form" 
				  output="selectedValue2" hidden="participants2" hiddenType="ID" styleClass="button"/><!-- 选择参与者 -->
			</p> 
		</form>
	</body>
</html>