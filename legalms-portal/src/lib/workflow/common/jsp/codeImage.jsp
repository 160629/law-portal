<%@page import="java.util.*"%>
<%@page import="java.io.*"%>
<%@page import="java.io.FileInputStream,java.io.File"%><%@page import="com.primeton.web.core.control.util.VerifyCode"%>
<%
out.clear();
out = pageContext.pushBody();
String name=request.getParameter("name");
String lenght=request.getParameter("length");
String type=request.getParameter("type");
String imageHeight=request.getParameter("imageHeight");
byte[] output=VerifyCode.generate(name,Integer.parseInt(lenght),  type,
			 Integer.parseInt(imageHeight), session);
response.setContentType("image");
BufferedOutputStream bos = null;
try {
bos = new BufferedOutputStream(response.getOutputStream());
bos.write(output,0,output.length);
} catch(final IOException e) {
System.out.println ( "����IOException."+ e );
} finally {
if (bos != null)
bos.close();
}
%>

