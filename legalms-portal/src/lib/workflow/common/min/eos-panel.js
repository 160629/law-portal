var _eos_colsed_panel=[];var _eos_curr_open_panel=null;function Panel(a){this.id=a;PageControl.add(a,this);this.container=null;this.title=null;this.onExpandFunc=null;this.onCloseFunc=null;this.status=null;this.button=null}Panel.OPEN_STYLE_BUTTON="PANEL_OPEN_BUTTON";Panel.CLOSE_STYLE_BUTTON="PANEL_CLOSE_BUTTON";Panel.prototype.init=function(){this.container=$id(this.id+"_container");this.button=$id(this.id+"_button");this.titleObj=$id(this.id+"_title");this.table=$id("_"+this.id+"_panel_table");this.freshButton();var a=this;this.button.onclick=function(){a.changeStatus()}};Panel.prototype.setTitle=function(a){this.title=a;this.titleObj.innerHTML=a};Panel.prototype.getTitle=function(){return this.title};Panel.prototype.freshButton=function(){if(this.status){this.button.className=Panel.CLOSE_STYLE_BUTTON}else{this.button.className=Panel.OPEN_STYLE_BUTTON}};Panel.prototype.changeStatus=function(){var a=this.button;if(a){if(!this.status){this.open(a)}else{this.close(a)}}};Panel.prototype.open=function(obj){var table=$id("_"+this.id+"_panel_table");if(!table){return}_eos_curr_open_panel=this;if(this.onExpandFunc){try{var result=eval(this.onExpandFunc+"();");if(result!=false){table.rows[1].style.display="";if(!this.backupHeight){table.height=table.backupHeight;this.container.style.height=this.backupHeight}this.status=true;this.freshButton()}}catch(e){}}else{table.rows[1].style.display="";if(this.backupHeight){this.container.style.height=this.height}this.status=true;this.freshButton();if(this.needResize===true){_eos_colsed_panel.pop(this);for(var i=0;i<_registryEvent.length;i++){var e=_registryEvent[i];if(e.obj==window&&e.type=="resize"){e.fn()}}this.needResize=false}}_eos_curr_open_panel=null};Panel.prototype.close=function(obj){var table=$id("_"+this.id+"_panel_table");if(!table){return}if(this.onCloseFunc){try{_eos_colsed_panel.push(this);var result=eval(this.onCloseFunc+"();");if(result!=false){table.rows[1].style.display="none";this.backupHeight=this.container.style.height||this.container.height;this.height=this.container.style.height;this.container.style.height="20px";this.status=false;this.freshButton()}}catch(e){}}else{_eos_colsed_panel.push(this);table.rows[1].style.display="none";this.backupHeight=this.container.style.height||this.container.height;this.height=this.container.style.height;this.container.style.height="20px";this.status=false;this.freshButton()}};Panel.prototype.collapse=Panel.prototype.close;Panel.prototype.expand=Panel.prototype.open;