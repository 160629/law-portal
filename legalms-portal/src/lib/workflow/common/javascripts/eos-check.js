var Eos_All_Message=new Array();
/**
* 验证字符串是否为空或者全部都是空格
* 通过验证返回true,否则返回false
**/
function isNull(str)
    {
      if(typeof(str)=="object") str=str.value;
      var i;
      if(str.length == 0)
		return true;
      for (i=0;i<str.length;i++)
        {
         if (str.charAt(i)!=' ')
			return false;
         }
      return true;
    }
    
/**
*用途：校验ip地址的格式
*返回：通过验证返回true,否则返回false；
**/
function isIP(str)
{
	if(typeof(str)=="object") str=str.value;
    var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式
	if(re.test( str ))
	{
	    if(RegExp.$1.length>3||RegExp.$2.length>3||RegExp.$3.length>3||RegExp.$4.length>3) return false;
		if( RegExp.$1 >0 && RegExp.$1 <256 && RegExp.$2<256 && RegExp.$3<256 && RegExp.$4<255) return true;
	}
	return false;
}

/**
* 校验是否为整数
* 检验通过返回true,否则返回false
**/
function isInteger(str)
{
	if(typeof(str)=="object") str=str.value;
	if (/^(\+|-)?\d+$/.test( str ))
	{
	   return true;
	}
	else
	{
	   return false;
	}
}

/**
* 校验是否为正整数
* 检验通过返回true,否则返回false
**/
function isPositiveInteger(str)
{
	if(typeof(str)=="object") str=str.value;
	if (/^(\+)?\d+$/.test( str ))
	{
	   return true;
	}
	else
	{
	   return false;
	}
}

/**
* 校验是否为url
* 检验通过返回true,否则返回false
**/
function isURL (str)
{
if(typeof(str)=="object") str=str.value;

	if(str.indexOf("://")!=-1)
	{
	 var schema=str.substr(0,str.indexOf("://"));
	 if(schema=="") return false;
	 schema=str.substr(str.indexOf("://")+3,schema.length);
	 if(schema=="") return false;
	}
    else
    {
     return false;
    }
	return true;

/*
	if(typeof(str)=="object") str=str.value;
    var schema=null;
	var host=null;
	var path;
	var hostpath=str;
	if(str.indexOf("://")!=-1)
	{
	schema=str.substr(0,str.indexOf("://"));
	hostpath=str.substr(str.indexOf("://")+3)
	}
    if(hostpath.indexOf("/")!=-1)
	{
	host=hostpath.substr(0,hostpath.indexOf("/"));
    path=hostpath.substr(hostpath.indexOf("/")+1);
	}
    else
	{
	host=hostpath;
	}

	var schemaReg= /^([A-Za-z]){1,64}$/;
	var hostReg=/^([A-Za-z0-9]{1}[_A-Za-z0-9\-]*\.)+[A-Za-z0-9]+[A-Za-z0-9]{1}$/;;
	var pathReg=/^[^:]+$/;

    if(schema!=null)
	{
	 if(!schemaReg.test( schema )) return false;
	}
   if(host!=null)
	{
	 var port=null;
	 if(host.indexOf(":")!=-1)
	 {
	  port=host.substr(host.indexOf(":")+1);
	  host=host.substr(0,host.indexOf(":"));
	  if(!isPort(port)) return false;
	 }
	 if(!hostReg.test( host )) return false;
	}
	if(path!=null)
	{
	 if(!pathReg.test( path )) return false;
	}
    return true;*/
}

/**
* 校验是否为数字,可以是负数和包含小数点,并且可按精度进行校验)
* len:长度   pric：精度（即小数位数)
* 满足精度：即数字整数位数不大于指定，且小数位数不大于指定精度。
* 校验通过则返回true,否则返回false
**/
function isDecimal(str,len,pric)
{
	if(typeof(str)=="object") str=str.value;
	if (/^(\+|-)?\d+($|\.\d+$)/.test( str ))
	{

	   var dotPos=str.indexOf(".");

       if(len!=null)
       {
       	var strLen=str.length;
       	if(dotPos!=-1) strLen=strLen-1;
       	   if(len<strLen) return false;
        }

        if(pric!=null)
        {
         if(dotPos==-1) return true;
         if(str.length-dotPos-1>pric) return false;
        }
	   return true;
	}
	else
	{
	   return false;
	}
}

/**
* 校验是否为socket端口号格式
* 检验通过返回true,否则返回false
**/
function isPort (str)
{
	if(typeof(str)=="object") str=str.value;
	if (/^\d+$/.test( str ))
	{
	   if(parseInt(str,10)>65535||parseInt(str,10)<=0) return false;
	   return true;
	}
	else
	{
	   return false;
	}
}

/**
*校验否符合E-Mail格式
*验证通过返回true,否则返回false
*/
function isEmail (str)
{
	if(typeof(str)=="object") str=str.value;
	var myReg = /^([-_A-Za-z0-9\.]+)@[A-Za-z0-9]{1}[_A-Za-z0-9\.]*\.[A-Za-z0-9]+$/;
	if(myReg.test( str )) return true;
	return false;
}

/**
*校验是否为日期(格式:yyyy-MM-dd,yyyy-MM-dd hh-mm-ss),如未提定格式,默认按yyyy-MM-dd校验
*验证通过返回true,否则返回false
**/
/*
function isDate(str,format)
{
	if(typeof(str)=="object") str=str.value;
	var date = str;
	var datePat;
	var year,month,day
	if(date.length==0) return false;
	if(format==null||format=="") format="yyyy-MM-dd";


	if(format=="yyyy-MM-dd")
	{
		datePat = /^(\d{4})-(\d{2})-(\d{2})$/;
        if(!datePat.test(date))	return false;

	}
	else
	if(format=="yyyy-MM-dd hh:mm:ss")
	{
	datePat = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/;
        if(!datePat.test(date))	return false;
		if(RegExp.$4>12||RegExp.$5>59||RegExp.$6>59) return false;
	}
	else
	return false;

	year=RegExp.$1;
	month=RegExp.$2;
	day=RegExp.$3;

	if (year < 1900 || year > 2100)
	{
		return false;
	}
	if (month < 1 || month > 12)
	{

		return false;
	}
	if (day < 1 || day > 31)
	{
		return false;
	}
	if ((month==4 || month==6 || month==9 || month==11) && day==31)
	{
		return false;
	}
	if (month==2)
	{
		var isleap=(year % 4==0 && (year % 100 !=0 || year % 400==0));
		if (day>29)
		{
			return false;
		}
		if ((day==29) && (!isleap))
		{
			return false;
		}
	}


	return true;
}
*/
/**
*校验字符串1是否以字符串2为结尾
*验证通过返回true,否则返回false
**/
function isLastMatch(str1,str2)
{
  if(typeof(str1)=="object") str1=str1.value;
  if(typeof(str2)=="object") str2=str2.value;
  var myReg=new RegExp(str2+"$");
  if(myReg.test(str1)) return true;
    else
    return false;
}

/**
*校验字符串1是否以字符串2为开头
*验证通过返回true,否则返回false
**/
function isFirstMatch (str1,str2)
{
  if(typeof(str1)=="object") str1=str1.value;
  if(typeof(str2)=="object") str2=str2.value;
  var myReg=new RegExp("^"+str2);
  if(myReg.test(str1)) return true;
    else
    return false;
}

/**
*校验字符串1是否包含字符串2
*验证通过返回true,否则返回false
**/
function isMatch (str1,str2)
{
  if(typeof(str1)=="object") str1=str1.value;
  if(typeof(str2)=="object") str2=str2.value;
  var myReg=new RegExp(str2);
  if(myReg.test(str1)) return true;
    else
    return false;
}

/**
* 校验输入手机号码是否正确
* 验证通过返回true,否则返回false
*校验规则：
*    一、移动电话号码为11或12位，如果为12位,那么第一位为0
*	 二、11位移动电话号码的第一位为"1"
*	 三、12位移动电话号码的第二位和第三位为"13"
*/
function isChinaMobileNo(str){
	if(typeof(str)=="object") str=str.value;
	var regu =/(^[1][0-9]{10}$)|(^0[1][0-9]{10}$)/;
	var re = new RegExp(regu);
	if (re.test( str )) {
	  return true;
	}
	return false;
}

/**
* 校验输入电话号码是否正确
* 验证通过返回true,否则返回false
*校验规则：
*    一、电话号码由数字、"("、")"和"-"构成
*	 二、电话号码为3到8位
*	 三、如果电话号码中包含有区号，那么区号为三位或四位
*	 四、区号用"("、")"或"-"和其他部分隔开
*/
function isPhoneNo(str)
{
	if(typeof(str)=="object") str=str.value;
	var regu =/(^([0][1-9]{2,3}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0][1-9]{2,3}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/;
	var re = new RegExp(regu);
	if (re.test( str )) {
	  return true;
	}
	 return false;
}

/**
*校验字符串是否只由英文字母和数字和下划线组成
*验证通过返回true,否则返回false
**/
function isNumberOr_Letter(str)
{
    if(typeof(str)=="object") str=str.value;
	if(/[^(\w*)]/.test(str))
	{
		return false;
	}
	return true;
}

/**
*校验字符串是否只由英文字母和数字组成
*验证通过返回true,否则返回false
**/
function isNumberOrLetter(str)
{
    if(typeof(str)=="object") str=str.value;
	if(/[^(a-z)*(A-Z)*(0-9)*]/.test(str))
	{
		return false;
	}
	return true;
}

/**
*校验字符串是否是合法的文件夹格式
*验证通过返回true,否则返回false
**/
function isFolder(str)
{
    if(typeof(str)=="object") str=str.value;
    var regu =/(^[^\.])/;
	var re = new RegExp(regu);
	
	if (!re.test( str )) {
		return false;
	}
	regu=/(^[^\\\/\?\*\"\<\>\:\|]*$)/;
	var re = new RegExp(regu);
	if (re.test( str )) {
		return true;
	}
	return false;
}

/**
*校验字符串是否只由汉字、字母、数字组成
*验证通过返回true,否则返回false
*/
function isChinaOrNumbOrLett(str){
	if(typeof(str)=="object") str=str.value;
	var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
	var re = new RegExp(regu);
	if (re.test( str )) {
	  return true;
	}
	return false;
}

/**
*校验字符串是否是中国大陆的邮政编码
*验证通过返回true,否则返回false
*/
function isChinaZipcode(str)
{
    if(typeof(str)=="object") str=str.value;
	if(!isInteger(str))
		return false;
	if(str.length!=6)
	{
		return false;
	}
	return true;
}

/**
*校验字符串是否是中国大陆的身份证号码
*验证通过返回true,否则返回false
*/
function isChinaIDNo(str)
{
	if(typeof(str)=="object") str=str.value;
	var aCity=EOS_CITY_LIST;
	var iSum = 0;
	var info = "";
	var strIDno = str;
	var idCardLength = strIDno.length;
	if(!/^\d{17}(\d|X|x)$/i.test(strIDno)&&!/^\d{15}$/i.test(strIDno))
	{

		return false;
	}

	//在后面的运算中x相当于数字10,所以转换成a
	strIDno = strIDno.replace(/X|x$/i,"a");

	if(aCity[parseInt(strIDno.substr(0,2))]==null)
	{

		return false;
	}

	if (idCardLength==18)
	{
		sBirthday=strIDno.substr(6,4)+"-"+Number(strIDno.substr(10,2))+"-"+Number(strIDno.substr(12,2));
		var d = new Date(sBirthday.replace(/-/g,"/"))
		if(sBirthday!=(d.getFullYear()+"-"+ (d.getMonth()+1) + "-" + d.getDate()))
		{

			return false;
		}

		for(var i = 17;i>=0;i --)
			iSum += (Math.pow(2,i) % 11) * parseInt(strIDno.charAt(17 - i),11);

		if(iSum%11!=1)
		{

			return false;
		}
	}
	else if (idCardLength==15)
	{
		sBirthday = "19" + strIDno.substr(6,2) + "-" + Number(strIDno.substr(8,2)) + "-" + Number(strIDno.substr(10,2));
		var d = new Date(sBirthday.replace(/-/g,"/"))
		var dd = d.getFullYear().toString() + "-" + (d.getMonth()+1) + "-" + d.getDate();
		if(sBirthday != dd)
		{

			return false;
		}
	}
	return true;
}

/**
*校验起止日期是否正确
*规则为两个日期的格式正确且结束如期>=起始日期。正确的日期格式为yyyyMMdd 日期格式 (1900年~2100年)。
*验证通过返回true,否则返回false
*/
function checkPeriod(str1,str2)
{
    if(typeof(str1)=="object") str1=str1.value;
    if(typeof(str2)=="object") str2=str2.value;
    if(!isDate(str1)) return false;
    if(!isDate(str2)) return false;
    if(str2>=str1)
         return true;
       else
         return false;
}

/**
*校验字符串是否符合正则表达式
*pattern：正则表达式
*flag：标志位
*  表示匹配的选项,可以对以下选项组合使用：
*   i: 忽略大小写 g: 全局匹配 m: 多行模式
*验证通过返回true,否则返回false
**/
function matchRegExp(str,pattern,flag)
{
	if(typeof(str)=="object") str=str.value;
    if(pattern==null||pattern=="") return false;
    var re;
    if(flag==null||flag=="")
		 re = new RegExp(pattern);
		 else
		 {
		 if(/[^mig]/.test(flag)) return false;
		 re=new RegExp(pattern,flag);
		 }
	if(re.test(str))
		return true;

	return false;
}

/**
* 根据对象的extAttr属性,进行合法性校验
* 如果校验失败，显示错误提示信息，
*/
function checkInput(obj)
{
	//处理extAttr属性
	if (processExtAttr(obj)) return true;

	//进行null校验
	var is_Null=obj.getAttr("allowNull");

	if(is_Null=="false")
	{  //不允许为空
	   if(isNull(obj))
	      {
	      	f_alert(obj,CHECK_MUST_INPUT);
	      	return false;
	      }
	      else
	      {
	      	// f_alert_verify_successful(obj);
	      }
    }
    else
    {
       if(isNull(obj))
       {
         f_alert_verify_successful(obj);
       	 return true;
       }
    }

	//进行长度校验
	var maxLength=obj.getAttr("maxLength");
	var minLength=obj.getAttr("minLength");
     if(maxLength!=null)
      {
        if(obj.value.length>maxLength )
        {
        	f_alert(obj,CHECK_INPUT_LENGTH_CANNOT_MORE_THAN+maxLength);
        	return false;
        }
      }
     if(minLength!=null)
      {
       if(obj.value.length<minLength )
        {
        	f_alert(obj,CHECK_INPUT_LENGTH_CANNOT_LESS_THAN+minLength);
        	return false;
        }
      }
   //进行规则校验
	var type=obj.getAttr("type");

	if(type!=null)
	{
	   try{
		if(!eval("f_check_"+type+"(obj)")) return false;
		else
		{
			 // f_alert_verify_successful(obj);
		}
	   }
	   catch(o)
	   {
	   alert(type+":"+CHECK_ERROROCCUR);
	   return false;
	   }

	}
   //行输入范围检验
   var maxValue=obj.getAttr("maxValue");
   var minValue=obj.getAttr("minValue");
   if(!(maxValue==null&&minValue==null))
    {
	  var inputValue;
	  var oMinValue;
	  var oMaxValue;

	    if(isNaN(parseFloat(obj.value))) inputValue=obj.value;
	  else
         inputValue=parseFloat(obj.value);

      if(maxValue!=null)
      {
         if(isNaN(parseFloat(maxValue))||minValue==null||isNaN(parseFloat(minValue))||isNaN(parseFloat(obj.value)))
		  {
		   oMaxValue=maxValue;
		   }
	       else
		  {
			oMaxValue= parseFloat(maxValue)
		  }
      if(inputValue>oMaxValue )
        {
        	f_alert(obj,CHECK_NOT_MORE_THAN+maxValue);
        	return false;
        }
      }

      if(minValue!=null)
      {
         if(isNaN(parseFloat(minValue))||maxValue==null||isNaN(parseFloat(maxValue))||isNaN(parseFloat(obj.value)))
		  {
		   oMinValue=minValue;
		   }
	       else
		  {
			oMinValue= parseFloat(minValue)
		  }
      if(inputValue<oMinValue )
        {
        	f_alert(obj,CHECK_NOT_LESS_THAN+minValue);
        	return false;
        }
      }
}
f_alert_verify_successful(obj);
return true;
}
/**
* 根据对象的extAttr属性,给对象生成新的方法和属性
*/
function processExtAttr(obj)
{
	//extAttr属性已经转换过,直接返回
	if(obj.EOS_extendedAttribute!=null) return false;
	//对象无校验属性,不须做校验
	var validateAttr = obj.validateAttr||obj.getAttribute("validateAttr");
	if(!validateAttr) return true;
    var attribute=new Object();
	var attrs=validateAttr.split(";");
	for(var i=0;i<attrs.length;i++)
	{
		var attr=attrs[i].split("=");
		if(attr.length!=2) continue;
		var attrName=attr[0];
		var attrValue=attr[1];
		attribute[attrName]=attrValue;
	}
	obj.EOS_extendedAttribute=attribute;
	obj.getAttr=function(attrName)
	{
		return this.EOS_extendedAttribute[attrName];
	}

}

/**
* 判断是否为数字，是则返回true,否则返回false
*/
function f_check_number(obj)
{
	if (/^\d+$/.test(obj.value))
	{
	   return true;
	}
	else
	{
	   f_alert(obj,CHECK_INPUT_NUMBER);
	   return false;
	}
}

/**
* 判断是否为自然数，是则返回true,否则返回false
*/
function f_check_naturalNumber(obj)
{
	var s = obj.value;
	
	if(s.length>1&&s.charAt(0)=='0')
	 {
		f_alert(obj,CHECK_INPUT_NATURALNUMBER);
	    return false;
	 }
	if (/^[0-9]+$/.test( s ))
	{
	   return true;
	}
	else
	{
		f_alert(obj,CHECK_INPUT_NATURALNUMBER);
	    return false;
	}
}

/**
* 判断是否为整数，是则返回true,否则返回false
*/
function f_check_integer(obj)
{
	if (isInteger( obj ))
	{
	   return true;
	}
	else
	{
		f_alert(obj,CHECK_IUPUT_INT);
	    return false;
	}
}

/**
* 判断是否为实数，是则返回true,否则返回false
*/
function f_check_float(obj)
{
	if (/^(\+|-)?\d+($|\.\d+$)/.test( obj.value ))
	{
	   return true;
	}
	else
	{
		f_alert(obj,CHECK_INPUT_FLOAT);
	   return false;
	}
}

/**
*用途：检查输入字符串是否只由汉字组成
*如果通过验证返回true,否则返回false
*/
function f_check_zh(obj){
	if (/^[\u4e00-\u9fa5]+$/.test(obj.value)) {
	  return true;
	}
	f_alert(obj,CHECK_INPUT_ZH);
	return false;
}

/**
* 判断是否为小写英文字母，是则返回true,否则返回false
*/
/*
function f_check_lowerCase(obj)
{
	if (/^[a-z]+$/.test( obj.value ))
	{
	   return true;
	}
	f_alert(obj,CHECK_INPUT_LLETTER);
    return false;
}
*/

/**
* 判断是否为大写英文字母，是则返回true,否则返回false
*/
/*
function f_check_upperCase(obj)
{
	if (/^[A-Z]+$/.test( obj.value ))
	{
	   return true;
	}
	f_alert(obj,CHECK_INPUT_ULETTER);
	return false;
}
*/

/**
* 判断是否为英文字母，是则返回true,否则返回false
*/
function f_check_letter(obj)
{
	if (/^[A-Za-z]+$/.test( obj.value ))
	{
	   return true;
	}
	f_alert(obj,CHECK_INPUT_LETTER);
	return false;
}

/**
* 判断是否为小写字母加数字，是则返回true,否则返回false
*/
/*
function f_check_lowerCaseOrNum(obj)
{
	if (/^[0-9a-z]+$/.test( obj.value ))
	{
	   return true;
	}
	f_alert(obj,CHECK_INPUT_LLETTER_NUMBER);
	return false;
}
*/

/**
* 判断是否为小写字母加数字，是则返回true,否则返回false
*/
/*
function f_check_upperCaseOrNum(obj)
{
	if (/^[0-9A-Z]+$/.test( obj.value ))
	{
	   return true;
	}
	f_alert(obj,CHECK_INPUT_ULETTER_NUMBER);
	return false;
}
*/
/**
* 判断是否为字母加数字，是则返回true,否则返回false
*/
/*
function f_check_letterOrNum(obj)
{
	if (/^[0-9A-Za-z]+$/.test( obj.value ))
	{
	   return true;
	}
	f_alert(obj,CHECK_INPUT_LETTER_NUMBER);
	return false;
}
*/

/**
用途：检查输入字符串是否只由汉字、字母、数字组成
输入：
	value：字符串
返回：
	如果通过验证返回true,否则返回false
*/
/*
function f_check_ZhOrNumOrLett(obj){    //判断是否是汉字、字母、数字组成
	var regu = "^[0-9a-zA-Z\u4e00-\u9fa5]+$";
	var re = new RegExp(regu);
	if (re.test( obj.value )) {
	  return true;
	}
	f_alert(obj,CHECK_INPUT_ZH_LETTER_NUMBER);
	return false;
}
*/

/**
用途：校验ip地址的格式
输入：strIP：ip地址
返回：如果通过验证返回true,否则返回false；
*/
function f_check_IP(obj)
{
    //var re=/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/; //匹配IP地址的正则表达式
	if(isIP( obj.value ))
	{
	  return true;
	}
	f_alert(obj,CHECK_INVALID_IP);
	return false;
}

/**
用途：检查输入对象的值是否符合端口号格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function f_check_port(obj)
{
	if(isPort(obj.value))
		return true;
	f_alert(obj,CHECK_INVALID_PORT);
	return false;
}

/**
用途：检查输入对象的值是否符合网址格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function f_check_URL(obj){
	//var myReg = /^((http:[\/][\/])?\w+([.]\w+|[\/]\w*)*)?$/;
	if(isURL( obj.value )) return true;
	f_alert(obj,CHECK_INVALID_WEBSITE);
	return false;
}

/**
用途：检查输入对象的值是否符合E-Mail格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function f_check_email(obj){
	//var myReg = /^([-_A-Za-z0-9\.]+)@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
	if(isEmail( obj.value )) return true;
	f_alert(obj,CHECK_INVALID_EMAIL);
	return false;
}

/**
用途：检查输入对象的值是否符合文件夹格式
输入：str 输入的字符串
返回：如果通过验证返回true,否则返回false
*/
function f_check_folder(obj){
	if(isFolder( obj.value )) return true;
	f_alert(obj,CHECK_INVALID_FOLDER);
	return false;
}

/*
要求：一、移动电话号码为11或12位，如果为12位,那么第一位为0
	 二、11位移动电话号码的第一位和第二位为"13"
	 三、12位移动电话号码的第二位和第三位为"13"
用途：检查输入手机号码是否正确
输入：
	s：字符串
返回：
	如果通过验证返回true,否则返回false
*/
function f_check_chinaMobile(obj){
	if (isChinaMobileNo( obj.value )) {
	  return true;
	}
	f_alert(obj,CHECK_INVALD_HANDPHONE);
	return false;
}

/*
要求：一、电话号码由数字、"("、")"和"-"构成
	 二、电话号码为3到8位
	 三、如果电话号码中包含有区号，那么区号为三位或四位
	 四、区号用"("、")"或"-"和其他部分隔开
用途：检查输入的电话号码格式是否正确
输入：
	strPhone：字符串
返回：
	如果通过验证返回true,否则返回false
*/
function f_check_phone(obj)
{
	//var regu =/(^([0][1-9]{2,3}[-])?\d{3,8}(-\d{1,6})?$)|(^\([0][1-9]{2,3}\)\d{3,8}(\(\d{1,6}\))?$)|(^\d{3,8}$)/;
	//var re = new RegExp(regu);
	if (isPhoneNo( obj.value )) {
	  return true;
	}
	f_alert(obj,CHECK_INVALID_PHONE);
	return false;
}

/**
 * 判断是否为邮政编码
 **/
function f_check_chinaZipcode(obj)
{
	if(!/^\d+$/.test(obj.value))
		{
		f_alert(obj,CHECK_POSTALCODE_MUST_NUMBER);
		return false;
		}
	if(obj.value.length!=6)
	{
		f_alert(obj,CHECK_INVAILID_POSTALCODE_LENGTH);
		return false;
	}
	return true;
}


/**
*功能：验证身份证号码是否有效
*/
function f_check_chinaIDNo(obj)
{
 if(isChinaIDNo(obj)) return true;
 else
 {
    f_alert(obj,CHECK_INVALID_ID);
	return false;
 }
}


/**
* 判断字符串是否符合指定的正则表达式
*/
function f_check_formatStr(obj)
{
	var regExp=obj.getAttr("regExpr");
	if(matchRegExp(obj,regExp))
		return true;
	f_alert(obj , CHECK_INVALID_EXP);
	return false;
}

/**
* 判断字符串是否符带长度和精度的数字
*/
function f_check_double(obj)
{
   var len=obj.getAttr("totalDigit");
   var pric=obj.getAttr("fracDigit");
   if( isDecimal(obj,len,pric)) return true;
   var msg=CHECK_INPUT_NUMBER;
   if(len!=null) msg=msg+CHECK_LEGNT_NOT_THAN+len+CHECK_WEI;
   if(pric!=null) msg=msg+CHECK_FRACTION_LENGTH_NOT_THAN+pric+CHECK_WEI;
   f_alert(obj , msg);
   return false;
}

/**
 *  显示提示信息*/
function f_alert(obj,alertInfo)
{
  try{
    checkTabPage(obj);
  }catch(e){
  }
  var message
  if(obj.getAttr)
   message=obj.getAttr("message");
  if(message!=null) alertInfo=message;
  f_alert_verify_failure(obj,alertInfo);
  f_alert_resetMessagePos();
  
}
/**
 *定位错误obj是否在tab页中
 *
 */
function checkTabPage(obj){
		var parent = obj.parentNode;
		while(parent && parent.getAttribute){
			var pageid = parent.eos_tabpage_id||parent.getAttribute("eos_tabpage_id");
			if(pageid){
				var tabpage = $id(pageid);
				if(tabpage){
					try{
						tabpage.getTabPane().selectTab(tabpage);
					}catch(e){

					}
				}
				break;
			}
			parent = parent.parentNode;
		}
}

/**
 *  检测表单中所有输入项的正确性，一般用于表单的onsubmit事件
 *
 **/
function checkForm(myform)
{
	var success=true;
	var first=null;
	var i;
	for (i=myform.elements.length-1;i>=0;i--)
	{
		if ((myform.elements[i].validateAttr||myform.elements[i].getAttribute("validateAttr")) + "" == "undefined") continue;
		if(myform.elements[i].disabled == true) continue;
		if(myform.elements[i].name==null||myform.elements[i].name=="")
		{
		 if(!(myform.elements[i].id!=null&&myform.elements[i].id.indexOf("_input")!=-1)) continue;//date,lookup,comboselect校验
		 }
		//var o=myform.elements[i];
		//如果控件,不做校验
		/*while(myform!=o)
		{
         if(o.style.display=="none"||o.style.visibility=="hidden") break;
		 else
		  o=o.parentNode;
		}
		if(o!=myform) continue;
		*/
		if (checkInput(myform.elements[i])==false)
		  {
		  	first=myform.elements[i];
			success=false;
		  }
	}
	if(success) return success;
	var type=first.type;
	if(type == "text" || type == "TEXT" || type == "textarea" || type == "TEXTAREA"){
		first.select();
	}
	return success;
}

function f_alert_getPosition(obj){
    var v=obj.id;
    if(v!=null)
    {
     var s=v.indexOf("_input");
     if(s!=-1) obj=$id(v.substr(0,s)+"_container")||obj; 
    }
	var top = parseInt(obj.style.top?obj.style.top:obj.offsetTop);
	var left = parseInt(obj.style.left?obj.style.left:obj.offsetLeft);
	// var top = obj.offsetTop;
	// var left = obj.offsetLeft;
	var target = obj;
	var noAbsolute = true;
	while (target = target.offsetParent)
	{
		if(target.tagName=="BODY") continue;
		top += parseInt(target.offsetTop)-parseInt(target.scrollTop);
		left += parseInt(target.offsetLeft)-parseInt(target.scrollLeft);
		if(target.style.position.toLowerCase()=="absolute"){
			noAbsolute = false;
		}
	}
   left=parseInt(left)+parseInt(obj.style.width?obj.style.width:obj.offsetWidth)+10+"px";

   top+="px";
	return {left:left,top:top};
}

function f_alert_create_Message_plane(obj,message)
{
  var div=document.createElement("DIV");
  div.className="alert_message"
  var pos=f_alert_getPosition(obj)
  div.style.top=pos.top;
  div.style.left=pos.left;
  if (obj.style.height=="") {
  	div.style.height = "";
  } else{
  	div.style.height=parseInt(obj.style.height)-2;
  };
 
  div.style.whiteSpace="nowrap";
  div.style.zindex=999;
  div.onclick=function(){
    this.hidden();
	 }
  div.show=function(message){
  /**改造***start*/
  	 this.innerHTML="&nbsp;"+message+"&nbsp;";
	 this.style.display='block';
	 this.style.zindex=999;
	 return;
  /**改造***start*/
  	 this.innerHTML="&nbsp;"+message+"&nbsp;";
    // this.style.display="";
	if( div.isLoading){
		if(div.timeout)clearTimeout(div.timeout);
		div.timeout=setTimeout(function(){return _showMessage.apply(div,[div,message])},10);}
	else
	 if(!this.isShow)
	  {
	 document.body.appendChild(this);
	 this.isShow=true;
	 this.isLoading=true;
	 setOpacity(this,0);
	 fx_fadeIn( this ,function(){return loadingFinished.apply(div,[div])},500 );
	 }
}
  div.hidden=function(){
  /**改造***start*/
	this.style.display='none';
	return;
  /**改造***end*/
	
	
	if( div.isLoading){
		if(div.timeout)clearTimeout(div.timeout);
		div.timeout=setTimeout(function(){return _hiddenMessage.apply(div,[div])},10);}
	else
	  {
	this.isLoading=true;
	this.isShow=false;
    fx_fadeOut( this ,function(){try{document.body.removeChild(div)}catch(e){};return loadingFinished.apply(div,[div])},400 );
	  }
	 }
   div.setPos=function(pos){
     this.style.top=pos.top;
     this.style.left=pos.left;
	 }
	 
  document.body.appendChild(div);
  div.show( message);
  obj.Eos_Message=div;
  Eos_All_Message[Eos_All_Message.length]=obj;//把校验的对象加入提示信息控件列表

}


function loadingFinished(div)
{
 this.isLoading=false;
}



function _hiddenMessage(div)
{
  if(div.isLoading)
	   div.timeout=setTimeout( function(){return _hiddenMessage.apply(div,[div])},10);
else
  div.hidden();
}

function _showMessage(div,msg)
{
  if(div.isLoading)
	   div.timeout=setTimeout( function(){return _showMessage.apply(div,[div,msg])},10);
else
  div.show(msg);
}

function f_alert_show_message(obj,message)
{
   if(obj.Eos_Message!=null)
     {
      f_alert_resetMessagePos();
      obj.Eos_Message.show(message);
      }
   else
  f_alert_create_Message_plane(obj,message)

}

function f_alert_hidden_message(obj) {

	if(obj.Eos_Message){
		if(obj.removeClass){
			obj.removeClass("verify_failure");
			obj.addClass("verify_successful");
		}
		obj.Eos_Message.style.display='none';
	}
	return;
	
	if (obj.Eos_Message != null) {
	
		obj.Eos_Message.hidden();
	}
}

function f_alert_verify_failure(obj,message)
{

removeClass(obj,"verify_successful");
addClass(obj,"verify_failure");
f_alert_show_message(obj,message)

}

function f_alert_verify_successful(obj)
{
  removeClass(obj,"verify_failure");
  addClass(obj,"verify_successful");
  f_alert_hidden_message(obj);
}

function f_alert_resetMessagePos(cb)
{
	for(var i=0;i<Eos_All_Message.length;i++)
	{
		var obj=Eos_All_Message[i];
		var pos=f_alert_getPosition(obj);
		obj.Eos_Message.setPos(pos);
		
		if(cb&&typeof(cb)=='function'){
			cb(obj,pos);
		}
	}
	return;
	
  for(var i=0;i<Eos_All_Message.length;i++)
  {
  	var pos=f_alert_getPosition(Eos_All_Message[i]);
    Eos_All_Message[i].Eos_Message.setPos(pos);
	
  }
}

function f_alert_hidden_all_message()
{
	/**f_alert_resetMessagePos(function(el,pos){
		el.style.display='none';
	});
	*/
	
	var myform = document.forms[0];
	if(myform){
		for (i=myform.elements.length-1;i>=0;i--){
			if ((myform.elements[i].validateAttr||myform.elements[i].getAttribute("validateAttr")) + "" == "undefined") continue;

			if(myform.elements[i].disabled == true) continue;
			if(myform.elements[i].name==null||myform.elements[i].name=="")
			{
			 if(!(myform.elements[i].id!=null&&myform.elements[i].id.indexOf("_input")!=-1)) continue;//date,lookup,comboselect校验
			 }
			 f_alert_hidden_message(myform.elements[i]);
		}
	}
	
  return;
  
  f_alert_resetMessagePos();
  for(var i=0;i<Eos_All_Message.length;i++)
  {
    Eos_All_Message[i].Eos_Message.hidden();
  }
}
eventManager.add(window, "resize", f_alert_resetMessagePos);


function regCheckEvent(myform,regEvent)
{
    if(myform==null) return;
	regEvent=regEvent||"blur";
	var i;
	for (i=myform.elements.length-1;i>=0;i--)
	{
		if ((myform.elements[i].validateAttr||myform.elements[i].getAttribute("validateAttr")) + "" == "undefined") continue;
		var temp = myform.elements[i];
		eventManager.add(temp,regEvent,function(evt){
			evt = eventManager.getEvent()||evt;
			var elem = evt.srcElement||evt.target;
			checkInput(elem);
		});
		//eval("var tmp"+i+"=myform.elements[i]");
	    //eval("eventManager.add(myform.elements[i], regEvent, function(){ return checkInput.apply( myform.elements[i],[tmp"+i+"] ) }  );")

	}
}

/**
*
*form中的元素失去焦点时校验
*
**/

function checkOnblur(myform)
{
 regCheckEvent(myform);
}

/**
*
*form中的元素即时校验
*
**/

function checkOnkeypress(myform)
{
 regCheckEvent(myform,"keyup");
 regCheckEvent(myform,"focus");

}



