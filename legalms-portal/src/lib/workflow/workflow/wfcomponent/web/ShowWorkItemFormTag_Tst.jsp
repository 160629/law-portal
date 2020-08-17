<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<head><title></title></head>
	<body>
		 <h2 align="center">ShowWorkItemFormTag</h2>
			<table align="center" border="1" cellpadding="0" cellspacing="0" width="80%">
				<form name="xxx">
					<wf:showWorkItemForm id="view" workItemID="621" formName="xxx">
						<tr>
							<td align="center" width="5%">&nbsp;<b:write iterateId="view" property="name" filter="true"/></td>
							<td align="left">&nbsp;&nbsp;<b:write iterateId="view" property="htmlComponentCode" filter="false"/></td>
						</tr>   
					</wf:showWorkItemForm>
				</form>
			</table>
	</body>
</html>