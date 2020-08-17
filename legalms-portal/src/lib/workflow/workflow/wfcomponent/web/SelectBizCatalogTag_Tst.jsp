<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<html>
	<body>
	 <form name="par4Form">
			<p>&nbsp;&nbsp;<b:message key="select_biz_catalog_tag_tst_jsp.bizCatalog"/><input type="text" name="selectedValue4" value="" readonly="true" size="45">&nbsp;&nbsp;
				<wf:selectBizCatalog name="select" value=" <b:message key="select_biz_catalog_tag_tst_jsp.selectBizCatalog"/> " maxNum="1" hiddenType="bizCatalog" hidden="bizCata" form="par4Form" output="selectedValue4" styleClass="button"/><!-- 选择业务目录 -->
			</p><!-- 业务目录： --> 
		</form>
	</body>
</html>