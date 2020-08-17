<%@ page import="com.primeton.workflow.web.i18n.WebPageMessage"%>
<%@page import="com.eos.data.datacontext.DataContextManager"%>
<%
	String locale = DataContextManager.current().getCurrentLocale().toString();
 %>
<l:present property="pageCond">
	<h:hidden name="pageCond/begin" property="pageCond/begin"/>
	<h:hidden name="pageCond/length" property="pageCond/length"/>
	<h:hidden name="pageCond/isCount" property="pageCond/isCount"/>
	<h:hidden name="pageCond/count" property="pageCond/count"/>
	
	<l:greaterThan property="pageCond/count" targetValue="0">
	<l:equal property="pageCond/isCount" targetValue="true">
		<%=WebPageMessage.getString(locale,"Application.pagination.count") %>&nbsp;<b:write property="pageCond/count"/>&nbsp;
		<%=WebPageMessage.getString(locale,"Application.pagination.record") %>&nbsp;&nbsp;
		<%=WebPageMessage.getString(locale,"Application.pagination.currentpage") %>&nbsp;<b:write property="pageCond/currentPage"/>&nbsp;/&nbsp;<b:write property="pageCond/totalPage"/>&nbsp;
		<%=WebPageMessage.getString(locale,"Application.pagination.page") %>
		<l:equal property="pageCond/begin" targetValue="0">&nbsp;
		<span style="color: #999999;	text-decoration: none;">
		<%=WebPageMessage.getString(locale,"Application.pagination.head") %>&nbsp;|
		<%=WebPageMessage.getString(locale,"Application.pagination.previous") %>&nbsp;|
		</span>
		</l:equal> 
		
		<l:equal property="pageCond/isFirst" targetValue="false">
		<a href="javascript:firstPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.head") %></a>&nbsp;|
		<a href="javascript:prevPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.previous") %></a>&nbsp;|
		</l:equal>
		<l:equal property="pageCond/first" targetValue="false">
		<a href="javascript:firstPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.head") %></a>&nbsp;|
		<a href="javascript:prevPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.previous") %></a>&nbsp;|
		</l:equal>
		
		<l:equal property="pageCond/isLast" targetValue="true">
		<span style="	color: #999999;	text-decoration: none;">
		<%=WebPageMessage.getString(locale,"Application.pagination.next") %>&nbsp;|
		<%=WebPageMessage.getString(locale,"Application.pagination.tail") %>
		</span>
		</l:equal>
		<l:equal property="pageCond/last" targetValue="true">
		<span style="	color: #999999;	text-decoration: none;">
		<%=WebPageMessage.getString(locale,"Application.pagination.next") %>&nbsp;|
		<%=WebPageMessage.getString(locale,"Application.pagination.tail") %>
		</span>
		</l:equal>
		
		<l:equal property="pageCond/isLast" targetValue="false">
		<a href="javascript:nextPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.next") %></a>&nbsp;|
		<a href="javascript:lastPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.tail") %></a>
		</l:equal>
		<l:equal property="pageCond/last" targetValue="false">
		<a href="javascript:nextPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.next") %></a>&nbsp;|
		<a href="javascript:lastPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.tail") %></a>
		</l:equal>
		
	</l:equal>
	
	<l:equal property="pageCond/isCount" targetValue="false">
		<l:equal property="pageCond/begin" targetValue="0">&nbsp;
		<span style="	color: #999999;	text-decoration: none;">
		<a href="#" style="	color: #999999;	text-decoration: none;"><%=WebPageMessage.getString(locale,"Application.pagination.head") %></a>&nbsp;|
		<a href="#" style="	color: #999999;	text-decoration: none;"><%=WebPageMessage.getString(locale,"Application.pagination.previous") %></a>&nbsp;|
		</span>
		</l:equal> 
		
		<l:greaterEqual property="pageCond/begin" targetValue="1">
		<a href="javascript:firstPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.head") %></a>&nbsp;|
		<a href="javascript:prevPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.next") %></a>&nbsp;|
		</l:greaterEqual>
		
		<l:equal property="pageCond/isLast" targetValue="false">
		<a href="javascript:nextPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.next") %></a>
		</l:equal>
		<l:equal property="pageCond/last" targetValue="false">
		<a href="javascript:nextPage('pageCond',null,'<b:write property="action"/>','<b:write property="target"/>' )"><%=WebPageMessage.getString(locale,"Application.pagination.next") %></a>
		</l:equal>
	</l:equal>
	
	&nbsp;<input type='text' id='pageno' size='3' value='<b:write property="pageCond/currentPage"/>' class="textbox" style="width:30px" onkeypress="fun1(event,this);"/>
	&nbsp;<input type="button" value="GO" onclick="goPage();" style="width:38px;font-size:12" class="button"/>
	
	</l:greaterThan>
</l:present>
<l:notPresent property="pageCond">
	<h:hidden name="pageCond/begin" value="0"/>
	<h:hidden name="pageCond/length" value="10"/>
	<h:hidden name="pageCond/isCount" value="true"/>
	<h:hidden name="pageCond/count" value="0"/>
</l:notPresent>
<script>
	NS4 = (document.layers) ? true : false;
	function fun1(event,element){
		var code = 0;
	    if (NS4)
	        code = event.which;
	    else
        	code = event.keyCode;
        	
        if (code==13){
        	goPage();
        }
	}
	
	function goPage(){
	//FIXME: document.getElementById --> $id
		var num = $id("pageno").value; 
		var total = 0;
		<l:present property="pageCond/totalPage">
			total = <b:write property="pageCond/totalPage" />;
		</l:present>
		var numRegExp = /^[0-9]+$/;
      	if(numRegExp.test(num)){
      		if(total>0&&num>total)
      			num = total;
			gotoPage('pageCond',num,null,'<b:write property="action"/>','<b:write property="target"/>');
		}
		else{
			var message='<%=WebPageMessage.getString(locale,"Application.pagination.alertmessage") %>';
			alert(message);
		}
	}
	
</script>