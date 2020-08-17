/* ============== 字符串相关函数 ============== */

/**
 * @class 用数组实现的StringBuffer类,其性能优于String类.
 */
function StringBuffer(){
	this.values = new Array();
}
/**
 * 向StringBuffer中追加字符串.
 * @param {String} str
 */
StringBuffer.prototype.append = function(str){
	this.values.push(str);
	return this;
}
/**
 *清空StringBuffer的方法.
 */
StringBuffer.prototype.clear = function(){
	return this.values = [];
}
/**
 * 生成字符串方法.
 * @return 返回StringBuffer的字符串.
 * @type {String}
 */
StringBuffer.prototype.toString = function(){
	return this.values.join('');
}

/**
 * 去掉字符串中所有空格.
 * @param {Object} str
 */
function allTrim(str){
	if(str){
		return (str+'').replace(/ /g,"");
	}else{
		if(str==""){
			return str;
		}
		return null;
	}
}

/**
 * 去掉左右两边的空格.
 * @param {Object} str
 */

 function trim(str, wh){
		if(str!==''&& (!str.replace || !str.length)){ return str; }
		var re = (wh > 0) ? (/^\s+/) : (wh < 0) ? (/\s+$/) : (/^\s+|\s+$/g);
		return str.replace(re, '');
 }

/**
 * 去掉字符串左加的空格.
 * @param {Object} str
 */

function lTrim(str){
	return trim(str,1);
}
/**
 * 去掉字符串右边的空格.
 * @param {Object} str
 */
function rTrim(str){
	return trim(str,-1);
}
/**
 * 返回字符串str1中在str2以后的字符串.
 * 以第一次出现的str2为准.如:str1=abcdabcd,str2=ab则返回cdabcd
 * 如果str1不包含str2,则返回""
 * @param {Object} str1
 * @param {Object} str2
 */
function substringAfter(str1, str2){
	if(!str1||!str2){
		return null;
	}else{
		var pos = str1.indexOf(str2);
		if(pos>=0){
			pos = pos + str2.length;
			return str1.substr(pos);
		}else{
			return "";
		}
	}
}
/**
 * 返回字符串str1中在str2以前的字符串.
 * 以第一次出现的str2为准.如:str1=abcdabcd,str2=cd则返回ab
 * 如果str1不包含str2,则返回""
 * @param {Object} str1
 * @param {Object} str2
 */
function substringBefore(str1, str2){
	if(!str1||!str2){
		return null;
	}else{
		var pos = str1.indexOf(str2);
		if(pos>=0){
			return str1.substring(0,pos);
		}else{
			return "";
		}
	}
}
/**
 * 获得str字符串的单字节长度,一个汉字算两个字符.
 * @param {Object} str
 */
function getBytesLen(str){
	if(str){
		var reg = /[^\x00-\xff]/g;
		return (str+'').replace(reg,"aa").length;
	}else{
		if(str==""){
			return 0;
		}
		return -1;
	}
}
/**
 * 获得字符串的字符数，一个汉字算一个字符,
 * 一个ascii字符也为一个字符.
 * @param {Object} str
 */
function get2BytesCharsLen(str){
	if(str){
		return str.length;
	}else{
		if(str==""){
			return 0;
		}
		return -1;
	}
}

/**
 * 把字符串中的"<",">","&"," "用xml转义符表示 , 如分别表示为”&lt;”, “&gt”, “&amp;”
 * @param {Object} str
 */
function xmlConversion(str){
	if(str){
		return (str+"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\'/g,"&apos;").replace(/\"/g,"&quot;");
	}else{
		if(str==""){
			return str;
		}
		return null;
	}
}
/**
 * 把字符串中的"<",">","&"," "用html转义符表示 , 如分别表示为”&lt;”, “&gt”, “&amp;”
 * @param {Object} str
 */
function htmlConversion(str){
	if(str){
		return (str+'').replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(" ","&nbsp;");
	}else{
		if(str===""){
			return str;
		}
		return null;
	}
}



/* ============== 日期相关函数 ============== */


/**
 * 把日期从一种格式转换为另一种格式,里面包含yyyy,MM,dd和HH,mm,ss
 *  支持日期和时间的格式.如果格式出错,则返回''
 * @param {Date} String
 * @param {String} fmt1
 * @param {String} fmt2
 */
function dateFormat( date, fmt1,fmt2) {
	var tempDate = stringToDate(date,fmt1);
	if(isNaN(tempDate)){
		alert(DATE_FORMAT_ERROR);
	}else{
		return dateToString(tempDate,fmt2);
	}
	return null;
}
function isDate(date,fmt){
	if(date===null||date===undefined||date==""){
		return false;
	}
	date = formatSupport(date,fmt);
	var regFormat = fmt.replace("yyyy","\\d{4}").replace(/MM/,"\\d{2}").replace("dd","\\d{2}").replace("HH","\\d{2}").replace(/mm/,"\\d{2}").replace("ss","\\d{2}").replace(".S",".\\d{1}");
	if(!(new RegExp(regFormat)).test(date)){
		return false;
	}
	var isD = isFormatDate(date,fmt);
	var isT = isFormatTime(date,fmt);
	if(isD||isT){
		return true;
	}
	return false;
}

function isTimeFormat(fmt){
	if(typeof(fmt)=="string"){
		return fmt.indexOf("HH")!=-1&&fmt.indexOf("mm")!=-1&&fmt.indexOf("ss")!=-1;
	}else{
		return false;
	}
}
function isDateFormat(fmt){
	if(typeof(fmt)=="string"){
		return fmt.indexOf("yyyy")!=-1&&fmt.indexOf("MM")!=-1&&fmt.indexOf("dd")!=-1;
	}else{
		return false;
	}
}
/**
 * 把时间从一种格式转换为另一种格式,里面包含HH,mm,ss
 *  支持日期和时间的格式.如果格式出错,则返回''
 * @param {Date} String
 * @param {String} fmt1
 * @param {String} fmt2
 */
function timeFormat( time, fmt1,fmt2) {
	var retDate = "00:00:00";
    if (isFormatTime( time, fmt1)) {
	  if (isTimeFormat(fmt2)){
		    //设置时间.
			retDate = setTime(time, fmt1,fmt2);
	  }
	  return retDate;
    }
    else {
        alert(TIME_FORMAT_ERROR);
    }
    return retDate;
}

/**
 * 用途：判断是否是时间.
 * 输入：time：时间；fmt：时间格式.
 * 返回：如果通过验证返回true,否则返回false
 * @param {Object} time
 * @param {Object} fmt
 */
function isFormatTime( time, fmt) {
	if(!time||!fmt){
		return false;
	}
	if(time.length!=fmt.length){
		return false;
	}
    var hIndex = fmt.indexOf("HH");
    if(hIndex==-1) return false;
   var hour = time.substring(hIndex,hIndex+2);
   var mIndex = fmt.indexOf("mm");
    if(mIndex==-1) return false;
   var minute = time.substring(mIndex,mIndex+2);
   var sIndex = fmt.indexOf("ss");
    if(sIndex==-1) return false;
   var second = time.substring(sIndex,sIndex+2);
    if(!isNumber(hour)||hour<0 || hour> 23) return false;
    if(!isNumber(minute)||minute<0 || minute>59) return false;
    if(!isNumber(second)||second<0 || second>59) return false;
    return true;
}
/**
 * 用途：判断是否是日期.
 * 输入：date：日期；fmt：日期格式.
 * 返回：如果通过验证返回true,否则返回false
 * @param {Object} date
 * @param {Object} fmt
 */
function isFormatDate( date, fmt) {
	if(!date||!fmt){
		return false;
	}
	if(date.length!=fmt.length){
		return false;
	}
    var yIndex = fmt.indexOf("yyyy");
    if(yIndex==-1) return false;
   var year = date.substring(yIndex,yIndex+4);
   var mIndex = fmt.indexOf("MM");
    if(mIndex==-1) return false;
   var month = date.substring(mIndex,mIndex+2);
   var dIndex = fmt.indexOf("dd");
    if(dIndex==-1) return false;
   var day = date.substring(dIndex,dIndex+2);
    if(!isNumber(year)||year>10000 || year< 999) return false;
    if(!isNumber(month)||month>12 || month< 1) return false;
    if(day>getMaxDay(year,month) || day< 1) return false;
    return true;
}

function formatSupport(dateString,fmt){
	if(fmt=="yyyyMMddHHmmss"){
		if(dateString.length==8){
			dateString = dateString + "000000";
		}
	}else if(fmt=="yyyyMMdd"){
		if(dateString.length==14){
			dateString = dateString.substring(0,8);
		}
	}else if(fmt=="yyyy-MM-dd HH:mm:ss"){
		if(dateString.length==10){
			dateString = dateString + " 00:00:00";
		}
	}else if(fmt=="yyyy-MM-dd"){
		if(dateString.length==20){
			dateString = dateString.substring(0,10);
		}
	}
	return dateString;
}
/**
 * 根据传入的格式将字符串转换为日期格式.
 * @param {Object} date
 * @param {Object} formatter
 */
function stringToDate(dateString,formatter)
{
    var today = new Date();
    if(!dateString || dateString == "")
    {
        return today;
    }
    if(!formatter || formatter == "")
    {
        formatter = "yyyy-MM-dd";
    }
    var yearMarker = formatter.replace(/[^y|Y]/g,'');
    var monthMarker = formatter.replace(/[^M]/g,'');
    var dayMarker = formatter.replace(/[^d]/g,'');
    var yearPosition = formatter.indexOf(yearMarker);
    var yearLength = yearMarker.length;
    var year =  dateString.substring(yearPosition ,yearPosition + yearLength) * 1;
    if( yearLength == 2)
    {
        if(year < 50 )
        {
            year += 2000;
        }
        else
        {
            year += 1900;
        }
    }
    var monthPosition = formatter.indexOf(monthMarker);
    var month = dateString.substring(monthPosition,monthPosition + monthMarker.length) * 1 - 1;
    var dayPosition = formatter.indexOf(dayMarker);
    var day = dateString.substring( dayPosition,dayPosition + dayMarker.length )* 1;
    var hour24Marker = formatter.replace(/[^H]/g,'');
    var hour12Marker = formatter.replace(/[^h]/g,'');
    var minuteMarker = formatter.replace(/[^m]/g,'');
    var secondMarker = formatter.replace(/[^S|s]/g,'');
    var hour = 0;
	if(hour24Marker&&hour24Marker!=""){
	    var hour24Position = formatter.indexOf(hour24Marker);
	    if(hour24Position>-1){
	    	hour = dateString.substring(hour24Position,hour24Position + hour24Marker.length);
	    }
    }
    if(hour12Marker&&hour12Marker!=""){
	    var hour12Position = formatter.indexOf(hour12Marker);
	    if(hour12Position>-1){
	    	hour = dateString.substring(hour12Position,hour12Position + hour12Marker.length);
	    }
    }
    var minute = 0;
    if(minuteMarker&&minuteMarker!=""){
	    var minutePosition = formatter.indexOf(minuteMarker);
	    if(minutePosition>-1){
	    	minute = dateString.substring(minutePosition,minutePosition + minuteMarker.length);
	    }
    }
    var second = 0;
    if(secondMarker&&secondMarker!=""){
	    var secondPosition = formatter.indexOf(secondMarker);
	    if(secondPosition>-1){
	    	second = dateString.substring(secondPosition,secondPosition + secondMarker.length);
	    }
    }

    return new Date(year,month,day,hour,minute,second);
}

/*function stringToDate(date,fmt){
	var fmtDate = "yyyy/MM/dd";
	var fmtTime = "HH:mm:ss";
	var dstr = "";
	if(isFormatDate(date,fmt)){
		dstr = dateFormat(date,fmt,fmtDate) + " ";
	}
	if(isFormatTime(date,fmt)){
		dstr += dateFormat(date,fmt,fmtTime);
	}
	return new Date(dstr);
}*/
/**
 * 将date转换为String格式.
 * @param {Object} date
 * @param {Object} formatter
 */
 function dateToString(date,formatter)
{
    if(!formatter || formatter == "")
    {
        formatter = "yyyy-MM-dd";
    }
    date = date||new Date();
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 1).toString();
    var day = date.getDate().toString();
    var minute = date.getMinutes().toString();
    var second = date.getSeconds().toString();
    var hour = date.getHours().toString();
    var yearMarker = formatter.replace(/[^y|Y]/g,'');
    if(year.length<4){
    	year = "0" + year;
    }
    if(yearMarker.length == 2)
    {
        year = year.substring(2,4);
    }
    var monthMarker = formatter.replace(/[^M]/g,'');
    if(monthMarker.length > 1)
    {
        if(month.length == 1)
        {
            month = "0" + month;
        }
    }
    var dayMarker = formatter.replace(/[^d]/g,'');
    if(dayMarker.length > 1)
    {
        if(day.length == 1)
        {
            day = "0" + day;
        }
    }
		var hour24Marker = formatter.replace(/[^H]/g,'');
    if(hour24Marker&&hour24Marker.length > 1)
    {
        if(hour.length == 1)
        {
            hour = "0" + hour;
        }
    }
	 var hour12Marker = formatter.replace(/[^h]/g,'');
    if(hour12Marker&&hour12Marker.length > 1)
    {
    	if(hour - 12>0){
        	 hour = (hour - 12) + "";
        }
        if(hour.length == 1)
        {
            hour = "0" + hour;
        }

    }
    var minuteMarker = formatter.replace(/[^m]/g,'');
    if(minuteMarker&&minuteMarker.length > 1)
    {
        if(minute.length == 1)
        {
            minute = "0" + minute;
        }
    }
	 var secondMarker = formatter.replace(/[^S|s]/g,'');
    if(secondMarker&&secondMarker.length > 1)
    {
        if(second.length == 1)
        {
            second = "0" + second;
        }
    }
    var ret = formatter;
    if(yearMarker){
    	ret = ret.replace(yearMarker,year);
    }
    if(monthMarker){
   		ret = ret.replace(monthMarker,month);
    }
    if(dayMarker){
    	ret = ret.replace(dayMarker,day);
    }
    if(hour12Marker){
    	ret = ret.replace(hour12Marker,hour);
    }
    if(hour24Marker){
   		ret = ret.replace(hour24Marker,hour);
    }
    if(minuteMarker){
   		ret = ret.replace(minuteMarker,minute);
    }
    if(secondMarker){
   		ret = ret.replace(secondMarker,second);
    }
    return ret;
}
/**
 * 将date转换为String格式.
 * @param {Object} date
 * @param {Object} fmt
function dateToString(date,fmt){
	var fmt1 = "yyyy/MM/dd HH:mm:ss";
	var fmt2 = "yyyy/MM/dd";
	var dstr = date.getFullYear() + "/" + dateToStringValue(date.getMonth()+1) + "/" + dateToStringValue(date.getDate());
	if(date.getHours()!=undefined&&date.getHours()!=null){
		dstr += " " + dateToStringValue(date.getHours()) + ":" + dateToStringValue(date.getMinutes()) + ":" + dateToStringValue(date.getSeconds());
		return dateFormat(dstr,fmt1,fmt);
	}else{
		return dateFormat(dstr,fmt2,fmt);
	}
}*/
/**
 * @private
 * 将数字转换为两位的,前面补0
 * @param {Object} num
 */
function dateToStringValue(num){
	var str = String(num);
	if(str.length==1){
  		str = "0" + str;
  	}
	return str;
}
/**
 * 取得某个月的最大天数.
 * @param {Object} year
 * @param {Object} month
 */
function getMaxDay(year,month) {
    if(month==4||month==6||month==9||month==11)
        return "30";
    if(month==2)
        if(year%4==0&&year%100!=0 || year%400==0)
            return "29";
        else
            return "28";
    return "31";
}
/**
 * 判断该字符串是否为数字.
 * @param {Object} str
 */
function isNumber( str ){
    var regu = /^(\d+)$/;
        return regu.test(str);
}
/**
 * 根据格式设置日期.
 * @param {Object} date
 * @param {Object} fmt1
 * @param {Object} fmt2
 */
function setDate( date, fmt1,fmt2) {
        var yIndex = fmt1.indexOf("yyyy");
        var year = date.substring(yIndex,yIndex+4);
        var mIndex = fmt1.indexOf("MM");
        var month = date.substring(mIndex,mIndex+2);
        var dIndex = fmt1.indexOf("dd");
        var day = date.substring(dIndex,dIndex+2);
        var retDate = fmt2;
        retDate = retDate.replace(/yyyy/i,year);
        retDate = retDate.replace(/MM/i,month);
        retDate = retDate.replace(/dd/i,day);
        return retDate ;
}
/**
 * 根据格式设置时间.
 * @param {Object} date
 * @param {Object} fmt1
 * @param {Object} retDate
 */
function setTime( date, fmt1,retDate) {
        var hour ="00";
        var min ="00";
        var sec ="00";
        var hIndex = fmt1.indexOf("HH");
        var mIndex = fmt1.indexOf("mm");
        var sIndex = fmt1.indexOf("ss");
        if(sIndex!=-1&&hIndex!=-1&&mIndex!=-1) {
			sec = date.substring(sIndex,sIndex+2);
			min = date.substring(mIndex,mIndex+2);
			hour = date.substring(hIndex,hIndex+2);

			if(!isNumber(hour)||hour>"23" || hour< "00") {alert(DATE_FORMAT_ERROR); return ""};
			if(!isNumber(min)||min>"59" || min< "00") {alert(DATE_FORMAT_ERROR); return ""};
			if(!isNumber(sec)||sec>"59" || sec< "00") {alert(DATE_FORMAT_ERROR); return ""};
		}
		else if (!(sIndex==-1&&hIndex==-1&&mIndex==-1))
		{
            alert(DATE_FORMAT_ERROR);
			return "";
        }
        retDate = retDate.replace(/HH/i,hour);
        retDate = retDate.replace(/mm/i,min);
        retDate = retDate.replace(/ss/i,sec);
		return retDate;
}


/* ============== 数字相关函数 ============== */

Number.prototype.NAN0 = function(){
	if(isNaN(this)){
		return 0;
	}else{
		return this;
	}
}

/**
 * 格式化数字的函数,prefix为前缀,默认为￥.
 * 如:numberToMoney(1234)返回1,234.00,小数点后两位四舍五入.
 * @param {Object} num
 * @param {Object} prefix
 * @return 返回货币格式的字符串.
 * @type String
 */
function numberToMoney(num,prefix){
	num = num.toString();
	prefix = prefix?prefix:NUMBER_MONEY_PREFIX;
	if(isNaN(num)){
		num = "0";
	}
	var sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	var cents = num%100;
	num = Math.floor(num/100).toString();
	if(cents<10){
		cents = "0" + cents;
	}
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++){
		num = num.substring(0,String(num).length-(4*i+3))+',' + num.substring(num.length-(4*i+3));
	}
	return (((sign)?'':'-') + prefix + num + '.' + cents);
}
/**
 * 将数字转为中文货币形式.输入的为数字或字符串,
 * 支持用,分割的如："123,334,125.25";
 * 小数点两位后面的将忽略.
 * @param {Object} num
 */
function numberToChinese(num)
{
  var MAXIMUM_NUMBER = 99999999999.99;
  var integral;
  var decimal;
  var outputCharacters = "";
  var parts;
  var digits, radices, bigRadices, decimals;
  var zeroCount;
  var i, p, d;
  var quotient,modulus;
  var currencyDigits = num;
  currencyDigits = currencyDigits.toString();
  if (currencyDigits == "")
  {
    alert(NUMBER_CHINESE_ERROR_NULL);
    return "";
  }
  if(currencyDigits.indexOf("-")==0){
	currencyDigits = currencyDigits.substr(1);
	outputCharacters = CN_MINUS;
  }
  if (currencyDigits.match(/[^,.\d]/) != null)
  {
    alert(NUMBER_CHINESE_ERROR_CHARATER);
    return "";
  }
  if ((currencyDigits).match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null)
  {
    alert(NUMBER_CHINESE_ERROR_CHARATER);
    return "";
  }
  currencyDigits = currencyDigits.replace(/,/g, "");
  currencyDigits = currencyDigits.replace(/^0+/, "");
  if (Number(currencyDigits) > MAXIMUM_NUMBER)
  {
    alert(NUMBER_CHINESE_ERROR_LARGE);
    return "";
  }
  parts = currencyDigits.split(".");
  if (parts.length > 1)
  {
    integral = parts[0];
    decimal = parts[1];
    decimal = decimal.substr(0, 2);
  }
  else
  {
    integral = parts[0];
    decimal = "";
  }
  digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE);
  radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND);
  bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION);
  decimals = new Array(CN_TEN_CENT, CN_CENT);
  if (Number(integral) > 0)
  {
    zeroCount = 0;
    for (i = 0;
    i < integral.length;
    i++)
    {
      p = integral.length - i - 1;
      d = integral.substr(i, 1);
      quotient = p / 4;
      modulus = p % 4;
      if (d == "0")
      {
        zeroCount++;
      }
      else
      {
        if (zeroCount > 0)
        {
          outputCharacters += digits[0];
        }
        zeroCount = 0;
        outputCharacters += digits[Number(d)] + radices[modulus];
      }
      if (modulus == 0 && zeroCount < 4)
      {
        outputCharacters += bigRadices[quotient];
      }
    }
    outputCharacters += CN_DOLLAR;
  }
  if (decimal != "")
  {
    for (i = 0;
    i < decimal.length;
    i++)
    {
      d = decimal.substr(i, 1);
      if (d != "0")
      {
        outputCharacters += digits[Number(d)] + decimals[i];
      }
    }
  }
  if (outputCharacters == "")
  {
    outputCharacters = CN_ZERO + CN_DOLLAR;
  }
  if (decimal == "")
  {
    outputCharacters += CN_INTEGER;
  }
  outputCharacters = CN_SYMBOL + outputCharacters;
  return outputCharacters;
}
/**
 * 格式化数字的函数，根据输入格式将数字格式化为指定格式,
 * 支持",","#",".",";"等操作符.
 * @param {Object} num 要格式化的数字.
 * @param {Object} format 格式化字符串，支持",","#",".",";"
 * @param {Object} prefix 格式化的前缀，如："$","￥"
 */
function formatNumber(num,format,prefix){
	var formatArr = format.split(";");
	var result;
	if(formatArr.length==1){
		result = singleFormat(num,format,prefix);
	}else if(formatArr.length==2){
		if(num>0){
			result = singleFormat(num,formatArr[0],prefix);
		}else{
			result = singleFormat(num,formatArr[1],prefix);
		}
	}else if(formatArr.length==3){
		if(num<0){
			result = singleFormat(num,formatArr[1],prefix);
		}else if(num>0){
			result = singleFormat(num,formatArr[0],prefix);
		}else{
			result = singleFormat(num,formatArr[2],prefix);
		}
	}else{
		alert("error format " + format);
	}
	return result;
}
/**
 * 单个格式化的函数，被formatNumber调用.
 * @private
 * @param {Object} num 要格式化的数字.
 * @param {Object} format 格式化字符串，支持",","#",".",";"
 * @param {Object} prefix 格式化的前缀，如："$","￥"
 */
function singleFormat(num,format,prefix){
	num = Number(num);
	if(isNaN(num)){
		return num;
	}
	var i;//读数器，事先声明
	var c,f;//读取的每一个字符，事先声明
	var comma;//逗号分割符
	var symbol='';//百分号分割符
	var sign='';//正负号
	var decimals='';//小数部分
	var integers='';//整数部分
	var fInt;//原始数字的整数部分
	var fDec;//原始数字的小数部分
	var nInt;//format的整数部分
	var nDec;//format的小数部分
	var len=0;//
	var cnt=0;
	var pre = '';
	format=(format)? format+'':'';
	//判断是否有逗号
	if(format.indexOf(',')>=0){
		comma=',';
	}
	//是否有百分号
	if(format.indexOf('%')>=0){
		symbol='%';
		num = num / 100;
	}
	if(prefix){
		pre =  prefix;
	}
	//将格式分割开
	s=format.split('.');
	fInt=((s[0]==''||s[0]==null||s[0]=='undefinded')? '':s[0]);
	fInt=fInt.split('').reverse().join('');
	fDec=(s[1]==''||s[1]==null||s[1]=='undefinded')? '':s[1];
	//如果要重新定义四舍五入的函数，请重写toFixedFunc
	num = toFixedFunc(num,fDec.length);
	//number正负号的判断
	if(num<0){
		sign='-';
	}
	num+='';
	if(sign!=''){
		num=num.replace('-','');
	}
	//分割数字
	s=num.split('.');
	nInt=((s[0]==''||s[0]==null||s[0]=='undefinded')? '':s[0]);
	nInt=nInt.split('').reverse().join('');
	nDec=(s[1]==''||s[1]==null||s[1]=='undefinded')? '':s[1];
	if (nInt){
		len=nInt.length;
	}
	if (fInt.length>len){
		len=fInt.length;
	}
	//遍历整数部分，一位一位地格式化。
	for(i=0;i<len;i++){
		c=nInt.charAt(i);
		f=fInt.charAt(i);
		cnt++;
		if (cnt==4 && comma && (c||f=='0')){
			integers+=comma;
		}
		if(f=='0' && !c){
			integers+='0';
		}else if(c){
			integers+=c;
		}
		if (cnt==4){
			cnt=1;
		}
	}
	if(fDec){
		len=fDec.length;
	}
	//遍历小数部分，一位一位地格式化。
	for(i=0;i<len;i++){
		c=nDec.charAt(i);
		f=fDec.charAt(i);
		if(f=='0' && !c){
			decimals+='0';
		}else if((f=='#' || f=='0') && c){
			decimals+=c;
		}
	}
	//将整数部分和小数部分相加
	f=((integers+'').split('').reverse().join(''))+((decimals)? '.'+decimals:'');
	if(symbol=='%'){
		f+=symbol;
	}else{
		f=symbol+f;
	}
	return pre + sign + f;
}
/**
 * @private
 * 确定小数点精度的函数，解决四舍五入以及小数点位数不够问题.
 * @param {Object} oldData
 * @param {Object} precision
 */
function toFixedFunc(num,precision){
	return num.toFixed(precision);
}

/* ============== 其他辅助函数 ============== */

/**
 * 链接确认的函数，会弹出confirm，如果点是则跳转，点否则不跳转.
 * @param {Object} msg
 * @param {Object} url
 * @param {Object} target
 */
function linkConfirm(msg,url,target){
	var confirmForm = $id("__eos_confirm_form");
	if(!confirmForm){
		confirmForm = $create("form");
		confirmForm.id = "__eos_confirm_form";
		bodyAddNode(confirmForm);
	}
	confirmForm.action = url;
	confirmForm.method ="post";
	confirmForm.target = target;
	if(window.confirm(msg)){
		confirmForm.submit();
	}
}



function moveScript(fromDoc,toDoc){
	var scripts = fromDoc.getElementsByTagName("script");
	if(toDoc.parentWindow&&fromDoc.parentWindow){
		toDoc.parentWindow.contextPath = fromDoc.parentWindow.contextPath;
	}
	var scriptsStr = "";
	for(var i=0;i<scripts.length;i++){
		if(scripts[i].src!="")
		   scriptsStr += "<script src='" + scripts[i].src + "'></script>";//modify by ton
	}
	var container = $create("div",toDoc);
	container.style.display = "none";
	toDoc.body.appendChild(container);
	setInnerHTML(container,scriptsStr,toDoc);
}


function moveCss(fromDoc,toDoc){
    return;
	var links = fromDoc.getElementsByTagName("link");

	for(var i=0;i<links.length;i++){
		//linksStr+= "<link ref='stylesheet' type='text/css' href='" + links[i].href + "'/>";
		var path = links[i].href;
	    if(path.indexOf("style-component.css")==-1) continue;
		if(toDoc.createStyleSheet){//ie方法;
            var so=toDoc.createStyleSheet();
            so.addImport(path);
            toDoc.styleSheets.item[toDoc.styleSheets.length]=so;
        }else{//fox加载css方法;
            var length=toDoc.styleSheets.length;
            var style=$create("style",toDoc);
            style.setAttribute("type","text/css");
            toDoc.documentElement.childNodes[0].appendChild(style);
            toDoc.styleSheets[length].insertRule("@import url("+path+");",0);
        }
	}
}


function addContextPath(url){
	if(url){
		if(url.indexOf("/")==0){
			var cxtpath = window["contextPath"];
			if(url.indexOf(cxtpath)!=0){
				return cxtpath + url;
			}
		}
	}
	return url;
}

/**
 * @private
 * 通过标签名称取得父元素.
 */
function getParentByTagName(obj,tagName){
	if(tagName && obj){
		tagName = tagName.toLowerCase();
		while( (obj=obj.parentNode) ){
			if(obj.tagName && obj.tagName.toLowerCase()==tagName){
				return obj;
			}
		}
		return null;
	}else{
		return obj?obj:null;
	}
}


function getEventTargetByTagName(event,tagName, deep){
		var node= event.srcElement || event.target;
		if (!node){ return null; }
		deep= deep || 5;
		var	tagName = tagName.toLowerCase();
		do{
			if(node.tagName && node.tagName.toLowerCase()==tagName){
				return node;
			}
		}while( (node=node.parentNode) && ((deep--)>0) );
		return null;
	};

/**
 * @private
 * 获得跨iframe的距飞屏幕距离
 * @param {Object} elem
 * @param {Object} topwin
 */
function getScreenPosition(elem,topwin){
	var win = window;
	var pos = getElementXY(elem);
	var left = pos[0];
	var topx = pos[1];
	while(win!=topwin&&win!=top){
		if(win.frameElement){
			pos = getElementXY(win.frameElement);
			left = left + pos[0];
			topx = topx + pos[1];
		}
		win = win.parent;
	}
	return [left,topx];
}

/**
 * @private
 */
function addButtonToText(text){

	if(text){
		var button = $create("div");
		button.hideFocus = true;
		button.style.display="block";
		button.style.zIndex=99999;
		text.className = "eos-drop-down-text";
		//button.className = "eos-drop-down-button";

		function setPositionWhenLoad(){
				bodyAddNode(button);
//				text.parentNode.appendChild(button);
				document.body.appendChild(button);
		}
		if(isIE){
			if(document.readyState=="complete" ){
				 setPositionWhenLoad();
			}else{
				eventManager.add(window,"load",setPositionWhenLoad);
			}
		}else{
			try{
				setPositionWhenLoad();
			}catch(e){
				eventManager.add(window,"load",setPositionWhenLoad);
			}
		}
		function overTextAndButton(){
			if( !text.getAttribute("_isFocus") && !text.disabled ){
				button.className = "eos-drop-down-button-over";
				setButtonPosition(text,button);
				text.className = "eos-drop-down-text-over";
			}
		}

		function focusTextAndButton(){
			if( !text.disabled && !text.readOnly ){
				button.className = "eos-drop-down-button-focus";
				setButtonPosition(text,button);
				text.className = "eos-drop-down-text-focus";
			}
		}

		function outTextAndButton(){

			if (!text.getAttribute("_isOver")  &&!text.getAttribute("_isFocus")  && !button.getAttribute("_isOver") ){
				//hideButton(text,button);
				text.className = "eos-drop-down-text";
				//button.className = "eos-drop-down-button";
			}
		}


		function textOver(){
			text.setAttribute("_isOver",true);
			overTextAndButton();
		}
		function textFocus(){
			text.setAttribute("_isFocus",true);
			focusTextAndButton()
			eventManager.stopPropagation();
		}
		function buttonOver(){
			button.setAttribute("_isOver",true);
			overTextAndButton();
		}

		function buttonFocus(){
			button.setAttribute("_isFocus",true);
			focusTextAndButton()
		}


		function textOut(){
			text.setAttribute("_isOver",false);
			setTimeout(outTextAndButton,300);
		}

		function textBlur(){
			text.setAttribute("_isFocus",false);
			setTimeout(outTextAndButton,300);
		}

		function buttonOut(){
			button.setAttribute("_isOver",false);
			setTimeout(outTextAndButton,300);
		}

		function buttonBlur(){
			button.setAttribute("_isFocus",false);
			setTimeout(outTextAndButton,300);
		}




		eventManager.add(text,"mouseover",textOver);
		eventManager.add(text,"focus",textFocus);
		eventManager.add(text,"click",textFocus);
		eventManager.add(button,"mouseover",buttonOver);
		eventManager.add(button,"focus",buttonFocus);
		eventManager.add(button,"click",buttonFocus);

		eventManager.add(text,"mouseout",textOut);
		eventManager.add(text,"blur",textBlur);
		eventManager.add(button,"mouseout",buttonOut);
		eventManager.add(button,"blur",buttonBlur);

		eventManager.addOutClick(text,textBlur);

		return button;
	}
	return null;
}
/**
 * @private
 */
function hideButton(text,button){
	var height = text.offsetHeight;
	var width = text.offsetWidth;
	text.style.width = width + "px";
}
/**
 * @private
 */
function setButtonPosition(text,button){
	var height = text.offsetHeight;
	var width = text.offsetWidth;
	text.style.width = width + "px";
	var pos = getElementXY(text);
	if(pos){
		var topx = pos[1];
		button.style.position = "absolute";
		var left = pos[0]*1 + width*1 - height;
		height=height- (isBorderBox?0:2);
		button.style.width = height + "px";
		button.style.height = height + "px";
		button.style.overflow ='hidden';
		button.style.top = "0px";
		button.style.left = "0px";
		button.style.display="";

//button.style.borderStyle="solid";
//button.style.borderWidth="2px";
//button.style.borderColor="red";
		setElementXY(button,[left,topx]);
		//button.style.zIndex = (text.style.zIndex||0) +1;
	}
}
/**
 * @private
 */
function getRect(elem){
	var pos = getPosition(elem);
	var right = pos.left + elem.offsetWidth;
	var bottom = pos.top + elem.offsetHeight;
	return {left:pos.left,top:pos.top,right:right,bottom:bottom};
}


/**
 * @private
 * 将fromSelect中选中的option选项移到toSelect中.
 * @param {Object} fromSelect
 * @param {Object} toSelect
 * @param {int} maxLength目标select的最多选项值.
 */
function moveSelectedOptions(fromSelect,toSelect,maxLength){
	maxLength = Number(maxLength);
	if(isNaN(maxLength)){
		maxLength = Number.MAX_VALUE;
	}
	var arr = [];
	for(var i=0;i<fromSelect.options.length;i++){
		var option = fromSelect.options[i];
		if(option.selected){
			arr.push(option);
		}
	}
	for(var i=0;i<arr.length;i++){
		if(toSelect.options.length>=maxLength){
			break;
		}else{
			var option = arr[i];
			toSelect.appendChild(option);
		}
	}
}
/**
 * @private
 * 将fromSelect中的option选项全部移到toSelect中.
 * @param {Object} fromSelect
 * @param {Object} toSelect
 * @param {int} maxLength目标select的最多选项值.
 */
function moveAllOptions(fromSelect,toSelect,maxLength){
	maxLength = Number(maxLength);
	if(isNaN(maxLength)){
		maxLength = Number.MAX_VALUE;
	}
	var arr = [];
	for(var i=0;i<fromSelect.options.length;i++){
		var option = fromSelect.options[i];
		arr.push(option);
	}
	for(var i=0;i<arr.length;i++){
		if(toSelect.options.length>=maxLength){
			break;
		}
		var option = arr[i];
		toSelect.appendChild(option);
	}
}

/**
 * @private
 * 编译模板的函数
 */
function compileTemplate (template,t_start ,t_end,t_script,varName){
		var TEMPLATE_START= t_start || "$[";
		var TEMPLATE_END= t_end || "]";
		var TEMPLATE_SCRIPT = t_script || "$" ;
		var startLength= TEMPLATE_START.length;
		var endLength= TEMPLATE_END.length;
		var scriptLength= TEMPLATE_SCRIPT.length;

		var templateC=[];
		var snippets=[];
		var current=0;
		while(true){
			var start= template.indexOf( TEMPLATE_START ,current);
			var sBegin=start+ startLength;
			var sEnd=template.indexOf( TEMPLATE_END ,sBegin);

			if (sBegin>= startLength  && sEnd>sBegin  ){
					templateC.push(template.substring(current,start) );
					var sn=template.substring(sBegin,sEnd);
					if (sn.indexOf( TEMPLATE_SCRIPT )==0){
						sn=eval( sn.substring( scriptLength) );
					}else{
						snippets.push(templateC.length);
					}
					templateC.push( sn );
			}else {
				templateC.push( template.substring(current) );
				break;
			}

			current=sEnd+ endLength;
		}
		templateC.snippets=snippets;
		templateC.varName=varName;
		return templateC;
	};

/**
 * @private
 * 执行模板的函数
 */


function runExpression(templateC,entity){
		var snippets= templateC.snippets ;
		var rs=[];
		for (var i=0,sIdx=0,j=templateC.length;i<j;i++ ){
			if (snippets[sIdx]==i){
				rs[i]=entity.getProperty(templateC[i]);
				sIdx++;
			}else{
				rs[i]=templateC[i];
			}
		}
		return rs.join('');
}



/**
 * 对table进行按列排序.
 * @param {Object} col table的列对象 (table表头的某列的单元格)
 * @param {String} dataType 排序的类型 默认是按字符串排序,可选为 int float date string:
 * @param {String} sortType 可选为 升序asc 降序desc. 原始顺序default
 */
function sortTableByCol(col, dataType ,sortType) {
	col = $id(col);
	var oTable=getParentByTagName(col,"table");
	if (!col || !oTable){
		return;
	}
	var oTHead;
	//var oTHead = oTable.firstChild;
	try{
		oTHead = oTable.getElementsByTagName('thead');
		oTHead= oTHead?oTHead[0]:null;
	}catch(e){
		oTHead=null;
	}

	var oTBody = oTable.tBodies[0];
	var startR= oTHead && oTHead.rows.length>0?0:( col.parentNode.rowIndex+1);
	var colDataRows = oTBody.rows;
	var aTRs = [];

	for (var i=startR; i < colDataRows.length; i++) {
		aTRs[i-startR] = colDataRows[i];
		if (!aTRs[i-startR].getAttribute("__eos_orgorder")){
			aTRs[i-startR].setAttribute("__eos_orgorder",i+1+'');
		}
	}


	var getCellValue=cell_innerText;

	function cell_attr_value(cellEle){
		return cellEle.getAttribute("value");
	}

	function cell_innerText(cellEle,trEle){
		return cellEle.innerText;
	}

	function cell_attr_orgorder(cellEle,trEle){
		return trEle.getAttribute("__eos_orgorder");
	}


		sortType = sortType=='asc'?'desc':'asc';

	if (oTable.sortCol == col) {
		sortType = col.getAttribute('__eos_sort');

		if (sortType=='desc'){
			getCellValue=cell_attr_orgorder;
			sortType='default';
			aTRs.sort(sortCompareTRs(col.cellIndex, dataType,sortType,getCellValue));

		}else if (sortType=='default'){
			sortType='asc';
			aTRs.sort(sortCompareTRs(col.cellIndex, dataType,sortType,getCellValue));
		}else{
			aTRs.reverse();
			sortType = sortType=='asc'?'desc':'asc';
		}
	} else {
		aTRs.sort(sortCompareTRs(col.cellIndex, dataType,sortType,getCellValue));
	}

	var oFragment = document.createDocumentFragment();
	for (var i=0; i < aTRs.length; i++) {
		oFragment.appendChild(aTRs[i]);
	}
	oTBody.appendChild(oFragment);

	if (oTable.sortFlag && oTable.sortCol != col){
		oTable.sortFlag.className = 'eos-sorttable-default';
	}

	oTable.sortCol = col;
	var spans=col.getElementsByTagName('span');
	if ( spans.length<1 || (spans[spans.length-1].className+'').indexOf('eos-sorttable-')<0 ){
		oTable.sortFlag = $createElement('span' );
		col.appendChild(oTable.sortFlag);
	}else{
		oTable.sortFlag = spans[spans.length-1];
	}
	col.setAttribute('__eos_sort',sortType );
	col.style.position='relative';
	oTable.sortFlag.className = 'eos-sorttable-'+ sortType;
	oTable.sortFlag.innerHTML = '&#160;' //sortType;


}
/**
 * @private
 */
function sortCompareTRs(iCol, sDataType,sortType,getCellValue) {
	var f=1;
	if (sortType=='desc'|| sortType=='d'){
		f=-1;
	}

	 function convert(sValue, sDataType) {
		switch(sDataType) {
			case "int":
				return parseInt(sValue);
			case "float":
				return parseFloat(sValue);
			case "date":
				return ''+sValue ; //new Date(Date.parse(sValue));
			default:
				return ''+sValue;

		}
	}

	return  function compareTRs(oTR1, oTR2) {
				var vValue1, vValue2;
				vValue1 = convert( getCellValue(oTR1.cells[iCol],oTR1 ), sDataType);
				vValue2 = convert( getCellValue(oTR2.cells[iCol],oTR2 ), sDataType);

				if (vValue1 < vValue2) {
					return -1*f;
				} else if (vValue1 > vValue2) {
					return 1*f;
				} else {
					return 0;
				}
			};
}

/**
 * @private
 */
function submitFormBy(formObj, flowAction,formAction, target){

	if (formObj){
		formObj.action=formAction || formObj.action;
		formObj.target=target || formObj.target;
		if(formObj.elements["_eosFlowAction"]){
			formObj.elements["_eosFlowAction"].value = flowAction;
		}
		formObj.submit();
	}

}


/**
 * eos页面跳转函数.
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {int} pno 要跳转到的页数
 * @param {String} flowAction 页面流的flowAction
 * @param {String} formAction form的action
 * @param {String} target form的target
 * @param {String} formId form的id
 */
function gotoPage(xpath,pno,flowAction,formAction, target,formId){
	var formObj
	if(formId){
		formObj = $id(formId)||$name(formId);
	}
	var beginEl;//=$e(xpath+'/begin');
	var lengthEl;//=$e(xpath+'/length');
	var countEl;//=$e(xpath+'/count');
	if(formObj){
		beginEl=formObj.elements[xpath+'/begin'];
		lengthEl=formObj.elements[xpath+'/length'];
		countEl=formObj.elements[xpath+'/count'];
	}else{
		beginEl=$e(xpath+'/begin');
		lengthEl=$e(xpath+'/length');
		countEl=$e(xpath+'/count');
		formObj=getParentByTagName(beginEl,'form');
	}
	var offset=0;
	var pno= !pno?1:Number(pno);

	if (typeof(pno)!='number'){
		pno=$e(pno).value;
	}
	pno=parseInt(pno/1);
	pno=isNaN(pno)||pno<1?1:pno;

	var nn=offset/1 + lengthEl.value/1 * (pno-1)/1;

	beginEl.value= nn<0?0:nn;

	submitFormBy(formObj, flowAction,formAction, target);

}

/**
 * eos页面跳转函数--第一页.
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} flowAction 页面流的flowAction
 * @param {String} formAction form的action
 * @param {String} target form的target
 * @param {String} formId form的id
 */
function firstPage(xpath,flowAction,formAction, target,formId){
	var formObj
	if(formId){
		formObj = $id(formId)||$name(formId);
	}
	var beginEl;//=$e(xpath+'/begin');
	if(formObj){
		beginEl=formObj.elements[xpath+'/begin'];
	}else{
		beginEl=$e(xpath+'/begin');
		formObj=getParentByTagName(beginEl,'form');
	}
	beginEl.value=0;
	submitFormBy(formObj,flowAction,formAction, target);
}

/**
 * eos页面跳转函数--前一页.
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} flowAction 页面流的flowAction
 * @param {String} formAction form的action
 * @param {String} target form的target
 * @param {String} formId form的id
 */
function prevPage(xpath,flowAction,formAction, target,formId){
	var formObj
	if(formId){
		formObj = $id(formId)||$name(formId);
	}
	var beginEl;//=$e(xpath+'/begin');
	var lengthEl;//=$e(xpath+'/length');
	var countEl;//=$e(xpath+'/count');
	if(formObj){
		beginEl=formObj.elements[xpath+'/begin'];
		lengthEl=formObj.elements[xpath+'/length'];
	}else{
		beginEl=$e(xpath+'/begin');
		lengthEl=$e(xpath+'/length');
		formObj=getParentByTagName(beginEl,'form');
	}
	var length= lengthEl&&lengthEl.value?lengthEl.value:0;

	var nn=Number(beginEl.value) - Number(lengthEl.value);
	beginEl.value= nn<0?0:nn;

	submitFormBy(formObj,flowAction,formAction, target);

}

/**
 * eos页面跳转函数--后一页.
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} flowAction 页面流的flowAction
 * @param {String} formAction form的action
 * @param {String} target form的target
 * @param {String} formId form的id
 */
function nextPage(xpath,flowAction,formAction, target,formId){
var formObj
	if(formId){
		formObj = $id(formId)||$name(formId);
	}
	var beginEl;//=$e(xpath+'/begin');
	var lengthEl;//=$e(xpath+'/length');
	var countEl;//=$e(xpath+'/count');
	if(formObj){
		beginEl=formObj.elements[xpath+'/begin'];
		lengthEl=formObj.elements[xpath+'/length'];
	}else{
		beginEl=$e(xpath+'/begin');
		lengthEl=$e(xpath+'/length');
		formObj=getParentByTagName(beginEl,'form');
	}
	var length= lengthEl&&lengthEl.value?lengthEl.value:0;
	beginEl.value= Number(beginEl.value) + Number(lengthEl.value);
	submitFormBy(formObj,flowAction,formAction, target);
}

/**
 * eos页面跳转函数--最末页.
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} xpath 翻页的表单域对应的xpath根路径
 * @param {String} flowAction 页面流的flowAction
 * @param {String} formAction form的action
 * @param {String} target form的target
 * @param {String} formId form的id
 */
function lastPage(xpath,flowAction,formAction, target,formId){
	var formObj
	if(formId){
		formObj = $id(formId)||$name(formId);
	}
	var beginEl;//=$e(xpath+'/begin');
	var lengthEl;//=$e(xpath+'/length');
	var countEl;//=$e(xpath+'/count');
	if(formObj){
		beginEl=formObj.elements[xpath+'/begin'];
		lengthEl=formObj.elements[xpath+'/length'];
		countEl=formObj.elements[xpath+'/count'];
	}else{
		beginEl=$e(xpath+'/begin');
		lengthEl=$e(xpath+'/length');
		countEl=$e(xpath+'/count');
		formObj=getParentByTagName(beginEl,'form');
	}
	 var totalPage = Math.floor(((countEl.value/1) + (lengthEl.value/1) -1)/(lengthEl.value/1));
	 beginEl.value = (totalPage-1)*(lengthEl.value/1);
	 var formObj=getParentByTagName(beginEl,'form');
	 submitFormBy(formObj,flowAction,formAction, target);
}

/**
 * @private
 * 取得页面内对象的最大zIndex值.
 * @param {Object} doc 要取值的页面 默认为当前页面
 */
var __topWin = _get_top_window()||window;
__topWin.MAXZINDEX = __topWin.MAXZINDEX || -1;
function getMaxZindex(doc){
if(__topWin.MAXZINDEX==-1)
   {
	doc = doc||document;
	var alls = doc.all||doc.getElementsByTagName("*");
	var len = alls.length;
	var maxIndex = 0;
	if( isIE)
		{
			for(var i=0;;i++){
			var elem = alls[i];
			if(elem==null) break;
			var index = parseInt(GetCurrentStyle(elem,"zIndex"));
			if(!isNaN(index)){
				if(index>maxIndex){
					maxIndex = index;
				}
			}
		   }
	   }
 else
    {
		for(var i=0;i<len;i++){
			var elem = alls[i];
			var index = parseInt(GetCurrentStyle(elem,"zIndex"));
			if(!isNaN(index)){
				if(index>maxIndex){
					maxIndex = index;
				}
			}
		}
    }
    __topWin.MAXZINDEX=maxIndex + 1;
    }
    else
    __topWin.MAXZINDEX=__topWin.MAXZINDEX+1
	return __topWin.MAXZINDEX;
}

/**
 * @private
 * 取得页面元素的当前style样式.
 * @param {Object} obj 页面元素
 * @param {String} 要取得的style属性名
 * @type {String}
 * @return style样式值
 */
function getCurrentStyle (obj, prop) {
	if (obj.currentStyle) {
		return obj.currentStyle[prop];
	}
	else if (window.getComputedStyle) {
		prop = prop.replace (/([A-Z])/g, "-$1");
		prop = prop.toLowerCase ();
		var currStyle = window.getComputedStyle (obj, "");
		if(currStyle){
			return currStyle.getPropertyValue(prop);
		}else{
			return null;
		}
	}
	return null;
}

var GetCurrentStyle=getCurrentStyle;


function setOpacity(el,opacity){
		el=$e(el);
		if (!el){
			return el;
		}
		opacity=opacity>1?1:(opacity<0?0:opacity);
		if (!el.currentStyle || !el.currentStyle.hasLayout) { el.style.zoom = 1; }
		if (window.isIE) {
			 el.style.filter = (opacity == 1) ? '' : "alpha(opacity=" + opacity * 100 + ")";
		}
		el.style.opacity =  opacity;
		if (opacity === 0){
			if (el.style.visibility != "hidden") { el.style.visibility = "hidden";}
		} else {
			if (el.style.visibility != "visible") { el.style.visibility = "visible";}
		}
		return el;
	};

function fx_size( id, w,h ,callBack,d ){
	var box = $mootools(id);
	var fx = box.effects({duration: d|| 400});
	var e={};
	if (w!==null && w!==undefined){
		e.width=w;
	}
	if (h!==null && h!==undefined){
		e.height=h;
	}
	fx.start(e).chain( callBack || function(){} );
}

function fx_fadeIn( id ,callBack,d ){
	var box = $mootools(id);
	box.setOpacity(0);
	box.setStyle("display","");
	var fx = box.effects({duration: d|| 400});
	var e={
			'opacity': 1
		}
	fx.start(e).chain( callBack || function(){} );
}
function fx_fadeOut( id,callBack ,d ){
	var box = $mootools(id);
	var fx = box.effects({duration: d|| 400});
	var e={
			'opacity': 0
		}
	fx.start(e).chain( callBack || function(){box.setOpacity(0);box.setStyle("display","none");} );
}


function fx_slideIn( id ,mySlide ){

// {mode:  'vertical' / 'horizontal'}
	 mySlide = mySlide || new Fx.Slide( id );
	 mySlide.slideIn();
	 return mySlide;

}
function fx_slideOut( id ,mySlide ){

	 mySlide = mySlide || new Fx.Slide( id );
	 mySlide.slideOut();
	 return mySlide;
}

function fx_DD( id, options  ){
	options=options||{};
	//懒加载改造
	EOS.use('mootools',function(){
		var dd=new Drag.Move($mootools(id), options );
	});

	//dd.addEvent('onStart',function(){
	//	this.element.setStyle('display','none')
	//} );
	//dd.addEvent('onComplete',function(){
	//	this.element.setStyle('display','')
	//} );


}



/**
 * 获得跨iframe的距飞屏幕距离
 * @param {Object} elem
 * @param {Object} topwin
 */
function getScreenPosition(elem,topwin){
	var win = window;
	var pos = getElementXY(elem);
	var left = pos[0];
	var topx = pos[1];
	while(win!=topwin&&win!=top){
		if(win.frameElement){
			pos = getElementXY(win.frameElement,win.parent);
			left = left + pos[0];
			topx = topx + pos[1];
		}
		win = win.parent;
	}
	return [left,topx];
}
/**
*滑动闭合
*@param {Object} 要闭合的div,diplay必须为""
*
*/
function accordionCollapse(o)
{
	if(o.processaccordion) return;
	if(o.style.display=="none") return;
	o.processaccordion=true;
	var tmpnode=o.nextSibling;
	if(tmpnode==null||!tmpnode.isAccordion)
	 {
	  tmpnode=document.createElement("div");
	  tmpnode.isAccordion=true;
	  tmpnode.style.overflow="hidden";
	  var parentNode=o.parentNode;
	  parentNode.insertBefore(tmpnode,o.nextSibling);
	  }
	    //alert(o.offsetWidth+":"+o.clientWidth)
	tmpnode.style.width=o.offsetWidth;
	tmpnode.style.height=o.offsetHeight;
	tmpnode.style.display="";
	o.style.width=o.clientWidth;
	o.style.position='absolute';
	var step=1;
	setTimeout(function(){return accordionIn.apply(o,[{'div':tmpnode,'acc':o,'height':o.offsetHeight,'progress':0,'step':step}])},41)
}

/**
*滑动展开
*@param {Object} 要展开的div,diplay必须为none
*
*/
function accordionExpand(o)
{
	if(o.processaccordion) return;
	if(o.style.display!="none") return;
	o.processAccoridion=true;
	var tmpnode=o.nextSibling;
	if(tmpnode==null||!tmpnode.isAccordion)
	 {
	  tmpnode=document.createElement("div");
	  tmpnode.isAccordion=true;
	  var parentNode=o.parentNode;
	  tmpnode.style.overflow="hidden";
	  parentNode.insertBefore(tmpnode,o.nextSibling);
	  }

	o.style.display="";
	o.style.width=o.clientWidth;
	o.style.position='absolute';
	tmpnode.style.width=o.offsetWidth;
	tmpnode.style.height=0;
	tmpnode.style.display="";
	var height=o.offsetHeight;
	var step=5;
	var tl=5;
	while(true)
	{
	 tl=tl+step*3
	 if(tl>=height) {break;}
	    else
	  step=step*3;
	}
	var s=height-(tl-step*3);
	tmpnode.style.height=s;
	o.style.marginTop=s*-1;
	o.style.clip="rect("+s+" auto auto auto)";
	setTimeout(function(){return accordionOut.apply(o,[{'div':tmpnode,'acc':o,'height':height,'progress':s,'step':step}])},41)
}


function accordionIn(o)
{
	o.progress=o.progress+o.step;
	if(o.step<12)
	        o.step=o.step+1
	       else
	        o.step=o.step*3;
	o.acc.style.clip="rect("+o.progress+" auto auto auto)";
	o.acc.style.marginTop=o.progress*-1;
	if(o.height-o.progress<0)
	    o.div.style.display="none";
	    else
	   o.div.style.height=o.height-o.progress;
	if(o.progress>=o.height)
	     {
		 o.acc.style.display="none"
		 o.div.style.display="none";
		 o.acc.processaccordion=false;
		// o.div.parentNode.removeNode(o.div,true);
		 }
	   else
	    setTimeout(function(){return accordionIn.apply(o,[o])},41)
}


function accordionOut(o)
{
	if(o.height-o.progress<=5) {
	      o.progress=o.progress+1;
		 }
	 else
	{
	    o.progress=o.progress+o.step;
	    o.step=o.step/3;
	}
	o.acc.style.clip="rect("+(o.height-o.progress)+" auto auto auto)";
	o.acc.style.marginTop=o.progress-o.height;
	o.div.style.height=o.progress;
	if(o.progress>=o.height)
	  {
	   o.acc.style.position="static";
	   o.div.style.display="none"
	   o.acc.processaccordion=false;
	  return;
	  }
	else
	setTimeout(function(){return accordionOut.apply(o,[o])},41)
}
/**
*msgbox
*@param {string}  提示信息
*
*/

function msgbox(msg)
{
	showModalCenter(contextPath+"/common/jsp/msgBox.jsp",[msg],null,null,null,"message notes");
}

/**
*重载form的submit方法
*@param {Object} form对象
*
*/

function checkOnsubmit(form)
{
   var oldsubmit = form.submit;
   var oldOnsubmit = form.onsubmit;

   form.oldsubmit = oldsubmit;
   form.oldOnsubmit = oldOnsubmit;

   form.submit = function()
					{
					  if (!checkForm(this))
					    return;
					else
					    this.oldsubmit();
					}
   form.onsubmit = function()
					{
					  if (checkForm(this)){
					  	if(this.oldOnsubmit){
						    return this.oldOnsubmit();
					  	}
					  }
					else
					   return false;
					}
}


var moveDivToCenter = function(divObj){
	var topWin= _get_top_window()||window;
	divObj.style.top = ((topWin.document.body.clientHeight-divObj.offsetHeight)/2+topWin.document.body.scrollTop) + "px";
	divObj.style.left = ((topWin.document.body.clientWidth-divObj.offsetWidth)/2+topWin.document.body.scrollLeft) + "px";
}

/**
 * 给对象增加阴影效果.
 * 
 */

function initShadow(o,doc)
{

    if(isFF)
    {
		  
	    doc=doc||document;
		var tmpnode=o.nextSibling;
		if(tmpnode==null||!tmpnode.isShadow)
		 {
		  var parentNode=o.parentNode;
		  var width=o.offsetWidth
		  var height=o.offsetHeight
		  var shadowContainter=$createElement("div",{doc:doc});
		  shadowContainter.isShadow=true;
		  parentNode.style.width=width;
		  parentNode.style.height=height;
		  shadowContainter.style.width=width+5;
		  shadowContainter.style.height=height+5;
		  shadowContainter.style.position="absolute";
		  shadowContainter.style.overflow="hidden";
		  shadowContainter.style.left=0;
		  shadowContainter.style.top=0;
	  	  shadowContainter.style.zIndex=-999;
		  parentNode.insertBefore(shadowContainter,o.nextSibling);
		  o.shadowContainter=shadowContainter;
		  shadowContainter.innerHTML='<TABLE style="width: 100%;height:100%" cellspacing="0" cellpadding="0"><TR height="5px"><TD width="5px"></TD><TD></TD><TD width="5px" class="eos-shadow-right-top"></TD></TR><TR><TD></TD><TD ><div ></div></TD><TD width="5px"  class="eos-shadow-right"></TD></TR><TR height="5px"><TD width="5px" class="eos-shadow-left-bottom"></TD><TD class="eos-shadow-bottom"></TD><TD width="5px" class="eos-shadow-corner"></TD></TR></TABLE>'
		  var center=shadowContainter.getElementsByTagName("div")[0];
		  center.style.width=width-5
		  center.style.height=height-5;
		  shadowContainter.center=center;
		  parentNode.style.width=width+5;
		  parentNode.style.height=height+5;
		  }
		  else
		  {
		  var parentNode=o.parentNode;
		  var width=o.offsetWidth
		  var height=o.offsetHeight
		  var shadowContainter=o.shadowContainter;
          shadowContainter.center.style.width=width-5
		  shadowContainter.center.style.height=height-5;
		  shadowContainter.style.width=width+5;
		  shadowContainter.style.height=height+5;
		  shadowContainter.style.left=0;
		  shadowContainter.style.top=0;
		  parentNode.style.width=width+5;
		  parentNode.style.height=height+5;
		  }
		  
	  }
	  else
	  {
	        doc=doc||document;
		var tmpnode=o.nextSibling;
		if(tmpnode==null||!tmpnode.isShadow)
		 {
		  var parentNode=o.parentNode;
		  var width=o.offsetWidth
		  var height=o.offsetHeight
		  
		  var shadowContainter=$createElement("div",{doc:doc});
		  shadowContainter.isShadow=true;
		  parentNode.style.width=width;
		  parentNode.style.height=height;
		  shadowContainter.style.width=width-4;
		  shadowContainter.style.height=height-4;
		  shadowContainter.style.position="absolute";
		  shadowContainter.style.left=0;
		  shadowContainter.style.top=0;
	  	  shadowContainter.style.zIndex=-999;
		  shadowContainter.style.background="#777";
		  shadowContainter.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=4)"
		  parentNode.insertBefore(shadowContainter,o.nextSibling);
		   o.shadowContainter=shadowContainter;
		  if(o.style.width=="")
		       {o.style.width=width;}
		  }
		  else
		  {
		  var parentNode=o.parentNode;
		  var width=o.offsetWidth
		  var height=o.offsetHeight
		  var shadowContainter=o.shadowContainter;
		  shadowContainter.isShadow=true;
		  parentNode.style.width=width;
		  parentNode.style.height=height;
		  shadowContainter.style.width=width-4;
		  shadowContainter.style.height=height-4;
		  
		  }
	  }
}
/**
 * 日历控件按钮的风格.
 * 
 */
function buttonMouseOver(o)
{
	addClass(o,"eos-button-over");
	addClass(o.firstChild,"eos-button-inner-over")
}

function buttonMouseOut(o)
{
	removeClass(o,"eos-button-over");
	removeClass(o.firstChild,"eos-button-inner-over")
}

function buttonMouseUp(o){
	if(isIE){
		removeClass(o,"eos-button-down");
		removeClass(o.firstChild,"eos-button-inner-down")
	}
}

function buttonMouseDown(o)
{
if(isIE)
{
	addClass(o,"eos-button-down");
	addClass(o.firstChild,"eos-button-inner-down")
}
}

function buttonForFF(o)
{
	addClass(o,"eos-button-ff");
	addClass(o.firstChild,"eos-button-inner-ff");
}

/**
 * 在ie下设置控件文本框与image对齐.
 * 
 */
function setEosControlStyleforIE()
{
	if(isIE)
	{
		var sheets=document["styleSheets"];
		var sheetLenght=sheets.length;
		for( var i=0;i<sheetLenght;i++)
		{
		   var rules=sheets[i].rules;
		   var ruleLength=rules.length;
		   for(var j=0;j<ruleLength;j++)
			   {
				  if(rules[j].selectorText==".eos-ic-button")
					  {
					   rules[j].style.verticalAlign="text-bottom";
					   }
			   }
		}
	}
}
eventManager.add(window,'load',setEosControlStyleforIE);


/**
 * 执行h:action提交功能的js.
 *　查找form中的_eosFlowAction并赋值，如果不存在，则生成再赋值 
 *
 */
function flowSubmit(o)
{

	 var parent=o.parentNode;
	//寻找控件所在form
	 while(parent!=null)
	 {
		 if( parent.tagName&&parent.tagName.toLowerCase()=="form" )break;
		   else
		   parent=parent.parentNode;
		 }
	 if (parent==null){alert("can not find form tag!");return;}
	 var hidden=$name("_eosFlowAction",parent);
     if(hidden==null) 
       { 
         hidden=$createElement("input",{type:'hidden',name:"_eosFlowAction"});
         parent.appendChild(hidden);
        }
       hidden.value=o.getAttribute("flowAction");
       parent.submit(); 
 
}

function getCurrentStyle(obj, prop){

                   if (obj.currentStyle) {

                            return obj.currentStyle[prop];     

                   }else if(window.getComputedStyle){

                            propprop = prop.replace (/([A-Z])/g, "-$1");           

                            propprop = prop.toLowerCase ();        

                            return document.defaultView.getComputedStyle (obj,null)[prop];

                   }

         }
 
 
         
function getFormByObj(obj)
{
 if(obj==null) return null;
 while(true)
 {
 obj=obj.parentNode;
 if(obj.tagName.toLowerCase()=="form"){ return obj}
 if(obj.tagName.toLowerCase()=="body") return null;
 }
}         

function initEosControlReset(form,obj)
{

   if(form.eosResetContorlList==null) 
             {  form.eosResetContorlList=[];
                form.eosResetContorlList.push(obj);}
   else 
   {
        form.eosResetContorlList.push(obj);
        return;
    }
   var oldreset = form.reset;
   var oldOnreset = form.onreset;
   form.oldreset = oldreset;
   form.oldOnreset = oldOnreset;

   form.reset = function()
					{   
					    this.oldreset();
        			
					
					}
   form.onreset = function()
					{
					 
					  	if(this.oldOnreset){
						     if(this.oldOnreset()==false) 
						            return false;
					  	}
			          //  this.oldreset();
	
					  setTimeout( function(){ 
					     var eosResetContorlList=form.eosResetContorlList;
	                        for(var i=0;i<eosResetContorlList.length;i++)
	                        {
	                          eosResetContorlList[i].reset();
	                          
	               
	                        }
                           },1	
			              )
					}
}


         
         
/*
function disableTAB()
{
var topWin=_get_top_window();
//alert(document.body.innerHTML)
var frames=topWin.frames;
for(var i=0;i<frames.length;i++)
{
var dom=frames[i].document;
eventManager.add(dom, "keydown", frames[i].processTAB);
}
}

function processTAB()
{
	if(eventManager.getKeyCode()==9)
	{
	eventManager.stopEvent();
	return false;
	}
}

function enableTAB()
{
var topWin=_get_top_window();
//alert(document.body.innerHTML)
var frames=topWin.frames;
for(var i=0;i<frames.length;i++)
{
var dom=frames[i].document;
try{
eventManager.remove(dom, "keydown", frames[i].processTAB);
}
catch(e)
{}
}
}
*/