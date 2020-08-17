<%@page import="java.io.*"%><%@page import="com.primeton.ext.access.http.IDownloadResource"%><%@page import="java.util.Map"%><%
	String fileId = request.getParameter("id");
	if (!fileId.startsWith("download"))
		return;
	Map<String, IDownloadResource> eosDownFileList = (Map<String, IDownloadResource>) session
			.getAttribute("EosDownFileList");
	IDownloadResource dr=	eosDownFileList.get(fileId);
	if(dr.isWebResource())
	{
	response.sendRedirect(((HttpServletRequest)pageContext.getRequest()).getContextPath()+dr.getWebPath());
	return;
	}
	String contentType = dr.getContentType();
	String filename = dr.getOutputFileName();
	byte[] output=dr.getBytes();
	response.setContentType(contentType);
	response.setHeader("Content-disposition", "attachment; filename="
			+ new String(filename.getBytes("GBK"),"ISO_8859_1"));
	BufferedOutputStream bos = null;
	try {
		bos = new BufferedOutputStream(response.getOutputStream());
		bos.write(output, 0, output.length);
	} catch (final IOException e) {
		System.out.println("IOException." + e);
	} finally {
		if (bos != null)
			try {
		bos.close();
			} catch (IOException e) {
		// TODO Auto-generated catch block
		e.printStackTrace();
			}
	}
%>