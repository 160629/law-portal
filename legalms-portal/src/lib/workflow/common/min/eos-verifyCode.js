function VerifyCode(a){this.config=a}VerifyCode.prototype.init=function(){this.container=$id(this.config.name+"_container");if(this.config.hasInput==true){this.initInput()}this.initImg();PageControl.add(this.config.name,this)};VerifyCode.prototype.initInput=function(){if(this.config.style){this.text=$create("<input style="+this.config.style+">")}else{this.text=$create("input")}this.text.className=this.config.className||"";this.text.name=this.config.name;this.text.validateAttr=this.config.validateAttr||"";this.container.appendChild(this.text)};VerifyCode.prototype.initImg=function(){this.codeImage=$create("img");this.container.appendChild(this.codeImage);this.codeImage.style.verticalAlign="text-bottom";this.codeImage.style.marginLeft="6px";this.codeImage.title=VERIFYCODETITLE;this.imageUrl=contextPath+"/common/jsp/codeImage.jsp?name="+this.config.name+"&imageHeight="+this.config.imageHeight+"&length="+this.config.length+"&type="+this.config.type;this.codeImage.src=this.imageUrl;var a=this;eventManager.add(this.codeImage,"click",function(){return function(){this.codeImage.src=this.imageUrl+"&timestamp="+Math.random()}.call(a)})};