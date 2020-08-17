/**
 * 实体关系构造函数
 * @param {Object} entityName
 * @param {Object} entityField
 * @param {Object} parentEntity
 * @param {Object} parnetFeild
 */

	function Relation(entityName,entityField,parentEntity,parnetFeild)
	{
      this.entityName=entityName;
	  this.entityField=entityField;
	  this.parentEntity=parentEntity;
	  this.parnetFeild=parnetFeild;
	}

/**
 * 实体信息构造函数
 * @param {Object} icon
 * @param {Object} iconType
 * @param {Object} showField
 * @param {Object} onclick
 * @param {Object} refresh
 */
 function EntityInfo(icon,iconType,showField,onclick,refresh,oncheck,submitXpath,url,target)
   {
    this.icon=icon;
	this.iconType=iconType;
	this.showField=showField;
	this.onclick=onclick;
	this.refresh=refresh;
	this.oncheck=oncheck;
	this.submitXpath=submitXpath;
	this.url=url;
	this.target=target;
   }

/**
 * 实体信息构造函数
 * @param {Object} icon
 * @param {Object} iconType
 * @param {Object} showField
 * @param {Object} onclick
 * @param {Object} refresh
 */
 function CheckedInfo(entityName,entityField,checkedEntity,checkedField)
	{
      this.entityName=entityName;
	  this.entityField=entityField;
	  this.checkedEntity=checkedEntity;
	  this.checkedField=checkedField;
	}
/**
 * checkList对象
 * @param {Object} entityType
 */
function CheckList(entityType)
{
  this.entityType=entityType;
  this.list=new Array();
}

CheckList.prototype.push=function(object)
{
	this.list.push(object);
}

CheckList.prototype.getLength=function()
{
	return this.list.length;
}


CheckList.prototype.getNodeType=function()
{
	return this.entityType;
}


CheckList.prototype.toString=function()
{
  var returnValue="";
  for(var i=0;i<this.list.length;i++)
  {
  	returnValue=returnValue+this.list[i];
  }
  return "<list entityType='"+this.entityType+"'>"+returnValue+"</list>"
}

/**
 * 静态树的构造函数
 * @param {Object} treeContainer
 * @param {Object} hascheckbox
 * @param {Object} checktype
 * @param {Object} hasRoot
 */
 function STree(treeContainer,hascheckbox,checkType,hasRoot,width,height)
   {
   	if(width!="null") treeContainer.style.width=width;
   	if(height!="null") treeContainer.style.height=height;
   	var id=treeContainer.id.substr(0,treeContainer.id.indexOf("_container"));
   	PageControl.add(id,this);
    this.hasCheckbox=hascheckbox
	this.checkType=checkType;
	this.treeContainer=treeContainer;
	this.hasRoot=hasRoot;
	this.datasetList=new Object();
	this.datasetList.root=new Object();
	this.entityInfoList=new Object();
	this.relationList=new Array();
	this.checkedInfoList=new Array();
   }

/**
 * 增加树的实体关系描述
 * @param {Object} entityName
 * @param {Object} entityField
 * @param {Object} parentEntity
 * @param {Object} parnetFeild
 * @param {Object} parentValue
 */
   STree.prototype.addRelation=function(entityName,entityField,parentEntity,parnetFeild)
   {
     var relation=new Relation(entityName,entityField,parentEntity,parnetFeild);
	     this.relationList.push(relation);
   }

/**
 * 增加树的checkbox描述
 * @param {Object} entityName
 * @param {Object} entityField
 * @param {Object} parentEntity
 * @param {Object} parnetFeild
 * @param {Object} parentValue
 */
   STree.prototype.addCheckedInfo=function(entityName,entityField,checkedEntity,checkedField)
   {
     var checkedInfo=new CheckedInfo(entityName,entityField,checkedEntity,checkedField);
	     this.checkedInfoList.push(checkedInfo);
   }

/**
 * 增加树的实体
 * @param {Object} entityName
 * @param {Object} datasetStr
 */
   STree.prototype.addDataset=function(entityName,datasetStr)
   {
   	 var dom = createXmlDom();
         dom.loadXML(datasetStr.innerHTML)	;
	 var dataset = new Dataset(entityName);
	     dataset.init(dom.selectSingleNode("/root/data").childNodes)
         this.datasetList[entityName]=dataset;
   }

/**
 * 增加实体信息
 * @param {Object} entityName
 * @param {Object} icon
 * @param {Object} iconType
 * @param {Object} showField
 * @param {Object} onclick
 * @param {Object} refresh
 */

    STree.prototype.addEntityInfo=function(entityName,icon,iconType,showField,onclick,refresh,oncheck,submitXpath,url,target)
   {
   	    var entityInfo=new EntityInfo(icon,iconType,showField,onclick,refresh,oncheck,submitXpath,url,target);
	    this.entityInfoList[entityName]=entityInfo

   }

/**
 * 得到实体
 * @param {Object} enityName
 */
    STree.prototype.getDataset=function(enityName)
	{
		return this.datasetList[enityName];
	}

/**
 * 得到实体信息
 * @param {Object} enityName
 */
	STree.prototype.getEntityInfo=function(enityName)
	{
		return this.entityInfoList[enityName];
	}

/**
 * 处理树的实体关系
 */
	STree.prototype.processRelation=function()
	{
		var relationList=this.relationList;
        for (var i=0;i<relationList.length;i++)
		{
			var relation=relationList[i];
			if(relation.parentEntity=="root")
			        _stree_linkToRoot(relation,this.getDataset(relation.entityName),this.getDataset(relation.parentEntity));
			   else
				    _stree_linkToParnet(relation,this.getDataset(relation.entityName),this.getDataset(relation.parentEntity));

		}
	}

/**
 * 处理树的checkbox
 */
	STree.prototype.processCheckBox=function()
	{
     var checkedInfoList=this.checkedInfoList;
	 for(var i=0;i<checkedInfoList.length;i++)
	 {
	 	var checkedInfo=checkedInfoList[i];
        if(checkedInfo.entityName==checkedInfo.checkedEntity)
		{
          var dataset=this.getDataset(checkedInfo.entityName);
		  var entitys=dataset.values;
		  var checkedValue=checkedInfo.checkedField;
		  var entityField=checkedInfo.entityField;
		  var entityLength=dataset.getLength();
		  for(var j=0;j<entityLength;j++)
		  {
		  	var entityValue=entitys[j].getProperty(entityField);
			if(entityValue==checkedValue) entitys[j].checked="1";
		  }
		}
		else
		{
			var dataset=this.getDataset(checkedInfo.entityName)
			var entitys=dataset.values;
            var entityLength=dataset.getLength();
			var checkedDataset=this.getDataset(checkedInfo.checkedEntity);
			var checkedEntitys=checkedDataset.values;
            var checkedEntityLength=checkedDataset.getLength();
			var entityField=checkedInfo.entityField;
			var checkedField=checkedInfo.checkedField;
			for(var j=0;j<entityLength;j++)
			{
				var entityValue=entitys[j].getProperty(entityField);
				for(var k=0;k<checkedEntityLength;k++)
				{
					var checkedValue=checkedEntitys[k].getProperty(checkedField);
					if(checkedValue==entityValue)
					         entitys[j].checked="1";
				}
			}
		}
	 }
	 this.processParnetCheckBox()
	}
STree.prototype.processParnetCheckBox=function()
{
   if(this.checkType=="simple") return;
   _stree_processParnetCheckBox(this.getDataset("root"));
}

function _stree_processParnetCheckBox(entity)
{
	var nodeCheckType="3"
	var childList=entity.childList
    if(childList!=null)
	{
		for(var i=0;i<childList.length;i++)
		{
           var childChecked=_stree_processParnetCheckBox(childList[i]);
		   if(nodeCheckType=="3")
		           nodeCheckType=childChecked;
		      else
			  {
                 if(nodeCheckType!="2")
				       if(nodeCheckType!=childChecked)
					       nodeCheckType=2;
			  }

		}
         entity.checked=nodeCheckType;
		 return nodeCheckType;
	}
	else
	{
      if(entity.checked=="1")
	         return 1;
	      else
	          return 0
	}

}

 /**
  * 把当前实体内的节点链至树根
  * @param {Object} relation
  * @param {Object} dataset
  * @param {Object} parentDataset
  */

   function _stree_linkToRoot(relation,dataset,parentDataset)
   {
   	if(parentDataset.childList==null) parentDataset.childList=new Array();
    var childList=parentDataset.childList;
	var datasetLength=dataset.getLength();
	var entitys=dataset.values;
	var entityType=relation.entityName;
	var parentField=relation.parnetFeild;//当节点是链至根时,relation中此属性表示过滤值
	var entityField=relation.entityField;
if(parentField==="ADD_ALL")//所有节点链至根节点,否则,只把指定字段值等于过滤值的节点链至根节点
	    {
          for(var i=0;i<datasetLength;i++)
		  {
            var entity=entitys[i];
			entity.type=entityType;
            childList.push(entity);
		  }
		}
		else
	   {
if(parentField==="") parentField="null";
          for(var i=0;i<datasetLength;i++)
		  {
            var entity=entitys[i];
			if(entity.getProperty(entityField)+""==parentField)
			{
			entity.type=entityType;
            childList.push(entity);
			}
		  }
		}
   }

   /**
    * 把当前实体内的节点链至父实体
    * @param {Object} relation
    * @param {Object} dataset
    * @param {Object} parentDataset
    */
	/**
	*@desc 熊世宏修改于2012-03-02 解决多字段关联不起作用的问题
	*/
	/***************start******************/
	/*
   function _stree_linkToParnet(relation,dataset,parentDataset)
   {
    var datasetLength=dataset.getLength();
	var entitys=dataset.values;
	var parentDatasetLength=parentDataset.getLength();
	var parentEntitys=parentDataset.values;
	var entityType=relation.entityName;
	var parentField=relation.parnetFeild;
	var entityField=relation.entityField;
	var parentFields=parentField.split(",");
	var entityFields=entityField.split(",");
	if(parentFields.length==1)//是否是多主键关联
    for(var i=0;i<datasetLength;i++)
	{
        var fieldValue=entitys[i].getProperty(entityField);
		for(var j=0;j<parentDatasetLength;j++)
		{

			var parentFieldValue=parentEntitys[j].getProperty(parentField);
			if(parentFieldValue==fieldValue)
			{
			entitys[i].type=entityType;
			if(parentEntitys[j].childList==null) parentEntitys[j].childList=new Array();
            parentEntitys[j].childList.push(entitys[i]);
			break;
			}
		}
	}
	else
    for(var i=0;i<datasetLength;i++)
	{
        var fieldValue=entitys[i].getProperty(entityField);
		for(var j=0;j<parentDatasetLength;j++)
		{
			var parentFieldValue=parentEntitys[j].getProperty(parentField);
			if(parentFieldValue==fieldValue)
			{
			entitys[i].type=entityType;
			if(parentEntitys[j].childList==null) parentEntitys[j].childList=new Array();
            parentEntitys[j].childList.push(entitys[i]);
			break;
			}
		}
	}
   }

   
   */
	
	
	function _stree_linkToParnet(relation, dataset, parentDataset) {

		if (parentDataset.childList == null)
			parentDataset.childList = new Array();
		var childList = parentDataset.childList;
		var datasetLength = dataset.getLength();
		var entitys = dataset.values;
		var entityType = relation.entityName;
		var parentField = relation.parnetFeild;// ���ڵ���t�x�ʱ,relation�д����Ա�ʾ����ֵ
		if (parentField === "ADD_ALL"){// ���нڵ�t�x�ڵ�,����,ֻ��ָ���ֶ�ֵ���ڹ���ֵ�Ľڵ�t�x�ڵ�
			for (var i = 0; i < datasetLength; i++) {
				var entity = entitys[i];
				entity.type = entityType;
				childList.push(entity);
			}
		}else{
		  __linkToParent(relation, dataset, parentDataset);
		}
	}

	function __linkToParent(relation, dataset, parentDataset){

		var datasetLength = dataset.getLength();

		var parentDatasetLength= parentDataset.getLength();
		var entityType = relation.entityName;

		
		var parentField = relation.parnetFeild;// ���ڵ���t�x�ʱ,relation�д����Ա�ʾ����ֵ
		var parentFields = parentField.split(",");
		var entityFields = relation.entityField.split(",");	
		var len = parentFields.length;
		var parentEntitys = parentDataset.values;
		var entitys = dataset.values;

		 for(var i = 0; i < datasetLength; i++) {		
				for(var j = 0; j < parentDatasetLength; j++) {
					var ischild = false;			
					for (var k = 0; k < len; k++) {
						var parentFieldValue = parentEntitys[j].getProperty(parentFields[k]);
						var fieldValue = entitys[i].getProperty(entityFields[k]);
						if (parentFieldValue != fieldValue) {								
							ischild = false;
							break;
						}
						if(k==(len-1)){
							ischild = true;
						}
					}
					if(ischild){
						if (parentEntitys[j].childList == null){
								parentEntitys[j].childList = new Array();
						}
						entitys[i].type = entityType;
						parentEntitys[j].childList.push(entitys[i]);
					}
				}
			}
	}

	/***************end******************/

/**
 * 关闭树结点
 */
function _streeNode_collapseNode()
{
	this.expandIcon.src = this.plusIconSrc;
	this.icon.src=this.closeIconSrc;
	this.childrenContainer.style.display = "none";
	//accordionCollapse(this.childrenContainer);
}

/**
 * 展开树节点
 */
function _streeNode_expandNode()
{
	this.expandIcon.src = this.minusIconSrc;
	this.icon.src=this.openIconSrc;
	//如果子节点数据未加载，加载数据并展开
	if( !this.isChildLoaded )
	 {
		this.addChildNode();
     }
	 else
	  this.childrenContainer.style.display = "";
		 //accordionExpand(this.childrenContainer);
	 
}


/**
 * 添加子节点
 */
function _streeNode_addChildNodes()
{
   var childList=this.entity.childList;
      if(childList==null) return;
	   for(var i=0;i<childList.length;i++)
	   {
		    var isFirst=false;
			var isLast=false;
		    if(i==0) isFirst=true;
			if(i==childList.length-1) isLast=true;
		    var node=new STreeNode(this,childList[i],isFirst,isLast);
			node.refresh();
			this.childrenContainer.appendChild(node);
	   }
	   this.childrenContainer.style.display = "";
	   this.isChildLoaded=true;
       //accordionExpand(this.childrenContainer);
}

/**
 * 根节点的构造函数
 * @param {Object} tree
 */
   function STreeRootNode(tree)
   {
	var node = document.createElement( "DIV" );
	    node.noWrap = true;
		//属性
		node.level="";
		node.tree=tree;
	   	node.hasCheckbox=tree.hasCheckbox;
		node.checkType=tree.checkType;
		node.entity=tree.datasetList.root;
		node.openIconSrc=STREE_DEFAULTOPEN_ICON;
		node.closeIconSrc=STREE_DEFAULTCLOSE_ICON;
		node.plusIconSrc=STREE_ROOTPLUS_ICON;
		node.minusIconSrc=STREE_FMINUS_ICON;
		node.entityInfo=tree.getEntityInfo("root")
		node.hasChild=(node.entity.childList!=null)
        node.isChildLoaded=true;
		node.isRoot=true;
		var	node_contain = document.createElement( "div" );
	var image=node.entityInfo.icon
		if(image!="")
		   {
		  		node.openIconSrc=_stree_addContextPath(image);
		   }


	var icon;
			icon = document.createElement( "IMG" );
			icon.style.verticalAlign="middle";
			if(node.openIconSrc=="null")icon.style.display="none";
			icon.src = node.openIconSrc;
			node_contain.appendChild( icon );
   var checkbox=null;

		if(node.hasCheckbox)
		{
			checkbox=document.createElement( "IMG" );
			checkbox.style.verticalAlign="middle";
			if(node.entity.checked==null||node.entity.checked=="0")
			      checkbox.src=STREE_CHECKBOX_FALSE_ICON;
				 else
				   	if(node.entity.checked=="1")
					      checkbox.src=STREE_CHECKBOX_TRUE_ICON;
			             else
						  checkbox.src=STREE_CHECKBOX_TRUE_ICON1;
		    node_contain.appendChild(checkbox);
		}
	var cell;
		if(node.entityInfo.url!="")
	   {
		cell=document.createElement( "A" );
		cell.href=_stree_addContextPath(node.entityInfo.url);
        cell.innerHTML=node.entityInfo.showField;
		if(node.entityInfo.target!="") cell.target=node.entityInfo.target;
		}
			else
	   {
	    cell=document.createElement( "SPAN" );
		cell.innerHTML = node.entityInfo.showField;
	   }
		cell.className = "RC_TREE_CELL";
		node_contain.appendChild( cell );
		
//防止选根节点时树有抖动
			var icon1 = document.createElement( "IMG" );
			icon1.style.verticalAlign="middle";
			icon1.src = STREE_BLANK_ICON;
		    node_contain.appendChild( icon1 );
		    
	var childrenContainer = document.createElement( "DIV" );
		//childrenContainer.style.display = "none";
		node.appendChild( node_contain );
		node.appendChild( childrenContainer );
	    node.setAttribute( "richclientType", "RTREENODE" );
		node.icon = icon;
		node.cell = cell;
		node.checkbox=checkbox;
		node.childLoaded = true;
		if (!tree.hasRoot)
		{
			node_contain.style.display='none';
			// if(node.hasCheckbox) checkbox.style.display="none";
			// icon.style.display="none";
			// cell.style.display="none";
		}
		node.childrenContainer = childrenContainer;

		//方法
		node.addChildNode	= _streeNode_addChildNodes;
		node.expandNode		= _streeNode_expandNode;
		node.collapseNode	= _streeNode_collapseNode;
	    node.select		= _streeNode_selected;
		node.refresh        = _streeNode_refresh;
	    node.setIcon        = _streeNode_setIcon;
		node.setText        = _streeNode_setNodeText;
		node.getText        = _streeNode_getNodeText;
		node.getProperty    = _streeNode_getProperty;
        node.checkbox_click =_streeNode_checkbox_onchick
        node.getParent		= _streeNode_getParent;			//得到父节点
	    node.getChildren	= _streeNode_getChildren;		//得到子节点
	    node.isChecked      =_streeNode_isChecked;          //结点是否被选中
	    node.getEntity      =_streeNode_getEntity;
	    node.isRootNode     = _streeNode_isRoot;
	    node.hasChildNode       = _streeNode_hasChild;
	    node.getTree        =_streeNode_getTree;
	/*

	node.refresh			= _rtreeNode_refresh;



	//事件

	node.ondblclick		= _rtreenode_ondblclick;
	*/
	//node.onmousedown	= _streeNode_onmousedown;
	node.onmouseover	= _streeNode_onmouseover;
    node.onmouseout	    = _streeNode_onmouseout;

		node.onclick		= _streeNode_onclick;
		return node;
  }
   /**
    * 树节点的构造函数
    */
   function STreeNode(parentNode,entity,isFirstNode,isLastNode)
   {
   	var tree=parentNode.tree;
	var node = document.createElement( "DIV" );
        node.noWrap = true;
	    //属性
		node.level=parentNode.level
	    node.tree=tree;
	   	node.hasCheckbox=tree.hasCheckbox;
		node.checkType=tree.checkType;
		node.entity=entity;
		node.openIconSrc=STREE_DEFAULTOPEN_ICON;
		node.closeIconSrc=STREE_DEFAULTCLOSE_ICON;
		node.plusIconSrc="";
		node.minusIconSrc="";
		node.entityInfo=tree.getEntityInfo(node.entity.type)
		node.hasChild=(entity.childList!=null);
		node.isRoot=false;

		//处理节点状态
		_streeNode_processNodeStatus(node,entity,isFirstNode,isLastNode)


		//方法
	    node.addChildNode	= _streeNode_addChildNodes;
	    node.expandNode		= _streeNode_expandNode;
	    node.collapseNode	= _streeNode_collapseNode;
        node.select		= _streeNode_selected;
	    node.refresh        = _streeNode_refresh;
	    node.setIcon        = _streeNode_setIcon;
		node.setText        = _streeNode_setNodeText;
		node.getText        = _streeNode_getNodeText;
		node.getProperty    = _streeNode_getProperty;
        node.checkbox_click =_streeNode_checkbox_onchick
        node.getParent		= _streeNode_getParent;			//得到父节点
	    node.getChildren	= _streeNode_getChildren;		//得到子节点
	    node.isChecked      =_streeNode_isChecked;          //结点是否被选中
	    node.getEntity      =_streeNode_getEntity;
	    node.isRootNode         = _streeNode_isRoot;
	    node.hasChildNode       = _streeNode_hasChild;
	    node.getTree        =_streeNode_getTree;
	/*
	node.expandNode			= _rtreeNode_expandNode;
	node.collapseNode		= _rtreeNode_collapseNode;
	node.refresh			= _rtreeNode_refresh;
	node.getParent			= _rtreeNode_getParent;			//得到父节点
	node.getChildren		= _rtreeNode_getChildren;		//得到子节点
	//事件
	node.onmousedown	= _rtreenode_onmousedown;
	node.onmouseover	= _rtreenode_onmouseover;
	*/
	node.onmouseover	= _streeNode_onmouseover;
    node.onmouseout	    = _streeNode_onmouseout;
	node.onclick		= _streeNode_onclick;

	return node;
  }


function _streeNode_getTree()
{
	return this.tree;
}


function _streeNode_hasChild()
{
	return this.hasChild;
}

function _streeNode_isRoot()
{
	return this.isRoot;
}

function _streeNode_getEntity()
{
	return this.entity;
}

function _streeNode_getProperty(property)
{
	return this.entity.getProperty(property);
}
/**
 * 生成树节点时,处理树节点的状态
 * 处理收展图标,节点图标,复选框,节点显示文本,生成子节点容器
 */

function _streeNode_processNodeStatus(node,entity,isFirstNode,isLastNode)
{
	var level=node.level
	var image=node.entityInfo.icon
	var imageType=node.entityInfo.iconType;
	//处理节点图标
	if(image!="")
	   {
         var images=image.split(",");

         if(imageType=="xpath") //图标类型为xpath时,从节点的entity中取得图标,如只提供一个图标,结点展开闭合为同一图标
		 {
		 	if(images.length!=2)
			{
		     node.openIconSrc=_stree_addContextPath(entity.getProperty(images[0]));
	         node.closeIconSrc=node.openIconSrc;
			}
			else
			{
    		 node.openIconSrc=_stree_addContextPath(entity.getProperty(images[0]));
	         node.closeIconSrc=_stree_addContextPath(entity.getProperty(images[1]));
			}
			}
		 else
		  {
	        if(images.length!=2)
			{
		     node.openIconSrc=_stree_addContextPath(images[0]);
	         node.closeIconSrc=node.openIconSrc;
			}
			else
			{
    		 node.openIconSrc=_stree_addContextPath(images[0]);
	         node.closeIconSrc=_stree_addContextPath(images[1]);
			}

		 }
	   }
	   //处理结点的收展图标
	 if(level==""&&!node.tree.hasRoot&&isFirstNode)
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
	   var node_contain = document.createElement( "div" );
	    for(var i=0;i<level.length;i++)
		{
			var expandIcon = document.createElement( "IMG" );
			expandIcon.style.verticalAlign="middle";
		    if(level.charAt(i)=="1")
			           expandIcon.src = STREE_LINE_ICON;
			        else
			           expandIcon.src = STREE_BLANK_ICON;
		    node_contain.appendChild( expandIcon );
		}
 	   if(isLastNode)
	           node.level=level+"0";
	         else
	           node.level=level+"1";

		//生成树的收展标图,节点图标,复选框,子节点容器
	    var expandIcon = document.createElement( "IMG" );
		    expandIcon.src = node.plusIconSrc;
			expandIcon.style.verticalAlign="middle";
		    node_contain.appendChild( expandIcon );
	    var icon;
			icon = document.createElement( "IMG" );
			icon.style.verticalAlign="middle";
			if(node.closeIconSrc=="null") icon.style.display="none";
			icon.src = node.closeIconSrc;
			node_contain.appendChild( icon );
        var checkbox=null;

		if(node.hasCheckbox)
		{
			checkbox=document.createElement( "IMG" );
			checkbox.style.verticalAlign="middle";
			if(node.entity.checked==null||node.entity.checked=="0")
			      checkbox.src=STREE_CHECKBOX_FALSE_ICON;
				 else
				   	if(node.entity.checked=="1")
					      checkbox.src=STREE_CHECKBOX_TRUE_ICON;
			             else
						  checkbox.src=STREE_CHECKBOX_TRUE_ICON1;
		    node_contain.appendChild(checkbox);
		}
			var cell;
		if(node.entityInfo.url!="")
	   {
		cell=document.createElement( "A" );
		var turl=compileTemplate(node.entityInfo.url);
    	cell.href= _stree_addContextPath( runExpression(turl,entity));
		if(node.entityInfo.target!="") cell.target=node.entityInfo.target;
		}
			else
	   {
			cell = document.createElement( "span" );
		    
	   }
	   cell.innerHTML = node.entity.getProperty(node.entityInfo.showField);
		    cell.className = "RC_TREE_CELL";
			cell.style.verticalAlign="middle";
		    node_contain.appendChild( cell );
	    var childrenContainer = document.createElement( "DIV" );
		    childrenContainer.style.display = "none";
            node.appendChild( node_contain );
		    node.appendChild( childrenContainer );
	        node.setAttribute( "richclientType", "RTREENODE" );

		    expandIcon.style.cursor="hand";
            node.expandIcon = expandIcon;
	        node.icon = icon;
	        node.cell = cell;
			node.checkbox=checkbox;
	        node.childLoaded = false;
	        node.childrenContainer = childrenContainer;
}
function _stree_addContextPath(str)
{
if(str==null) return "";
if(str.indexOf("/")==0) return contextPath+str;
  else
return str;
}
/**
 * 生成树节点时调用的刷新函数,调用用户自定义函数
 */
function _streeNode_refresh()
{
		var functionName = this.entityInfo.refresh
		if( functionName!="" )
		{
			eval(functionName+"(this)");
		}
}

	function _streeNode_onmouseover()
	{
     addClass(this.cell,"RC_TREE_MOUSEOVER");
	 eventManager.stopPropagation();
	}
    function  _streeNode_onmouseout()
	{
    removeClass(this.cell,"RC_TREE_MOUSEOVER");
	eventManager.stopPropagation();
	}



/**
 * 节点的点击事件处理函数
 * 实现树节点的收展功能,结点的选中功能,并触发结点上用户定义的单击事件
 */
   function _streeNode_onclick()
{
	//eventManager.stopPropagation();
	var src = eventManager.getElement();
	if( src == this.cell || src == this.expandIcon || src == this.icon ||src==this.checkbox)	//选中节点
	{
		this.select();
	}
	if( src == this.cell )			//触发用户自定义动作
	{
		var functionName = this.entityInfo.onclick
		if( functionName!="" )
		{
			eval(functionName+"(this)");
		}
	}
	if( src == this.expandIcon )	//点击展开关闭结点
	{
	if( this.childrenContainer.style.display == "none" )
		{
			if(this.hasChild)
			  this.expandNode();
		}
		else
		{
			this.collapseNode();
		}
	}
	if(src==this.checkbox)        //点击checkbox
	{
       this.checkbox_click();
	}
}
/**
 * 处理点击checkbox
 */
function _streeNode_checkbox_onchick()
{
   if(this.checkType=="simple")
   {
   	if(this.entity.checked=="1")
	{
		this.entity.checked=0;
		this.checkbox.src=STREE_CHECKBOX_FALSE_ICON;
	}
	else
	{
		this.entity.checked=1;
		this.checkbox.src=STREE_CHECKBOX_TRUE_ICON;
	}
   }
   else
   {
	if(this.entity.checked=="1")
	{
		_stree_uncheckAllChild(this)
	}
	else
	{
		_stree_checkAllChild(this)
	}
	_stree_process_parentNode(this);
   }
    var functionName = this.entityInfo.oncheck;
	if( functionName!="" )
	  {
		eval(functionName+"(this)");
 	  }
}
function _stree_checkAllChild(node)
{
  node.entity.checked=1;
  node.checkbox.src=STREE_CHECKBOX_TRUE_ICON;
  if(node.hasChild)
    if(node.isChildLoaded)
	{
		var childs=node.getChildren();
		for(var i=0;i<childs.length;i++)
		   _stree_checkAllChild(childs[i]);
	}
	else
	{
        var childs=node.entity.childList;
		for(var i=0;i<childs.length;i++)
		   _stree_unload_checkAllChild(childs[i]);
	}

  return;
}

function _stree_unload_checkAllChild(entity)
{
	entity.checked=1;
    if(entity.childList)
	{
		var childs=entity.childList;
		for(var i=0;i<childs.length;i++)
		   _stree_unload_checkAllChild(childs[i]);
	}
    return;
}


function _stree_uncheckAllChild(node)
{
	node.entity.checked=0;
	node.checkbox.src=STREE_CHECKBOX_FALSE_ICON;

  if(node.hasChild)
    if(node.isChildLoaded)
	{
		var childs=node.getChildren();

		for(var i=0;i<childs.length;i++)
		   _stree_uncheckAllChild(childs[i]);
	}
	else
	{
        var childs=node.entity.childList;
		for(var i=0;i<childs.length;i++)
		   _stree_unload_uncheckAllChild(childs[i]);
	}

  return;
}
function _stree_unload_uncheckAllChild(entity)
{
	entity.checked=0;
    if(entity.childList)
	{
		var childs=entity.childList;
		for(var i=0;i<childs.length;i++)
		   _stree_unload_uncheckAllChild(childs[i]);
	}
    return;
}
function _stree_process_parentNode(node)
{
  var parentNode=node.getParent();
  if(parentNode==null) return;
  var checked=node.entity.checked;
  if (checked=="2")
  {
    parentNode.entity.checked="2";
	parentNode.checkbox.src=STREE_CHECKBOX_TRUE_ICON1;
	_stree_process_parentNode(parentNode);
    return;
  }
  var childs=parentNode.getChildren();
  for(var i=0;i<childs.length;i++)
  {
  	if(childs[i].entity.checked==null) childs[i].entity.checked="0"
  	if(childs[i].entity.checked!=checked)
	{
	 parentNode.entity.checked="2";
	 parentNode.checkbox.src=STREE_CHECKBOX_TRUE_ICON1
	_stree_process_parentNode(parentNode);
	return ;
	}
  }

  if(checked=="1")
  {
  parentNode.entity.checked=1;
  parentNode.checkbox.src=STREE_CHECKBOX_TRUE_ICON;
  }
  else
  {
  	parentNode.entity.checked=0;
	parentNode.checkbox.src=STREE_CHECKBOX_FALSE_ICON;
  }
  _stree_process_parentNode(parentNode);
}

/**
 * 得到子节点
 */
function _streeNode_getChildren()
{
	return this.childrenContainer.childNodes;
}

/**
 * 得到父节点
 */
function _streeNode_getParent()
{
	if( this.isRoot )
		return null;
	else
		return this.parentNode.parentNode;
}

/**
 * 处理选中结点
 */
function _streeNode_selected()
{
	var tree = this.tree;
	//清除原选中节点颜色，设置当前选中节点颜色
	if( tree.cur_node )
	{
		tree.cur_node.cell.className = "RC_TREE_CELL";
	}
	this.cell.className = "RC_TREE_ACTIVENODE";
	tree.cur_node = this;
}
/**
 * 获得选中的节点
 */
STree.prototype.getCheckedList=function(entityType)
{
    if(entityType!=null)
	{
      var dataset=this.getDataset(entityType);
	  if(dataset==null){
	  	 alert(entityType+STREE_ENTITY_NOT_EXIST);
		 return;
		 }
      var checkList=new CheckList(entityType);
	  var entitys=dataset.values;
	  var entityLength=dataset.getLength();
	  for(var i=0;i<entityLength;i++)
	  {
	  	   var checked=entitys[i].checked
           if(checked=="1"||checked=="2") checkList.push(entitys[i]);
	  }
      return checkList;
	}
    else
	{var list=new Array();
     for(entityType in this.datasetList)
        {
		  if (entityType=="root") continue;
	      var dataset=this.getDataset(entityType);
		  if(dataset==null){
		  	 alert(entityType+STREE_ENTITY_NOT_EXIST);
			 return;
			 }
	      var checkList=new CheckList(entityType);
		  var entitys=dataset.values;
		  var entityLength=dataset.getLength();
		  for(var i=0;i<entityLength;i++)
		  {
		  	   var checked=entitys[i].checked
	           if(checked=="1"||checked=="2") checkList.push(entitys[i]);
		  }
		  list.push(checkList);
		}
		return list;
	}

}

/**
 * 获得选中的节点
 */
STree.prototype.getUncheckedList=function(entityType)
{
	    if(entityType!=null)
	{
      var dataset=this.getDataset(entityType);
	  if(dataset==null){
	  	 alert(entityType+STREE_ENTITY_NOT_EXIST);
		 return;
		 }
      var checkList=new CheckList(entityType);
	  var entitys=dataset.values;
	  var entityLength=dataset.getLength();
	  for(var i=0;i<entityLength;i++)
	  {
	  	   var checked=entitys[i].checked
           if(checked=="0"||checked==null) checkList.push(entitys[i]);
	  }
      return checkList;
	}
    else
	{
	 var list=new Array();
     for(entityType in this.datasetList)
        {
		  if (entityType=="root") continue;
	      var dataset=this.getDataset(entityType);
		  if(dataset==null){
		  	 alert(entityType+STREE_ENTITY_NOT_EXIST);
			 return;
			 }
	      var checkList=new CheckList(entityType);
		  var entitys=dataset.values;
		  var entityLength=dataset.getLength();
		  for(var i=0;i<entityLength;i++)
		  {
		  	   var checked=entitys[i].checked
	           if(checked=="0"||checked==null) checkList.push(entitys[i]);
		  }
		  list.push(checkList);
		}
		return list;
	}

}

/**
 * 树的初始化函数
 * 功能:处理树实体关系;生成树的第一级节点;
 */
  STree.prototype.init=function()
  {
  	this.processRelation();//处理树实体关系
  	this.processCheckBox();
  	var rootNode=new STreeRootNode(this);
  	this.rootNode=rootNode;
	rootNode.refresh();
	this.treeContainer.appendChild(rootNode);
	var div =document.createElement("div");
	this.treeContainer.appendChild(div);
	this.hidden=div;
	rootNode.addChildNode();
	if(isFF) 
	{
	  if(registerTopContainer(this.treeContainer.parentNode))  EOSResizeObjects.push(this);
    }
  }
  /**
   * 获得树根节点.
   */
STree.prototype.getRootNode=function()
{
	return this.rootNode;
}

STree.prototype.getSelectedNode=function()
{
	return this.cur_node;
}


/**
 * 设置树节点的图标
 */
 function _streeNode_setIcon(openIcon,closeIcon)
 {
  	this.openIconSrc=_stree_addContextPath(openIcon);
	 if(closeIcon)
	  this.closeIconSrc=_stree_addContextPath(closeIcon);
	  else
	  this.closeIconSrc=this.openIconSrc;
	if(this.closeIconSrc=="null") this.icon.style.display="none";
    this.icon.src=this.closeIconSrc;
 }

 /**
 * 得到节点checkbox是否被选中
 */
 function _streeNode_isChecked()
 {
 	var checked=this.entity.checked
  	if(checked=="1"||checked=="2")
		return true;
    else
		return false;
 }


/**
 *
 * 设置树节点的显示文本
 */
 function _streeNode_setNodeText(text)
 {
  this.cell.innerHTML=text;
 }

 /**
  * 得到树节点的显示文本
  */
 function _streeNode_getNodeText()
 {
 return this.cell.innerHTML;
 }



 STree.prototype.createHiddenData=function()
 {
     var strBuff= new StringBuffer();

     for(entityType in this.datasetList)
        {
		  if (entityType=="root") continue;
	      var index=1;
		  var dataset=this.getDataset(entityType);

		  if(dataset==null){
		  	 alert(entityType+STREE_ENTITY_NOT_EXIST);
			 return;
			 }

		  var entitys=dataset.values;
		  var entityLength=dataset.getLength();

		  for(var i=0;i<entityLength;i++)
		  {
		  	   var checked=entitys[i].checked


	           if(checked=="1"||checked=="2")
			  {
			   var submitXpath=entitys[i].type;
			   var tmp=this.getEntityInfo(submitXpath).submitXpath
				   if(tmp!="") submitXpath=tmp;
				strBuff.append(_stree_create_hiddenStr(index,entitys[i],submitXpath));
				index=index+1
			   }
		  }
		//  list.push(checkList);
		}
         this.hidden.innerHTML=strBuff;

 }

function _stree_create_hiddenStr(index,entity,submitXpath)
	 {
        var buffer = new StringBuffer();
		var keys = entity.getKeys();

		for(var i=0;i<keys.length;i++){
			var obj = entity.getProperty(keys[i]);
		buffer.append("<input type='hidden' name='").append(submitXpath).append("[").append(index).append("]/").append(keys[i]).append("' value='").append(obj).append("'/>");
		}
        return buffer;
}

 STree.prototype.autoResizeS1=function()
 {
   this.treeContainer.parentNode.style.display="none";
 }
 STree.prototype.autoResizeS2=function()
 {
      var container=this.treeContainer.parentNode;

		var obj=container.parentNode
		while(obj!=null)
			{
			if(obj.getAttribute&&obj.getAttribute("layout")!=null)
				   { 
				      container.style.height=obj.offsetHeight;

				      obj=null;//跳出循环
				   }
			   else
				   {
				       obj=obj.parentNode;
				   }

			}
	      container.style.display="";
 }
 
 STree.prototype.isInCurrPanel=function ()
{
    if(_eos_curr_open_panel!=null)
    {   
        var obj=this.treeContainer.offsetParent;
    	while(true)
		{
	
			if(obj==null) 
			      return false;
			if(obj==_eos_curr_open_panel.table) 
	                return true;		      
			obj=obj.offsetParent;	               
		}
    }
    else
     return false;

}