<!-- saved from url=(0022)http://internet.e-mail -->
<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8"%>
<%@page import="java.util.*,com.primeton.ext.engine.core.ValidateMessage"%>

<%
 Map<String,ValidateMessage> valdiateErrors = (Map <String,ValidateMessage>)request.getAttribute("__validateErrors");
  if(valdiateErrors == null){
   return;
  }
%>
<p>Data valdiate errors:</p>
<ol>
  <%for(String err:valdiateErrors.keySet()){%>
  <li><%=err%>&nbsp&nbsp<font color="red"><% String[] message =valdiateErrors.get(err).getAllErrorMessage(); for(String msg :message) out.print(msg+"&nbsp&nbsp"); %></font></li>
  <%}%>
</ol>