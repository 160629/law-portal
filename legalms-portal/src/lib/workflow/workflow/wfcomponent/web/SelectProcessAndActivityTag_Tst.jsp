<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<body>
	 <form name="par4Form">
			<p>&nbsp;&nbsp;<input type="text" name="selectedValue4" value="" readonly="true" size="45">&nbsp;&nbsp;
				<wf:selectProcessAndActivity name="select" value=" <b:message key="select_process_and_activity_tag_tst_jsp.selectProcessAndAct"/> "  form="par4Form" 
				  output="selectedValue4" hiddenType="PROCESS" hidden="procAct" styleClass="button"/><!-- 选择流程和活动 -->
			</p> 
		</form>
	</body>
</html>