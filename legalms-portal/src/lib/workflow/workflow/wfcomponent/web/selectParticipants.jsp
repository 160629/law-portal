<%@ page language="java" pageEncoding="UTF-8"%>
<%@include file="/workflow/wfcomponent/web/common/common.jsp"%>
<%@ taglib uri="http://eos.primeton.com/tags/richweb" prefix="r"%>
<%@page import="com.eos.foundation.eoscommon.ResourcesMessageUtil"%>
<%
String organization = ResourcesMessageUtil.getI18nResourceMessage("select_participants_jsp.organization");
 %>

<%
	String root = request.getParameter("root") != null ?
					(String)request.getParameter("root") : null ;
	String maxNum = request.getParameter("maxNum") != null ?
					(String)request.getParameter("maxNum") : null ;
	String selectTypes = request.getParameter("selectTypes") != null ?
					(String)request.getParameter("selectTypes") : "" ;
%>
<script>
	function initParam () {
		return "<root><%=root%></root>" ;
	}
	
	function initParam2(node) {
		var id = node.getProperty('id') ;
		var type = node.getProperty('typeCode') ;
		return "<type>"+type+"</type><id>"+id+"</id>";
	}
	
	function refreshNode(node) {
		var type = node.getProperty('typeCode') ;
		//node.setLeaf();
		setNodeIcon(node,type);
		
	}
	
	function beforeMethodInvoke(node) {
		types = "<%=selectTypes %>" ;
		if(types == "") return true ;
		
		type = node.getProperty('typeCode') ;

		isMathType = types.match(type) ;
		if (isMathType == null) 
			return false; 
		
		return true ;
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
			alert("<b:message key="select_participants_jsp.select_add_content"/>");//请选择添加内容！
			return;
		}
		selectItem(curNode);
	}
</script>
<body onLoad="init()" style="overflow: hidden;overflow-x:no;overflow-y:auto;">
 <table width="428" class="workarea" height="100%"  cellpadding="0" cellspacing="0" style='table-layout:fixed;'>
  <tr>
    <th width="175" height="23" scope="col" style="vertical-align:middle;padding-top:3px;text-align:left;"><b:message key="select_participants_jsp.select_pater_resource"/></th><%-- 请选择参与者资源 --%>
    <th width="65" scope="col">&nbsp;</th>
    <th width="175" scope="col" style="vertical-align:middle; padding-top:3px; text-align:left; "><b:message key="select_participants_jsp.selected_pater_resource"/></th><%-- 已选择的参与者资源 --%>
  </tr>
  <tr>
    <td height="261" valign="top"  style="border:1px solid #CCCCCC;" bgcolor="#FFFFFF"> 
   		<div id="wins"  style="height:100%;width:100%;overflow:auto;"> 
   			<nobr>
			<r:rtree  hasRoot="true" id="tree">
				<r:treeRoot  display="<%=organization %>" action="com.primeton.eos.tag.WFTagComponent.selectParticipants.biz" 
				  initParamFunc="initParam" childEntities="participants" icon="/workflow/wfcomponent/web/images/participant/process_eos.gif"/><%-- 组织机构 --%>
				<r:treeNode  action="com.primeton.eos.tag.WFTagComponent.selectChilds.biz" showField="name" onDblclickFunc="selectItem"
				 onRefreshFunc="refreshNode"	initParamFunc="initParam2" nodeType="participants" childEntities="participants" icon="/workflow/wfcomponent/web/images/participant/role_view.gif,/workflow/wfcomponent/web/images/participant/role_view.gif"/>
			</r:rtree>  
			</nobr>
		</div>
     </td>
    <td><table border="0" width="100%">
    			<tr><td align="center"><input type="button" id="addBtn" style="width: 60px;text-align: center;" value="<b:message key="select_participants_jsp.add"/>" class="button" onclick="selectCurrentItem()"></td></tr><%-- 添加 --%>
				<tr><td align="center">&nbsp;</td></tr>
				<tr><td align="center"><input type="button" id="deleteBtn" class="button" style="width: 60px;text-align: center;" value="<b:message key="select_participants_jsp.delete"/>" onClick="DelOption('selectedPar')"></td></tr><%-- 删除 --%>
				<tr><td align="center"><input type="button" id="allDeleteBtn" class="button" style="width: 60px;text-align: center;" value="<b:message key="select_participants_jsp.delete_all"/>" onClick="DelAllOption('selectedPar')"></td></tr><%-- 全部删除 --%>
		</table>
	</td>
    <td valign="top" height="261" >
    <div id="wint"  style="height:100%;width:100%;"> 
    <select name="selectedPar" multiple="multiple" size="17" style="width: 100%;height: 100%;" class="select"> </select>
  	</div>
  	</td>
  </tr>

  <tr>
    <td align="center" colspan="4"  valign="baseline">
    <hr><br>
    <input type="button" id="okBtn" class="button" name="close" value="<b:message key="select_participants_jsp.ok"/>" onClick="closeWindowAndReturnValue('<%=maxNum%>')"><%-- 确定 --%>
			&nbsp;<input type="button" id="cancelBtn" class="button" name="close" value="<b:message key="select_participants_jsp.cancel"/>" onClick="closeWindowOnly()"><%-- 取消 --%>
	</td>
  </tr>
</table>
</body>