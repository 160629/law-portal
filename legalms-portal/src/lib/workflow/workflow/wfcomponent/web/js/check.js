    function checkMailAddr(s){
		var i = 1;
		var pos1,pos2,pos3,pos4;
		var bag = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-_@";
	
		if (hasSpace(s))
			return false;
	
		pos1 = s.indexOf("@");
		pos2 = s.indexOf(".");
		pos3 = s.lastIndexOf("@");
		pos4 = s.lastIndexOf(".");
		if ((pos1 <= 0)||(pos1 == s.length-1)||(pos2 <= 0)||(pos2 == s.length-1))
		{
			return false;
		}else{
			if((pos1 == pos2 - 1)||
			(pos1 == pos2 + 1) ||
			(pos1 != pos3)||	//find two '@'
			(pos4 < pos3))		//'.' should behind the '@'
			{
				return false;
			}
		}
		if (!isCharsInBag(s, bag))
		{
			return false;
		}
		return true;
	}
	
	var numberlist="0123456789.";
	function isCharsInBag(s, bag)
	{
		var c;
		for(var i = 0; i < s.length; i++)
		{
			c = s.charAt(i);
			if(bag.indexOf(c) == -1) return false;
		}
		return true;
	}
	

	function hasSpace(s){
		var whitespace = " \t\n\r";
		var c;
		for(var i = 0; i < s.length; i++)
		{
			c = s.charAt(i);
			if (whitespace.indexOf(c) >= 0)	return true;
		}
		return false;
	}
	
	function checkIsRequired(component){
		if(component.type=='checkbox'){
			if(!component.checked){
				alertMessage(component,"请选择必选项");
				component.focus();
				return false;
			}
		}else{
			if(isEmpty(component.value)){
				alertMessage(component,"请输入必须的值");
				component.focus();
				return false;
			}
		}
		return true;
	}
	
	function checkNumber(component){
		if(!isCharsInBag(component.value,numberlist)){
			alertMessage(component,"请输入一个数字类型的值");
			component.focus();
			component.select();
			return false;
		}else if(isNaN(component.value,numberlist)){
			alertMessage(component,"请输入一个数字类型的值");
			component.focus();
			component.select();
			return false;
		}else  if(!/^[0-9]{1,10}($|\.\d{1,5}$)/.test(component.value,numberlist)){
			if(component.value==''){
				return true;
			}
			alertMessage(component,"超出精度范围[999999999.99999]");
			component.focus();
			component.select();
			return false;
		}
		return true;
	}
	
	function checkMail(component){
		if(!checkMailAddr(component.value)){
			alertMessage(component,"Email地址格式不正确");
			component.focus();
			component.select();
			return false;
		}
		return true;
	}
	
	function checkFormField(formObj){
	 	for(i=0;i<formObj.elements.length;i++){
	 	//FIXME:在mf中，自己定义的属性必须getAttribute()取得
			if(formObj.elements[i].getAttribute('isrequired') == 'true'){
				if(!checkIsRequired(formObj.elements[i]))
					return false;
			}
			//alert(formObj.elements[i].name+' '+formObj.elements[i].value);
			if(formObj.elements[i].getAttribute('fieldType') == 'number'){
				//if(!f_check_number(formObj.elements[i]))换成webui的校验
				if(!checkNumber(formObj.elements[i]))
					return false;
			}
			if(formObj.elements[i].getAttribute('fieldType') == 'email'){
				//if(!f_check_email(formObj.elements[i]))
				if(!checkMail(formObj.elements[i]))
					return false;
			}
			//f_alert_hidden_message(formObj.elements[i]);
		}
		return true;
	}
	
	/**
	* 验证字符串是否为空或者全部都是空格
	* 通过验证返回true,否则返回false
	**/
	function isEmpty(str)
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
	
	function alertMessage(obj, message) {
		alert(message);
	}