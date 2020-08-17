/* ========== ProgressBar 相关函数 ============== */
/*
function ProgressBar(){
}
ProgressBar.div = $create("div");
ProgressBar.div.style.position="absolute";
ProgressBar.div.style.zIndex = 10001;
ProgressBar.div.className = "PROGRESS_BAR";
ProgressBar.locked = false;
eventManager.add(window,"resize",ProgressBar.setPosition);

// 显示进度条.
ProgressBar.show = function(strMsg,showMask,picUrl){
	if(showMask){
		ProgressBar.lock();
	}
	if(ProgressBar.div.parentNode!=document.body){
		bodyAddNode(ProgressBar.div);
	}
	picUrl = picUrl?picUrl:PICTURE_PROCESS_WAIT;
	var str = '<table cellSpacing="8" style="z-index:1002"><tr><td>';
	str +='<img src="' + picUrl + '"></td>';
	str += '<td style="mz-: nowrap">' + strMsg;
	str += '</td></tr></table>';
	ProgressBar.div.innerHTML = str;
	ProgressBar.div.style.display = "block";
	ProgressBar.setPosition();
}

// 隐藏进度条.
ProgressBar.hide = function(){
	ProgressBar.div.style.display = "none";
	if(ProgressBar.locked){
		ProgressBar.unlock();
	}
}

// 锁定页面.
ProgressBar.lock = function(){
	var topWin = top;
	lockWindow(topWin.document);
	hideAllSelect(topWin.document);
	ProgressBar.locked = true;
}

// 解锁.
ProgressBar.unlock = function(){
	var topWin = top;
	showAllSelect(topWin.document);
	unlockWindow(topWin.document);
}

// 设置进度条的位置.
ProgressBar.setPosition = function(){
	ProgressBar.div.style.top = (getViewportHeight()/2 - ProgressBar.div.offsetHeight/2) + "px";
	ProgressBar.div.style.left = (getViewportWidth()/2 - ProgressBar.div.offsetWidth/2) + "px";
}

var $show = ProgressBar.show;
var $hide = ProgressBar.hide;
var $lock = ProgressBar.lock;
var $unlock = ProgressBar.unlock;

function lockWindow(doc){
	if(doc&&doc.body){
		var container = $id("__eos_progress_mask",doc);
		if(!container){
			container = $create("div",doc);
			container.style.position="absolute";
			container.id = "__eos_progress_mask";
			maskDiv = $create("div",doc);
			container.appendChild(maskDiv);
			container.style.cursor="wait";
			container.style.zIndex=10000;
			var img = $create("img",doc);
			img.id = "_eos_progress_img";
			img.src = PICTURE_BLANK;
			maskDiv.appendChild(img);
			doc.body.appendChild(container);
		}
		var maskImg = $id("_eos_progress_img",doc);
		container.style.display = "block";
		container.style.top = doc.body.clientTop||0;
		container.style.left = doc.body.clientLeft||0;
		container.style.width = doc.body.clientWidth + "px";
		container.style.height = doc.body.clientHeight  + "px";
		//container.style.backgroundImage = "url(" + PICTURE_MASK + ")";
		maskImg.style.width = doc.body.clientWidth  + "px";
		maskImg.style.height = doc.body.clientHeight  + "px";
		var doc_frames = getFrameDocuments(doc);
		for(var i=0;i<doc_frames.length;i++){
			lockWindow(doc_frames[i]);
		}
	}
}

function unlockWindow(doc){
	if(doc){
		var div = $id("__eos_progress_mask",doc);
		if(div){
			div.style.display = "none";
		}
		var doc_frames = getFrameDocuments(doc);
		for(var i=0;i<doc_frames.length;i++){
			unlockWindow(doc_frames[i]);
		}
	}
}

*/

function hideAllSelect(doc){
	if(isIE&&doc){
		var selects = doc.getElementsByTagName("select");
		for(var i=0;i<selects.length;i++){
			selects[i].back_display = selects[i].style.display;
			selects[i].style.display = "none";
		}
		var doc_frames = getFrameDocuments(doc);
		for(var i=0;i<doc_frames.length;i++){
			hideAllSelect(doc_frames[i]);
		}
	}
}

function showAllSelect(doc){
	if(isIE&&doc){
		var selects = doc.getElementsByTagName("select");
		for(var i=0;i<selects.length;i++){
			selects[i].style.display = selects[i].back_display;
		}
		var doc_frames = getFrameDocuments(doc);
		for(var i=0;i<doc_frames.length;i++){
			showAllSelect(doc_frames[i]);
		}
	}
}

function getFrameDocuments(doc){
	var arr = [];
	if(isIE){
		var doc_frames = doc.frames;
		for(var i=0;i<doc_frames.length;i++){
			arr.push(doc_frames[i].document);
		}
	}else{
		var doc_frames = doc.getElementsByTagName("iframe");
		for(var i=0;i<doc_frames.length;i++){
			arr.push(doc_frames[i].contentDocument);
		}
		doc_frames = doc.getElementsByTagName("frame");
		for(var i=0;i<doc_frames.length;i++){
			arr.push(doc_frames[i].contentDocument);
		}
	}
	return arr;
}