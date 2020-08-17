/**
 *ComboSelect对象
 * @class
 * @param {Object} id 唯一标识
 */

 // 三级关联时  2 3级之间同步问题
function ComboSelect(id){
	this.dataType=EOS.dataType;
	
	this.xtype="combo";
	this.id=id;
	this.Obj=id;
	this.inputObject=null;
	this.eventObject=null;
	this.hiddenObject=null;
	this.canClose=true;
	this.container=null;
	this.focusStatus = false;
	this.mouseOffset=null;
	this.showStatus=false;
	this.win=window;
	this.textField=null;
	this.valueField=null;
	this.filterField=null;
	this.submitXpath=null;
	this.xpath=null;
	this.dataXML=null;
	this.showMoreDay=true;
	this.date=null;
	this.timer=null;
	this.timeSelect=null;
	this.width=null;
	this.optionsWidth=null;
	this.optionsHeight="180px";
	this.allowInput=false;
	this.filterField=null;
	this.startWith=true;
	this.isFirst=true;
	this.__subComponent = [];
	this.defaultText = '';
	this.validateFunc = function(){return true; };
	this.validate = this.validateFunc;
	this.isFirstLoad=true;
	this.initParamFunc = null;
	this.nullText=null;
	this.filterType="startwith";
	this.showValue=false;
	this._showAll=true;

	this.queryReturnValue = null;
	this.queryParamsInfo = null;
	this.queryInoutParams = null;

	PageControl.add(this.id,this);
}


ComboSelect.prototype.onPageLoad=function(){
	PageControl.registerRelation(this.linkId,this.id);
	var Me=this;
	function me_on_load(){ 
		Me.init();
		Me.loadData();
		Me.refresh();
	}
	
	if(EOS.loader.isReady){
		me_on_load();
	}else{
		eventManager.add(window,'load',me_on_load);
	}
}

ComboSelect.prototype.reset=function()
{
  this.value=this.resetValue;
  this.setValue(this.value);
}



ComboSelect.currentComboSelect=null;
ComboSelect.editorContainer=null;
ComboSelect.doc=document;


/**
 * 显示comboselect编辑器
 */
ComboSelect.prototype.showEditor = function (fValue){

//	PageControl.addtoStack(this);
	this.container.style.display="";
	try{
	this.inputObject.focus();
	}catch(e){}
	//var Me=this;
	//setTimeout(function(){
	//	Me.inputObject.focus();
	//},22);

}


/**
 * 隐藏comboselect编辑器
 */
ComboSelect.prototype.hideEditor = function (fValue){
	this.hide();
//	this.onInputBlur();
	if(this.container){
		this.container.style.display="none";
	}
}


/**
 * 取得当前选中项对应的entity对象
 * @return entity对象
 * @type {Entity}
 */
ComboSelect.prototype.getSelectEntity=function(){
	return this.selectEntity;
}




/**
 * 设置comboselect的值
 * @param 数值value
 */
ComboSelect.prototype.setValue=function(value,refreshSub){
	var entity=this.getEntityByValue(value);
	if (!entity){
		if (this.allowInput){//如果当前可输入，则将值设置给值的隐藏域和显示框
			this.hiddenObject.value=value;
			this.inputObject.value=value;
			
			return true
		}else{
			return false;
		}
	}
	
	var idx=entity.__index;
	
	return this.selectOptionByIndex(idx,refreshSub);

}

ComboSelect.prototype.selectOptionByIndex=function(idx,refreshSub){
	var rows=this.optionsTable.tBodies[0].rows;
	if( !isNaN(idx) && rows && rows.length>0){
		this.selectOption(rows[idx],refreshSub);
		return true;
	}
	return false;
}

/**
 * 取得comboselect当前的选中值
 * @return 数值value
 */
ComboSelect.prototype.getValue=function(){
	if (!this.allowInput){
		return this.hiddenObject.value;
	}
	var entity=this.getEntityByText();

	return entity? entity.getProperty(this.valueField) : this.inputObject.value;
}

/**
 * 取得指定数值对应的显示内容
 * @return 显示内容
 * @type {String}
 */
ComboSelect.prototype.getDisplayValue=function(fValue){

	var entity=this.getEntityByValue(fValue);

	return entity?entity.getProperty(this.textField):fValue;
}


/**
 * 取得comboselect当前的显示的值
 * @return 数值value
 */
ComboSelect.prototype.getText=function(){
		return this.inputObject.value;
}





/**
 * 取得指定数值对应的entity
 * @return 对应的entity
 * @type {Entity}
 */
ComboSelect.prototype.getEntityByValue=function(fValue , iCase){
	var rowNum= this.dataset?this.dataset.getLength():0;
	if (this.hiddenObject != undefined){
		fValue= ''+(fValue || this.hiddenObject.value || '');
	 }
	(iCase===true) && (fValue=fValue.toLowerCase()); 
	for (var i=0;i<rowNum;i++ ){
		var entity=this.dataset.get(i);
		entity.__index=i;
		var eValue=entity?entity.getProperty(this.valueField):null;
		if (eValue!==undefined && eValue!==null){
			(iCase===true)  && ( eValue=(''+eValue).toLowerCase() );
			if (fValue === eValue){
				return entity;
			}
		}
	}
	return null;
}

 ComboSelect.prototype.getEntityByText=function (fValue , iCase){
	 var rowNum= this.dataset?this.dataset.getLength():0;
	 if (this.inputObject != undefined){
		fValue= ''+(fValue || this.inputObject.value || '');
	 }
	 (iCase===true) && (fValue=fValue.toLowerCase()); 

	for (var i=0;i<rowNum;i++ ){
		var entity=this.dataset.get(i);
		var eValue=entity?entity.getProperty(this.textField):null;
		if (eValue!==undefined && eValue!==null){
			(iCase===true)  && ( eValue=(''+eValue).toLowerCase() );
			if (fValue === eValue){
				entity.__index=i;
				return entity;
			}
		}

	}
	return null;
 }

/**
 *
 * 设置控件的宽度.
 *
 */

ComboSelect.prototype.setWidth=function(width){
    this.width=width+"";
    this.initSize();
}

/**
 *
 * 得到控件的宽度.
 *
 */

ComboSelect.prototype.getWidth=function(){
  return this.width;
}

/**
 * 计算控件的宽度.
 */
ComboSelect.prototype.initSize=function(){

	if(this.width)
	{
	  this.width=this.width+"";
	  this.container.style.width= this.width;
	  if(this.container.offsetWidth!=0)
	            {
		            if(this.width.indexOf("%")!=-1)
		                    {
		                    if(isFF) 
		                          this.inputObject.style.width=this.width;
			                    else 
				                  if(isIE)
				                     {
				                      this.container.style.width="";
				                      this.inputObject.style.width=this.width;
			                          }
		                    }
                    else
	                    if(this.width.indexOf("px")!=-1)
		                    {
		                    this.inputObject.style.width=this.width.replace("px","")-17;
		                    }
	                       else
                              this.inputObject.style.width=this.width-17;    
	            }
	 }
};

/**
 * 设置控件的位置.
 * @param {Object} left
 * @param {Object} top
 * @param {Object} width
 * @param {Object} height
 */
ComboSelect.prototype.setPosition=function (left,topx,width,height){

    try{
	this.hide();
	if(this.container){
	this.width = width || this.width;
	this.height = height || this.height;
	this.container.style.position="absolute";
	this.container.style.width=width;

	var maxZindex = getMaxZindex(document);
	if(this.container.style.zIndex!=maxZindex){
		this.container.style.zIndex = maxZindex;
	}
	this.container.style.display=isFF?"-moz-inline-box":"inline";
	this.container.style.top=topx;
	this.container.style.left=left;
    this.eventObject.style.height=height;
    this.container.style.height=height;
    this.inputObject.style.height=height;
    this.inputObject.style.width=width-17;
	//this.initSize();
	}
	}
	catch(e)
	{};
}

/**
 * 初始化comboselect
 */
ComboSelect.prototype.init =function (){
    var combo=this;
	if (this.inited===true || this.beforeInit()===false){return;}
	if(this.isIeMode==true) {
		this.inited=true;
		this.select=$id(this.id+"_select");
		this.select.readOnly=this.readOnly;
		this.select.disabled=this.disabled;
		this.select.style.width=this.width;
		this.select.onchange= function(){
		        var entity = this.options[this.selectedIndex].entity
		        this.selectEntity=entity;
				combo._onChange();
				combo.setSubComponent(entity);

	 }
	return;
	}
	this.filterField = this.filterField || this.textField;
	this.container=$id(this.id+"_container");
	this.inputObject=$id(this.id+"_input");
	this.hiddenObject=$id(this.id + "_hidden");

	this.readonly = (this.readonly===true || this.readonly===false ) ? this.readonly : this.readOnly ;
	this.inputObject.readOnly=!!this.readonly;
	this.hiddenObject.readOnly=!!this.readonly;
	this.inputObject.disabled=!!this.disabled;
	this.hiddenObject.disabled=!!this.disabled;
    this.eventObject=$id(this.id + "_button");
	this.button=this.eventObject;
	//修补IE选择按钮框的上下问题
	this.button.style.verticalAlign="bottom";
	
	this.text=this.inputObject;
	this.hidden=this.hiddenObject;
    this.resetValue=this.value;
	var form=getFormByObj(this.inputObject);
	if(form!=null) initEosControlReset(form,this);
    var comboSelect=this;
	this.eventObject.src=COMBOSELECT_BTN;
	/*this.eventObject.onmousedown = function(){
		eventManager.stopEvent();
	}*/
    this.eventObject.onmouseover=function()
               {
       	       if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
               this.src=COMBOSELECT_BTN_OVER;
               }   
    this.eventObject.onmouseout=function()
               {
       	       if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
               this.src=COMBOSELECT_BTN;
               }              
    this.eventObject.onmousedown=function()
               {
       	       if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
               this.src=COMBOSELECT_BTN_DOWN;
               }              
    
	this.initSize();
	this.inputObject.value=this.defaultText;
	this.validate = (typeof this.validateFunc)=="string"?eval(this.validateFunc):this.validateFunc;
	this.startWith = (this.filterType.toLowerCase()!="like");
	this.initEvent();
	this.inited=true;
	this.afterInit();

}

/**
 * @private
 * 取得comboselect是否得到焦点
 */
ComboSelect.prototype.isFocus = function(){
	return this.focusStatus;
}


/**
 * @private
 * 取消过滤操作
 */
ComboSelect.prototype.cancleFilter=function (eValue){
	var rows=this.optionsTable.tBodies[0].rows;
	for (var i=0;i<rows.length;i++ ){
		rows[i].style.display="";
	}
	return rows.length;
}



/**
 * @private
 * 开始进行过滤操作
 */


ComboSelect.prototype.filter=function (){
	var eValue=this.inputObject.value;
	var f=0;
	// this._showAll ???
	if (  eValue!==undefined && eValue!==null){
		f=this.doFilter(eValue);
	}else{
	  f=this.cancleFilter(eValue);
	}
	return f;
}


 ComboSelect.prototype.getFilterNum=function (){
	 var f=0;

	var rows=this.optionsTable.tBodies[0].rows;
	for (var i=0;i<rows.length;i++ ){
		if (rows[i].style.display != "none"){
			f++;
		}
	}
	return f;
 }



/**
 * @private
 * 进行过滤操作
 */
ComboSelect.prototype.doFilter=function (fValue,hiddenN){
	var rows=this.optionsTable.tBodies[0].rows;
	fValue= fValue || this.inputObject.value || "" ;
	fValue = fValue.toLowerCase();
	var f=0;
	var newFirst=null;
	var _newSelectRow=false;
	for (var i=0;i<rows.length;i++ ){
		var entity=this.dataset.get(i);
		var eValue=entity?entity.getProperty(this.filterField):null;
		rows[i].style.display= hiddenN===false?"":"none";
		if (this.selectOptionRow==rows[i]){
			_newSelectRow=true;
		}
		if (eValue!==undefined && eValue!==null){
			eValue=(''+eValue).toLowerCase();
			var idx=eValue.indexOf(fValue);
			if (this.startWith && idx==0 || !this.startWith && idx>=0){
				rows[i].style.display="";
				if (!newFirst){
					newFirst=rows[i];
					this.activeOption(newFirst);
				}
				f++;
			}
		}

	}
	if (_newSelectRow){
		//this.selectOptionRow=newFirst;
	}
	return f;
}

/*

文本框上:
lastSelectedEntity
keydown : 执行过滤, 如果有候选项 那么默认高亮一地个
	esc : 恢复为 lastSelectedEntity
	enter : 选中高亮项  更新 lastSelectedEntity



*/

ComboSelect.prototype._syncInputValue =function(){

	if (this.hiddenObject.value!==this.inputObject.value){
		this.hiddenObject.value=this.inputObject.value;
		this.selectEntity=new Entity();
		this.selectEntity.setProperty(this.valueField, this.hiddenObject.value);
		this.selectEntity.setProperty(this.textField, this.hiddenObject.value);
		return true;
	}
	return false;
}

ComboSelect.prototype._onChange =function(){
	if (this.onChangeFunc ){
		if (typeof(this.onChangeFunc)=="string"){
			this.onChangeFunc=eval(this.onChangeFunc);
		}
		this.onChangeFunc(this.selectEntity,this);
	}
}



ComboSelect.prototype.onInputBlur =function(){
	var Me=this;
			if(checkInput(this.inputObject)==false){
				return ;
			}
			var t=true;
			if(this.validate){
				t=this.validate();
			}
			if (t){
				//setTimeout( function(){
					if (!Me.showStatus){
						var ff = Me.getFilterNum();
						var oldV = Me.hiddenObject.value;
						var entity = Me.getEntityByRow(Me.activeOptionRow);
						var newV , newText;
						if (entity){
							newV = entity.getProperty(Me.valueField);
							newText = entity.getProperty(Me.textField);
						}
						if (oldV!=newV && newText == Me.inputObject.value){
							Me.selectOption();
						}else if ( Me.allowInput ){
							/*if (Me._syncInputValue()){
								Me._onChange();
							}*/
						}else if ( !Me.allowInput ){
							Me.selectOption(Me.selectOptionRow, (oldV!=newV) );
						}
					}

				//},22 );
			}
		}

/**
 * @private
 * 初始化事件
 */
/* todo */
ComboSelect.prototype.initEvent=function (){
	var comboSelect=this;
		var disKeyList=','+[
			EOSKey.TAB ,
			EOSKey.ENTER ,
			EOSKey.SHIFT ,
			EOSKey.CTRL ,
			EOSKey.PAUSE ,
			EOSKey.CAPSLOCK ,

			EOSKey.PAGEUP ,
			EOSKey.PAGEDOWN ,
			EOSKey.END ,
			EOSKey.HOME ,
			EOSKey.LEFT ,
			EOSKey.UP ,
			EOSKey.RIGHT ,
			EOSKey.DOWN  ,
			EOSKey.INSERT ,

			EOSKey.WIN  ,
			EOSKey.WIN_R ,
			EOSKey.MENU ,

			EOSKey.F1 ,
			EOSKey.F2 ,
			EOSKey.F3 ,
			EOSKey.F4 ,
			EOSKey.F5 ,
			EOSKey.F6 ,
			EOSKey.F7 ,
			EOSKey.F8 ,
			EOSKey.F9 ,
			EOSKey.F10 ,
			EOSKey.F11 ,
			EOSKey.F12 ,
			EOSKey.NUMLOCK ,
			EOSKey.SCROLLLOCK
		].join(',')+','



   function doSelect(event){
	
	    if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
	    if (this.optionsTable && this.optionsTable.tBodies && this.optionsTable.tBodies[0]) return;
		event = event || window.event;
		$error("key:"+event.keyCode)
		eventManager.stopEvent(event);
	 if (event.keyCode == EOSKey.ENTER){
			eventManager.stopEvent();
			if (!comboSelect.showStatus){
					comboSelect.show(true);
				}else{
						var f=comboSelect.getFilterNum();
		
						if (f>0 || !comboSelect.allowInput) {
							comboSelect.selectOption(comboSelect.actionOptionRow);
						}
						comboSelect.hide();
					}
				
		}
		else
			if (event.keyCode == EOSKey.ESC){
				if(comboSelect.showStatus){
						comboSelect.hide();
					}else{
							//eventManager.outClick();
							PageControl.setFocus(comboSelect);
							comboSelect.show(true);
						}
						eventManager.stopEvent(event);
					
				}
			else 
			   if (event.keyCode == EOSKey.UP){
				if (!comboSelect.showStatus){
					comboSelect.show(true);
				}else{
					comboSelect.activePrevOption();
				}
			eventManager.stopEvent(event);
		     }else if (event.keyCode == EOSKey.DOWN){
					if (!comboSelect.showStatus){
						comboSelect.show(true);
						}else{
							comboSelect.activeNextOption();
						}
					eventManager.stopEvent(event);


				}
				else 
					if ( disKeyList.indexOf(','+event.keyCode+',') <0 && (!comboSelect.beforeFilter ||  comboSelect.beforeFilter(comboSelect,event.keyCode)!==false ) )
					{
						comboSelect.show();
						eventManager.stopEvent(event);
						if ( comboSelect.afterFilter ){
							comboSelect.afterFilter(comboSelect);
						};
						if ( comboSelect.afterFilter ){
							comboSelect.afterFilter(comboSelect);
						};
						var f=comboSelect.filter();
		
						if (comboSelect.allowInput){
				
							if (comboSelect._syncInputValue()){
								comboSelect._onChange();
							}
					    }
		
					}
		eventManager.stopEvent();
	}

	function filterKey(event){
	    if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
    	if(event.keyCode != EOSKey.ESC) return;
		event= event || window.event;

		if (event.keyCode == EOSKey.ENTER){
			eventManager.stopEvent();
			var f=comboSelect.getFilterNum();
			if (f<1 && comboSelect.allowInput){
				if (comboSelect._syncInputValue()){
					comboSelect._onChange();
				}
			}
			
		}else if (event.keyCode == EOSKey.TAB){
			comboSelect.onInputBlur();
		}else if ( disKeyList.indexOf(','+event.keyCode+',') <0 && (!comboSelect.beforeFilter ||  comboSelect.beforeFilter(comboSelect,event.keyCode)!==false ) ){
			var f=comboSelect.filter();
			
			eventManager.stopEvent(event);

			if ( comboSelect.afterFilter ){
				comboSelect.afterFilter(comboSelect);
			};
		
		comboSelect.show();

		}
	}

	function doWheel(event){
		if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
		event= event || window.event;
		var wd=eventManager.getWheel(event);
		if (wd<0){
			comboSelect.activeNextOption();
			comboSelect.selectOption();
		}else if (wd>0){
			comboSelect.activePrevOption();
			comboSelect.selectOption();
		}
		eventManager.stopEvent();
	}

	function toggleOptions(){
		eventManager.stopEvent();
	    if(comboSelect.getDisabled()||comboSelect.getReadOnly()) return;
		comboSelect.eventObject.src=COMBOSELECT_BTN_OVER;
		if(comboSelect.showStatus){
			comboSelect.hide();
		}else{
			//eventManager.outClick();
			//PageControl.setFocus(comboSelect);
			comboSelect.show(true);
		}
		
		
	}

	if(!this.inputObject.readOnly){
		eventManager.add(this.inputObject,"blur",function(event){ comboSelect.onInputBlur(event) });
	}

	this.container.onmousedown = function(){
		var el=eventManager.getElement();

		if (el== comboSelect.inputObject){
			if(comboSelect.showStatus) eventManager.stopEvent();
			try{comboSelect.inputObject.focus();}catch(e){};
		}
		else
		 if (el== comboSelect.eventObject){
			if(comboSelect.showStatus) eventManager.stopEvent(); 
			}

	}
	//if(!this.inputObject.readOnly){
	//eventManager.add(this.inputObject,"keydown",optionDivMove);
	eventManager.add(this.inputObject,"keyup",doSelect);
	//eventManager.add(this.inputObject,"mousewheel",doWheel);
	eventManager.add(this.eventObject,'click',function(){ eventManager.stopEvent(); } );
	eventManager.add(this.eventObject,'mouseup',toggleOptions);
	eventManager.add(this.inputObject,"focus",function(){
		/*if(!comboSelect.showStatus){
			//eventManager.outClick();
			//PageControl.setFocus(comboSelect);
		}*/
		comboSelect.inputObject.select();
	});

//}


}

/**
 * 显示ComboSelect控件的方法.
 */
ComboSelect.prototype.show = function (showAll) {
	//PageControl.setFocus(this);
	PageControl.addtoStack(this);
	if (this.optionsDiv && this.optionsDiv.style && !this.disabled) {
		

		if (this.optionsWidth && this.optionsWidth.indexOf("%") > 0) {
			this.optionsDiv.style.width = this.container.clientWidth * parseInt(this.optionsWidth) / 100;
		} else
			this.optionsDiv.style.width = this.optionsWidth || isFF ? this.container.offsetWidth - 8 : this.container.offsetWidth;
		if (showAll === true) {
			if (this.optionsTable && this.optionsTable.tBodies && this.optionsTable.tBodies[0])
				this.cancleFilter();
		}
		this.optionsDiv.style.display = 'block';
		var zIndex = getMaxZindex(document);
		if (this.optionsDiv.style.zIndex != zIndex) {
			this.optionsDiv.style.zIndex = zIndex;
		}
		//fix bug:10522
		/*if (window.isIE){
		var _iframe=this.optionsDiv.firstChild;
		_iframe.style.height=this.optionsTable.offsetHeight+2+'px';
		}*/
		/*****************start*****
		*修改options选项显示位置
		*原则：先判断在底部显示是否够：
				如果够，则在底部显示
				如果不够，则判断在顶部显示是否够
					如果够，则在顶部现实
					如果不够，则在底部现实，可能会出现页面的滚动条
		***************/
		var inputHeight=this.inputObject.clientHeight;
		var optHeight=this.optionsDiv.clientHeight;
		var inputOff=getScreenPosition(this.inputObject, this.win);
		inputOff={
			top:inputOff[1]+inputHeight,
			left:inputOff[0]
		}
		var pos={
			top:inputOff.top,
			left:inputOff.left
		};
		
		this.optionsDiv.style.display = 'none';
		if(isIE){//
			//(top+下拉选项)的值大于页面的高度，即超过底线
			if(document.body.offsetHeight<(inputOff.top+optHeight)){
				//判断顶部是否够
				if(inputOff.top-optHeight-inputHeight>0){
					pos.top-=optHeight;
					pos.top-=inputHeight;
				}
			}
		}else{
			//(top+下拉选项)的值大于页面的高度，即超过底线
			if(document.body.scrollHeight<(inputOff.top+optHeight)){
				//判断顶部是否够
				if(inputOff.top-optHeight-inputHeight>0){
					pos.top-=optHeight;
					pos.top-=inputHeight;
				}
			}
		}
		setElementXY(this.optionsDiv, [pos.left, pos.top]);
		this.optionsDiv.style.display = 'block';
		
		/*****************end********************/
		
		
		/*
		var pos = getScreenPosition(this.inputObject, this.win);
		//var pos = getPosition(this.container);
		if (pos[0] >= 0) {
			var topx = pos[1] * 1 + this.inputObject.offsetHeight * 1;
			var cHeight = this.optionsDiv.offsetHeight;
			var h1 = document.body.clientHeight;
			var h2 = document.documentElement.clientHeight;
			var isXhtml = (h2 <= h1 && h2 != 0) ? true : false; //判断当前页面的Doctype是否为Xhtml
			var htmlbody = isXhtml ? document.documentElement : document.body;
			var bodyClientHeight = htmlbody.clientHeight;
			var bodyHeight = bodyClientHeight + htmlbody.scrollTop;
			if (cHeight >= bodyClientHeight) {
				topx = htmlbody.scrollTop;
			} else {
				if ((topx + cHeight) > bodyHeight) {
					//topx = bodyHeight - cHeight;
				}
			}
			setElementXY(this.optionsDiv, [isFF ? pos[0] : pos[0], topx]);
		}
		*/
		
		try {
			this.inputObject.focus();
		} catch (e) {}
		this.showStatus = true;
		if (isIE) {
			var maskIframe = this.optionsDiv.firstChild;
			maskIframe.style.width = maskIframe.nextSibling.offsetWidth
				maskIframe.style.height = maskIframe.nextSibling.offsetHeight;
			maskIframe.style.top = maskIframe.nextSibling.offsetTop;
			maskIframe.style.left = maskIframe.nextSibling.offsetLeft;
		}
		var shadowPanel = this.optionsDiv.firstChild.nextSibling;
		initShadow(shadowPanel)
		if (isFF) {
			shadowPanel.nextSibling.style.width = this.optionsDiv.offsetWidth + 7;
		}
	}
};




/**
 * 显示ComboSelect控件的方法.
 */
ComboSelect.prototype.hide=function (){
	if (this.optionsDiv&&this.optionsDiv.style){
		this.optionsDiv.style.display='none';
	}
	this.showStatus=false;
}

ComboSelect.prototype.onLoadData=function (){}


ComboSelect.prototype.addParam = function(key, value){
	this.paramList=this.paramList || [];
	this.paramList.push( { key : key ,value : value } );
}

/**
 * 载入数据的方法.
 */
// this.afterLoadData();
ComboSelect.prototype.loadData = function(){
	if (this.beforeLoadData()===false){
		return;
	}

	if (!this.linkId && !this.queryAction && this.xpath){
		var xmlZone=document.getElementById(this.id+"_xml");
		this.dataXML= xmlZone?xmlZone.innerHTML:null;
	}else if (this.linkId && this.linkId.indexOf('xml:')==0){
		var xmlZone=document.getElementById(this.linkId.substring(4));
		this.dataXML= xmlZone?xmlZone.innerHTML:null;
	}else if (this.linkId && this.isFirstLoad ){
		this.isFirstLoad=false;
		var linkCombo = $id(this.linkId);
		if(linkCombo && linkCombo.xtype=="combo"){
			var parentValue = linkCombo.getSelectEntity();
			if(parentValue){
				this.freshFromEntity(parentValue);
			}
		}
		return;
	}

	var xmlDom;
	var _dataXML=this.dataXML;

	this.dataset = new Dataset();
	if (this.nullText !== null) {
		if (!this.isIeMode) {
			var emptyEntity = new Entity();
			emptyEntity.setProperty(this.valueField, "");
			emptyEntity.setProperty(this.textField, this.nullText);
			this.setValue("");
			this.dataset.addEntity(emptyEntity);
		} else {}
	}


	if(_dataXML){
		this.dataset.appendDataset(Dataset.create(_dataXML,this.xpath)) ;
		return;
	}
	if(this.onLoadData()!==false){
		if(!this.queryAction){
			return ;
		}
		var ajax = new HideSubmit(this.queryAction);
		
		var param='';//=this.getQueryForm();
		var paramFn='';
 		if (this.initParamFunc) {
 			try {
 				paramFn= eval(this.initParamFunc + "(ajax)");
 			} catch (e) {
 				try {
 					paramFn= eval(this.initParamFunc + "()");
 				} catch (e1) {
 					$handle(e1);
 				}
 			}
 		}
		if(this.dataType=='json'){
			param={};
			EOS.apply(param,this.queryParam);
			EOS.apply(param,this.pageParam);
			EOS.apply(param,paramFn);
		}else{
			param='';
			param+=this.queryParam||'';
			param+=this.pageParam||'';
			param+=paramFn||'';
		}
		/* 
		
		var param = '' ;//this.getQueryForm();
		if(this.queryParam){
			param += this.queryParam;
		}
		if(this.pageParam){
			param += this.pageParam;
		}
		if(this.initParamFunc){
			try{
				param += eval(this.initParamFunc + "(ajax)");
			}catch(e){
				try{
					param += eval(this.initParamFunc + "()");
				}catch(e1){
					$handle(e1);
				}
			}
		}
		if(param ==""){
			param = null;
		} */
		if(this.filterID){
			var form = $id(this.filterID);
			if(form){
				for(var i=0;i<form.elements.length;i++){
					var elem = form.elements[i];
					if(elem.name){
						ajax.addParam(elem.name,elem.value);
					}
				}
			}
		}
		if(this.paramList){
			for(var i=0;i< this.paramList.length;i++){
				var elem = this.paramList[i];
				if(elem){
					ajax.addParam(elem.key,elem.value);
				}
			}
		}

		if(this.queryReturnValue){
			ajax.setOutParam(this.queryReturnValue );
		}

		if(this.queryParamsInfo){
			ajax.setParamsInfo(this.queryParamsInfo );
		}

		if(this.queryInoutParams){
			ajax.setInoutParam(this.queryInoutParams );
		}

		var _this=this;
		ajax.onSuccess=function(){
			var pagecond=0;
			if(_this.dataType=='json'&&ajax.retJson){
				var xp=_this.xpath;
				var arr=ajax.retJson;
				if(xp){
					xp=xp.split('/');
					for(var i=0,len=xp.length;i<len;i++){
						arr=arr[xp[i]];
					}
				}
				_this.dataset=Json2Dataset(arr);
				if(ajax.retJson.page){
					pagecond=ajax.retJson.page.length;
				}
			}else{
				xmlDom = ajax.retDom;
				_this.dataset = Dataset.create(xmlDom, _this.xpath, null);
				pagecond = xmlDom.selectSingleNode("/root/data/page");
			}
			if ((_this.nullText!==null&&_this.nullText!==undefined)&&!_this.isIeMode) {
				
				var emptyEntity = new Entity();
				emptyEntity.setProperty(_this.valueField, "");
				emptyEntity.setProperty(_this.textField, _this.nullText);
				_this.setValue("");
				_this.dataset.insertEntity(emptyEntity,true,0);
			} else {}
			
			if(_this.afterLoadData){
				_this.afterLoadData();
			}
		}
		ajax.loadData(param);
	}
	
	/* if(this.afterLoadData()===false){
     return;
  	} */
}

/**
 * 通过列表中的"行"元素取得对应的entity
 * @param row元素
 * @return {Entity} 对应的entity
 */
ComboSelect.prototype.getEntityByRow =function(row){
	if (!row){
		return null;
	}
	var rowIndex = row.getAttribute('__entity_rowno')/1;
	var entity =  this.dataset.get(rowIndex);
	return entity;
}

/**
 * 使comboselect无效
 */
ComboSelect.prototype.disable =function(){
	this.disabled = true;
	this.inputObject.disabled=true;
	this.hiddenObject.disabled=true;
	this.hide();
}

/**
 * 使comboselect有效
 */
ComboSelect.prototype.enable =function(){
	this.disabled = false;
	this.inputObject.disabled= false;
	this.hiddenObject.disabled= false;
}

ComboSelect.prototype.setDisabled=function(isDisabled)
{
	if(isDisabled)
		this.disable();
	else
		this.enable()
	if(isDisabled)
	  this.eventObject.style.cursor="default"
	   else
	  this.eventObject.style.cursor="pointer"
}

ComboSelect.prototype.getDisabled=function(isDisabled)
{
    return this.disabled;
}


/**
 * 设置comboselect是否是只读
 *@param {Boolean} b是否只读
 */
ComboSelect.prototype.setReadonly =function(b){
	this.inputObject.readOnly= b || true;
}

/**
 * 设置comboselect是否是只读
 *@param {Boolean} b是否只读
 */
ComboSelect.prototype.setReadOnly =function(b){
    this.readonly=b;
	this.inputObject.readOnly= b;
	if(b)
	  this.eventObject.style.cursor="default"
	  else
	  this.eventObject.style.cursor="pointer"
}


/**
 * 设置comboselect是否是只读
 *@param {Boolean} b是否只读
 */
ComboSelect.prototype.getReadOnly =function(b){
    return this.readonly;
}

/**
 * 取得列表的第一行
 */
ComboSelect.prototype.firstOptionRow =function(start,end){
	var allRows=this.optionsTable.tBodies[0].rows;
	start = start || 0;
	end = end || allRows.length;
	start=start<0?0:start;
	end= end<0?0:end;
	end= end>allRows.length?allRows.length:end;
	start= start>end?end:start;
	for (var i= start;i<end;i++ ){
		if ( allRows[i].style.display!="none"){
			return allRows[i];
		}
	}
	return null;
}

/**
 * 取得列表的最后一行
 */
ComboSelect.prototype.lastOptionRow =function(start,end){
	var allRows=this.optionsTable.tBodies[0].rows;
	start = start || 0;
	end = end===0?0: (end || allRows.length);
	start=start<0?0:start;
	end= end>allRows.length-1?allRows.length-1:end;
	end= end<0?0:end;

	start= start>end?end:start;
	if (allRows.length>0){
		for (var i= end;i>=start;i-- ){
			if ( allRows[i].style.display!="none"){
				return allRows[i];
			}
		}
	}
	return null;
}
/**
 * 选择当前行的上一行
 */
ComboSelect.prototype.activePrevOption=function(tr){
	tr= tr || this.activeOptionRow;
	var e=0;
	if (tr){
		e=tr.rowIndex-1;
	}
	var ntr=this.lastOptionRow(0,e);
	if (ntr && ntr!=tr){
		this.activeOption(ntr);
	}
}
/**
 * 选择当前行的下一行
 */
ComboSelect.prototype.activeNextOption=function(tr){
	tr= tr || this.activeOptionRow;
	var s=0;
	if (tr){
		s=tr.rowIndex+1;
	}
	var ntr=this.firstOptionRow(s);
	if (ntr && ntr!=tr){
		this.activeOption(ntr);
	}

}

ComboSelect.prototype.activeOption=function(tr){
	if (this.activeOptionRow){
		removeClass(this.activeOptionRow,'eos-selectoption');
	}
	addClass(tr,'eos-selectoption');
	this.autoScroll(tr);
	this.activeOptionRow=tr;
}



/**
 * 选择列表中的指定行
 *@param {Object} 指定的行元素
 */
ComboSelect.prototype.selectOption=function(row,refreshSub){
//	if ( !row){    // this.selectOptionRow==row || !row
//		return;
//	}
this._showAll=true;
var _change= this.selectOptionRow != row;
	row = row || this.activeOptionRow;
	if ( !row){ return; }

	var entity =this.getEntityByRow(row);
	if (entity)	{
		if (this.activeOptionRow){
			removeClass(this.activeOptionRow,'eos-selectoption');
		}

        
		if (row.offsetTop< this.optionsDivCore.scrollTop + 2){
			 this.optionsDivCore.scrollTop=row.offsetTop;
		}
		if (row.offsetTop> this.optionsDivCore.scrollTop+ this.optionsDivCore.clientHeight - 4 ){
			 this.optionsDivCore.scrollTop = row.offsetTop - this.optionsDivCore.clientHeight + row.offsetHeight ;
		}
		this.selectEntity=entity;

		//if (!this.readonly){
			this.inputObject.value= this.selectEntity.getProperty(this.textField);
			this.hiddenObject.value= this.selectEntity.getProperty(this.valueField);
		//}
		if (this.activeOptionRow){
			removeClass(this.activeOptionRow,'eos-selectoption');
		}
		this.selectOptionRow= row;
		this.activeOptionRow= row;
		addClass(this.activeOptionRow,'eos-selectoption');
		if (this.onChangeFunc && !this.isFirst){
			if (typeof(this.onChangeFunc)=="string"){
				this.onChangeFunc=eval(this.onChangeFunc);
			}
			this.isFirst=false;
			_change && this.onChangeFunc(this.selectEntity,this);
		}
		this.isFirst=false;
	}
	if (refreshSub!==false){
		this.setSubComponent(entity);
	}
}

/**
 * 注册联动子对象的函数.
 * @param {Object} id
 */
ComboSelect.prototype.registerSubComponent = function(id){
	var ob = PageControl.getOne(id);
	ob.parentCmp=this;
	this.__subComponent.push(ob);
}


ComboSelect.prototype.setSubComponent = function(entity){
    var entityName
    if(entity)
    {
     entityName=entity.name;
     entity.name=this.submitXpath||entityName;
	}
	for(var i=0;i<this.__subComponent.length;i++){
		var ob = this.__subComponent[i];
		if (ob && ob.freshFromEntity){
			ob.freshFromEntity(entity);
		}
	}
	if(entity) entity.name=entityName;
}

/**
 * 根据指定enetity刷新列表数据
 * @parame {Entity} 作为刷新条件的eneity
 */
ComboSelect.prototype.freshFromEntity = function(entity){
	if(this.queryAction){
		if (entity){		
			if(this.dataType=="json"){
				this.queryParam = entity.toJson();
			}else{
				this.queryParam = entity.toString();
			}
			// this.queryParam = entity.toString();
		}else{
			this.queryParam =null;
		}		
		this.loadData();
	}else if(this.linkField){
		if (entity){
			this.dataset = entity.getProperty(this.linkField);
			if (!this.dataset){
				this.dataset =new Dataset(this.linkField);
				entity.setProperty(this.linkField,this.dataset);
			}
		}else{
			this.dataset = new Dataset(this.linkField);
		}
	}
	this.refresh();

}

/**
 * @private
 * 刷新列表选择项
 */

ComboSelect.prototype.refresh=function(dataset){
	this.init();
	if(this.isIeMode==true) {
	var rowNum =  this.dataset?this.dataset.getLength():0;
	while(this.select.options.length!=0)
	{
	this.select.options.remove(this.select.options[0]);
	}
	
	if(this.nullText!==null){	
			var o=new Option();
			o.text=this.nullText;
			o.value="";
			this.select.options.add(o)}
	for (var rn=0;rn<rowNum;rn++){
		var entity = this.dataset.get(rn);
		var oValue=entity.getProperty(this.valueField);
		var oText=entity.getProperty(this.textField);
		var o=new Option();
			o.text=oText;
			o.value=oValue;
			if(oValue==this.value) o.selected=true;
			o.entity=entity;
			this.select.options.add(o)
		}
		var o=this.select.options[this.selectedIndex||0];
		if(o!=null)
		 entity =o.entity
		 if(entity!=null);
		 this.setSubComponent(entity);
	return;
	}
	if (this.beforeRefresh()===false){
		return;
	}
	var comboSelect=this;
	this.dataset= dataset || this.dataset;
	var rowNum =  this.dataset?this.dataset.getLength():0;


	if (this.noOrgOptionsHeight==true){
		this.optionsHeight=((rowNum>10?10:rowNum) * 21+2);
	}


	if (this.optionsDiv){
		removeElement(this.optionsDiv);
	}

	this.optionsDiv=$createElement("div");
	this.optionsDiv.className='eos-combo-optiondiv';

	this.inputObject.value="";
	this.hiddenObject.value="";


	function outClick(){
		var el=eventManager.getElement();
		if (el!=comboSelect.eventObject && !comboSelect.inputObject.getAttribute("_isFocus")
				&& !comboSelect.eventObject.getAttribute("_isFocus")) {
			if (!comboSelect.allowInput) {
				//comboSelect.selectOption();
				comboSelect.inputObject.value= comboSelect.selectEntity.getProperty(comboSelect.textField);
				comboSelect.hiddenObject.value= comboSelect.selectEntity.getProperty(comboSelect.valueField);
			}
			comboSelect.hide();
		}
	}

//this.optionsWidth = this.optionsWidth || this.container.offsetWidth ;
	if (!this.optionsHeight){
		this.noOrgOptionsHeight=true;
		this.optionsHeight=((rowNum>10?10:rowNum) * 21+2);
	}
/*	if ( (''+this.optionsWidth).indexOf("%")<1 && (''+this.optionsWidth).indexOf("px")<1 ){
			this.optionsWidth= parseInt(this.optionsWidth)-(isBorderBox?-3:1) +'px';
	}
	if ( (''+this.optionsHeight).indexOf("%")<1 && (''+this.optionsHeight).indexOf("px")<1 ){
			this.optionsHeight= parseInt(this.optionsHeight)-(isBorderBox?-3:1) +'px';
	}*/
	//this.optionsDiv.style.width= this.optionsWidth;
	this.optionsDiv.style.height= this.optionsHeight;

	document.body.appendChild(this.optionsDiv);
	this.optionsDiv.onmousedown = function(){
		eventManager.stopEvent();
	}
	function getTR(event){
			event = event || window.event;
			var cell= event.srcElement || event.target;
			eventManager.stopPropagation();
			if (cell.tagName.toLowerCase()!='tr'){
				while( (cell=cell.parentNode) ){
					if(cell.tagName && cell.tagName.toLowerCase()=='tr' && cell.getAttribute("__entity_rowno") ){
						break;
					}
				}
			}

			var tab=getParentByTagName(cell,'table');
			return tab && tab.className=='eos-combo-optiontable'?cell:null;
	}


	function overOption(event){
		if (comboSelect.selectOptionRow){
			removeClass(comboSelect.selectOptionRow,'eos-selectoption');
		}
		comboSelect.optionsDiv.setAttribute("_isOver",true);
		var tr = getTR(event);
		addClass(tr,'eos-selectoption');
		if (comboSelect.activeOptionRow==tr){
			return;
		}
		if (comboSelect.activeOptionRow){
			removeClass(comboSelect.activeOptionRow,'eos-selectoption');
		}
		comboSelect.activeOptionRow =tr;
	}


	function outOption(event){
		comboSelect.optionsDiv.setAttribute("_isOver",false);
	}

	function clickOption(event){
		var tr = getTR(event);
		if (tr){
			comboSelect.selectOption(tr);
		}
		comboSelect.hide();
		try{comboSelect.inputObject.focus();}catch(e){}
	}

	eventManager.add(this.optionsDiv,"mouseover",overOption);
	eventManager.add(this.optionsDiv,"mouseout",function(){
		setTimeout( outOption ,300) ;
	});
	eventManager.add(this.optionsDiv,"click",clickOption);
	function stopEvent(){
		eventManager.stopPropagation();
	}
	eventManager.add(this.optionsDiv,"mousedown",stopEvent);



	var tableHTML=[ '<div class="eos-combo-optiondiv-core"><table  class="eos-combo-optiontable" border="0" cellspacing="0" cellpadding="0" width="100%" ><tbody>' ];

	for (var rn=0;rn<rowNum;rn++){

		var entity = this.dataset.get(rn);
		var oValue=entity.getProperty(this.valueField);
		var oText=entity.getProperty(this.textField);
		tableHTML.push( '<tr __entity_rowno="'+rn+'" >');
		tableHTML.push( '<td><div><nobr>');
		tableHTML.push(oText==''?' ':oText);
		tableHTML.push( '</nobr></div></td>');
		if (this.showValue){
			tableHTML.push( '<td><div>');
			tableHTML.push(oValue);
			tableHTML.push( '</div></td>');
		}

		tableHTML.push( '</tr>');

	}
	tableHTML.push( '</tbody></table ></div>');
	//var tt=window.isIE?"<iframe src='"+blankURL+"' SCROLLING=\"no\" style=\"overflow:hidden;position:absolute;z-index:-1;width:expression(this.nextSibling.offsetWidth);height:expression(this.nextSibling.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft)\" frameborder=\"0\" ></iframe>":"<span style=\"display:none;\"></span>";
	var tt=window.isIE?"<iframe src='"+blankURL+"' SCROLLING=\"no\" style=\"overflow:hidden;position:absolute;z-index:-1;\" frameborder=\"0\" ></iframe>":"<span style=\"display:none;\"></span>";
   
	this.optionsDiv.innerHTML=tt+tableHTML.join("\n");


	this.optionsDiv.childNodes[1].style.height=this.optionsDiv.style.height;
	this.optionsDiv.childNodes[1].style.width=this.optionsDiv.style.width;
	this.optionsDivCore =this.optionsDiv.childNodes[1];
	this.optionsTable = this.optionsDivCore.firstChild;
	
	var hasRefreshSub=false;

	if (this.value){
		this.setValue(this.value,false);
	}
	else
	 if (this.optionsTable && this.optionsTable.tBodies && this.optionsTable.tBodies[0]) {
		var rows=this.optionsTable.tBodies[0].rows;
		if( rows && rows.length>0){
			this.selectOption(rows[0]);
			hasRefreshSub=true;
		}
	}
	if (!hasRefreshSub)	{
		this.setSubComponent(this.getEntityByValue(this.value));
	}
	this.afterRefresh();

}

/**
 *下拉窗口在键盘选择时自动滚动.
 */
ComboSelect.prototype.autoScroll = function(row){
			var acTop=row.offsetTop;
			var acBottom= acTop+row.offsetHeight;
			var bdTop = this.optionsDivCore.scrollTop;
			var bdBottom = bdTop + this.optionsDivCore.clientHeight;
//			acRight-=fix;
//			acLeft-=fix;
			if (acTop<bdTop) {
				this.optionsDivCore.scrollTop=acTop ;
			}else if (acBottom>bdBottom){
				this.optionsDivCore.scrollTop = bdTop + acBottom-bdBottom;
			}

}



/**
 *绑定树,实现ComboTreeSelect.
 */
ComboSelect.prototype.boundTree=function(treeId,hiddenValue,textValue)
	{
	    if($id(treeId)==null)
	       {
	        alert("Can not find tree:"+treeID);
	        return;
	       }
	    var treeContainer;
	    if($id(treeId).model!=null)
	    {
	     treeContainer=$id(treeId+"_container")
	    }
	    else
	    {
	    treeContainer=$id(treeId+"_container").parentNode;
	    }
	    
	    hiddenValue=hiddenValue||"";
	    textValue=textValue||"";
		this.afterRefresh=function()
			{
			this.hidden.value=hiddenValue;
		    this.text.value=textValue;
			this.optionsDiv.childNodes[1].appendChild(treeContainer);;
			treeContainer.onclick=function(){eventManager.stopPropagation();}
			}
	}

/**
 *初始化之前调用的方法,用户可以重写该方法.
 */
ComboSelect.prototype.beforeInit = function(){ }

/**
 *初始化以后调用的方法,用户可以重写该方法.
 */
ComboSelect.prototype.afterInit = function(){ }

ComboSelect.prototype.beforeLoadData = function(){ }
ComboSelect.prototype.afterLoadData = function(){ }
ComboSelect.prototype.beforeRefresh = function(){ }
ComboSelect.prototype.afterRefresh = function(){ }