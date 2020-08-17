/**************************************************************************
 * *=================================================================
 *
 * Copyright (c) 2001-20XX Primeton Technologies, Ltd.
 * All rights reserved.
 *
 *@fileoverview 该文件提供日志系统,可以载获window的onerror事件,报出更详细的错误.
 *@version 1.0
 *@requires CrossBrowser.js,StringBuffer.js,eventManager.js
 *@author caozw (mailto:caozw@primeton.com)
***********************************************************************/
var EOSLOG_LEVEL = EOSLOG_LEVEL||"debug";
var EOSDEBUG = EOSDEBUG==undefined?false:EOSDEBUG;
/**
 * 空函数,如果是非debug模式则把$debug设置为空函数,提高性能.
 */
function escapeHTML(str){
	if(typeof(str)=="string"){
		return str.replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\t/g,"&nbsp;&nbsp;").replace(/\n/g,"<br>");
	}else{
		return str;
	}
}
/**
 * @class
 * EOSLog,它提供的全部是静态方法.用来记录日志及捕捉错主信息.
 */
if(typeof(EOSLog)!="function"){
	EOSLog = function(){};
	EOSLog.styles = new Array();//存放样式的数组.操作样式的style.display可以显示或隐藏不同级别的日志.
	EOSLog.messages = [];//存放日志信息的数组.
	EOSLog.ID = "EOS_LOG_CONSOLE";//日志面板的ID.
	EOSLog.BODY_ID = "EOS_LOG_CONSOLE_BODY";//日志容器的ID.
	EOSLog.BUTTONS_ID = "EOS_LOG_CONSOLE_BUTTONS";//日志操作控制层的ID.
	EOSLog.EVAL_ID = "EOS_LOG_EVAL_ID";
	EOSLog.EVAL_INPUT_ID = "EOS_LOG_EVAL_INPUT_ID";
	EOSLog.EVAL_RUN_ID = "EOS_LOG_EVAL_RUN_ID";
	EOSLog.EVAL_CLEAR_ID = "EOS_LOG_EVAL_CLEAR_ID";
	EOSLog.EVAL_SIGN_ID = "EVAL_SIGN_ID";
	EOSLog.EVAL_SIGN_SELECT_ID = "EVAL_SIGN_SELECT_ID";
	EOSLog.index = 0;//日志的输出索引.
	EOSLog.iDiffX = 0;//日志面板拖动时的X偏移量.
	EOSLog.iDiffY = 0;//日志面板拖动时的Y偏移量.
	EOSLog.hasOut = false;//是否已经输出日志面板.
	EOSLog.timeLog = new Array();//存放时间信息的日志.
	EOSLog.panel = null;
	EOSLog.topWin = window;
	EOSLog.doc = document;
}
/**
 * 记录日志的方法.
 * @private
 * @param {String} level
 * @param {String} message
 */
EOSLog.log = function(level,message){
	var time = new Date();
	EOSLog.messages.push({level:level,time:time,message:message,out:false});
	if(EOSLog.panel){
		EOSLog.refresh();
	}
}
/**
 * 刷新日志的方法.
 */
EOSLog.refresh = function(){
	if(EOSLog.panel){
		var i;
		for(i=EOSLog.index;i<EOSLog.messages.length;i++){
			EOSLog.print(EOSLog.messages[i]);
		}
		EOSLog.index = i==0?0:i-1;
	}
}
/**
 * 记录一般信息的函数.
 * @param {String} message
 */
EOSLog.info = function(message){
	EOSLog.log("info",escapeHTML(message));
}
/**
 * @private
 * 记录错误信息的函数.
 * @param {String} message
 */
EOSLog.error = function(message){
	EOSLog.log("error",escapeHTML(message));
}
/**
 * 记录调试信息的函数.
 * @param {String} message 要输出的调试信息.
 */
EOSLog.debug = function(message){
	EOSLog.log("debug",escapeHTML(message));
}
/**
 * 记录警告信息的函数.
 * @param {String} message 要输出的调试信息.
 */
EOSLog.warn = function(message){
	EOSLog.log("warn",escapeHTML(message));
}
/**
 * 处理try-cacth语句抛出的错误.将catch到的错误调用该方法.
 * @param {Error} err 抛出的错误.
 */
EOSLog.handle = function(err){

	var buffer = new StringBuffer();
	buffer.append(EOSLOG_ERROR_TYPE).append(err.name).append(".");
	buffer.append(EOSLOG_ERROR_INFO).append(err.message).append(".");
	if(err.number){
		buffer.append(EOSLOG_ERROR_CODE).append(err.number).append(".>");
	}
	if(err.fileName){
		buffer.append(EOSLOG_ERROR_URL).append(err.fileName).append(".");
	}
	if(err.lineNumber){
		buffer.append(EOSLOG_ERROR_LINE).append(err.lineNumber).append(".");
	}
	if(err.stack){
		buffer.append(EOSLOG_ERROR_STACK).append(err.stack.replace(/ /g,'&nbsp;').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;')).append("<br>");
	}
	if(err.description){
		buffer.append(EOSLOG_ERROR_DETAIL).append(err.description).append("<br>");
	}
	if(EOSLog.handle.caller&&EOSLog.handle.caller.caller){
		buffer.append(EOSLOG_ERROR_FUNCTION).append("<br>").append(EOSLog.handle.caller.caller.toString().replace(/ /g,'&nbsp;').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;')).append("<br>");
	}
	EOSLog.log("error",buffer.toString());
}
/**
 * 拦截 onerror对象,将错误信息输出到日志中.
 * @private
 * @param {Object} sMessage
 * @param {Object} sUrl
 * @param {Object} sLine
 */
window.onerror = function(sMessage,sUrl,sLine){
	if(EOSDEBUG){
		var buffer = new StringBuffer();
		if(isIE){
			try{
				var info = EOSLog.getDetailError(window.onerror.caller,sMessage,sUrl,sLine);
				buffer.append(EOSLOG_ERROR_INFO).append(info.sMessage).append("<br> ");
				buffer.append(EOSLOG_ERROR_URL).append(info.sUrl).append("<br> ");
				buffer.append(EOSLOG_ERROR_LINE).append(info.sLine).append("<br> ");
				buffer.append(EOSLOG_ERROR_FUNCTION).append("<br>").append(info.errFunc).append("<br>");
			}catch(e){
			}
		}else{
			buffer.append(EOSLOG_ERROR_INFO).append(sMessage).append("<br> ");
			buffer.append(EOSLOG_ERROR_URL).append(sUrl).append("<br> ");
			buffer.append(EOSLOG_ERROR_LINE).append(sLine).append("<br> ");
		}
		EOSLog.log("error",buffer.toString());
	}
}
//eventManager.add(window,"error",window.onerror);
/**
 * 是否显示日志.判断日志的级别是否显示.
 * @private
 * @param {Object} id
 * @param {Object} checkbox
 */
EOSLog.isShow = function(id,checkbox){
	var ob = EOSLog.styles[id];
	if(checkbox.checked){
		ob.style.display = "block";
	}else{
		ob.style.display = "none";
	}
}
/**
 * 清空日志.
 * @private
 */
EOSLog.clear = function(){
	var parent = $id(EOSLog.BODY_ID,EOSLog.doc);
	parent.innerHTML = "";
}
/**
 * 向控制台输出日志的容器及按纽.
 * @private
 */
EOSLog.console = function(){
	var div = $create("div",EOSLog.doc);
	//div.className = "EOS-LOG-CONTAINER";
	div.style.position = "absolute";
	div.style.left = "300px";
	div.style.top = "300px";
	var buffer = new StringBuffer();
	if(isIE){
		//buffer.append("<iframe src='"+blankURL+"' style=\"position:absolute;z-index:-1;width:expression(this.nextSibling.offsetWidth);height:expression(this.nextSibling.offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);\" frameborder=\"0\" ></iframe>");
		buffer.append("<iframe src='"+blankURL+"' style=\"position:absolute;z-index:-1; frameborder=\"0\" ></iframe>");
	}
	var style="";
	var isIE6=navigator.userAgent.toLowerCase().indexOf("msie 6")!=-1;
    if(isIE6) style='style="filter:alpha(opacity=50)"';
	buffer.append("<div style=\"z-index:1000\">");
	buffer.append('<TABLE  cellspacing="0" cellpadding="0"  class="eos-dialog"><TR><TD '+style+' class="left-top-conner"><div class="ieBlank"></div></TD><TD  '+style+' class="top"></TD><TD  '+style+' class="right-top-conner"><div class="ieBlank"></div></TD></TR><TR><TD  '+style+' class="left"><div class="ieBlank"></div></TD><TD style="background-color: #eaf0f2;">')
	buffer.append("<div style='display:none;position: absolute;height=200px;overflow-y:auto; z-index: 1000;' id='").append(EOSLog.EVAL_SIGN_ID).append("'>");
	buffer.append("<select class='EOS-LOG-SIGN-DIV' size='10' id='").append(EOSLog.EVAL_SIGN_SELECT_ID).append("'></select></div>");
	buffer.append("<div onmouseup=\"style.cursor='auto'\" onmousedown=\"style.cursor='move';\" class='EOS-LOG-BUTTONS' style=\"width:100%\"id='");
	buffer.append(EOSLog.BUTTONS_ID).append("'><table width=\"100%\"align='right' border='0' style='font-size:9pt'><tr><td width=\"300px\">");
	buffer.append("<input type=\"checkbox\" checked onmousedown=\"EOSLog.isShow('time',this)\" name=\"time\" value=\"1\">TIME");
	buffer.append("<input type=\"checkbox\" checked onmousedown=\"EOSLog.isShow('info',this)\" name=\"info\" value=\"1\">INFO");
	buffer.append("<input type=\"checkbox\" checked onmousedown=\"EOSLog.isShow('debug',this)\" name=\"degbug\" value=\"1\">DEBUG");
	buffer.append("<input type=\"checkbox\" checked onmousedown=\"EOSLog.isShow('warn',this)\" name=\"warn\" value=\"1\">WARN");
	buffer.append("<input type=\"checkbox\" checked onmousedown=\"EOSLog.isShow('error',this)\" name=\"error\" value=\"1\">ERROR</td><td align='right'>");
	buffer.append('&nbsp;<div  id="eos_log_button0"  class="eos-button" onclick="EOSLog.clear()" onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner">Clear</div></div>&nbsp;')
	buffer.append('<div id="eos_log_button1"  class="eos-button" onclick="EOSLog.command()" onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner">Cmd</div></div>&nbsp;')
	buffer.append('<div id="eos_log_button2"  class="eos-button" onclick="EOSLog.hide()"onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner">Close</div></div>&nbsp;')
		//buffer.append("<input type='button' value='Clear Log' onmousedown='EOSLog.clear()'><input type='button' value='Close' onmousedown='EOSLog.hide()'><input type='button' value='Command' onmousedown='EOSLog.command()'></td></tr></table></div>");
	buffer.append("</td></tr></table></div>");
	buffer.append("<div status='hide' class='EOS-LOG-EVAL' id='").append(EOSLog.EVAL_ID).append("' style='width:100%;display:none'><div>");
	buffer.append("<textarea style='width:100%;height:100px;font-size: 12px' id='").append(EOSLog.EVAL_INPUT_ID).append("'></textarea>");
	//buffer.append("</div><div height='20'><input type=button value='run Command' onclick='EOSLog.runEval();'><input type=button value='Clear Command' onclick='EOSLog.clearEval();'></div>");
    buffer.append("</div><div height='20'>")
    buffer.append('<div  id="eos_log_button3"  class="eos-button" onclick="EOSLog.runEval()"onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner">Run</div></div>&nbsp;')
	buffer.append('<div  id="eos_log_button4"  class="eos-button" onclick="EOSLog.clearEval()"onmouseover="buttonMouseOver(this)" onmouseout="buttonMouseOut(this)" onmousedown="buttonMouseDown(this)" onmouseup="buttonMouseUp(this)"><div align="center" class="eos-button-inner">Clear</div></div>&nbsp;')
 	buffer.append("</div>")
	buffer.append("</div>");
	buffer.append("<div style='border-top:#C0C0C0 solid 1px;overflow:scroll' class='EOS-LOG-BODY' id='").append(EOSLog.BODY_ID).append("' style='overflow:auto'></div>");
	buffer.append('</TD><TD  '+style+' class="right" id="eos_log_right"><div class="ieBlank"></div></TD></TR><TR><TD  '+style+' class="left-bottom-conner"></TD><TD  '+style+' class="bottom" id="eos_log_bottom"></TD><TD  '+style+' class="right-bottom-conner" id="eos_log_rightBottom"></TD></TR></TABLE>');
	
	buffer.append("</div>");
	div.innerHTML = buffer.toString();
	div.id = EOSLog.ID;

	var tryTime=10;
		function __appendChild(){
			try{
				EOSLog.doc.body.appendChild(div);
			}catch(e2){
				if (tryTime>0) {
					tryTime--;
					setTimeout(__appendChild ,11 );
				}
			}
		}
	__appendChild();

	var buttonsDiv = $id(EOSLog.BUTTONS_ID,EOSLog.doc);
	div.style.display = "none";
	//fx_DD(div,{handle:buttonsDiv});
	EOSLog.hide();
	var evalInput = $id(EOSLog.EVAL_INPUT_ID,EOSLog.doc);
	eventManager.add(evalInput,"keyup",EOSLog.evalKeyUp);
	eventManager.add(evalInput,"keydown",EOSLog.evalKeyDown);
	EOSLog.hasOut = true;
	EOSLog.panel = $id(EOSLog.BODY_ID,EOSLog.doc);
	EOSLog.refresh();
	initDrag(div);
    if(isFF)
    { 
     for(var i=0;i<5;i++) buttonForFF(EOSLog.doc.getElementById("eos_log_button"+i));
    }
	
}
/**
 * 显示或隐藏命令输入面板.
 */
EOSLog.command = function(){
	var div = $id(EOSLog.EVAL_ID,EOSLog.doc);
	if(div.style.display=="none"){
		div.style.display="";
	}else{
		div.style.display="none";
	}
}
/**
 * 执行文本框中的命令.
 */
EOSLog.runEval = function(){
	var cmd = $id(EOSLog.EVAL_INPUT_ID,EOSLog.doc);
	var value = cmd.value;
	try{
		eval(value);
	}catch(err){
		var buffer = new StringBuffer();
		buffer.append(EOSLOG_ERROR_TYPE).append(err.name).append("<br>");
		buffer.append(EOSLOG_ERROR_INFO).append(err.message).append("<br>");
		if(err.number){
			buffer.append(EOSLOG_ERROR_CODE).append(err.number).append("<br>");
		}
		if(err.fileName){
			buffer.append(EOSLOG_ERROR_URL).append(err.fileName).append("<br>");
		}
		if(err.lineNumber){
			buffer.append(EOSLOG_ERROR_LINE).append(err.lineNumber).append("<br>");
		}
		if(err.stack){
			buffer.append(EOSLOG_ERROR_STACK).append(err.stack).append("<br>");
		}
		if(err.description){
			buffer.append(EOSLOG_ERROR_DETAIL).append(err.description).append("<br>");
		}
		buffer.append(EOSLOG_ERROR_FUNCTION).append("<br>").append(value).append("<br>");
		EOSLog.log("error",EOSLOG_EVAL_ERROR + "<br>" + buffer.toString());
	}
}
/**
 * 清空文本域的命令.
 */
EOSLog.clearEval = function(){
	var cmd = $id(EOSLog.EVAL_INPUT_ID,EOSLog.doc);
	cmd.value = "";
}

/**
 * 向控制台输出一条日志记录.用table来定位.
 * @private
 * @param {Object} record
 */
EOSLog.print = function(record){
	if(record.out){
		return;
	}
	var div = $create("div",EOSLog.doc);
	div.className = "EOS-LOG-" + record.level;
	var buffer = new StringBuffer();
	buffer.append("<table border='0'><tr><td valign='top' width='20px'>").append("<div class='EOS-LOG-TITLE-").append(record.level).append("'>");
	buffer.append(record.level).append("</div></td><td class='EOS-LOG-WORD'>").append("<div class='EOS-LOG-TIME'>runtime:").append(record.time.toLocaleTimeString());
	buffer.append("</div>").append(record.message).append("</td></tr></table>");
	var parent = EOSLog.panel;
	div.innerHTML = buffer.toString();
	if(parent.firstChild){
		parent.insertBefore(div,parent.firstChild);
	}else{
		parent.appendChild(div);
	}
	record.out = true;
}
/**
 * 初始化日志的CSS.
 * @private
 *
 */
EOSLog.init = function(){
	if(!EOSDEBUG){
		return false;
	}
	if(window["EOSLog_inited"]){
		return;
	}
	EOSLog.topWin = _get_top_window();
	EOSLog.doc = EOSLog.topWin.document;
	eventManager.add(document,"keyup",EOSLog.keypress);
	if(EOSLog.topWin==window){
		EOSLog.styles["debug"] = createStyle("EOS-LOG-debug",EOSLog.doc);
		EOSLog.styles["info"] = createStyle("EOS-LOG-info",EOSLog.doc);
		EOSLog.styles["error"] = createStyle("EOS-LOG-error",EOSLog.doc);
		EOSLog.styles["time"] = createStyle("EOS-LOG-time",EOSLog.doc);
		EOSLog.styles["warn"] = createStyle("EOS-LOG-warn",EOSLog.doc);
		EOSLog.console();
		EOSLog.hide();

	}else{
		if(!EOSLog.topWin["EOSLog"]){
			moveScript(document,EOSLog.doc);
			moveCss(document,EOSLog.doc);
		}
	}
	window["EOSLog_inited"] = true;
}
/**
 * @private
 * 截获键盘事件,当按下F12时,显示日志.
 */
EOSLog.keypress = function(){
	var keyCode = eventManager.getKeyCode();
	if(keyCode==123){
		EOSLog.show();
		return false;
	}
}
/**
 * 显示日志面板.
 */
EOSLog.show = function(){
	var div = $id(EOSLog.ID,EOSLog.doc);
	div.style.display = "block";
	div.style.zIndex=getMaxZindex(EOSLog.doc);
}
/**
 * 隐藏日志面板.
 */
EOSLog.hide = function(){
	var div = $id(EOSLog.ID,EOSLog.doc);
	div.style.display = "none";
}
/**
 * 测试性能时调用的函数,开始计时.
 * @param {String} id 用于标识不同的计时器的ID
 * @param {String} msg 用于输出的信息.
 */
EOSLog.time = function(id,msg,isClear){
	if(!id){
		id="SYSTEM";
	}
	if(!EOSLog.timeLog[id]){
		var time = new Date();
		EOSLog.timeLog[id] = {time:time,msg:msg};
	}else{
		var end = new Date();
		var start = EOSLog.timeLog[id];
		var ms = end - start.time;
		var buffer = new StringBuffer();
		buffer.append("ID:").append(id).append("<br>");
		if(start.msg){
			buffer.append("start:").append(start.msg).append("<br>");
		}
		buffer.append(" time:<b>").append(ms).append("ms</b><br>");
		if(msg){
			buffer.append("end:").append(msg);
		}
		EOSLog.log("time",buffer.toString());
		if(isClear){
			EOSLog.timeLog[id] = null;
		}
	}
}

function $info(message){
	if("info".indexOf(EOSLOG_LEVEL)>=0){
		var log = EOSLog.topWin["EOSLog"]||EOSLog;
		log.info(message);
	}
}

function $debug(message){
	if("info,debug".indexOf(EOSLOG_LEVEL)>=0){
		var log = EOSLog.topWin["EOSLog"]||EOSLog;
		log.debug(message);
	}
}

function $warn(message){
	if("info,debug,warn".indexOf(EOSLOG_LEVEL)>=0){
		var log = EOSLog.topWin["EOSLog"]||EOSLog;
		log.warn(message);
	}
}

function $error(message){
	if("info,debug,warn,error".indexOf(EOSLOG_LEVEL)>=0){
		var log = EOSLog.topWin["EOSLog"]||EOSLog;
		log.error(message);
	}
}

function $time(message){
	var log = EOSLog.topWin["EOSLog"]||EOSLog;
	log.time(message);
}
function $handle(err){
	var log = EOSLog.topWin["EOSLog"]||EOSLog;
	log.handle(err);
}
/**
 * 可以进行日志的方法.
 */
EOSLog.enable = function(){

}


/**
 * 命令输入框的键盘按键事件.
 * 遇到.就出语法提示.
 */
EOSLog.evalKeyUp = function(){
	var ob = $id(EOSLog.EVAL_INPUT_ID,EOSLog.doc);
	var keycode = eventManager.getKeyCode();
	var div = $id(EOSLog.EVAL_SIGN_ID,EOSLog.doc);
	if(keycode==190){
		var keyword = EOSLog.getkeyWord(ob);
		EOSLog.sign(ob,keyword);
	}
}
/**
 * 在命令行中按上键时的操作
 * @param {Object} select
 */
EOSLog.selectUpOption = function(select){
	var index = select.selectedIndex - 1;
	if(index>-1){
		var option = select.options[index];
		if(option){
			option.selected = true;
		}
	}else{
		var option = select.options[0];
		if(option){
			option.selected = true;
		}
	}
}
/**
 * 在命令行中按下键时的操作
 * @param {Object} select
 */
EOSLog.selectDownOption = function(select){
var index = select.selectedIndex + 1;
	var option = select.options[index];
	if(option){
		option.selected = true;
	}else{
		var option = select.options[0];
		if(option){
			option.selected = true;
		}
	}
}
/**
 * 命令行的按键事件,处理tab键.
 */
EOSLog.evalKeyDown = function(){
	var ob = $id(EOSLog.EVAL_INPUT_ID,EOSLog.doc);
	var keycode = eventManager.getKeyCode();
	var select1 = $id(EOSLog.EVAL_SIGN_SELECT_ID,EOSLog.doc);
	var div = $id(EOSLog.EVAL_SIGN_ID,EOSLog.doc);
	if(keycode==9){
		eventManager.stopPropagation();
		EOSLog.insertAtCaret(ob,"    ");
	}else if(div.style.display != "none"){
		if(keycode==38){
			eventManager.stopPropagation();
			EOSLog.selectUpOption(select1);
			return false;
		}else if(keycode==40){
			eventManager.stopPropagation();
			EOSLog.selectDownOption(select1);
			return false;
		}else if(keycode==13){
			eventManager.stopPropagation();
			EOSLog.insertAtCaret(ob,select1.value);
			div.style.display = "none";
			return false;
		}else{
			div.style.display = "none";
		}
	}
}
/**
 * 根据关键字显示语法提示.
 * @param {Object} ob
 * @param {Object} keyword
 */
EOSLog.sign = function(ob,keyword){
	var div = $id(EOSLog.EVAL_SIGN_ID,EOSLog.doc);
	var props = false;
	try{
		var tempObj;
		if(keyword){
			if(keyword.indexOf(".")>=0){
				var arr = keyword.split(".");
				tempObj = window[arr[0]]||eval(arr[0]);
				for(var i=1;i<arr.length;i++){
					if(tempObj){
						tempObj = tempObj[arr[i]];
					}else{
						tempObj = null;
					}
				}
			}else{
				tempObj = window[keyword]||eval(keyword);
			}
		}
		var select1 = $id(EOSLog.EVAL_SIGN_SELECT_ID,EOSLog.doc);
		select1.length = 0;
		var values = [];
		for(var a in tempObj){
			if(!(a + "").indexOf("__")==0){
				values.push(a);
				props = true;
			}
		}
		values.sort();
		for(var i=0;i<values.length;i++){
			var option;
			var a = values[i];
			option = new Option(a,a);
			select1.options.add(option);
		}
		if(select1.length<10){
			select1.size = select1.length;
		}else{
			select1.size = 10;
		}
		if(props){
			div.style.display = "block";
			function select1Change(){
				EOSLog.insertAtCaret(ob,select1.value);
				select1.length = 0;
				div.style.display = "none";
			}
			eventManager.add(select1,"change",select1Change);
		}else{
			div.style.display = "none";
		}
	}catch(e){
		div.style.display = "none";
	}
}
/**
 * 获得关键字的方法.
 * @param {Object} ob
 */
EOSLog.getkeyWord = function(ob){
	var div = $id(EOSLog.EVAL_SIGN_ID,EOSLog.doc);
	if(EOSLog.doc.selection){
      var range = EOSLog.doc.selection.createRange();
      var range_all = EOSLog.doc.body.createTextRange();
      range_all.moveToElementText(ob);
      // calculate selection end point by moving beginning of range_all to end of range
      for (end = 0; range_all.compareEndPoints('StartToEnd', range) < 0; end ++){
      	range_all.moveStart('character', 1);
      	// get number of line breaks from textarea start to selection end and add them to end
        for (var i = 0; i <= end; i ++){
        	if (ob.value.charAt(i) == '\n')
            	end ++;
        }
      }
    	 var pre = EOSLog.getSingWordByLeft(ob,end);
		if(div.parentNode.tagName.toLocaleUpperCase()!="BODY"){
			EOSLog.doc.body.appendChild(div);
		}
		div.style.top = range["offsetTop"] + 16 + EOSLog.doc.body.scrollTop;
		div.style.left = range["offsetLeft"] + EOSLog.doc.body.scrollLeft;
		return pre;
	}else{
		var textBox = ob;
	    if(typeof(textBox.selectionStart) == "number"){
	        start = textBox.selectionStart;
	        end = textBox.selectionEnd;
	        if(start==end){
				var left = textBox.value.substring(0,end);
	        	var result = EOSLog.getSingWordByLeft(textBox,end);
				var lines = left.split("\n");
				var lastLine = lines[lines.length-1];
				var leftPos = lastLine.length * 6 - textBox.scrollLeft;
				var topPos = lines.length * 16 - textBox.scrollTop;
				if(leftPos > textBox.offsetWidth){
					while(leftPos>0&&leftPos>textBox.offsetWidth){
						leftPos = leftPos - textBox.offsetWidth;
						topPos = topPos + 16;
					}
				}
				div.style.top = ob.offsetTop + topPos;
				div.style.left = ob.offsetLeft + leftPos;
				//$info(textBox.scrollTop + ":" + textBox.scrollLeft);
				return result;
	        }
	    }
	}
	return null;
}
/**
 * 获得需要提示的关键字
 * @param {Object} textarea
 * @param {Object} offset
 */
EOSLog.getSingWordByLeft = function(textarea,offset){
	var left = textarea.value.substring(0,end);
	var reg = /([\w|\.]+)\.$/;
	reg.test(left);
	return RegExp.$1;
}
/**
 * 向当前位置插入字符.
 * @param {Object} textObj
 * @param {Object} textFeildValue
 */
EOSLog.insertAtCaret = function(textObj,textFeildValue){
	if(isIE){
		textObj.focus();
		EOSLog.doc.selection.createRange().text+=textFeildValue;
	}else{
		if(textObj.setSelectionRange){
			var rangeStart = textObj.selectionStart;
			var rangeEnd = textObj.selectionEnd;
			var tempStr1 = textObj.value.substring(0,rangeStart);
			var tempStr2 = textObj.value.substring(rangeEnd);
			textObj.value = tempStr1 + textFeildValue + tempStr2;
			var pos = rangeStart + textFeildValue.length;
			textObj.focus();
			textObj.setSelectionRange(pos, pos);
		}else{
			alert("This   version   of   Mozilla   based   browser   does   not   support   setSelectionRange");
		}
	}
}
if(!window["EOSLog_inited"]){
	try{
		EOSLog.init();
	}catch(e){
		if (eventManager){
			eventManager.add(window,"load",EOSLog.init);
		}
	}
}
EOSLog.scriptObject = {};
/**
 *把js存起来做本地变量，仅在ie下使用
 */
EOSLog.getScriptStr = function(url){
	if(!EOSLog.scriptObject[url]){
		EOSLog.scriptObject[url] = getRemoteResource(url);
	}
	return EOSLog.scriptObject[url];
}
/**
 *获得详细的错误信息的类，仅在ie下使用
 */
function EOSDebugInfo(){
	this.sLine = null;
	this.sUrl = null;
	this.sMessage = null;
	this.errFunc = null;
	this.errLine = null;
	this.stackFunc = [];
}
/**
 *获得详细的错误信息的方法，仅在ie下使用
 */
EOSLog.getDetailError = function(errFunc,sMessage,sUrl,sLine){
	var debugInfo = new EOSDebugInfo();
	debugInfo.sLine = sLine;
	debugInfo.sUrl = sUrl;
	debugInfo.sMessage = sMessage;
	debugInfo.errFunc = errFunc;
	var scriptStr = null;
	if(errFunc){
		var docStr = document.documentElement.outerHTML;
		if(docStr.indexOf(errFunc)>0){
			scriptStr = getRemoteResource(window.location);
		}else{
			debugInfo.sLine = sLine - 1;
			var scripts = document.getElementsByTagName("script");
			for(var i=0;i<scripts.length;i++){
				var script = scripts[i];
				if(script.src){
					var scriptBody = EOSLog.getScriptStr(script.src);
					if(scriptBody && scriptBody.indexOf(errFunc.toString())>=0){
						debugInfo.sUrl = script.src;
						scriptStr = scriptBody;
						break;
					}
				}
			}
		}
		if(scriptStr){
			var arr = scriptStr.split("\n");
			debugInfo.errLine = arr[debugInfo.sLine-1];
			debugInfo.errFunc = getDisplayStr(debugInfo.errFunc);
			debugInfo.errLine = getDisplayStr(debugInfo.errLine);
			if(debugInfo.errLine && debugInfo.errFunc){
				if(debugInfo.errFunc.indexOf(debugInfo.errLine)>=0){
					debugInfo.errFunc = debugInfo.errFunc.replace(debugInfo.errLine,"<b><span style='color:red;background-color:#eeeeee;font-size:larger'>" + debugInfo.errLine + "</span></b>");
				}
			}
		}
	}
	return debugInfo;
}
/**
 *获得显示的字符串，过滤掉尖括号等
 */
function getDisplayStr(str){
	if(str){
		str = str.toString();
		return str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/ /g,'&nbsp;').replace(/\n/g,'<br>').replace(/\t/g,'&nbsp;&nbsp;&nbsp;&nbsp;');
	}
	return str;
}
/**
 *获得过程的资源
 */
function getRemoteResource(url){
	var req = createXMLHttp();
	req.open("GET", url, false);
	req.send(null);
	return req.responseText;
}

function initDrag(container)
{
	var ddFunc = EOSLog.topWin.fx_DD||fx_DD;
	var dragRightDiv=$id( 'eos_log_right',EOSLog.doc);
	var dragBottomDiv=$id( 'eos_log_bottom',EOSLog.doc);
	var dragRightBottomDiv=$id( 'eos_log_rightBottom',EOSLog.doc);

	ddFunc(container,{
		handle : dragBottomDiv,
		modifiers :true,
		onDrag: function(){
                    var posY=this.mouse.start["y"];
                    var nowPosY=this.mouse.now["y"];
		  		   	if(nowPosY-posY+this.value.now["y"]>=27)
				   	    this.element.style.height=nowPosY-posY+this.value.now["y"];  
                         
                          resizeLogPanel(parseInt(container.style.height))
					//resizeModelDialog(modalId,parseInt(container.style.width),parseInt(container.style.height));
					
			//modalArguments.iframe.style.display = "none";
		},
		onComplete: function(){
			//modalArguments.iframe.style.display = "";
		},
		onStart:function(){
		    this.value.now["y"]=this.element.getStyle("height").toInt();
			//modalArguments.iframe.style.display = "none";
		}
	});

	ddFunc(container,{
		handle : dragRightDiv,
		modifiers :true,
		onDrag: function(){

			        var posX=this.mouse.start["x"];
                    var nowPosX=this.mouse.now["x"];
		  		   	if(nowPosX-posX+this.value.now["x"]>=150)
				   	    this.element.style.width=nowPosX-posX+this.value.now["x"];  
				   	       resizeLogPanel(null,parseInt(container.style.width))
			//resizeModelDialog(modalId,parseInt(container.style.width),parseInt(container.style.height));
			//modalArguments.iframe.style.display = "none";
		},
		onComplete: function(){
			//modalArguments.iframe.style.display = "";
		},
		onStart:function(){
		    this.value.now["x"]=this.element.getStyle("width").toInt();
			//modalArguments.iframe.style.display = "none";
		}
	});
	ddFunc(container,{handle:dragRightBottomDiv,
	        modifiers :true,
			onStart:function(){
			this.value.now["x"]=this.element.getStyle("width").toInt();
	        this.value.now["y"]=this.element.getStyle("height").toInt();
			//modalArguments.iframe.style.display = "none";
			},
			onDrag:function(){
			
	          var posY=this.mouse.start["y"];
              var nowPosY=this.mouse.now["y"];
		  	  if(nowPosY-posY+this.value.now["y"]>=27)
			   	    container.style.height=nowPosY-posY+this.value.now["y"]; 
			  var posX=this.mouse.start["x"];
              var nowPosX=this.mouse.now["x"];
		  	  if(nowPosX-posX+this.value.now["x"]>=150)
				   	    container.style.width=nowPosX-posX+this.value.now["x"];  
				   	    resizeLogPanel(parseInt(container.style.height),parseInt(container.style.width))
			//resizeModelDialog(modalId,parseInt(container.style.width),parseInt(container.style.height));
			//modalArguments.iframe.style.display = "none";
			},
			onComplete:function(){
            // modalArguments.iframe.style.display = "";
			}
		});
}

function resizeLogPanel(height,width)
{
if(height!=null&&height!="")EOSLog.panel.style.height=height-27;//123
if(width!=null&&width!="")EOSLog.panel.style.width=width;

}
EOSLog.formatXML=function(s)
{
return s;
try{
	var re=s.split(">");
	var str=""
	var tabSize=0;
	for(var i=0;i<re.length-1;i++)
	{
		var tmp=re[i];
		//alert(tmp+tmp.indexOf("<"))
		if(tmp.indexOf("<")!=0)
			{
			var values=tmp.split("<");
			for(var j=0;j<tabSize;j++)
			str=str+"\t";
			str=str+values[0]+"\n";
			tabSize=tabSize-1;
			for(var j=0;j<tabSize;j++)
			str=str+"\t";
			str=str+"<"+values[1]+">\n";
			}
		else
			if(tmp.indexOf("</")!=0)
				{
				for(var j=0;j<tabSize;j++)
				str=str+"\t";
				str=str+re[i]+">\n";
				if(tmp.indexOf("<!")==-1&&tmp.indexOf("<?")==-1) tabSize=tabSize+1;
				}
			else
				{
				tabSize=tabSize-1;
				for(var j=0;j<tabSize;j++)
				str=str+"\t";
				str=str+re[i]+">\n";
				}
	
	}
	return str;
	}
catch(e)
	{
	return s;
	}
}
