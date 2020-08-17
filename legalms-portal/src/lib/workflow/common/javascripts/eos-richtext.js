/**
 * RichTextEditor的构造函数.
 * @param {Object} id
 */
function RichTextEditor(id){
	this.id = id;
	this.name = "";
	this.value = "";
	this.width = "100%";
	this.height = 200;
	this.basePath = contextPath + '/eos/ckeditor/' ;
	this.hiddenInput = null;
	this.toolbarSet = "Full";
	this.container = null;
	this.editableContainer = null;
	this.richEditor = null;
	this.times=0;
	PageControl.add(id,this);
}
/**
 * 初始化富文本编辑器的方法，创建一个Fckeditor
 */
RichTextEditor.prototype.init = function(){
	var ID=this.id+"_textarea";
	this.container = $id(this.id + "_container");
	if(/[1-9]{0,1}[0-9](\\.[0-9])?%/.test(this.width)){
		this.width='100%';
	}else{
		if(isNaN(parseInt(this.width))){
			this.width = "100%";
		}
	}
	if(isNaN(parseInt(this.height))){
		this.height = 200;
	}
	var editor2 = CKEDITOR.instances[ID];
	if(editor2) {
		editor2.destroy(true);
		CKEDITOR.remove(editor2);
	}
	CKEDITOR.replace(ID,
    {
          width:this.width, 
          height:this.height,
          toolbar:this.toolbarSet
     });
	 eval("this.richEditor =  CKEDITOR.instances."+ID);
	 this.richEditor.setData("");
} 
/**
 * 调用FCKeditorAPI的GetInstance方法得到editor实例,
 * 获取富文本编辑器的值.
 * 该方法只能在编辑器完全载入后调用，否则找不到FCKeditorAPI
 */
RichTextEditor.prototype.getValue = function(){
	var oEditor = this.getFCKEditor();
	var value = oEditor.getData();
	/**
	 * 亚祥试图去掉前后的<p></p>标签，但下面的代码逻辑是错误的
	 * 
	if(value && this.value){
		if(value=="<p>" + this.value + "</p>"){
			return this.value;
		}
	}
	if(value==""||value=="<p></p>"){
		return this.value;
	}*/
	return value;
	
}
/**
 * 调用FCKeditorAPI的GetInstance方法得到editor实例,
 */
RichTextEditor.prototype.getFCKEditor = function(){
	var ID=this.id+"_textarea";
	eval("var oEditor  =  CKEDITOR.instances."+ID);
	return oEditor;
}
/**
 * 调用FCKeditorAPI的GetInstance方法得到editor实例,
 * 设置富文本编辑器的值.
 * 该方法只能在编辑器完全载入后调用，否则找不到FCKeditorAPI
 * @param {Object} value
 */
RichTextEditor.prototype.setValue = function(value){
	var oEditor = this.getFCKEditor();
	if(this.editableContainer&&this.times==0){
		oEditor._.editable.$ = this.editableContainer;
		this.times=1;
	}
	if(value!=null && value!=undefined){
		oEditor.setData(value);
	}else{
		oEditor.setData("");
	}
	this.value = value;
}
/**
 * 符合控件开发规范的方法.
 */
RichTextEditor.prototype.setFocus = function(){
}
/**
 * 符合控件开发规范的方法.
 */
RichTextEditor.prototype.lostFocus = function(){
}
RichTextEditor.prototype.showEditor = function(){
	this.container.style.display = "";
}
RichTextEditor.prototype.hideEditor = function(){
	this.container.style.display = "none";
}
RichTextEditor.prototype.hide = function(){
	this.hideEditor();
}
RichTextEditor.prototype.validate = function(){
	return true;
}
RichTextEditor.prototype.isFocus = function(){
	return false;
}
RichTextEditor.prototype.getDisplayValue = function(value){
	return value;
}
RichTextEditor.prototype.setPosition = function(left,topx,width,height){
	this.container.style.position = "absolute";
	this.container.style.top = "0px";
	this.container.style.left = "0px";
	var maxZindex = getMaxZindex(document);
	if(this.container.style.zIndex!=maxZindex){
		this.container.style.zIndex = maxZindex;
	}
	setElementXY(this.container,[left,topx]);
}