
var DATACELL_STYLE_ROW1 = "EOS_table_row";
var DATACELL_STYLE_ROW2 = "ROW_STYLE2_NOCSS";// 交替行的样式，经邵斐确认，交替行可以只用一种样式，其他的使用table的背景色.

var DATE_FORMAT = "yyyy-MM-dd";
var TIME_FORMAT = "HH:mm:ss";
var DATETIME_FORMAT = "yyyy-MM-dd HH:mm:ss";

var PICTURE_BLANK = PICTURE_BLANK || '';
/**
 * datacell对象.
 * @class
 * @param {Object} id 唯一标识
 */
function Datacell(id){

	//用于标识交互使用的是xml还是json,新改造中推荐使用json
	this.dataType=EOS.dataType;

	this.id = id;//datacell的id
	PageControl.add(id,this);
	this.activeRow = null;//被选中的行.
	this.activeCell = null;//正在编辑的单元格.
	this.table = null;//datacell的table容器.
	this.container = null;//datacell的最外层容器,DIV标记,ID为:datacell的ID+ container
	this.pilot = null;//工具条.
	this.thead = null;//表头.
	this.tbody = null;//表身.
	this.isCount = false;//是否返回记录总数.
	this.queryAction = null;//查询的action
	this.xpath = null;//xpath
	this.submitAction = null;//提交的action
	this.dataset = null;//数据对象.
	this.sortParam  = null;//服务器端排序参数.
	this.queryParam = null;//查询参数,存放联动的entity的xml.
	this.pageParam = null;
	this.editor = null;//当前编辑控件.
	this.fields = new Array();//字段信息.
	this.keys = new Object();//用属性存放field的id.
	this.bodyDiv = null;//包在table外面的滚动层.
	this.scrollEvent = true;
	this.fixedLeft = 0;
	this.editorDiv = null;
	this.editorContainer = null;
	this.styleEntity = null;
	this.__subComponent = new Array();//联动的子对象存放数组.
	this.linkField = null;//关联字段.
	this.linkId = null;//关联字段.
	this.filterId = null;//过滤器(form)ID
	this.paramFormId = null ;	//提供查询参数的form的ID
	this.rowStyles = [DATACELL_STYLE_ROW1,DATACELL_STYLE_ROW2];
	this.styleRow = null;
	this.status = Datacell.STATUS_BLANK;
	this.isModefied = false;
	this.cellHeight = 20;

	this.heightExceptBody = 23+ 25;
	this.headHeight = 23;
	this.toolBarHeight = 25;
	this.scrollDiv = null;
	this.showIndex = true; //是否显示索引列
	this.indexCol = null;
	this.sortArrow = null;
	this.__pagePilot = [];

	this.allowAdd = true;
	this.allowDel = true;
	this.readonly = false;//是否只读.

	this.initParamFunc = null;
	this.SortByServer = false;//判断是否是服务器端排序.
	this.submitXpath = null;

	this.minColumnWidth = 30;
	this.toolbarLocation=null ;//'bottom';

	this.toolsList="nav,pagesize,edit,custom,info";
	this.pageSizeList="none"  //"10,20,50,100";


	this.defaultColumnWidth = 100 ;

	this.topToolbarDiv=$createElement("div",{className:'eos-grid-toolbar'});
	this.topToolbarDiv.style.display='none';

	this.bottomToolbarDiv=$createElement("div",{className:'eos-grid-toolbar'});
	this.topToolbarDiv.style.display='none';

	this.isFirstLoad=true;
	//this.pageCount = 10;
	this.pageSize = 10;
	this.datacellContainer = null;

	this.quickEdit=true;
	this.sortAt="client";

	this.rowSelectStyleClass = 'eos-row-selected'; //选中行的class.
	this.rowEvenStyleClass='eos-row-even';
	this.rowStyleClass='eos-row';

	this.headTextAlign="left";

	this.width = 500;
	this.height = 300;

	this.queryReturnValue = null;
	this.queryParamsInfo = null;
	this.queryInoutParams = null;
	this.submitReturnValue = null;
	this.submitParamsInfo = null;
	this.submitInoutParams = null;

	this.entityType = null;
	this.entityName = null;

}

/*
编辑单元格之后,是否同步刷新整行.
*/
Datacell.prototype.syncRefresh=true;





/**
 * 创建单元格的view控件.该方法先检查是否有edit控件,如果有则隐藏它,
 * 然后检查是否有业务字典,如果有则获得业务字典的显示值,
 * 然后检查是否有用户自定义的onfresh函数,如果有则调用onfresh函数.将cell和value传给它.
 * 最后根据定义的viewType控件生成view控件.
 * @param {Object} cell 单元格.
 */
 Datacell.prototype.refreshCell = function(cell,field){
	var datacell =this;
	var key = cell.getAttribute("fieldId");
	field = field || datacell.keys[key];

	if(key==Datacell.__INDEX_NAME || datacell.beforeRefreshCell(cell,field)===false){
		return;
	}
	var div=cell.firstChild;
	var type = field.viewType;
	div.innerHTML = datacell.createCellValue(cell,field);
}


/* 将当前datacell 设置为 激活的 datacell */
Datacell.prototype.activeMe=function(){
	Datacell.activeGrid=this;

}
/**
 * @private
 * 页面载入时执行的初始化方法
 */

Datacell.prototype.onPageLoad=function(){

	PageControl.registerRelation(this.linkId,this.id);

	var Me=this;
	
	var onload=function me_on_load(){
		Me.init();
		Me.loadData();
		Me.refresh();
		if(!isIE){
			Me.autoResizeS1();
			Me.autoResizeS2();
		}
	};
	
	if(EOS.loader.isReady){
		onload();
	}else{
		EOS.onReady(onload);
	}
	//eventManager.add(window,'load',me_on_load);
};



/**
 * @private
 * 得到单元格的值，如果有onfresh则执行onfresh,
 * 否则如果是dataset或entity则返回高级控件.
 * 最后返回cell.value
 * @param {Object} cell
 * @param {Object} field
 */
Datacell.prototype.createCellValue = function(cell,field){
	//if(!cell.value||cell.value==""){
	//	return "";
	//}
	if (!cell){ return ;}
	var row = cell.parentNode;
	var entity = this.getEntity(row);
	var key = cell.getAttribute("fieldId");
	if(key==Datacell.__INDEX_NAME){
		return;
	}
	var field = this.keys[key];

	var cellText=entity.getProperty(field.fieldName); /* onRefreshFunc */

	if (field.onRefreshFunc){
		if (typeof(field.onRefreshFunc)=="string"){
			field.onRefreshFunc=eval(field.onRefreshFunc);
		}

		cellText=field.onRefreshFunc(cellText,entity,cell.parentNode.rowIndex,cell.cellIndex,this);
	}else if (field.expression){
		cellText=runExpression(field.template,entity);
	}else if (field.editor){
		cellText= htmlConversion(field.editor.getDisplayValue(cellText));
	}else{
		cellText= htmlConversion(cellText===undefined||cellText===null?field.nullText:cellText);
	}
	//cellText= cellText===undefined||cellText===null?field.defaultValue:cellText;
	cellText= cellText===undefined||cellText===null? htmlConversion(field.nullText):cellText;
	//cellText=htmlConversion(cellText) ;
	return cellText ;
}

/**
 * 清空表格的方法.
 */
Datacell.prototype.clear = function(){
	if (this.tbody && this.table){
		var _tbody = this.tbody.cloneNode(false);
		this.table.replaceChild(_tbody,this.tbody);
		this.tbody = _tbody;
	}
	if (this.dataset){
		this.dataset.clear();
	}
	this.dataset =null;
	this.styleRow = null;

}
/**
 * 清空表格对象属性的方法.
 */
Datacell.prototype.clearup = function(){
	for(var prop in this){
		try{
			this[prop] = null;
		}catch(e){
			$handle(e);
		}
	}
}


/*
根据列的位置 或 fieldName 或 列表的某个单元格, 取得满足条件的第一个列模型.
*/
Datacell.prototype.getField = function(cell){
	if (cell===null ||cell===undefined){
		return cell;
	}
	if (typeof cell =='number'){
		return this.fields[cell]
	}
	if (typeof cell =='string'){
		return this.getFieldByName(cell);
	}
	if (String(cell.tagName).toLowerCase()=='td'){
		var key = cell.getAttribute("fieldId");
		if(key==Datacell.__INDEX_NAME){
			return null;
		}
		var field = this.keys[key];
		return field;
	}
	return cell;
}

/*
根据列的fieldName 取得满足条件的第一个列模型.
*/
Datacell.prototype.getFieldByName = function(fieldName){
	for (var i=0;i<this.fields.length;i++ ){
		if (this.fields[i].fieldName == fieldName){
			return this.fields[i];
		}
	}
	return null;
}

/*
根据列的fieldName 取得满足条件的所有列模型.
*/
Datacell.prototype.getFieldsByName = function(fieldName){
	var f=[];
	for (var i=0;i<this.fields.length;i++ ){
		if (this.fields[i].fieldName == fieldName){
			f.push(this.fields[i]);
		}
	}
	return f;
}

/*
取得总列数
*/
Datacell.prototype.getFieldCount = function(){
	return this.fields.length;

}

/*
设置某列的列表头信息
*/
Datacell.prototype.setTitle = function(field,label){
	field = this.getField(field);
	if (field){
		field.labelSpan.innerHTML=label;
		var fhd=field.frozeHeadCell;
		if (fhd && fhd.firstChild && fhd.firstChild.firstChild ){
			fhd.firstChild.firstChild.innerHTML=label;
		}
	}
}

/*
设置某列是否允许修改
*/
Datacell.prototype.setAllowModify = function(field,allowModify){
	field = this.getField(field);
	if (field){
		field.allowModify=allowModify;
	}
}



/*
复制行的方法
*/
Datacell.prototype.copyRow = function(row){
	return this.cloneEntity(null,row);
}

/*
复制entity的方法
*/
Datacell.prototype.cloneEntity = function(entity,row){
	entity = entity || this.getEntity(row || this.activeRow);
	if (entity){
		entity= entity.clone();
		entity.status = Entity.STATUS_NEW;
	}
	return entity;
}


/*
读取单元格对应的 entity的属性值
*/
Datacell.prototype.getCellValue =function(cell){
	var row=cell.parentNode;
	var entity=row?this.getEntity(row):null;
	if (entity){
		var field=this.getField(cell);
		var name=field.fieldName;
		return entity.getProperty(name);
	}
	return null;
}

/*
设置单元格对应的 entity的属性值
*/
Datacell.prototype.setCellValue =function(cell,value){
	if (!cell){
		return false;
	}
	var row=cell.parentNode;
	var entity=row?this.getEntity(row):null;
	if (entity){
		var field=this.getField(cell);
		var name=field.fieldName;
		entity.setProperty(name,value);
		this.refreshCell(cell);
		this.refreshRow(row);
        entity.status = Entity.STATUS_MODIFIED;
        this.isModefied=true;
		return true;
	}
	return false;
}

/**
 * 根据行索引和列索引获得单元格的方法.cellIndex也可以写单元格的name名称.
 * @param {Object} rowIndex
 * @param {Object} cellIndex
 */
Datacell.prototype.getCell = function(rowIndex,cellIndex){
	var rowI = parseInt(rowIndex);
	if(!isNaN(rowI)){
		var row = this.tbody.rows[rowI];
		if(row){
			return this.getCellByRow(row,cellIndex);
		}
	}
	return null;
}
/**
 * 根据行获得单元格的方法.
 * @param {Object} row
 * @param {Object} cellIndex
 */
Datacell.prototype.getCellByRow = function(row,cellIndex){
	if(isNaN(cellIndex)){
		var cellName = cellIndex;
		for(var i=0;i<row.cells.length;i++){
			if(row.cells[i].getAttribute("fieldId")==cellName){
				return row.cells[i];
			}
		}
	}else{
		return row.cells[cellIndex];
	}
}
/**
 * 选择同一行的其它单元格的方法，传入一个单元格，根据cellIndex选中本行其它单元格.
 * @param {Object} cell
 * @param {Object} cellIndex
 */
Datacell.prototype.getCellAtRow = function(cell,cellIndex){
	var row = this.getRowByCell(cell);
	return this.getCellByRow(row,cellIndex);
}
/**
 * 获得当前选中行的单元格的方法，如果没有选中行，则返回null
 * @param {Object} cellIndex
 */


/*
取得当前行的某一个单元格
*/
Datacell.prototype.getCellByCurrRow = function(cellIndex){
	if(this.activeRow){
		return this.getCellByRow(this.activeRow,cellIndex);
	}else{
		return null;
	}
}

/*
根据行号或 td 取得某一行(tr)
*/
Datacell.prototype.getRow = function(rowNo){
	if (typeof rowNo == 'number' ){
		return this.getRowAt(rowNo);
	}
	if (rowNo.tagName && rowNo.tagName.toLowerCase()=="td"){
		return rowNo.parentNode;
	}
	return rowNo;
}

/*
根据行号取得某一行(tr)
*/
Datacell.prototype.getRowAt = function(rowNo){
	try{
		return this.table.tBodies[0].rows[rowNo];
	}catch(e){
		return null;
	}
}
/**
 * 根据单元格获得行的方法.
 * @param {Object} cell
 */
Datacell.prototype.getRowByCell = function(cell){
	if(cell){
		if(cell.parentNode&&cell.parentNode.tagName&&cell.parentNode.tagName.toLowerCase()=="tr"){
			return cell.parentNode;
		}
	}
	return null;
}
/**
 * 根据单元格获得本行entity的方法.
 * @param {Object} cell
 */
Datacell.prototype.getEntityByCell = function(cell){
	var row = this.getRowByCell(cell);
	if(row){
		return this.getEntity(row);
	}
	return null;
}
/**
 * 获得datacell当前选中行的方法.
 */
Datacell.prototype.getCurrRow = function(){
	return this.activeRow;
}

/**
 * 清空表格的方法.
 */
Datacell.prototype.getValueForEdit=function(entity,fieldName){
	return entity.getProperty(fieldName);

}


/**
 * @private
 * datacell的初始化.该方法初始化datacell.
 * 依次对conatiner,bodyDiv,table,thead,tbody进行初始化.
 */

Datacell.prototype.init = function(){

		if (this.inited===true || this.beforeInit()===false){return;}

		if(this.entityType&&!(this.entityType.indexOf("sdo:")==0||this.entityType.indexOf("java:")==0)){
			this.entityType = "sdo:" + this.entityType;
		}

		this.PAGE_INFO = this.PAGE_INFO || PAGE_INFO;
		this.PAGE_RECORDINFO = this.PAGE_RECORDINFO || PAGE_RECORDINFO ;
		this.PAGE_INFO_NOCOUNT = this.PAGE_INFO_NOCOUNT || PAGE_INFO_NOCOUNT;
		this.PAGE_RECORDINFO_NOCOUNT = this.PAGE_RECORDINFO_NOCOUNT || PAGE_RECORDINFO_NOCOUNT;

		this.activeMe();
		this.datacellContainer = $id(this.id + "_container");

		if (this.freezeNumber>0){
			this.showIndex=true;
		}
		this.tableMarginLeft= this.showIndex ? 12 : 0;

		this.containerTable = $id(this.id + "_container_table");

		if (isIE){
			this.containerTable.className="eos-b-ie "+this.containerTable.className;
		}

		if ( (''+this.width).indexOf("%")<1 && (''+this.width).indexOf("p")<1 ){
			this.width= parseInt(this.width)+'px';
		}

		if ( (''+this.height).indexOf("%")<1 && (''+this.height).indexOf("p")<1 ){
			this.height= parseInt(this.height)+'px';
		}

	if ( this.freezeNumber && this.freezeNumber>this.fields.length ){
		this.freezeNumber=this.fields.length;
	}

	this.paramFormId = this.paramFormId || this.filterId;
	this.cTop=0;
	if ( !this.toolbarLocation || this.toolbarLocation=='null'){
		this.containerTD=this.containerTable.tBodies[0].rows[0].cells[0];
		this.containerTable.tBodies[0].rows[1].style.height='0px';
		this.containerTable.tBodies[0].rows[1].style.display="none";
		//removeElement(this.containerTable.tBodies[0].rows[1] );
	}else if (this.toolbarLocation=='top'){
		this.containerTD=this.containerTable.tBodies[0].rows[1].cells[0];

		this.toolbarParent=this.containerTable.tBodies[0].rows[0].cells[0];
		this.toolbarParent.appendChild(this.topToolbarDiv);
		this.toolbarParent.style.height='25px';
		//this.toolbarParent.style.backgroundColor ='red';

		this.topToolbarDiv.style.display='block';
		this.topToolbarDiv.style.borderBottomWidth='1px';
		this.cTop=this.topToolbarDiv.offsetHeight;
	}else{
		this.containerTD=this.containerTable.tBodies[0].rows[0].cells[0];

		this.toolbarParent=this.containerTable.tBodies[0].rows[1].cells[0];
		this.toolbarParent.appendChild(this.bottomToolbarDiv);
		this.toolbarParent.style.height='25px';
		//this.toolbarParent.style.backgroundColor ='red';

		this.bottomToolbarDiv.style.display='block';
		this.bottomToolbarDiv.style.borderTopWidth='1px';
	}

	this.container =$createElement("div");
	this.container.className= 'eos-grid' //(isIE?'eos-b-ie ':'')+'eos-grid';
	this.containerTD.appendChild(this.container);
	this.container.innerHTML='';
	this.container.style.display = "";

	this.viewport=$createElement("div");
	this.viewport.className='eos-viewport';

	//this.container.style.width=this.width;
	this.container.style.width="100%";

	this.containerTable.style.width=this.width;
	this.containerTable.style.height=this.height;


	//this.container.style.width=this.containerTable.style.width

	//this.viewport.style.width=this.containerTable.style.width


	this.bodyDiv=$createElement("div");
	this.bodyDiv.className='eos-body-div';

	this.bodyDivHeight =this.containerTD.offsetHeight - this.headHeight;

	this.bodyDivHeight=parseInt(this.bodyDivHeight);
	if (this.bodyDivHeight<0){
		this.bodyDivHeight =parseInt(this.height) - ( this.headHeight + this.toolBarHeight );
	}

	if (this.bodyDivHeight>0){
		this.bodyDiv.style.height= this.bodyDivHeight + 'px';
	}
	this.headDiv=$createElement("div");
	this.headDiv.className='eos-head-div';

	this.headWrap=$createElement("div");
	
	/**@desc不知道为什么要加3000的宽度*/
	// this.headWrap.style.width='3000px';
	this.headDiv.appendChild(this.headWrap);

	//this.container.appendChild(this.topToolbarDiv);
	this.container.appendChild(this.viewport);
	//this.container.appendChild(this.bottomToolbarDiv);
	this.cTop=0;
	if (this.toolbarLocation=='top'){
		this.topToolbarDiv.style.display='block';
		this.topToolbarDiv.style.borderBottomWidth='1px';
		this.cTop=this.topToolbarDiv.offsetHeight;
	}else{
		this.bottomToolbarDiv.style.display='block';
		this.bottomToolbarDiv.style.borderTopWidth='1px';
	}

	this.viewport.appendChild(this.headDiv);
	this.viewport.appendChild(this.bodyDiv);


//this.containerTable.style.width = "100%"
	this.viewport.style.width = this.width||"100%"
	this.headDiv.style.width = "100%"
	this.bodyDiv.style.width = "100%"

	this.container.style.display = "";
	this.splitLine= $createElement("div", {  className:'eos-split-line'  });
	this.splitLine.style.top=this.cTop+'px';
	this.container.appendChild(this.splitLine);


	this.gridMask = $createElement("div" ,{  className:'eos-grid-mask'} );
	this.gridMask.style.width= this.container.style.width;
	this.gridMask.style.height=this.container.style.height;
	this.container.appendChild(this.gridMask);

	this.initPageParam();

	this.initCSS();


	this.initHead();
	this.initFreezeZone();
	this.initEvent();

	for(var i=0;i<this.__pagePilot.length;i++){
		var pilot = this.__pagePilot[i];
		pilot.build();
	}

	this.inited=true;
	this.afterInit();
}

/*
用来选中 datacell中,触发事件的元素所在的行,同时返回该行.
*/
Datacell.prototype.selectEventRow = function(){
	var el = eventManager.getElement();
	var row=getParentByTagName(el,"tr");
	this.selectRow(row);
	return row;
}

Datacell.prototype.showCellEditor=function(value,record){
		if (this.activeEditor && this.activeCell){

		//this.pActiveElement=document.activeElement;

			this.editorContainer =  $id( this.id+"_"+this.activeField.fieldId+'_field_editor_container') ||$id( this.activeField.fieldId+'_field_editor_container');
			var editEntity=this.getEntity( this.activeCell );
			var value = this.getValueForEdit(editEntity, this.activeField.fieldName);
			if( this.dict){
				value = getDictKey( this.dict,value);
			}
			try{
				if(this.editorContainer.parentNode!=document.body){
					if(!(this.activeField.editor.constructor==window['RichTextEditor']&&isIE)){
						document.body.appendChild(this.editorContainer);
					}
					if(this.activeField.editor.constructor==window['RichTextEditor']){
						var commen =this.editorContainer.getElementsByTagName("iframe")[0];
						if(commen){
							this.activeField.editor.editableContainer = commen.contentDocument?commen.contentDocument.body:commen.document.documentElement.body;
						}
					}
				}

				/**修改richtext控件在datacell中不显示的bug，container的宽度被设置成了0px**********start*/
				 if (isIE) {
					 	try{
							if(this.activeField.editor.constructor==window['RichTextEditor']){
								this.editorContainer.style.width='';
								this.editorContainer.style.height='';
								this.activeField.editor.container.style.width="900px";
							}
						}catch(e){}
					 };
				/**修改richtext控件在datacell中不显示的bug，container的宽度被设置成了0px**********end*/
				
				
				this.activeEditor.hideEditor();
				var pos = getPosition( this.activeCell );
				if(this.activeEditor.setPosition){

					this.editorContainer.style.display="";
					this.editorContainer.onmousedown = function(){
						eventManager.stopEvent();
					} 
					if(this.activeEditor.tagName=='SELECT'){
						this.activeEditor.onmousedown=null;
						this.editorContainer.onmousedown=null;
					}
					
					var thisTagName = this.activeEditor.tagName;
					if(isIE && thisTagName && thisTagName.toLowerCase() == "select"){
						this.activeEditor.style.display = "";
					}
					this.activeEditor.setPosition(pos.left,pos.top, this.activeCell.offsetWidth, this.activeCell.offsetHeight);

					if(isIE && thisTagName && thisTagName.toLowerCase() == "select"){
						this.activeEditor.style.display = "none";
					}
					/*if(!this.activeEditor.hide){
						this.activeEditor.hide = this.activeEditor.hideEditor;
					}*/
					var obj = {};
					obj.editor = this.activeEditor;
					obj.datacell = this;
					obj.hide = function(obj,parent,event){
						if(this.datacell){
							if(this.editor==(event.target||event.srcElement)){
								return;
							}
							this.datacell.hideCellEditor();
							Datacell.activeGrid=null;

						}
					}
					PageControl.addtoStack(obj);
					//this.activeEditor.showEditor(this);
					//this.activeEditor.focus();
					
					var el = this;
					setTimeout(function () {
						el.activeEditor.showEditor(el);
						el.editing = true;
					}, 1);
				}

				if (this.activeEditor.xtype=="combo") {
					/*
					var parentValue="";
					if (this.activeEditor.parentCmp) {
						parentValue = this.getValueForEdit(editEntity, this.activeEditor.parentCmp.fieldName);
						this.activeEditor.parentCmp.setValue(parentValue,true);
					}
					this.activeEditor.hiddenObject.value=value;
					var foundOption=this.activeEditor.setValue(value,true);

					if (!foundOption) {
						this.activeEditor.selectOptionByIndex(0,true);
					}
					*/

					this.activeEditor.setValue(value===undefined||value===null?'':value,true);
					if (this.activeEditor.setDisplayValue) {
						var displayValue= trim(this.activeCell.innerText);
						this.activeEditor.setDisplayValue(displayValue);
					}

				}else{
					this.activeEditor.setValue(value===undefined||value===null?'':value);
					if (this.activeEditor.setDisplayValue) {
						var displayValue= trim(this.activeCell.innerText);
						this.activeEditor.setDisplayValue(displayValue);
					}
				}

			}catch(e){
				//throw e
			}

		}
	};




Datacell.prototype.hideCellEditor= function(){
		if (this.activeCell && this.activeEditor) {
			if (this.editing){
				var row=this.activeCell.parentNode;
				var value=this.activeEditor.getValue();
				//var validResult=this.activeEditor.doValid(value);
				//if (validResult===true) {
				var oldValue = this.activeValue;
				var newValue = value;
				if ( oldValue!= newValue ) {

					var key = this.activeCell.getAttribute("fieldId");
					if(key==Datacell.__INDEX_NAME){
						//this.afterEdit(this.activeCell)
						return true;
					}
					if (! this.activeEditor.validate() ){
						//this.afterEdit(this.activeCell)
						this.editing=false;
						this.unlocked();
						this.endEdit();
						return false;
					}

					if(this.onUpdateRow( this.activeCell.parentNode )){
						var execUpdateEntity=this.onUpdateCell(this.activeCell,this.activeEntity,this.activeField.fieldName,value);

						(execUpdateEntity!==false) && this.updateEntity( this.activeEntity,this.activeField.fieldName,value);
						this.refreshAfterEdit();

						this.isModefied = true;
						if (this.linkId && this.linkField){
							var ob = PageControl.getOne(this.linkId);
							if (ob){
								if (ob.activeRow){
									ob.getEntity(ob.activeRow).status = Entity.STATUS_MODIFIED;
								}
								ob.refreshAfterEdit();
								ob.isModefied = true;
							}
						}
						//addClass( this.activeCell,'eos-cell-modefied');
						//this.activeCell.value = value;
						this.activeValue=value;
					}

				}
				//}else{
				//	this.showValidResult(value,validResult,this.activeCell);
				//}
				this.afterEdit( newValue, oldValue , this );
			}else{

			}
			this.editing=false;
			try{
				this.activeEditor.hideEditor();
				var ae = this.activeEditor;
//				setTimeout(function () {
//					ae.hideEditor();
//				}, 1);
			}catch(e){}
			return true;
		}
		return true;
	};


Datacell.prototype.refreshAfterEdit = function(){
	if (this.syncRefresh){
		this.refreshRow( this.activeCell ? this.activeCell.parentNode : this.activeRow );
	}else{
		this.refreshCell( this.activeCell,this.activeField );
	}
}

Datacell.prototype.startEdit=function(){
		if ( !this.activeEditor || !this.activeField || !this.activeEntity
			||  !this.activeField.allowModify && this.activeEntity.status != Entity.STATUS_NEW){
			return;
		}
		this.activeMe();
		var cell=this.getActiveCell();
		if(this.beforeEdit(cell,cell.cellIndex,cell.parentNode.rowIndex)==false) return;
		this.editing=true;
		this.showCellEditor(this.activeValue , this.activeEntity);
		//this.afterEdit();
};

Datacell.prototype.endEdit=function(){
	this.hideCellEditor();
	this.editing=false;
	this.beforeShowEditor=false;
//	try {this.pActiveElement.focus();}catch(e){}
};


Datacell.prototype._onKeyDown =  function(event){
				event= event || window.event;
				var oldCell=this.activeCell;
				var newCell=null;
				var kcode=event.keyCode;

				if (kcode ==  EOSKey.ESC) {
					eventManager.stopEvent();
					this.editing=false;
					this.endEdit();
				}else if (kcode ==  EOSKey.ENTER) {
				    var srcEl=eventManager.getElement();
				    if(srcEl!=null&&srcEl.tagName.toLowerCase()=="textarea") return;
					eventManager.stopEvent();
					/***执行行选中***/
					if (this.editing) {
						this.endEdit();
					} else {
						this.selectRow(oldCell.parentNode);
						this.startEdit();
					}

				}else if (this.editing && kcode==EOSKey.TAB){
					eventManager.stopEvent();
					this.endEdit();
					newCell= nextElement(oldCell);
					if (!newCell){
						newCell= nextElement(oldCell.parentNode);
						if (newCell){
							newCell=newCell.cells[0];
						}
					}
					this.setActiveCell(event,newCell);
					var Me=this;
					//Me.startEdit();
					window.setTimeout(function(){	Me.startEdit(); } ,10);
				}else if (oldCell && !this.editing){
					switch (kcode){
						case EOSKey.LEFT :
							eventManager.stopEvent();
							newCell= prevElement(oldCell);
							if (!newCell){
								newCell= prevElement(oldCell.parentNode);
								if (newCell){
									newCell=newCell.cells[newCell.cells.length-1];
								}
							}
							break;
						case EOSKey.TAB :
						case EOSKey.RIGHT :
							eventManager.stopEvent();
							this.selectRow(oldCell.parentNode);
							newCell= nextElement(oldCell);
							if (!newCell){
								newCell= nextElement(oldCell.parentNode);
								if (newCell){
									newCell=newCell.cells[0];
								}
							}
							break;

						case EOSKey.DOWN :
							eventManager.stopEvent();
							newCell= nextElement(oldCell.parentNode);
							if (newCell){
								newCell=newCell.cells[oldCell.cellIndex];
							}
							break;
						case EOSKey.UP :
							eventManager.stopEvent();
							newCell= prevElement(oldCell.parentNode);
							if (newCell){
								newCell=newCell.cells[oldCell.cellIndex];
							}
							break;
					}

					if (newCell) {
						eventManager.stopEvent();
						//GT.Grid.handleOverRowCore(event,this,newCell.parentNode);
						this.setActiveCell(event,newCell);
					}

				}


	};

Datacell.prototype.autoScroll = function(){

			var acLeft=this.activeCell.offsetLeft + this.tableMarginLeft ;

			var acRight=acLeft+this.activeCell.offsetWidth+this.tableMarginLeft;

			var acTop=this.activeCell.offsetTop;
			var acBottom= acTop+this.activeCell.offsetHeight;
			var bdLeft = this.bodyDiv.scrollLeft;
			var bdTop = this.bodyDiv.scrollTop;

			var bdRight = bdLeft + this.bodyDiv.clientWidth +this.tableMarginLeft ;
			var bdBottom = bdTop + this.bodyDiv.clientHeight;

			var fix=  this.freezeHeadDiv.offsetWidth;
//			acRight-=fix;
//			acLeft-=fix;

			if (acLeft<bdLeft) {
				this.bodyDiv.scrollLeft=acLeft - this.tableMarginLeft ;
			}else if (acRight  >bdRight){
				this.bodyDiv.scrollLeft = bdLeft + acRight - bdRight;
			}

			if (acTop<bdTop) {
				this.bodyDiv.scrollTop=acTop ;
			}else if (acBottom>bdBottom){
				this.bodyDiv.scrollTop = bdTop + acBottom-bdBottom;
			}

}

Datacell.prototype.setActiveCell = function(event , newActiveCell){
   //兼容接口setActiveCell(newActiveCell);
    if(arguments.length==1)
    {
     if(event!=null&&event.tagName.toLowerCase()=="td")
     {
     newActiveCell=event;
     event=null;
     }
    }
	this.activeMe();
	event= event || window.event;
	var cell= event ? (event.srcElement || event.target) : null;
	newActiveCell = newActiveCell || getEventTargetByTagName(event,'td');


			if (newActiveCell) {
				var cellHTML=newActiveCell.innerHTML.toLowerCase();

			if (newActiveCell!=this.activeCell){
					this.activeField=this.getField(newActiveCell);
					this.activeEditor = this.activeField?this.activeField.editor :null;

					removeClass(this.activeCell,'eos-cell-actived');

					if (cellHTML.indexOf('<select')<0 ){
						addClass(newActiveCell,'eos-cell-actived');
					}
					this.activeCell=newActiveCell;
				}

				this.activeEditRow=this.activeCell.parentNode;
				this.activeEntity=this.getEntity(this.activeEditRow);
				this.activeEntityBackup = this.activeEntity.clone();
				if (this.activeEntity && this.activeField)	{
					this.activeValue= this.activeEntity.getProperty(this.activeField.fieldName);
				}
				if (cellHTML.indexOf('<select')<0 ){
					this.autoScroll();
				}
			}
			return newActiveCell;

	}

/**
 *@private
 * 初始化datacell的事件.
 */
 Datacell.prototype.initEvent = function(){
// add container Event
// add head Event
// add bodyDiv Event
	var datacell = this;

	function scrollDiv(event){
		datacell.activeMe();
		datacell.freezeBodyDiv.style.height = datacell.bodyDiv.clientHeight+'px';
		datacell.syncScroll();
		if (datacell.beforeShowEditor!==true){
			if (datacell.activeEditor ){
				//datacell.endEdit();
				try{
					datacell.activeEditor.hideEditor();
				}catch(e){}
			}
		}
		
		
		datacell.hideCellEditor();
		//datacell.beforeShowEditor=false;

	}
	eventManager.add(this.bodyDiv,"scroll",scrollDiv);

	function clickTable(event){
			datacell.activeMe();
			datacell.endEdit();
			var targetTD=  getEventTargetByTagName(event,"td");
			var targetTR=targetTD?targetTD.parentNode:null;



			if ( targetTD && targetTD!==datacell.containerTD){   // grid.editing && targetTD
				datacell.selectRow(targetTR);
				datacell.setActiveCell(event,targetTD);
				datacell.processCheckBox(event,targetTD);
				var colIdx= targetTD.cellIndex;
				var rowIdx= targetTR.rowIndex;
				datacell.onClickCell(targetTD,colIdx,rowIdx,datacell.activeEntity,datacell.fields[colIdx],datacell);
				datacell.onClickRow(targetTR, rowIdx ,datacell.activeEntity,datacell);
				datacell.beforeShowEditor=true;
				datacell.startEdit();
//				setTimeout(function(){	datacell.startEdit();},2000);
			}
	}

	eventManager.add(this.bodyDiv,"click",clickTable);

	function clickHead(event){
		datacell.activeMe();
//		Datacell.processBlur(datacell.table);
		datacell.endEdit();
	}
	eventManager.add(this.headDiv,"click",clickHead);

	function _activeMe(){
		datacell.activeMe();
	}
	try {
	eventManager.add(this.viewport,"mouseup",_activeMe);
	eventManager.add(this.headDiv,"mouseup",_activeMe);
	eventManager.add(this.bodyDiv,"mouseup",_activeMe);
	eventManager.add(this.datacellContainer,"mouseup",_activeMe);
	eventManager.add(this.containerTable,"mouseup",_activeMe);
	eventManager.add(this.container,"mouseup",_activeMe);
	eventManager.add(this.topToolbarDiv,"mouseup",_activeMe);
	eventManager.add(this.bottomToolbarDiv,"mouseup",_activeMe);
	eventManager.add(this.toolbarParent,"mouseup",_activeMe);
	}catch(e){}


	function clickFreezeTable(event){
		datacell.activeMe();
		event = event || window.event;
		var cell= event.srcElement || event.target;
		eventManager.stopPropagation();
		if (cell && cell.tagName.toLowerCase()!='td'){
			while( (cell=cell.parentNode) ){
				if(cell.tagName && cell.tagName.toLowerCase()=='td'){
					break;
				}
			}
		}
			if (!cell.parentNode){
				return;
			}
			var trNo= cell.parentNode.rowIndex;
			var colNo=cell.cellIndex-1;
			if (colNo<0){
				datacell.selectRow(datacell.table.tBodies[0].rows[trNo],true);
				return;
			}
			var bcell=datacell.table.tBodies[0].rows[trNo].cells[colNo];

			if (datacell.activeCell==bcell){
				datacell.activeFreezeCell=cell;
				return;
			}
			//datacell.selectCell(bcell);
			datacell.activeFreezeCell=cell;

		}

		eventManager.add(this.freezeBodyDiv,"click",clickFreezeTable);

		//this.bodyDiv.onkeydown = Datacell.onKeyDown;

		function windowResize(){
			Datacell.onWindowResize(datacell);
		}
		if(isIE)
			   if ( (''+datacell.width).indexOf("%")>0 || (''+datacell.height).indexOf("%")>0){
				eventManager.add(window,"resize",windowResize);
		}
		if(isFF)

			  if ( (''+datacell.width).indexOf("%")>0 || (''+datacell.height).indexOf("%")>0){
					 if( registerTopContainer(this.datacellContainer))  EOSResizeObjects.push(this);
		}


		function clearUp(){
			datacell.clearup();
		}
		eventManager.add(window,"unload",clearUp);

	if (!Datacell.initGlobalEvent.hasInit){
		Datacell.initGlobalEvent();
		Datacell.initGlobalEvent.hasInit=true;
	}


 };

Datacell.prototype.processCheckBox = function(event,targetTD){
    var datacell=this;
    var eventTarget= event.srcElement || event.target;
	if("INPUT"==eventTarget.tagName.toUpperCase())
		{
			if(eventTarget.getAttribute("swidthCheckbox")=="true"&&eventTarget.getAttribute("type")=="checkbox")
			{
				var currValue=datacell.getCellValue(targetTD);
				var field=datacell.fields[targetTD.cellIndex];
				currValue=currValue==field.checkedValue?field.unCheckedValue:field.checkedValue;
				datacell.setCellValue(targetTD,currValue);
			}
		}

}

Datacell.prototype.startColumnResize = function(evt,field){
	if (field.allowResize===false){
		return;
	}
	evt=evt||window.event;
	this.viewportXY=getElementXY(this.viewport);

	this.isColumnResizing=true;
	var mX=eventManager.getPointX();
	field.oldRightX= mX - this.viewportXY[0] ;
	this.splitLine.style.left= field.oldRightX  +"px";
	this.splitLine.style.height=this.viewport.offsetHeight+"px";
	this.splitLine.style.display="block";
	this.headDiv.style.cursor = "col-resize";
	this.gridMask.style.cursor = "col-resize";
	this.gridMask.style.display="block";
	this.gridMask.style.height="100%";
	this.resizeColumn=field;

}


Datacell.prototype.syncScroll=function(){
	this.scrollDiv.style.width = this.headTable.offsetWidth;
	var isIE8 =  navigator.userAgent.toLowerCase().indexOf("msie 8") != -1;
	if(isIE7||isIE8){
			if(this.bodyDiv.scrollLeft + this.bodyDiv.clientWidth+1 > this.bodyDiv.scrollWidth){
				this.headDiv.scrollLeft = this.bodyDiv.scrollLeft == 0 ? 0 : this.bodyDiv.scrollLeft+15;
			}else{
				this.headDiv.scrollLeft = this.bodyDiv.scrollLeft;
			}
		}else{
			this.headDiv.scrollLeft = this.bodyDiv.scrollLeft;
		}
	
	this.freezeBodyDiv.scrollTop=this.bodyDiv.scrollTop;
	return  
}

Datacell.prototype.setColumnWidth = function(field,newWidth){
		field = this.getField(field);
		newWidth=newWidth<this.minColumnWidth?this.minColumnWidth:newWidth;
		field.width= newWidth //<field.minWidth?field.minWidth:newWidth;
		field.rules.style.width=field.width +'px';
		//CSSUtil.updateRule("." + field.styleClass,"width",field.width +'px');


}

/**
 * @private
 * 初始化列表的css
 */
  Datacell.prototype.setFieldEditor = function(field,cellEditId){
			field = this.getField(field);
			var editor=null;
			cellEditId=cellEditId||field.editId;
			if(cellEditId) {
				editor=Datacell.$editor( $id( cellEditId ) );

				//cellEditId=$id( cellEditId ) ? cellEditId :
				//	( $id(cellEditId+ "_container")?cellEditId+ "_container":
				//		( $id(cellEditId+ "_field_editor_container")?cellEditId+ "_field_editor_container":cellEditId)) ;

			}
			if (!editor){

				var editorContainer =  $id( this.id+"_"+field.fieldId + "_field_editor_container") || $id( field.fieldId + "_field_editor_container") ;
				var firstE=firstElement(editorContainer);
				if (editorContainer && firstE )	{
					cellEditId = firstE.id ;

					if (cellEditId &&  cellEditId.indexOf('_container')>0 ){
						cellEditId=cellEditId.substring(0,cellEditId.length-10);

						editor=Datacell.$editor(  $o( cellEditId )||$id( cellEditId ) );
					}else{
						editor=Datacell.$editor( firstE);
					}

				}
			}

			field.editId= cellEditId;
			field.editor= editor ;
			if (editor){
				editor.fieldName=field.fieldName;
				editor.hideEditor();
			}

  }

 Datacell.prototype.initCSS = function(){

		this.viewportXY=getElementXY(this.viewport);

		var cssText=[];
		var grid=this;
		for (var i=0;i<this.fields.length ; i++){
			var field=this.fields[i];
			field.width=parseInt( field.width || this.defaultColumnWidth );
			field.styleClass = 'eos-dc-col-'+this.id+'-'+i;
			field.rules = createStyle(field.styleClass,document);

			field.align= field.align || null;
			field.alignStyle= field.align? 'text-align:'+field.align+';' : '';

			cssText[i]="." + field.styleClass +" { width:"+ field.width + "px;  "+field.alignStyle+" }";
			field.rules.style.width = field.width + "px";
			if(field.align){
				field.rules.style.textAlign = field.align;
			}
			field.allowModify= field.allowModify===undefined||field.allowModify===null?!grid.readonly:!!field.allowModify;
			
			this.setFieldEditor(field);
		}

		if (1==2&&!this.addedCSS){
			CSSUtil.createStyleSheet(cssText.join("\n"),this.id + "_style");
			this.SCROLLBAR_WIDTH = 16;
			this.addedCSS=true;
		}

 }

/**
 * @private
 * 将列表的所有行对象放入一个数组中,
 */
Datacell.prototype.initAllRows = function(refresh){
	if (!refresh && this.allTR && this.allTR.length>0){
		return this.allTR;
	}
	this.allTR=[];
	var rows=this.table.tBodies[0].rows;
	for (var i=0;i<rows.length;i++ ){
		this.allTR[i]=rows[i];
	}
	return this.allTR;

};


/**
 * @public
 * 刷新行的间隔样式.
 */
Datacell.prototype.refreshRowStyle = function(){
	this.initAllRows(true);
	var freezeRows = this.freezeHeadTable?this.freezeBodyTable.tBodies[0].rows:[];

	for ( var rn=0; rn < this.allTR.length; rn++) {
		var currentTR = this.allTR[rn];
		currentTR.className=currentTR.className.replace( this.rowEvenStyleClass,'');
		if (rn%2==0){
			currentTR.className=currentTR.className+' '+this.rowEvenStyleClass;
		}else{
			currentTR.className=currentTR.className.replace(this.rowEvenStyleClass,'');
		}
		var fr =freezeRows[rn]||{};
		fr.className=currentTR.className;
		//var fix= this.showIndex?1:0;
		//for (var i=0;i<this.freezeNumber ;i++ ){
			//var cell=freezeRows[rn].cells[i+fix];
			//var newCell= currentTR.cells[i].cloneNode(true);
			//freezeRows[rn].replaceChild(newCell,cell);
			//fr.className=currentTR.className;
		//}
	}

};

/* 取得当前页的有效行数 */
Datacell.prototype.getCurrentRowCount = function(){
	var rows= this.table.tBodies[0].rows;
	return rows?rows.length:0;
}

/* 取得当前页的原始记录行数 */
Datacell.prototype.getPageRowCount = function(){
	var rowNum=0;
	if (this.dataset){
		rowNum=this.getCurrentRowCount();
		rowNum=rowNum- (this.dataset.getInsertEntities()?this.dataset.getInsertEntities().length:0);
		rowNum=rowNum+ (this.dataset.getRemovedEntities()?this.dataset.getRemovedEntities().length:0);
	}
	return rowNum;
}
/* 取得总记录数 */
Datacell.prototype.getTotalRowCount = function(){
	if (this.__pagePilot && this.__pagePilot[0] ){
		return this.__pagePilot[0].count || 0;
	}
	return -1;
}

/**
 * @private
 * 取得所有行对象组成的数组.
 */
Datacell.prototype.getAllRows = function(refresh){
	this.initAllRows(refresh);
	return this.allTR;
};

 Datacell.prototype.freezeColumn = function(colNum){
	var freezeRows = this.freezeHeadTable.tBodies[0].rows;


		for (var cn=0;cn<colNum ; cn++){
			var field=this.fields[cn];
			field.frozeHeadCell= this.headTable.tBodies[0].rows[0].cells[cn].cloneNode(true);
			field.frozeSortIcon=field.frozeHeadCell.getElementsByTagName('span')[1];
			field.frozeSplitter=field.frozeSortIcon.nextSibling;
			if (freezeRows.length>0){
				freezeRows[0].appendChild(field.frozeHeadCell);
			}

		}

	this.initAllRows();
	freezeRows= this.freezeBodyTable.tBodies[0].rows;
	var rowNum=this.allTR.length;

	for (var i=freezeRows.length;i< rowNum-freezeRows.length ;i++ )	{
		var newFRow=this.styleFreezeRow.cloneNode(true);
		newFRow.className=this.allTR[i].className;
		newFRow.appendChild(this.styleIndexColumn.cloneNode(true));
		this.freezeBodyTable.tBodies[0].appendChild(newFRow);
	}

	for (var rn=0;rn<rowNum ;rn++ ){
		for (var cn=0;cn<colNum ; cn++){
				var colL= this.allTR[rn].cells[cn].cloneNode(true);
				freezeRows[rn].appendChild(colL);
		}

	}
 }

/**
 * @private
 * 排列表格的快速排序算法
 */
Datacell.prototype.quickSort=function(start,end,getValue,fieldName,isDesc){
	    var datacell=this;
        var sTemp=start;
        var middleE=end+1;

		var max=middleE;
		var arr=datacell.allTR;

		var oTemp=arr[start];

        var temp= getValue( this,oTemp,fieldName );
		var tempV;
		if (isDesc){
			while(true){
				while( ++sTemp<end && getValue( this, arr[sTemp],fieldName ) >=temp);
				while( --middleE>start && getValue(this, arr[middleE],fieldName ) <=temp);
				if(sTemp>=middleE) break;
				tempV=arr[sTemp];arr[sTemp]=arr[middleE];arr[middleE]=tempV;
			} ;
		}else{
			while(true){
				while( ++sTemp<end && getValue(this, arr[sTemp],fieldName ) <=temp);
				while( --middleE>start && getValue(this, arr[middleE],fieldName ) >=temp);
				if(sTemp>=middleE) break;
				tempV=arr[sTemp];arr[sTemp]=arr[middleE];arr[middleE]=tempV;
			} ;
		}
        arr[start]=arr[middleE]; arr[middleE]=oTemp;

		middleE-=1;
		if (start<middleE){
			datacell.quickSort(start,middleE,getValue,fieldName,isDesc);
		}
		middleE+=2;
		if (middleE<end){
			datacell.quickSort(middleE,end,getValue,fieldName,isDesc);
		}
		return arr;
    };


/**
 * @private
 * 执行排序操作
 */
Datacell.prototype.doSort=function(field){

	if (!field.sortAt || field.sortAt=="null" || field.sortAt=="none" || field.sortAt=="undefined"){
		return;
	}


	this.initAllRows();
	if (this.allTR.length<1){
		return;
	}
	if (this.lastSortField){
		removeClass(this.lastSortField.sortIcon,'eos-hd-asc');
		removeClass(this.lastSortField.frozeSortIcon,'eos-hd-asc');
		removeClass(this.lastSortField.sortIcon,'eos-hd-desc');
		removeClass(this.lastSortField.frozeSortIcon,'eos-hd-desc');
	}
	if (field.sorted=='asc'){
		field.sorted='desc';
		addClass(field.sortIcon,'eos-hd-desc');
		addClass(field.frozeSortIcon,'eos-hd-desc');
	}else if (field.sorted=='desc'){
		field.sorted=''
	}else{
		field.sorted='asc';
		addClass(field.sortIcon,'eos-hd-asc');
		addClass(field.frozeSortIcon,'eos-hd-asc');
	}

	this.lastSortField=field;

	if (field.sortAt){

		field.sortAt=(''+field.sortAt).toLowerCase();
		if (field.sortAt=="server" || field.sortAt.indexOf('s')==0 ){
			if(field.sorted){
				var sp={
					_orderby:{
						_property:field.fieldName
					}
				}
				if(field.sorted){
					sp._orderby._sort=field.sorted;
				}
				this.sortParam=sp;
			}else{
				this.sortParam = {};
			}
		
			/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	
			var sortInfo=[
				'<_orderby>',
//					'<_'+ field.sorted +'>',
//						field.fieldName ,
//					'</_' + field.sorted + '>',
					'<_property>',
					field.fieldName ,
					'</_property>',
					field.sorted?'<_sort>':'',
					field.sorted?field.sorted:'',
					field.sorted?'</_sort>':'',
				'</_orderby>'
			];
			
			if(field.sorted){
				this.sortParam=sortInfo.join('');
			}else{
				this.sortParam = "";
			} */
			try{
				this.endEdit();
			}catch(e){}
			var countValue = 0;
			if(!this.isCount){
				countValue = -1;
			}
			var pageParam = this.setPageParam(0, this.pageSize, countValue ,this.isCount);

			this.gotoPage(pageParam);
			return;
		}
	}




	if (field.sorted){
		this.quickSort(0,this.allTR.length-1, Datacell.getSortValue, field.fieldName, field.sorted=='desc');
	}else{
		this.quickSort(0,this.allTR.length-1, Datacell.getSortDefaultValue, field.fieldName, field.sorted=='desc');
	}

	var freezeRows= this.freezeBodyTable.tBodies[0].rows;
	var fix= this.showIndex?1:0;
	var oFragment = document.createDocumentFragment();
		for ( var rn=0; rn < this.allTR.length; rn++) {
			var currentTR = this.allTR[rn];
			currentTR.className=currentTR.className.replace( this.rowEvenStyleClass,'');
			if (rn%2==0){
				currentTR.className=currentTR.className+' '+this.rowEvenStyleClass;
			}else{
				currentTR.className=currentTR.className.replace(this.rowEvenStyleClass,'');
			}
			for (var i=0;i<this.freezeNumber ;i++ ){
				var cell=freezeRows[rn].cells[i+fix];
				var newCell= currentTR.cells[i].cloneNode(true);
				freezeRows[rn].className=currentTR.className;
				freezeRows[rn].replaceChild(newCell,cell);
			}
			oFragment.appendChild( currentTR );
		}
		this.table.tBodies[0].appendChild(oFragment);

}

/**
 * @private
 * 初始化列表表头的事件
 */
Datacell.prototype.initHeadEvent=function(){
	if (this.hasInitHeadEvent) {
		return;
	}
	var datacell = this;
	var colNum = datacell.fields.length;
	for (var cn = 0; cn < colNum; cn++) {
		var field = datacell.fields[cn];
		(function (fieldT) {
			eventManager.add(fieldT.splitter, "mousedown", function (event) {
				datacell.startColumnResize(event, fieldT);
			});
			eventManager.add(fieldT.frozeSplitter, "mousedown", function (event) {
				datacell.startColumnResize(event, fieldT);
			});
			
			eventManager.add(fieldT.headCell, "mouseover", function (event) {
				addClass(fieldT.headCell, 'eos-hd-row-over');
			});
			eventManager.add(fieldT.frozeHeadCell, "mouseover", function (event) {
				addClass(fieldT.frozeHeadCell, 'eos-hd-row-over');
			});
			eventManager.add(fieldT.headCell, "mouseout", function (event) {
				removeClass(fieldT.headCell, 'eos-hd-row-over');
			});
			eventManager.add(fieldT.frozeHeadCell, "mouseout", function (event) {
				removeClass(fieldT.frozeHeadCell, 'eos-hd-row-over');
			});
			
			eventManager.add(fieldT.headCell, "click", function (event) {
				datacell.onClickHead(fieldT.headCell, cn, fieldT, datacell);
				datacell.doSort(fieldT);
			});
			eventManager.add(fieldT.frozeHeadCell, "click", function (event) {
				datacell.doSort(fieldT);
			});
			
		})(field);
	}
	this.hasInitHeadEvent = true;
	
};


/**
 * 初始化datacell表头的函数.该函数初始化datacell的thead,
 * keys,styleEntity(插入新行时克隆一个styleEntity.)以及加上固定表头的信息.
 */
Datacell.prototype.initHead = function () {
	
	this.headTable = $createElement("table", {
			className : "eos-head-table",
			cellSpacing : "0",
			cellPadding : "0",
			border : "0"
		}); 
	this.headWrap.appendChild(this.headTable); 
	this.headTbody = $createElement("tbody");
	this.headTable.appendChild(this.headTbody);
	
	var colNum = this.fields.length;
	var colName = [];
	for (var i = 0; i < colNum; i++) {
		this.keys[this.fields[i].fieldId] = this.fields[i];
		colName.push(this.fields[i].fieldId);
	}
	
	var headRow = $createElement("tr");
	headRow.className = "eos-hd-row";
	this.headTbody.appendChild(headRow);
	
	this.styleRow = $createElement('tr', {
			className : this.rowStyleClass
		});
	this.styleFreezeRow = $createElement('tr', {
			className : this.rowStyleClass
		});
	
	var tagName = this.getSubmitXpath();
	var createStyleEntity = false;
	if (!this.styleEntity) {
		this.styleEntity = this.styleEntity || new Entity(tagName);
		this.styleEntity.id = 0;
		this.styleEntity.__type = this.entityType;
		createStyleEntity = true;
	}
	
	for (var cn = 0; cn < colNum; cn++) {
		var cell = $createElement("td");
		var field = this.fields[cn];
		if (createStyleEntity) {
			this.initStyleField(field);
		}
		if (window.isGecko) {
			//cell.style.height="22px";
		}
		cell.className = field.styleClass;
		cell.style.textAlign = this.headTextAlign;
		cell.innerHTML = ["<div class=\"eos-hd-inner ", (window.isGecko ? 'eos-hd-inner-ff ' : ''), field.styleClass, "\" unselectable=\"on\" style=\"text-align:left;\" >", '<span>', field.label, '</span>', '<div class="eos-hd-tool" ><span class="eos-hd-icon"></span><span class="eos-hd-split">&#160;</span></div>', "</div>"].join('');
		headRow.appendChild(cell);
		
		field.headCell = cell;
		field.labelSpan = cell.firstChild.firstChild;
		field.sortIcon = cell.getElementsByTagName('span')[1];
		field.splitter = field.sortIcon.nextSibling;
		field.splitter.colID = cn;
		field.splitter.style.cursor = 'col-resize';
		field.defaultValue = field.defaultValue || '';
		field.sortAt = field.sortAt || 'client';
		field.nullText = field.nullText || '';
		
		field.template = field.expression ? compileTemplate(field.expression) : null;
		
		var styleCell = $createElement("td", {
				innerHTML : '<div class="eos-inner ' + field.styleClass + '"  ></div>',
				className : field.styleClass
			});
		styleCell.setAttribute('name', field.fieldId);
		this.styleRow.appendChild(styleCell);
		
	}
	
	var isClone = false;
	
	if (!this.dataset) {
		this.dataset = new Dataset(this.entityName);
	}
	
	var width = 0;
	
	return;
	
}



/**
 *@private
 * 初始化styleField的方法,该方法根据field的类型(dataset,entity,other)
 * 来初始化styleEntiey的field,以供新加行时使用.
 * @param {Object} field 需要初始化的field.由服务器端传入.
 */
Datacell.prototype.initStyleField = function (field) {
	
	if (field.editType == "entity") {
		var value = new Entity(field.fieldName);
		this.styleEntity.setProperty(field.fieldName, value);
	} else if (field.editType == "dataset") {
		var value = new Dataset(field.fieldName);
		this.styleEntity.setProperty(field.fieldName, value);
	} else if (field.defaultValue !== null && field.defaultValue !== undefined) {
		this.styleEntity.setProperty(field.fieldName, field.defaultValue);
	} else {
		this.styleEntity.setProperty(field.fieldName, "");
	}
}

/**
 *@private
 *初始化锁定列的函数
 */
 Datacell.prototype.initFreezeZone = function(){


		//this.freezeDiv=GT.Grid.cloneTemplate("div", {id:this.id+"_freeze" , className :"eos-freeze-div" } );
		//this.viewport.appendChild(this.freezeDiv);

		this.freezeHeadDiv= $createElement("div", { className :"eos-freeze-div" } );
		this.freezeBodyDiv=  $createElement("div", { className :"eos-freeze-div" } );
		this.viewport.appendChild(this.freezeHeadDiv);
		this.viewport.appendChild(this.freezeBodyDiv);
		this.cTop = 0;
		this.freezeHeadDiv.style.top=this.cTop+ "px";
		this.freezeBodyDiv.style.top= this.cTop+this.headHeight+ "px";

		//this.bodyDiv.appendChild(this.freezeBodyDiv);

		this.freezeHeadTable= $createElement("table", { id: this.headTable.id +"_freeze", className:"eos-head-table",
				cellSpacing : "0"  ,  cellPadding : "0" ,border :"0" } );
		this.freezeHeadDiv.appendChild(this.freezeHeadTable);
		
		
	};


/**
 *@private
 * 初始化datacell表身的函数.
 */

Datacell.prototype.initBody = function () {
	
	var tableStartHTML = '<table class=\"eos-table\" cellSpacing=\"0\"  cellPadding=\"0\" border=\"0\" ><tbody>';
	
	var trHTML = ["<tr class=\"" + this.rowStyleClass, " " + this.rowEvenStyleClass, "\" __entity_rowno=\"", "\" >\n", "</tr>\n"];
	
	var colNum = this.fields.length;
	var rn = 0;
	var tableHTML = [];
	var rowHTML;
	
	var freezeTableHTML = [tableStartHTML];
	
	var indexColumnWidth = this.tableMarginLeft - (isBorderBox ? 0 : 2);
	
	/*var indexColumnDivWidth = this.tableMarginLeft - (isBorderBox ? 0 : 4);*///by wujun
	var indexColumnDivWidth = this.tableMarginLeft
	
	var tdStyleClass = isIE ? "style=\"width:" + this.tableMarginLeft + "px;\"" : '';
	var divStyleClass = isIE ? '' : "style=\"width:" + (this.tableMarginLeft - (isBorderBox ? 0 : 4)) + "px;\"";
	//tdStyleClass= divStyleClass ="style=\"width:"+ indexColumnWidth +"px;\"";
	
	var indexColumnCell = [
		
		'<td class="eos-index-col" ' + tdStyleClass + ' ><div class="eos-inner" style="width:' + (indexColumnDivWidth - 4) + 'px" >',
		'</div></td>'
	];
	
	this.styleIndexColumn = $createElement('td', {
			className : 'eos-index-col'
		});
	if (isIE) {
		this.styleIndexColumn.style.width = this.tableMarginLeft + 'px';
	}
	this.styleIndexColumn.innerHTML = '<div class="eos-inner" ' + divStyleClass + ' >&#160;</div>';
	
	if (this.freezeBodyTable) {
		removeElement(this.freezeBodyTable);
		removeElement(this.freezeHeadTable.tBodies[0]);
	}
	this.freezeHeadTable.appendChild($createElement("tbody"));
	
	if (this.showIndex) {
		
		var headRow = $createElement("tr", {
				className : "eos-hd-row"
			});
		this.freezeHeadTable.tBodies[0].appendChild(headRow);
		var colN = $createElement("td", {
				innerHTML : '<div class=\"eos-hd-inner' + (window.isGecko ? ' eos-hd-inner-ff ' : '') + '\" style="width:' + (indexColumnDivWidth - 5) + 'px" >&#160;</div>',
				className : 'eos-index-col'
			});
		
		if (isIE) {
			colN.style.width = indexColumnWidth + "px";
		}
		
		headRow.appendChild(colN);
		this.freezeHeadDiv.style.display = "block";
		
		this.freezeHeadDiv.style.left = '0px';
		
	}
	
	var datasetLength = !this.dataset ? 0 : this.dataset.getLength();
	var rowNum = this.pageSize || datasetLength;
	
	rowNum = (rowNum < 0 || datasetLength < rowNum) ? datasetLength : rowNum;
	
	var colName = [];
	for (var i = 0; i < colNum; i++) {
		colName.push(this.fields[i].fieldId);
	}
	// this.defaultColumnWidth
	
	tableHTML.push(tableStartHTML);
	for (rn = 0; rn < rowNum; ) {
		var entity = this.dataset.get(rn);
		
		rowHTML = [[trHTML[0], (rn % 2 == 0 ? trHTML[1] : ''), trHTML[2], rn, trHTML[3]].join('')];
		
		if (this.showIndex) {
			freezeTableHTML.push(rowHTML[0]);
			freezeTableHTML.push(indexColumnCell[0]);
			freezeTableHTML.push('&#160;' + indexColumnCell[1]);
			freezeTableHTML.push('</tr>\n');
		}
		
		for (var cn = 0; cn < colNum; cn++) {
			/*
			var key = cell.getAttribute("fieldId");
			if(key==Datacell.__INDEX_NAME){
			return;
			}
			var field = this.keys[key];
			var fieldName = field.fieldName;
			cell.value = entity.getProperty(fieldName)?entity.getProperty( fieldName ):"";
			Datacell.refreshCell(cell);
			 */
			var field = this.fields[cn];
			
			var cellText = entity.getProperty(field.fieldName);
			/* onRefreshFunc */
			
			if (field.onRefreshFunc) {
				if (typeof(field.onRefreshFunc) == "string") {
					field.onRefreshFunc = eval(field.onRefreshFunc);
				}
				cellText = field.onRefreshFunc(cellText, entity, rn, cn, this);
			} else if (field.expression) {
				cellText = runExpression(field.template, entity);
			} else if (field.editor) {
				cellText = htmlConversion(field.editor.getDisplayValue(cellText))
					
			} else {
				cellText = htmlConversion(cellText === undefined || cellText === null ? field.nullText : cellText);
			}
			
			//cellText= cellText===undefined||cellText===null?field.defaultValue:cellText;
			cellText = cellText === undefined || cellText === null ? field.nullText : cellText;
			
			//cellText=htmlConversion(cellText);
			
			//rowHTML.push( "<td fieldId=\""+colName[cn]+"\" class=\""+ field.styleClass +"\"><div class=\"eos-inner "+ field.styleClass +"\" >"+cellText+"</div></td>");
			rowHTML.push("<td fieldId=\"");
			rowHTML.push(colName[cn]);
			rowHTML.push("\" class=\"");
			rowHTML.push(field.styleClass);
			rowHTML.push("\"><div class=\"eos-inner ");
			rowHTML.push(field.styleClass);
			rowHTML.push("\" >");
			rowHTML.push(cellText);
			rowHTML.push("</div></td>");
		}
		rowHTML.push(trHTML[4]);
		tableHTML.push(rowHTML.join(''));
		rn++;
	}
	
	for (var bi = 0; bi < this.pageSize - datasetLength; bi++) {
		for (var cn = 0; cn < colNum; cn++) {}
	}
	
	tableHTML.push("</tbody></table><div style=\"width:100%;height:1px;font-size:0px;\">&nbsp;</div>");
	
	this.bodyDiv.innerHTML = tableHTML.join("");
	this.table = this.bodyDiv.firstChild;
	this.table.datacell = this;
	this.tbody = this.table.tBodies[0];
	this.scrollDiv = this.table.nextSibling;
	this.scrollDiv.style.width = this.headTable.offsetWidth;
	
	//eventManager.addOutClick(this.bodyDiv,function(dc){ dc.endEdit() },this);
	
	
	this.freezeBodyDiv.innerHTML = freezeTableHTML.join('');
	this.freezeBodyTable = this.freezeBodyDiv.firstChild;
	
	this.isModefied = false;
	
	if (this.showIndex) {
		this.headTable.style.marginLeft = this.tableMarginLeft + 1 + "px";
		this.table.style.marginLeft = this.tableMarginLeft + 1 + "px";
		//this.headTable.style.paddingRight = this.tableMarginLeft + 1 + "px";
	} else {
		this.headTable.style.marginLeft = 0 + "px";
		this.table.style.marginLeft = 0 + "px";
	}
	
	this.initAllRows(true);
	
	if (this.freezeNumber > 0) {
		this.freezeColumn(this.freezeNumber);
	}
	
	this.initHeadEvent();
	
	var datacell = this;
	function tt() {
		datacell.freezeBodyDiv.style.height = datacell.bodyDivHeight - 0 + 'px';
		if (datacell.headDiv.clientHeight > 10) {
			datacell.freezeBodyDiv.style.height = datacell.bodyDiv.clientHeight + 'px';
		}
		//datacell.headDiv.style.width= datacell.bodyDiv.clientWidth+'px';
		//datacell.headDiv.style.width=datacell.width;
	}
	//tt();
	
	
	//window.setTimeout(tt,2000);
	
	return;
	
}

/**
 * 初始化样式行的函数.样式行是换行显示样式的基础.
 * 样式行是一个数组,换行按行的索引取余数.初始化表身.
 */
Datacell.prototype.initStyleRow = function(){
	if(!this.rowStyles instanceof Array){
		this.rowStyles = this.rowStyles.split(",");
	}

}


/**
 * 锁定datacell的函数.在datacell的container上面放一个层,
 * 层中放一个透明图片.禁止datacell的所有操作.
 */
Datacell.prototype.locked = function(){
//	Datacell.processBlur(this.table);
	this.endEdit();
	var div = $id(Datacell.BLOLK_ID);
	var img = $id(Datacell.BLOLK_ID + "_IMG");
	if(!div){
		div = $createElement("div");
		document.body.appendChild(div);
		div.id = Datacell.BLOLK_ID;
	}
	if(!img && PICTURE_BLANK){
		img=$createElement("img");
		img.src = PICTURE_BLANK;
		img.id = Datacell.BLOLK_ID + "_IMG";
		div.appendChild(img);
	}
	div.style.cursor="wait";
	div.style.position="absolute";
	div.style.zIndex="1";
	var pos = getPosition(this.container);
	div.style.top = pos.top;
	div.style.left = pos.left;
	div.style.width = this.container.offsetWidth;
	div.style.height = this.container.offsetHeight;
	if (img){
		img.style.width = div.style.width;
		img.style.height = div.style.height;
		img.border = "0";
	}
	div.style.display = "block";
}
/**
 * 为datacell解锁的函数.
 */
Datacell.prototype.unlocked = function(){
	var div = $id(Datacell.BLOLK_ID);
	if(div){
		div.style.display = "none";
	}

}


/* 插入一个空行 */
Datacell.prototype.insertEmptyRow = function(){
	return this.insertRow( this.styleEntity.clone(true) );
}
/**
 * 在选择行处插入一行.数据为传入的entity,如果没有传入,择复制选择行的数据.
 * 设置entity的状态为新增. 如果没有选择行,则执行新增行操作.
 */
Datacell.prototype.insertRow = function(entity,orow){

	if (typeof orow=='number'){
		orow=this.getRowAt(orow);
	}
	//orow= orow || this.activeRow;
	entity= entity || this.cloneEntity() || this.styleEntity.clone(true);

	if ( orow && entity ){
			entity.status = Entity.STATUS_NEW;
			var oldIndex=orow.rowIndex;
			removeClass(this.activeCell,'eos-cell-actived');
			var row =  orow.cloneNode(true);
			addClass(this.activeCell,'eos-cell-actived');
			this.dataset.addEntity(entity);
			this.tbody.insertBefore(row, orow);
			row.setAttribute('__entity_rowno',this.dataset.getLength()-1 );

			var oldFRow=this.freezeBodyTable.tBodies[0].rows[oldIndex];
			var newFRow=this.styleFreezeRow.cloneNode(true);
			newFRow.className=row.className;
			newFRow.appendChild(this.styleIndexColumn.cloneNode(true));
			this.freezeBodyTable.tBodies[0].insertBefore(newFRow,oldFRow);

			this.refreshRow(row);
			this.selectRow(row);
	        this.isModefied = true;
			if (this.linkId && this.linkField){
					var ob = PageControl.getOne(this.linkId);
					if (ob){
						ob.isModefied = true;
					}
			}
			return row;

	}
	return this.addRow(entity);

}

/**
 * 添加一行的函数.
 * @param 新行对应的entity.设置entity的状态为新增. 如果不传,则默认插入styleEntity.
 *
 */
Datacell.prototype.addRow = function(entity){
	//Datacell.processBlur(this.table);
	this.endEdit();
	if(!this.allowAdd||this.readonly){
		return null;
	}
	var index = this.tbody.rows.length;
	if(index<0){
		index =0;
	}


	var newEntity = entity ||  this.styleEntity.clone(true);
	newEntity.status = Entity.STATUS_NEW;

if (!this.dataset){
	return null;
}
	var row = this.styleRow.cloneNode(true);
	row.setAttribute('__entity_rowno',this.dataset.getLength() );

	if ( this.beforeAdd(row)===false ) {
		row =null;
		delete row;
		return null;
	}

	this.dataset.addEntity(newEntity);
	this.tbody.appendChild(row);
	for (var i=0;i<row.cells.length;i++ ){
		row.cells[i].setAttribute('fieldId',this.fields[i].fieldId );
	}

	var index = (this.tbody.rows.length + 1)%this.rowStyles.length;
	addClass(row, (this.tbody.rows.length + 1)%2==0? this.rowEvenStyleClass:'');

	var newFRow=this.styleFreezeRow.cloneNode(true);
	newFRow.className=row.className;
	newFRow.appendChild(this.styleIndexColumn.cloneNode(true));
	this.freezeBodyTable.tBodies[0].appendChild(newFRow);



	for (var i=0;i<this.freezeNumber ;i++ ){
		var newCell= row.cells[i].cloneNode(true);
		newCell.setAttribute('fieldId',this.fields[i].fieldId);
		newFRow.appendChild(newCell);
	}

	this.refreshRow(row)
	this.isModefied = true;
	this.initAllRows(true);
	this.bodyDiv.scrollTop=this.bodyDiv.scrollHeight;
	this.freezeBodyDiv.scrollTop=this.bodyDiv.scrollTop;

	var __this=this;
	
	
	this.selectRow(row);

	for (var cn=0;cn<this.fields.length;cn++ ){
		var field=this.fields[cn];
		if (field.editor){
				this.setActiveCell(null,row.cells[cn]);
				this.startEdit();
				break;
		}
	}

	if (this.linkId && this.linkField){
			var ob = PageControl.getOne(this.linkId);
			if (ob){
				ob.isModefied = true;
			}
	}
	this.refreshRowStyle();

	this.afterAdd(row);
	return row;

}
/**
 * 删除一行的函数.删除时要先使本行失去焦点.
 */
Datacell.prototype.deleteRow = function(row){

	if(  !this.allowDel||this.readonly){
		return;
	}
	row = row===0?0:(row||this.activeRow);
	if(row==null) return;
	row=this.getRow(row);

	if(   this.beforeDel(row)!==false && row){

			this.selectNextRow();
			if(this.activeCell){
				this.endEdit();
			}
			if(this.getEntity(row).status == Entity.STATUS_NEW){
				this.getEntity(row).status = Entity.STATUS_HIDDEN;
			}else{
				var forceDel=false;
				if (this.linkId && this.linkField){
					var ob = PageControl.getOne(this.linkId);
					if (ob){
						ob.isModefied = true;
						forceDel=true;
					}
				}
				this.dataset.removeEntity( this.getEntity(row),forceDel );

			}
			var frow= this.freezeBodyTable.tBodies[0].rows[row.rowIndex];
			if (row && row.parentNode ){
				row.parentNode.removeChild(row);
			}
			if (frow && frow.parentNode ){
				frow.parentNode.removeChild(frow);
			}
			this.isModefied = true;
			this.initAllRows(true);
	this.refreshRowStyle();
			this.afterDel(row);


	}
}
/**
 * 编辑单元格后,更新entity的函数.
 */
Datacell.prototype.updateEntity=function(entity,fieldName,value){
	entity.setProperty(fieldName,value);
}



/**
 * 通过一个单元格或行来取得响应的entity
 * @param {Object} cellorRow 单元格或行.
 */


Datacell.prototype.getEntity =function(cellorRow){
	var row=cellorRow;
	if (typeof(row) =='number' ){
		row=this.table.tBodies[0].rows[row];
	}
	if (!row){
		return null;
	}
	if (row.tagName.toLowerCase()=='td'){
		row=row.parentNode;
	}
	var rowIndex = row.getAttribute('__entity_rowno')/1;
	var entity =  this.dataset.get(rowIndex);
	return entity;
}
/**
 * 选择一行的函数.
 * @param {Object} row
 * @param {Object} noLink 是否联动.为了效率，在选中一个单元格时不联动，由单元格处理联动.
 */
Datacell.prototype.selectRow = function(row,noLink){
	this.endEdit();
	row=this.getRow(row);
	if ( this.beforeSelectRow(row)===false ){
		return false;
	}
	var change=true;
	if( this.activeRow!=null){
		if(this.activeRow==row){
			change=false;
		}else if(!this.unSelectRow()){
			this.afterSelectRow(row);
			return false;
		}
	}
//be

	this.activeRow = this.activeRow || row;
	addClass(row,this.rowSelectStyleClass);
	if( change || noLink){
		this.setSubComponent(this.getEntity(row));
	}
	var sentity=this.getEntity(row);

	this.onSelectRow(row,sentity);
	var datacell = this;
	if (sentity){
		sentity.__onUpdate = function(){
			if(datacell.getEntity(row).status!=Entity.STATUS_NEW){
				datacell.getEntity(row).status = Entity.STATUS_MODIFIED;
			}
			if (datacell.syncRefresh){
				datacell.refreshRow(row);
			}else{
				datacell.refreshCell( datacell.activeCell,datacell.activeField );
			}
			//datacell.refreshRow(row);
			datacell.isModefied = true;
		}
	}

	this.afterSelectRow(this.activeRow);
	return true;
}
/**
 * 设置子datacell的方法,由服务器端生成脚本.
 * @param {Object} row
 * @param {Object} entity
 */
 Datacell.prototype.setSubComponent = function(entity){
 if(this.submitXpath && entity){
  entity.name =  this.getSubmitXpath();
 }
 var datacell = this;
 setTimeout(linkSub,100);
 function linkSub(){
  for(var i=0;i<datacell.__subComponent.length;i++){
   var ob = datacell.__subComponent[i];
   try{
    ob.freshFromEntity(entity);
   }catch(e){
    //$error(" 联动控件调用错误. ");
   }
  }
 }
}

/**
 * 和父对象联动的方法.
 * @param {Object} entity
 */

Datacell.prototype.freshFromEntity = function(entity){
	if(this.queryAction){
		if (entity){
			if(this.dataType=="json"){
				this.queryParam = entity.toJson();
			}else{
				this.queryParam = entity.toString();
			}
		}else{
			this.queryParam =null;
		}
		
		// this.queryParam=entity?Entity2Json(entity):{};
		/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	
		if (entity){
			this.queryParam = entity.toString();
		}else{
			this.queryParam =null;
		} */
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
 * 注册联动子对象的函数.
 * @param {Object} id
 */
Datacell.prototype.registerSubComponent = function(id){
	var ob = PageControl.getOne(id);
	this.__subComponent.push(ob);
}



/**
 * 初始化cell的方法,根据entity及cell的信息,初始化datacell.
 * @param {Object} cell 单元格.
 * @param {Object} entity 数据.
 */
Datacell.prototype.initCell = function(cell,entity){
	var key = cell.getAttribute("fieldId");
	if(key==Datacell.__INDEX_NAME){
		return;
	}
	var field = this.keys[key];
	var fieldName = field.fieldName;
	//cell.value = entity.getProperty(fieldName)?entity.getProperty( fieldName ):"";
	this.refreshCell(cell,field);
}
/**
 * 刷新一行的方法.
 * @param {Object} row
 */
Datacell.prototype.refreshRow = function(row,entity){
		var cellLength = row.cells.length;
		entity = entity || this.getEntity(row);
		for( var j = 0; j < cellLength; j++ )
		{
			cell = row.cells[j];
			var key = cell.getAttribute("fieldId");
			if(key==Datacell.__INDEX_NAME){
				continue;
			}
			var field = this.keys[key];
			var fieldName = field.fieldName;
			var value = entity.getProperty(fieldName)?entity.getProperty( fieldName ):"";
			//if(value!=cell.value){
			//	cell.value = value;
			if (entity== this.activeEntity && value!= this.activeEntityBackup.getProperty(fieldName)){
				try{
					var ridx=cell.parentNode.rowIndex;
					if (this.showIndex){
						addClass( this.freezeBodyTable.tBodies[0].rows[ridx].cells[0] ,'eos-row-modefied');
					}else{
						addClass( cell.parentNode ,'eos-row-modefied');
					}
				}catch(e){
					addClass( cell.parentNode ,'eos-row-modefied');
				}


			}
			this.refreshCell( cell ,field);
			//}
		}
}

/**
 * 刷新datacell的方法.
 */
Datacell.prototype.refresh = function(){

	this.init();
//alert("refresh : "+this.dataset)
	if (this.beforeRefresh()===false){
		return;
	}
	this.activeEditor=null;
	this.activeCell=null;
	this.activeRow=null;
	this.activeField=null;
	this.activeValue=null;

	this.initBody();

	this.status = Datacell.STATUS_BLANK;
	this.onComplete();
	//this.setSubComponent(null);
	this.selectFirstRow();

	this.afterRefresh();
}




/**
 *
 * @private
 * 重新排body的方法.
 * @param {Object} arr
 */
Datacell.prototype.reSortBody = function(arr){
	var tbody = this.tbody.cloneNode(false);
	for(var i=0;i<arr.length;i++){
		tbody.appendChild(arr[i]);
	}
	this.table.replaceChild(tbody,this.tbody);
	this.tbody = tbody;

}
/**
 * 服务器端排序的方法.
 * @param {Object} th 需要排序的表头单元格.
 */
Datacell.prototype.serverSort = function(th){
	var field = th.field;
	th.sortType = th.sortType=="_desc"?"_asc":"_desc";
	
	this.sortParam={
		_orderby:{
			_property:field.fieldName,
			_sort:th.sortType
		}
	}
	/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	
	this.sortParam = "<_orderby><_property>"+field.fieldName+"</_property><_sort>"+th.sortType+"</_sort></_orderby>";
	 */
	this.reload();
}
/**
 * 刷新排序图标的方法.
 * @param {Object} th
 */
Datacell.prototype.refreshSortTh = function(th){
	if(!this.sortArrow){
		this.sortArrow = $createElement("img");
	}
	bodyAddNode(this.sortArrow);
	th.container.appendChild(this.sortArrow);
	if(th.sortType=="_desc"){
		this.sortArrow.src = PICTURE_SORT_DOWN;
	}else if(th.sortType=="_asc"){
		this.sortArrow.src = PICTURE_SORT_UP;
	}
}
/**
 * 初始化参数的方法.
 */
 Datacell.prototype.setPageParam = function(begin,pageSize,countValue,isCount){
 
	if(this.dataType=='json'){
		var p={
			__type:'sdo:com.eos.foundation.PageCond',
			begin:begin,
			length:pageSize,
			count:countValue,
			isCount:!!isCount
		};
		this.pageParam={page:p};
		return this.pageParam;
	}else{
		/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	*/
		this.pageParam = "<page __type=\"sdo:com.eos.foundation.PageCond\"><begin>" + begin + "</begin><length>" + pageSize + "</length><count>" + countValue + "</count><isCount>" + (!!isCount) + "</isCount></page>";
		return this.pageParam ; 
	}
 }

Datacell.prototype.initPageParam = function () {
	
	if (this.pageSizeList && this.pageSizeList != "null" && this.pageSizeList != "none" && (',' + this.pageSizeList + ',').indexOf(',' + this.pageSize + ',') < 0) {
		
		this.pageSizeList += ',' + this.pageSize;
		
	}
	
	var countValue = 0;
	if (!this.isCount) {
		countValue = -1;
	}
	this.setPageParam(0, this.pageSize, countValue, this.isCount);
	
}
/**
 * 初始化参数的方法.用户可以重写该方法以初始化参数.
 */
Datacell.prototype.initAttachParam = function(){

}

Datacell.prototype.getQueryForm = function(){
	if (!this.entityType&&!this.entityName && !this.sortParam) {
		if(this.dataType=='json'){
			return {};
		}else{
			return '';
		}
	}
	var param={};
	var type=this.entityType||this.entityName||'';
	type=type.split(':');
	if(type.length==2){
		param._entity=type[1];
	}
	EOS.apply(param,this.sortParam);
	return this.setCriteriaParam(param);
	
	/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	
	if (!this.entityType&&!this.entityName && !this.sortParam) {
		return "";
	}
	var type=this.entityType||this.entityName||'';
	var idx=type.indexOf(":");
	if (idx!=-1) {
		type=type.substring(idx+1);
	}
	var queryform = "<_entity>" + type + "</_entity>";
	if(this.sortParam){
		queryform += this.sortParam;
	}
	return this.setCriteriaParam(queryform); */
}

Datacell.prototype.setCriteriaParam = function(cXML){
	var cp={
		__type:'sdo:com.primeton.das.criteria.criteriaType'
	};
	EOS.apply(cp,cXML);
	this.criteriaParam=cp;
	return cp;
	
	/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	
	var start="<criteria __type=\"sdo:com.primeton.das.criteria.criteriaType\">";

	var end="</criteria>"

	this.criteriaParam=start+ cXML +end;
	return this.criteriaParam; */
}

Datacell.prototype.setQueryParam = function(qXML){
	/**
	*@desc qxml期望json
	*/
	this.queryParam=qXML;
	
	return this.queryParam;
}

Datacell.prototype.setJsonDataset = function(json){
	if (typeof(json)=='string'){
		json=eval(json);
	}
	if ( !(json instanceof Dataset) ){
		json= Json2Dataset(json);
	}

	this.dataset= json;
	this.dataXML="<json/>";

}

Datacell.prototype.loadJsonData = function(){

}


Datacell.prototype.addParam = function(key, value){
	this.paramList=this.paramList || [];
	this.paramList.push( { key : key ,value : value } );
}


/**
 * 载入数据的方法.
 */
 // this.afterLoadData();
 Datacell.prototype.loadData = function () {
 	if (this.beforeLoadData() === false) {
 		return;
 	}
 	
 	if (this.dataXML == "<json/>") {
 		return;
 	}
 	if (!this.linkId && !this.queryAction && this.xpath) {
 		var xmlZone = document.getElementById(this.id + "_xml");
 		this.dataXML = xmlZone ? xmlZone.innerHTML : null;
 	} else if (this.linkId && this.linkId.indexOf('xml:') == 0) {
 		var xmlZone = document.getElementById(this.linkId.substring(4));
 		this.dataXML = xmlZone ? xmlZone.innerHTML : null;
 	} else if (this.linkId && this.isFirstLoad) {
 		this.isFirstLoad = false;
 		return;
 	}
 	
 	var xmlDom;
 	
 	if (this.dataXML && this.dataXML !== "<json/>") {
 		this.dataset = Dataset.create(this.dataXML, this.xpath);
 		
 		xmlDom = createXmlDom();
 		xmlDom.loadXML(this.dataXML);
 		
 		var pagecond = xmlDom.selectSingleNode("/root/data/page");
 		
 		this.freshPagePilot(pagecond);
 		return;
 	}
 	
	if(this.onLoadData()!=false){
		if(!this.queryAction){//没有ajax加载地址
			return;
		}
 		var ajax = new Ajax(this.queryAction);
		
		var param=this.getQueryForm();
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
			EOS.apply(param,this.queryParam);
			EOS.apply(param,this.pageParam);
			EOS.apply(param,paramFn);
		}else{
			var queryParma=this.queryParam||'';
			param+=queryParma;
			param+=this.pageParam;
			param+=paramFn;
		}
		
 		if (this.paramFormId) {
 			var form = $id(this.paramFormId);
 			if (form) {
 				for (var i = 0; i < form.elements.length; i++) {
 					var elem = form.elements[i];
 					if (elem.name) {
 						ajax.addParam(elem.name, getElementValue(elem));
 					}
 				}
 			}
 		}
		
 		if (this.paramList) {
 			for (var i = 0; i < this.paramList.length; i++) {
 				var elem = this.paramList[i];
 				if (elem) {
 					ajax.addParam(elem.key, elem.value);
 				}
 			}
 		}
 		
 		if (this.queryReturnValue) {
 			ajax.setOutParam(this.queryReturnValue);
 		}
 		
 		if (this.queryParamsInfo) {
 			ajax.setParamsInfo(this.queryParamsInfo);
 		}
 		
 		if (this.queryInoutParams) {
 			ajax.setInoutParam(this.queryInoutParams);
 		}
 		
		ajax.setDataType(this.dataType);
		var _this=this;
		ajax.onSuccess=function(){
			var pagecond=null;
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
				pagecond=ajax.retJson.page;
			}else{
				xmlDom = ajax.retDom;
				_this.dataset = Dataset.create(xmlDom, _this.xpath, _this.getSubmitXpath());
				pagecond = xmlDom.selectSingleNode("/root/data/page");
			}
			_this.freshPagePilot(pagecond);
			_this.afterLoadData(ajax);
		}
 		ajax.loadData(param);
	}
	
	/**支持json数据格式的改造，所有的数据将在提交前统一判断xml还是JSON 	
 	//	var dataset = new Dataset(this.entityType);
	if (this.onLoadData() !== false) {
 		if (!this.queryAction) {
 			return;
 		}
 		var ajax = new HideSubmit(this.queryAction);
 		var param = this.getQueryForm();
		
 		if (this.queryParam) {
 			param += this.queryParam;
 		}
 		if (this.pageParam) {
 			param += this.pageParam;
 		}
 		if (this.initParamFunc) {
 			try {
 				param += eval(this.initParamFunc + "(ajax)");
 			} catch (e) {
 				try {
 					param += eval(this.initParamFunc + "()");
 				} catch (e1) {
 					$handle(e1);
 				}
 			}
 		}
 		if (param == "") {
 			param = null;
 		}
 		if (this.paramFormId) {
 			var form = $id(this.paramFormId);
 			if (form) {
 				for (var i = 0; i < form.elements.length; i++) {
 					var elem = form.elements[i];
 					if (elem.name) {
 						ajax.addParam(elem.name, getElementValue(elem));
 					}
 				}
 			}
 		}
 		if (this.paramList) {
 			for (var i = 0; i < this.paramList.length; i++) {
 				var elem = this.paramList[i];
 				if (elem) {
 					ajax.addParam(elem.key, elem.value);
 				}
 			}
 		}
 		
 		if (this.queryReturnValue) {
 			ajax.setOutParam(this.queryReturnValue);
 		}
 		
 		if (this.queryParamsInfo) {
 			ajax.setParamsInfo(this.queryParamsInfo);
 		}
 		
 		if (this.queryInoutParams) {
 			ajax.setInoutParam(this.queryInoutParams);
 		}
 		
 		ajax.loadData(param);
 		
 		//if (this.dataXML=="<json/>"){
 		//	this.setJsonDataset(ajax.getText());
 		//	return;
 		//}
 		
 		xmlDom = ajax.retDom;
 		
 		this.dataset = Dataset.create(xmlDom, this.xpath, this.getSubmitXpath());
 		
 		var pagecond = xmlDom.selectSingleNode("/root/data/page");
 		//if(pagecond){
 		
 		this.freshPagePilot(pagecond);
 		//}
 		this.afterLoadData(ajax);
 	} */
 }




Datacell.prototype.freshPagePilot = function(pagecond){
	var pageEntity;
	if(this.dataType=='json'){
		pageEntity=Json2Entity(pagecond);
	}else{
		pageEntity = Dataset.initEntity(pagecond);
	}

	if(!pagecond){

		var startR = 1
		var currentTotal= this.dataset? this.dataset.getLength():0;
		if (currentTotal< startR){
			startR=0;
			currentTotal=startR
		}

		for(var i=0;i<this.__pagePilot.length;i++){
			var pilot = this.__pagePilot[i];

			if (pilot.gotoPageText)	{
				pilot.gotoPageText.value=1;
			}
			if (pilot.pageInfoDiv){
				pilot.pageInfoDiv.innerHTML = '<nobr>';
				pilot.pageInfoDiv.innerHTML += "<nobr>" + this.PAGE_RECORDINFO_NOCOUNT.replace("{0}",startR).replace("{1}",this.dataset.getLength()) + "</nobr>";
				pilot.pageInfoDiv.innerHTML += '</nobr>';
			}
			pilot.freshPilot(pageEntity,this.readonly,this.allowAdd,this.allowDel);
		}

		return;

	}



this.totalPage = Number( pageEntity.getProperty("totalPage") );
this.begin = Number( pageEntity.getProperty("begin") );
this.pageSize = Number( (!this.pageSize || this.pageSize<1) ? pageEntity.getProperty("length") : this.pageSize );
this.currentPage = Number( pageEntity.getProperty("currentPage") );

if (parseInt(this.currentPage)<1){
	this.currentPage=1;
	pageEntity.setProperty("currentPage",1);
}
	var totalPage = Number(pageEntity.getProperty("totalPage"));
	var begin = Number(pageEntity.getProperty("begin"));
	if( (''+totalPage)!="-1"){
		this.SortByServer = true;
	}else{
		if( (''+begin)=="0"){
			this.SortByServer = false;
		}else{
			this.SortByServer = true;
		}
	}
	for(var i=0;i<this.__pagePilot.length;i++){
		var pilot = this.__pagePilot[i];
		pilot.freshPilot(pageEntity,this.readonly,this.allowAdd,this.allowDel);
	}

}

Datacell.prototype.registerPagePilot = function(pilot){
	this.__pagePilot.push(pilot);
	pilot.datacell = this;
}
/**
 * 重新载入数据的方法.
 */
Datacell.prototype.reload = function(recount){
	recount = recount!==undefined&&recount!==null? recount : this.recount;
	if (recount){
		this.setPageParam(this.begin, this.pageSize, -1 ,this.isCount);
	}
	this.loadData();
	this.refresh();
}

/**
 * 选择下一行的方法.
 */
Datacell.prototype.selectNextRow = function(){
	if(this.activeRow){
		var ne=nextElement(this.activeRow);
		var pe=prevElement(this.activeRow);

		if(ne){
			this.selectRow(ne);
		}else if(pe){
			this.selectRow(pe);
		}
	}
}
/**
 * 选择上一行的方法.
 */
Datacell.prototype.selectPreRow = function(){
	if(this.activeRow){
		var ne=nextElement(this.activeRow);
		var pe=prevElement(this.activeRow);

		if(pe){
			this.selectRow(pe);
		}else if(ne){
			this.selectRow(ne);
		}
	}
}
/**
 * 选择第一行的方法.
 */
Datacell.prototype.selectFirstRow = function(){
	if(this.tbody.rows.length>0){
		var row = this.tbody.rows[0];
		this.selectRow(row);
	}
	else
	{
	this.setSubComponent(null);
	}
}
/**
 * 选择最后一行的方法.
 */
Datacell.prototype.selectLastRow = function(){
	if(this.tbody.rows.length>0){
		var row = this.tbody.rows[this.tbody.rows.length-1];
		this.selectRow(row);
	}
}
/**
 * 转到第N页的方法，传入分页参数,
 * 格式//"<PageCond><begin>1</begin><length>10</length><count>4</count></PageCond>";
 * @param {Object} pageParam
 */
Datacell.prototype.gotoPage = function(pageParam){
	if(this.isModefied){
		if(window.confirm(DATACELL_MODIFY_CONFIRM)){
			this.submit();
		}
	}
	this.pageParam = pageParam;
	this.reload();
	this.onPageChange();

}

Datacell.prototype.validateAll = function(){
		var _activeEntity=this.activeEntity;
		var ac=this.getActiveCell();
		var ar=this.activeRow;
		for (var i=0;i<this.table.tBodies[0].rows.length;i++ ){

			var row = this.table.tBodies[0].rows[i];
			var entity = this.getEntity(row);
			if (entity.status==Entity.STATUS_NEW ){
				this.activeEntity=entity;
				for (var cn=0;cn<this.fields.length;cn++ ){
					var field=this.fields[cn];

					if (field.editor){
						this.activeCell=row.cells[cn];
					    this.activeRow=row;
					   //	this.setActiveCell(row.cells[cn]);
						var value=entity.getProperty(field.fieldName);
						field.editor.setValue(value);
						var f;
						try	{
							f=field.editor.validate();
						}catch (e){
							f=false;
						}
						if (!f){
						    this.activeCell=null;
							this.setActiveCell(row.cells[cn]);
							this.startEdit();

							try	{
								f=field.editor.validate();
							}catch (e){
								f=false;
							}
							this.unlocked();
							this.activeEntity=_activeEntity;
							return false;
						}
					}
				}
			}
		}
		this.activeEntity=_activeEntity;
		this.activeCell=ac;
        this.activeRow=ar;
		return true;
}

/**
 * 提交数据.
 */
 Datacell.prototype.save = function(){
	if( this.beforeSave()!==false){
			this.submit();
			this.afterSave()
	}
 }

Datacell.prototype.submit = function(){
	if( this.beforeSubmit()===false || !this.submitAction  ){
		return;
	}

	this.locked();
	this.endEdit();
	//Datacell.processBlur(this.table);
	if(!this.isModefied){
		alert(DATACELL_MODIFY_NO);
	}else{
		if (!this.validateAll()){
			return false;
		}
		var debug= false;
		if (!debug){
			var ajax = new HideSubmit(this.submitAction);

			if(this.paramFormId){
				var form = $id(this.paramFormId);
				if(form){
					for(var i=0;i<form.elements.length;i++){
						var elem = form.elements[i];
						if(elem.name){
							ajax.addParam(elem.name, xmlConversion(getElementValue(elem)) );
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

		if(this.submitReturnValue){
			ajax.setOutParam(this.submitReturnValue);
		}

		if(this.submitParamsInfo){
			ajax.setParamsInfo(this.submitParamsInfo );
		}

		if(this.submitInoutParams){
			ajax.setInoutParam(this.submitInoutParams );
		}

			ajax.loadData(this.dataset.getSubmitXML());
			if (ajax.retDom){
				var excep=ajax.retDom.selectNodes('\root\exception');
				if (excep &&excep.length>0)	{
					var t= getNodeValue(excep[0]);
					if (t && (''+t).indexOf('e')>=0){
						alert(DATACELL_SAVE_ERR);
					}
				}
			}
			this.afterSubmit(ajax);
			this.dataXML=null;
			this.loadData();
			this.refresh();
		}

	}
	this.unlocked();
	return true;
}

Datacell.prototype.reset = function(){

}

Datacell.prototype.processSortIcon = function(obj){

}
Datacell.prototype.addcheckbox = function(){

}
Datacell.prototype.setReadonly = function(r){
    if(r==null) r=true;
	this.readonly= r;
	for (var i=0;i<this.fields.length;i++ )
	{
	this.fields[i].allowModify=!this.readonly;

	}


}



Datacell.prototype.getEntitiesXML = function(name,entities){
		var buffer = new StringBuffer();
		if(entities.length>0){
			for(var i=0;i<entities.length;i++){
				entities[i].name = name;
				buffer.append(entities[i].toString());
			}
		}
		return buffer.toString();
}


Datacell.prototype.getSubmitXpath = function(){
	var tagName = this.submitXpath;
	if(!tagName){

		if(this.xpath){
			var arrNames = this.xpath.split("/");
			tagName = arrNames[arrNames.length-1];
		}else if(this.linkField){
			tagName = this.linkField;
		}
	}
	return tagName||"entity";
}


Datacell.prototype.submitAllByXML = function(){

		if (this.allEntitiesXMLDiv){
			this.allEntitiesXMLDiv.parentNode.removeChild(this.allEntitiesXMLDiv);
		}
		var hiddenDiv=$createElement("div", { style:{display:"none"}  });

		this.allEntitiesXMLDiv=hiddenDiv;
		var submitXpath = this.getSubmitXpath();
		var inputAll=$createElement("input",{
			type:"hidden" ,
			name:"insertEntities",
			value: this.getEntitiesXML(submitXpath,this.dataset.getAlltEntities())
		});


		hiddenDiv.appendChild(inputAll);

		this.container.appendChild(hiddenDiv);


}

Datacell.prototype.submitModifyByXML = function(ixpath, uxpath,dxpath,pxpath){

	if (!pxpath){
		this.submitModifyBy3XML(ixpath, uxpath,dxpath);
		return;
	}
		if (this.modifyEntitiesXMLDiv){
			this.modifyEntitiesXMLDiv.parentNode.removeChild(this.modifyEntitiesXMLDiv);
		}

	var hiddenDiv=$createElement("div", { style:{display:"none"}  });
	this.modifyEntitiesXMLDiv=hiddenDiv;


	var txml=[];
	txml[0]=this.getEntitiesXML( ixpath || "insertEntities",this.dataset.getInsertEntities());
	txml[1]=this.getEntitiesXML( uxpath || "updateEntities",this.dataset.getModifiedEntities());
	txml[2]=this.getEntitiesXML( dxpath || "deleteEntities",this.dataset.getRemovedEntities());
	var inputXML=$createElement( "input",{
		type:"hidden" ,
		name:pxpath || 'modifyEntities',
		value: 	txml.join('')
	});
	hiddenDiv.appendChild(inputXML);
	this.container.appendChild(hiddenDiv);
	//alert(hiddenDiv.innerHTML)
}

 	Datacell.prototype.submitModifyBy3XML = function(ixpath, uxpath,dxpath){

		if (this.modifyEntitiesXMLDiv){
			this.modifyEntitiesXMLDiv.parentNode.removeChild(this.modifyEntitiesXMLDiv);
		}

		var hiddenDiv=$createElement("div", { style:{display:"none"}  });

		this.modifyEntitiesXMLDiv=hiddenDiv;


		var inputInsert=$createElement("input",{
			type:"hidden" ,
			name:ixpath || "insertEntities",
			value: 	this.getEntitiesXML( ixpath || "insertEntities",this.dataset.getInsertEntities())
			});


		var inputModified=$createElement("input",{
			type:"text" ,
			name: uxpath || "updateEntities",
			value: this.getEntitiesXML( uxpath || "updateEntities",this.dataset.getModifiedEntities())
			});

		var inputRemoved=$createElement("input",{
			type:"hidden" ,
			name: dxpath || "deleteEntities",
			value:this.getEntitiesXML( dxpath || "deleteEntities",this.dataset.getRemovedEntities())
			});

		hiddenDiv.appendChild(inputInsert);
		hiddenDiv.appendChild(inputModified);
		hiddenDiv.appendChild(inputRemoved);
		this.container.appendChild(hiddenDiv);
		//alert(hiddenDiv.innerHTML)


	}



Datacell.prototype.submitAllByHidden = function(){

	if (!this.validateAll()){
		return false;
	}
	if (this.allEntitiesHiddenDiv){
		this.allEntitiesHiddenDiv.parentNode.removeChild(this.allEntitiesHiddenDiv);
	}
	var hiddenDiv=$createElement("div", { style:{display:"none"}  });
	this.container.appendChild(hiddenDiv);
	this.allEntitiesHiddenDiv=hiddenDiv;

	var xpath = this.dataset.name;
	var tagName = this.getSubmitXpath();
	var array = Dataset2Array(this.dataset,tagName,true);
	this.addHiddenByArray(array,hiddenDiv);
	return true;

}

Datacell.prototype.submitModifyByHidden = function(ixpath, uxpath,dxpath){

	if (!this.validateAll()){
		return false;
	}

	if (this.modifyEntitiesHiddenDiv){
		this.modifyEntitiesHiddenDiv.parentNode.removeChild(this.modifyEntitiesHiddenDiv);
	}
	var hiddenDiv=$createElement("div", { style:{display:"none"}  });
	this.container.appendChild(hiddenDiv);
	this.modifyEntitiesHiddenDiv=hiddenDiv;
/*
	var array = Dataset2Array(this.dataset.getInsertDataset(),ixpath || "insertEntities");
	this.addHiddenByArray(array,hiddenDiv);
	array = Dataset2Array(this.dataset.getModifiedDataset() , uxpath || "updateEntities");
	this.addHiddenByArray(array,hiddenDiv);
	array = Dataset2Array(this.dataset.getRemovedDataset(),dxpath || "deleteEntities");
	this.addHiddenByArray(array,hiddenDiv);*/
	var array = Dataset2Array(this.dataset.getInsertDataset(),ixpath || "insertEntities");
	array=array.concat( Dataset2Array(this.dataset.getModifiedDataset() , uxpath || "updateEntities"));
	array=array.concat( Dataset2Array(this.dataset.getRemovedDataset(),dxpath || "deleteEntities"));
	this.addHiddenByArray(array,hiddenDiv);

	//alert(hiddenDiv.innerHTML)
	return true;

}


Datacell.prototype.addHiddenByArray = function(array,container){
	var str=new StringBuffer();
	for(var i=0;i<array.length;i++){
	    if(array[i].value==null) continue;
		 str.append("<textarea  name='");
         str.append(array[i].key );
		 str.append("' >");
         str.append(array[i].value );
		 str.append("</textarea>");
		//var hidden = $createElement("input", {type:"hidden", name:array[i].key , value:array[i].value });
		//container.appendChild(hidden);
	}
	container.innerHTML=str;
}


/**
 * 该列由选中状态变为不选中状态时调用的函数.
 * @param {Object} row
 */
Datacell.prototype.unSelectRow = function(){
	var row=this.activeRow;
	if(!row){
		return true;
	}else{
		this.endEdit();
	}
	//be
	if(this.onUnSelectRow(row,this.getEntity(row))){
		removeClass(row,this.rowSelectStyleClass);
		this.activeRow = null;
		//af
		return true;
	}else{
		//af
		return false;
	}
}
/**
 * datacell的对外接口,当不选择当前行时进行的操作.
 * @param {Object} row
 */
Datacell.prototype.onUnSelectRow = function(row,entity){
	return true;
}






/**
 * 符合datacell控件开发规范的方法,使datacell可以嵌套.
 * @param {Dataset} value 要传入的dataset
 */
Datacell.prototype.setValue = function(value){
	this.dataset = value;
	//this.styleEntity.entityType = this.dataset.entityType;
	$info("datacell setvalue " + value);
	this.refresh();
}
/**
 * 符合datacell控件开发规范的方法,使datacell可以嵌套.
 * @type {Dataset}
 * @return datacell的dataset
 */
Datacell.prototype.getValue = function(){
	//alert("getValue : "+this.dataset)
	return this.dataset;
}
/**
 * 符合datacell控件开发规范的方法,使datacell可以嵌套.
 */
Datacell.prototype.setFocus = function(){

}
/**
 * 符合datacell控件开发规范的方法,使datacell可以嵌套.
 * datacell失去焦点时调用.
 */
Datacell.prototype.lostFocus = function(){
//	Datacell.processBlur(this.table);
	this.endEdit();
}




/***************************************************************************
 * Datacell.pilot
 ***************************************************************************/
/**
 * datacell的工具条.根据传入的datacell进行初始化.
 *@class
 * @param {String} id控件唯一标识
 */
function Pilot(id){
	this.id = id;
	PageControl.add(id,this);
	this.container = null;
	this.currPage = 1;
	this.totalPages = null;
	this.currRecord = null;
	this.totalRecords = null;

	this.width = "100%";
	this.height = "100%";
	this.inputClass = "INPUT";
	this.readonly = false;
	this.addButton = null;
	this.deleteButton = null;
	this.firstPageButton = null;
	this.nextPageButton = null;
	this.prePageButton = null;
	this.lastPageButton = null;
	this.gotoPageText = null;
	this.gotoPageButton = null;
	this.saveButton = null;
	this.reloadButton = null;
	//this.iconPath = ICON_PATH_PILOT;
	this.begin = 0;
	this.length = 10;
	this.count = -1;
	this.isCount = false;
	this.totalPage = -1;
	this.currentPage = -1;
	this.isLast = false;
	this.isFirst = true;
	this.first_able = true;
	this.pre_able = true;
	this.next_able = true;
	this.last_able = true;
	this.add_able = true;
	this.delete_able = true;
}

/**
 *设置自定义工具区的内容
 */
Datacell.prototype.setCustomTool = function(toolHTML,pid){

	var pid=pid || this.__pagePilot[0].id
	this.customToolHTML=toolHTML;
	var custZone=$id(pid +'_custom_zone');

	if (custZone){
		custZone.innerHTML=this.customToolHTML;
		return true;
	}
	return false;
}

Datacell.prototype.hiddenButtons = function(excludeTools){


}

/**
 * 初始化工具条的方法.
 */
Pilot.prototype.init = function(){

}
/**
 *工具栏的创建函数
 */
Pilot.prototype.build = function(){
	if (this.datacell.toolbarLocation=='top'){
		this.container=this.datacell.topToolbarDiv;
	}else{
		this.container=this.datacell.bottomToolbarDiv;// = $id(this.id + "_container");
	}
	var datacell=this.datacell;


//datacell.toolsList="...";

var toolsList=datacell.toolsList.split(',');

	str=[];

var showPageSizeList = (''+this.datacell.pageSizeList)!="none" && (''+this.datacell.pageSizeList)!="null" ;
for (var i=0;i<toolsList.length;i++ ){

	var toolName=toolsList[i].split(':');

	var subTools= toolName[1] || null;
	toolName=toolName[0];
	if (subTools){
		subTools=' '+subTools+' ';
	}
	switch(toolName){
		case 'nav':
			str=str.concat([
				'<div class="eos-tool-zone" id="'+this.id +'_nav_zone" >',
				(subTools&&subTools.indexOf(' first ')<0)?'':'<a title="'+TOOLTIP_FIRST_PAGE+'" id="'+this.id +'_first" href="javascript:void(0);"><div class="eos-grid-tool-first"></div></a>',
				(subTools&&subTools.indexOf(' prev ')<0)?'':'<a title="'+TOOLTIP_PRIVOUS_PAGE+'" id="'+this.id +'_previous" href="javascript:void(0);"><div class="eos-grid-tool-prev"></div></a>',
				(subTools&&subTools.indexOf(' next ')<0)?'':'<a title="'+TOOLTIP_NEXT_PAGE+'" id="'+this.id +'_next" href="javascript:void(0);"><div class="eos-grid-tool-next"></div></a>',
				(subTools&&subTools.indexOf(' last ')<0)?'':'<a title="'+TOOLTIP_LAST_PAGE+'" id="'+this.id +'_last" href="javascript:void(0);"><div class="eos-grid-tool-last"></div></a>',
				(subTools&&subTools.indexOf(' goto ')<0)?'':'<input type="text" size="3" maxlength="4" class="eos-grid-tool-goto-input" id="'+ this.id + '_input" /><a title="'+TOOLTIP_GOTO+'" id="'+this.id +'_goto" href="javascript:void(0);" style="margin-left:0px;"><div class="eos-grid-tool-goto"></div></a>',
				'</div>'
			]);
			break;
		case 'pagesize':
			if (showPageSizeList){
				str=str.concat([
				'<div >',
				'<div class="eos-grid-tool-pageinfo" id="'+this.id +'_pagesize"  >',
				'</div>',
				'</div>'
				]);
			}

			break;
		case 'custom':
			str=str.concat([
				'<div class="eos-tool-zone" id="'+this.id +'_custom_zone" >',
				datacell.customToolHTML || '',
				'</div>'
			]);
			break;
		case 'edit':
			str=str.concat([
				'<div class="eos-tool-zone">',
				(subTools&&subTools.indexOf(' add ')<0)?'':'<a title="'+TOOLTIP_ADD+'" id="'+this.id +'_add" href="javascript:void(0);"><div class="eos-grid-tool-add"></div></a>',
				(subTools&&subTools.indexOf(' del ')<0)?'':'<a title="'+TOOLTIP_DELETE+'" id="'+this.id +'_del" href="javascript:void(0);"><div class="eos-grid-tool-del"></div></a>',
				(subTools&&subTools.indexOf(' save ')<0)?'':'<a title="'+TOOLTIP_SAVE+'" id="'+this.id +'_save" href="javascript:void(0);"><div class="eos-grid-tool-save"></div></a>',
				(subTools&&subTools.indexOf(' reload ')<0)?'':'<a title="'+TOOLTIP_RELOAD+'" id="'+this.id +'_reload" href="javascript:void(0);"><div class="eos-grid-tool-reload"></div></a>',
				'</div>'
			]);
			break;
		case 'info':
			str=str.concat([
				'<div class="eos-tool-zone">',
				'<div class="eos-grid-tool-pageinfo" id="'+this.id +'_pageinfo"  >',
				'</div>',
				'</div>'
			]);
			break;

	}
}

// 页面数据信息

	this.container.innerHTML =str.join('\n');

	this.firstPageButton = $id(this.id + "_first");

	this.nextPageButton = $id(this.id + "_next");
	this.prePageButton = $id(this.id + "_previous");
	this.lastPageButton = $id(this.id + "_last");

	this.gotoPageText = $id(this.id + "_input");
	this.gotoPageButton = $id(this.id + "_goto");


	var pageSizeZone= $id(this.id + "_pagesize");
	if (showPageSizeList && pageSizeZone){
		var pageSizeMap={};
		var pageSizeList=this.datacell.pageSizeList.split(",");
		for (var i=0;i<pageSizeList.length;i++ ){
			pageSizeMap[pageSizeList[i]]=pageSizeList[i];
		}
		this.pageSizeSelect = createSelect(pageSizeMap,this.datacell.pageSize /* this.length */);
		this.pageSizeSelect.id=this.id+"_size";
		this.pageSizeSelect.className='eos-pagesize-select';
		pageSizeZone.appendChild(this.pageSizeSelect);
	}


	this.addButton = $id(this.id + "_add");
	this.deleteButton = $id(this.id + "_del");
	this.saveButton = $id(this.id + "_save");
	this.reloadButton = $id(this.id + "_reload");

	this.pageInfoDiv = $id(this.id + "_pageinfo");
	//event
	var pilot = this;

	if (showPageSizeList && this.pageSizeSelect){
		function changePageSize(){
			pilot.datacell.endEdit();
			pilot.datacell.pageSize= Number(pilot.pageSizeSelect.value);
			pilot.gotoPage(1);
		}
		eventManager.add(this.pageSizeSelect,"change",changePageSize);
	}

    function gotoInputKeypress()
    {
     var code=eventManager.getKeyCode();
     if(code==27)
     {
     eventManager.stopEvent();
     pilot.gotoInputPage();
     }
    }
   	eventManager.add(this.gotoPageText,"keypress",gotoInputKeypress);


	function add(){
		pilot.addRow();
	}
	eventManager.add(this.addButton,"click",add);

	function del(){
		datacell.endEdit();
		pilot.deleteRow();
	}
	eventManager.add(this.deleteButton,"click",del);

	function fristPage(){
		datacell.endEdit();
		if (pilot.firstPageButton._disabled ) return;
		pilot.gotoFirstPage();
	}
	eventManager.add(this.firstPageButton,"click",fristPage);

	function nextPage(){
		datacell.endEdit();
		if (pilot.nextPageButton._disabled ) return;
		pilot.gotoNextPage();
	}
	eventManager.add(this.nextPageButton,"click",nextPage);

	function prePage(){
		datacell.endEdit();
		if (pilot.prePageButton._disabled ) return;
		pilot.gotoPrePage();
	}
	eventManager.add(this.prePageButton,"click",prePage);

	function lastPage(){
		datacell.endEdit();
		if (pilot.lastPageButton._disabled ) return;
		pilot.gotoLastPage();
	}
	eventManager.add(this.lastPageButton,"click",lastPage);

	function gotoPage(){

		datacell.endEdit();
		if (pilot.gotoPageButton._disabled ) return;
		pilot.gotoInputPage();
	}
	eventManager.add(this.gotoPageButton,"click",gotoPage);



	function save(){
        eventManager.stopEvent();
		datacell.endEdit();
		if (pilot.saveButton._disabled ) return;
		var dosave=false;
		for (var i=0;i<pilot.datacell.fields.length;i++ )
		{
		if(pilot.datacell.fields[i].allowModify==true){dosave=true; break;}
		}
		if(!dosave) return;
		pilot.datacell.save();

	}
	eventManager.add(this.saveButton,"click",save);


	function reload(){
		datacell.endEdit();
		if (pilot.reloadButton._disabled ) return;
		var goon=true;
		if(pilot.datacell.isModefied && confirm(DATACELL_MODIFY_CONFIRM)){
			pilot.datacell.submit();
		}else{
			pilot.datacell.reload();
		}
	}
	eventManager.add(this.reloadButton,"click",reload);

	function clearUp(){
		pilot.clearup();
	}
	eventManager.add(window,"unload",clearUp);



}

/**
 * datacell回调的刷新按纽的方法.
 * @param {Object} begin
 * @param {Object} length
 * @param {Object} count
 * @param {Object} readonly
 * @param {Object} allowAdd
 * @param {Object} allowDel
 */
Pilot.prototype.freshPilot = function(pagecond,readonly,allowAdd,allowDel){
	var first = true;
	var pre = true;
	var next = true;
	var last = true;
var hasPage=false;
if (pagecond){
hasPage=true;
	this.begin = parseInt(pagecond.getProperty("begin")) || 0;
	this.datacell.pageSize = Number( this.datacell.pageSize<1 ? parseInt(pagecond.getProperty("length")) :this.datacell.pageSize );
	this.count = parseInt(pagecond.getProperty("count"));
	this.datacell.isCount = (pagecond.getProperty("isCount")=="true");


	this.totalPage = parseInt(pagecond.getProperty("totalPage"));
	this.currentPage = parseInt(pagecond.getProperty("currentPage")) || 1;
	this.isLast = (pagecond.getProperty("isLast")=="true");
	this.isFirst = (pagecond.getProperty("isFirst")=="true");

	this.currentPage = this.currentPage<1 ? 1 :this.currentPage;
	if(!this.datacell.isCount){
		this.currentPage = parseInt(this.begin/this.datacell.pageSize) + 1;
	}
	var _page= isNaN(this.currentPage/1) || this.currentPage<1 ? 1 : this.currentPage;
	var _tpage= isNaN(this.totalPage/1) || this.totalPage<1 ? 1 : this.totalPage;
	var _count=isNaN(this.count/1) || this.count<0 ? 0 : this.count;

	var _startR= Number( isNaN(this.begin/1) || this.begin<0 ? 0 : this.begin )+1;

	var _endR=  _startR+this.datacell.pageSize-1;

	_endR= _endR>_count ? _count : _endR;
	_endR=_endR<_startR?_startR:_endR;

	if ( this.gotoPageText ){
		this.gotoPageText.value=_page;
	}
	//this.setButton(this.isFirst,this.isFirst,this.isLast,this.isLast,readonly,allowAdd,allowDel);
	if (this.pageInfoDiv){
		this.pageInfoDiv.innerHTML = '<nobr>';

		if (!this.datacell.isCount || _count<0 )	{
			this.pageInfoDiv.innerHTML +=
				"<nobr>" + this.datacell.PAGE_RECORDINFO_NOCOUNT.replace("{0}",_startR).replace("{1}",_endR) + "</nobr>";
		}else{
			this.pageInfoDiv.innerHTML +=
				this.datacell.PAGE_RECORDINFO.replace("{0}",_startR).replace("{1}",_endR).replace("{2}",_count)	;
			this.pageInfoDiv.innerHTML +=
				"&#160;&#160;<nobr>" + this.datacell.PAGE_INFO.replace("{0}",_tpage) + "</nobr>";

		}
		this.pageInfoDiv.innerHTML += '</nobr>';
	}

}


	if ( this.firstPageButton){
		this.firstPageButton._disabled=this.isFirst || !hasPage;
	}
	if ( this.prePageButton){
		this.prePageButton._disabled=this.isFirst || !hasPage;
	}
	if ( this.nextPageButton){
		this.nextPageButton._disabled=this.isLast || !hasPage;
	}
	if ( this.lastPageButton){
		this.lastPageButton._disabled=this.isLast || this.count<0 || !hasPage;
	}

	if (this.isFirst|| !hasPage) {
		setOpacity(this.firstPageButton,0.5);
		setOpacity(this.prePageButton,0.5);
	}else{
		setOpacity(this.firstPageButton,1);
		setOpacity(this.prePageButton,1);
	}

	if (this.isLast|| !hasPage) {
		setOpacity(this.nextPageButton,0.5);
		setOpacity(this.lastPageButton,0.5);
	}else{
		setOpacity(this.nextPageButton,1);
		setOpacity(this.lastPageButton,1);
	}

	if (this.count<0|| !hasPage) {
		setOpacity(this.lastPageButton,0.5);
	}


	if (!hasPage || !pagecond.getProperty("begin") ){
		if (this.gotoPageButton){
			this.gotoPageButton._disabled=true;
			this.gotoPageText.disabled=true;
			setOpacity(this.gotoPageButton,0.5);
		}

	}

}

/**
 * 清空工具条的方法.
 */
Pilot.prototype.clearup = function(){
	for(var prop in this){
		try{
			this[prop] = null;
		}catch(e){
			$handle(e);
		}
	}
}



/**
 * 转到第n页的方法，构造出xml参数让datacell提交.
 * @param {Object} pageIndex
 */
Pilot.prototype.gotoPage = function(pageIndex){

	pageIndex=Number(pageIndex);

	if(isNaN(pageIndex)){
		pageIndex = 1;
	}
	pageIndex=parseInt(pageIndex , 10);
	this.currentPage= pageIndex ;

	if(pageIndex<1){
		pageIndex = 1;
	}

	var beginValue = (pageIndex-1)* Number(this.datacell.pageSize);



	if(beginValue<0){
		beginValue=0;
	}
	var countValue = this.count;
	if(!this.datacell.isCount){
		countValue = -1;
	}

	var pageParam = this.datacell.setPageParam(beginValue, this.datacell.pageSize, countValue ,this.datacell.isCount);


	this.datacell.gotoPage(pageParam);
}
/**
 *  点击转到第N页按纽触发的事件.
 */
Pilot.prototype.gotoInputPage = function(){
	var page = Number(this.gotoPageText.value);
	if(isNaN(page)){
		alert(DATACELL_PAGENUM_ERR);
		//alert("please enter a int number :" + this.gotoPageText.value);
	}else{
		this.gotoPage(page);
	}
}
/**
 * 转到第一页.
 */
Pilot.prototype.gotoFirstPage = function(){
	if(this.first_able){
		this.gotoPage(1);
	}
}
/**
 * 转到下一页.
 */
Pilot.prototype.gotoNextPage = function(){
	if(this.next_able){
		this.gotoPage(this.getCurrPage()+1);

	}
}
/**
 * 转到上一页.
 */
Pilot.prototype.gotoPrePage = function(){
	if(this.pre_able){
		this.gotoPage(this.getCurrPage()-1);
	}
}
/**
 * 转到最后一页.
 */
Pilot.prototype.gotoLastPage = function(){
	if(this.last_able){
		this.gotoPage(this.getPageCount());
	}
}
/**
 * 添加一行.
 */
Pilot.prototype.addRow = function(){
	this.datacell.addRow();
}
/**
 * 删除选中行.
 */
Pilot.prototype.deleteRow = function(){
	this.datacell.deleteRow();
}
/**
 * 重新载入数据.
 */
Pilot.prototype.reloadData = function(){
	this.datacell.reload();
}
/**
 * 提交数据.
 */
Pilot.prototype.submit = function(){
	this.datacell.submit();
}
/**
 * 设置分页按纽的是否可用.
 * @param {Object} first
 * @param {Object} pre
 * @param {Object} next
 * @param {Object} last
 * @param {Object} readonly
 * @param {Object} allowAdd
 * @param {Object} allowDel
 */
Pilot.prototype.setButton = function(first,pre,next,last,readonly,allowAdd,allowDel){
	if(first){
		this.first_able= true;
		this.firstPageButton.src = this.iconPath +  PICTURE_FIRST_BUTTON;
	}else{
		this.first_able= false;
		this.firstPageButton.src = this.iconPath +  PICTURE_FIRST_DISABLE;
	}
	if(pre){
		this.pre_able= true;
		this.prePageButton.src = this.iconPath +  PICTURE_PRIVOUS_BUTTON;
	}else{
		this.pre_able= false;
		this.prePageButton.src = this.iconPath +  PICTURE_PRIVOUS_DISABLE;
	}
	if(next){
		this.next_able= true;
		this.nextPageButton.src = this.iconPath +  PICTURE_NEXT_BUTTON;
	}else{
		this.next_able= false;
		this.nextPageButton.src = this.iconPath +  PICTURE_NEXT_DISABLE;
	}
	if(last){
		this.last_able= true;
		this.lastPageButton.src = this.iconPath +  PICTURE_LAST_BUTTON;
	}else{
		this.last_able= false;
		this.lastPageButton.src = this.iconPath +  PICTURE_LAST_DISABLE;
	}
	if(allowAdd||readonly){
		this.addButton.src = this.iconPath + PICTURE_ADD_DISABLE;
	}else{
		this.addButton.src = this.iconPath + PICTURE_ADD_BUTTON;
	}
	if(!allowDel||readonly){
		this.deleteButton.src = this.iconPath + PICTURE_DELETE_DISABLE;
	}else{
		this.deleteButton.src = this.iconPath + PICTURE_DELETE_BUTTON;
	}
}

/**
 * 获得页数的方法.
 */
Pilot.prototype.getPageCount = function(){
	return this.totalPage;
}
/**
 * 获得当前页的方法.
 */
Pilot.prototype.getCurrPage = function(){
	return this.currentPage;
}
/* ************************************************************************
 * ********************************
 * EOS datacell控件开发规范.
 * view控件:构造函数:参数为:type--控件类型;datacell会依次调用控件的方法.
 * ********setValue(value)设置控件的值.
 * ********getView()返回控件的DOM对象.方便添加到datacell的单元格中.
 * edit控件:构造函数:参数为:type--控件类型;datacell会依次调用控件的方法.
 * ********setValue(value)设置控件的值.
 * ********getEdit()返回控件的DOM对象.方便添加到datacell的单元格中.
 * ********setFocus()设置编辑控件的焦点.
 * ********getValue()获取控件的值.
 * **************************************
 */

/**
 * 上移当前行
 */
Datacell.prototype.rowMoveUp=function(row){
	row = row || this.activeRow  ;
	if (!row){ return ; }
	var tbody=row.parentNode;
	var idx=row.rowIndex;
	var rowno= row.getAttribute("__entity_rowno");

	if (idx<1){
		return;
	}

	var nrow = tbody.rows[idx-1];
	var nrowno= nrow.getAttribute("__entity_rowno");

	tbody.insertBefore(row,nrow);

};

/**
 * 下移当前行
 */
Datacell.prototype.rowMoveDown=function(row){
	row = row || this.activeRow ;
	if (!row){ return ; }
	var tbody=row.parentNode;
	var idx=row.rowIndex;
	var rowno= row.getAttribute("__entity_rowno");

	if (idx>=tbody.rows.length-1){
		return;
	}

	var nrow = tbody.rows[idx+1];
	var nrowno= nrow.getAttribute("__entity_rowno");

	tbody.insertBefore(nrow,row);

};

/**
 * 取得当前选中行
 */
Datacell.prototype.getActiveRow=function(){
	return this.activeRow;
};
/**
 * 取得当前选中单元格
 */
Datacell.prototype.getActiveCell=function(){
	return this.activeCell;
};

/**
 * 取得当前选中单元格对应的entity
 */
Datacell.prototype.getActiveEntity=function(){
	return this.getEntity(this.getActiveRow());
};

/**
 * 显示datacell编辑器
 */
Datacell.prototype.showEditor=function(){
	PageControl.addtoStack(this);
	this.datacellContainer.style.display = "";
	this.datacellContainer.onmousedown = function(){
		eventManager.stopEvent();
	}
};
/**
 * 隐藏datacell编辑器
 */
Datacell.prototype.hideEditor=function(){
	if(this.activeEditor){
		this.activeEditor.hideEditor();
	}
	if(this.datacellContainer){
		this.datacellContainer.style.display = "none";
		this.datacellContainer.onmousedown = null;
	}
};

Datacell.prototype.hide=function(){
	this.hideEditor();
};

/**
 * 设置控件的位置.
 * @param {Object} left
 * @param {Object} top
 * @param {Object} width
 * @param {Object} height
 */

Datacell.prototype.setPosition=function(left,topx,width,Height){
	this.datacellContainer.style.position = "absolute";
	//this.datacellContainer.style.left = left + "px";
	//this.datacellContainer.style.top = topx + "px";
	var zIndex = getMaxZindex();
	var maxZindex = getMaxZindex(document);
	if(this.datacellContainer.style.zIndex!=maxZindex){
		this.datacellContainer.style.zIndex = maxZindex;
	}
	setElementXY(this.datacellContainer,[left,topx]);
};





/**
 * 取得datacell编辑器的显示值
 */
Datacell.prototype.getDisplayValue=function(value){
	return value;
};

/**
 * 取得datacell编辑器是否获得焦点
 */
Datacell.prototype.isFocus=function(){
	return false;
};
/**
 * datacell编辑器的校验函数
 */
Datacell.prototype.validate=function(){
	return true;
};




// =================================================
// =======  以下为事件回调函数   ===================
// =================================================


 /**
 * 选中一行时调用的函数,该函数用户可以重写以进行其它操作.
 * @param {Object} row 选中的行,
 * @param {Object} entity 选中行的数据.
 */
Datacell.prototype.onSelectRow = function(row,entity){

}
/**
 * 删除一行时调用的函数,用户可以重写该方法进行相关操作.
 * @param {Object} row 选中的行,
 * @param {Object} entity 选中行的数据.
 */
Datacell.prototype.onDeleteRow = function(row,entity){
	return true;
}

/**
 * 提交数据时调用的方法.
 * 如果返回true则提交数据,返回false则不提交数据,
 * 默认实现为返回true.
 */
Datacell.prototype.onSubmit = function(){
	return true;
}
/**
 * 添加一行时调用的方法.
 * 如果返回true则添加,返回false则不添加,
 * 默认实现为返回true.
 */
Datacell.prototype.onAddRow = function(row){
	return true;
}



/**
 * 载入数据时调用的函数,用户可以重写该方法.
 * 如果返回true则继续载入数据,返回false则不用载入数据,
 * 默认实现为返回true.
 */
Datacell.prototype.onUpdateCell=function(){  };
Datacell.prototype.onLoadData = function(){
	return true;
}

Datacell.prototype.onUpdateRow = function(row){
	return true;
}
Datacell.prototype.onUpdate = function(){
	return true;
}
/**
 *初始化之前调用的方法,用户可以重写该方法.
 */
Datacell.prototype.beforeInit = function(){ }

/**
 *初始化以后调用的方法,用户可以重写该方法.
 */
Datacell.prototype.afterInit = function(){ }
/**
 * 载入数据之前调用的函数,用户可以重写该方法.
 */
Datacell.prototype.beforeLoadData = function(){ }
/**
 * 载入数据之后调用的函数,用户可以重写该方法.
 */
Datacell.prototype.afterLoadData = function(){ }
Datacell.prototype.beforeRefresh = function(){ }
Datacell.prototype.afterRefresh = function(){ }

Datacell.prototype.beforeSubmit = function(){ }
Datacell.prototype.afterSubmit = function(){ }

Datacell.prototype.beforeSubmit = function(){ }
Datacell.prototype.beforeSave = function(){ }
Datacell.prototype.afterSave = function(){ }


Datacell.prototype.beforeRefreshCell = function(){ }

Datacell.prototype.beforeAdd = function(){ }
Datacell.prototype.afterAdd = function(){ }

Datacell.prototype.beforeEdit = function(cell,rowIndex,colIndex){ }
Datacell.prototype.afterEdit = function(  newValue, oldValue , datacell ){ }

Datacell.prototype.beforeDel = function(){ }
Datacell.prototype.afterDel = function(){ }


Datacell.prototype.beforeSelectRow = function(){ }
Datacell.prototype.afterSelectRow = function(){ }
Datacell.prototype.beforeUnselectRow = function(){ }
Datacell.prototype.afterUnselectRow = function(){ }

Datacell.prototype.onComplete = function(){ }
Datacell.prototype.onPageChange = function(){ }

Datacell.prototype.onClickHead = function(headTD, colNo ,field,datacell){};
Datacell.prototype.onClickCell = function(cellTD,colNo,rowNo,entity,field,datacell){};
Datacell.prototype.onClickRow = function(rowTR, rowNo ,entity,datacell){};

/*

=== toolsbar: ===
addTool
hideTool
showTool
disableTool

*/




Datacell.activeGrid=null;

Datacell.STATUS_BLANK = 0;
Datacell.STATUS_INITED = 1;
Datacell.STATUS_MODEFIED = 2;
Datacell.BLOLK_ID = "__DATACELL_BLOCK";//datacell锁定层的ID.
Datacell.__INDEX_NAME = "__INDEX";



/**
 * 监听datacell的外单击事件的函数,然后判断,
 * 如果datacell的编辑控件也包含事件触发点,
 * 则将datacell则编辑状态变为view状态.
 * @ptivate
 * @param {Object} table
 * @param {Object} srcObj
 * @param {Object} pos
 */
Datacell.outClick = function(table,srcObj,pos){
	var datacell = table.datacell;
	var container = datacell.editorContainer;
	if(container&&srcObj){
		var x = pos.x;
		var y = pos.y;
		var cpos = getPosition(container);
		var top = cpos.top;
		var left = cpos.left;
		var right = left + container.offsetWidth;
		var bottom = top + container.offsetHeight;
//		$info("left:" + left + "right:" + right + "top:" + top + "bottom:" + bottom + "x:" + x + "y:" + y);
		if(!container.contains(srcObj)){
			if(top>y||left>x||right<x||bottom<y){
				//Datacell.processBlur(table);
				datacell.endEdit();
			}
		}
	}else{
		//Datacell.processBlur(table);
		datacell.endEdit();
	}
}
/**
 * 判断是否点击了单元格.
 * @param {Object} elem
 */
Datacell.isCell = function(elem){
	if(elem && elem.tagName){
		var tag = elem.tagName.toLowerCase()=="td";
		var name = elem.getAttribute("fieldId");
		if(name && tag){
			return true;
		}
		return false;
	}
	return false;
}
/**
 * 判断是否点击了表头的单元格.
 * @param {Object} elem
 */
Datacell.isHead = function(elem){
	if(elem.tagName){
		var tag = elem.tagName.toLowerCase()=="th";
		var name = elem.getAttribute("__type")=="head";
		if(name && tag){
			return true;
		}
		return false;
	}
	return false;
}


/**
 * 根据单元格获取datacell的方法.
 * @param {Object} cell 单元格.
 * @type Datacell
 * @return 返回datacell
 */
Datacell.getDatacellByCell = function(cell){
	try{
		var table = getParentByTagName(cell,"table");
		var datacell = table.datacell;
		return datacell;
	}catch(e){
		$handle(e);
		return null;
	}
}

/*
	创建checkbox-cell的方法,返回checkbox-cell的html代码
*/
Datacell.checkCell=function(value,entity,rn,cn,datacell ,checkedValue,uncheckedValue) {
	var checkFlag='',_cvalue= uncheckedValue;
	if (value==checkedValue){
		checkFlag="checked";
		_cvalue=checkedValue;
	}
	_cvalue=_cvalue||_cvalue===0?_cvalue:'';

	var funcname='fieldFunc_'+datacell.id+'_'+cn;

	Datacell[funcname]=function(checkObj){
		var fieldName= datacell.fields[cn].fieldName;
		if (checkObj.checked){
			entity.setProperty( fieldName, checkedValue);
		}else{
			entity.setProperty( fieldName ,uncheckedValue);
		}

	}

	return "<input type=\"checkbox\" "+checkFlag+ " value=\""+(''+_cvalue).replace(/\"/igm,"\\\"" ).replace(/\n/igm,"\\n" )+"\" "
			+" onclick=\"Datacell['"+funcname+"'](this)\"  />";

}
Datacell.checkCellHandler=function(checkBox){}



/**
 * @private
 * 格式化字符串的函数，先检查类型：日期，时间，时间戳，数字，然后format
 * @param {Object} value
 * @param {Object} format
 */
Datacell.getFormatValue = function(value,format){
	if(isDateFormat(format)){
		if(isTimeFormat(format)){
			return dateFormat(value,DATETIME_FORMAT,format);
		}else{
			return dateFormat(value,DATE_FORMAT,format);
		}
	}else if(isTimeFormat(format)){
		return timeFormat(value,TIME_FORMAT,format);
	}else{
		return formatNumber(value,format);
	}
}

/* 取得编辑器 */
Datacell.$editor=function(el){
	 if ( !el || (el && el.getValue) ){
		return el;
	 }
	 return SimpleEditor(el);
}



/**
 * @private
 * 取得排序的值
 */
Datacell.getSortValue=function(datacell,trObj,fieldName){
	var value = datacell.dataset.get(trObj.getAttribute("__entity_rowno")/1).getProperty(fieldName);
	var value1= value?Number(value):value;
	value= isNaN(value1)?value:value1;
	return  value;
}



/**
 * @private
 * 取得默认排序的值
 */
Datacell.getSortDefaultValue=function(datacell,trObj,fieldName){
 return  trObj.getAttribute("__entity_rowno")/1;
}


/*
Datacell.refreshCell = function(cell){
	var key = cell.getAttribute("fieldId");
	if(key==Datacell.__INDEX_NAME){
		return;
	}
	var datacell = Datacell.getDatacellByCell(cell);
	var div=cell.firstChild;
	var field = datacell.keys[key];
	var type = field.viewType;
	div.innerHTML = datacell.createCellValue(cell,field);
}
*/

function getDatacellRoot(obj){
	var parentObj = getParentByTagName(obj, "table");
	if(parentObj){
		if(parentObj.className && parentObj.className.indexOf("eos-grid-container")!=-1){
			return parentObj;
		}else if(parentObj){
			return getDatacellRoot(parentObj);
		}
	}else{
		return null;
	}
}

/* 初始化datacell的全局事件 */
Datacell.initGlobalEvent = function(){


	eventManager.add(document,"keydown",function(event){
		Datacell.activeGrid && Datacell.activeGrid._onKeyDown(event)
	});
	eventManager.add(document.body,"click",function(event){
			var element = event.srcElement || event.target;
			if(!getDatacellRoot(element)){
				Datacell.activeGrid=null;
			}
	});

	eventManager.add(document.body, "mousemove" ,function(event){
		Datacell.activeGrid && Datacell.doDocGridHandler(event,Datacell.activeGrid)
	});
	eventManager.add(document.body, "mouseup" ,function(event){
		Datacell.activeGrid && Datacell.endDocGridHandler(event,Datacell.activeGrid)
	});

};


/* 调整列宽的函数 */
Datacell.doDocGridHandler = function (evt,datacell) {
		evt=evt||window.event;
		var mX= eventManager.getPointX();
		if (datacell.splitLine.style.display=="block"){
			var cX=mX- datacell.viewportXY[0];
			//cX=cX>grid.splitLineMinX?cX:grid.splitLineMinX;
			datacell.splitLine.style.left= cX+"px";

		}else{

		}
}

/* 完成调整列宽的函数 */
Datacell.endDocGridHandler = function (evt,datacell) {
		evt=evt||window.event;
		var mX= eventManager.getPointX();
		if (datacell.splitLine.style.display=="block"){
			var field= datacell.resizeColumn;

			field.newRightX=mX- datacell.viewportXY[0];

			var dwidth=field.newRightX-field.oldRightX //- ( GT.isOpera||GT.isSafari?0:1);

			var oldWidth=parseInt( CSSUtil.getRule("." + field.styleClass,true).style.width);
			var newWidth=dwidth+ oldWidth;
			datacell.setColumnWidth(field,newWidth);

			datacell.resizeColumn=false;
			datacell.splitLine.style.display="none";
			datacell.headDiv.style.cursor = "auto";
			datacell.gridMask.style.cursor='auto';
			datacell.gridMask.style.display='none';
			datacell.syncScroll();

		}else{

		}
}

Datacell.onWindowResize=function(datacell){

  if(_eos_curr_open_panel!=null) if(!datacell.isInCurrPanel()) return;

	datacell.autoResizeS1();

}



Datacell.prototype.autoResizeS1=function (){

    var datacell=this;

    datacell.bodyDivHeight =datacell.containerTD.offsetHeight - datacell.headHeight;
	datacell.bodyDivWidth=datacell.containerTD.offsetWidth;

	var doResize=false;

	if(datacell.width.indexOf("%")!=-1){
		//datacell.bodyDiv.style.width="1px";   //??why??
		doResize=true;
    }
    if(datacell.height.indexOf("%")!=-1){
		datacell.container.style.height="100%"
		//?? datacell.datacellContainer.style.height="100%"
		datacell.bodyDiv.style.height="1px";
		datacell.freezeBodyDiv.style.height = datacell.bodyDiv.clientHeight + 'px';
		doResize=true;
    }else{
		if (datacell.bodyDivHeight>0){
			datacell.bodyDiv.style.height= datacell.bodyDivHeight + 'px';
		}
		if (datacell.bodyDiv.clientHeight>0){
			/**
			*熊世宏修改于2012-02-29
			*解决Firefox浏览器下的兼容性问题
			*/
			/**************start**********/
			//datacell.freezeBodyDiv.style.height = datacell.bodyDiv.clientHeight + 'px';
			/**************end**********/
		}
	}
    if( doResize) {
		setTimeout(function(){
				datacell.autoResize();

			},1);
	}else{
		datacell.syncScroll();
	}

}

Datacell.prototype.autoResizeS2=function(){

	var datacell=this;

	datacell.bodyDivHeight =datacell.containerTD.offsetHeight - datacell.headHeight;
	datacell.bodyDivWidth=datacell.containerTD.offsetWidth;

	if(datacell.height.indexOf("%")!=-1){
		if (datacell.bodyDivHeight>0){
			datacell.bodyDiv.style.height= datacell.bodyDivHeight + 'px';
		}
		if (datacell.bodyDiv.clientHeight>0){
			datacell.freezeBodyDiv.style.height = datacell.bodyDiv.clientHeight + 'px';
		}
	}

	if(datacell.width.indexOf("%")!=-1){
		if (datacell.bodyDivWidth>0){
			datacell.bodyDiv.style.width=datacell.bodyDivWidth+'px';
		}
    }
}

Datacell.prototype.autoResize=Datacell.prototype.autoResizeS2;


Datacell.prototype.isInCurrPanel=function ()
{
    if(_eos_curr_open_panel!=null)
    {
        var obj=this.datacellContainer.offsetParent;
    	while(true)
		{

			if(obj==null)
			      return false;
			if(obj==_eos_curr_open_panel.table)
	                return true;
			obj=obj.offsetParent;
		}
    }
    else
     return false;

}


Datacell.createSwidthCheckBox=function(value,entity,rowNo,cellNo,datacell)
{
  var field = datacell.getField(cellNo);
  var checkedValue=field.checkedValue;
  var unCheckedValue=field.unCheckedValue;
  var checkFlag=""
  if(checkedValue==value) checkFlag="checked";
  return    "<input type=\"checkbox\" "+checkFlag+ " swidthCheckbox=\"true\"/>";
}


