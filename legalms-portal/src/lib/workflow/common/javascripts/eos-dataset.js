/**
 * @class Entity类是一条记录的数据结构,如果它的字段包含其它复杂数据结构,则用xpath的方式将其拉平.
 * @param {String} name Entity的名字,在服务器端传入的类型.
 */
	function Entity(name){
		if( !name )
			name = "entity";
		this.status = Entity.STATUS_INIT;	//entity的状态.
		this.name = name;
		this.values = {};			//entity存放值的对象.
		this.parent = new Dataset(name);	//
		this.keys = [];
		this.__keys = {};
		this.__type = null;
		this.id = null;
	}
	Entity.STATUS_NEW = 0;
	Entity.STATUS_INIT = 1;
	Entity.STATUS_MODIFIED = 2;
	Entity.STATUS_DELT = 3;
	Entity.STATUS_HIDDEN = 4;
	Entity.XPATH_LEVEL = 2;
	Entity.LINK_SIGN = "__collection";



	/**
	 * 返回Entity的xpath下存的对象.
	 * @param {String} xpath
	 * @return 返回xpath下的数据.
	 * @type {String}
	 */
	Entity.prototype.getPropertyByFieldName = function( xpath )
	{

		return this.values[xpath];
/*
		var key = this.xpathParse(xpath);
		if(!(key instanceof Array)){
			return this.values[key];
		}else{
			var field = this;
			var i = 0;
			var len = key.length;
			if(Entity.XPATH_LEVEL<key.length){
				len = Entity.XPATH_LEVEL;
			}
			for(;i<len;i++){
				field = field.getValue(key[i]);
			}
			return field;
		}
		*/
	};


	/**
	 * 设置entity的xpath下的value
	 * @param {String} xpath
	 * @param {String} value
	 */
	Entity.prototype.setPropertyByFieldName = function( xpath, value )
	{
		var isChange = false;
		isChange = this.setValue(xpath,value);
/*
		var key = this.xpathParse(xpath);
		if(!(key instanceof Array)){
			isChange = this.setValue(key,value);
		}else{
			var field = this;
			var i = 0;
			var len = key.length;
			if(Entity.XPATH_LEVEL<key.length){
				len = Entity.XPATH_LEVEL;
			}
			for(;i<len -1;i++){
				if(!field.getValue(key[i])){
					var subEntity = new Entity(key[i]);
					field.setValue(key[i],subEntity);
					subEntity.parent = this;
				}
				field = field.getValue(key[i]);
			}
			isChange = field.setValue(key[i],value);
		}
	*/
		if(isChange){this.update();}

	};


Entity.prototype.setPropertyByXpath=function(xPath ,nvalue ){

	var fieldNames=(xPath+'').split('/');
	var fieldName=fieldNames[fieldNames.length-1];

	if (fieldNames.length==1){
		this.setPropertyByFieldName(fieldName,nvalue);
		return;
	}

	fieldNames = fieldNames.slice(0,fieldNames.length-1);
	xPath=fieldNames.join('/');

	var entityN=this.getPropertyByXpath(xPath);

	if (entityN instanceof Entity){
		entityN.setPropertyByFieldName(fieldName,nvalue);
	}else if (entityN!==undefined && entityN!==null){
		oldValue=entityN[fieldName];
		entityN[fieldName]=nvalue;
	}else{
		entityN= this.createEntityTree(xPath);
		entityN.setPropertyByFieldName(fieldName,nvalue);
	}


}

Entity.prototype.createEntityTree =function(xPath){
	var fieldNames=(xPath+'').split('/');
	var currentEntity=this;
	var nvalue;
	for (var i=0;i<fieldNames.length;i++ ){
		var fieldName= fieldNames[i];
		nvalue=currentEntity.getPropertyByFieldName(fieldName);
		if (nvalue===null || nvalue===undefined){
			nvalue=new Entity(fieldName);
			currentEntity.setPropertyByFieldName(fieldName,nvalue);
		}
		currentEntity=nvalue;
	}
	return nvalue;


}

Entity.prototype.getPropertyByXpath=function(xPath){

	var fieldNames=(xPath+'').split('/');
	var value=this;
	for (var i=0;i<fieldNames.length;i++ ){
		var fieldName= fieldNames[i];

		if (value instanceof Entity){
			value=value.getPropertyByFieldName(fieldName);
		}else {
			value=value[fieldName];
		}
		if (value===null || value===undefined){
			break;
		}
	}
	return value;
}



function deepEntity(isDeep){
	Entity.prototype.getProperty=Entity.prototype.getPropertyByFieldName;
	Entity.prototype.setProperty=Entity.prototype.setPropertyByFieldName;
	if (isDeep){
		Entity.prototype.getProperty=Entity.prototype.getPropertyByXpath;
		Entity.prototype.setProperty=Entity.prototype.setPropertyByXpath;

	}
}

deepEntity(false);


	/**
	 * 克隆一个自己.
	 * @return 返回克隆的自己.
	 * @type Entity
	 */
	Entity.prototype.clone = function(deep)
	{
		var _entity = new Entity(this.name);
		_entity.__type = this.__type;
		for(var i=0;i<this.keys.length;i++){
			var key = this.keys[i];
			var value = this.getProperty(key);
			if(value instanceof Dataset || value instanceof Entity){
				_entity.setProperty(key,value.clone(deep));
			}else{
				_entity.setValue(key,value);
			}
		}
		return _entity;
	};
	/**
	 * 输出可以送到服务器端的字符串.
	 * @return 返回提交字符串.
	 * @type {String}
	 */
	Entity.prototype.toXMLString = function(hasRoot){
		hasRoot = hasRoot!==false;
		var buffer = new StringBuffer();
		var p_tag='';
		var e_tag=this.name;

		if (hasRoot){
			if( this.name && this.name.indexOf("/")>0){
				p_tag = this.name.split("/")[0];
				e_tag = this.name.split("/")[1];
				buffer.append("<").append(p_tag).append(">\n");
			}
			buffer.append("<").append(e_tag);

			//buffer.append(" __status=\"").append(this.status).append("\"");
			if(this.__type){
				buffer.append(" __type=\"").append(this.__type).append("\"");
			}
			if(this.id){
			//	buffer.append(" id=\"").append(this.id).append("\"");
			}
			buffer.append(">\n");
		}

		var keys = this.getKeys();
		var childXpaths = {};
		for(var i=0;i<keys.length;i++){
			var obj = this.getProperty(keys[i]);
			var isDataset = obj instanceof Dataset;
			var isEntity = obj instanceof Entity;
			if (obj===null || obj===undefined ||obj===""){
				if(keys[i].indexOf("/")>0){
					var arr = keys[i].split("/");
					if(!childXpaths[arr[0]]){
						childXpaths[arr[0]] = [];
					}
					var str = "<" + arr[1] + " __isNullOrEmpty=\"null\"/>\n";
					childXpaths[arr[0]].push(str);
				}else{
					buffer.append("<").append(keys[i]).append(" __isNullOrEmpty=\"null\"/>\n");
				}

			}else if( !isDataset&&!isEntity){
				if(keys[i].indexOf("/")>0){
					var arr = keys[i].split("/");
					if(!childXpaths[arr[0]]){
						childXpaths[arr[0]] = [];
					}
					var str = "<" + arr[1] + ">" + xmlConversion(obj+'') + "</" + arr[1] + ">\n";
					childXpaths[arr[0]].push(str);
				}else{
					buffer.append("<").append(keys[i]).append(">");
					if(obj||obj===0){
						buffer.append( xmlConversion(obj.toString()) );
					}
					buffer.append("</").append(keys[i]).append(">\n");
				}
			}else{
				buffer.append(obj+'');

			}
		}

		for(var xpaths in childXpaths){
			if ( childXpaths.hasOwnProperty(xpaths) ){
				buffer.append("<").append(xpaths).append(">");
				buffer.append(childXpaths[xpaths].join(""));
				buffer.append("</").append(xpaths).append(">\n");
			}
		}
		if (hasRoot){
				buffer.append("</").append(e_tag).append(">\n");
				if (p_tag){
					buffer.append("</").append(p_tag).append(">\n");
				}
		}
		return buffer.toString();
	};

	Entity.prototype.toJson=function(hasRoot){
		hasRoot = hasRoot!==false;
		var json=Entity2Json(this);
		if(hasRoot){
			var s=this.name.split('/');
			if(this.__type){
				json.__type=this.__type;
			}
			for(var i=0,len=s.length;i<len;i++){
				var o={};
				o[s[i]]=json;
				json=o;
			}
		}
		
		return json;
	}
	
	Entity.prototype.toString = Entity.prototype.toXMLString;


	/**
	 * 得到entity中所有的key.
	 * @type Array
	 * @return 返回key的数组.
	 */
	Entity.prototype.getKeys = function(){
		return this.keys;
	}


	/**
	 * xpath解析,将xpath解析成数组.
	 * @param {Object} xpath
	 * @return xpath对应的数组.
	 * @type {String}
	 */
	Entity.prototype.xpathParse = function(xpath){
		xpath +="";
		var pos = xpath.indexOf("/");
		if(pos<0){
			return xpath;
		}else{
			var arr = xpath.split("/");
			if(arr.length!=2){
				$error(EOS_DATASET_NOT_SUPPORT_XPATH);
			}
			return arr;
		}
	};


	/**
	 * 根据数组下标设置entity里数据项的值.
	 * @param {String} key
	 * @param {String} value
	 */
	Entity.prototype.setValue = function(key,value){
		var isChange = false;
		if(!this.values[key]){
			if(!this.__keys[key]){
				this.keys.push(key);
				this.__keys[key] = true;
			}
			isChange = true;
		}else{
			if(this.values[key]!=value){
				isChange = true;
			}
		}
		this.values[key] = value;
		return isChange;
	}


	/**
	 * @private
	 * 根据数组下标获取entity里数据项的值.
	 * @param {String} key
	 * @return key对应的值.
	 * @type {String}
	 */
	Entity.prototype.getValue = function(key){
		return this.values[key];
	};
	/**
	 * 更新entity时调用.
	 */
	Entity.prototype.update = function(){
		if(this.parent){
			if(this.parent instanceof Dataset){
				this.parent.onUpdateEntity(this);
			}
			this.parent.update();
		}
		this.__onUpdate();
		this.onUpdate();
	};
	/**
	 * Entity的对外接口,用户可以重写该方法.
	 */
	Entity.prototype.onUpdate = function(){

	}
	/**
	 * @private
	 * Entity的对内接口,设计控件时重写该方法.
	 */
	Entity.prototype.__onUpdate = function(){

	}
	/**
	 * @class Dataset类,客户端的数据结构.
	 * @param {String} entityType Enitity类型，新增entity时按此类型构造entity
	 */
	function Dataset(entityType){
		this.values = [];
		this.entityType = entityType;
		//this.srcXml = null;
	}
	/**
	 * 添加一个Entity
	 * @param {Entity} entity 添加的Entity
	 * @param {Entity} isNew 是否作为新entity添加,为false时不作为新entity,其他情况为当作新entity处理
	 */
	Dataset.prototype.addEntity = function( entity, isNew ){
		this.values.push(entity);
		entity.parent = this;
		if (isNew!==false){
			entity.status = Entity.STATUS_NEW;
		}
		this.onAddEntity(entity);
		this.update();
	}

	Dataset.prototype.insertEntity=function(entity,isNew,index){
		if(index!==undefined){
			this.values.splice(index,0,entity);
		}else{
			this.values.push(entity);
		}
		entity.parent = this;
		if (isNew!==false){
			entity.status = Entity.STATUS_NEW;
		}
		this.onAddEntity(entity);
		this.update();
	}
	
	/**
	 * 添加一个空的Entity
	 * @type {Entity}
	 * @return 添加的空Entity
	 */
	Dataset.prototype.addBlankEntity = function(){
		var entity = new Entity(this.entityType);
		if(this.getLength()!=0){
			entity = this.get(0).clone();
		}
		this.values.push(entity);
		entity.parent = this;
		entity.status = Entity.STATUS_NEW;
		this.onAddEntity(entity);
		this.update();
		return entity;
	}
	/**
	 * 删除一个Entity,删除时只将它的status标记为STATUS_DELT
	 * @param {Object} entity 要删除的Entity
	 */
	Dataset.prototype.removeEntity = function( entity, forceDel ){
		if(this.onDeleteEntity(entity)){
			//this.removedEntities.push(entity);
			if (forceDel===true){
				for(var i=0;i<this.values.length;i++){
					var entityT = this.values[i];
					if (entityT===entity){
						this.values.splice(i,1);
						break;
					}
				}
			}else{
				entity.status = Entity.STATUS_DELT;
			}
			this.update();
		}
	}
	/**
	 * 获得所有的entity.
	 * @type Array
	 * @return 返回所有的entities.
	 */
	Dataset.prototype.getAlltEntities = function(){
		var entities = [];
		for(var i=0;i<this.values.length;i++){
			var entity = this.values[i];
			entities.push(entity);
		}
		return entities;
	}
	/**
	 *为entity设置值.
	 */
	Dataset.prototype.setValue = function(entity,key,value){
		entity.setValue(key,value);
	}
	/**
	 * 获得所有修改过的entity.
	 * @type Array
	 * @return 返回修改过的entities.
	 */
	Dataset.prototype.getModifiedEntities = function(){
		var entities = [];
		for(var i=0;i<this.values.length;i++){
			var entity = this.values[i];
			if(entity.status==Entity.STATUS_MODIFIED){
				entities.push(entity);
			}
		}
		return entities;
	}
	/**
	 * 获得所有新增的entity.
	 * @type Array
	 * @return 返回新增的entities.
	 */
	Dataset.prototype.getInsertEntities = function(){
		var entities = [];
		for(var i=0;i<this.values.length;i++){
			var entity = this.values[i];
			if(entity.status==Entity.STATUS_NEW){
				entities.push(entity);
			}
		}
		return entities;
	}
	/**
	 * 获得所有删除的entity.
	 * @type Array
	 * @return 返回删除的entities.
	 */
	Dataset.prototype.getRemovedEntities = function(){
		var entities = [];
		for(var i=0;i<this.values.length;i++){
			var entity = this.values[i];
			if(entity.status==Entity.STATUS_DELT){
				entities.push(entity);
			}
		}
		return entities;
	}
	/**
	 * 过滤dataset,返回符合条件的entity的数组.
	 * @param {Object} key
	 * @param {Object} value
	 * @return 返回entity的数组.
	 * @type Array
	 */
	Dataset.prototype.filter = function( key, value ){
		var entities = [];
		for(var i=0;i<this.values.length;i++){
			var entity = this.values[i];
			if(entity.getProperty(key)==value){
				entities.push(entity);
			}
		}
		return entities;
	}

Dataset.prototype.findEntity = function( fieldName, value ){
	for(var i=0;i<this.values.length;i++){
		var entity = this.values[i];
		if(entity.getProperty(fieldName)==value){
			return entity;
		}
	}
	return null;
}

	/**
	 * 转换为参数形式.key=value的形式.
	 */
	Dataset.prototype.toString = function(){
		var buffer = new StringBuffer();
		for(var i=0;i<this.values.length;i++){
			var entity = this.values[i];
			buffer.append(entity.toString());
		}
		return buffer.toString();
	}
	
	Dataset.prototype.toJson=function(){
		return Dataset2Json(this);
	}
	/**
	 * 清空dataset.
	 */
	Dataset.prototype.clear = function(){
		this.values = [];
		this.update();
	}
	/**
	 * dataset的合并.将另一个dataset合并到当前dataset中.
	 * 合并时先看类型,如果类型相同则合并,合并后会将新增的entity状态设为Entity.STATUS_INIT
	 * 不同则警告而不合并.合并后并不影响dataset,所用的entity都是克隆过的.
	 * @param {Object} dataset
	 */
	Dataset.prototype.appendDataset = function(dataset){
		//if(this.entityType==dataset.entityType){
			for(var i=0;i<dataset.getLength();i++){
				var entity = dataset.get(i).clone(true);
				this.addEntity(entity);
				entity.status = Entity.STATUS_INIT;
			}
			this.update();
		/*}else{
			EOSLog.warn("dataset的类型不一致.");
		}*/
	}
	/**
	 * Dataset的初始化函数，将传入的nodes初始化为entity.
	 * @param {Array} nodes 传入node的数组.
	 */
	Dataset.prototype.init = function(nodes){
		if(nodes.length==1){
			var nullorempty = nodes[0].getAttribute("__isNullOrEmpty");
			if(nullorempty=="empty"||nullorempty=="null"){
				return;
			}
		}
		for(var i=0;i<nodes.length;i++){
			var node = nodes[i];
			if(!node.tagName){
				continue;
			}
			var entity = Dataset.initEntity(node);
			entity.id = node.getAttribute(Entity.LINK_SIGN)?node.getAttribute(Entity.LINK_SIGN):null;
			this.onFillEntity(entity);
			this.addEntity(entity);
			entity.status = Entity.STATUS_INIT;
		}
	}
	/**
	 * 初始化一个entity.由于浏览器的不同,node的解析也不同,
	 * 要注意node的nodeType.
	 * @param {Node} node 要解析为entity的节点.
	 * @type {entity}
	 * @return 返回解析成功的entity.
	 */
	Dataset.initEntity = function(node){
		if (!node){
			return null;
		}
		var entity = new Entity(node.tagName);
		entity.__type = node.getAttribute("__type");
		var childs = node.childNodes;
		//$debug(" 初始化entity: " + node.xml);
		var nodeList = [];
		nodeList["type"] = null;
		for(var j=0;j<childs.length;j++){
			var child = childs[j];
			if(child.nodeType==1){
				if(!child.getAttribute(Entity.LINK_SIGN)){
					Dataset.initField(entity,child);
				}else{
					if(nodeList["type"]==child.tagName){
						nodeList.push(child);
					}else{
						if(nodeList["type"]!=null){
							var ds = new Dataset(nodeList["type"]);
							ds.init(nodeList);
							entity.setProperty(nodeList["type"],ds);
						}
						nodeList = [];
						nodeList["type"] = child.tagName;
						nodeList.push(child);
					}
				}
			}
		}
		if(nodeList["type"]!=null){
			var ds = new Dataset(nodeList["type"]);
			ds.init(nodeList);
			entity.setProperty(nodeList["type"],ds);
		}
		nodeList = [];
		return entity;
	}
	/**
	 * 初始化某一字段的方法.
	 * 解析时只支持一级不带下标的xpath
	 * @param {Entity} entity
	 * @param {Node} node
	 */
	Dataset.initField = function(entity,node){
		if(node.childNodes.length>1){
			for(var i=0;i<node.childNodes.length;i++){
				var child = node.childNodes[i];
				if(child.nodeType==1){
					var xpath = node.tagName + "/" + child.tagName;
					entity.setProperty(xpath,getNodeValue(child));
				}
			}
			//var en = Dataset.initEntity(node);
			//entity.setProperty(node.tagName,en);
		}else{
			entity.setProperty(node.tagName,getNodeValue(node));
		}
		//$debug(node.tagName + node.firstChild.nodeType);
	}
	/**
	 * 切割当前dataset,将它从fromIndex开始到toIndex的entity切割到一个新的dataset中.
	 * fromIndex参数必填.toIndex如果不填写则默认等于dataset的长度.
	 * 所有切割出去的entity必须经过克隆.
	 * @param {int} fromIndex //切割的起始位置.
	 * @param {int} toIndex //切割的结束位置.
	 * @type Dataset
	 * @return 返回新的dataset.
	 */
	Dataset.prototype.slice = function(fromIndex,toIndex){
		var dataset = new Dataset(this.entityType);
		if(!toIndex){
			toIndex = this.getLength();
		}
		if(toIndex>this.getLength()){
			toIndex = this.getLength();
		}
		for(var i=fromIndex;i<toIndex;i++){
			var entity = this.get(i).clone();
			dataset.addEntity(entity);
		}
		return dataset;
	}
	/**
	 * 当dataset的entity更新时会调用该函数.
	 */
	Dataset.prototype.update = function(){
		this.onUpdate();
	}


	Dataset.prototype.getEntities = function(){
		return this.values;
	}

	/**
	 * 获得dataset的长度--里面存了多少个eneity.
	 * @type int
	 * @return 返回dataset的长度.
	 */
	Dataset.prototype.getLength = function(){
		return this.getEntities().length;
	}

	/**
	 * 根据索引获得Entity的方法.
	 * @param {Object} index
	 * @return 返回第index个entity.
	 * @type Entity
	 */
	Dataset.prototype.get = function(index){
		return this.values[index];
	}
	/**
	 * Dataset提供的对外接口，dataset初始化时填充entity后调用.
	 * 用户可以重写该项方法.
	 * @param {Entity} entity
	 */
	Dataset.prototype.onFillEntity = function(entity){

	}
	/**
	 * Dataset提供的对外接口，dataset更新某一个entity时调用.
	 * 用户可以重写该项方法.
	 * @param {Entity} entity
	 */
	Dataset.prototype.onUpdateEntity = function(entity){

	}
	/**
	 * Dataset提供的对外接口，dataset添加某一个entity时调用.
	 * 用户可以重写该项方法.
	 * @param {Entity} entity
	 */
	Dataset.prototype.onAddEntity = function(entity){

	}
	/**
	 * Dataset提供的对外接口，dataset删除某一个entity时调用.
	 * 用户可以重写该项方法.
	 * @param {Entity} entity
	 */
	Dataset.prototype.onDeleteEntity = function(entity){
		return true;
	}
	/**
	 * Dataset提供的对外接口，dataset更新时调用.
	 * 用户可以重写该项方法.
	 * @param {Entity} entity
	 */
	Dataset.prototype.onUpdate = function(){

	}
	/**
	 * Dataset的克隆方法,
	 */
	Dataset.prototype.clone = function(deep){
		var dataset = new Dataset(this.entityType);
		if(!deep){
			return dataset;
		}else{
			for(var i=0;i<this.values.length;i++){
				var entity = this.values[i].clone(deep);
				dataset.values.push(entity);
			}
			return dataset;
		}

	}

	Dataset.prototype.getInsertDataset = function(){
		var dataset = new Dataset(this.entityType);
		var entities = this.getInsertEntities();
		for(var i=0;i<entities.length;i++){
			dataset.addEntity(entities[i].clone(true));
		}
		return dataset;
	}
	Dataset.prototype.getRemovedDataset = function(){
		var dataset = new Dataset(this.entityType);
		var entities = this.getRemovedEntities();
		for(var i=0;i<entities.length;i++){
			dataset.addEntity(entities[i].clone(true));
		}
		return dataset;
	}
	Dataset.prototype.getModifiedDataset = function(){
		var dataset = new Dataset(this.entityType);
		var entities = this.getModifiedEntities();
		for(var i=0;i<entities.length;i++){
			dataset.addEntity(entities[i].clone(true));
		}
		return dataset;
	}
	/**
	 * dataset的方法,可以获得插入,更新和删除的xml.
	 * 分别放在insertEntities,updateEntities和removeEntities节点下.
	 *
	 */
	Dataset.prototype.getSubmitXML = function(){
		var entities = this.getInsertEntities();
		var buffer = new StringBuffer();
		if(entities.length>0){
			//buffer.append("<insertEntities>");
			for(var i=0;i<entities.length;i++){
				entities[i].name = "insertEntities";
				buffer.append(entities[i].toString());
			}
			//buffer.append("</insertEntities>");
		}else{
			buffer.append("<insertEntities __isNullOrEmpty=\"null\"/>");
		}
		entities = this.getModifiedEntities();
		if(entities.length>0){
			//buffer.append("<updateEntities>");
			for(var i=0;i<entities.length;i++){
				entities[i].name = "updateEntities";
				buffer.append(entities[i].toString());
			}
			//buffer.append("</updateEntities>");
		}else{
			buffer.append("<updateEntities __isNullOrEmpty=\"null\"/>");
		}
		entities = this.getRemovedEntities();
		if(entities.length>0){
			//buffer.append("<deleteEntities>");
			for(var i=0;i<entities.length;i++){
				entities[i].name = "deleteEntities";
				buffer.append(entities[i].toString());
			}
			//buffer.append("</deleteEntities>");
		}else{
			buffer.append("<deleteEntities __isNullOrEmpty=\"null\"/>");
		}
		return buffer.toString();
	}
	/**
	 * 创建一个dataset的方法，传入的参数可以是xmlDom,xml字符串.
	 * @param {Object} xml
	 * @param {Object} xpath
	 * @param {Object} name
	 */
	Dataset.create = function(xml,xpath,name){
		var xmlDom = null;
		$debug("type of xml" + typeof(xml));
		if(typeof(xml)=="string"){
			xmlDom = createXmlDom();
			xmlDom.loadXML(xml);
		}else if(typeof(xml)=="object"){
			xmlDom = xml;
		}else{
			$error("error xml of " + xml);
			return null;
		}
		if(xpath.indexOf("/")!=0){
			xpath = "/" + xpath;
		}
		if(xpath.indexOf("/root/data")<0){
			xpath = "/root/data" + xpath;
		}
//		var node = xmlDom.selectSingleNode(xpath);
		var selectNodes = xmlDom.selectNodes(xpath);
		if(selectNodes){
			if(!name){
				var arrNames = xpath.split("/");
				name = arrNames[arrNames.length-1];
			}
			var dataset = new Dataset(name);
			dataset.init(selectNodes);
			return dataset;
		}else{
			$error("no node found by xpath:" + xpath + "in xml:" + xmlDom.xml);
			return null;
		}
	}



function Dataset2Array(dataset,rootName,filterRemove){
	var datasetArray = [];
	if (!dataset){
		return datasetArray;
	}
	rootName = rootName||"";
	var len = dataset.getLength();
	for(var i=0;i<len;i++){
		var entity = dataset.get(i);
		if(filterRemove){
			if(entity.status==Entity.STATUS_DELT||entity.status==Entity.STATUS_HIDDEN){
				continue;
			}
		}
		var entityArray = Entity2Array(entity);
		var index = i+1;
		for(var j=0;j<entityArray.length;j++){
			var key = rootName + "[" + index + "]/" + entityArray[j].key;
			datasetArray.push({key:key,value:entityArray[j].value});
		}
	}
	return datasetArray;
}

function Entity2Array(entity){
	var entityArray = [];
	if (!entity){
		return entityArray;
	}
	if(entity.__type){
		entityArray.push({key:"__type",value:entity.__type});
	}
	var len = entity.keys.length;
	for(var i=0;i<len;i++){
		var fieldName = entity.keys[i];
		var value = entity.getProperty(fieldName);
		if(value instanceof Entity){
			var enArr = Entity2Array(value);
			for(var j=0;j<enArr.length;j++){
				var name =fieldName + "/" + enArr[j].key;
				entityArray.push({key:name,value:enArr[j].value});
			}
		}else if(value instanceof Dataset){
			var datasetArray = Dataset2Array(value,fieldName);
			for(var j=0;j<datasetArray.length;j++){
				fieldName = datasetArray[j].key;
				entityArray.push({key:fieldName,value:datasetArray[j].value});
			}
		}else{
			fieldName = fieldName;
			entityArray.push({key:fieldName,value:value});
		}
	}
	return entityArray;
}


function isEmptyObject(obj){
	if (typeof(obj)!='object'){
		return false;
	}
	for (var key in obj ){
		return false;
	}
	return true;
}

/**
 * JSON对象转换为 Entity对象
 */
function Json2Entity(json, entity){
	if (!json){ return json;}

	entity = entity ||  new Entity();
	for (var key in json){
		if ( json.hasOwnProperty(key) ){
			var value=json[key];
			if ( isArray(value) ){
				value = Json2Dataset( value ,key) ;
			}else if (isEmptyObject(value)){
				value=null;
			}else if (value!==null && value!==undefined && typeof(value)=='object' ){
				value = Json2Entity( value ) ;
				value.parent=entity;
				value.name=key;
			}
			entity.setProperty(key,value);
		}
	}
	return entity;

}



/**
 * Entity对象转换为 JSON对象
 */
function Json2Dataset(jsonArr,key,dataset){
	dataset=dataset|| new Dataset();
	jsonArr= jsonArr || [];

	if (  !isArray(jsonArr) ){
		jsonArr=[jsonArr];
	}
	for (var i=0,j=jsonArr.length;i<j;i++ )	{
		var entity= Json2Entity(jsonArr[i]);
		entity.name=key || entity.name;
		dataset.addEntity(entity,false);
	}
	return dataset;
}

/**
 * Dataset对象转换为 JSON对象数组
 */
function Entity2Json(entity,json){
	json= json || {};
	var keys = entity.getKeys();
	for(var i=0,j=keys.length;i<j;i++){
		var value=entity.getProperty(keys[i]);
		if (value instanceof Entity ){
			value= Entity2Json(value);
		}else if (value instanceof Dataset ){
			value= Dataset2Json(value);
		}
		json[keys[i]]=value;
	}
	return json;
}

/**
 * Dataset对象转换为 JSON对象数组
 */
function Dataset2Json(dataset, jsonArr,hasDel){
		jsonArr= jsonArr || [];
		for(var i=0,j=dataset.values.length;i<j;i++){
			var entity = dataset.values[i];
			if (hasDel!==true && (entity.status==Entity.STATUS_DELT || entity.status==Entity.STATUS_HIDDEN) ){
				continue;
			}
			jsonArr.push(  Entity2Json(entity) );
		}
		return jsonArr;
}


