<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<body>
	 <form name="par3Form">
			<p>&nbsp;&nbsp;<input type="text" name="selectedValue3" value="" readonly="true" size="45">&nbsp;&nbsp;
				
				<wf:selectAgentParticipant agentFrom="tiger" flatToLeaf="false" name="select" value=" <b:message key="select_agent_participant_tag_tst_jsp.selectAgents"/> "  form="par3Form" 
				  output="selectedValue3" hidden="participants3" hiddenType="ID" styleClass="button"/><!-- 选择代理人 -->
				  
			</p> 
		</form>
	</body>
</html>