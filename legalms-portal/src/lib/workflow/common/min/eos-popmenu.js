function PopMenu(a){this.id=a;PageControl.add(a,this);this.container=null;this.subMenuContainer=null;this.submenu=[];this.canClose=true;this.currMenu=null;this.level=0;this.openLevel=[];this.menuContainer=null;this.doc=document;this.win=window;this.onClickFunc=null;this.args=null;this.isShow=false}PopMenu.prototype.lazyInit=function(){this.win=_get_top_window()||window;_this=this;this.win.EOS.use("eos-popmenu",function(){this.init()},_this)};PopMenu.prototype.init=function(){this.win=_get_top_window()||window;this.doc=this.win.document;var d=getDocumentId(document);this.container=$id(this.id+d+"_container",this.doc);if(!this.container){this.container=$create("<div id='"+this.id+d+"_container' style='width:164px;overflow:hidden;position:absolute;display:none'></div>",this.doc);this.doc.body.appendChild(this.container)}this.container.style.width="164px";this.container.style.overflow="hidden";var g=getMaxZindex(this.win.document);this.container.style.zIndex=g+1;var f=$create("div",this.doc);this.menuContainer=$create("div",this.doc);if(isIE&&!isIE10){this.menuContainer.innerHTML='<iframe src="'+blankURL+'" style="position:absolute;z-index:'+this.zIndex+';width:expression(this.nextSibling.childNodes[0].offsetWidth);height:expression(this.nextSibling.childNodes[0].offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);" frameborder="0" ></iframe>'}this.menuContainer.appendChild(this.container);var c=$create("ul",this.doc);var b=$create("div",this.doc);this.shadowdiv=b;c.className="eos-popmenu-list";this.container.appendChild(b);b.appendChild(c);b.className="eos-popmenu";f.appendChild(this.menuContainer);this.doc.body.appendChild(f);f.style.zIndex=g+1;for(var a=0;a<this.submenu.length;a++){var e=this.submenu[a];c.appendChild(e.container);e.container.style.zIndex=g+1;e.zIndex=g+1;e.root=this;e.level=this.level+1;e.init()}this.initEvent();this.openLevel[0]=this};PopMenu.prototype.appendChild=function(a){this.submenu.push(a);a.parent=this};PopMenu.prototype.initEvent=function(){var b=this;function a(){b.hide(true)}};PopMenu.prototype.addObject=function(a){if(!a){return}var b=this};PopMenu.prototype.show=function(){PageControl.setFocus(this);this.container.style.display="";this.isShow=true;if(this.isShadowInit!=true){if(isFF){initShadow(this.shadowdiv,this.doc);this.shadowdiv.style.width=this.shadowdiv.parentNode.offsetWidth-7}else{initShadowIe(this.shadowdiv,this.doc)}this.isShadowInit=true}};PopMenu.prototype.setPosition=function(a,b){this.container.style.left=a+"px";this.container.style.top=b+"px"};PopMenu.prototype.hide=function(c){if(this.canClose||c){for(var a=0;a<this.submenu.length;a++){var b=this.submenu[a];b.hide(c)}if(this.container&&this.container.style){this.container.style.display="none";this.isShow=false;return true}return false}else{return false}};PopMenu.prototype.openByLevel=function(c){$debug(c);for(var a=0;a<this.openLevel.length;a++){var b=this.openLevel[a];if(!b){continue}if(a<=c){b.show()}else{b.hide(true)}}};function PopMenuItem(a){this.id=a;PageControl.add(a,this);this.parent=null;this.submemu=[];this.win=_get_top_window()||window;this.doc=this.win.document;this.container=$create("li",this.doc);this.subMenuContainer=null;this.url=null;this.name=null;this.seperator=false;this.params=[];this.icon=null;this.canClose=true;this.currMenu=null;this.level=0;this.root=null;this.onClickFunc=null;this.menuKey=null;this.onRefreshFunc=null;this.zIndex=0}PopMenuItem.prototype.init=function(){if(this.seperator){var a="<span></span>";this.container.className="eos-popmenu-line";this.container.innerHTML=a;if(isIE){this.container.style.height="2px"}else{this.container.style.height="1px"}}else{this.initContainer();this.initEvent();this.initSubMenu()}};PopMenuItem.prototype.initSubMenu=function(){if(this.hasChild()){var e=$create("div",this.doc);this.subMenuContainer=$create("div",this.doc);this.subMenuContainer.style.width="164px";this.subMenuContainer.style.overflow="hidden";if(isIE&&!isIE10){e.innerHTML='<iframe src="'+blankURL+'" style="position:absolute;z-index:'+this.zIndex+';width:expression(this.nextSibling.childNodes[0].offsetWidth);height:expression(this.nextSibling.childNodes[0].offsetHeight);top:expression(this.nextSibling.offsetTop);left:expression(this.nextSibling.offsetLeft);" frameborder="0" ></iframe>'}e.appendChild(this.subMenuContainer);this.subMenuContainer.style.display="none";this.subMenuContainer.style.position="absolute";this.subMenuContainer.style.zIndex=parseInt(this.zIndex)+1;var c=$create("ul",this.doc);var b=$create("div",this.doc);c.className="eos-popmenu-list";this.shadowdiv=b;this.subMenuContainer.appendChild(b);b.appendChild(c);for(var a=0;a<this.submemu.length;a++){var d=this.submemu[a];d.root=this.root;d.level=this.level+1;d.container.style.zIndex=parseInt(this.zIndex)+1;d.zIndex=this.zIndex+1;d.init();c.appendChild(d.container)}this.root.menuContainer.appendChild(e);b.className="eos-popmenu"}};PopMenuItem.prototype.initContainer=function(){var b=$create("a",this.doc);b.className="eos-popmenu-item";b.hidefocus=true;b.unselectable="on";b.href="#";this.container.appendChild(b);b.innerHTML=this.getNomalDiv();this.container.className="eos-popmenu-list-item"};PopMenuItem.prototype.getNomalDiv=function(){var c="";c+='<table cellpadding="0" cellspacing="0" style="width: 100%;height:25px;background-color:transparent;border-style:none;border:-width:0px">';c+="    <tr>";c+='    <td  class="overLeft" style="width: 5px;height:25px;"></td>';c+='        <td  class="overCenter"style="width: 20px;height:25px;">';c+='            <div style="width: 20px;height:25px;overflow:hidden;background-color:transparent;border-style:none;border:-width:0px">';this.icon=this.icon?addContextPath(this.icon):PICTURE_BLANK;c+="<img border='0' width='16px' height='20px' src='"+this.icon+"'>";c+="            </div>";c+="        </td>";c+='        <td class="overCenter" style="padding-left:10px;height:25px;background-color:transparent;border-style:none;border:-width:0px">';var b=this.getContent();if(!b||b==null||b=="null"){b=""}c+="           <div>"+b+"</div>";c+="        </td>";c+='        <td class="overCenter" align="right" style="padding-right:10px;height:25px;background-color:transparent;border-style:none;border:-width:0px">';var a=PICTURE_BLANK;if(this.hasChild()){a=POPMENU_ARROW_RIGHT}c+="<img border='0' src='"+a+"'></td>";c+='    <td  class="overRight" style="width: 5px;height:25px;"></td></tr></table>';return c};PopMenuItem.prototype.getContent=function(){if(this.onRefreshFunc){try{return eval(this.onRefreshFunc+"(this);")}catch(e){alert(e);return this.name}}var url=this.getURL();if(url){if(this.target){return"<a href='"+url+"' target='"+this.target+"'>"+this.name+"</a>"}else{return"<a href='"+url+"'>"+this.name+"</a>"}}else{return this.name}};PopMenuItem.prototype.initEvent=function(){var a=this;function b(){a.hide()}function d(){a.parent.canClose=true;var e=a.parent.currMenu;if(e&&e!=a){a.parent.currMenu.hide(true)}var e=a.root.openLevel[a.level];if(e&&e!=a){e.hide(true)}}function c(){var e=a.parent.currMenu;if(e&&e!=a){a.parent.currMenu.hide(true)}var e=a.root.openLevel[a.level];if(e&&e!=a){e.hide(true)}if(a.root.isShow){a.root.openLevel[a.level]=a;a.root.openByLevel(a.level);a.parent.canClose=false;a.parent.currMenu=a}return false}this.container.onmouseover=function(){eventManager.stopEvent();c();return false};this.container.onmouseout=function(){eventManager.stopEvent();d();a.root.openLevel[a.level]=null;return false};this.container.onclick=function(){eventManager.stopEvent();a.root.hide(true);a.onClick();return false}};PopMenuItem.prototype.getURL=function(){if(this.url){var c="";for(var a=0;a<this.params.length;a++){var b=this.params[a];c+="&"+b.key+"="+b.value}if(this.url.indexOf("?")<0){if(c.length>0){c="?"+c}c=c.replace("&","")}return this.url+c}return null};PopMenuItem.prototype.addParam=function(a,b){this.params.push({key:a,value:b})};PopMenuItem.prototype.hasChild=function(){return this.submemu.length!=0};PopMenuItem.prototype.appendChild=function(a){this.submemu.push(a);a.parent=this};PopMenuItem.prototype.showSubMenu=function(){if(this.hasChild()){var f=getPosition(this.container);this.subMenuContainer.style.left=(f.left-3+this.container.offsetWidth)+"px";this.subMenuContainer.style.top=f.top+"px";this.subMenuContainer.style.display="";if(this.subMenuContainer.offsetWidth<this.subMenuContainer.scrollWidth){this.subMenuContainer.style.width=this.subMenuContainer.scrollWidth+"px"}var a=getPosition(this.subMenuContainer);var c=this.doc||document;var b=a.left+this.subMenuContainer.offsetWidth;var e=c.body.clientWidth;if(b>e){var d=f.left-this.subMenuContainer.offsetWidth;if(d<0){d=0}this.subMenuContainer.style.left=d+"px"}if(this.isShadowInit!=true){if(isFF){initShadow(this.shadowdiv,this.doc);$debug(this.shadowdiv.parentNode.offsetWidth);this.shadowdiv.style.width=this.shadowdiv.parentNode.offsetWidth-7}else{initShadowIe(this.shadowdiv,this.doc)}this.isShadowInit=true}}};PopMenuItem.prototype.onClick=function(){var root=this.root;if(this.onClickFunc){try{eval(this.onClickFunc+"(this,root.args)")}catch(e){}}if(root.onClickFunc){try{eval(root.onClickFunc+"(this.menuKey,root.args)")}catch(e){}}};PopMenuItem.prototype.hide=function(c){if(this.canClose||c){if(this.hasChild()){for(var a=0;a<this.submemu.length;a++){var b=this.submemu[a];b.hide(c)}if(this.subMenuContainer&&this.subMenuContainer.style){this.subMenuContainer.style.display="none"}}}};PopMenuItem.prototype.show=function(){this.showSubMenu()};function showPopMenu(e,c){var d=$o(e);if(d){d.args=c;var b=eventManager.getEvent();var a=b.x||b.clientX;var g=b.y||b.clientY;if(isIE){var f=getAbsPos(document.body,d.win);a=a+f.left+d.doc.body.scrollLeft;g=g+f.top+d.doc.body.scrollTop}else{var f=getScreenPos(window,d.win);a=a+f.left;g=g+f.top}if(d.hide(true)){d.show();d.setPosition(a,g)}}}function hideMenu(b){var a=$o(b);if(a){a.hide(true)}}function getDocumentId(d){var a=_get_top_window();if(!a.docs){a.docs=[]}var b=0;for(;b<a.docs.length;b++){try{if(a.docs[b]==d){return b}}catch(c){break}}a.docs.push(d);return a.docs.length-1}PopMenu.prototype.bind=function(b,a){var c=this.id;if(b!=null){b.oncontextmenu=function(){showPopMenu(c,a);return false}}};function initShadowIe(g,f){f=f||document;var e=g.nextSibling;if(e==null||!e.isShadow){var b=g.parentNode;var c=g.offsetWidth;var a=g.offsetHeight;var d=$createElement("div",{doc:f});d.isShadow=true;b.style.width=c;b.style.height=a;d.style.width=c-8;d.style.height=a-8;d.style.position="absolute";d.style.left=0;d.style.top=0;d.style.zIndex=-999;d.style.background="#777";d.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius=4)";b.insertBefore(d,g.nextSibling);g.shadowContainter=d;g.style.width=c-4;g.style.height=a-4}};