

/**
 * 日历控件的构造函数，日历控件用法如下：先构造一个日历控件，然后调用init方法,
 * @param {Object} id
 * @param {Object} format 日历控件的format，默认为yyyyMMdd
 */
function Calendar(id,format)
{//wujun
	this.showMoreDay=true;
	this.id=id;
	this.Obj=id;
	this.date=null;
	this.mouseOffset=null;
	this.timer=null;
	this.timeSelect=null;
	this.format=isDateFormat(format)?format:"yyyy-MM-dd";
	if(isTimeFormat(this.format)){
		this.showTime=true;
		this.__privateFormat="yyyy-MM-dd HH:mm:ss";
		this.maxValue=dateFormat("2500-12-31 23:59:59","yyyy-MM-dd HH:mm:ss",this.format);
		this.minValue=dateFormat("1700-01-01 00:00:00","yyyy-MM-dd HH:mm:ss",this.format);
	}else {
		this.showTime=false;
		this.__privateFormat="yyyy-MM-dd";
		this.maxValue=dateFormat("2500-12-31","yyyy-MM-dd",this.format);
		this.minValue=dateFormat("1700-01-01","yyyy-MM-dd",this.format);
	}
	this.submitFormat = null;
	this.inputObject=null;
	this.eventObject=null;
	this.hiddenObject=null;
	this.canClose=true;
	this.container=null;
	this.focusStatus = false;
	this.defaultNull = false;
	this.allowInput = true;
	this.onSelectFunc = null;
	this.value = null;
	PageControl.add(this.id,this);
};
Calendar.currentCalendar=null;
Calendar.editorContainer=null;
Calendar.doc=document;
/**
 * 初始化日历控件的方法，把所有的html代码放进div容器，并添加到body
 * 的子节点.
 */
Calendar.prototype.init=function (){
	this.container=$id(this.id+"_container");
	this.inputObject=$id(this.id+"_input");
	this.hiddenObject=$id(this.id + "_hidden");
	this.eventObject=$id(this.id + "_button")
	this.button=this.eventObject;
	this.text=this.inputObject;
	this.hidden=this.hiddenObject;
    this.setReadOnly(this.readOnly);
    this.setDisabled(this.isDisabled);
    //修补IE选择按钮框的上下问题
    this.button.style.verticalAlign="bottom";
    
    if(this.width!=null){
    	this.container.style.width=this.width;
    } 
	
	try{
		this.refreshDisplayValue();
		this.refreshHiddenValue();
	}catch(e){}

	this.initEvent();
	if(this.maxValue){
		this.maxValue = dateFormat(this.maxValue,this.format,this.__privateFormat);
	}
	if(this.minValue){
		this.minValue = dateFormat(this.minValue,this.format,this.__privateFormat);
	}
	//init reset
	this.resetValue=this.value;
	var form=getFormByObj(this.inputObject);
	   if(form!=null) initEosControlReset(form,this);
	this.inited=true;
}
Calendar.prototype.reset=function()
{
 this.value=this.resetValue;
 this.refreshDisplayValue();
 this.refreshHiddenValue();
 
}
Calendar.prototype.setReadOnly=function(isReadOnly){
    this.readOnly=isReadOnly;
    this.inputObject.readOnly=isReadOnly||!this.allowInput;
   	if(isReadOnly)
	  this.eventObject.style.cursor="default"
	   else
	  this.eventObject.style.cursor="pointer"
}

Calendar.prototype.getReadOnly=function(){
   return this.readOnly;
}

Calendar.prototype.setDisabled=function(isDisabled){
    this.isDisabled=isDisabled;
    if(isDisabled)
	    {
	    this.disabled();
   	    this.eventObject.style.cursor="default"	
	    }
	    else
	    {
	    this.enable();
	    this.eventObject.style.cursor="pointer"	
	    }
    
}

Calendar.prototype.setDisplayValue=function(v){
	var oldV=this.inputObject.value;
	this.inputObject.value=v;
	if (oldV!==v && this.inited) {
		if (this.inputObject.onchange) {
			this.inputObject.onchange();
		}else{
			this.inputObject.fireEvent("onchange");
		}
	}

}

Calendar.prototype.getDisabled=function(){
   return this.isDisabled;
}

Calendar.prototype.refreshDisplayValue = function(){
	if(this.value){
		this.setDisplayValue(dateFormat(this.value,this.__privateFormat,this.format));
		f_alert_verify_successful(this.inputObject);
	}

}
Calendar.prototype.refreshHiddenValue = function(){
	if(this.value){
		var format = this.__privateFormat;
		if(this.submitFormat&&this.submitFormat!=this.__privateFormat){
			format = this.submitFormat;
		}
		this.hiddenObject.value = dateFormat(this.value,this.__privateFormat,format);
	}else
	{
	this.hiddenObject.value="";
	}

}
Calendar.prototype.isFocus = function(){
	return this.focusStatus;
}
/**
 * 初始化事件的函数.
 * @param {Object} div 传入外单击事件的div
 */
Calendar.prototype.initEvent=function (){
	var calendar=this;
	//if(!this.inputObject.readOnly){
		this.inputObject.onkeyup=function (){
			if(checkInput(this)==false){
				return ;
			}		 

			/*if(!calendar.validate()){
				//"date "+this.value+" should between "+calendar.minValue+" and "+calendar.maxValue + " and is the format of : " + calendar.format
				f_alert(calendar.inputObject,CALENDAR_ERROR_BETWEEN.replace("{0}",this.value).replace("{1}",calendar.format).replace("{2}",calendar.minValue).replace("{3}",calendar.maxValue));
			}else{*/
				f_alert_verify_successful(this);
				if(this.value=="")
				  calendar.value=null;
				  else
				  {
				  calendar.date = dateFormat(this.value,calendar.format,calendar.__privateFormat);
				  calendar.value = dateFormat(this.value,calendar.format,calendar.__privateFormat);
				  }
				calendar.refreshHiddenValue();
				//calendar.hiddenObject.value=dateFormat(this.value,calendar.format,calendar.__privateFormat);
			//}
		}
		this.inputObject.userOnblur=this.inputObject.onblur;
		this.inputObject.onblur = function(){
			if(this.userOnblur!=null)this.userOnblur();
			this.onkeyup()
		}
		//var f=this.inputObject.onkeyup
		//eventManager.add(this.inputObject,"blur",this.inputObject.onkeyup);
		
	//}
;//addButtonToText(this.inputObject,this.buttonImg);
	this.eventObject.src=contextPath+"/common/skins/skin0/images/calendar/calendar_button.gif";
//	this.eventObject.onmousedown = function(){
//		eventManager.stopPropagation();
//	}
    this.eventObject.onmouseover=function()
               {
            if(calendar.getDisabled()||calendar.getReadOnly()) return;
               this.src=contextPath+"/common/skins/skin0/images/calendar/calendar_button_over.gif"
               }   
    this.eventObject.onmouseout=function()
               {
            if(calendar.getDisabled()||calendar.getReadOnly()) return;
               this.src=contextPath+"/common/skins/skin0/images/calendar/calendar_button.gif"
               }              
    this.eventObject.onmousedown=function()
               {
            if(calendar.getDisabled()||calendar.getReadOnly()) return;
               this.src=contextPath+"/common/skins/skin0/images/calendar/calendar_button_down.gif"
               }              
                        
	this.eventObject.onmouseup = function(){
        if(calendar.getDisabled()||calendar.getReadOnly()) return;
	    this.src=contextPath+"/common/skins/skin0/images/calendar/calendar_button_over.gif"
		
		var showCEditor=function(){
			if(CalendarEditor.getCalendar()==calendar){
				if(CalendarEditor.showStatus){
					calendar.hide();
				}else{
					calendar.show();
				}
			}else{
				calendar.show();
			}
		}
		if(CalendarEditor.inited===false){
			CalendarEditor.lazyInit(showCEditor);
		
			//CalendarEditor.init();
			CalendarEditor.inited = true;
		}else{
			showCEditor();
		}
		eventManager.stopPropagation();
	}
}
/**
 * 显示日历控件的方法.
 */
Calendar.prototype.show=function ()
{	
	PageControl.addtoStack(this);
	var calendarObj = {
		maxValue : this.maxValue,
		minValue : this.minValue,
		value : this.value,
		format : this.__privateFormat,
		showTime :this.showTime
	};

	CalendarEditor.reFreshEditor(calendarObj);
	CalendarEditor.showEditor();
	var pos = getPosition(this.container);
	var x = pos.left;//-document.body.scrollTop;
	var y = pos.top;//-document.body.scrollLeft;
	if(window!=CalendarEditor.win){
		if(isIE){
			var xyOff = getAbsPos(this.inputObject,CalendarEditor.win);
			x = xyOff.left;// + CalendarEditor.doc.body.scrollLeft;
			y = xyOff.top;// + CalendarEditor.doc.body.scrollTop;
			if(CalendarEditor.win!=window){
				x = x -2;
				y = y-2;
			}
		}else{
			var xyOff = getScreenPos(window,CalendarEditor.win);
			x = x + xyOff.left - document.body.scrollLeft;// - CalendarEditor.doc.body.scrollLeft;
			y = y + xyOff.top - document.body.scrollTop;// - CalendarEditor.doc.body.scrollTop;
		}
	}

	y = y*1 +  this.inputObject.offsetHeight*1;
	CalendarEditor.setPosition(x,y);
	CalendarEditor.setCurrEditor(this);
	if(!this.inputObject)
	{
		$error("err parameters of date in Calendar:"+this.id+".show");
		return ;
	}
	var _date=this.inputObject.value;
	var isRightFormat=false;
	if(_date){
		if(isDate(_date,this.format)){
			if(this.showTime){
				if(isFormatTime(_date,this.format)){
					_date=dateFormat(_date,this.format,this.__privateFormat);
					isRightFormat=true;
				}
			}else {
				_date=dateFormat(_date,this.format,this.__privateFormat);
				isRightFormat=true;
			}
		}
	}
	if(!isRightFormat){
		_date=dateToString(new Date(),this.__privateFormat);
	}
	this.focusStatus = true;
};
/**
 * 隐藏日历控件的方法.
 */
Calendar.prototype.hide=function ()
{
	try{
		CalendarEditor.hideEditor();
		this.focusStatus = false;
	}catch(e){}
};
/**
 * 符合控件开发规范的函数.
 */
Calendar.prototype.getValue=function (){
	return this.value;
}
/**
 * 符合控件开发规范的函数.
 * @param {Object} value
 */
Calendar.prototype.setValue=function (value){
	if(!value||value==""){
		this.value = null;
		this.setDisplayValue("");
		this.hiddenObject.value="";
		return ;
	}
	if((typeof(value))!="string" ){
		this.value = dateToString(value,this.__privateFormat);
		this.refreshDisplayValue();
  	this.refreshHiddenValue();
	}else{
		if(isDate(value,this.__privateFormat)){
			this.value = value;
			this.refreshDisplayValue();
  		this.refreshHiddenValue();
		}else if(this.submitFormat&&isDate(value,this.submitFormat)){
			this.value = dateFormat(value,this.submitFormat,this.__privateFormat);
			this.refreshDisplayValue();
  		    this.refreshHiddenValue();
		}
		if(isDate(value,"yyyy-MM-dd HH:mm:ss.S")||isDate(value,"yyyy-MM-dd HH:mm:ss")){
			this.value = dateFormat(value,"yyyy-MM-dd HH:mm:ss",this.__privateFormat);
			this.refreshDisplayValue();
  		    this.refreshHiddenValue();
		}
		else{
			this.setDisplayValue("");
			this.hiddenObject.value="";
		}
		

	}
}
/**
 * 设置控件的位置.
 * @param {Object} left
 * @param {Object} top
 * @param {Object} width
 * @param {Object} height
 */
Calendar.prototype.setPosition=function (left,topx,width,height){
	this.hide();
	if(this.container){
		//width = width - 18;
		this.container.style.display="";
		this.container.style.position="absolute";
		var maxZindex = getMaxZindex(document);
		if(this.container.style.zIndex!=maxZindex){
			this.container.style.zIndex = maxZindex;
		}

		this.container.style.left = left;
		this.container.style.top = topx;
		//setElementXY(this.container,[left,topx]);
		//this.inputObject.style.width=width- (isBorderBox?0:2) + "px";
		//this.inputObject.style.height=height- (isBorderBox?0:2) + "px";
		this.eventObject.style.height=height;
	    this.container.style.height=height;
	    this.container.style.width=width;
	    this.inputObject.style.height=height;
	    this.inputObject.style.width=width-17;
	}
}

Calendar.prototype.setFocus=function (){

}

Calendar.prototype.onValidate=function (hiddenValue,TextValue){
return true;
}

/**
 * 校验函数，返回校验结果
 *@return
 *@type {Boolean}
 */
Calendar.prototype.validate = function(){
	var value = this.inputObject.value;
 		
//	if(value!=""){
	if(value||value===0){
		var isDatevalue = isDate(this.inputObject.value,this.format);
		var isTime = true;
		if(this.showTime){
			isTime = isFormatTime(this.inputObject.value,this.format);
		}
		if(isDatevalue&&isTime){
			var maxValue = stringToDate(this.maxValue,this.__privateFormat);
			var minValue = stringToDate(this.minValue,this.__privateFormat);
			var mValue = stringToDate(value,this.format);
			if(mValue-maxValue>0){
				//value + " should before than " + this.maxValue
				f_alert(this.inputObject,CALENDAR_ERROR_MIN.replace("{0}",value).replace("{1}",this.maxValue));
				return false;
			}
			if(mValue-minValue<0){
				//value + " should after than " + this.minValue
				f_alert(this.inputObject,CALENDAR_ERROR_MAX.replace("{0}",value).replace("{1}",this.minValue));
				return false;
			}

		}else{
			// "error format of " + value
			f_alert(this.inputObject,CALENDAR_ERROR_RORMAT.replace("{0}",value).replace("{1}",this.format));
			return false;
		}
	}
	return this.onValidate(dateFormat(value,this.format,this.__privateFormat),this.text.value);
}
/**
 * 符合控件开发规范的函数，供datacell调用来隐藏editor
 */
Calendar.prototype.hideEditor=function (){
	f_alert_verify_successful(this.inputObject);
	this.hide();
	this.container.style.display="none";
	this.eventObject.style.display = "none";
}
/**
 * 符合控件开发规范的函数，供datacell调用来显示editor
 */
Calendar.prototype.showEditor=function (){
   
	this.container.style.display="";
	this.eventObject.style.display = "";
}
/**
 * 把日历控件设置为不可用，不能提交数据.
 */
Calendar.prototype.disabled=function (){
	this.inputObject.disabled=true;
	this.eventObject.disabled=true;
	this.hiddenObject.disabled=true;
	this.container.disabled=true;
}

/**
 * 符合控件开发规范的函数，获得控件的显示值
 * @param {Object} value
 */
Calendar.prototype.getDisplayValue = function(value){
	if(value===null||value===undefined||value==""){
		return "";
	}
	if(isDate(value,this.__privateFormat)){
		return dateFormat(value,this.__privateFormat,this.format);
	}else{
		if(isDate(value,"yyyy-MM-dd")){
			return dateFormat(value,"yyyy-MM-dd",this.format);
		}
		if(isDate(value,"yyyy-MM-dd HH:mm:ss")){
			return dateFormat(value,"yyyy-MM-dd HH:mm:ss",this.format);
		}
		if(isDate(value,"yyyy-MM-dd HH:mm:ss.S")){
			return dateFormat(value,"yyyy-MM-dd HH:mm:ss",this.format);
		}

		return value;
	}
}
/**
 * 把日历控件设置为可用，可以提交数据.
 */
Calendar.prototype.enable=function (){
	this.inputObject.disabled=false;
	this.eventObject.disabled=false;
	this.hiddenObject.disabled=false;
	this.container.disabled=false;
}
/**
 * 显示日历控件的函数
 * @param {Object} id
 */
function ShowCalendar(id){
	var calendar=$o(id);
	if(calendar){
		calendar.show();
	}
}

/**
 * 全局的calendar,整个top window只有一个实例，每一个calendar单击时都使用这个.
 */
function CalendarEditor(){

}

CalendarEditor.container=null;
CalendarEditor.value=null;
CalendarEditor.maxValue="2500-12-31";
CalendarEditor.minValue="1700-01-01";
CalendarEditor.format="yyyy-MM-dd";
CalendarEditor.showTime=false;
CalendarEditor.MAX_YEAR=2500;
CalendarEditor.MIN_YEAR=1700;
CalendarEditor.lastYear = null;
CalendarEditor.nextYear = null;
CalendarEditor.year = null;
CalendarEditor.month = null;
CalendarEditor.lastMonth = null;
CalendarEditor.nextMonth = null;
CalendarEditor.today = null;
CalendarEditor.body = null;
CalendarEditor.showStatus = false;
CalendarEditor.inited = false;
//CalendarEditor.okBtn = null;
CalendarEditor.currCell = null;
CalendarEditor.lazyInit=function(cb){
	var win=_get_top_window()||window;
	win.EOS.use('eos-calendar',function(){
		CalendarEditor.init();
		if(cb){
			cb();
		}
	});
}
/**
 * 初始化全局的container的方法，获得top window，
 * 在top的document中添加一个div
 */
CalendarEditor.init=function (){

	CalendarEditor.win=_get_top_window()||window;
	CalendarEditor.doc=CalendarEditor.win.document||document;
	
	
	var container=$id("_eos_webcomp_calendar_container",CalendarEditor.doc);
	if(container){
		CalendarEditor.container=container;
	}else {
		var str="";
		if(isIE){
			//str += '<iframe src="'+blankURL+'" style=\"position:absolute;z-index:-1;width:expression(this.nextSibling.offsetWidth);height:expression(this.nextSibling.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>';
		    str += '<iframe id="calendarIframe" src="'+blankURL+'" style=\"position:absolute;z-index:-1;\" frameborder=\"0\" ></iframe>';
		
		}
		str += '<div id="_eos_calendar_editor_container" onmousedown="eventManager.stopPropagation();" oncontextmenu="return false" class="eos-celendar-editor-container" style=" width: 228px;">';
		str += '    <div class="eos-celendar-editor-container2" style=" width: 100%;">';
        str += '    <table style="width: 100%" cellspacing="0" cellpadding="0">';
        str += '        <tr>';
        str += '            <td class="eos-calendar-head" style="height:26px">';
        str += '            <div>';
        str += '            <table  cellspacing="0" cellpadding="0" style="width: 100%">';
        str += '                <tr>';
        str += '                    <td>&nbsp;</td>';
        str += '                    <td style="width: 11px">';
        str += '                        <img style="cursor:hand;cursor:pointer;" id="_eos_calendar_last_year" alt="" src="'+PICTURE_ARROW_LEFT+'" class="eos-calendar-arrow-size"/></td>';
        str += '                    <td align="center" style="width: 41px">';
        str += '                        <input maxLength="4" id="_eos_calendar_year" class="eos-calendar-editor-date" onmouseover="eventManager.stopPropagation();" onmousedown="eventManager.stopPropagation();this.select();" onclick="eventManager.stopPropagation();this.select();" onmouseup="eventManager.stopPropagation();this.select();"   type="text" style="width:35px;padding-left:3;height:20px" />';
        str += '                    </td>';
        str += '                    <td style="width: 10px">';
        str += '                        <img style="cursor:hand;cursor:pointer;" id="_eos_calendar_next_year" alt="" src="'+PICTURE_ARROW_RIGHT+'" class="eos-calendar-arrow-size"/></td>';
        str += '                    <td width="30px">&nbsp;</td>';
        str += '                    <td style="width: 10px">';
        str += '                        <img style="cursor:hand;cursor:pointer;" id="_eos_calendar_last_month" alt="" src="'+PICTURE_ARROW_LEFT+'" class="eos-calendar-arrow-size"/></td>';
        str += '                    <td align="center"style="width:41px">';
        str += '                        <input maxLength="2" id="_eos_calendar_month"class="eos-calendar-editor-date" onmouseover="eventManager.stopPropagation();" onmousedown="eventManager.stopPropagation();this.select();" onclick="eventManager.stopPropagation();this.select();" onmouseup="eventManager.stopPropagation();this.select();" type="text" style="width:35px;padding-left:9;height:20px" /></td>';
        str += '                    <td style="width: 9px">';
        str += '                        <img style="cursor:hand;cursor:pointer;" id="_eos_calendar_next_month" alt="" src="'+PICTURE_ARROW_RIGHT+'" class="eos-calendar-arrow-size"/></td>';
        str += '                    <td>&nbsp;</td>';
        str += '                </tr>';
        str += '            </table>';
        str += '            </div>';
        str += '            </td>';
        str += '        </tr>';
        str += '        <tr>';
        str += '            <td style="height: 144px"><div style="height: 144px">';
                str += '            <table  style="width:'+(isIE?'100%':'228px')+';height:24px" cellspacing="0" cellpadding="0">';
        str += '                ';
        str += '                <tr>';
        str += '                    <td style="width: '+(isIE?'31':'33')+'px; height: 24px" class="eos-calendar-editor-week-left">'+CALENDAR_SUNDAY+'</td>';
        str += '                    <td style="width: '+(isIE?'31':'32')+'px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_MONDAY+'</td>';
        str += '                    <td style="width: '+(isIE?'31':'33')+'px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_TUESDAY+'</td>';
        str += '                    <td style="width: 31px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_WEDNESDAY+'</td>';
        str += '                    <td style="width: 31px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_THURSDAY+'</td>';
        str += '                    <td style="width: 31px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_FRIDAY+'</td>';
        str += '                    <td style="width: '+(isIE?'32':'33')+'px; height: 24px" class="eos-calendar-editor-week-right">'+CALENDAR_SATURDAY+'</td>';
        str += '                </tr>';
        str += '                </table>';
        str += '            <table id="_eos_calendar_editor_body" style="width:224;height:120px;table-layout:fixed" cellspacing="0" cellpadding="0" class="eos-calendar-editor-body">';
       /* str += '                <thead>';
        str += '                <tr>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_SUNDAY+'</td>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_MONDAY+'</td>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_TUESDAY+'</td>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_WEDNESDAY+'</td>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_THURSDAY+'</td>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_FRIDAY+'</td>';
        str += '                    <td style="width: 32px; height: 24px" class="eos-calendar-editor-week">'+CALENDAR_SATURDAY+'</td>';
        str += '                </tr>';
        str += '                </thead>';*/
        if(isIE)
        {
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day0" style="width: 32px; height: 18px" >25</td>';
        str += '                    <td id="_eos_calendar_day1" style="width: 32px; height: 18px" >26</td>';
        str += '                    <td id="_eos_calendar_day2" style="width: 32px; height: 18px" >27</td>';
        str += '                    <td id="_eos_calendar_day3" style="width: 32px; height: 18px" >28</td>';
        str += '                    <td id="_eos_calendar_day4" style="width: 32px; height: 18px" >29</td>';
        str += '                    <td id="_eos_calendar_day5" style="width: 32px; height: 18px" >30</td>';
        str += '                    <td id="_eos_calendar_day6" style="width: 32px; height: 18px" >1</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day7" style="width: 32px; height: 18px" >2</td>';
        str += '                    <td id="_eos_calendar_day8" style="width: 32px; height: 18px" >3</td>';
        str += '                    <td id="_eos_calendar_day9" style="width: 32px; height: 18px" >4</td>';
        str += '                    <td id="_eos_calendar_day10" style="width: 32px; height: 18px" >5</td>';
        str += '                    <td id="_eos_calendar_day11" style="width: 32px; height: 18px" >6</td>';
        str += '                    <td id="_eos_calendar_day12" style="width: 32px; height: 18px" >7</td>';
        str += '                    <td id="_eos_calendar_day13" style="width: 32px; height: 18px" >8</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day14" style="width: 32px; height: 18px" >9</td>';
        str += '                    <td id="_eos_calendar_day15" style="width: 32px; height: 18px" >10</td>';
        str += '                    <td id="_eos_calendar_day16" style="width: 32px; height: 18px" >11</td>';
        str += '                    <td id="_eos_calendar_day17" style="width: 32px; height: 18px" >12</td>';
        str += '                    <td id="_eos_calendar_day18" style="width: 32px; height: 18px" >13</td>';
        str += '                    <td id="_eos_calendar_day19" style="width: 32px; height: 18px" >14</td>';
        str += '                    <td id="_eos_calendar_day20" style="width: 32px; height: 18px" >15</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day21" style="width: 32px; height: 18px" >16</td>';
        str += '                    <td id="_eos_calendar_day22" style="width: 32px; height: 18px" >17</td>';
        str += '                    <td id="_eos_calendar_day23" style="width: 32px; height: 18px" >18</td>';
        str += '                    <td id="_eos_calendar_day24" style="width: 32px; height: 18px" >19</td>';
        str += '                    <td id="_eos_calendar_day25" style="width: 32px; height: 18px" >20</td>';
        str += '                    <td id="_eos_calendar_day26" style="width: 32px; height: 18px" >21</td>';
        str += '                    <td id="_eos_calendar_day27" style="width: 32px; height: 18px" >22</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day28" style="width: 32px; height: 18px" >23</td>';
        str += '                    <td id="_eos_calendar_day29" style="width: 32px; height: 18px" >24</td>';
        str += '                    <td id="_eos_calendar_day30" style="width: 32px; height: 18px" >25</td>';
        str += '                    <td id="_eos_calendar_day31" style="width: 32px; height: 18px" >26</td>';
        str += '                    <td id="_eos_calendar_day32" style="width: 32px; height: 18px" >27</td>';
        str += '                    <td id="_eos_calendar_day33" style="width: 32px; height: 18px" >28</td>';
        str += '                    <td id="_eos_calendar_day34" style="width: 32px; height: 18px" >29</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day35" style="width: 32px; height: 18px" >30</td>';
        str += '                    <td id="_eos_calendar_day36" style="width: 32px; height: 18px" >1</td>';
        str += '                    <td id="_eos_calendar_day37" style="width: 32px; height: 18px" >2</td>';
        str += '                    <td id="_eos_calendar_day38" style="width: 32px; height: 18px" >3</td>';
        str += '                    <td id="_eos_calendar_day39" style="width: 32px; height: 18px" >4</td>';
        str += '                    <td id="_eos_calendar_day40" style="width: 32px; height: 18px" >5</td>';
        str += '                    <td id="_eos_calendar_day41" style="width: 32px; height: 18px" >6</td>';
        str += '                </tr>';
        }
        else
              {
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day0" style="width: 32px; height: 18px" >25</td>';
        str += '                    <td id="_eos_calendar_day1" style="width: 32px; height: 18px" >26</td>';
        str += '                    <td id="_eos_calendar_day2" style="width: 32px; height: 18px" >27</td>';
        str += '                    <td id="_eos_calendar_day3" style="width: 31px; height: 18px" >28</td>';
        str += '                    <td id="_eos_calendar_day4" style="width: 31px; height: 18px" >29</td>';
        str += '                    <td id="_eos_calendar_day5" style="width: 31px; height: 18px" >30</td>';
        str += '                    <td id="_eos_calendar_day6" style="width: 31px; height: 18px" >1</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day7" style="width: 32px; height: 18px" >2</td>';
        str += '                    <td id="_eos_calendar_day8" style="width: 32px; height: 18px" >3</td>';
        str += '                    <td id="_eos_calendar_day9" style="width: 32px; height: 18px" >4</td>';
        str += '                    <td id="_eos_calendar_day10" style="width: 31px; height: 18px" >5</td>';
        str += '                    <td id="_eos_calendar_day11" style="width: 31px; height: 18px" >6</td>';
        str += '                    <td id="_eos_calendar_day12" style="width: 31px; height: 18px" >7</td>';
        str += '                    <td id="_eos_calendar_day13" style="width: 31px; height: 18px" >8</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day14" style="width: 32px; height: 18px" >9</td>';
        str += '                    <td id="_eos_calendar_day15" style="width: 32px; height: 18px" >10</td>';
        str += '                    <td id="_eos_calendar_day16" style="width: 32px; height: 18px" >11</td>';
        str += '                    <td id="_eos_calendar_day17" style="width: 31px; height: 18px" >12</td>';
        str += '                    <td id="_eos_calendar_day18" style="width: 31px; height: 18px" >13</td>';
        str += '                    <td id="_eos_calendar_day19" style="width: 31px; height: 18px" >14</td>';
        str += '                    <td id="_eos_calendar_day20" style="width: 31px; height: 18px" >15</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day21" style="width: 32px; height: 18px" >16</td>';
        str += '                    <td id="_eos_calendar_day22" style="width: 32px; height: 18px" >17</td>';
        str += '                    <td id="_eos_calendar_day23" style="width: 32px; height: 18px" >18</td>';
        str += '                    <td id="_eos_calendar_day24" style="width: 31px; height: 18px" >19</td>';
        str += '                    <td id="_eos_calendar_day25" style="width: 31px; height: 18px" >20</td>';
        str += '                    <td id="_eos_calendar_day26" style="width: 31px; height: 18px" >21</td>';
        str += '                    <td id="_eos_calendar_day27" style="width: 31px; height: 18px" >22</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day28" style="width: 32px; height: 18px" >23</td>';
        str += '                    <td id="_eos_calendar_day29" style="width: 32px; height: 18px" >24</td>';
        str += '                    <td id="_eos_calendar_day30" style="width: 32px; height: 18px" >25</td>';
        str += '                    <td id="_eos_calendar_day31" style="width: 31px; height: 18px" >26</td>';
        str += '                    <td id="_eos_calendar_day32" style="width: 31px; height: 18px" >27</td>';
        str += '                    <td id="_eos_calendar_day33" style="width: 31px; height: 18px" >28</td>';
        str += '                    <td id="_eos_calendar_day34" style="width: 31px; height: 18px" >29</td>';
        str += '                </tr>';
        str += '                <tr>';
        str += '                    <td id="_eos_calendar_day35" style="width: 32px; height: 18px" >30</td>';
        str += '                    <td id="_eos_calendar_day36" style="width: 32px; height: 18px" >1</td>';
        str += '                    <td id="_eos_calendar_day37" style="width: 32px; height: 18px" >2</td>';
        str += '                    <td id="_eos_calendar_day38" style="width: 31px; height: 18px" >3</td>';
        str += '                    <td id="_eos_calendar_day39" style="width: 31px; height: 18px" >4</td>';
        str += '                    <td id="_eos_calendar_day40" style="width: 31px; height: 18px" >5</td>';
        str += '                    <td id="_eos_calendar_day41" style="width: 31px; height: 18px" >6</td>';
        str += '                </tr>';
        }
        str += '            </table>';
        str += '            </div></td>';
        str += '        </tr>';
        str += '        <tr id="_eos_calendar_time_container">';
        str += '            <td style="height: 26px" align="left" class="eos-calendar-time">';
        str += '              <table cellspacing="0" cellpadding="0" border="0"><tr><td width="150px"><div style="float:left" align="left" id="_eos_calendar_time_editor_container"></div></td>';
        str += '              <td align="right">';
        
        str += '              </td></tr></table>';
        str += '            </td>';
        str += '        </tr>';
        str += '        <tr>';
        str += '            <td class="eos-calendar-bottom" style="height: 30px" align="right">';
        str += '<div  id="_eos_calendar_ok" class="eos-button" onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner" style="display:inline">&nbsp&nbsp'+CALENDAR_BUTTON_OK+'&nbsp&nbsp</div></div>&nbsp;';
        str += '<div  id="_eos_calendar_today" class="eos-button" onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner"  style="display:inline">&nbsp&nbsp'+CALENDAR_TODAY+'&nbsp&nbsp</div></div>&nbsp;';
        str += '<div  id="_eos_calendar_clear" class="eos-button" onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner"  style="display:inline">&nbsp&nbsp'+CLEAR+'&nbsp&nbsp</div></div>';
        str += '            </td>';
        str += '        </tr>';
        str += '    </table>';
        str += '    </div>';
        str += '</div>';
        var div=$create("div",CalendarEditor.doc);
        div.onmousedown = function(){
        	eventManager.stopPropagation();
        }
		div.style.height = "222px";
		div.style.width = "228px";
		div.style.position = "absolute";
        div.id="_eos_webcomp_calendar_container";
        div.innerHTML=str;


        div.style.display="none";
        CalendarEditor.container=div;
        function initCalendarEditorDiv(){
	        CalendarEditor.doc.body.appendChild(div);
	        CalendarEditor.container.onkeydown = function(){
	        	var keycode = eventManager.getKeyCode();
	        	if(keycode==13){
	        		if(CalendarEditor.showTime){
			        	CalendarEditor.onOk();
	        		}	
	        	}
	        	if(keycode==27){
	        		CalendarEditor.hideEditor();
	        	}
	        }
        }
        try{
        	initCalendarEditorDiv();
        }catch(e){
        	CalendarEditor.win.eventManager.add(window,"load",initCalendarEditorDiv);
        }
        if(document!=CalendarEditor.doc){
            moveCss(document,CalendarEditor.doc);
        }
		if (CalendarEditor.win["createTimeSelect"]){
			var time = CalendarEditor.win["createTimeSelect"]("_eos_calendar_time_editor");
			CalendarEditor.setTimeSelect(time);
			time.init();
		}


    }
	CalendarEditor.okBtn = $id("_eos_calendar_ok",CalendarEditor.doc);
	CalendarEditor.okBtn.onclick = CalendarEditor.onOk;
	CalendarEditor.lastYear = $id("_eos_calendar_last_year",CalendarEditor.doc);
	CalendarEditor.nextYear = $id("_eos_calendar_next_year",CalendarEditor.doc);
	CalendarEditor.year = $id("_eos_calendar_year",CalendarEditor.doc);
	CalendarEditor.month = $id("_eos_calendar_month",CalendarEditor.doc);
	CalendarEditor.lastMonth = $id("_eos_calendar_last_month",CalendarEditor.doc);
	CalendarEditor.nextMonth = $id("_eos_calendar_next_month",CalendarEditor.doc);
	CalendarEditor.today = $id("_eos_calendar_today",CalendarEditor.doc);
	CalendarEditor.clear = $id("_eos_calendar_clear",CalendarEditor.doc);
	CalendarEditor.body = $id("_eos_calendar_editor_body",CalendarEditor.doc);
	CalendarEditor.timeContainer = $id("_eos_calendar_time_container",CalendarEditor.doc);
	CalendarEditor.timeSelect = CalendarEditor.getTimeSelect();
	
	CalendarEditor.lastYear.onmouseover=function()
	                                      {
	                                      this.src=PICTURE_ARROW_LEFT_OVER
	                                      };
	CalendarEditor.lastYear.onmouseout=function()
	                                      {this.src=PICTURE_ARROW_LEFT};
	                                      
	                                      
	CalendarEditor.nextYear.onmouseover=function()
	                                      {
	                                      this.src=PICTURE_ARROW_RIGHT_OVER;
	                                      };
	CalendarEditor.nextYear.onmouseout=function()
	                                      {this.src=PICTURE_ARROW_RIGHT};
	                                      
	CalendarEditor.lastMonth.onmouseover=function()
	                                      {
	                                      this.src=PICTURE_ARROW_LEFT_OVER
	                                      };
	CalendarEditor.lastMonth.onmouseout=function()
	                                      {this.src=PICTURE_ARROW_LEFT};
	                                      
	                                      
	CalendarEditor.nextMonth.onmouseover=function()
	                                      {
	                                      this.src=PICTURE_ARROW_RIGHT_OVER;
	                                      };
	CalendarEditor.nextMonth.onmouseout=function()
	                                      {this.src=PICTURE_ARROW_RIGHT};                                      
	                                      
	                                                                            
	
    if(isFF)
    { 
     buttonForFF(CalendarEditor.okBtn);
     buttonForFF(CalendarEditor.today);
     buttonForFF(CalendarEditor.clear);
     
    }
}

//在window载入的时候调用事件
//if(document.readyState=="complete"){
//	CalendarEditor.init();
//}else{
//	eventManager.add(window,"load",CalendarEditor.init);
//}
function calendarUnload(){
	try{
		CalendarEditor.hideEditor();
	}catch(e){
		var calendar = $id("_eos_webcomp_calendar_container",CalendarEditor.doc);
		calendar.style.display = "none";
	}
}
eventManager.add(window,"unload",calendarUnload);
/**
 * 初始化日历编辑器的事件
 */
CalendarEditor.initEvent=function (){

}
/**
 * 为编辑器设置时间选择控件
 * @param {Object} time
 */
CalendarEditor.setTimeSelect = function(time){
	CalendarEditor.win["_eos_calendar_time_select"] = time;
}
/**
 * 获得时间录入控件
 */
CalendarEditor.getTimeSelect = function(){
	return CalendarEditor.win["_eos_calendar_time_select"];
}
/**
 * 显示editor的方法，判断是否有时间，如果有时间则显示时间
 */

CalendarEditor.showEditor=function (){
	/*var bak_cal = CalendarEditor.getCalendar();
	if(bak_cal){
		try{
			bak_cal.hide();
		}catch(e){}
	}*/
	if(CalendarEditor.showTime){
		CalendarEditor.timeContainer.style.display = "";
		CalendarEditor.okBtn.style.display = "";
		if(isFF)
		{
		CalendarEditor.container.style.height="226px";
		CalendarEditor.container.firstChild.style.height="226px"
		}
		
	}else{
		CalendarEditor.timeContainer.style.display = "none";
		CalendarEditor.okBtn.style.display = "none";
		if(isFF)
		{
		CalendarEditor.container.style.height="200px";
		CalendarEditor.container.firstChild.style.height="200px"
		}
	}
	CalendarEditor.initCalendarEvent();
	CalendarEditor.freshDate(CalendarEditor.value);
	CalendarEditor.freshTimeComp();
	CalendarEditor.showStatus = true;
	/*fx_fadeIn(CalendarEditor.container,function(){
	    CalendarEditor.container.style.display="";
	},150);*/
	 CalendarEditor.container.style.display="";
       if(isIE)
        {
	    var calendarIframe= $id("calendarIframe",CalendarEditor.doc);
        calendarIframe.style.width=calendarIframe.nextSibling.offsetWidth
        calendarIframe.style.height=calendarIframe.nextSibling.offsetHeight;
        calendarIframe.style.top=calendarIframe.nextSibling.offsetTop;
        calendarIframe.style.left=calendarIframe.nextSibling.offsetLeft;
	   }
	 var shadowPanel=$id("_eos_calendar_editor_container",CalendarEditor.doc);
	 initShadow(shadowPanel,CalendarEditor.doc);
	/* setTimeout(
	       function(){initShadow(shadowPanel,CalendarEditor.doc)}
	       ,1)*/
	 
}
/**
 * 初始化事件的方法
 */

CalendarEditor.initCalendarEvent = function(){
	CalendarEditor.lastYear.onclick = function(){
		CalendarEditor.changeYear(CalendarEditor.year.value-1);
	}
	CalendarEditor.nextYear.onclick = function(){
		CalendarEditor.changeYear(CalendarEditor.year.value*1+1);
	}
	CalendarEditor.year.onkeyup = function(){
		CalendarEditor.changeYear(CalendarEditor.year.value);
	}
	CalendarEditor.year.onblur = function(){
		CalendarEditor.changeYear(CalendarEditor.year.value);
	}
	CalendarEditor.month.onkeyup = function(){
		CalendarEditor.changeMonth(CalendarEditor.month.value);
	}
	CalendarEditor.month.onblur = function(){
		CalendarEditor.changeMonth(CalendarEditor.month.value);
	}
	CalendarEditor.lastMonth.onclick = function(){
		CalendarEditor.changeMonth(dateToStringValue(CalendarEditor.month.value-1));
	}
	CalendarEditor.nextMonth.onclick = function(){
		CalendarEditor.changeMonth(dateToStringValue(CalendarEditor.month.value*1+1));
	}
	CalendarEditor.today.onclick = function(){
		CalendarEditor.returnValue(new Date());
	}
	CalendarEditor.clear.onclick = function(){
	    var calendar=CalendarEditor.getCalendar();
	    if(calendar){
			//calendar.setDisplayValue("");
	        calendar.inputObject.value = "";
			calendar.hiddenObject.value = "";
			calendar.value = null;
	    }
	    CalendarEditor.hideEditor();
	}
}
/**
 * 隐藏日历编辑器的方法
 */
CalendarEditor.hideEditor=function (){
	if(CalendarEditor.container){
		/*fx_fadeOut(CalendarEditor.container,function(){
		    CalendarEditor.container.style.display="none";
		},200);*/
		CalendarEditor.container.style.display="none";
		CalendarEditor.showStatus = false;
	}
}

/**
 * 设置日历编辑器的位置，由于是跨iframe的，所以位置比较重要
 * @param {Object} left
 * @param {Object} topx
 * @param {Object} width
 * @param {Object} height
 */
CalendarEditor.setPosition=function (left,topx,width,height){
	CalendarEditor.container.style.position = "absolute";
	var maxZindex = getMaxZindex(CalendarEditor.doc);
	if(CalendarEditor.container.style.zIndex!=maxZindex){
		CalendarEditor.container.style.zIndex = maxZindex;
	}
	//CalendarEditor.container.style.top = "0px";
	//CalendarEditor.container.style.left = "0px";
	var cHeight = CalendarEditor.container.offsetHeight;
	var cWidth = CalendarEditor.container.offsetWidth;
	var bodyClientHeight = CalendarEditor.doc.body.clientHeight;// + CalendarEditor.doc.body.scrollTop;
	var bodyClientWidth = CalendarEditor.doc.body.clientWidth;
	var bodyHeight = bodyClientHeight + CalendarEditor.doc.body.scrollTop;
	var bodyWidth = bodyClientWidth + CalendarEditor.doc.body.scrollLeft;
	
	
	if(cHeight>=bodyClientHeight){
		topx = CalendarEditor.doc.body.scrollTop;
	}else{
		if((topx + cHeight)>bodyHeight){
			topx = bodyHeight - cHeight;
		}
	}
	if(cWidth>=bodyClientWidth){
		left = CalendarEditor.doc.body.scrollLeft;
	}else{
		if((left + cWidth) > bodyWidth){
			left = bodyWidth - cWidth;
		}
	}
	if (window.isGecko) {
		topx=topx-4;
	}
	CalendarEditor.container.style.left = left;
	CalendarEditor.container.style.top = topx;
	
	
	
	//setElementXY(CalendarEditor.container,[left,topx]);
}
/**
 * 重新刷新编辑器的方法，主要传入最大值，最小值，格式等
 * @param {Object} obj
 */
CalendarEditor.reFreshEditor=function (obj){
    CalendarEditor.maxValue=obj.maxValue;
    CalendarEditor.minValue=obj.minValue;
    CalendarEditor.format=obj.format;
    CalendarEditor.value=obj.value;
    CalendarEditor.showTime=obj.showTime;
}
/**
 * 设置当前的日历控件是哪一个
 * @param {Object} obj
 */
CalendarEditor.setCurrEditor=function (obj){
    CalendarEditor.win["_eos_curr_calendar"]=obj;
}
/**
 * 获得当前日历控件
 * @param {Object} obj
 */
CalendarEditor.getCalendar=function (obj){
    return CalendarEditor.win["_eos_curr_calendar"];
}
/**
 * 返回设定的最大年.
 * @return 返回maxValue的最大年.
 */
CalendarEditor.getMaxYear=function (){
    if(isDate(CalendarEditor.maxValue,CalendarEditor.format)){
        var _date=stringToDate(CalendarEditor.maxValue,CalendarEditor.format);
        return _date.getFullYear();
    }
    return CalendarEditor.MAX_YEAR;
}
/**
 * 返回设定的最大月.
 * @return 返回maxValue的最大月.
 */
CalendarEditor.getMaxMonth=function (){
    if(isDate(CalendarEditor.maxValue,CalendarEditor.format)){
        var _date=stringToDate(CalendarEditor.maxValue,CalendarEditor.format);
        return _date.getMonth();
    }
    return 11;
}
/**
 * 返回设定的最大月.
 * @return 返回maxValue的最大日.
 */
CalendarEditor.getMaxDay=function (){
    if(isDate(CalendarEditor.maxValue,CalendarEditor.format)){
        var _date=stringToDate(CalendarEditor.maxValue,CalendarEditor.format);
        return _date.getDate();
    }
    return 31;
}
/**
 * 返回设定的最小年.
 * @return 返回maxValue的最小年.
 */
CalendarEditor.getMinYear=function (){
    if(isDate(CalendarEditor.minValue,CalendarEditor.format)){
        var _date=stringToDate(CalendarEditor.minValue,CalendarEditor.format);
        return _date.getFullYear();
    }
    return CalendarEditor.MIN_YEAR;
}
/**
 * 返回设定的最小月.
 * @return 返回maxValue的最小月.
 */
CalendarEditor.getMinMonth=function (){
    if(isDate(CalendarEditor.minValue,CalendarEditor.format)){
        var _date=stringToDate(CalendarEditor.minValue,CalendarEditor.format);
        return _date.getMonth();
    }
    return 0;
}
/**
 * 返回设定的最小日.
 * @return 返回maxValue的最小日.
 */
CalendarEditor.getMinDay=function (){
    if(isDate(CalendarEditor.minValue,CalendarEditor.format)){
        var _date=stringToDate(CalendarEditor.minValue,CalendarEditor.format);
        return _date.getDate();
    }
    return 1;
}
/**
 * 判断是否是周末.如果是周末则会将文字显示为红色.
 * @param {Object} year
 * @param {Object} month
 * @param {Object} date
 */
CalendarEditor.isHoliday=function (year,month,date)
{
    var _date=new Date(year,month,date);
    _date.setFullYear(year);
    return (_date.getDay()==6||_date.getDay()==0);
};
/**
 * 刷新时间控件
 */
CalendarEditor.freshTimeComp=function (){
    if(!CalendarEditor.showTime){
        return ;
    }
    var hour=CalendarEditor.value.getHours();
    var minute=CalendarEditor.value.getMinutes();
    var second=CalendarEditor.value.getSeconds();
    CalendarEditor.timeSelect.setHours(hour);
    CalendarEditor.timeSelect.setMinutes(minute);
    CalendarEditor.timeSelect.setSeconds(second);
}
/**
 * 刷新日历控件的时间，如果显示时间则将时分秒分别设进date
 * @param {Object} date
 */
CalendarEditor.refreshTime=function (date){
    if(CalendarEditor.showTime){
        date.setHours(CalendarEditor.timeSelect.getHours())
        date.setMinutes(CalendarEditor.timeSelect.getMinutes())
        date.setSeconds(CalendarEditor.timeSelect.getSeconds())
    }
    return date;
}
/**
 * 刷新头部的年，月
 */
CalendarEditor.freshHeader=function (){
    CalendarEditor.month.value=dateToStringValue(CalendarEditor.value.getMonth()+1);
    CalendarEditor.year.value=CalendarEditor.value.getFullYear();
}
/**
 * 改变月的值
 * @param {Object} month
 */
CalendarEditor.changeMonth=function (month){
    if(isNaN(month)){
        return ;
    }
    if(month==""){
        return ;
    }
    if(month.length!=2){
        return ;
    }
    month=month-1;
    var maxMonth=CalendarEditor.getMaxMonth();
    var minMonth=CalendarEditor.getMinMonth();
    //month=parseInt(month);
    var _year=CalendarEditor.value.getFullYear();
    var maxYear=CalendarEditor.getMaxYear();
    var minYear=CalendarEditor.getMinYear();
    
    if(month>maxMonth&&_year==maxYear){
        month=maxMonth;
    }
    
    if(month<minMonth&&_year==minYear){
        month=minMonth;
    }

	
    var _date=CalendarEditor.value.getDate();
	var maxDay= new Date(_year, month+1, 0).getDate(); 
	_date=_date>maxDay?maxDay:_date;
    var date=new Date(_year,month,_date);
    date.setFullYear(_year);
    date=CalendarEditor.refreshTime(date);
    CalendarEditor.freshDate(dateToString(date,CalendarEditor.format));
}
/**
 * 改变年的值
 * @param {Object} year
 */
CalendarEditor.changeYear=function (year){
    if(isNaN(year)){
        return ;
    }
    if(year.length<=3){
        return ;
    }
    var maxYear=CalendarEditor.getMaxYear();
    var minYear=CalendarEditor.getMinYear();
    if(year>maxYear){
        year=maxYear;
    }
    if(year<minYear){
        year=minYear;
    }
    var _month=CalendarEditor.value.getMonth();
    var _date=CalendarEditor.value.getDate();
    if(_month==1&&_date==29){
    	if(year%4!=0){
	    	_date = 28;
    	}
    }
    var date=new Date(year,_month,_date);
    date.setFullYear(year);
    date=CalendarEditor.refreshTime(date);
    CalendarEditor.freshDate(dateToString(date,CalendarEditor.format));
}
/**
 * 单击事件，调用返回值函数
 * @param {Object} obj
 */
CalendarEditor.onClick=function (obj){
    if(obj.innerHTML!=""){
        var _date=obj.value;
        if(CalendarEditor.showTime){
        	if(CalendarEditor.currCell){
        		removeClass(CalendarEditor.currCell,"eos-calendar-editor-currday");
        	}
        	addClass(obj,"eos-calendar-editor-currday");
        	CalendarEditor.currCell = obj;
			CalendarEditor.value = _date;     
	        CalendarEditor.returnValue(_date);   
        }else{
	        CalendarEditor.returnValue(_date);
        }
    }
}
/**
 *点击确定时触发的事件.
 */
CalendarEditor.onOk=function (){
	if(CalendarEditor.value!=null){
		CalendarEditor.returnValue(CalendarEditor.value);
	}	
}

CalendarEditor.outClick=function (obj){
	try{
	    CalendarEditor.hideEditor();
	}catch(e){}
}
/**
 * 先校验，再找到当前的日历控件，返回
 * @param {Object} _date
 */
CalendarEditor.returnValue = function(_date){

    _date=CalendarEditor.refreshTime(_date);
	if(isDate(CalendarEditor.maxValue,CalendarEditor.format)){
       var maxDate=stringToDate(CalendarEditor.maxValue,CalendarEditor.format);
       if(_date-maxDate>0){
          //_date=maxDate;
          return;
       }
    }
    if(isDate(CalendarEditor.minValue,CalendarEditor.format)){
        var minDate=stringToDate(CalendarEditor.minValue,CalendarEditor.format);
        if(_date-minDate<0){
            //_date=minDate;
            return;
        }
    }
    var calendar=CalendarEditor.getCalendar();
    if(calendar){
        calendar.setValue(_date);
        if(calendar.onSelectFunc){
			try{
				eval(calendar.onSelectFunc + "(_date);");

			}catch(e){
				alert(e)
			}
		}
      calendar.validate();
				
    }
    
    CalendarEditor.hideEditor();
}
CalendarEditor.hideTime = function(){

}
CalendarEditor.isShow = function(){
	return CalendarEditor.showStatus;
}
/**
     * 为日历控件绑定到日期的方法.
     * @param {Object} date
     */
CalendarEditor.freshDate=function (date)
{
    var _monthDays=new Array(31,30,31,30,31,30,31,31,30,31,30,31);
    var _date=new Date();
    if(isDate(date,CalendarEditor.format)){
        _date=stringToDate(date,CalendarEditor.format);
    }
    var maxDate=null;
    var minDate=null;
    if(isDate(CalendarEditor.maxValue,CalendarEditor.format)){
        maxDate=stringToDate(CalendarEditor.maxValue,CalendarEditor.format);
        if(_date-maxDate>0){
            _date=maxDate;
        }
    }
    if(isDate(CalendarEditor.minValue,CalendarEditor.format)){
        minDate=stringToDate(CalendarEditor.minValue,CalendarEditor.format);
        if(_date-minDate<0){
            _date=minDate;
        }
    }
    CalendarEditor.value=_date;
    CalendarEditor.freshHeader();
    var _year=_date.getFullYear();
    var _month=_date.getMonth();
    var _day=1;
    var _startDay=new Date(_year,_month,1).getDay();
    var _previYear=_month==0?_year-1:_year;
    var _previMonth=_month==0?11:_month-1;
    var _previDay=_monthDays[_previMonth];
    if(_previMonth==1)_previDay=((_previYear%4==0)&&(_previYear%100!=0)||(_previYear%400==0))?29:28;
    _previDay-=_startDay-1;
    var _nextDay=1;
    _monthDays[1]=((_year%4==0)&&(_year%100!=0)||(_year%400==0))?29:28;
    //var calendar = this;
    for(i=0;i<42;i++)
    {
        var _dayElement=$id("_eos_calendar_day" + i,CalendarEditor.doc);
        _dayElement.onmouseover=function (){
            addClass(this,"eos-calendar-editor-overday");
        }
        _dayElement.onmouseout=function (){
            removeClass(this,"eos-calendar-editor-overday");
        }
        _dayElement.onclick=function (){
            CalendarEditor.onClick(this);
        }
		_dayElement.className="eos-calendar-editor-day";
        if(i<_startDay)
        {
            var _previDate=new Date(_year,_month-1,_previDay);
            _dayElement.innerHTML=_previDay;
            _dayElement.title=dateToString(_previDate,CALENDAR_DEFAULT_FORMAT);
            _dayElement.value=_previDate;
            //dateToString(_previDate,this.__privateFormat);
            _dayElement.className="eos-calendar-editor-moreday";
            _previDay++;
        }
        else if(_day>_monthDays[_month])
        {
            var _nextDate=new Date(_year,_month+1,_nextDay);
            _dayElement.innerHTML=_nextDay;
            _dayElement.title=dateToString(_nextDate,CALENDAR_DEFAULT_FORMAT);
            _dayElement.value=_nextDate;
            //dateToString(_nextDate,this.__privateFormat);
            _dayElement.className="eos-calendar-editor-moreday";
            _nextDay++;
        }
        else if(i>=new Date(_year,_month,1).getDay()&&_day<=_monthDays[_month])
        {
            var _curDate=new Date(_year,_month,_day);
            _curDate.setFullYear(_year);
            _dayElement.title=dateToString(_curDate,CALENDAR_DEFAULT_FORMAT);
            _dayElement.value=_curDate;
            _dayElement.innerHTML=_day;
            var today = new Date();
            var _cday = _dayElement.value;
            if(CalendarEditor.isHoliday(_year,_month,_day))
            {
                _dayElement.className= "eos-calendar-editor-holiday";
            }
            _day++;
        }
        else
        {
            _dayElement.innerHTML="";
            _dayElement.title="";
        }
        if(_dayElement.value){
        	var today = new Date();
        	if(_dayElement.value.getYear()==today.getYear()&&_dayElement.value.getMonth()==today.getMonth()&&_dayElement.value.getDate()==today.getDate())
            {
                //addClass(_dayElement,"eos-calendar-editor-overday");
                addClass(_dayElement,"eos-calendar-editor-today");
                //_dayElement.className= "eos-calendar-editor-today";
                _dayElement.onmouseover=null;
                _dayElement.onmouseout=null;
            }
            var currDay = CalendarEditor.value;
 			if(_dayElement.value.getYear()==currDay.getYear()&&_dayElement.value.getMonth()==currDay.getMonth()&&_dayElement.value.getDate()==currDay.getDate())
            {
                //_dayElement.className= "eos-calendar-editor-currday";
                addClass(_dayElement,"eos-calendar-editor-currday");
                CalendarEditor.currCell = _dayElement;
                _dayElement.onmouseover=null;
                _dayElement.onmouseout=null;
            }else{
           		removeClass(_dayElement,"eos-calendar-editor-currday");
            }
            var isOut=false;
            if(maxDate!=null){
                if(_dayElement.value-maxDate>0){
                    isOut=true;
                }
            }
            if(minDate!=null){
            	var tempDate = CalendarEditor.refreshTime(_dayElement.value);
                if(tempDate-minDate<0){
                    isOut=true;
                }
            }
            if(isOut){
                _dayElement.onclick=null;
                _dayElement.onmouseover=null;
                _dayElement.onmouseout=null;
                _dayElement.title="";
            }
        }
    }
};

/**
 * 创建一个timeSelect
 * @param {Object} id
 */
function createTimeSelect(id){
	var time = new TimeSelect(id);
	return time;
}

function f_check_calendar(obj){
	if(obj.id){
		var id = obj.id;
		if(id.indexOf("_input")>0){
			id = id.replace("_input","");
			var calendar = $id(id);
			if(calendar){
				return calendar.validate();
			}
		}
	}
	return true;
}