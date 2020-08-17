/**
 * MutiBox的构造函数.
 * @param {Object} id
 */

function MultiBox(id){
	this.id = id;
	this.value = null;
	this.container = $id(this.id + "_container");
	//this.container.onmousedown=function(){eventManager.stopPropagation();}
	this.checkboxes =[]; 
	var inputList=this.container.getElementsByTagName("input");
		for(var i=0;i<inputList.length;i++){
		var input = inputList[i];
		if(input.type=="checkbox") this.checkboxes.push(input);
	}
	
	this.hiddenInput = null;
	this.splitChar = ",";
	this.jsonObj=null;
	PageControl.add(id,this);

}
/**
 * 初始化MultiBox的方法.
 */
MultiBox.prototype.init = function(){
	//this.container = $id(this.id + "_container");
	this.hiddenInput = $id(this.id + "_hidden");
	//this.checkboxes = $ids(this.id + "_checkbox[*]");
	//this.refreshInput();
	this.initEvent();
}
/**
 * 初始化input的事件.
 */
MultiBox.prototype.initEvent = function(){
	var multibox = this;
	function checkbox_click(){
		multibox.refreshValue();
	}
	function checkbox_movebyarrow()
	{
        var e=eventManager.getEvent();    
		var key=e.keyCode;
		if(!(key==37||key==39)) return;
		var checkboxes=multibox.checkboxes;
		for(var i=0;i<checkboxes.length;i++){
			var checkbox = checkboxes[i];
			if((isIE?document.activeElement:e.explicitOriginalTarget)==checkbox&&checkbox.type=="checkbox"){
	
			  if(key==37)
					{
					  if(i==0)
						  checkboxes[checkboxes.length-1].focus();
					  else
		                  checkboxes[i-1].focus();
				  }
	          if(key==39)
					{
				    if(i==checkboxes.length-1)
						  checkboxes[0].focus();
					  else
		               checkboxes[i+1].focus();
				  }
			  break;
			}
		}
	}
	for(var i=0;i<this.checkboxes.length;i++){
		var checkbox = this.checkboxes[i];
		eventManager.add(checkbox,"click",checkbox_click);
	}
	eventManager.add(this.container,"keyup",checkbox_movebyarrow);
}
/**
 * 刷新checkbox值的方法.
 */
MultiBox.prototype.refreshInput = function(){
	if(this.hiddenInput){
		this.hiddenInput.value = this.value;
	}
	str = this.splitChar+this.value + this.splitChar;
	for(var i=0;i<this.checkboxes.length;i++){
		var checkbox = this.checkboxes[i];
		var substr = this.splitChar+checkbox.value + this.splitChar;
		if(str.indexOf(substr)>-1){
			checkbox.checked = true;
		}else{
			checkbox.checked = false;
		}
	}
}
/**
 * 刷新隐含输入框值的方法.
 */
MultiBox.prototype.refreshValue = function(){
	var str = "";
	for(var i=0;i<this.checkboxes.length;i++){
		var checkbox = this.checkboxes[i];
		if(checkbox.checked&&checkbox.type=="checkbox"){
			str += checkbox.value + this.splitChar;
		}
	}
	if(str.length>1){
		str = str.substr(0,str.length-1);
	}
	this.value = str;
	if(this.hiddenInput){
		this.hiddenInput.value = str;
	}
}
/**
 * 设置MultiBox的值.
 * @param {Object} value
 */
MultiBox.prototype.setValue = function(value){
	this.value = value;
	this.refreshInput();
}
/**
 * 获取MultiBox的值.
 */
MultiBox.prototype.getValue = function(){
	this.refreshValue();
	return this.value;
}
/**
 * 设置焦点.
 */
MultiBox.prototype.setFocus = function(){
  this.checkboxes[0].focus();
}
/**
 * 失去焦点.
 */
MultiBox.prototype.lostFocus = function(){

}

/**
 * 显示控件(在datacell中使用)
 */
MultiBox.prototype.showEditor = function(){
   var zIndex = getMaxZindex();
   this.container.style.zIndex = zIndex;
   this.container.style.display="";
   addClass(this.container.firstChild,"dict_comp");
   if(this.isDcEdit==true)
   {
   var shadowPanel=this.container.firstChild;
   shadowPanel.style.width=shadowPanel.firstChild.offsetWidth;
   initShadow(shadowPanel);
   }
   this.setFocus();

}
/**
 * .隐藏控件(在datacell中使用)
 */
MultiBox.prototype.hideEditor = function(){
	this.container.style.display="none";

}
/**
 * .设置控件位置(在datacell中使用)
 */
MultiBox.prototype.setPosition = function(left,top,width,height){

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
MultiBox.prototype.isFocus = function(){
	return true;

}
/**
 * .是否校验通过(在datacell中使用)
 */
MultiBox.prototype.validate = function(){
	return true;

}

//可由用户定义的显示分格符
EOS_DICT_DISPLAY_SEPERATOR=null;
/**
 * .得到显示值(在datacell中使用)
 */
MultiBox.prototype.getDisplayValue = function(value){
if (value==null)
	{
		value=this.getValue();
	}

var seperator;
//获得显示分格符
if(EOS_DICT_DISPLAY_SEPERATOR)
	seperator=EOS_DICT_DISPLAY_SEPERATOR;
  else
    seperator=this.splitChar;
//从json对象中获得value相对应的名称
var values=value.split(seperator);
var str="";
var retArr = [];
for(var i=0;i<values.length;i++){
	retArr.push(this.jsonObj[values[i]]||values[i]);
}
str = retArr.join(seperator);
return str;
}
