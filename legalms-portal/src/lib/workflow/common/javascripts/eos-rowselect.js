/**************************************************************************
 * *=================================================================
 *
 * Copyright (c) 2001-20XX Primeton Technologies, Ltd.
 * All rights reserved.
 *
 *@fileoverview
 *@version 1.0
 *@requires
 *@author caozw (mailto:caozw@primeton.com)
***********************************************************************/
/**
 * 行选择工具的js对象.
 * @param {Object} id
 */
function CheckGroup(id){
	this.id = id;
	PageControl.add(id,this);
	this.subCheck = new Array();
	this.selectCheck = new Array();
}

CheckGroup.prototype.getRows = function(){
    return this.subCheck;
}

/**
 * 初始化的函数.
 */
CheckGroup.prototype.init = function(){
	//this.disSelectAll();
	for(var i=0;i<this.subCheck.length;i++){
		var jsCheckbox = this.subCheck[i];
		jsCheckbox.inited = true;
	  if(jsCheckbox.isChecked)
		  jsCheckbox.setSelected();
		 else
		  jsCheckbox.disSelected();	
	}
	this.afterInit();
}
/**
 * 获得选中行的数目.
 * @return 返回选中行的数目.
 */
CheckGroup.prototype.getSelectLength = function(){
	var result = 0;
	for(var i=0;i<this.subCheck.length;i++){
		if(this.subCheck[i].getStatus()){
			result ++;
		}
	}
	return result;
}
/**
 *获得选择的索引.
 */
CheckGroup.prototype.getIndex = function(row){
	var result = -1;
	for(var i=0;i<this.subCheck.length;i++){
		if(this.subCheck[i]==row){
			result = i;
			break;
		}
	}
	return result;
}
/**
 * 获得总行数.
 * @return 返回总行数.
 */
CheckGroup.prototype.getLength = function(){
	return this.subCheck.length;
}
/**
 * 获得选中行的对象数组.
 * @return 返回选中的行的js对象数组.
 * @type rowCheckBox
 */
CheckGroup.prototype.getSelectRows = function(){
	var result = [];
	for(var i=0;i<this.subCheck.length;i++){
		if(this.subCheck[i].getStatus()){
			result.push(this.subCheck[i]);
		}
	}
	return result;
}
/**
 *获得选中的行参数，返回数组
 *@param {Object} name
 */
CheckGroup.prototype.getSelectParams = function(name){
	var boxes = this.getSelectRows();
	var values = [];
	for(var i=0;i<boxes.length;i++){
		var value = boxes[i].getParam(name);
		values.push(value);
	}
	return values;
}
/**
 * 全选操作.
 */
CheckGroup.prototype.selectAll = function(){
	for(var i=0;i<this.subCheck.length;i++){
		var jsCheckbox = this.subCheck[i];
		jsCheckbox.setSelected();
	}
}
/**
 * 反选操作.
 */
CheckGroup.prototype.selectReverse = function(){
	for(var i=0;i<this.subCheck.length;i++){
		var jsCheckbox = this.subCheck[i];
		jsCheckbox.reverseSelect();
	}
}
/**
 * 清空选项操作.
 */
CheckGroup.prototype.disSelectAll = function(){
	for(var i=0;i<this.subCheck.length;i++){
		var jsCheckbox = this.subCheck[i];
		jsCheckbox.disSelected();
	}
}
/**
 * 根据索引获得子对象的方法.
 * @param {Object} i
 */
CheckGroup.prototype.get = function(i){
	return this.subCheck[i];
}
/**
 * 注册子对象的方法.
 * @param {Object} jsCheckbox
 */
CheckGroup.prototype.register = function(jsCheckbox){
	this.subCheck.push(jsCheckbox);
}
CheckGroup.prototype.afterInit = function(){

}
/**
 * 行checkbox选择的js对象.
 * @param {Object} id
 */
function rowCheckBox(id){
	this.id = id;
	this.isChecked=false;
	PageControl.add(id,this);
	this.params=[];
	this.checkbox = null;
	this.container = null;
	this.subboxes = new Array();
	this.row = null;
	this.selectStyle = "";
	this.rowSelect = true;
	this.rowEvent = "click";
	this.onSelectFunc = null;
	this.onUnSelectFunc = null;
	this.groupid = null;
	this.tagName = "tr";
	this.showCheckBox = true;
	this.inited = false;
	this.backClassName = null;
	this.beforeSelectFunc = null;
	this.afterSelectFunc = null;
	this.beforeUnSelectFunc = null;
	this.afterUnSelectFunc = null;
	
}
/**
 * 初始化对象的函数.
 */
rowCheckBox.prototype.init = function(){

	this.container = $id(this.id + "_container");
	
	//this.checkbox = $id(this.id + "_checkbox");
	this.checkbox=	$createElement('input', { id : this.id+"_checkbox", type:'checkbox'});
    this.container.appendChild(this.checkbox);
    for(var i=0;i<this.params.length;i++)
    {
    var checkbox=$createElement('input', { name : this.params[i].name,value:this.params[i].value, type:'checkbox',style: {display: 'none'}});
    this.container.appendChild(checkbox);
    }
	if(this.showCheckBox){
		this.checkbox.style.display = "";
	}else{
		this.checkbox.style.display = "none";
	}
	//$debug("init rowCheckBox : " + this.id + this.pic + this.container.innerHTML);
	var boxes = this.container.getElementsByTagName("input");
	if(boxes){
		for(var i=0;i<boxes.length;i++){
			var box = boxes[i];
			if(box.id!=this.id){
				this.subboxes.push(box);
				box.checked = this.value;
			}
		}
	}
	var rowCheck = this;
	this.checkbox.onclick = function(){
		setTimeout(rowEvent,1);
		eventManager.stopPropagation();
		return false;
	}
	var rowEvent=function(){
		rowCheck.reverseSelect();
	}
	if(this.rowSelect){
		this.row = getRow(this.container,this.tagName);
		this.backClassName = this.row.className;
		eventManager.add(this.row,this.rowEvent,rowEvent);
	}
	var group = PageControl.getOne(this.groupid);
	group.register(this);
}


/**
 * 改变状态的方法.
 */
rowCheckBox.prototype.changeStatus = function(){
	for(var i=0;i<this.subboxes.length;i++){
		var box = this.subboxes[i];
		box.checked = this.value;
	}
	if(this.row){
		if(this.value){
			this.row.className = this.selectStyle;
			//addClass(this.row,this.selectStyle);
		}else{
			this.row.className = this.backClassName;
			//removeClass(this.row,this.selectStyle);
		}
	}
}
/**
 * 获得当前状态.
 */
rowCheckBox.prototype.getStatus = function(){
	return this.value;
}
rowCheckBox.prototype.getIndex = function(){
	return this.group.getIndex(this);
}
/**
 * 根据name获得参数的方法.
 * @param {Object} name
 */
rowCheckBox.prototype.getParam = function(name){
	for(var i=0;i<this.subboxes.length;i++){
		var box = this.subboxes[i];
		if(box.name.replace(/\[\d*\]/,"[*]")==name||box.name.replace(/\[\d*\]/,"")==name){
			return box.value;
		}
	}
	return null;
}
/**
 * 反选操作.
 */
rowCheckBox.prototype.reverseSelect = function(){
	if(this.value){
		this.disSelected();
	}else{
		this.setSelected();
	}
}
/**
 * 设置为选中状态.
 */
rowCheckBox.prototype.setSelected = function(){
	if(this.beforeSelectFunc&&this.inited){
		if(eval(this.beforeSelectFunc + "(this)")===false){
			return;
		}
	}
	this.checkbox.checked = true;
	this.value = true;
	this.changeStatus();
	
	if(this.onSelectFunc&&this.inited){
	   if(typeof(this.onSelectFunc)=="string")
		eval(this.onSelectFunc + "(this)");
		else
		{
		this.onSelectFunc(this)
		}
	}
	
	if(this.afterSelectFunc&&this.inited){
		eval(this.afterSelectFunc + "(this)");
	}
}
/**
 * 设置为不选中状态.
 */
rowCheckBox.prototype.disSelected = function(){
	if(this.beforeUnSelectFunc&&this.inited){
		if(eval(this.beforeUnSelectFunc + "(this)")===false){
			return;
		}
	}
	if(this.onUnSelectFunc&&this.inited){
	if(typeof(this.onUnSelectFunc)=="string")
		eval(this.onUnSelectFunc + "(this)");
		else
		this.onUnSelectFunc(this)

	}
	this.checkbox.removeAttribute("checked");
	this.value = false;
	this.changeStatus();
	if(this.afterUnSelectFunc&&this.inited){
		eval(this.afterUnSelectFunc + "(this)");
	}
}
/**
 * 得到row的方法.tagName可以不填，默认为TR
 * @param {Object} obj
 * @param {Object} tagName
 */
function getRow(obj,tagName){
	tagName = tagName?tagName.toUpperCase():"TR";
	var elem = obj;
	while(elem){
		if(elem.tagName.toUpperCase()==tagName){
			return elem;
		}
		elem = elem.parentNode;
	}
}
/**
 * 根据checkgroup的id对其进行全选操作.
 * @param {Object} id
 */
function selectAll(id){
	var group = PageControl.getOne(id);
	group.selectAll();
}
/**
 * 根据checkgroup的id对其进行反选操作.
 * @param {Object} id
 */
function selectOther(id){
	var group = PageControl.getOne(id);
	group.selectReverse();
}
/**
 * 根据checkgroup的id对其进行反选操作.
 * @param {Object} id
 */
function selectReverse(id){
	selectOther(id);
}
/**
 * 根据checkgroup的id对其进行清空已选项操作.
 * @param {Object} id
 */
function selectNone(id){
	var group = PageControl.getOne(id);
	group.disSelectAll();
}
/**
 * 根据checkgroup的id对其进行清空已选项操作.
 * @param {Object} id
 */
function disSelectAll(id){
	selectNone(id);
}
/**
 * 根据checkbox的值对group进行全选或清空操作.
 * 如果checkbox选中则全选，如果不选中则清空.
 * @param {Object} obj 控制checkGroup的checkbox
 * @param {Object} id checkgroup的id
 */
function controlCheckGroup(obj,id){
	if(obj.checked){
		selectAll(id);
	}else{
		selectNone(id);
	}
}

/**
 * 行选择工具的js对象.
 * @param {Object} id
 */
function RadioGroup(id){
	this.id = id;
	PageControl.add(id,this);
	this.subRadio = new Array();
	this.currRadio = null;
	this.defaultRow = null;
}
RadioGroup.prototype.getRows = function(){
   return this.subRadio;
}

/**
 * 初始化函数.
 */
RadioGroup.prototype.init = function(){
	for(var i=0;i<this.subRadio.length;i++){
		if(this.subRadio[i].isChecked)
		  this.subRadio[i].reverseSelect();
		else
		  this.subRadio[i].disSelected();
		
		this.subRadio[i].inited = true;
	}
	/*var defaultRow = this.subRadio[this.defaultRow];
	if(defaultRow){
		defaultRow.reverseSelect();
	}*/
	this.afterInit();
}
/**
 *获得选中行的参数
 *@param {Object} name
 */
RadioGroup.prototype.getParam = function(name){
	var radio = this.getSelectRow();
	if(radio){
		return radio.getParam(name);
	}
	return null;
}
RadioGroup.prototype.getIndex = function(row){
	var result = -1;
	for(var i=0;i<this.subRadio.length;i++){
		if(this.subRadio[i]==row){
			return i;
		}
	}
	return result;
}
/**
 * 获得选中的行的js对象.
 */
RadioGroup.prototype.getSelectRow = function(){
	return this.currRadio;
}
/**
 * 根据索引获得行的js对象.
 * @param {Object} i
 */
RadioGroup.prototype.get = function(i){
	return this.subRadio[i];
}
/**
 * 根据总行数
 */
RadioGroup.prototype.getLength = function(){
	return this.subRadio.length;
}
/**
 * 根据选中的行数，返回值为1或者0
 */
RadioGroup.prototype.getSelectLength = function(){
	if(this.currRadio){
		return 1;
	}else{
		return 0;
	}
}
/**
 * 注册子对象的方法.
 * @param {Object} jsRadio
 */
RadioGroup.prototype.register = function(jsRadio){
	this.subRadio.push(jsRadio);
}
/**
 * 刷新的方法，选择是排它的，要刷新.
 * @param {Object} jsRadio
 */
RadioGroup.prototype.refresh = function(jsRadio){
	if(this.currRadio!=jsRadio){
		if(jsRadio.setSelected()!==false){
			if(this.currRadio){
				this.currRadio.disSelected();
			}
			this.currRadio = jsRadio;
			if(jsRadio.afterSelectFunc&&jsRadio.inited){
				eval(jsRadio.afterSelectFunc + "(this)");
			}
		}
	}
}
RadioGroup.prototype.afterInit = function(){

}
/**
 * 行选择工具radio的构造函数.
 * @param {Object} id
 */
function rowRadio(id){
	this.id = id;
	this.isChecked=false;
	PageControl.add(id,this);
	this.params=[];
	this.radio = null;
	this.container = null;
	this.subboxes = new Array();
	this.row = null;
	this.selectStyle = "";
	this.rowSelect = true;
	this.rowEvent = "click";
	this.onSelectFunc = null;
	this.onUnSelectFunc = null;
	this.groupid = null;
	this.group = null;
	this.tagName = "tr";
	this.showRadio = true;
	this.inited = false;
	this.backClassName = null;
	this.beforeSelectFunc = null;
	this.afterSelectFunc = null;
}
/**
 * 行选择工具radio的初始化函数.
 */
rowRadio.prototype.init = function(){
	this.container = $id(this.id + "_container");
	//this.radio = $id(this.id + "_radio");
	
	this.radio=	$createElement('input', { id : this.id+"_radio", type:'radio'});
    this.container.appendChild(this.radio);
    for(var i=0;i<this.params.length;i++)
    {
    var checkbox=$createElement('input', { name : this.params[i].name,value:this.params[i].value, type:'checkbox',style: {display: 'none'}});
    this.container.appendChild(checkbox);
    }
	
	
	if(this.showRadio){
		this.radio.style.display = "";
	}else{
		this.radio.style.display = "none";
	}
	var boxes = this.container.getElementsByTagName("input");
	if(boxes){
		for(var i=0;i<boxes.length;i++){
			var box = boxes[i];
			if(box.id!=this.id){
				this.subboxes.push(box);
				box.checked = this.value;
			}
		}
	}
	var rowCheck = this;
	this.radio.onclick = function(){
		eventManager.stopPropagation();
		setTimeout(rowEvent,1);
		return false;
	}
	function rowEvent(){
		rowCheck.reverseSelect();
	}
	if(this.rowSelect){
		this.row = getRow(this.container,this.tagName);
		this.backClassName = this.row.className;
		eventManager.add(this.row,this.rowEvent,rowEvent);
	}
	var group = $o(this.groupid);
	group.register(this);
	this.group = group;
	//this.disSelected();
}
/**
 * 行选择工具radio改变状态的函数.
 */
rowRadio.prototype.changeStatus = function(){
	for(var i=0;i<this.subboxes.length;i++){
		var box = this.subboxes[i];
		box.checked = this.value;
	}
	if(this.row){
		if(this.value){
			this.row.className = this.selectStyle;
			//addClass(this.row,this.selectStyle);
		}else{
			this.row.className = this.backClassName;
			//removeClass(this.row,this.selectStyle);
		}
	}
}
/**
 * 获得当前状态的函数.
 */
rowRadio.prototype.getStatus = function(){
	return this.value;
}
/**
 * 根据name获得参数的方法.
 * @param {Object} name
 */
rowRadio.prototype.getParam = function(name){
	for(var i=0;i<this.subboxes.length;i++){
		var box = this.subboxes[i];
		if(box.name.replace(/\[\d*\]/,"[*]")==name||box.name.replace(/\[\d*\]/,"")==name){
			return box.value;
		}
	}
	return null;
}
/**
 * 设置反选的操作.
 */
rowRadio.prototype.reverseSelect = function(){
	this.group.refresh(this);
}
rowRadio.prototype.getIndex = function(){
	return this.group.getIndex(this);
}
/**
 * 设置选中的操作.
 */
rowRadio.prototype.setSelected = function(){
	if(this.beforeSelectFunc&&this.inited){
		if(eval(this.beforeSelectFunc + "(this)")===false){
			return false;
		}
	}
	this.radio.checked = true;
	this.value = true;
	this.changeStatus();
	if(this.onSelectFunc&&this.inited){
     if(typeof(this.onSelectFunc)=="string")
		eval(this.onSelectFunc + "(this)");
		else
		this.onSelectFunc(this)
		
	}
}
/**
 * 设置不选中的操作.
 */
rowRadio.prototype.disSelected = function(){
	if(this.onUnSelectFunc&&this.inited){
	if(typeof(this.onUnSelectFunc)=="string")
		eval(this.onUnSelectFunc + "(this)");
		else
		this.onUnSelectFunc(this)
	}
	this.radio.removeAttribute("checked");
	this.value = false;
	this.changeStatus();
}