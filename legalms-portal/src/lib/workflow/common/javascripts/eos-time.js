/**
 * 时间选择控件的构造函数。该函数提供了默认的privateFormat为HH:mm:ss
 * @param {Object} id
 */
function TimeSelect(id){
	this.id = id;
	PageControl.add(this.id,this);
	this.name = null;
	this.hour = "00";
	this.minute = "00";
	this.second = "00";
	this.hourInput = null;
	this.minuteInput = null;
	this.secondInput = null;
	this.container = null;
	this.upButton = null;
	this.downButton = null;
	this.hiddenInput = null;
	this.dateTime = null;
	this.defaultValue = null;//dateToString(new Date(),"HH:mm:ss");
	this.__privateFormat = "HH:mm:ss";
	this.format = "HH:mm:ss";
	this.tabIndex = null;
	this.accesskey = null;
	this.currInput = null;
	this.BUTTON_UP_ID = "BUTTON_UP" + id;
	this.BUTTON_DOWN_ID = "BUTTON_DOWN" + id;
	this.INPUT_HOUR_ID = "INPUT_HOUR" + id;
	this.INPUT_MINUTE_ID = "INPUT_MINUTE" + id;
	this.INPUT_SECOND_ID = "INPUT_SECOND" + id;
	this.INPUT_HIDDEN_ID = "INPUT_HIDDEN" + id;
	this.maxValue = "23:59:59";
	this.minValue = "00:00:00";
	this.maxHour = 23;
	this.minHour = 0;
	this.maxMinute = 59;
	this.minMinute = 0;
	this.maxSecond = 59;
	this.minSecond = 0;
	this.readonly = false;
	this.isOver = false;
	this.disabled = false;
	this.allowNull = true;
}
/**
 * 设置时间录入控件是只读的
 * @param {Object} isReadonly
 */
TimeSelect.prototype.setReadOnly = function(isReadonly){
	this.readonly = isReadonly;
	if(isReadonly){
		this.hourInput.readOnly = true;
		this.minuteInput.readOnly = true;
		this.secondInput.readOnly = true;
	}else{
		this.hourInput.readOnly = false;
		this.minuteInput.readOnly = false;
		this.secondInput.readOnly = false;
	}
}
TimeSelect.prototype.getReadOnly=function()
{
  return this.readonly;
}
/**
 * 设置时间录入控件是disabled
 * @param {Object} isReadonly
 */
TimeSelect.prototype.setDisabled = function(isDisabled){
	this.disabled = isDisabled;
	if(isDisabled){
	    this.hiddenInput.disabled=true
		this.hourInput.disabled = true;
		this.minuteInput.disabled = true;
		this.secondInput.disabled = true;
	}else{
	    this.hiddenInput.disabled=false
		this.hourInput.disabled = false;
		this.minuteInput.disabled = false;
		this.secondInput.disabled = false;
	}
}
TimeSelect.prototype.getDisabled=function()
{
   return this.disabled;
}
/**
 * 初始化时间控件的函数.该函数向一个div中添加时间控件的html代码.
 */
TimeSelect.prototype.init = function(){
	var str = this.toHtml();
	var div = $create("div");
	div.innerHTML = str;
	this.container = $id(this.id + "_container");
	this.container.appendChild(div);
	this.container.className = "eos-time";
	this.container.onmouseover = function(){
		this.className = "eos-time-over";
		this.isOver = true;
	}
	this.container.onmouseout = function(){
		this.className = "eos-time";
		this.isOver = false;
	}
	this.container.onmousedown = function(){
		//eventManager.stopEvent();
	}
	/*if(!this.allowNull){
		this.defaultValue = this.defaultValue || dateToString(new Date(),"HH:mm:ss");
		if(!isFormatTime(this.defaultValue,this.format)){
			 alert(TIME_FORMAT_ERROR);
		}
	}
*/

	if(!this.defaultValue&&!this.defaultNull) this.defaultValue="00:00:00";
	if(this.defaultValue&&timeFormat(this.defaultValue,this.format)){
	       
		if(this.maxValue&&this.defaultValue>this.maxValue){
			this.defaultValue=this.maxValue;
		}
		if(this.minValue&&this.defaultValue<this.minValue){
			this.defaultValue=this.minValue;
		}
	}


	this.initObject();
	this.setReadOnly(this.readonly);
	this.setDisabled(this.disabled);
	this.currInput = null;

}
/**
 * 初始化时间控件的object的函数，该函数和init分离,
 * 主要是为了让Calendar调用，以生成日期时间选择控件.
 */
TimeSelect.prototype.initObject = function(){
	this.setCheckValue();
	this.hourInput = $id(this.INPUT_HOUR_ID);
	this.minuteInput = $id(this.INPUT_MINUTE_ID);
	this.secondInput = $id(this.INPUT_SECOND_ID);
	this.upButton = $id(this.BUTTON_UP_ID);
	this.downButton = $id(this.BUTTON_DOWN_ID);
	this.hiddenInput = $id(this.INPUT_HIDDEN_ID);
	var timeSelect = this;
	this.hourInput.onkeydown = function(){
		var Code = eventManager.getKeyCode();
		return timeSelect.downkeyCode(Code);
	}
	this.minuteInput.onkeydown = function(){
		var Code = eventManager.getKeyCode();
		return timeSelect.downkeyCode(Code);
	}
	this.secondInput.onkeydown = function(){
		var Code = eventManager.getKeyCode();
		return timeSelect.downkeyCode(Code);
	}
	this.setValue(this.defaultValue);
}
/**
 * 设置控件的边界检查值.
 */
TimeSelect.prototype.setCheckValue = function(){
	if(isFormatTime(this.maxValue,this.format)){
		this.maxValue = timeFormat(this.maxValue,this.format,this.__privateFormat);
	}
	if(!isFormatTime(this.maxValue,this.__privateFormat)){
		this.maxValue = "23:59:59";
	}
	var arrMax = this.maxValue.split(":");
	this.maxHour = arrMax[0];
	this.maxMinute= arrMax[1];
	this.maxSecond = arrMax[2];
	if(isFormatTime(this.minValue,this.format)){
		this.minValue = timeFormat(this.minValue,this.format,this.__privateFormat);
	}

	
	if(!isFormatTime(this.minValue,this.__privateFormat)){
		this.minValue = "00:00:00";
	}
	
	var arrMin = this.minValue.split(":");
	this.minHour = arrMin[0];
	this.minMinute= arrMin[1];
	this.minSecond = arrMin[2];

}
/**
 * 处理按键的代码，上下键将调整时间，tab,back则招待，可以输入0-9，其它忽略.
 * @param {Object} Code
 */
TimeSelect.prototype.downkeyCode = function(Code){
		if(Code==38){
			this.up();
			return false;
		}
		if(Code==40){
			this.down();
			return false;
		}
		if(Code==9||Code==8||Code==37||Code==39){
			return true;
		}
		if(Code==229){
			return false;
		}
		if(Code<106&&Code>95){
			return true;
		}
		if(Code==46){
			//this.clear();
			return true;
		}
		if (Code>47&&Code<58){
			return true;
		}else{
			return false;
		}
}
TimeSelect.prototype.clear = function(){
	if(this.allowNull){
		this.setValue(null);
	}
}

/**
 * 将选中的时间格向上移.
 */
TimeSelect.prototype.up = function(){
	if(this.readonly||this.disabled){
		return;
	}

	if(!this.currInput){
		this.currInput=this.secondInput;
		if(allTrim(this.hourInput.value)==""&&allTrim(this.minuteInput.value)=="")
		{
		this.hourInput.value="00";
		this.minuteInput.value="00"
		}
	}
		var num = this.currInput.value*1 + 1;
		this.currInput.value = dateToStringValue(num);
		this.prevent(this.currInput);
		this.currInput.focus();
		this.currInput.select();
}
/**
 * 将选中的时间格向下移.
 */
TimeSelect.prototype.down = function(){
	if(this.readonly||this.disabled){
		return;
	}
	$debug(this.currInput);
	if(!this.currInput){
	this.currInput=this.secondInput;
	if(this.hourInput.value==""&&this.minuteInput.value=="")
		{
		this.hourInput.value="00";
		this.minuteInput.value="00"
		}
	}
		var num = this.currInput.value*1 - 1;
		this.currInput.value = dateToStringValue(num);
		this.prevent(this.currInput);
		this.currInput.focus();
		this.currInput.select();
	
}
/**
 * 获得小时，主要被Calendar调用.
 */
TimeSelect.prototype.getHours = function(){
	this.refreshValue();
	return dateToStringValue(this.hourInput.value);
}
/**
 * 获得分钟,主要被Calendar调用.
 */
TimeSelect.prototype.getMinutes = function(){
	this.refreshValue();
	return dateToStringValue(this.minuteInput.value);
}
/**
 * 获得秒,主要被Calendar调用.
 */
TimeSelect.prototype.getSeconds = function(){
	this.refreshValue();
	return dateToStringValue(this.secondInput.value);
}
/**
 * 设置小时,主要被Calendar调用.
 * @param {Object} value
 */
TimeSelect.prototype.setHours = function(value){
	this.hourInput.value = dateToStringValue(value);
	this.refreshValue();
}
/**
 * 设置分,主要被Calendar调用.
 * @param {Object} value
 */
TimeSelect.prototype.setMinutes = function(value){
	this.minuteInput.value = dateToStringValue(value);
	this.refreshValue();
}
/**
 * 设置秒,主要被Calendar调用.
 * @param {Object} value
 */
TimeSelect.prototype.setSeconds = function(value){
	this.secondInput.value = dateToStringValue(value);
	this.refreshValue();
}
/**
 * 符合控件开发规范的函数.
 */
TimeSelect.prototype.getValue = function(){
	this.refreshValue();
	if(this.dateTime){
		return timeFormat(this.dateTime,this.__privateFormat,this.format);
	}else{
		return null;
	}
}
/**
 * 符合控件开发规范的函数.
 * @param {Object} value
 */
TimeSelect.prototype.setValue = function(value){
	if(value===null||value===undefined||value==""){
		//if(this.allowNull){
			this.dateTime = null;
		//}else{
			//this.dateTime = dateToString(new Date(),"HH:mm:ss");
		//}
	}else{
		this.dateTime = timeFormat(value,this.format,this.__privateFormat);
	}
	this.refresh();
}
/**
 * 符合控件开发规范的函数.设置小时获得焦点.
 */
TimeSelect.prototype.setFocus = function(){
	this.hourInput.focus();
}
/**
 * 符合控件开发规范的函数.失去焦点.
 */
TimeSelect.prototype.isFocus = function(){
	return this.isOver;
}
/**
 * 符合控件开发规范的函数.显示录入控件
 */
TimeSelect.prototype.showEditor = function(){
	this.container.style.display = "";
}
/**
 * 符合控件开发规范的函数.显示录入控件
 */
TimeSelect.prototype.hideEditor = function(){
	this.container.style.display = "none";
}
/**
 * 符合控件开发规范的函数,获得控件的显示值
 * @param {Object} value
 */
TimeSelect.prototype.getDisplayValue = function(value){
	return value;
}


/**
 * 符合控件开发规范的函数，设置控件位置
 * @param {Object} left
 * @param {Object} topx
 * @param {Object} width
 * @param {Object} height
 */
TimeSelect.prototype.setPosition = function(left,topx,width,height){
	if(this.container){
		this.container.style.position = "absolute";
		var maxZindex = getMaxZindex(document);
		if(this.container.style.zIndex!=maxZindex){
			this.container.style.zIndex = maxZindex;
		}
		setElementXY(this.container,[left,topx]);
	}
}
/**
 * 刷新输入框的时间的代码.
 */
TimeSelect.prototype.refresh = function(){
	if(this.dateTime){
		var arr = this.dateTime.split(":");
		arr[0] = arr[0]||"00";
		arr[1] = arr[1]||"00";
		arr[2] = arr[2]||"00";
		this.hourInput.value = arr[0];
		this.minuteInput.value = arr[1];
		this.secondInput.value = arr[2];
	}else{
		this.hourInput.value = "";
		this.minuteInput.value = "";
		this.secondInput.value = "";
	}
	this.refreshValue();
}
/**
 *刷新后台的值的代码.
 */
TimeSelect.prototype.refreshValue = function(){
	var hour = dateToStringValue(this.hourInput.value);
	var minute = dateToStringValue(this.minuteInput.value);
	var second = dateToStringValue(this.secondInput.value);
	if(hour&&minute&&second){
		this.dateTime = hour + ":" + minute + ":" + second;
		this.hiddenInput.value = this.dateTime;
	}
	/*else{
		this.dateTime = null;
		this.hiddenInput.value = "";
	}*/
}
/**
 * 时间选择控件的html代码.
 */
TimeSelect.prototype.toHtml = function(){
	var attrStr = 'tabIndex="' + this.tabIndex + '" accesskey="' + this.accesskey + '" ';
  	var sMinute_Common = attrStr + 'type="text" autocomplete="off" onpropertychange="$o(\''+this.id+'\').setForObjValue(this)"  maxlength="2" onclick="this.focus();this.select()" onfocus="$o(\'';
   	sMinute_Common += this.id+'\').Focus(this);" onkeyup="$o(\''+ this.id+'\').keyPress(this)"';
   	sMinute_Common += ' onpaste="return false" ondragenter="return false" onchange="$o(\'';
   	sMinute_Common += this.id+'\').setForObjValue(this)" onblur="$o(\''+ this.id+'\').Blur(this)"';
  var str = "";
	str += '<div id="'+this.id+'_time_container" class="eos-time-container" style="background-color:#ffffff;width: 91px;height:20px;float:left;overflow:hidden">';
	str += '<div style="font-size:11pt;float:left;width: 72px;height:20px;overflow:hidden;float:left;padding-top:1px;padding-buttom:3px;padding-left:3px;">';
	str += '<input numtype="h" id="' + this.INPUT_HOUR_ID + '"  ' + sMinute_Common + ' style="ime-mode:disabled;width:18px;height:14px;vertical-align:middle;background-color:transparent;border:0px solid black;font-size: 9pt;text-align: center;"><b>:</b>';
	str += '<input numtype="m" id="' + this.INPUT_MINUTE_ID + '"  ' + sMinute_Common + ' style="ime-mode:disabled;width:18px;height:14px;vertical-align:middle;background-color:transparent;border:0px solid black;font-size: 9pt;text-align: center;"><b>:</b>';
	str += '<input numtype="s" id="' + this.INPUT_SECOND_ID + '"  '+sMinute_Common+' style="ime-mode:disabled;width:18px;height:14px;vertical-align:middle;background-color:transparent;border:0px solid black;font-size: 9pt;text-align: center;">';
	str += '</div>';
	str += '<div style="width: 16px;height:20px;overflow:hidden;float:right;padding-top:0px;">';
	str += '<div style="width: 16px;height:9px;overflow:hidden;">';
	str += '<div onclick="$id(\'' + this.id+ '\').controlTime(true)" id="'+this.BUTTON_UP_ID+'" class="eos-time-arrow-up" onmouseover="this.className=\'eos-time-arrow-up-over\'" onmouseout="this.className=\'eos-time-arrow-up\'" style="width: 16px;height:10px;">';
	str += '</div>';
	str += '</div>';
	str += '<div style="width: 16px;height:9px;overflow:hidden;margin-top:1px;">';
	str += '<div onclick="$id(\'' + this.id+ '\').controlTime(false)" id="'+this.BUTTON_DOWN_ID+'" class="eos-time-arrow-down" onmouseover="this.className=\'eos-time-arrow-down-over\'" onmouseout="this.className=\'eos-time-arrow-down\'" style="width: 16px;height:10px;">';
	str += '</div>';
	str += '</div>';
	str += '</div>';
	str += '</div>';
  str += "<div><input validateAttr='type=eos_time'  type='hidden' ";
  if(this.name){
  	str +="name='"+this.name+"'";
  }
  str += "id='"+this.INPUT_HIDDEN_ID+"' value='"+this.dateTime+"'></div>";//开发时一般要将此处的style设为display:'none'
  return str;
}
/**
 * 键盘输入时间的事件
 * @param {Object} obj
 */
TimeSelect.prototype.keyPress = function(obj){
	if(obj.value.length==2){
		this.prevent(obj);
	}
}
/**
 * 离开文本框后需要校验一下
 * @param {Object} obj
 */
TimeSelect.prototype.Blur = function(obj){
    this.lostFocus=true;
    var timeObj=this;
    
    if(obj.value.length==2){
		this.prevent(obj);
	}else if(obj.value.length==1){
		obj.value = "0" + obj.value;
		this.prevent(obj);
	}
  
    window.tmpTimeout=setTimeout(
              function()
               {if(timeObj.lostFocus)timeObj.validate()}
               ,300);
               

}


TimeSelect.prototype.Focus = function(obj){
    this.currInput=obj;
    this.lostFocus=false;
}


/**
 * 符合控件开发规范的函数,验证控件的值
 */
TimeSelect.prototype.validate = function(){

     
     if(allTrim(this.hourInput.value+this.minuteInput.value+this.secondInput.value)=="")
     {
   		if(this.allowNull) 
	       {
	        f_alert_verify_successful($id(this.id+"_time_container"));
	        return true;
	       }
           else
             {
               f_alert($id(this.id+"_time_container"), CHECK_MUST_INPUT);
               return false;
             }
     }
	if(allTrim(this.hourInput.value)==""||allTrim(this.minuteInput.value)==""||allTrim(this.secondInput.value)=="")
	 { f_alert($id(this.id+"_time_container"),TIME_INPUTTIME+this.hourInput.value+":"+this.minuteInput.value+":"+this.secondInput.value+TIME_FORMATERROR);
	  return false;
     }
 
	if(parseInt(this.maxHour*3600+this.maxMinute*60+this.maxSecond)<parseInt(this.hourInput.value*3600+this.minuteInput.value*60+this.secondInput.value))
     {
     f_alert($id(this.id+"_time_container"),TIME_INPUTTIME+this.hourInput.value+":"+this.minuteInput.value+":"+this.secondInput.value+TIME_LESSTHAN+this.maxValue);
     return false;
     }
     
     if((this.minHour*3600+this.minMinute*60+this.minSecond)>(this.hourInput.value*3600+this.minuteInput.value*60+this.secondInput.value))
     {
     f_alert($id(this.id+"_time_container"),TIME_INPUTTIME+this.hourInput.value+":"+this.minuteInput.value+":"+this.secondInput.value+TIME_MORETHAN+this.minValue);
     return false;
     }
     f_alert_verify_successful($id(this.id+"_time_container"));
     return true;

}


/**
 * 对输入框进行验证，判断是否符合时间选择控件的值.
 * @param {Object} obj
 */
TimeSelect.prototype.prevent = function(obj){
	if(obj.value==""||obj.value===null||obj.value===undefined){
		return;
	}
	numtype = obj.getAttribute("numtype");
	if(numtype=="h"){
		if(obj.value*1>23){
			obj.value = "00";
		}else if(obj.value*1<0){
			obj.value = "23";
		}else if(isNaN(obj.value)){
			obj.value = "00";
		}
		/*if(obj.value*1-this.maxHour>0){
			obj.value =  dateToStringValue(this.maxHour);
		}
		if(obj.value*1- this.minHour<0){
			obj.value =  dateToStringValue(this.minHour);
		}*/
	}else if(numtype=="m"||numtype=="s"){
		if(obj.value*1>59){
			obj.value = "00";
		}else if(obj.value*1<0){
			obj.value = "59";
		}else if(isNaN(obj.value)){
			obj.value = "00";
		}
		/*if(numtype=="m"){
			if(obj.value*1-this.maxMinute>0&&this.hourInput.value*1-this.maxHour==0){
				obj.value =  dateToStringValue(this.maxMinute);
			}
			if(obj.value*1- this.minMinute<0&&this.hourInput.value*1-this.minHour==0){
				obj.value =  dateToStringValue(this.minMinute);
			}
		}
		if(numtype=="s"){
			if(obj.value*1-this.maxSecond>0&&this.hourInput.value*1-this.maxHour==0&&this.minuteInput.value*1-this.maxMinute==0){
				obj.value =  dateToStringValue(this.maxSecond);
			}
			if(obj.value*1- this.minSecond<0&&this.hourInput.value*1-this.minHour==0&&this.minuteInput.value*1-this.minMinute==0){
				obj.value =  dateToStringValue(this.minSecond);
			}
		}*/
	}
}
/**
 * onchange事件调用的函数，选检查值，再更新后台的值.
 * @param {Object} obj
 */
TimeSelect.prototype.setForObjValue = function(obj){
	this.prevent(obj);
	this.refreshValue();
}
/**
 * 用按纽控件时间时调用的函数，up为true时向上调，为false时向下调.
 * @param {Object} isUp
 */
TimeSelect.prototype.controlTime = function(isUp){
	if(isUp){
		this.up();
	}else{
		this.down();
	}
	this.refreshValue();
	this.validate();
}

function f_check_eos_time(obj){
	if(obj.id){
		var id = obj.id;
		if(id.indexOf("INPUT_HIDDEN")>=0){
			id = id.replace("INPUT_HIDDEN","");
			var time = $id(id);
			if(time){
				return time.validate();
			}
		}
	}
	return true;
}
