var EOSProgressCache={};


var ProgressBar =function(id){
	id=id || 'eos_pageProgressBar';
	this.winWidth=160;
	this.winHeight=60; 
	this.id=id;
	var titleId='__progressbar_'+id+'_title';

	EOSProgressCache[id]=this;

	var container = $id(id);
	if(!container){
		container = $create("div");
		container.id = id;
		container.className='eos-popwin';
		container.style.width='100px';

		var str= [ 
				'<div  class="eos-popwin-body">',
			'<div style="margin:5px;margin-top:15px" ><div class="eos-progress-icon"></div>',
			'<span id="__progressbar_'+id+'_title" ></span></div>',
				'</div>'
		].join('\n');
		container.innerHTML = str;
		document.body.appendChild(container);
	}


	this.isHidden=true;
	this.container=container;
	this.titleBar=$id('__progressbar_'+id+'_title');
	
	this.show=function(title, winLeft,winTop){

		title = title || 'Please Waiting ...' ;
		this.titleBar.innerHTML=title;
		var waitingEl;

		this.container.style.width = this.winWidth+"px";
		this.container.style.height = this.winHeight +"px";
	
		this.container.style.display = "";
		//fx_fadeIn(this.container);
			//

		if (winLeft && winTop) {
			this.container.style.left =  winLeft + "px";
			this.container.style.top = winTop + "px";
		}else if ( typeof(winLeft) == 'object' && winLeft.offsetLeft ) {
			waitingEl=winLeft;
			winLeft = waitingEl.offsetLeft + (waitingEl.offsetWidth-this.winWidth)/2;
			winTop =  waitingEl.offsetTop + (waitingEl.offsetHeight - this.winHeight)/2;
			this.container.style.left =  winLeft + "px";
			this.container.style.top = winTop + "px";
		}else{
			moveDivToCenter(this.container);

		}

/*
		if (!winLeft && !winTop) {
			waitingEl=document.getElementsByTagName("BODY")[0];
			var fullWidth = getViewportWidth();
			if (fullWidth < waitingEl.scrollWidth) {
				fullWidth = waitingEl.scrollWidth;
			}
			winLeft = (fullWidth-this.winWidth)/2;

			var fullHeight = getViewportHeight();
			if (fullHeight < waitingEl.scrollHeight) {
				fullHeight = waitingEl.scrollHeight;
			}
			winTop = (fullHeight-this.winHeight)/2;

		}
*/

		//this.container.style.marginLeft='0px';
		//this.container.style.marginTop='0px';

		try{
			this.container.focus();
		}catch(e){}

		this.isHidden=false;
	};

	this.hide=function(){
		if (this.container){
			this.container.style.display='none';
			//fx_fadeOut(this.container);
		}
		this.isHidden=true;
	}
}

 /* winLeft,winTop 可用 waitingEl 代替 */
function showProgressBar( id ,title, winLeft,winTop){
	var o=EOSProgressCache[id] || null;
	if (!o){
		o=new ProgressBar(id);	
	}
	o.show(title, winLeft,winTop);
	return o;
}


function hideProgressBar( id){
	id = id || 'eos_pageProgressBar';
	var o= EOSProgressCache[id] || null;
	if (o){

		o.hide();
	}
	return o;
}

function hideAllProgressBar(){
	for (var k in EOSProgressCache ){
		EOSProgressCache[k].hide();
	}

}
