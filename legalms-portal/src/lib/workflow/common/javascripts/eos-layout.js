

var EOSResizeObjects=[];
var EOSResizeContainer=[];
/*
EOSResizeObjects.push($id("ccc_container"));
EOSResizeObjects.push($id("ccc1_container"));
registerTopContainer($id("ccc_container"))
registerTopContainer($id("ccc1_container"))
*/


function getTopContainer(obj)
	{
		var container=null
		while(true)
		{
			obj=obj.offsetParent;
			if(obj==null) 
			{ 
			if(container!=null)
			     {
			      if(container.getAttribute("height")!=null||container.style.height!="")
			      return container;
			     }
			     break;    
			  }
			if(obj.tagName.toLowerCase()=="table") 
			               container=obj;
		}
		return null;
	}
	
function registerTopContainer(obj)
	{
	var container=getTopContainer(obj);
	if(container==null) return false;
	for(var i=0;i<EOSResizeContainer.length;i++)
		{
		if(EOSResizeContainer[i]==container) return true;;
		}
	EOSResizeContainer.push(container);	
	return true;
	}
	
/*
*
*
*
*/
function eos_layout_doHResize()
{
	if(isFF)
		{
		//所有注册resize的对象改为不可见
		for(var i=0;i<EOSResizeObjects.length;i++)
		
			{
			if(_eos_curr_open_panel!=null)
			      if(!EOSResizeObjects[i].isInCurrPanel())
			         {
			         EOSResizeObjects[i].doAutoResizeS2=false;
			         continue;
			         }
			EOSResizeObjects[i].autoResizeS1();
			}
		
		//改变最外层container高度（为了重新计算）

		for(var i=0;i<EOSResizeContainer.length;i++)
			
			{
	
				EOSResizeContainer[i].style.height=EOSResizeContainer[i].offsetHeight-1;
			}
		
		setTimeout(_layout_auto_resize,1)
	}

}
function _layout_auto_resize()
{
	
	for(var i=0;i<EOSResizeContainer.length;i++)
		{
		//让浏览器重新计算外层container高度
		EOSResizeContainer[i].style.height=EOSResizeContainer[i].getAttribute("height");
		}
	for(var i=0;i<EOSResizeObjects.length;i++)
		{
		if(EOSResizeObjects[i].doAutoResizeS2===false)
		 { 
		      EOSResizeObjects[i].doAutoResizeS2=true;
			         continue;
		 }
		EOSResizeObjects[i].autoResizeS2();
		}
}
function _layout_setResised()
{

for(var i=0;i<_eos_colsed_panel.length;i++)
	{
	 _eos_colsed_panel[i].needResize=true;
	}
}

eventManager.add(window,"resize",_layout_setResised);

if(isFF)
{
eventManager.add(window,"load",eos_layout_doHResize);
eventManager.add(window,"resize",eos_layout_doHResize);
}