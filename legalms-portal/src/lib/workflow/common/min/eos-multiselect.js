function MultiSelect(a){this.id=a;this.container=$id(this.id+"_container");this.container.onmousedown=function(){eventManager.stopPropagation()};this.value=null;this.select=$id(this.id+"_select");this.hiddenInput=null;this.splitChar=",";this.jsonObj=null;PageControl.add(a,this)}MultiSelect.prototype.init=function(){this.hiddenInput=$id(this.id+"_hidden");this.initEvent()};MultiSelect.prototype.initEvent=function(){var a=this;function b(){a.refreshValue()}eventManager.add(this.select,"change",b)};MultiSelect.prototype.refreshInput=function(){str=this.value+this.splitChar;if(this.hiddenInput){this.hiddenInput.value=this.value}for(var a=0;a<this.select.options.length;a++){var b=this.select.options[a];var c=b.value+this.splitChar;if(str.indexOf(c)>-1){b.selected=true}else{b.selected=false}}};MultiSelect.prototype.refreshValue=function(){var b=[];var d=this.select.options;for(var c=0,a=d.length;c<a;c++){var e=d[c];if(e.selected){b.push(e.value)}}this.value=b.join(this.splitChar);if(this.hiddenInput){this.hiddenInput.value=str}};MultiSelect.prototype.setValue=function(a){this.hiddenInput.value=a;this.refreshInput()};MultiSelect.prototype.getValue=function(){this.refreshValue();return this.value};MultiSelect.prototype.setFocus=function(){};MultiSelect.prototype.lostFocus=function(){};MultiSelect.prototype.showEditor=function(){var a=getMaxZindex();this.container.style.zIndex=a;this.container.style.display=""};MultiSelect.prototype.hideEditor=function(){this.container.style.display="none"};MultiSelect.prototype.setPosition=function(d,c,b,a){this.container.style.position="absolute";this.container.zIndex=9999;this.container.style.left=d+"px";this.container.style.top=c+"px";this.container.style.width=b+"px"};MultiSelect.prototype.isFocus=function(){return true};MultiSelect.prototype.validate=function(){return true};EOS_DICT_DISPLAY_SEPERATOR=null;MultiSelect.prototype.getDisplayValue=function(e){if(e==null){e=this.getValue()}if(e===""){return""}var d;if(EOS_DICT_DISPLAY_SEPERATOR){d=EOS_DICT_DISPLAY_SEPERATOR}else{d=this.splitChar}var b=e.split(d);var f=[];for(var c=0,a=b.length;c<a;c++){f.push(this.jsonObj[b[c]]||b[c])}return f.join(d)};