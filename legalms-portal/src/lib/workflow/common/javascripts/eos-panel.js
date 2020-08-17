var _eos_colsed_panel=[];
var _eos_curr_open_panel=null;
/**
 * Panel的构造函数.
 * @param {Object} id
 */
function Panel(id){
	this.id = id;
	PageControl.add(id,this);

	this.container = null;
	this.title = null;
	this.onExpandFunc = null;
	this.onCloseFunc = null;


	this.status = null;
	this.button = null;
}
Panel.OPEN_STYLE_BUTTON = "PANEL_OPEN_BUTTON";
Panel.CLOSE_STYLE_BUTTON = "PANEL_CLOSE_BUTTON";
/**
 * Panel的初始化函数.
 */
Panel.prototype.init = function(){
	this.container = $id(this.id + "_container");
	this.button = $id(this.id + "_button");
	this.titleObj=$id(this.id + "_title");
	this.table = $id("_"+this.id + "_panel_table");
	this.freshButton();
	var panel = this;
	this.button.onclick = function(){
		panel.changeStatus();
	}
}

Panel.prototype.setTitle = function(title){
    this.title=title;
    this.titleObj.innerHTML=title;
}

Panel.prototype.getTitle = function(){
    return  this.title;
}

/**
 * Panel的刷新箭头图标函数.
 */
Panel.prototype.freshButton = function(){
	if(this.status){
		this.button.className = Panel.CLOSE_STYLE_BUTTON;
	}else{
		this.button.className = Panel.OPEN_STYLE_BUTTON;
	}
}
/**
 * Panel改变伸缩状态函数.
 */
Panel.prototype.changeStatus = function(){
	var obj = this.button;
	if(obj){
		if(!this.status){
			this.open(obj);
		}else{
			this.close(obj);
		}
	}
}


/**
 * Panel设置为开状态函数.
 */
Panel.prototype.open = function(obj){
	var table = $id("_"+this.id + "_panel_table");
	if(!table){
		return;
	}
	_eos_curr_open_panel=this;
	if(this.onExpandFunc){
		try{
			var result = eval(this.onExpandFunc + "();");
			if (result!=false){
				table.rows[1].style.display = "";
    			if(!this.backupHeight) 
	        	   { table.height=table.backupHeight;
				this.container.style.height=this.backupHeight;}
				this.status = true;
				this.freshButton();

			}
		}catch(e){}
	}else{
		table.rows[1].style.display = "";
    	if(this.backupHeight) 
		    {
    		this.container.style.height=this.height;
		}
		this.status = true;
		this.freshButton();
		if(this.needResize===true)
		{
		   _eos_colsed_panel.pop(this);
	        for(var i=0;i<_registryEvent.length;i++)
	        {
	           var e=_registryEvent[i];
	           if(e.obj==window&&e.type=="resize")
	            {
	              e.fn();
	            }
	        }
	        this.needResize=false;
        }	
	}
	_eos_curr_open_panel=null;
}
/**
 * Panel设置为关状态函数.
 */
Panel.prototype.close = function(obj){
	var table = $id("_"+this.id + "_panel_table");
	if(!table){
		return;
	}
	if(this.onCloseFunc){
		try{
            _eos_colsed_panel.push(this);
			var result = eval(this.onCloseFunc + "();");
			if (result!=false){
				table.rows[1].style.display = "none";
				this.backupHeight=this.container.style.height||this.container.height;
				this.height=this.container.style.height;
				this.container.style.height="20px";
				this.status = false;
				this.freshButton();
			}
		}catch(e){}
	}else{
		//accordionCollapse(table.rows[1]);//
        _eos_colsed_panel.push(this);
		table.rows[1].style.display = "none";
    	this.backupHeight=this.container.style.height||this.container.height;
		//table.height="20px";
		this.height=this.container.style.height;
		this.container.style.height="20px";
		this.status = false;
		this.freshButton();
	}

}
Panel.prototype.collapse=Panel.prototype.close;
Panel.prototype.expand=Panel.prototype.open