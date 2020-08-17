/**
 * MutiBox的构造函数.
 * @param {Object} id
 */

function DictRadioGroup(id){
	this.id = id;
	this.value = null;
	this.container = $id(this.id + "_container");
	this.radioes = this.container.getElementsByTagName("input");
	this.container.onmousedown=function(){eventManager.stopPropagation();}
	this.hiddenInput = new Object();
	this.jsonObj=null;
	this.initEvent();
	PageControl.add(id,this);

}
/**
 * 初始化DictRadioGroup的方法.
 */
DictRadioGroup.prototype.init = function(){
	//this.container = $id(this.id + "_container");
	//this.hiddenInput = $id(this.id);
	//this.radioes = $ids(this.id + "_radio[*]");
	//this.refreshInput();
	
}
/**
 * 初始化input的事件.
 */
DictRadioGroup.prototype.initEvent = function(){
	var RadioGroup = this;

	
	function radio_click(){
		EOS.event.fireEvent(RadioGroup.id,'change');
	
		RadioGroup.refreshValue();
	}
	for(var i=0;i<this.radioes.length;i++){
		var radio = this.radioes[i];
		eventManager.add(radio,"click",radio_click);
	}
	eventManager.add(this.container,"keypress",radio_click);
}

/**
 * 刷新RadioGroup值的方法.
 */
DictRadioGroup.prototype.refreshInput = function(){
	str = this.hiddenInput.value;
	for(var i=0;i<this.radioes.length;i++){
		var radio = this.radioes[i];

		if(radio.value==str){
			radio.checked = true;
		}else{
			radio.checked = false;
		}
	}
}

/**
 * 刷新隐含输入框值的方法.
 */
DictRadioGroup.prototype.refreshValue = function(){
    var str;
	for(var i=0;i<this.radioes.length;i++){
		var radio = this.radioes[i];
		if(radio.checked){
			
			str = radio.value;
			break;
		}
	}
	//var ov=this.hiddenInput.value;
	
	this.hiddenInput.value = str;
	
	
}
/**
 * 设置DictRadioGroup的值.
 * @param {Object} value
 */
DictRadioGroup.prototype.setValue = function(value){

	EOS.event.fireEvent(this.id,'change');
	this.hiddenInput.value = value;
	this.refreshInput();
}
/**
 * 获取DictRadioGroup的值.
 */
DictRadioGroup.prototype.getValue = function(){

	this.refreshValue();
	return this.hiddenInput.value;
}
/**
 * 设置焦点.
 */
DictRadioGroup.prototype.setFocus = function(){
var hasDefaultValue=false;
for(var i=0;i<this.radioes.length;i++){
		var radio = this.radioes[i];

		if(radio.checked==true)
			{
			radio.focus();
			hasDefaultValue=true;
			break;
		}
  if(!hasDefaultValue) this.radioes[0].focus();
	
	}
}
/**
 * 失去焦点.
 */
DictRadioGroup.prototype.lostFocus = function(){

}

/**
 * 显示控件(在datacell中使用)
 */
DictRadioGroup.prototype.showEditor = function(){
   var zIndex = getMaxZindex();
   this.container.style.zIndex = zIndex;
   this.container.style.display="";
   addClass(this.container.firstChild,"dict_comp");
    if(this.isDcEdit==true)
   { 
     var shadowPanel=this.container.firstChild;
  	 shadowPanel.style.width=shadowPanel.firstChild.offsetWidth;
	 initShadow(shadowPanel)
	 }
   this.setFocus();

}
/**
 * .隐藏控件(在datacell中使用)
 */
DictRadioGroup.prototype.hideEditor = function(){
	this.container.style.display="none";

}
/**
 * .设置控件位置(在datacell中使用)
 */
DictRadioGroup.prototype.setPosition = function(left,top,width,height){
		
		this.container.style.position="absolute";
		this.container.zIndex=9999;
		this.container.style.left=left + "px";
		this.container.style.top=top + "px";
		//this.container.style.width=width + "px";
		//this.container.style.height=height + "px";
}
/**
 * .是否处于激活状态(在datacell中使用)
 */
DictRadioGroup.prototype.isFocus = function(){
	return true;

}
/**
 * .是否校验通过(在datacell中使用)
 */
DictRadioGroup.prototype.validate = function(){
	return true;

}

/**
 * .得到显示值(在datacell中使用)
 */
DictRadioGroup.prototype.getDisplayValue = function(value){
if (value==null)
	{
		value=this.getValue();
	}

	if (!this.jsonObj){
		return value;
	}
	var _value=this.jsonObj[value];
//从json对象中获得value相对应的名称*/
return _value!==undefined&&_value!==null?_value:value;
}
