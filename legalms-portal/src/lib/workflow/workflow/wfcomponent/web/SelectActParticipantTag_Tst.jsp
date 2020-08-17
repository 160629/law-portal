<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<body>
	 <form name="parForm">
			<p>&nbsp;&nbsp;<input type="text" name="selectedValue" value="" readonly="true" size="45">&nbsp;&nbsp;
 
				<wf:selectActParticipant processID="2" activityID="A" name="select" value=" <b:message key="select_act_participant_tag_tst_jsp.selectActParticipant"/> " form="parForm" 
				  output="selectedValue" maxNum="2" hidden="participants" hiddenType="PARTICIPANT" genScript="false" styleClass="button"/><!-- 选择活动参与者 -->
				   
			</p>    
		</form>
	</body>
</html>
		