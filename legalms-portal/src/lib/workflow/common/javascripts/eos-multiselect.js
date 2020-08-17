
function MultiSelect(id){
	this.id = id;
	this.container = $id(this.id + "_container");
	this.container.onmousedown=function(){eventManager.stopPropagation();}
	this.value = null;
	this.select = $id(this.id + "_select");
	this.hiddenInput = null;
	this.splitChar = ",";
	this.jsonObj=null;
	PageControl.add(id,this);
}

/**
 * 初始化MultiSelect的方法.
 */
MultiSelect.prototype.init = function(){
	//this.container = $id(this.id + "_container");
	this.hiddenInput = $id(this.id  + "_hidden");
	//this.select = $id(this.id + "_select");
	//this.refreshInput();
	this.initEvent();
}
/**
 * 初始化input的事件.
 */
MultiSelect.prototype.initEvent = function(){
	var mutiselect = this;
	function select_click(){
		mutiselect.refreshValue();
	}
	eventManager.add(this.select,"change",select_click);
}
/**
 * 刷新checkbox值的方法.
 */
MultiSelect.prototype.refreshInput = function(){
	str = this.value + this.splitChar;
	if(this.hiddenInput){
		this.hiddenInput.value = this.value;
	}
	for(var i=0;i<this.select.options.length;i++){
		var option = this.select.options[i];
		var substr = option.value + this.splitChar;
		if(str.indexOf(substr)>-1){
			option.selected = true;
		}else{
			option.selected = false;
		}
	}
}
/**
 * 刷新隐含输入框值的方法.
 */
MultiSelect.prototype.refreshValue = function(){
	var v=[];
	var ops=this.select.options;
	for(var i=0,len=ops.length;i<len;i++){
		var op=ops[i];
		
		if(op.selected){
			v.push(op.value);
		}
	}
	
	this.value=v.join(this.splitChar);
	
	if(this.hiddenInput){
		this.hiddenInput.value = str;
	}
	
	
	/* 
	var str = "";
	for(var i=0;i<this.select.options.length;i++){
		var option = this.select.options[i];
		if(option.selected){
			str += option.value + this.splitChar;
		}
	}
	if(str.length>1){
		str = str.substr(0,str.length-1);
	}
	this.value = str;
	if(this.hiddenInput){
		this.hiddenInput.value = str;
	} */
}
/**
 * 设置MultiSelect的值.
 * @param {Object} value
 */
MultiSelect.prototype.setValue = function(value){
	this.hiddenInput.value = value;
	this.refreshInput();
}
/**
 * 获取MultiSelect的值.
 */
MultiSelect.prototype.getValue = function(){
	this.refreshValue();
	return this.value;
}
/**
 * 设置焦点.
 */
MultiSelect.prototype.setFocus = function(){

}
/**
 * 失去焦点.
 */
MultiSelect.prototype.lostFocus = function(){

}
/**
 * 显示控件(在datacell中使用)
 */
MultiSelect.prototype.showEditor = function(){
   var zIndex = getMaxZindex();
   this.container.style.zIndex = zIndex;
   this.container.style.display="";

}
/**
 * .隐藏控件(在datacell中使用)
 */
MultiSelect.prototype.hideEditor = function(){
	this.container.style.display="none";

}
/**
 * .设置控件位置(在datacell中使用)
 */
MultiSelect.prototype.setPosition = function(left,top,width,height){

		this.container.style.position="absolute";
		this.container.zIndex=9999;
		this.container.style.left=left + "px";
		this.container.style.top=top + "px";
		this.container.style.width=width + "px";
		//this.container.style.height=height + "px";
}
/**
 * .是否处于激活状态(在datacell中使用)
 */
MultiSelect.prototype.isFocus = function(){
	return true;

}
/**
 * .是否校验通过(在datacell中使用)
 */
MultiSelect.prototype.validate = function(){
	return true;

}

//可由用户定义的显示分格符
EOS_DICT_DISPLAY_SEPERATOR=null;
/**
 * .得到显示值(在datacell中使用)
 */
MultiSelect.prototype.getDisplayValue = function(value){
	if (value == null) {
		value = this.getValue();
	}
	if (value === '') {
		return '';
	}
	var seperator;
	//获得显示分格符
	if (EOS_DICT_DISPLAY_SEPERATOR)
		seperator = EOS_DICT_DISPLAY_SEPERATOR;
	else
		seperator = this.splitChar;
	
	//从json对象中获得value相对应的名称
	var values = value.split(seperator);
	
	var text=[];
	for(var i=0,len=values.length;i<len;i++){
		text.push(this.jsonObj[values[i]] || values[i]);
	}
	return text.join(seperator);
		
		
		
		
	/* var str = "";
	for (var i = 0; i < values.length; i++) {
		str = str + (this.jsonObj[values[i]] || values[i]) + seperator;
	}
	if (str.length > 1) {
		str = str.substr(0, str.length - 1);
	}
	return str; */
}