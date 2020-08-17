/**
 * SwitchCheckbox的构造函数.
 * @param {Object} id
 */
function SwitchCheckbox(id){
	this.id = id;
	this.checkbox = null;
	this.hiddenInput = null;
	this.trueValue = "1";
	this.falseValue = "0";
	this.defaultValue = "0";
	this.container = null;
	PageControl.add(id,this);
}
/**
 * SwitchCheckbox的初始化函数.
 */
SwitchCheckbox.prototype.init = function(){
	this.checkbox = $id(this.id + "_checkbox");
	this.hiddenInput = $id(this.id);
	this.container = $id(this.id + "_container");
	//this.refreshInput();
	if(this.checkbox){
		var scheckbox = this;
		function checkbox_click(){
			if(scheckbox.checkbox.checked){
				scheckbox.onSelect();
			}else{
				scheckbox.onUnSelect();
			}
			scheckbox.refreshValue();
		}
		eventManager.add(this.checkbox,"click",checkbox_click);
	}
}
/**
 * 刷新checkbox值的方法.
 */
SwitchCheckbox.prototype.refreshInput = function(){
	if(this.hiddenInput.value==this.trueValue){
		this.checkbox.checked = true;
	}else{
		this.checkbox.checked = false;
	}
}
/**
 * 刷新隐含输入框值的方法.
 */
SwitchCheckbox.prototype.refreshValue = function(){
	if(this.checkbox.checked){
		this.hiddenInput.value = this.trueValue;
	}else{
		this.hiddenInput.value = this.falseValue;
	}
}
/**
 * 选中checkbox时调用的事件.
 */
SwitchCheckbox.prototype.onSelect = function(){

}
/**
 * 不选中checkbox时调用的事件.
 */
SwitchCheckbox.prototype.onUnSelect = function(){

}
/**
 * 设置SwitchCheckbox的值.
 * @param {Object} value
 */
SwitchCheckbox.prototype.setValue = function(value){
	if(this.trueValue==value){
		this.hiddenInput.value = this.trueValue;
	}else{
		this.hiddenInput.value = this.falseValue;
	}
	this.refreshInput();
}
/**
 * 获取SwitchCheckbox的值
 */
SwitchCheckbox.prototype.getValue = function(){
	this.refreshValue();
	return this.hiddenInput.value;
}
/**
 * 设置焦点.
 */
SwitchCheckbox.prototype.setFocus = function(){
	this.checkbox.focus();
}
/**
 * 失去焦点.
 */
SwitchCheckbox.prototype.lostFocus = function(){

}