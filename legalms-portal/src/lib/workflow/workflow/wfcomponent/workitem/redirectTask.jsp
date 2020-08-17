<%@page import="com.primeton.ext.data.datacontext.DataContextImpl"%>
<%@page import="com.primeton.engine.core.impl.process.parameter.HttpParameterSet"%>
<%@page import="com.primeton.engine.core.impl.AbstractJavaPageflow"%>
<%@page pageEncoding="UTF-8" contentType="text/html; charset=UTF-8" %>
<%@page import="com.eos.engine.core.IVariable"%>
<%@page import="com.primeton.engine.core.impl.process.PageflowInstance"%>
<%@page import="java.util.StringTokenizer"%>
<%@page import="com.primeton.workflow.commons.utility.StringUtil"%>
<%@page import="com.primeton.engine.core.impl.context.PageflowRuntimeContext"%>
<%@page import="com.primeton.ext.engine.core.processor.*"%>
<%@page import="commonj.sdo.DataObject"%>
<%
    request.removeAttribute("_eosFlowAction");//去掉_eosFlowAction，Bug：10366
	String flowName = null;
	String queryString = null;
	String eosFlowAction = null; 
	String url = null;
	DataObject workitem = null;
	if(request.getAttribute("workitem")!=null){
		workitem = (DataObject)request.getAttribute("workitem");
		url = workitem.getString("actionURL");
	}
	
	if(url == null) throw new Exception("**自定义URL为空**");
	
	if(url.indexOf('?')!=-1){
		flowName = url.substring(0,url.indexOf('?'));
		queryString = url.substring(url.indexOf('?')+1);
	}else{
		flowName = url;
	}
	if(StringUtil.isNullOrBlank(flowName)) throw new Exception("**自定义URL为空**");
	
	Object relateData = request.getAttribute("relateData");
	
	PageflowRuntimeContext pc = new PageflowRuntimeContext();
	
	HttpParameterSet paramSet = new HttpParameterSet();
	if(StringUtil.isNotNullAndBlank(queryString)){
	
		String name = null;
		String value = null;
		
		String temp = null;
		
		StringTokenizer st = new StringTokenizer(queryString,"&");
		while(st.hasMoreTokens()){
			temp = st.nextToken();
			if(temp.indexOf("=")!=-1){
				name = temp.substring(0,temp.indexOf("="));
				value = temp.substring(temp.indexOf("=")+1);
				paramSet.setValue(name,value);
			}else{
				paramSet.setValue(temp,temp);
			}
		}
	}
	
	eosFlowAction = paramSet.getString("_eosFlowAction");
	PageflowInstance flowIns = DirectPageflowDispatcher.createFlowInstance(session,flowName);
	IVariable[] vars;
	AbstractJavaPageflow ins = (AbstractJavaPageflow) flowIns.getInstance();
    
    vars = ins.getActionVaribles(eosFlowAction);
    IVariable[] flowVariables = ins.getFieldVariables();
    if(flowVariables != null && flowVariables.length>0){
        IVariable[] newVars = new IVariable[vars.length+flowVariables.length];
        System.arraycopy(vars, 0, newVars, 0, vars.length);
        System.arraycopy(flowVariables, 0, newVars, vars.length, flowVariables.length);
        vars = newVars;
    }
	
	paramSet.build(vars,pc);
	
	pc.set("workitem",workitem);
	pc.set("relateData",relateData);
	pc.set("_flowID",flowName);
	
	pc.setFlowContext(new DataContextImpl("root",new java.util.HashMap()));
	
	DirectPageflowDispatcher.dispatch(request,response,pc);
%>