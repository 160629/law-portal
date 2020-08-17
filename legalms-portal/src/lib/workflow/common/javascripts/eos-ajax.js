

/**
 * 创建一个xmlhttp,封装了跨浏览器的创建方法.
 * @return 返回xmlhttp对象.
 * @type XMLHttp
        [
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP',
        'Microsoft.XMLHTTP'
        ]
 */
function createXMLHttp(){
		if (window.XMLHttpRequest) return(new XMLHttpRequest());
		/*
		var arr_t = [
		"MSXML2.XMLHTTP.4.0",
		"MSXML2.XMLHTTP.3.0",
		"MSXML2.XMLHTTP.2.6",
		"MSXML2.XMLHTTP",
		"Microsoft.XMLHTTP",
		"MSXML.XMLHTTP"
		];
		*/
		var arr_t = [
			'MSXML2.XMLHTTP.3.0',
			'MSXML2.XMLHTTP',
			'Microsoft.XMLHTTP'
        ]
		for(var i=0; i<arr_t.length; i++) {
			try {
				xmlhttp_ver = arr_t[i];
				return new ActiveXObject(arr_t[i]);
			}catch(e) {}
		}
		return null ;
}

/*

1.17.	Ajax  
1.17.1.	引用方式
1.17.2.	校验规则
1.17.3.	onSuccess ()


1.17.4.	onFailure (exception)


1.17.5.	isSuccess ()



1.17.6.	getException ()


1.17.7.	getExceptionCode ()

1.17.8.	getExceptionMessage ()

1.17.9.	getExceptionInvalid ()


1.17.10.	addParam(key,value)


1.17.11.	submit()



1.17.12.	submitForm(form)
 

1.17.13.	submitXML(xml)


1.17.14.	getText()


1.17.15.	getValue(xpath)


1.17.16.	getValues(xpath)

1.17.17.	setForm(form)

1.17.18.	setObjectValue(object)

1.17.19.	cancel()





*/


/**
 * Ajax的构造函数,传入要调用的业务逻辑.
 * @class
 * @param {Object} url 要调用的业务逻辑.
 */

function Ajax(url, async){
	this.url = url;
	this.param = [];
	this.dataParam = [];
	this.method = "POST";
	this.encoding = Ajax.encoding||"utf-8";
	this.async = async || false;
	this.xmlParam = "";
	this.submitParam = null;
	this.isHTML = false;
	this.submitType = "xml";
	
	this.dataType=EOS.dataType;
	
	this.isCommonUrl=false;
	this.reset();
}
Ajax.prototype.setDataType=function(dt){
	this.dataType=dt||'xml';
	if(dt==='json'){
		this.submitType='json';
	}
}
/**
 * @private
 * 初始化参数的方法，内部调用,将添加的key=value的参数传入root/data/params节点下.
 */
Ajax.prototype.initParam = function(){
	if(this.dataType=='json'){
		this.setDataType('json');
		var paramData={
			params:{},
			data:{}
		};
		// var param={};
		// var data={};
		EOS.apply(paramData.params,EOS.json.objectArrayToJson(this.param));
		EOS.apply(paramData.data,this.xmlParam);
		EOS.apply(paramData.data,EOS.json.objectArrayToJson(this.dataParam));
		
		this.submitParam=paramData;
	}else{
		var paramStr = "";
		var paramResult = "<root>";
		for(var i=0;i<this.param.length;i++){
			var param = this.param[i];
			paramStr += "<param><key>" + xmlConversion(param.key) + "</key><value>" + xmlConversion(param.value) + "</value></param>";
		}
		paramResult += "<params>" + paramStr + "</params>\n";
		var data = this.xmlParam;
		
		if (this.dataParam && this.dataParam.length>0) {
			for (var i=0,len=this.dataParam.length; i<len; i++) {
				var dp=this.dataParam[i];
				data+=dp.value;
			}
		}
		if(data &&data.indexOf("<root><data>")==0){
			data =data.substr("<root><data>".length);
			data = data.substr(0,data.lastIndexOf("</data></root>"));
			//data = data.replace("</data></root>","");
			//alert(data)
		}

		paramResult += "<data>" + data + "</data></root>";
		this.submitParam = paramResult;
	}
}

Ajax.prototype.setAsync=function(isAsync){
    if(isAsync==null) isAsync=true;
    this.async=isAsync;
}


Ajax.prototype.wrapperUrl=function(){
	//return this.isCommonUrl ?this.url : this.url + ".ajax?_eosAjax=" + this.submitType + "&encoding=" + this.encoding + "&time=" + (new Date());
	if(this.isCommonUrl){
		return this.url;
	}
	var param=[];
	if(this.dataType=='json'){
		var params=this.submitParam.params;
		for(var p in params){
			param.push([
				p,'=',params[p]
			].join(''));
		}
	}
	param.push([
		'____r=',
		new Date()
	].join(''));
	
	return [
		this.url,
		this.dataType=='json'?'.ext':'.ajax',
		'?',
		param.join('&')
	].join('');
	
	//return this.isCommonUrl ?this.url : this.url + ".ext?time=" + (new Date());
}

Ajax.prototype.wrapperData=function(){
	

		/*  modified by weizj
			var sendDom = createXmlDom();
			sendDom.loadXML(sendXML);
			this.xmlHttp.send(sendDom);
		*/
		/**
		*@auth xiongshihong 解决不能发送%等特殊字符的问题
		*/
		/************start***********/
	//return "<?xml version=\"1.0\" encoding=\"" + this.encoding + "\"?>" + encodeURIComponent(this.submitParam) ;
		/************end***********/
	
	/**支持JSON的改造**/
	if(this.dataType=='json'){
		var data=this.submitParam.data;
		var params=this.submitParam.params;
		if(params){
			for(var p in params){
				data[p] = params[p];
			}
		}
		var d=EOS.json.toJSONString(data);
		if(d=='{}'){
			return '';
		}
		return d;
	}else{
		var submitParam=this.submitParam;
		if(typeof this.submitParam=='object'){
			submitParam=EOS.json.toXMLString(this.submitParam);
			//return "<?xml version=\"1.0\" encoding=\"" + this.encoding + "\"?>" + EOS.json.toXMLString(this.submitParam);
		}
		return "<?xml version=\"1.0\" encoding=\"" + this.encoding + "\"?>" +encodeURIComponent(submitParam);
	}
	
		/* return "<?xml version=\"1.0\" encoding=\"" + this.encoding + "\"?>" + this.submitParam ; */
}

/**
 * 提交参数的方法.
 * @param {Object} encoding 提交所用的编码,默认为utf-8
 */
Ajax.prototype.setRequestHeaders=function(){
	if(isMoz&&this.xmlHttp.overrideMimeType){
		this.xmlHttp.overrideMimeType("text/html;charset=utf-8");
	}
	if(this.dataType=='json'){
		this.xmlHttp.setRequestHeader("Content-Type", "application/json;charset=" + this.encoding);
	}else{
		this.xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=" + this.encoding);
	}
	
	this.xmlHttp.setRequestHeader("X-Requested-With", 'XMLHttpRequest');
	this.xmlHttp.setRequestHeader("_eosAjax", this.submitType);
	this.xmlHttp.setRequestHeader("encoding", this.encoding );

}

Ajax.prototype.reset=function(){

	//this.xmlHttp.onreadystatechange = function(){};
	this.retDom = null;
	this.responseText = null ;
	this.xmlHttp = createXMLHttp();
}

/*
【功能说明】
1.          发布状态:  public
2.          中止并取消当前的ajax请求
【输入参数】
1.          无
【返回值】
1.          无
【参考示例】
(略)
*/
Ajax.prototype.cancel=function(){
		if (!this.running) return this;
		this.running = false;
		this.xmlHttp.abort();
		this.reset();
		return this;
	}

/*
【功能说明】
1.          发布状态:  public
2.          判断此次调用是否成功.
【输入参数】
1.          无
【返回值】
1.          布尔型,true 成功, false 失败
*/
Ajax.prototype.isSuccess = function(){
	return !!!this.getException();
};

/*
【功能说明】
1.          发布状态:  public
2.          此次调用成功时执行的函数,默认什么都不做.开发者可通过重写此函数来实现特定功能. (通常在异步请求时使用).
【输入参数】
1.          无
【返回值】
1.          无
*/
Ajax.prototype.onSuccess = function(){};


/*
【功能说明】
1.          发布状态:  public
2.          此次调用失败或发生异常时执行的函数,默认显示异常信息.开发者可通过重写此函数来实现特定功能.
【输入参数】
1.          exception,字符串, 异常信息
【返回值】
1.          无
*/
Ajax.prototype.onFailure =function(exceptionXML){
	alert(AJAX_EXCEPTION + '\n\n'+exceptionXML);
};


Ajax.prototype.callBack = function(){
		var gotoLoginPage=false , loginPageUrl=null;
		var exceptionXML= this.getExceptionInvalid();
		if (exceptionXML===true || exceptionXML==="true")	{
			loginPageUrl= this.getLoginPage();
			if (loginPageUrl){
				gotoLoginPage=true;
			}
			exceptionXML= AJAX_EXCEPTION_INVALID+"\n\n"+this.url;
		}else{
			exceptionXML= this.getExceptionMessage() || this.getException() ;
		}
		if (gotoLoginPage /* && confirm( GOTO_LOGIN_PAGE ) */ ){
			if (window.contextPath && loginPageUrl.indexOf(window.contextPath+'/')!=0){
				loginPageUrl=window.contextPath+(loginPageUrl.indexOf('/')==0?'':'/')+loginPageUrl;
			}
			var topWin = _get_top_window();
			topWin.location=loginPageUrl;
			return;
		}
		if (exceptionXML && this.onFailure) {
			return this.onFailure(exceptionXML);
		}
		return this.onSuccess();
}




Ajax.prototype.onStateChange= function(){

		if ( !this.xmlHttp || this.xmlHttp.readyState != 4 || !this.running) return;
		
		try{
			$debug("\n return XML:\n " + EOSLog.formatXML(this.xmlHttp.responseText));
			this.responseText = this.xmlHttp.responseText ;
			this.status = this.xmlHttp.readyState;
			
			/**支持JSON的改造**/
			if(this.dataType=='json'){
				eval('var r='+this.responseText);
				this.retJson=r;
			}else{			
				this.retDom = createXmlDom();
				this.retDom.loadXML(this.responseText);
			}
			return this.callBack.apply(this,arguments );
		}catch(e){
			$handle(e);
			return this.onFailure(e);
		}finally{
			this.running = false;
			this.xmlHttp.onreadystatechange = function(){};
		}

	}


/*
【功能说明】
1.          发布状态:  public
2.          提交方法，将ajax对象中的参数提交给后台.
【输入参数】
1.          无
【返回值】
1.          无
【参考示例】
var myAjax= new Ajax('...url地址....');
myAjax.addParam('age',12);
myAjax.addParam('name','tom');
 
myAjax.submit (); 
var returnXMLDom = myAjax.retDom  // 返回后台传回的xml对应的xmldom

*/

Ajax.prototype.getParam = function(key) {
	for(var i=0;i<this.param.length;i++){
		var param = this.param[i];
		if (param.key==key) {
			return param.value;
		}
		//param.key , param.value
	}
}

Ajax.prototype.setOutParam = function(p) {
	this.addParam("__outParam",p);
}
Ajax.prototype.setParamsInfo = function(p) {
	this.addParam("__paramsInfo",p);
}
Ajax.prototype.setInoutParam = function(p) {
	this.addParam("__inoutParams",p);
}

Ajax.prototype.getOutParam = function() {
	return this.getParam("__outParam" );
}
Ajax.prototype.getParamsInfo = function() {
	return this.getParam("__paramsInfo" );
}
Ajax.prototype.getInoutParam = function() {
	return this.getParam("__inoutParams" );
}


Ajax.prototype.submit = function(encoding) {
	if (this.url && this.url.lastIndexOf(".beanx")==this.url.length-(".beanx").length ) {

		this.isCommonUrl=true;

	}else if (this.url && this.url.lastIndexOf(".cservice")==this.url.length-(".cservice").length ) {

		this.isCommonUrl=true;

	}else if (this.url && this.url.lastIndexOf(".__temp_service")==this.url.length-(".__temp_service").length ) {
		// 暂时没用 但是不要先删除

		//this.isCommonUrl=true;

		var idx1=this.url.lastIndexOf("/");
		var idx2=this.url.lastIndexOf(".kservice");
		
		var url=this.url.substring(idx1+1,idx2);
		idx1=url.lastIndexOf(".");

		var serviceName=url.substring(0,idx1);
		var operateName=url.substring(idx1+1);
		
		if (!this.xmlParam) {
			
			var __outParam = this.getParam("__outParam");
			var __inoutParams = this.getParam("__inoutParams");
			var __paramsInfo = this.getParam("__paramsInfo");

			var parames=[];

			if (!__paramsInfo) {
				__paramsInfo=[];
				for (var i=0;i<this.param.length;i++){
					var p=this.param[i];
					__paramsInfo.push(p.key);
				}
				__paramsInfo=__paramsInfo.join(',');
			}
			if (__paramsInfo.indexOf(",__outParam")==-1) {
				__paramsInfo+=",__outParam";
			}
			if (__paramsInfo.indexOf(",__inoutParams")==-1) {
				__paramsInfo+=",__inoutParams";
			}

			var keys=__paramsInfo.split(",");
			for (var j=0; j<keys.length; j++) {
				var key=keys[j];
				parames.push(this.getParam(key))
			}
			parames.push(__paramsInfo)
			this.param=[];
			this.xmlParam = ServiceCaller.submitXMLTemplate(serviceName,operateName,ServiceCaller.getSubmitXML(parames));		
		}

	}

	this.running=true;

	this.encoding = encoding|| this.encoding;
	this.initParam();

	try{

		var submitUrl = this.wrapperUrl();
		this.xmlHttp.open( this.method , submitUrl, this.async);

		var data=this.wrapperData();
		var me=this;
		if (this.async) {
			this.xmlHttp.onreadystatechange = function (){
				me.onStateChange.apply(me,arguments);
			}
		}
		this.setRequestHeaders();
		
		$debug("submit url:" + this.url + "\n submit XML:\n" + EOSLog.formatXML(data) );
		
		if(this.dataType=='json'){
			this.xmlHttp.send(data||null);
		}else{
			this.xmlHttp.send("__ajaxParam=" + encodeURIComponent(data));
		}

	    if (!this.async) {
			return this.onStateChange();
		}
	}catch(e){
		$error("xmlHttp ajax request error.");
		this.running=false;
	}

}

/**
 *获得ajax请求返回的xmlDom
 */
Ajax.prototype.getXMLDom = function(){
	if(this.retDom){
		return this.retDom;
	}
}

Ajax.prototype.getJSON=function(){
	if(this.retJson){
		return this.retJson;
	}
}
/**
 *获得ajax请求返回的文本
【功能说明】
1.          发布状态:  public
2.          取得返回数据的字符串.
【输入参数】
1.          xpath:要取值的xpath
【返回值】
1.          字符串,指定xpath下的节点的值
【参考示例】
var myAjax= new Ajax('...url地址....');
var value= myAjax.getText();

 */
Ajax.prototype.getText = function(){
	if(this.xmlHttp){
		return this.xmlHttp.responseText;
	}
}


/**
 * 根据xpath返回节点值的方法.
 * @param {Object} xpath

【功能说明】
1.          发布状态:  public
2.          取数据方法，根据xpath取xmlDom中的值。返回一个节点的值。
【输入参数】
1.          xpath:要取值的xpath
【返回值】
1.          字符串,指定xpath下的节点的值
【参考示例】
var myAjax= new Ajax('...url地址....');
var value= myAjax.getValue('/root/data/XXX/XXXX');


 */
Ajax.prototype.getValue = function(xpath)
{
	if (this.retDom == null) return null;
	if (xpath == null || xpath == "") return null;
	var field = this.retDom.selectSingleNode(xpath);
	if (field != null)
		return getNodeValue(field);
	else
		return null;
}
/**
 * 根据xpath获得一组值，并放入一个数组.
 * @param {Object} xpath
【功能说明】
1.          发布状态:  public
2.          取数据方法，根据xpath取xmlDom中的值。返回节点值的数组。
【输入参数】
1.          xpath:要取值的xpath
【返回值】
1.          字符串数组,指定xpath下的节点的值的数组
【参考示例】
var myAjax= new Ajax('...url地址....');
var values= myAjax.getValues('/root/data/XXX/XXXX');

 */
Ajax.prototype.getValues = function(xpath)
{
	var values = new Array();
	if (this.retDom == null) return values;
	if (xpath == null || xpath == "") return values;
	var fields = this.retDom.selectNodes(xpath);
	for (var i=0; i<fields.length; i++) {
		var field = fields[i];
		values[i] = getNodeValue(field);
	}
	return values;
}

/*
自动将服务端返回的多条结果转换成dataset
第一个参数 xpath 
第二个参数 是 生成的 dataset的name 如果不指定 将使用xpath作为name. 
*/
Ajax.prototype.getDataset = function(xpath,name){
	var name = name || xpath ;
	var dataset=new Dataset(name);
	dataset.init(  this.retDom.selectNodes(xpath) );
}

/**
 * 设置表单的值,遍历表单元素，根据表单元素设置表单的值.
 * @param {Object} form
【功能说明】
1.          发布状态:  public
2.          设置数据方法，系统自动根据它的input元素name在xmlDom中取相应的值，设置给input。
【输入参数】
1.          form:要设置的form对象
【返回值】
1.          无
【参考示例】
(略)

 */
Ajax.prototype.setForm = function(form,property)
{
	for (var i=0; i<form.elements.length; i++) {
		var elem = form.elements[i];
		this.setObjectValue(elem,null,property);
	}
}
/**
 * 设置单个表单项的值，根据表单项的类型，text,hidden,radio,checkbox,select-one,select-multiple
 * @param {Object} obj
 * @param {Object} property
【功能说明】
1.          发布状态:  public
2.          设置数据方法，根据对象的id或name取property，设置一个对象的innerHTML。
【输入参数】
1.          object:要设置的object对象
【返回值】
1.          无
【参考示例】
(略)

 */
Ajax.prototype.setObjectValue = function(obj,property,prefix)
{
	if (!(obj) || obj == null) return;
	var valuePath = property;
	       //modify by ton
			if (valuePath == null) {
		if (obj.name && obj.name != null && obj.name != "")
			if(prefix!=null) 
			   valuePath=prefix+"/"+ obj.name;
	          	else
			   valuePath = obj.name;
	}
	if (!(obj.type)) {
		if (valuePath == null) {
			if (obj.name && obj.name != "")
				valuePath = obj.name;
			else if (obj.id && obj.id != "")
				valuePath = obj.id;
		}
		if (valuePath != null) {
			var v = this.getProperty(valuePath);
			if (v != null)
				obj.innerText = v;
		}
		return;
	}
	/*if (valuePath == null) {
		if (obj.name && obj.name != null && obj.name != "")
			valuePath = obj.name;
	}*/
	if (valuePath != null) {
		if (obj.type == "text" || obj.type == "hidden") {
			var v = this.getProperty(valuePath);
			if (v != null)
				obj.value = v;
			return;
		}
		if (obj.type == "radio" || obj.type == "checkbox") {
			var fields = this.dom.selectNodes("root/data/" + valuePath);
			for (var j=0; j<fields.length; j++) {
				if (obj.value == fields[j].text)
					obj.checked = true;
				else
					obj.checked = false;
			}
			return;
		}
		if (obj.type == "select-one") {
			var v = this.getProperty(valuePath);
			for (var j=0; j<obj.options.length; j++) {
				if (v == obj.options[j].value)
					obj.options[j].selected = true;
			}
			return;
		}
		if (obj.type == "select-multiple") {
			var values = this.getValues("root/data/" + valuePath);
			if (values.length > 0) {
				for (var j=0; j<obj.options.length; j++) {
					obj.options[j].selected = false;
					for (var k=0; k<values.length; k++) {
						if (values[k] == obj.options[j].value)
							obj.options[j].selected = true;
					}
				}
			}
			return;
		}
	}
}

/**
 * 该方法用返回的html填充domObject的innerHTML内容.
 * @param {Object} domObject
 */
Ajax.prototype.Updater = function(domObject)
{
	this.isHTML = true;
	this.submitType = "html";
	this.submit("utf-8");
	var data = this.retDom.selectSingleNode("root/data");
	var result = getNodeValue(data);
	setInnerHTML(domObject,result);
}
/**
 * 向ajax请求添加参数的方法，请求的最后形式将会把参数放在root/data/params中.
 * @param {Object} key
 * @param {Object} value

【功能说明】
1.          发布状态:  public
2.          添加一个参数
【输入参数】
1.          key:参数的key,
2.          value:参数的值
【返回值】
1.          无
【参考示例】
var myAjax= new Ajax('...url地址....');
myAjax.addParam('age',12);
myAjax.addParam('name','tom');
 
myAjax.submit ();  
var returnXMLDom = myAjax.retDom  // 返回后台传回的xml对应的xmldom


 */
Ajax.prototype.addParam = function(key,value){
	if (value && value.toXMLString) {//说明此处传递的参数是XML
		this.setDataType('xml');
		
		value.name=key;
		this.dataParam.push({key:key,value:value.toXMLString()});
	}else{
		this.param.push({key:key,value:value});
	}	
	
}

/**
 * 清空请求参数的方法.
 */
Ajax.prototype.clearParam = function()
{
	this.param = [];
}

Ajax.prototype.getProperty= function(property)
{
	if (this.retDom == null) return null;
	if (property == null || property == "") return null;
	var field = this.retDom.selectSingleNode("root/data/" + property);
	if (field != null)
		return getNodeValue(field);
	else
		return null;
}


/**
 * 提交一个表单的内容的方法.
 * @param {Object} form
 * @param {Object} encoding

【功能说明】
1.          发布状态:  public
2.          提交方法，系统自动根据它的input元素name和value生成xml提交
【输入参数】
1.          form,对象,字符串 : 要提交的form对象或其id.
【返回值】
1.          无
【参考示例】
//会把  form里的数据 作为参数提交
 
var myAjax= new Ajax('...url地址....');

 var isSuc = myAjax.submitForm('fomrid');  // 是否成功
 
var returnXMLDom = myAjax.retDom  // 返回后台传回的xml对应的xmldom


 */
Ajax.prototype.submitForm = function(form,encoding){
	var param = "";
	form=$id(form);
	for (i=0; i<form.elements.length; i++) {
		var elem = form.elements[i];
		if (elem.type == "radio" || elem.type == "checkbox") {
			if (!elem.checked)
				continue;
		}
		if(elem.type=='application/x-shockwave-flash'){
			continue;
		}
		var name = form.elements[i].name || form.elements[i].id;
		var value = getElementValue(form.elements[i]);
		if(name){
			this.addParam(name,value);
		}
	}
	this.submit(encoding);
	if (this.retDom == null) return false;
	return true;
}


/**
 * 载入数据的方法，提交xmlStr,将Ajax的retDom属性设置为返回的结果.
 * @param {Object} xmlStr xml格式的字符串，程序自动加上root/data节点.
 */
Ajax.prototype.loadData = function(xmlStr){
	this.submitXML(xmlStr);
}


/**
 * 提交一段xml字符串内容的方法.
 * @param {Object} xmlStr
 * @param {Object} encoding

【功能说明】
1.          发布状态:  public
2.          提交方法，提交xml
【输入参数】
1.          xml:xml格式的字符串
【返回值】
1.          无
【参考示例】
(略)


 */
Ajax.prototype.submitXML = function(xmlStr,encoding) {
	if(xmlStr){
		if(this.dataType=='xml'&&typeof(xmlStr)=='object'){
			xmlStr=EOS.json.toXMLString(xmlStr);
		}
		this.xmlParam = xmlStr;
	}
	this.submit(encoding);
}


Ajax.prototype.getResponseXMLDom = function(){

	return this.retDom;
}


Ajax.prototype.getReturnNodeValue = function(xpath){
	var xmlDom=this.getResponseXMLDom()
	var nodes = xmlDom ? xmlDom.selectNodes(xpath):null;
	if (nodes && nodes.length>0){
		return getNodeValue(nodes[0]);
	}
	return null;
}


/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception节点内容.
【输入参数】
1.          无
【返回值】
1.          字符串, exception节点内容
*/
Ajax.prototype.getException = function(){
	var xpath='/root/exceptions';
	return this.getReturnNodeValue(xpath);

}

/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception code 节点内容.
【输入参数】
1.          无
【返回值】
1.          字符串, exception code节点内容
*/

Ajax.prototype.getExceptionCode = function(){
	var xpath='/root/exceptions/exception/code';
	return this.getReturnNodeValue(xpath);
}

/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception message 节点内容.
【输入参数】
1.          无
【返回值】
1.          字符串, exception message节点内容

*/
Ajax.prototype.getExceptionMessage = function(){
	var xpath='/root/exceptions/exception/message';
	return this.getReturnNodeValue(xpath);
}

/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception Invalid 节点内容.
	当该节点的内容为 false时,表示无权访问指定的资源(url或服务)
【输入参数】
1.          无
【返回值】
1.          字符串, exception Invalid节点内容
*/
Ajax.prototype.getExceptionInvalid = function(){
	var xpath='/root/exceptions/invalid';
	return this.getReturnNodeValue(xpath);
}

Ajax.prototype.getLoginPage = function(){
	var xpath='/root/exceptions/loginPage';
	var url=this.getReturnNodeValue(xpath);
	url = url? trim(url+'') : null;
	return url;
}

var HideSubmit = Ajax;


/*

ServiceCaller
	call ( serviceName , operateName , 参数1, 参数2 ......)
	callAsyn ( serviceName , operateName ,  参数1, 参数2 ......)
	getReturnValue ( category )


	getReturn()
	getException()


<root>
	<data>
	<ajaxCall>
		<serviceName>String</serviceName>
		<operateName>String</operateName>
		<params>
		</params>
		<exception>
		</exception>
	</ajaxCall>
	</data>
</root>

*/


/* 
此为eos提供的js类。 使用时通过  new ServiceCaller()获得其实例,通过对实例的使用来实现响应功能.
*/
 
function ServiceCaller(){
	this.service_URL_SUFFIX = ".service";
	this.ajax=null;
	this.encoding="utf-8";

}


ServiceCaller.submitXMLTemplate =function(serviceName,operateName,parames){

	var t=[
		'<root><data>',
		'	<ajaxCall>',
		'		<serviceName>'+ xmlConversion(serviceName) +'</serviceName>',
		'		<operateName>'+ xmlConversion(operateName) +'</operateName>',
		'		<params>',
			parames || '' ,
		'		</params>',
		'		<return></return>',
		'		<exception></exception>',
		'	</ajaxCall>',
		'</data></root>'
	];

	return t.join('\n');

}

ServiceCaller.getParamesArray = function(args, start, end){
	var p=[];
	args=args || [];
	end=end || args.length;

	for (var i=start; i< end ;i++ ){
		p.push(args[i]);
	}
	return p;
}


ServiceCaller.returnConversion =function(node) {

	var category = node.getAttribute("__category");
	var type = node.getAttribute("__type");

	if (category=='xml'){
		return node.xml;

	}else if (category=='entity'){
		return Dataset.initEntity(node);

	}else if (category=='dataset'){
		var dataset = new Dataset(node.tagName);
		dataset.init(node.childNodes);
		return dataset;

	}else if (category=='collection'){
		var nodes = node.selectNodes('./entry') //node.childNodes;
		var values=[];
		for(var i=0;i<nodes.length;i++){
			var node = nodes[i];
			if(node.nodeType==1 ){
				values.push( getNodeValue(node) );
			}
		}
		return values;
	}
	return getNodeValue(node);

}


ServiceCaller.parameConversion = function (param) {
	
	// param= param || '';
	
	var params = null,
	isNullOrEmpty = null;
	
	var paramType = typeof(param);
	
	var submitType = 'primeval';
	
	var result = {
		data : '',
		type : submitType
	};
	
	if (param === null || param === undefined) {
		isNullOrEmpty = "null";
	} else if (param === '') {
		isNullOrEmpty = "empty";
	}
	
	if (isNullOrEmpty) {
		result.data = '<value __isNullOrEmpty="' + isNullOrEmpty + '" />';
		result.type = submitType;
		return result;
	}
	
	// 如果参数是简单的字符串 数字 布尔型
	if (paramType == "string" || paramType == "number" || paramType == "boolean") {
		submitType = 'primeval';
		
		result.data = xmlConversion('' + param);
		
		// 如果参数是xmlDom对象
	} else if (paramType == "object" && param.xml && (param.async === false || param.async === true)) {
		submitType = 'xml';
		result.data = param.xml;
		
		// 如果参数是 Entity 对象
	} else if (param instanceof Entity) {
		submitType = 'entity';
		result.data = param.toXMLString(false);
		
	} else {
		
		// 如果参数是 Form 对象
		if (paramType == "object" && param.tagName && param.tagName.toUpperCase() == "FORM") {
			param = getFormElementsValue(param);
		}
		
		// 如果参数是 Dataset 对象
		if (param instanceof Dataset) {
			param = param.getEntities();
		}
		
		// 如果参数是 数组
		if (param instanceof Array) {
			submitType = 'collection';
			params = [];
			for (var i = 0; i < param.length; i++) {
				params.push(ServiceCaller.parameConversion(param[i]).data);
			}
			result.data = params.join('\n');
		} else {
			//如果以上都不是 则当作"key-value对"处理
			submitType = 'form';
			params = [];
			for (var key in param) {
				params.push('<property>');
				params.push('<key>');
				params.push(xmlConversion(key));
				params.push('</key>');
				params.push('<value>');
				params.push(xmlConversion(param[key] + ''));
				params.push('</value>');
				params.push('</property>');
			}
			result.data = params.join('\n');
			
		}
	}
	
	result.data = (submitType == 'collection' || submitType == 'form') ? result.data : '<value>' + result.data + '</value>';
	result.type = submitType;
	
	return result;
}



ServiceCaller.getSubmitXML =function(parames){
	var paramesXML=[] ;

	for (var i=0;i<parames.length;i++ ){

		result=ServiceCaller.parameConversion(parames[i]);
		paramesXML.push('<param __category="'+result.type+'">');
		paramesXML.push(result.data);
		paramesXML.push('</param>');
	}
	return paramesXML.join('\n');

}


/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception Invalid 节点内容.
	当该节点的内容为 false时,表示无权访问指定的资源(url或服务)
【输入参数】
1.          无
【返回值】
1.          字符串, exception Invalid节点内容
*/
ServiceCaller.prototype.callBack = function(){
		var gotoLoginPage=false , loginPageUrl=null;

		var exceptionXML= this.getExceptionInvalid();
		if (exceptionXML===true || exceptionXML==="true")	{
			loginPageUrl= this.getLoginPage();
			if (loginPageUrl){
				gotoLoginPage=true;
			}
			exceptionXML= AJAX_EXCEPTION_INVALID+"\n\n"+ this.serviceName +"."+this.operateName;
		}else{
			exceptionXML= this.getExceptionMessage() || this.getException() ;
		}
		if (gotoLoginPage /* && confirm( GOTO_LOGIN_PAGE ) */){
			if (window.contextPath && loginPageUrl.indexOf(window.contextPath+'/')!=0){
				loginPageUrl=window.contextPath+(loginPageUrl.indexOf('/')==0?'':'/')+loginPageUrl;
			}
			var topWin = _get_top_window();
			topWin.location=loginPageUrl;
			return;
		}
		if (exceptionXML && this.onFailure) {
			return this.onFailure(exceptionXML);
		}

		this.onSuccess();
		return this.getReturnValue();
}

ServiceCaller.prototype._callCore = function(serviceName , operateName,isAsyn, callBackFunc, parames){
	this.ajax = new Ajax(serviceName + this.service_URL_SUFFIX,isAsyn );
	this.ajax.callBack = callBackFunc || this.ajax.callBack ;

	var data=ServiceCaller.getSubmitXML(parames);
	this.serviceName=serviceName;
	this.operateName=operateName;
	this.ajax.submitXML(ServiceCaller.submitXMLTemplate(serviceName,operateName,data),this.encoding );

}

function form2Object(formObj,xpath){
	var param={};
	param = getFormElementsValue(formObj);
	var paramT=param;
	if (xpath){
		paramT={};
		xpath=xpath+'';
		xpath = xpath.lastIndexOf('/')==xpath.length-1?xpath:xpath+'/';
		if(xpath.indexOf("[*]")<0){
				for (var n in param ){
					if (n.indexOf(xpath)==0){
						paramT[n]=param[n];
					}
				}

		}else{
			var has=false;
			for (var n in param ){
				for(var i=1;i<Number.MAX_VALUE;i++){
					var _xpath = xpath.replace("[*]","[" + i + "]");
					if (n.indexOf(_xpath)==0){
						paramT[n]=param[n];
						break;
					}
				}
			}
		}

	}
	return paramT;
}


/*
【功能说明】
1.          发布状态:  public
2.          调用后台服务.
【输入参数】
1.	serviceName,字符串 : 调用的服务名
2.	operateName,字符串 : 调用的服务中的具体方法(对应服务的某一项功能)
3.	param1,param2.... , 类型可以是基本类型,entity,dataset,form对象,xml,集合, 可选,个数不固定,: 调用服务所提供的参数.
类型	描述	对应的java类型
primeval   	基本类型	基本类型
collection/dataset   	集合	Collection, 集合里面的元素为任意类型
entity   	实体	javabean/sdo/map
form	form元素	javabean/sdo/map
xml  	xml片段	W3C XMl Document
注意:
a) 如果参数本身是xml代码字符串,但是提交的时候不想作为字符串提交,而是作为xml片段提交,则使用 
createXmlDom (parame1) 代替 parame1.
b) 如果参数本身是一个form元素或form的id或form的name,那么请使用
form2Object(param1,xpath) 代替 param1. 其中参数xpath指定form中要提交的表单域的根xpath.
只有name以该xpath开头的表单域才会被作为参数提交.
函数form2Object是内部提供的一个js函数,主要用来将form转换成一组符合要求的参数.
【返回值】
1.          无
【参考示例】
var myCaller = new ServiceCaller();
myCaller.call( "myservice",
"method1",
               "param1",
$id('form1'), 
createXmlDom ("<root><data>123123</data></root>")
);

*/
ServiceCaller.prototype.call = function(serviceName , operateName, parames){
	this._callCore(serviceName , operateName, false,null, ServiceCaller.getParamesArray(arguments,2) );
	return this.callBack();
}


/*
【功能说明】
1.          发布状态:  public
2.          判断此次调用是否成功.
【输入参数】
1.          无
【返回值】
1.          布尔型,true 成功, false 失败
*/

ServiceCaller.prototype.isSuccess = function(){
	return !!!this.getException();
};


/*
【功能说明】
1.          发布状态:  public
2.          此次调用成功时执行的函数,默认什么都不做.开发者可通过重写此函数来实现特定功能. (通常在异步请求时使用).
【输入参数】
1.          无
【返回值】
1.          无
*/

ServiceCaller.prototype.onSuccess = function(){};

/*
【功能说明】
1.          发布状态:  public
2.          此次调用失败或发生异常时执行的函数,默认显示异常信息.开发者可通过重写此函数来实现特定功能.
【输入参数】
1.          exception,字符串, 异常信息
【返回值】
1.          无
*/
ServiceCaller.prototype.onFailure = function(exceptionXML){
	alert(AJAX_EXCEPTION + '\n\n ServiceCaller : '+exceptionXML);
};

/*
【功能说明】
1.          发布状态:  public
2.          以异步方式调用后台服务.
【输入参数】
1.	serviceName,字符串 : 调用的服务名
2.	operateName,字符串 : 调用的服务中的具体方法(对应服务的某一项功能)
3.	param1,param2.... , 类型可以是基本类型,entity,dataset,form,xml,集合, 可选,个数不固定,: 调用服务所提供的参数.
【返回值】
1.          无
【参考示例】
var myCaller = new ServiceCaller();
myCaller. onSuccess = myCallBack;
myCaller.callAsyn( "myservice","method1",  "param1");

// 后台服务myservice. method1执行完成后,如果成功,回执行该函数
function myCallBack() {
   alert(123);  
}
*/
ServiceCaller.prototype.callAsyn = function(serviceName , operateName, parames){
	var sc=this;
	this._callCore(
		serviceName , operateName, true,
		function(){ sc.callBack(); },
		ServiceCaller.getParamesArray(arguments,2)
		);
}


ServiceCaller.prototype.getResponseXMLDom = function(){

	return this.ajax.getResponseXMLDom();
}


/*
【功能说明】
1.          发布状态:  public
2.          取得服务的返回值.
【输入参数】
1.	无 
【返回值】
1.          服务的返回值
【参考示例】
var myCaller = new ServiceCaller();
myCaller.call( "myservice","method1",  "param1");
var myReturn = myCaller.getReturnValue( 'primeval' )
*/
ServiceCaller.prototype.getReturnValue = function(doConver, xmlDom){
	var xpath='/root/data/ajaxCall/return/value';
	xmlDom= xmlDom || this.getResponseXMLDom();
	var nodes =xmlDom ? xmlDom.selectNodes(xpath) : [];
	var values=[];

	for(var i=0;i<nodes.length;i++){
		var node = nodes[i];
		if(node.nodeType==1 ){
			node =  doConver===false ? node : ServiceCaller.returnConversion( node ) ;
			values.push(node);
		}
	}

	if (values.length==0){
		values = null;
	}
	/*else if (values.length==1){
		values = values[0];
	}*/
	return values;

}


ServiceCaller.prototype.getReturnNodeValue = function(xpath){
	return this.ajax?this.ajax.getReturnNodeValue(xpath):null;
}

/*
【功能说明】
1.          发布状态:  public
2.          取得服务的返回的信息中return节点下的所有内容.当服务端返回的结果较复杂,或者是用户个性化的信息时,通过此方法来取得所有return下的xml代码.用户可以处理.
【输入参数】
无
【返回值】
1.          服务返回的信息的return节点下的所有xml代码,字符串
【参考示例】
var myCaller = new ServiceCaller();
myCaller.call( "myservice","method1",  "param1");
var myReturn = myCaller.getReturn()
*/
ServiceCaller.prototype.getReturn = function(){
	var xpath='/root/data/ajaxCall/return';
	return this.getReturnNodeValue(xpath);
}


/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception节点内容.
【输入参数】
1.          无
【返回值】
1.   字符串, exception节点内容,服务返回的异常信息,无异常返回null.
【参考示例】
var myCaller = new ServiceCaller();
myCaller.call( "myservice","method1",  "param1");
var myException = myCaller.getException()
*/
ServiceCaller.prototype.getException = function(){
	var xpath='/root/data/ajaxCall/exceptions/ecxeption';
	return this.getReturnNodeValue(xpath);

}

/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception message 节点内容.
【输入参数】
1.          无
【返回值】
1.          字符串, exception message节点内容
*/
ServiceCaller.prototype.getExceptionMessage = function(){
	var xpath='/root/data/ajaxCall/exceptions/exception/message';
	return this.getReturnNodeValue(xpath);

}

/*
【功能说明】
1.          发布状态:  public
2.          取得返回的exception code 节点内容.
【输入参数】
1.          无
【返回值】
1.          字符串, exception code节点内容
*/
ServiceCaller.prototype.getExceptionCode = function(){
	var xpath='/root/data/ajaxCall/exceptions/exception/code';
	return this.getReturnNodeValue(xpath);
}


ServiceCaller.prototype.getExceptionInvalid = function(){
	var xpath='/root/data/ajaxCall/exceptions/invalid';
	return this.getReturnNodeValue(xpath);
}

ServiceCaller.prototype.getLoginPage = function(){
	var xpath='/root/data/ajaxCall/exceptions/loginPage';
	var url=this.getReturnNodeValue(xpath);
	url = url? trim(url+'') : null;
	return url;
}


