
function SimpleEditor(elem){
	return SimpleEditorInner(elem, true);
}

function SimpleEditorInner(elem, isDatacell){
	var obj = null;
	if(elem){
		if(!elem.getAttribute("__eos__editor__inited")){
			if(elem.tagName&&elem.tagName.toLowerCase()=="form"){
				obj = initFormEditor(elem);
			}else{
				obj = initSimpleEditorInner(elem, isDatacell);
			}
			elem.setAttribute("__eos__editor__inited",true);
		}
	}
	return obj;
}

function initSimpleEditorInner(elem, isDatacell){
	if(isDatacell){
		/**
		 * 鼠标移上去的方法
		 */
		elem.onmouseover = function(){
			this.mouseOver = true;
		}
		/**
		 * 鼠标移出的方法
		 */
		elem.onmouseout = function(){
			this.mouseOver = false;
		}
		elem.onmousedown = function(){
			eventManager.stopEvent();
		}
	}

	/**
	 * Datacell在激活该控件时调用的方法，为控件设置初始值。
	 * @param {Object} value
	 */
	elem.setValue = function(value){
		if(this.type=="select-multiple"){
			var valueArr;
			var rets = [];
			if(value instanceof Array){
				valueArr = value;
			}else{
				valueArr = value.split(",");
			}
			for(var i=0;i<this.options.length;i++){
				for(var j=0;j<valueArr.length;j++){
					if(valueArr[j]==this.options[i].value){
						this.options[i].selected=true;
						break;
					}
				}
			}
		}else{
			if(value===null||value===undefined){
				this.value = "";
			}else{
				this.value = value;
			}
		}
	}
	/**
	 * Datacell在将该单元格由编辑状态变为显示状态时获得控件的值的方法
	 */
	elem.getValue = function(){
		if(this.type=="select-multiple"){
			var ret = [];
			for(var i=0;i<this.options.length;i++){
				if(this.options[i].selected == true){
					ret.push(this.options[i].value);
				}
			}
			return ret;
		}
		return this.value;
	}
	
	if(isDatacell){
		/**
		 * 显示控件的方法
		 */
		elem.showEditor = function(){
			this.style.display = "";
			try{this.focus();}catch(e){}
			var t=this;
			setTimeout(function(){ try{t.focus();}catch(e){}},1);
		}
		/**
		 * 隐藏控件的方法
		 */
		elem.hideEditor = function(){
			//this.focus();
			this.style.display = "none";
			this.hiddenMessage();
		}
		/**
		 * 设置控件的位置的方法，需要调用EOS提供的API ->setPosition
		 * @param {Object} left
		 * @param {Object} topx
		 * @param {Object} width
		 * @param {Object} height
		 */
		elem.setPosition = function(left,topx,width,height){
			this.style.position="absolute";
			var maxZindex = getMaxZindex(document);
			if(this.style.zIndex!=maxZindex){
				this.style.zIndex = maxZindex;
			}
			this.style.top="0px";
			this.style.left="0px";
			setElementXY(this,[left,topx]);
	
			if(this.type=="text"||this.type=="password"||this.type=="select-one"){
				this.style.width = width + "px";
				this.style.height = height + "px";
			}else if(this.type=="select-multiple"){
				this.style.width = width + "px";
			}
		}
		/**
		 *datacell的外单击事件调用控件的该方法判断外单击事件是否是由该控件引起的，
		 *如果是该控件引起的，则不进行操作，否则会触发外单击事件。
		 */
		elem.isFocus = function(){
			return this.mouseOver;
		}
		/**
		 * datacell在将单元格由编辑状态变为显示状态时先调用该方法进行控件的数据验证
		 * 如果验证通过则获得控件的值，继续进行，验证失败则让用户重新输入。
		 */
		elem.validate = function(){
			return checkInput(this);
		}
		/**
		 * 录入控件在录入时即时做校验
		 *
		 */
		elem.onkeyup=function(){
		 if(this.validate()==false)
			{var tmp=this;
		     var timeout=this.timeout;
			 clearTimeout(timeout);
			 this.timeout=setTimeout(function(){return f_alert_hidden_message.apply(tmp,[tmp])},3500);
			}
	    }
	    elem.hiddenMessage=function()
		{
			f_alert_verify_successful(this);
		}
		/**
		 * 返回控件的显示值，datacell调用该方法获得控件的显示值，放在列中
		 * 一般情况下，都返回原值就行，业务字典等控件需要返回显示值。
		 * @param {Object} value
		 */
		elem.getDisplayValue = function(value){
			if(!value){
				return null;
			}
			if(this.type=="select-one"){
				for(var i=0;i<this.options.length;i++){
					if(this.options[i].value==value){
						return this.options[i].text;
					}
				}
			}else if(this.type=="select-multiple"){
				var valueArr;
				var rets = [];
				if(value instanceof Array){
					valueArr = value;
				}else{
					valueArr = value.split(",");
				}
				for(var i=0;i<this.options.length;i++){
					for(var j=0;j<valueArr.length;j++){
						if(valueArr[j]==this.options[i].value){
							rets.push(this.options[i].text);
							break;
						}
					}
				}
				if(value instanceof Array){
					return rets;
				}else{
					return rets.join(",");
				}
			}else if (this.type=="password"){
				return "******";
			}
			return value;
		}
	}
	
	return elem;
}

function initSimpleEditor(elem){
	initSimpleEditorInner(elem, true);
}

function initFormEditorInner(form, isDatacell){
	form.value = null;
	/**
	 * 鼠标移上去的方法
	 */
	form.onmouseover = function(){
		this.mouseOver = true;
	}
	/**
	 * 鼠标移出的方法
	 */
	form.onmouseout = function(){
		this.mouseOver = false;
	}
	/**
	 * Datacell在激活该控件时调用的方法，为控件设置初始值。
	 * @param {Object} value
	 */
	form.setValue = function(value){
		form.value = value;
		setTimeout(refreshForm,50);
	}
	/**
	 * Datacell在将该单元格由编辑状态变为显示状态时获得控件的值的方法
	 */
	form.getValue = function(){
		return this.value;
	}
	/**
	 * 显示控件的方法
	 */
	form.showEditor = function(){
		this.style.display = "";

	}
	/**
	 * 隐藏控件的方法
	 */
	form.hideEditor = function(){
		this.style.display = "none";
	}
	/**
	 * 设置控件的位置的方法，需要调用EOS提供的API ->setPosition
	 * @param {Object} left
	 * @param {Object} top
	 * @param {Object} width
	 * @param {Object} height
	 */
	form.setPosition = function(left,top,width,height){
		setPosition(this,[left,top]);
		if(this.type=="text"||this.type=="password"||this.type=="select-one"||this.type=="select-multiple"){
			this.style.width = width + "px";
			this.style.height = height + "px";
		}
	}
	/**
	 *datacell的外单击事件调用控件的该方法判断外单击事件是否是由该控件引起的，
	 *如果是该控件引起的，则不进行操作，否则会触发外单击事件。
	 */
	form.isFocus = function(){
		return this.mouseOver;
	}
	/**
	 * datacell在将单元格由编辑状态变为显示状态时先调用该方法进行控件的数据验证
	 * 如果验证通过则获得控件的值，继续进行，验证失败则让用户重新输入。
	 */
	form.validate = function(){
		return checkForm(this);
	}
	/**
	 * 返回控件的显示值，datacell调用该方法获得控件的显示值，放在列中
	 * 一般情况下，都返回原值就行，业务字典等控件需要返回显示值。
	 * @param {Object} value
	 */
	form.getDisplayValue = function(value){
		return value;
	}
	form.freshFromEntity = function(entity){
		this.value = entity;
		refreshForm();
	}
	form.update = function(){
		updateEntity();
	}
	function updateEntity(){
		if(form.value){
			for(var name in form.editors){
				var editor = form.editors[name];
				form.value.setProperty(name,editor.getValue());
			}
		}
	}
	function updateField(){

	}

	function refreshForm(){
		if(form.value){
			for(var name in form.editors){
				var editor = form.editors[name];
				editor.setValue(form.value.getProperty(name));
			}
		}
	}
	form.editors = {};
	for(var i=0;i<form.elements.length;i++){
		var element = form.elements[i];
		if(element.name){
			var jsid = element.getAttribute("jsid");
			if(jsid && jsid.length>0){
				var jsobj = $id(jsid);
				if(jsobj){
					form.editors[element.name] = jsobj;
				}
			}else{
				form.editors[element.name] = (SimpleEditorInner(element, isDatacell));
			}
		}
	}
	return form;
}


function initFormEditor(form){
	initFormEditorInner(form, true);
}

