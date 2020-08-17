<%@ page language="java" contentType="text/html;charset=UTF-8" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>

<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<%
	
	String maxNum = request.getParameter("maxNum") != null ?
					(String)request.getParameter("maxNum") : null ;
	String showTitle = ResourcesMessageUtil.getI18nResourceMessage("select_biz_catalog_jsp.biz_catalog");//业务目录

%>
<script> 
	function initParam (node) {
		var id = node.getProperty('catalogUUID') ;
		return "<catalogUUID>"+id+"</catalogUUID>";
	}
	
	function AddOptionItem(participant, DestList,vlLabel)
	{
	
		var bFound;
		if(!(typeof DestList == 'object')) {
			//FIXME:document.all --> $e
			var List = $e(DestList);
		} else {
			var List = DestList ;
		}
		var ListLen;
		ListLen = List.options.length;
		bFound = false;
		if( ListLen > 0)
		{
 
			for(i = 0; i < ListLen; i++)
			{
				if( List.options[i].value == participant.id ||
				   List.options[i].value == participant.name)
				{
					bFound=true;
					break;
				}
			}
		}
		if(!bFound)
		{
			var oOption=document.createElement("OPTION");
			oOption.text=participant.name;
			oOption.title=participant.name;
			if(!vlLabel) {
				oOption.value=participant.id;
			} else {
				oOption.value=participant.id+"&"+participant.name+"&"+participant.type;
			}
			var maxn='<%=maxNum %>';
			if(maxn==1){
			    List.remove(0);
			    returnValues.pop();
			}
			List.options.add(oOption);
			returnValues.push(participant);
		}
	}
	
	function selectCurrentItem () {
		var curNode = tree.getSelectNode();
		if (curNode == null) {
			alert("<b:message key="select_biz_catalog_jsp.select_add_content"/>");//请选择添加内容！
			return;
		}
		selectBizCataLogItem(curNode);
	}
</script>
<body onload="init()" style="overflow: hidden;overflow-x:no;overflow-y:auto;">
 <table width="428" class="workarea" height="100%"  cellpadding="0" cellspacing="0" style='table-layout:fixed;'> 
	<tr>
	    <th width="175" height="23" scope="col" style="vertical-align:middle;padding-top:3px;text-align:left;"><b:message key="select_biz_catalog_jsp.please_select"/><%=showTitle%></th><%-- 请选择 --%>
	    <th width="65" scope="col">&nbsp;</th>
	    <th width="175" scope="col" style="vertical-align:middle; padding-top:3px; text-align:left; "><b:message key="select_biz_catalog_jsp.selected"/><%=showTitle%></th><%-- 已选择的 --%>
	</tr>
	<tr>
		 <td height="260" valign="top"  style="border:1px solid #CCCCCC;" bgcolor="#FFFFFF">
		 	<div id="wins"  style="height:260px;width:100%;overflow:auto;"> 
		 	 <nobr>
			 <r:rtree  hasRoot="true" id="tree" width="100%" height="100%">
				<r:treeRoot  display="<%=showTitle%>" action="com.primeton.eos.tag.WFTagComponent.getRootBizCatalog.biz" 
				  childEntities="secondBizCatalogList"/>
				  
				<r:treeNode  showField="catalogName" action="com.primeton.eos.tag.WFTagComponent.getSecondBizCatalog.biz"  
					initParamFunc="initParam" onDblclickFunc="selectBizCataLogItem"
					nodeType="secondBizCatalogList" childEntities="subAreaBizcatalogList" 
					icon="/workflow/wfcomponent/web/images/participant/bizcatalog.png"/>
					 
				<r:treeNode  showField="catalogName" action="com.primeton.eos.tag.WFTagComponent.getAreaSubBizCatalog.biz"
						initParamFunc="initParam" onDblclickFunc="selectBizCataLogItem"
						nodeType="subAreaBizcatalogList" childEntities="subAreaBizcatalogList"
						icon="/workflow/wfcomponent/web/images/participant/bizcatalog.png"/>
			</r:rtree> 
			</nobr> 
			</div>
		</td>
		
		<td >
			<table border="0" width="100%">
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" value="<b:message key="select_biz_catalog_jsp.add"/>" class="button" onclick="selectCurrentItem()"></td></tr><%-- 添加 --%>
				<tr><td align="center">&nbsp;</td></tr>
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" value="<b:message key="select_biz_catalog_jsp.delete"/>" class="button" onclick="DelOption('selectedPar')"></td></tr><%-- 删除 --%>
				<tr><td align="center"><input type="button" style="width: 60px;text-align: center;" value="<b:message key="select_biz_catalog_jsp.all_delete"/>" class="button" onclick="DelAllOption('selectedPar')"></td></tr><%-- 全部删除 --%>
			</table>
		</td>
		<td align="center" valign="top">
			<select name="selectedPar" multiple="multiple" size="17" style="width:180px"> </select>
		</td>
	</tr>
	<tr><td colspan="4"><hr></td></tr>
	<tr>
		<td align="center" colspan="4">
			<input type="button" name="close" style="width: 60px;text-align: center;" value="<b:message key="select_biz_catalog_jsp.ok"/>" class="button" onclick="closeWindowAndReturnValue('<%=maxNum%>')"><%-- 确定 --%>
			<input type="button" name="close" style="width: 60px;text-align: center;" value="<b:message key="select_biz_catalog_jsp.cancel"/>" class="button"  onclick="closeWindowOnly()"><%-- 取消 --%>
		</td>
	</tr>
</table>
</body>