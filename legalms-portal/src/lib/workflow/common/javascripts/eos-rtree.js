//此脚本依赖:
//rtreedata.js;string.js中的trim()函数

/*rtree最终生成的html代码为
<span>
<div nowrap><IMG/>用于显示展开（关闭）的图片
	<IMG/>用于显示节点图片
	<span>root</span>
<div children style="{margin-left:20}">

</div>
</div>
<span>
*/

//----- RTree ---------------
function RTree( id, width, height,hasRoot){
	//JSON数据格式的支持
	var treeModel = new RTreeModel();
	treeModel.hasRoot=hasRoot;
	var treeView = new RTreeView( id, treeModel,  width, height);
	//bind( treeView, treeModel );
	//方法
	treeModel.setNodeExpandAction	= _rtreemodel_setNodeExpandAction;
	treeModel.getNodeExpandAction	= _rtreemodel_getNodeExpandAction;
	treeModel.getExpandRetXpaths	= _rtreemodel_getExpandRetXpaths;
	// treeModel.getExpandParam		= _rtreemodel_getExpandParam;
	// treeModel.loadNodeChild			= _rtreemodel_loadNodeChild;
	treeModel.initAttachParam		= _rtreemodel_initAttachParam;
	treeModel.getTreeNodeName		= _rtreemodel_getTreeNodeName;
	treeModel.getTreeNodeIcon		= _rtreemodel_getTreeNodeIcon;
	treeModel.setEntityInfo			= _rtreemodel_setEntityInfo;
	treeModel.getEntityInfo			= _rtreemodel_getEntityInfo;
	treeModel.showNodeMenu			= _rtreemodel_showNodeMenu;
	treeModel.addMenuItem			= _rtreemodel_addMenuItem;
	treeModel.onmenuclick			= _rtreemodel_onmenuclick;
	treeModel.getMovemenu			= _rtreemodel_getMovemenu;
	treeModel.isNodeMovable			= _rtreemodel_isNodeMovable;
	treeModel.moveNode				= _rtreemodel_moveNode;				//把一个节点移动到另一节点下面
	treeModel.setMoveAction			= _rtreemodel_setMoveAction;
	treeModel.getMoveAction			= _rtreemodel_getMoveAction;		//取得结点移动时调用的业务逻辑
	treeModel.getMoveParam			= _rtreemodel_getMoveParam;			//取得结点移动时调用业务逻辑的参数
	treeModel.clearup				= _rtreemodel_clearup;
	treeModel.setExpandInitParamFunc=_rtreemodel_setExpandInitParamFunc; //设置展开时自定义参数的函数
	treeModel.setMoveInitParamFunc  =_rtreemodel_setMoveInitParamFunc; //设置拖曳时自定义参数的函数
    treeModel.expandRoot            =_rtreemodel_expandRoot;
    // treeModel.preLoad            =_rtreemodel_preload;   
	//属性
	treeModel.treeView			= treeView;
	//treeModel.attachParam		= "";						//附加参数
	treeModel.nodeExpandActions	= new Object();				//节点展开时加载子节点的动作
	treeModel.entityInfos		= new Object();				//节点显示规则、动作等相关信息
	//treeModel.initParam			= treeModel.initAttachParam( attachParamFunction );
	
	//treeModel.menu				= new EOSTreeMenu( treeModel );
	//EOSTreeMenu.register( treeModel.menu );				//注册menu
	treeModel.move_node			= null;						//纪录被拖动节点
	treeModel.moveto_node		= null;						//纪录拖动目标节点
	//treeModel.move_menu			= new RTreeMoveMenu();		//拖动时的弹出菜单
	if(!isIE) 
	{
	  var container=$id(id.getAttribute("id")+"_container");
	  //if(registerTopContainer(container))  EOSResizeObjects.push(treeView);
    }
    
	return treeView;
}

var RTreeModel=function(){

};
EOS.override(RTreeModel,{
	dataType:EOS.dataType,
	/**@desc计算节点展开时的参数
	 */
	getExpandParam:function(rtreeNode){
		var entityName = rtreeNode.entity.name;
		var entityInfo = this.getEntityInfo( entityName );
		var InitParamFunc = entityInfo.InitExpandParamFunc;
		var submitXpath = entityInfo.submitXpath;
		var FuncParam = "";
		var nodeXmlParam;;
		FuncParam=fireUserEvent(InitParamFunc,[rtreeNode]);
		var fn=this.dataType=='json'?'toJson':'toString';
		
		if (submitXpath == "" || submitXpath == null) {
			nodeXmlParam = rtreeNode.entity[fn]();
		} else {
			var nodeEntityName = rtreeNode.entity.name;
			rtreeNode.entity.name = submitXpath;
			nodeXmlParam = rtreeNode.entity[fn]();
			rtreeNode.entity.name = nodeEntityName;
		}
		if(this.dataType=='json'){
			var param={};
			EOS.apply(param,FuncParam);
			EOS.apply(param,nodeXmlParam);
			return param;
		}else{
			return "<root><data>" +  nodeXmlParam + FuncParam + "</data></root>";
		}
	},
	renderNode:function(rtreeNode){
		var dataset=rtreeNode.ds;
		if(!dataset){
			return;
		}
		var entities = dataset.values;
		//根据节点的状态,设置节点的图标
		if (!rtreeNode.isroot) {
			if (entities.length == 0) {
				rtreeNode.hasChild = false;
				rtreeNode.isleaf = true
					rtreeNode.refreshExpendIcon();
				rtreeNode.icon.src = rtreeNode.openIconSrc;
				rtreeNode.childrenContainer.style.display = "none";
				rtreeNode.loadFinished = true;
				return
			} else {
				rtreeNode.hasChild = true;
				rtreeNode.isleaf = false
					rtreeNode.refreshExpendIcon();
			}
		} else {
			if (entities.length != 0) {
				rtreeNode.hasChild = true;
				rtreeNode.isleaf = false
					//rtreeNode.refreshExpendIcon();
			}
		}
		var childNode,
		entity,
		name,
		icon,
		isFirst,
		isLast,
		hasChild,
		preload,
		iconType;
		for (var i = 0; i < entities.length; i++) {
			var isFirst=i===0?true:false;
			var isLast=i===entities.length - 1?true:false;
			entity = entities[i];
			name = this.getTreeNodeName(entity);
			icon = this.getTreeNodeIcon(entity.name);
			iconType = this.getEntityInfo(entity.name).iconType;
			hasChild=!!(this.getEntityInfo(entity.name)).expandAction;
			childNode = new RTreeNode(rtreeNode, name, icon, entity, isFirst, isLast, hasChild, this.hasRoot, iconType);
			preload=this.getEntityInfo(entity.name).preload;
			
			rtreeNode.childrenContainer.appendChild(childNode);
			//预加载子节点
			if (hasChild && preload) {
				
				this.preLoad(childNode,function(ds){
					if(!ds.getLength()){
						childNode.setLeaf();
					}
				});
			}
			
			childNode.refresh();
		}
		rtreeNode.childrenContainer.style.display = "";
		rtreeNode.icon.src = rtreeNode.openIconSrc;
		
		rtreeNode.loadFinished = true;
	},
	loadNodeChild : function (rtreeNode, jsHandle) {
		var _this=this;
		this.loadNode(rtreeNode,function(ds,node){
			_this.renderNode(node);
			if(jsHandle){
				jsHandle(node);
			}
		});
	},
	loadNode:function(rtreeNode,cb){
		if (rtreeNode.isloadData){
			cb(rtreeNode,rtreeNode.dataset);
		}	
		var action = this.getNodeExpandAction(rtreeNode);
		var param = this.getExpandParam(rtreeNode);
		var xpathArray = this.getExpandRetXpaths(rtreeNode);
		if (!(action && xpathArray)) {
			rtreeNode.icon.src = rtreeNode.openIconSrc;
			rtreeNode.loadFinished = true;
			return;
		}
		
		var ajax = new HideSubmit(action);
		
		var entityName = rtreeNode.entity.name;
		var entityInfo = this.getEntityInfo(entityName);
		
		if (entityInfo.queryReturnValue) {
			ajax.setOutParam(entityInfo.queryReturnValue);
		}
		
		if (entityInfo.queryParamsInfo) {
			ajax.setParamsInfo(entityInfo.queryParamsInfo);
		}
		
		if (entityInfo.queryInoutParams) {
			ajax.setInoutParam(entityInfo.queryInoutParams);
		}
		var _this=this;
		ajax.onSuccess=function(){
			var dataset=null;
			if(this.dataType=='json'){
				var cex=entityInfo.childEntityXpaths;
				var ret=ajax.retJson;
				var arr;
				for(var i=0,len=cex.length;i<len;i++){
					arr=ret[cex[i]];
					if(arr){
						var ds=Json2Dataset(arr,cex[i]);
						if(dataset){
							dataset.appendDataset(ds);
						}else{
							dataset=ds;
						}
					}
				}
				dataset=dataset||new Dataset();
			}else{
				var retXmlDom = ajax.getXMLDom();
				var dataset = Dataset.create(retXmlDom, "root/data/" + xpathArray[0]);
				for (var i = 1; i < xpathArray.length; i++){
					dataset.appendDataset(Dataset.create(retXmlDom, "root/data/" + xpathArray[i]));
				}
			}
			rtreeNode.ds=dataset;
			cb(dataset,rtreeNode);
			//_this.renderNode(rtreeNode,jsHandle);
		}
		ajax.setDataType(this.dataType);
		
		ajax.submitXML(param);
	},
	preLoad:function(rtreeNode,cb) {
		this.loadNode(rtreeNode,function(ds){
			cb(ds,rtreeNode);
		});
	},
	clearup:function(){
		for(var t in this){
			this[t]=undefined;
		}
	}
	
});

/*
* 加载子节点
*/
/* function _rtreemodel_loadNodeChild(rtreeNode, jsHandle) {
	var dataset;
	if (rtreeNode.isloadData !== true) {
		var action = this.getNodeExpandAction(rtreeNode);
		var param = this.getExpandParam(rtreeNode);
		var xpathArray = this.getExpandRetXpaths(rtreeNode);
		
		if (!(action && xpathArray)) {
			rtreeNode.icon.src = rtreeNode.openIconSrc;
			rtreeNode.loadFinished = true;
			return;
		}
		
		var ajax = new HideSubmit(action);
		
		var entityName = rtreeNode.entity.name;
		var entityInfo = this.getEntityInfo(entityName);
		
		if (entityInfo.queryReturnValue) {
			ajax.setOutParam(entityInfo.queryReturnValue);
		}
		
		if (entityInfo.queryParamsInfo) {
			ajax.setParamsInfo(entityInfo.queryParamsInfo);
		}
		
		if (entityInfo.queryInoutParams) {
			ajax.setInoutParam(entityInfo.queryInoutParams);
		}
		
		ajax.submitXML(param);
		var retXmlDom = ajax.getXMLDom();
		
		dataset = Dataset.create(retXmlDom, "root/data/" + xpathArray[0]);
		for (var i = 1; i < xpathArray.length; i++)
			dataset.appendDataset(Dataset.create(retXmlDom, "root/data/" + xpathArray[i]));
	} else
		dataset = rtreeNode.dataset;
	var entities = dataset.values;
	//根据节点的状态,设置节点的图标
	if (!rtreeNode.isroot) {
		if (entities.length == 0) {
			rtreeNode.hasChild = false;
			rtreeNode.isleaf = true
				rtreeNode.refreshExpendIcon();
			rtreeNode.icon.src = rtreeNode.openIconSrc;
			rtreeNode.childrenContainer.style.display = "none";
			rtreeNode.loadFinished = true;
			if (jsHandle)
				jsHandle(rtreeNode);
			return
		} else {
			rtreeNode.hasChild = true;
			rtreeNode.isleaf = false
				rtreeNode.refreshExpendIcon();
		}
	} else {
		if (entities.length != 0) {
			rtreeNode.hasChild = true;
			rtreeNode.isleaf = false
				//rtreeNode.refreshExpendIcon();
		}
	}
	var childNode,
	entity,
	name,
	icon,
	isFirst,
	isLast,
	hasChild,
	iconType;
	for (var i = 0; i < entities.length; i++) {
		if (i == 0)
			isFirst = true;
		else
			isFirst = false;
		
		if (i == entities.length - 1)
			isLast = true;
		else
			isLast = false;
		var entity = entities[i];
		var name = this.getTreeNodeName(entity);
		var icon = this.getTreeNodeIcon(entity.name);
		var iconType = this.getEntityInfo(entity.name).iconType;
		if (!(this.getEntityInfo(entity.name)).expandAction)
			hasChild = false;
		else
			hasChild = true;
		var childNode = new RTreeNode(rtreeNode, name, icon, entity, isFirst, isLast, hasChild, this.hasRoot, iconType);
		rtreeNode.childrenContainer.appendChild(childNode);
		//预加载子节点
		if (hasChild && this.getEntityInfo(entity.name).preload == true) {
			if (this.preLoad(childNode) == false) {
				childNode.setLeaf();
			}
		}
		
		childNode.refresh();
	}
	rtreeNode.childrenContainer.style.display = ""
		//accordionExpand(rtreeNode.childrenContainer);
		rtreeNode.icon.src = rtreeNode.openIconSrc;
	if (jsHandle)
		jsHandle(rtreeNode);
	rtreeNode.loadFinished = true;
} */
/* 
function _rtreemodel_preload(rtreeNode)
{
	var action = this.getNodeExpandAction( rtreeNode );
	var param = this.getExpandParam( rtreeNode );
	var xpathArray = this.getExpandRetXpaths( rtreeNode );
    rtreeNode.isloadData=true;
	if( !(action && xpathArray) )
		{
		 rtreeNode.icon.src=rtreeNode.openIconSrc ;
	     rtreeNode.loadFinished=true;
	     return false;
	     }

		var ajax=new HideSubmit(action);

		var entityName = rtreeNode.entity.name;
		var entityInfo = this.getEntityInfo( entityName );


		if(entityInfo.queryReturnValue){
			ajax.setOutParam(entityInfo.queryReturnValue );
		}

		if(entityInfo.queryParamsInfo){
			ajax.setParamsInfo(entityInfo.queryParamsInfo );
		}

		if(entityInfo.queryInoutParams){
			ajax.setInoutParam(entityInfo.queryInoutParams );
		}


    ajax.submitXML(param);
	var retXmlDom=ajax.getXMLDom();
    var dataset=Dataset.create(retXmlDom,"root/data/"+xpathArray[0]);
		for(var i=1;i<xpathArray.length;i++)
	    dataset.appendDataset(Dataset.create(retXmlDom,"root/data/"+xpathArray[i]));
	    rtreeNode.dataset=dataset;
	   	var entities = dataset.values;
	   	if (entities.length==0)return false;
	   	   else
	   	   return true;

} */

function _rtreemodel_expandRoot() {
	var rootNode = new RTreeRootNode(new Entity("root"), this);
	rootNode.level = 0;
	this.treeView.rootNode = rootNode;
	this.treeView.appendChild(rootNode);
	this.loadNodeChild(rootNode);
}

function _rtreemodel_setNodeExpandAction( entityName, bizAction, childEntityXpaths )
{
	var entityInfo = this.getEntityInfo( entityName );
	entityInfo.expandAction = bizAction;
	entityInfo.childEntityXpaths = childEntityXpaths;
}
/**
 *设置Expand时初始化参数的函数
 */
function _rtreemodel_setExpandInitParamFunc( entityName,InitParamFunc )
{
	var entityInfo = this.getEntityInfo( entityName );
	entityInfo.InitExpandParamFunc     = InitParamFunc;					//初始化的函数
}

/**
 *设置Move时初始化参数的函数
 */
function _rtreemodel_setMoveInitParamFunc( entityName,InitParamFunc )
{
	var entityInfo = this.getEntityInfo( entityName );
	entityInfo.InitMoveParamFunc     = InitParamFunc;					//初始化的函数
}

/**
 * 取得节点展开时的动作
 */
function _rtreemodel_getNodeExpandAction( rtreeNode )
{

	var entityName = rtreeNode.entity.name;
	var entityInfo = this.getEntityInfo( entityName );
	return entityInfo.expandAction;
}

/**
 * 取得节点展开时，子节点数据的xpath，返回值为xpath数组
 */
function _rtreemodel_getExpandRetXpaths( rtreeNode )
{
	var entityName = rtreeNode.entity.name;
	var entityInfo = this.getEntityInfo( entityName );

	return  entityInfo.childEntityXpaths;
}

/**
 * 计算节点展开时的参数
 */
 /* JSON数据格式支持，所有参数都变为XML形式，后期转换为XML */
function _rtreemodel_getExpandParam( rtreeNode ){

	//获得初始化参数的函数,并传递rtreeNode过去.
	var entityName = rtreeNode.entity.name;
	var entityInfo = this.getEntityInfo( entityName );
	var InitParamFunc = entityInfo.InitExpandParamFunc;
	var submitXpath = entityInfo.submitXpath;
	var FuncParam = "";
	var nodeXmlParam;
	FuncParam=fireUserEvent(InitParamFunc,[rtreeNode]);

    if(submitXpath==""||submitXpath==null)
    {
    nodeXmlParam=rtreeNode.entity.toString();
    }
    else
    {
    var nodeEntityName=rtreeNode.entity.name;
    rtreeNode.entity.name=submitXpath;
    nodeXmlParam=rtreeNode.entity.toString();
    rtreeNode.entity.name=nodeEntityName;
    }
	return "<root><data>" +  nodeXmlParam + FuncParam + "</data></root>";
}
 
//初始化附加参数
function _rtreemodel_initAttachParam( attachParamFunction )
{
	if( attachParamFunction && isUserEventDefined(attachParamFunction) )
	{
		return fireUserEvent( attachParamFunction, []);
	}else
	{
		return "";
	}
}

/**
 * 根据表达式，取得节点的显示值
 */
function _rtreemodel_getTreeNodeName( entity )
{

	var entityName = entity.name;
	var entityInfo = this.getEntityInfo( entityName );
	var rule = entityInfo.expression;
	var value=entity.getProperty(rule);
	if (value==null)
	  return rule;
	else
	  return value;
/*
	if( rule && rule != "" )
	{
		var exp = /\$\[(\w*)\]/;
		var display = rule;
		var field = "";
		for( var rs = display.match( exp ); rs; rs = display.match( exp ) )
		{
			field = rs[1];
			display = display.replace(exp, entity.getProperty(field));
		}
		return display;
	}else
	{
		return entityName;
	}
*/
}

/**
 * 取得节点的图标
 */
function _rtreemodel_getTreeNodeIcon( entityName )
{
	var entityInfo = this.getEntityInfo( entityName );

	return entityInfo.iconSrc;
}

/**
 * 得到节点的相关信息
 */
function _rtreemodel_getEntityInfo( entityName )
{
	entityName = entityName.toLowerCase();
	var entityInfos = this.entityInfos;

	var _entityInfo;
	eval( "_entityInfo = entityInfos." + entityName );
	if( !_entityInfo )
	{
		_entityInfo = new _rtree_EntityInfo();
		eval( "entityInfos." + entityName + "=_entityInfo;" );
	}

	return _entityInfo;
}
/**
 * 设置节点的显示规则
 * 规则表达式exp中，遇到$[fieldname]的地方，用entity的field替代，exp中的其他字符不作修改
 */
function _rtreemodel_setEntityInfo(entityName, exp, iconSrc, onclick, onrefresh, ondblclick,iconType,
InitExpandParamFunc,childEntityXpaths,expandAction,submitXpath,preload,
queryReturnValue,
queryParamsInfo,
queryInoutParams

)
{
	entityName = entityName.toLowerCase();
	var entityInfo = this.getEntityInfo( entityName );
	entityInfo.expression	= exp;			//显示表达式
	entityInfo.iconSrc		= iconSrc;		//图标路径
	entityInfo.onrefresh	= onrefresh;	//刷新节点时调用的动作
	entityInfo.onclick		= onclick;		//onclick动作
	entityInfo.ondblclick	= ondblclick;	//ondblclick动作
	entityInfo.InitExpandParamFunc	= InitExpandParamFunc;
	entityInfo.childEntityXpaths	= childEntityXpaths;
	entityInfo.expandAction	= expandAction;
	entityInfo.iconType	= iconType;
	entityInfo.submitXpath=submitXpath;
	entityInfo.preload=preload;
	entityInfo.queryReturnValue=queryReturnValue;
	entityInfo.queryParamsInfo=queryParamsInfo;
	entityInfo.queryInoutParams=queryInoutParams;
}

function _rtreemodel_setMoveAction( moveEntity, toEntity, bizAction,InitParamFunc,moveReturnValue,moveParamsInfo,moveInoutParams )
{
	var moveActions = this.getEntityInfo( moveEntity ).moveActions;
	var index;
	eval( "index = moveActions." + toEntity + ";" );

	if( !index )
	{
		index = moveActions.length;
		eval( "moveActions." + toEntity + " = index;" );
	}
	var moveObj=new Object();
	moveObj.action=bizAction;
	moveObj.InitParamFunc=InitParamFunc;

	moveObj.moveReturnValue=moveReturnValue;
	moveObj.moveParamsInfo=moveParamsInfo;
	moveObj.moveInoutParams=moveInoutParams;

	moveActions[index] = moveObj;
}

/**
 * 判断节点是否可以被拖动
 */
function _rtreemodel_isNodeMovable( move_node )
{
	var entityName = move_node.entity.name;

	var entityInfo = this.getEntityInfo( entityName );
	var moveActions = entityInfo.moveActions;

	if( moveActions.length > 0 )
		return true;
	else
		return false;
}

/**
 * 把一个节点移动到另一节点下面
 */
function _rtreemodel_moveNode() {
	
	if (isCanMoveTo(document.moveModel, document.movetoModel) == false)
		return;
	
	//	if(!document.movetoModel) return;
	var move_node = this.move_node;
	var moveto_node = document.movetoModel.moveto_node;
	this.move_node = null;
	this.moveto_node = null;
	this.move_menu.hide();
	
	//if( !move_node || !moveto_node ) return;
	
	var parent_node = move_node.getParent();
	
	var moveAction = this.getMoveAction(move_node, moveto_node);
	if (moveAction) { //可以移动,执行设置的动作
		var beforeMove = move_node.getTree().beforeMove;
		
		if (beforeMove)
			if (beforeMove(move_node, moveto_node) == false)
				return; //执行拖动前的自定义方法
		
		
		var moveParam = this.getMoveParam(move_node, moveto_node);
		
		var ajax = new HideSubmit(moveAction)
			
			var entityName = move_node.entity.name;
		var entityInfo = this.getEntityInfo(entityName);
		
		if (entityInfo.queryReturnValue) {
			ajax.setOutParam(entityInfo.queryReturnValue);
		}
		
		if (entityInfo.queryParamsInfo) {
			ajax.setParamsInfo(entityInfo.queryParamsInfo);
		}
		
		if (entityInfo.queryInoutParams) {
			ajax.setInoutParam(entityInfo.queryInoutParams);
		}
		
		ajax.submitXML(moveParam);
		var tree = move_node.getTree();
		var afterMove = tree.afterMove;
		if (afterMove) {
			if (tree.afterMove(ajax) == false)
				return;
		}
		var isReloadMoveNodeParent;
		var isReloadMoveToNodeParent;
		isReloadMoveNodeParent = !move_node.getParent().isChildOf(moveto_node);
		isReloadMoveToNodeParent = !moveto_node.isChildOf(move_node.getParent());
		if (isReloadMoveNodeParent)
			move_node.getParent().reloadChild();
		if (isReloadMoveToNodeParent)
			moveto_node.reloadChild();
		
	}
}

/**
 * 取得结点移动时调用的业务逻辑
 */
function _rtreemodel_getMoveAction( move_node, moveto_node )
{
  var toTreeId=findRTree(moveto_node).id;
	var entityName = move_node.entity.name;
	var toEntityName = moveto_node.entity.name;
	var entityInfo = this.getEntityInfo( entityName );
	var moveActions = entityInfo.moveActions;
	var index;
	eval( "index = moveActions." + toTreeId+"_"+toEntityName + ";");
	if( typeof(index) != "undefined"  )
		return moveActions[index].action;
	else
		return null;
}

/**
 * 取得结点移动时调用业务逻辑的参数
 */
function _rtreemodel_getMoveParam( move_node, moveto_node )
{
	//获得初始化参数的函数,并传递move_node, moveto_node过去.

    var toTreeId=findRTree(moveto_node).id;

	var entityName = move_node.entity.name;
	var toEntityName=moveto_node.entity.name;
	var entityInfo = this.getEntityInfo( entityName );
	var InitParamFunc = "";
	var moveActions = entityInfo.moveActions;
	var index;
	eval( "index = moveActions." + toTreeId+"_"+toEntityName + ";" );
	if( typeof(index) != "undefined"  )
		{

       InitParamFunc=moveActions[index].InitParamFunc;
		}
	var from_node = move_node.getParent();
	var FuncParam = "";

	/*if( typeof(InitParamFunc) != "undefined" && InitParamFunc!="" && InitParamFunc!=null){
		FuncParam = eval(InitParamFunc + "( move_node, moveto_node )");
	}*/
	FuncParam=fireUserEvent(InitParamFunc,[move_node,moveto_node]);
	var fromNodeName=from_node.entity.name;
	var movetoNodeName=moveto_node.entity.name;
	/*
	//与la2保持兼容,movenode的entityName不受submitXpath影响
	var submitXpath=entityInfo.submitXpath;
	 if(!(submitXpath==""||submitXpath==null))
    {
    move_node.entity.name=submitXpath;
    }
    */
    
	from_node.entity.name="from";
	moveto_node.entity.name="to";
	var returnValue="<root><data>" + FuncParam + this.initParam +  from_node.entity +  moveto_node.entity  + move_node.entity + "</data></root>";
    from_node.entity.name=fromNodeName;
	moveto_node.entity.name=movetoNodeName;
	
	//move_node.entity.name=entityName;
	
	return returnValue;
}


/**
 * 清除model
 */
function _rtreemodel_clearup()
{
	var treeModel = this;
	//方法
	treeModel.setNodeExpandAction	= null;
	treeModel.getNodeExpandAction	= null;
	treeModel.getExpandRetXpaths	= null;
	treeModel.getExpandParam		= null;
	treeModel.loadNodeChild			= null;
	treeModel.initAttachParam		= null;
	treeModel.getTreeNodeName		= null;
	treeModel.getTreeNodeIcon		= null;
	treeModel.setEntityInfo			= null;
	treeModel.getEntityInfo			= null;
	treeModel.showNodeMenu			= null;
	treeModel.addMenuItem			= null;
	treeModel.onmenuclick			= null;
	treeModel.getMovemenu			= null;
	treeModel.isNodeMovable			= null;
	treeModel.moveNode				= null;
	treeModel.setMoveAction			= null;
	treeModel.getMoveAction			= null;
	treeModel.getMoveParam			= null;
	treeModel.clearup				= null;

	//属性
	treeModel.treeView			= null;
	treeModel.attachParam		= null;
	treeModel.nodeExpandActions	= null;
	treeModel.entityInfos		= null;
	treeModel.initParam			= null;
	treeModel.menu				= null;
	treeModel.move_node			= null;
	treeModel.moveto_node		= null;
	treeModel.move_menu			= null;
}

/**
 * 存储节点相关信息
 */
function _rtree_EntityInfo()
{
	//属性
	this.expandAction = null;		//展开动作
	this.moveActions = new Array();	//移动动作
	this.childEntityXpaths = [];	//子节点数据xpath
	this.expression	= "";			//显示表达式
	this.iconSrc	= "";			//图标路径
	this.onrefresh	= "";			//刷新节点时调用的动作
	this.onclick	= "";			//onclick动作
	this.ondblclick	= "";			//ondblclick动作
	this.menuItems	= new Array()	//节点右键菜单项
	this.InitMoveParamFunc = null;  //拖曳时初用户自定义初始化函数的参数
	this.InitExpaneParamFunc = null;//展开时初用户自定义初始化函数的参数
	this.submitXpath="";//用于节点提交的xpathName
	return this;
}

/**
 *
 */
function _rtreemodel_addMenuItem( entityName, name, onclick )
{
	var entityInfo = this.getEntityInfo( entityName );

	entityInfo.menuItems.push( new EOSTreeMenuItem( name, onclick ) );
}
/**
 * 显示节点右键菜单
 */
function _rtreemodel_showNodeMenu( rtreeNode )
{
    var tree=rtreeNode.getTree();
    if(tree.beforeShowMenu&&tree.beforeShowMenu(rtreeNode)===false) return;
	var entityName = rtreeNode.entity.name;
	var entityInfo = this.getEntityInfo( entityName );
	var menuItems = entityInfo.menuItems;
	if( menuItems.length > 0 )
	{
		for( var i = 0; i < menuItems.length; i++ )
		{
			if(i!=0){
				var topwindow=_get_top_window();
	            var div = topwindow.document.createElement( "div" );
	            div.className="rtree-popmenu-item-line";
			  this.menu.insertItem(div);
			  }
			this.menu.insertItem( menuItems[i] );
		}
	    tree.afterShowMenu&&tree.afterShowMenu(rtreeNode,this.menu);
		this.menu.show();
	}
}

function _rtreemodel_onmenuclick( functionName )
{
	fireUserEvent( functionName, [this.treeView.cur_node] );
}
/**
*得到拖动时节点的内容
*/
function _rtreemodel_getMovemenu( rtreeNode )
{

if(isIE)
	{
	if( rtreeNode.icon )
		this.move_menu.nodeView.innerHTML = rtreeNode.icon.outerHTML + rtreeNode.cell.outerHTML;
	else
		this.move_menu.nodeView.innerHTML = rtreeNode.cell.outerHTML;
	var cell=this.move_menu.nodeView.getElementsByTagName("span");	
	addClass(cell[0],"RC_TREE_CELL");	
	removeClass(cell[0],"RC_TREE_ACTIVENODE");
	
	}
	else
	{
		if( rtreeNode.icon )
		     this.move_menu.nodeView.innerHTML="<img style='vertical-align:bottom'src='"+rtreeNode.icon.src+"'>"+rtreeNode.cell.innerHTML  
		else
	    this.move_menu.nodeView.innerHTML=rtreeNode.cell.innerHTML
 
	 
	 addClass( this.move_menu.nodeView,"RC_TREE_CELL");
	}	

	//设置宽度，避免折行

	this.move_menu.style.display="";
	
	this.move_menu.container.style.width=1;
	this.move_menu.style.width=1;
	initShadow(this.move_menu.container);
	if(!isIE){
	this.move_menu.container.nextSibling.style.zIndex="999";
	this.move_menu.container.nextSibling.style.width=this.move_menu.offsetWidth+5;
	}

	this.move_menu.style.display="none";



    return this.move_menu;
}
//----- End RTree ---------------

//----- RTreeView ---------------
function RTreeView(id, model, width, height) {
	//document.write( "<SPAN id = '" + id + "'></SPAN>" );
	var treeview = id;
	var container = $id(id.getAttribute("id") + "_container");
	
	//------start------>修复ff2下,panel未设height,tree height设为100%的bug
	if (!isIE && height == "100%") {
		var obj = container;
		while (true) {
			
			if (obj == null)
				break; ;
			if (obj.tagName == "TABLE" && obj.getAttribute("class") == "eos-panel-table") {
				if (obj.getAttribute("height") != null)
					container.style.height = height;
				break;
			}
			obj = obj.offsetParent;
		}
		
	} else{
		//height=height||'100%';
		
		//熊世宏修改于2012-09-12,解决ff,chrome下选中节点之后的横向滚动条的问题
		height=height||container.parentNode.style.height;
		
		container.style.height = height;
	}
	//-------------end------------->
	container.style.width = width;
	
	treeview.style.overflow = "auto";
	treeview.style.width = width;
	treeview.style.height = height;
	
	treeview.className = "RC_TREE";
	treeview.setAttribute("richclientType", "RTREE");
	
	//方法
	treeview.findTreeNode = _rtreeview_findTreeNode;
	treeview.expandLevel = _rree_expand_level;
	treeview.getRootNode = function () {
		return this.rootNode
	};
	treeview.getSelectNode = _rree_getSelectNode;
	treeview.moveNode = _rtree_move;
	treeview.clearup = _rtreeview_clearup;
	
	//属性
	treeview.model = model;
	treeview.cur_node = null; //当前选中节点
	/*
	treeview.rootNode	= new RTreeRootNode(  new Entity("root"),model );
	treeview.rootNode.level = 0;
	treeview.appendChild( treeview.rootNode );
	 */
	//事件
	treeview.onselectstart = function () {
		return false;
	};
	treeview.onselect = function () {
		return false;
	};
	treeview.onmouseup = _rtreeview_onmouseup;
	treeview.onmousemove = _rtreeview_onmousemove;
	treeview.onmouseout = _rtreeview_onmouseout;
	treeview.onkeydown = _rtreeview_onkeydown;
	treeview.setMenuStyle = function (name, value) {
		this.model.menu.style[name] = value;
	}
	treeview.autoResizeS1 = _rree_auto_resize_step1;
	treeview.autoResizeS2 = _rree_auto_resize_step2;
	//treeview.isInCurrPanel = _rtree_isInCurrPanel;
	//treeview.init = _rtree_init;
	
	EOS.apply(treeview,{
		isInCurrPanel:function () {
			if (_eos_curr_open_panel != null) {
				var obj = $id(this.getAttribute("id") + "_container").offsetParent;
				while (true) {
					
					if (obj == null)
						return false;
					if (obj == _eos_curr_open_panel.table)
						return true;
					obj = obj.offsetParent;
				}
			} else
				return false;
			
		},
		init:function () {
			var treeModel = this.model;
			treeModel.menu = new EOSTreeMenu(treeModel);
			EOSTreeMenu.register(treeModel.menu); //注册menu
			treeModel.move_menu = new RTreeMoveMenu(); //拖动时的弹出菜单
			treeModel.expandRoot();
		}
	});
	return treeview;
}
EOS.override(RTreeView, {
});

/**
 * 查找节点
 */
function _rtreeview_findTreeNode( entityName, fieldName, value )
{

	function findTreeNodeIn( treeNode, entityName, fieldName, value )
	{
		var _entityName = treeNode.entity.name;

		if( _entityName == entityName )
		{
			var _value = treeNode.entity.getProperty( fieldName );
			if( _value && (_value==value) )
				return treeNode;
		}

		var children = treeNode.getChildren();
		var _treeNode;
		for( var i = 0; i < children.length; i++ )
		{
			_treeNode =  findTreeNodeIn( children[i], entityName, fieldName, value );
			if( _treeNode )
				return _treeNode;
		}

		return null;
	}
	var root = this.rootNode;

	return findTreeNodeIn( root, entityName, fieldName, value );
}



function _rree_getSelectNode()
{
    return this.cur_node;

}

/*
* 由用户调用,进行节点移动操作.不执行beforeMove操作.但会执行afterMove操作.
*
*/
function _rtree_move(move_node,moveto_node)
{
    var tree=move_node.getTree();
	var moveAction = tree.model.getMoveAction( move_node, moveto_node );
	if( moveAction )
	{//可以移动,执行设置的动作
	    var moveParam = tree.model.getMoveParam( move_node, moveto_node );

		var ajax=new HideSubmit(moveAction);

		var entityName = move_node.entity.name;
		var entityInfo = tree.model.getEntityInfo( entityName );


		if(entityInfo.queryReturnValue){
			ajax.setOutParam(entityInfo.queryReturnValue );
		}

		if(entityInfo.queryParamsInfo){
			ajax.setParamsInfo(entityInfo.queryParamsInfo );
		}

		if(this.queryInoutParams){
			ajax.setInoutParam(entityInfo.queryInoutParams );
		}

        ajax.submitXML(moveParam);
        
		var afterMove=tree.afterMove;
		if(afterMove)
		{ 
		 if(tree.afterMove(ajax)==false) return;
		}
	     var isReloadMoveNodeParent;
		 var isReloadMoveToNodeParent;
	     isReloadMoveNodeParent=!move_node.getParent().isChildOf(moveto_node);	
	     isReloadMoveToNodeParent=!moveto_node.isChildOf(move_node.getParent());	
	     if(isReloadMoveNodeParent)move_node.getParent().reloadChild();
	     if(isReloadMoveToNodeParent) moveto_node.reloadChild();  	
	}
}

/**
 * 清除树
 */
function _rtreeview_clearup()
{
	this.rootNode.clearup();
	this.model.clearup();
}

/**
 * 当树之间拖动时,清除被拖动树上最后移出时选中的节点
 */
function _rtreeview_onmouseout()
{

if(!__isStartDrag()) return;
	//清除原选中节点颜色，设置当前选中节点颜色
	if( this.cur_node )
	{
		this.cur_node.cell.className = "RC_TREE_CELL";
		document.movetoModel=null;
	}
}

/**
 * 当鼠标弹起时，清除被拖动标记
 */
function _rtreeview_onmouseup()
{
	/*
	var model = document.moveModel;
	if(!__isStartDrag()) return;
	
	var move_menu = model.getMovemenu(model.move_node );
      
		//move_menu.style.posTop=pos.top
		//move_menu.style.posLeft=pos.left
	
	if(!isCanMoveTo(document.moveModel,document.movetoModel))
			 {	alert(1)
		    var pos=getPosition(model.move_node.cell);
			if(move_menu.style.display="none")
				 {
		    move_menu.reset(pos.top,pos.left);
				 }
			 }
    //eventManager.stopPropagation();
	else
	{move_menu.hide();
	  model.moveNode();
	}
	document.moveModel=null;
	document.movetoModel=null;
*/


}


/**
 * 当鼠标拖动时，如果有被拖动结点，移动被拖动结点
 */
var doc_onmousemove = null;
var doc_onmouseup	= null;
var doc_onmouseout=null;
function _rtreeview_onmousemove()
{
	var model = document.moveModel;
    if(!__isStartDrag()) return;
	var move_menu = model.move_menu;
	//move_menu.show();
	//保存document的事件处理方法，修改onmousemove和
	//onmouseup,onmouseout方法，并在onmouseup后恢复原来的事件处理方法
/*

	document.onmousemove = function()
	{
		move_menu.show();
		var event = eventManager.getEvent()
		move_menu.style.posTop = event.y + document.body.scrollTop;
		move_menu.style.posLeft = event.x + document.body.scrollLeft+12;
		
		if(isCanMoveTo(document.moveModel,document.movetoModel)) 
		  move_menu.statusIcon.src=RTREE_DROP_YES;
		else
			 move_menu.statusIcon.src=RTREE_DROP_NO;
	}
	
	document.onmouseup = function()
	{  

		 var model = document.moveModel;

         if(!isCanMoveTo(document.moveModel,document.movetoModel))
			 {	
		    var pos=getPosition(model.move_node.cell);
			if(move_menu.style.display!="none")
				 {
		          move_menu.reset(pos.top,pos.left);
				 }
			 }
    	else
	{
	  move_menu.hide();
	  model.moveNode();
	}

		document.onmousemove = doc_onmousemove;
		document.onmouseup = doc_onmouseup;
		document.onmouseout=doc_onmouseout;
		document.moveModel=null;
		document.movetoModel=null;
		//model.moveNode();

	}
document.onmouseout=function()
	{
		if(!(event.clientX<=0||event.clientX>=document.body.clientWidth||event.clientY<=0||event.clientY>=document.body.clientHeight)) return;
        move_menu.hide();
		document.onmousemove = doc_onmousemove;
		document.onmouseup = doc_onmouseup;
		document.onmouseout=doc_onmouseout;
		document.moveModel=null;
		document.movetoModel=null;
	}*/
}

/**
 * 键盘操作，选择节点
 */
function _rtreeview_onkeydown()
{
	//递归得到父节点的下一兄弟节点
	function getNextSibling( rtreeNode )
	{
		if( rtreeNode )
		{
			sibling = rtreeNode.nextSibling;
			if( sibling )
				return sibling;
			else
				return getNextSibling( rtreeNode.getParent() );
		}else
			return null;
	}
	//递归得到上一节点的最末子节点
	function getPreSibling( rtreeNode )
	{
		if( !rtreeNode ) return null;

		var children = rtreeNode.getChildren();
		var length = children.length;
		if( rtreeNode.isExpanded() && (length>0) )
		{
			return getPreSibling( children[length-1] );
		}else
			return rtreeNode;
	}
	var event = eventManager.getEvent()
	eventManager.stopPropagation();
	var treeView = this;
	var cur_node = treeView.cur_node;
	if( !cur_node ) return;

	switch( event.keyCode )
	{
		/*当按"下"键时，如果节点有子节点且展开，移到第一个子节点；
			如果有下一个兄弟节点，移动到下一兄弟节点；
			否则，移动到父节点的下一兄弟节点（递归）
		*/
		case 40 :
		{
			if( cur_node.getChildren()[0] && cur_node.isExpanded() )
			{
				cur_node.getChildren()[0].selected();
			}else
			{
				var nextNode = getNextSibling( cur_node );
				if( nextNode )
					nextNode.selected();
			}
			treeView.cur_node.scrollIntoView();
			break;
		}
		//当按"上"键时，移到上一兄弟节点的最末子节点；若没有，移到父节点
		case 38 :
		{
			if( cur_node.previousSibling )
			{
				var nextNode = getPreSibling( cur_node.previousSibling );
				if( nextNode )
					nextNode.selected();
			}else if( cur_node.getParent() )
			{
				cur_node.getParent().selected();
			}
			treeView.cur_node.scrollIntoView();
			break;
		}
		case 37:	//"左"键， 关闭此节点；若节点已关闭，选择节点的父节点
		{
			if( cur_node.isExpanded() )
			{
				cur_node.collapseNode();
			}else
			{
				if( cur_node.getParent() )
					cur_node.getParent().selected();
			}
			treeView.cur_node.scrollIntoView();
			break;
		}
		case 39:	//"右"键， 展开此节点；若节点已展开，选择节点的第一个子节点
		{
			if( !cur_node.isExpanded() )
			{
				cur_node.expandNode();
			}else
			{
				if( cur_node.getChildren()[0] )
					cur_node.getChildren()[0].selected();
			}
			treeView.cur_node.scrollIntoView();
			break;
		}
	}//end switch
	//treeView.cur_node.scrollIntoView();
	return false;
}
/**
 * RTreeNode代表树节点
 * 参数说明：
 * name: 节点显示名
 * iconsrc: 节点图标
 * entity: 节点对应的数据
 */
function RTreeNode( parentNode,name, iconsrc, entity ,isFirstNode,isLastNode,hasChild,hasRoot,iconType){
	    var node = document.createElement( "DIV" );
	    node.noWrap = true;
	   // node.style.border="1px solid black"
	    node.openIconSrc=STREE_DEFAULTOPEN_ICON;
	    node.closeIconSrc=STREE_DEFAULTCLOSE_ICON;
	    node.plusIconSrc="";
	    node.minusIconSrc="";
	    node.isFirstNode=isFirstNode;
	    node.isLastNode=isLastNode;
	    node.hasChild=hasChild;
	    node.imgLevel=parentNode.imgLevel
	    node.isleaf=!hasChild;
	    node.hasRoot=hasRoot;
	    _rtreeNode_processNodeStatus(node,entity,isFirstNode,isLastNode,hasRoot,iconsrc,iconType,name);
	node.childLoaded = false;
	node.entity = entity;		//节点对应的数据
	node.isroot = false;
	//方法
	node.addChildNode		= _rtreeNode_addChildNodes;
	node.expandNode			= _rtreeNode_expandNode;
	node.collapseNode		= _rtreeNode_collapseNode;
	node.clearChildren		= _rtreeNode_clearChildren;
	node.selected			= _rtreeNode_selected;
	node.select             = _rtreeNode_selected;
	node.refresh			= _rtreeNode_refresh;
	node.refreshExpendIcon  = _rtreeNoderefreshExpendIcon;
	node.isChildOf			= _rtreeNode_isChildOf;
	node.isExpanded			= _rtreeNode_isExpanded;
	node.getParent			= _rtreeNode_getParent;			//得到父节点
	node.getChildren		= _rtreeNode_getChildren;		//得到子节点
	node.getTree			= _rtreeNode_getTree;			//得到节点所在的树
	node.reloadChild		= _rtreeNode_reloadChild;		//重新加载子节点
	node.clearup			= _rtreeNode_clearup;
	node.getProperty        = _rtreeNode_getProperty;
  node.setIcon            = _rtreeNode_setIcon;
  node.setText            = _rtreeNode_setText;
  node.getText            = _rtreeNode_getText
  node.setLeaf            =_rtreeNode_setLeaf;
	node.isLeaf             =_rtreeNode_isLeaf;
	node.isRootNode             =_rtreeNode_isRoot;
	node.getEntity          =_rtreeNode_getEntity;
	node.hasChildNode          =_rtreeNode_hasChildNode;
	
	//事件
	node.onclick		= _rtreenode_onclick;
	node.ondblclick		= _rtreenode_ondblclick;
	node.oncontextmenu	= _rtreenode_oncontextmenu;
	node.onmousedown	= _rtreenode_onmousedown;
	node.onmouseover	= _rtreenode_onmouseover;
	//node.onmouseup		= _rtreenode_onmouseup;
	return node;
}

function _rtreeNode_hasChildNode()
{
	return this.hasChild;
}

function _rtreeNode_getEntity()
{
	return this.entity;
}


function _rtreeNode_isRoot()
{
	return this.isroot;
}


function _rtreeNode_isLeaf()
{
	return this.isleaf;
}



function _rtreeNode_getProperty(fieldName)
{
	return this.entity.getProperty(fieldName);
}

function _rtreeNode_setText(text)
{
	this.cell.innerHTML=text;
}

function _rtreeNode_getText()
{
	return this.cell.innerHTML;
}

/**
* 设置节点图标
*
*/
function _rtreeNode_setIcon(openIcon,closeIcon)
{
	  this.openIconSrc=_rtree_addContextPath(openIcon);
	  if(closeIcon)
	  this.closeIconSrc=_rtree_addContextPath(closeIcon);
	  else
	  this.closeIconSrc=this.openIconSrc;
      //显示图标 
      if(this.closeIconSrc=="null") this.icon.style.display="none";
      this.icon.src=this.closeIconSrc;
}

/**
*
*设置节点是子节点
*
*/
function _rtreeNode_setLeaf()
{
    this.isleaf=true;
    this.hasChild=false;
    this.childLoaded=true;
    this.refreshExpendIcon();
}

/**
 * RTreeRootNode代表树根节点
 * 参数说明：
 * name: 节点显示名
 * iconsrc: 节点图标
 * entity: 节点对应的数据
 */
function RTreeRootNode(  entity ,model){

	var hasRoot=model.hasRoot
    var name=model.getTreeNodeName( entity );
    var iconsrc=model.getTreeNodeIcon( entity.name );

	var node = document.createElement( "DIV" );
		node.noWrap = true;
	var node_content = document.createElement( "DIV" );	
	/*var expandIcon = document.createElement( "IMG" );
		expandIcon.src = RTree.COLLAPS_ICON;
		expandIcon.ondrag = function(){ event.cancelBubble=true; return false};
		node.appendChild( expandIcon );*/
	var icon;
			icon = document.createElement( "IMG" );
			if(iconsrc=="null")icon.style.display="none";
			if(iconsrc=="") 
			   iconsrc=STREE_DEFAULTOPEN_ICON;
			else 
			   iconsrc=_rtree_addContextPath(iconsrc);
            node.openIconSrc=iconsrc;
			icon.src = iconsrc;
			icon.style.verticalAlign="middle";
			icon.ondrag = function(){ eventManager.stopPropagation();return false};
			node_content.appendChild( icon );
	  var cell = document.createElement( "span" );
		cell.innerHTML = name;
		cell.className = "RC_TREE_CELL";
		cell.style.verticalAlign="middle";
		
		node_content.appendChild( cell );
		
		//防止选根节点时树有抖动
			var icon1 = document.createElement( "IMG" );
			icon1.style.verticalAlign="middle";
			icon1.src = STREE_BLANK_ICON;
		    node_content.appendChild( icon1 );

	var childrenContainer = document.createElement( "DIV" );
        node.appendChild( node_content );
		//childrenContainer.style.marginLeft = 20;
		//childrenContainer.style.display = "none";
		node.appendChild( childrenContainer );
	if (!hasRoot)
		{
			node_content.style.display='none';
			// icon.style.display="none";
			// cell.style.display="none";
		}
	//else
		 //childrenContainer.style.marginTop = -8;
	node.setAttribute( "richclientType", "RTREENODE" );

	//属性
	node.expandIcon = new Object();

	node.icon = icon;
	node.cell = cell;
	node.childLoaded = false;
	node.entity = entity;		//节点对应的数据
	node.isroot = true;
	node.isleaf = false;
	node.level = false;
	node.childrenContainer = childrenContainer;
	node.imgLevel="";
	//方法
	node.addChildNode		= _rtreeNode_addChildNodes;
	node.expandNode			= _rtreeNode_expandNode;
	node.collapseNode		= _rtreeNode_collapseNode;
	node.clearChildren		= _rtreeNode_clearChildren;
	node.selected			= _rtreeNode_selected;
	node.select             = _rtreeNode_selected;
	node.refresh			= _rtreeNode_refresh;
	node.isChildOf			= _rtreeNode_isChildOf;
	node.isExpanded			= _rtreeNode_isExpanded;
	node.getParent			= _rtreeNode_getParent;			//得到父节点
	node.getChildren		= _rtreeNode_getChildren;		//得到子节点
	node.getTree			= _rtreeNode_getTree;			//得到节点所在的树
	node.reloadChild		= _rtreeNode_reloadChild;		//重新加载子节点
	node.clearup			= _rtreeNode_clearup;
	node.isRootNode         =_rtreeNode_isRoot;
	node.getEntity          =_rtreeNode_getEntity;
	node.hasChildNode          =_rtreeNode_hasChildNode;
    node.setText            = _rtreeNode_setText;
    node.getText            = _rtreeNode_getText

	//事件
	node.onclick		= _rtreenode_onclick;
	node.ondblclick		= _rtreenode_ondblclick;
	node.oncontextmenu	= _rtreenode_oncontextmenu;
	node.onmousedown	= _rtreenode_onmousedown;
	node.onmouseover	= _rtreenode_onmouseover;
	//node.onmouseup		= _rtreenode_onmouseup;

	return node;
}

function _rtree_addContextPath(str)
{
if(str==null) return "";
if(str.indexOf("/")==0) return contextPath+str;
  else
return str;
}

/**
 * 生成树节点时,处理树节点的状态
 * 处理收展图标,节点图标,复选框,节点显示文本,生成子节点容器
 */

function _rtreeNode_processNodeStatus(node,entity,isFirstNode,isLastNode,hasRoot,icon,iconType,name)
{
	var level=node.imgLevel;
	var image=icon;
	var imageType=iconType;
	//处理节点图标
	if(image!=""&&image!="null")
	   {
         var images=image.split(",");

         if(imageType=="xpath") //图标类型为xpath时,从节点的entity中取得图标,如只提供一个图标,结点展开闭合为同一图标
		 {
		 	if(images.length!=2)
			{
		     if(entity.getProperty(images[0])!=null) node.openIconSrc=_rtree_addContextPath(entity.getProperty(images[0]));
	         node.closeIconSrc=node.openIconSrc;
			}
			else
			{
    		 if(entity.getProperty(images[0])!=null) node.openIconSrc=_rtree_addContextPath(entity.getProperty(images[0]));
	         if(entity.getProperty(images[1])!=null) node.closeIconSrc=_rtree_addContextPath(entity.getProperty(images[1]));
			}
			}
		 else
		  {
	        if(images.length!=2)
			{
		     node.openIconSrc=_rtree_addContextPath(images[0]);
	         node.closeIconSrc=node.openIconSrc;
			}
			else
			{
    		 node.openIconSrc=_rtree_addContextPath(images[0]);
	         node.closeIconSrc=_rtree_addContextPath(images[1]);
			}

		 }
	   }
	   //处理结点的收展图标
	 if(level==""&&!hasRoot&&isFirstNode)
	   {//处理当节点是第一层节点并且树有根,且是第一个节点
        if(isLastNode)
		{
	        node.plusIconSrc=STREE_ROOTPLUS_ICON;
			node.minusIconSrc=STREE_ROOTMINUS_ICON;
		}
		else
		{
			if(node.hasChild){
		  	node.plusIconSrc=STREE_FPLUS_ICON;
			node.minusIconSrc=STREE_FMINUS_ICON;
			}
			else
			{
			node.plusIconSrc=STREE_FLEAF_ICON;
			node.minusIconSrc="";
			}
		  }
		}
	   else
	   {
	   	  if(isLastNode)
		  {
		  	if(node.hasChild){
		  	node.plusIconSrc=STREE_LPLUS_ICON;
			node.minusIconSrc=STREE_LMINUS_ICON;
			}
			else
			{
			node.plusIconSrc=STREE_LLEAF_ICON;
			node.minusIconSrc="";
			}
		  }
		  else

		   {
		  	if(node.hasChild){
		  	node.plusIconSrc=STREE_PLUS_ICON;
			node.minusIconSrc=STREE_MINUS_ICON;
			}
			else
			{
			node.plusIconSrc=STREE_LEAF_ICON;
			node.minusIconSrc="";
			}
			}
	   }
       //处理结点的连线
        var node_content = document.createElement( "DIV" );	
		for(var i=0;i<level.length;i++)
		{
			var expandIcon = document.createElement( "IMG" );
			expandIcon.style.verticalAlign="middle";
		    if(level.charAt(i)=="1")
			           expandIcon.src = STREE_LINE_ICON;
			        else
			           expandIcon.src = STREE_BLANK_ICON;
		    node_content.appendChild( expandIcon );
		}
 	   if(isLastNode)
	           node.imgLevel=level+"0";
	         else
	           node.imgLevel=level+"1";

		//生成树的收展标图,节点图标,复选框,子节点容器
		
	    var expandIcon = document.createElement( "IMG" );
		    expandIcon.src = node.plusIconSrc;
		    expandIcon.style.verticalAlign="middle";
		    node_content.appendChild( expandIcon );
	    var icon;
			icon = document.createElement( "IMG" );
			if(image=="null") icon.style.display="none";
			else
			{
			icon.style.verticalAlign="middle";
			icon.src = node.closeIconSrc;
			}
			node_content.appendChild( icon );
      /*  var checkbox=null;

		if(node.hasCheckbox)
		{
			checkbox=document.createElement( "IMG" );
			if(node.entity.checked==null||node.entity.checked=="0")
			      checkbox.src=STREE_CHECKBOX_FALSE_ICON;
				 else
				   	if(node.entity.checked=="1")
					      checkbox.src=STREE_CHECKBOX_TRUE_ICON;
			             else
						  checkbox.src=STREE_CHECKBOX_TRUE_ICON1;
		    node.appendChild(checkbox);
		}*/
	    var cell = document.createElement( "span" );
		    cell.innerHTML = name
		    cell.className = "RC_TREE_CELL";
		    cell.style.verticalAlign="middle";
		    node_content.appendChild( cell );
	    var childrenContainer = document.createElement( "DIV" );
		    childrenContainer.style.display = "none";
			//cell.style.display="block";
		    //childrenContainer.style.marginTop = -8;
			node.appendChild( node_content );
			
		    node.appendChild( childrenContainer );
	        node.setAttribute( "richclientType", "RTREENODE" );
            //if(!isFirstNode) node.style.marginTop = -8;
		    expandIcon.style.cursor="hand";
            node.expandIcon = expandIcon;
	        node.icon = icon;
	        node.cell = cell;
	//	node.checkbox=checkbox;
	        node.childLoaded = false;
	        node.childrenContainer = childrenContainer;
}


function _rtreeNode_selected()
{
	var rtreeView = findRTree( this );
	//清除原选中节点颜色，设置当前选中节点颜色
	if( rtreeView.cur_node )
	{
		rtreeView.cur_node.cell.className = "RC_TREE_CELL";
		//removeClass(rtreeView.cur_node.cell,"eos-panel-title");
	}
	this.cell.className = "RC_TREE_ACTIVENODE";
    //addClass(this.cell,"eos-panel-title");
	rtreeView.cur_node = this;
}

function _rtreeNoderefreshExpendIcon()
{
	 var level=this.imgLevel;
	 var hasRoot=this.hasRoot;
	 var isFirstNode=this.isFirstNode;
	 var isLastNode=this.isLastNode;
	 if(this.getParent().isroot&&!hasRoot&&isFirstNode)
	   {//处理当节点是第一层节点并且树有根,且是第一个节点
         if(isLastNode)
		{
	    this.plusIconSrc=STREE_ROOTPLUS_ICON;
		this.minusIconSrc=STREE_ROOTMINUS_ICON;
		}
		else
		{

			if(this.hasChild){
		  	this.plusIconSrc=STREE_PLUS_ICON;
			this.minusIconSrc=STREE_MINUS_ICON;
			}
			else
			{
			this.plusIconSrc=STREE_FLEAF_ICON;
			this.minusIconSrc=STREE_FLEAF_ICON;
			}

		  }
		}
	   else
	   {
	   	  if(isLastNode)
		  {

		 	if(this.hasChild){
		  	this.plusIconSrc=STREE_LPLUS_ICON;
			this.minusIconSrc=STREE_LMINUS_ICON;
			}
			else
			{
			this.plusIconSrc=STREE_LLEAF_ICON;
			this.minusIconSrc=STREE_LLEAF_ICON;
			}

		  }
		  else

		   {

		  	if(this.hasChild){
		  	this.plusIconSrc=STREE_PLUS_ICON;
			this.minusIconSrc=STREE_MINUS_ICON;
			}
			else
			{
			this.plusIconSrc=STREE_LEAF_ICON;
			this.minusIconSrc=STREE_LEAF_ICON;
			}

			}
	   }

        this.expandIcon.src=this.minusIconSrc;
}

function _rtreeNode_addChildNodes( rtreeNode )
{
	this.childrenContainer.appendChild( rtreeNode );
}

function _rtreeNode_expandNode(jsHandle)
{

	//对叶子节点不做处理
	if( this.isleaf )	return;
	var beforeExpand=this.getTree().beforeExpand;//用户定义的beforeExpand方法,在每次展开前调用,返回false,取消展开动作
	if(beforeExpand) if(beforeExpand(this)==false) return;
	var rtreeNode = this;
	var rTree=findRTree( rtreeNode );
	var model = rTree.model;

	//this.expandIcon.src = RTree.EXPAND_ICON;
	  this.expandIcon.src = this.minusIconSrc;
	 
	//如果子节点数据未加载，加载数据并展开

	if( !rtreeNode.childLoaded )
		{
			this.icon.src=RTREE_DROP_LOADING;
			var _this=this;
			setTimeout(function(){
				model.loadNodeChild(rtreeNode,jsHandle);
				//return _rtreemodel_loadNodeChild.apply(model,[rtreeNode,jsHandle])
			},1);
			//model.loadNodeChild( rtreeNode );
			rtreeNode.childLoaded = true;
			//没有子节点，为叶子节点
			/*if( rtreeNode.childrenContainer.children.length == 0 )
			{
				rtreeNode.isleaf = true;
				//rtreeNode.expandIcon.src = RTree.LEAF_ICON;
			}*/
		}
	else
		if( !rtreeNode.isleaf )
		{	//accordionExpand(rtreeNode.childrenContainer);
		  rtreeNode.childrenContainer.style.display = "";
	      this.icon.src=this.openIconSrc;
	      }
	  var afterExpand=this.getTree().afterExpand;//用户定义的afterExpand方法,在每次展开后调用
	  if(afterExpand) afterExpand(this);
	  
}

function _rtreeNode_collapseNode()
{
	//this.expandIcon.src = RTree.COLLAPS_ICON;
	this.expandIcon.src = this.plusIconSrc;
	this.icon.src=this.closeIconSrc;
	this.childrenContainer.style.display = "none";
	//accordionCollapse(this.childrenContainer);
}

function _rtreeNode_clearChildren()
{
	//this.childrenContainer.innerHTML = "";
	var children = this.childrenContainer.childNodes;
	for( var i = children.length -1; i >= 0; i-- )
	{
	if(!isIE)
	// if(!isIE),只判断了是否是FF的情况，Chrome使用同样的逻辑
	{
	 var pNode=children[i].parentNode;
	 pNode.removeChild(children[i]);
	}
	else
		children[i].removeNode( true );
		
	}
	
	this.expandIcon.src = RTree.COLLAPS_ICON;
	this.childrenContainer.style.display = "none";
	this.isleaf = false;
	this.childLoaded = false;
	this.isloadData = false;
	
}

/**
 * 刷新节点，重新计算节点的显示
 */
function _rtreeNode_refresh( entity )
{
	var rtreeView = findRTree( this );
	var model = rtreeView.model;
	if( entity )
		this.entity = entity;

	//设置level
	if( this.isroot )
		this.level = 0;
	else
		this.level = this.getParent().level+1;

	this.cell.innerHTML = model.getTreeNodeName( this.entity );

	//this.icon.src = model.getTreeNodeIcon( this.entity.name );
	/*var iconsrc = model.getTreeNodeIcon( this.entity.name );
	if( iconsrc )
	{
		if( !this.icon )
		{
			this.icon = document.createElement( "IMG" );
			this.icon.ondrag = function(){ eventManager.stopPropagation();return false};
			this.appendChild( this.icon );
		}
		this.icon.src = iconsrc;
	}*/
	var entityInfor = model.getEntityInfo( this.entity.name );
	var onrefreshFunction = entityInfor.onrefresh;
	if( !onrefreshFunction )	return;
	fireUserEvent( onrefreshFunction, [this, this.cell]);
}

/**
 * 得到父节点
 */
function _rtreeNode_getParent()
{
	if( this.isroot )
		return null;
	else
		return this.parentNode.parentNode;
}

/**
 * 得到子节点
 */
function _rtreeNode_getChildren()
{
	return this.childrenContainer.childNodes;
}

/**
 * 得到节点所在树
 */
function _rtreeNode_getTree()
{
	return findRTree( this );
}

/**
 * 判断节点是否是某节点的子节点
 */
function _rtreeNode_isChildOf( parentNode )
{
	var _parent = this;
	while( _parent = _parent.getParent() )
	{
		if( _parent == parentNode )
			return true;
	}
	return false;
}

/**
 * 判断节点是否处于展开状态
 */
function _rtreeNode_isExpanded()
{
	if( this.childrenContainer.style.display == "none" )
		return false;
	else
		return true;
}

/**
 * 重新加载子节点
 */
function _rtreeNode_reloadChild(jsHandle)
{
	if( this.childLoaded||this.isRootNode() )
	{
		this.clearChildren();
		this.expandNode(jsHandle);
	}
	else
		this.expandNode(jsHandle);
		
}

/**
 * 清除节点
 */
function _rtreeNode_clearup()
{
	var node = this;
	var children = node.getChildren();
	for( var i = children.length -1; i >= 0; i-- )
	{
		children[i].clearup( true );
	}

	node.expandIcon = null;
	node.icon = null;
	node.cell = null;
	node.entity = null;
	node.childrenContainer = null;

	//方法
	node.addChildNode		= null;
	node.expandNode			= null;
	node.collapseNode		= null;
	node.clearChildren		= null;
	node.selected			= null;
	node.refresh			= null;
	node.isChildOf			= null;
	node.isExpanded			= null;
	node.getParent			= null;
	node.getChildren		= null;
	node.getTree			= null;
	node.reloadChild		= null;
	node.clearup			= null;

	//事件
	node.onclick		= null;
	node.ondblclick		= null;
	node.oncontextmenu	= null;
	node.onmousedown	= null;
	node.onmouseover	= null;
	node.onmouseup		= null;

	node.removeNode( true );
}

function _rtreenode_onclick()
{
	var rtreeView = findRTree( this );
	var model = rtreeView.model;
	model.menu.hide();
	function expandOrCollapseNode()
	{
		//如果是叶子节点，不做处理

		if( rtreeNode.isleaf )
			return;

		if( rtreeNode.childrenContainer.style.display == "none" )
		{
			rtreeNode.expandNode();
		}else
		{
			rtreeNode.collapseNode();
		}
	}
	//eventManager.stopPropagation();

	var rtreeNode = this;
	var src = eventManager.getElement();

	if( src == this.cell || src == this.expandIcon || src == this.icon )	//选中节点
	{
		this.selected();
	}
	if( src == this.cell )			//触发用户自定义动作
	{
		var functionName = model.getEntityInfo( this.entity.name ).onclick;
		if( functionName )
		{
			fireUserEvent(functionName, [this]);
		}
	}
	if( src == this.expandIcon )	//点击展开关闭结点
	{
		expandOrCollapseNode();
	}
}


function _rtreenode_ondblclick()
{
	eventManager.stopPropagation();

	var rtreeView = findRTree( this );
	var model = rtreeView.model;
	var rtreeNode = this;
	var src = eventManager.getElement();

	if( src == this.cell )			//触发用户自定义动作
	{
		var functionName = model.getEntityInfo( this.entity.name ).ondblclick;
		if( functionName )
		{
			fireUserEvent(functionName, [this]);
		}
	}
}

/**
 * 点击右键弹出菜单
 */
function _rtreenode_oncontextmenu()
{
	eventManager.stopPropagation();

	var rtreeView = findRTree( this );
	var model = rtreeView.model;
	var menu = model.menu;
	var rtreeNode = this;

	rtreeNode.selected();

	if( eventManager.getElement() == this.cell )
		model.showNodeMenu( rtreeNode );

	return false;
}

/**
 * 当鼠标右键按下时，准备被拖动
 */
function _rtreenode_onmousedown()
{
	var event = eventManager.getEvent();

	if(!isIE) {if( event.button != 0 ) return;}
	else
	if( event.button != 1 ) return;
	if(!isIE)eventManager.stopPropagation();
	var cell = eventManager.getElement();
	if( cell != this.cell ) return;

	var treeView = findRTree( this );
	var model = treeView.model;

	if( model.isNodeMovable( this ) )
	{
		model.move_node = this;
		document.moveModel=model;
	//if( !model ) return;
	//return
  doc_onmousemove = document.onmousemove;
  doc_onmouseup	= document.onmouseup;
  doc_onmouseout=document.onmouseout;

	document.onmousemove = function()
	{
		move_menu.show();
		var event = eventManager.getEvent()
		if(!isIE)
		{
	    move_menu.style.top = eventManager.getPointY() ;
		move_menu.style.left = eventManager.getPointX()+12;
		}
		else
		{
		move_menu.style.posTop = event.y + document.body.scrollTop;
		move_menu.style.posLeft = event.x + document.body.scrollLeft+12;
		}
		
		if(isCanMoveTo(document.moveModel,document.movetoModel)!=false) 
		     move_menu.statusIcon.src=RTREE_DROP_YES;
		else
			 move_menu.statusIcon.src=RTREE_DROP_NO;
	}
	
	document.onmouseup = function()
	{  
		 var model = document.moveModel;

   if(isCanMoveTo(document.moveModel,document.movetoModel)==false)
	     {	
			var pos
			if(model.move_node.icon.style.display=="none")
				pos=getPosition(model.move_node.cell);
			  else
	            pos=getPosition(model.move_node.icon);
		
			if(move_menu.style.display!="none")
					 {
				      move_menu.statusIcon.style.display="none";
			          move_menu.reset(pos.top,pos.left);
					 }
			
		 }
    else
		{
		
			document.onmousemove = doc_onmousemove;
			document.onmouseup = doc_onmouseup;
			document.onmouseout=doc_onmouseout;

		    move_menu.hide();
			model.moveNode();
			document.moveModel=null;
			document.movetoModel=null;		
			return;
		}

		document.onmousemove = doc_onmousemove;
		document.onmouseup = doc_onmouseup;
		document.onmouseout=doc_onmouseout;
		document.moveModel=null;
		document.movetoModel=null;
		//model.moveNode();

	}
document.onmouseout=function()
	{
     if(!isIE) {
    
        if(eventManager.getElement().tagName!="HTML") return;
        }

try{
		if(!(event.clientX<=0||event.clientX>=document.body.clientWidth||event.clientY<=0||event.clientY>=document.body.clientHeight)) return;
        
		/*if(event.clientX<=0) move_menu.style.posLeft=0;
        if(event.clientX>=document.body.clientWidth) move_menu.style.posLeft=document.body.clientWidth;
        if(event.clientY<=0) move_menu.style.posTop=0;
        if(event.clientY>=document.body.clientHeight) move_menu.style.posTop=event.clientY>=document.body.clientHeight;*/
		//move_menu.hide();
	
				var pos=getPosition(model.move_node.icon);
				if(move_menu.style.display!="none")
				 {
			      move_menu.statusIcon.style.display="none";
		          move_menu.reset(pos.top,pos.left);
				 }
		document.onmousemove = doc_onmousemove;
		document.onmouseup = doc_onmouseup;
		document.onmouseout=doc_onmouseout;
		document.moveModel=null;
		document.movetoModel=null;
}
catch(e)
		{}
	}
    var move_menu = model.getMovemenu(model.move_node );
	move_menu.statusIcon.style.display="";
	//move_menu.show();
	//move_menu.style.posTop = event.y + document.body.scrollTop;
	//move_menu.style.posLeft = event.x + document.body.scrollLeft;

	}
}

/**
 * 在托拽过程中，当移动到某结点时
 */
function _rtreenode_onmouseover()
{

	if(eventManager.getElement()!=this.cell) return;
	var treeView = findRTree( this );
	var model = treeView.model;

	if( __isStartDrag() )
	{
		eventManager.stopPropagation();
		model.moveto_node = this;
		document.movetoModel=model;
		this.selected();
	}
}

/**
 * 在托拽过程中，当托拽到某结点时
 */
function _rtreenode_onmouseup()
{
	//var treeView = findRTree( this );
	//var model = treeView.model;
	//model.moveNode();
}

function findRTree( tag )
{
	var parent = tag;
	var richclientType;
	while( parent = parent.parentNode  )
	{
		richclientType = parent.getAttribute( "richclientType" );
		if( richclientType == "RTREE" )
			return parent;
	}
	return null;
}
 
/**
 * 树的右键弹出菜单
 */
function EOSTreeMenu( model ){
	var topwindow=_get_top_window();
	var menu = topwindow.document.createElement( "div" );
	//menu.className = "eos-popmenu";
    var menuContainer = topwindow.document.createElement( "div" );
    menu.appendChild(menuContainer);
    menu.container=menuContainer;
    menuContainer.className = "eos-popmenu";
	//menu.style.cursor="default";
	//menu.style.font="normal 10pt Arial, Helvetica, sans-serif";
	//menu.style.textAlign="left";
	menu.style.width="120px";
	//menu.style.backgroundColor="#E8E8EA";
	//menu.style.border="1 solid red";
	//menu.style.border="2 outset buttonhighlight";
	menu.style.cursor=" hand";
	//menu.style.color="#000000";
	menu.style.position = "absolute";
	menu.style.display = "none";
	topwindow.document.body.appendChild( menu );


	//方法
	menu.clearItems		= _treemenu_clearItems;
	menu.insertItem		= _treemenu_insertItem;
	menu.addMenuItem        = _treemenu_addMenuItem;
	menu.addMenuLine=function(){
		var line=document.createElement('div');
		line.className='rtree-popmenu-item-line';
		this.container.appendChild(line);
	}
	menu.removeMenuItem     = _treemenu_removeMenuItem;
	menu.hide			= function(){
								this.clearItems();
								this.style.display = "none";
							};
	menu.show			= function(){
		                        PageControl.setFocus(this);
								this.style.display = "";
								initShadow(this.container,topwindow.document);
								if(!isIE){this.container.nextSibling.style.width=this.container.nextSibling.offsetWidth+5}
								this.container.nextSibling.style.zIndex="-1";
								this.style.zIndex="0";
								if(!isIE)setOpacity(this,0);
								this.style.zIndex = 999;
								var ent = eventManager.getEvent();
					     
								if(isIE){
								
									this.style.posTop = ent.screenY-topwindow.screenTop+topwindow.document.body.scrollTop;
									this.style.posLeft = ent.screenX-topwindow.screenLeft+topwindow.document.body.scrollLeft;
										
								}else{
										var x = ent.x||ent.clientX;
										var y = ent.y||ent.clientY;
						                var xyOff = getScreenPos(window,topwindow);							
										x = x + xyOff.left+topwindow.document.body.scrollLeft;
										y = y +  xyOff.top+topwindow.document.body.scrollTop;
									this.style.top = y;//- topwindow.screenY+topwindow.document.body.scrollTop;
									this.style.left = x;//-topwindow.screenX+topwindow.document.body.scrollLeft;
								}
								this.tabIndex = 1;
								if(!isIE) fx_fadeIn(this,null,500);
								//this.focus();
							};


	//属性
	menu.model		= model;

	//事件
	menu.oncontextmenu	= function(){ return false; };
	menu.onselectstart	= function(){ return false; };
	menu.onblur		= function(){ EOSTreeMenu.hideAll(); };	//当失去焦点时隐藏所有菜单

	return menu;
}


/**
 * 增加菜单项
 */

function _treemenu_addMenuItem(menuName,onclick,hasLine)
{
	var item=new EOSTreeMenuItem(menuName,onclick);
	this.insertItem(item);
}

/**
 * 移除菜单项
 */

function _treemenu_removeMenuItem(menuName)
{
	var children = this.container.children||this.container.childNodes;
	for(var i=0;i<children.length;i++)
	{
	if(children[i].innerHTML==menuName) 
	   {
		if(i<children.length-1){
			if(children[i+1].className=='rtree-popmenu-item-line'){
				this.container.removeChild(children[i+1]);
			}
		}
	    this.container.removeChild(children[i]);
	    return;
	   }
	}
}

/**
 * 注册所有菜单
 */
EOSTreeMenu.register = function( menu ){
	if( !this.menus ) this.menus = new Array();

	this.menus.push( menu );
}

/**
 * 隐藏所有菜单
 */
EOSTreeMenu.hideAll = function(){
	if( !this.menus ) return;

	for( var i = 0; i < this.menus.length; i++ )
		this.menus[i].hide();
}

/**
 * 树的右键弹出菜单项
 */
function EOSTreeMenuItem( name, onclick ){
	var topwindow=_get_top_window();
	var menuItem = topwindow.document.createElement( "div" );
	menuItem.className = "rtree-popmenu-item";
	if(!isIE)menuItem.style.marginBottom="-6px";
	menuItem.innerHTML = name;

	//属性
	menuItem.onclickFunction	= onclick;

	//事件
	menuItem.onmousedown		= _treemenuitem_onclick;
	menuItem.onmouseover	= _treemenuitem_onmouseover;
	menuItem.onmouseout		= _treemenuitem_onmouseout;
	return menuItem;
}
/**
 * 清除菜单所有菜单项
 */
function _treemenu_clearItems()
{
	var children = this.container.children||this.container.childNodes;
	if(children){
		while (children.length>0)
		{
			this.container.removeChild( children[0] );
		}
	}

}

/**
 * 添加菜单项
 */
function _treemenu_insertItem( menuItem)
{
	this.container.appendChild( menuItem );
}

function _treemenuitem_onclick()
{
	//event.cancelBubble=true
	var menu = this.parentNode.parentNode;
	removeClass(this,"rtree-popmenu-item-mouseover");
	menu.hide();
	menu.model.onmenuclick( this.onclickFunction );
	this.style.backgroundColor = "";
	this.style.color = "black";

}

/**
 * 当鼠标移入时，改变菜单项颜色
 */
function _treemenuitem_onmouseover()
{
	//this.style.backgroundColor = "highlight";
	addClass(this,"rtree-popmenu-item-mouseover");
	this.style.color = "white";
}

/**
 * 当鼠标移出时，改变菜单项颜色
 */
function _treemenuitem_onmouseout()
{
	//this.style.backgroundColor = "";
	removeClass(this,"rtree-popmenu-item-mouseover");
	this.style.color = "black";
}

/*
生成节点拖动时的图标
*/
function RTreeMoveMenu(){
	var move_menu = document.createElement( "div" );
	var move_menu_container = document.createElement( "div" );
	var nobr=document.createElement( "nobr" );
	move_menu_container.appendChild(nobr);
	move_menu_container.className = "RC_TREE_DRAGNODE";
	move_menu.onselectstart = function(){eventManager.stopPropagation();return false;};
	move_menu.style.position = "absolute";
	move_menu.style.display = "none";
	document.body.appendChild(move_menu);
	var statusIcon = document.createElement( "img" );//拖动时的状态
	statusIcon.src=RTREE_DROP_NO;
	statusIcon.style.verticalAlign="middle";
	var nodeView= document.createElement( "span" );//拖动时节点的内容
	nobr.appendChild(statusIcon);
	nobr.appendChild(nodeView);
	move_menu.appendChild(move_menu_container);
	move_menu.nodeView=nodeView;
	move_menu.statusIcon=statusIcon;
	move_menu.container=move_menu_container;
    //方法
    move_menu.show		= _rtreemovemenu_show;
    move_menu.hide		= _rtreemovemenu_hide;
    move_menu.reset		= _rtreemovemenu_reset;

    return move_menu;
}

function _rtreemovemenu_show()
{
	this.style.display = "";
}

function _rtreemovemenu_reset(top,left)
{
     this.hide(); return;
     if(!isIE)  {this.hide(); return;}
     var tmp=this;
     if(this.style.posTop==top&&this.style.posLeft==left) {this.hide(); return;}
     if(this.style.posTop>top)
		 if(this.style.posTop-top<=3)
		        this.style.posTop= this.style.posTop-1;
                  	 else
		        this.style.posTop=this.style.posTop-(this.style.posTop-top)*0.3;
 
	 if(this.style.posTop<top)
	{	  
		   if(top-this.style.posTop<=3)
		               this.style.posTop= this.style.posTop+1; 
		  else
	{
	         this.style.posTop=this.style.posTop+(top-this.style.posTop)*0.3;
	}
	}

	 if(this.style.posLeft>left)
		  if(this.style.posLeft-left<=3) this.style.posLeft=this.style.posLeft-1;
	     else
		  this.style.posLeft=this.style.posLeft-(this.style.posLeft-left)*0.3;
     
	 if(this.style.posLeft<left)
		 if(left-this.style.posLeft<=3)
		          this.style.posLeft=this.style.posLeft+1;
	 else
		   this.style.posLeft=this.style.posLeft+(left-this.style.posLeft)*0.3;
	 setTimeout(function(){return _rtreemovemenu_reset.apply(tmp,[top,left])},10)
}

function _rtreemovemenu_hide()
{
	this.style.display = "none";
}
//----- End RTreeView ---------------

//--------------------- Utile Functions ----------------------
function fireUserEvent(function_name, param)
{
	var result;
	var paramstr="";
	for(i=0; i<param.length; i++){
		if (i==0)
		 	paramstr="param["+i+"]";
		 else
		 	paramstr=paramstr+",param["+i+"]";
	}

	if (isUserEventDefined(function_name))
	{
		eval("result="+function_name+"("+paramstr+");");
	}
	if(!result) result="";
	return result;
}


function isUserEventDefined( function_name )
{
	if (function_name==""||function_name==undefined) return false;

	var result;
	eval("result=(typeof("+function_name+")!=\"undefined\");");
        if(!result) alert(STREE_MOT_FOUND+function_name+"!")
	return result;
}

/**
*是否开始拖动
*/
function __isStartDrag()
{
	if(document.moveModel != null) 
	  return true;
	else
		return false; 
	}
/*
*是否可以移动到目标节点
*/
function isCanMoveTo(movemodel,tomodel)
{
	if(!movemodel) return false;
	if(!tomodel) return false;
	var moveNode=movemodel.move_node;
	var toNode=tomodel.moveto_node;
	if(toNode==null) return false;//目标节点不能为null
	if(moveNode==null) return false;//被移动节点不能为null
	if( moveNode == toNode ) return false;//当前节点不能移动到当前节点
	var parent_node = moveNode.getParent();
	if( toNode == parent_node ) return false;//不能移动到当前节点的父节点下
	if( toNode.isChildOf( moveNode ) ) return false;//不能移动到当前节点的子节点下
	
		
	var moveAction = movemodel.getMoveAction( moveNode, toNode );
	var isCanMove=moveNode.getTree().isCanMove;
	if(!moveAction)
	{
	return false;
	}
	   if(isCanMove)
	    if(isCanMove(moveNode,toNode)==false) return false;
	      else
	   	   return true;
		}
/*
*展开到指定的级别
*
*/
	function _rree_expand_level(level,node)
	{
		if(node==null) node=this.getRootNode();
		if(!node.isroot)	node.expandNode();
		var tree=this;
		setTimeout(function(){
			return isLoadFinish.apply(tree,[level,node]);
		},10);
	}

	function isLoadFinish(level, node) {
		var tree=this;
		if (node.loadFinished != true) {
			setTimeout(function () {
				return isLoadFinish.apply(tree, [level, node])
			}, 10);
			return;
		}
		level = level - 1;
		var children = node.getChildren();
		if (level == 0)
			return;
		else {
			for (var i = 0; i < children.length; i++) {
				if (children[i].isleaf)
					continue;
				_rree_expand_level(level, children[i]);
			}
		}
	}
/*
*　autoresize第一步
*
*/	
function _rree_auto_resize_step1()
{
  $id(this.id+"_container").style.display="none";
}

/*
*　autoresize第二步
*
*/
function _rree_auto_resize_step2()
{
        var container=$id(this.getAttribute("id")+"_container");

		var obj=container.parentNode
		while(obj!=null)
			{
//		if(obj["layout"]!=null)
			if(obj.getAttribute&&obj.getAttribute("layout")!=null)
				   { 
				      container.style.height=obj.offsetHeight;
				      container.style.display="";
				      obj=null;//跳出循环
				   }
			   else
				   {
				       obj=obj.parentNode;
				   }
			}
	      container.style.display="";
}
	
	