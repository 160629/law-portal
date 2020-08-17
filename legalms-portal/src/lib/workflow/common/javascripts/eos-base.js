var EOS={
	dataType:'json',
	newModel:true,		//标记是是否为新模式，注意：旧模式所有文件都已经全部加载
	setOldModel:function(){
		EOS.dataType='xml';
		EOS.newModel=false;
		EOS.setAllLoaded();
	},
	setNewModel:function(){
		EOS.dataType='json';
		EOS.newModel=true;
	},
	vision:'6.0.0'
};

(function(){
	EOS.apply=function(o,c){
		if(!o||!c||typeof(c)!='object'){
			return;
		}
		
		for(var p in c){
			o[p]=c[p];
		}

		for(var i=2;i<arguments.length;i++){
			arguments.callee(o,arguments[i]);
		}
	}

	EOS.apply(EOS,{
		isArray:function(o){
			return o.constructor===Array;
		},
		override:function(c,e){
			if(!c||!e){
				return;
			}
			EOS.apply(c.prototype,e);
			
			return c;
		},
		applyIf:function(o,c){
			if(!o||!c||typeof(c)!='object'){
				return;
			}	
			for(var p in c){
				if(o[p]==undefined){
					o[p]=c[p];
				}			
			}		
			for(var i=2;i<arguments.length;i++){
				arguments.callee(o,arguments[i]);
			}		
		},
		format:function(format){
			if(EOS.isArray(format)){
				format=format.join('');
			}
			var args = Array.prototype.slice.call(arguments, 1);
			return format.replace(/\{(\d+)\}/g, function(m, i){
				return args[i];
			});
		},
		parse:function(p,d){
			if(EOS.isArray(p)){
				p=p.join(',');
			}
			var reg
			for(var i in d){
				reg=new RegExp('{'+i+'}','g');			
				p=p.replace(reg,d[i]);
			}
			return p;
		},
		/*
		*@desc 命名空间定义函数
		*/
		ns:function(){
			var a=arguments, o=null, i, j, d, rt;
			for (i=0; i<a.length; ++i) {
				d=a[i].split(".");
				rt = d[0];
				eval('if (typeof ' + rt + ' == "undefined"){' + rt + ' = {};} o = ' + rt + ';');
				for (j=1; j<d.length; ++j) {
					o[d[j]]=o[d[j]] || {};
					o=o[d[j]];
				}
			}
		},
		createId:function(prix,length){
			prix=prix||'';
			//下面的这些逻辑可能有错by wujun
			prix+=(prix.substr(0,2)=='eos_')?'':'eos_';
			prix+=(prix.substr(prix.length-1,1)=='_')?'':'_';
			
			length=length||8;
			var _x=Math.random()*Math.pow(10, length)+'';
			return prix+_x.substr(0,_x.indexOf('.'));
		},
		getNavInfo:function(){
			var ua = navigator.userAgent.toLowerCase(),
			check = function(r){
				return r.test(ua);
			},
			navInfo={};
			
			navInfo.isStrict = document.compatMode == "CSS1Compat";
			//此方法在最新的opera浏览器中已经失效了！！！！！by wujun
			navInfo.isOpera = check(/opera/);
			////此方法也失效了！！！！！新的opera浏览器中也包含chrome字符串。。。。by wujun
			navInfo.isChrome = check(/chrome/);
			navInfo.isWebKit = check(/webkit/);
			navInfo.isSafari = !navInfo.isChrome && check(/safari/);
			navInfo.isSafari2 = navInfo.isSafari && check(/applewebkit\/4/); // unique to Safari 2
			navInfo.isSafari3 = navInfo.isSafari && check(/version\/3/);
			navInfo.isSafari4 = navInfo.isSafari && check(/version\/4/);
			//ie11中的userAgent信息已经不包含msie子串了，后续如果需要支持ie11，请改变下面的isIE属性的判定方法by wujun
			//由于目前不支持ie11，暂且把ie11当做ie10进行处理
			navInfo.isIE = (!navInfo.isOpera && check(/msie/))||check(/rv:11.0/);
			navInfo.isIE7 = navInfo.isIE && check(/msie 7/);
			navInfo.isIE8 = navInfo.isIE && check(/msie 8/);
			navInfo.isIE9 = navInfo.isIE && check(/msie 9/);
			navInfo.isIE10 = (navInfo.isIE && check(/msie 10/))||check(/rv:11.0/);
			navInfo.isIE11 = navInfo.isIE && check(/rv:11.0/);
			//下面的判断也有问题
			navInfo.isIE6 = navInfo.isIE && !navInfo.isIE7 && !navInfo.isIE8;
			navInfo.isGecko = !navInfo.isWebKit && check(/gecko/);
			navInfo.isGecko2 = navInfo.isGecko && check(/rv:1\.8/);
			navInfo.isGecko3 = navInfo.isGecko && check(/rv:1\.9/);
			navInfo.isBorderBox = navInfo.isIE && !navInfo.isStrict;
			navInfo.isWindows = check(/windows|win32/);
			navInfo.isMac = check(/macintosh|mac os x/);
			navInfo.isAir = check(/adobeair/);
			navInfo.isLinux = check(/linux/);
			navInfo.isSecure = /^https/i.test(window.location.protocol);
			return navInfo;
		},
		/**
		*@desc 获取url地址中的参数
		*@param key 要获取的参数的名称
		*@return val 要获取的参数的值，没有返回null
		*/
		getQuery:function(key) {
			var str = decodeURI(window.location.search);
			var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
			var r = str.substr(1).match(reg);
			if (r != null) {
				return unescape(r[2]);
			} else {
				return null;
			}
		},
		join:function(split){
			var s=[];
			for(var i=1,len=arguments.length;i<len;i++){
				if(arguments.length){
					s.push(arguments[i]);
				}
			}
			return s.join(split);
		}
	});
	
	EOS.na=EOS.getNavInfo();
	
	
})();
(function(){
	EOS.ns('EOS.json');
	/**
	*@desc 将object对象，转换成字符串，排除function
	*@param obj 许愿转换成字符串的对象
	*/
	var toJsonStr=function(obj){
		if(obj===undefined){
			return 'undefined';
		}
		if(obj===null){
			return 'null';
		}
		var _str=[];
		switch(typeof(obj)){
			case 'object':
				if(obj instanceof Array){
					_str.push('[');
					for(var i=0,len=obj.length;i<len;i++){
						_str.push(EOS.json.toJSONString(obj[i]));
						_str.push(',');
					}
					if(_str.length>1){
						_str.pop();
					}
					_str.push(']');
				}else{
					_str.push('{');
					for(var o in obj){
						if(o!=undefined){					
							_str.push('"'+o+'":');
							_str.push(EOS.json.toJSONString(obj[o]));
							_str.push(',');
						}
					}
					if(_str.length>1){
						_str.pop();
					}
					_str.push('}');
				}
				break;
			case 'string':
				_str.push('"');
				_str.push(obj);
				_str.push('"');
				break;
			case 'number':
				_str.push(obj);
				break;
			case 'boolean':
				_str.push('"');
				_str.push(obj);
				_str.push('"');
				break;
			case 'funciton':
				break;
			default:
				_str.push('"');
				_str.push(obj);
				_str.push('"');
				break;
		}
		return _str.join('');
	};
	
	EOS.apply(EOS.json,{
		parse:function(str){
			var r=undefined;
			eval('r='+str);
			return r;
		},
		objectArrayToJson:function(a,kf,vf){
			if(!a){
				return {};
			}
			kf=kf||'key';
			vf=vf||'value';
			var o={};
			for(var i=0,len=a.length;i<len;i++){
				var ai=a[i];
				o[ai[kf]]=ai[vf];
			}
			return o;
		},
		toXMLString:function(o,tag){
			var str=[];
			var temp='<{key}{attr}>{val}</{key}>';
			for(var key in o){
				var item=o[key];
				var fp={
				};
				if(key!=='__type'){
					switch(typeof item){
						case 'object':
							fp={
								attr:item.__type?(' __type="'+item.__type+'"'):'',
								key:key,
								val:EOS.isArray(item)?item.join(','):EOS.json.toXMLString(item)
							};
							break;
						case 'function':
							break;
						default:
							fp={
								attr:'',
								key:key,
								val:item
							}
							break;
					}
					str.push(EOS.parse(temp,fp));
				}
			}
			if(tag){
				str.unshift(EOS.parse('<{tag}>',{
					tag:tag
				}));
				str.push(EOS.parse('</{tag}>',{
					tag:tag
				}));
			}
			return str.join('');
		},
		toObjectArray:function(o){
			if(!o){
				return [];
			}
			var a=[];
			for(var k in o){
				var v={};
				v[k]=o[k];
				a.push(v);
			}
			return a;
		},
		toSingleArray:function(){
			var a=[];
			for(var k in o){
				a.push(o[k]);
			}
			return a;
		},
		toAttrString:function(o,prix){
			if(!o){
				return '';
			}
			var a=[prix];
			for(var i in o){
				a.push([
					i,
					'=',
					EOS.json.toString(o[i])
				].join(''));
			};
			return a.join(' ');
		},
		toJSONString:function(o){
			return toJsonStr(o);
		},
		toString:function(o){
			return toJsonStr(o);
		}
	});
})();
(function(){
	var __loaded={};
	var addLoaded=function(src){
		__loaded[src]=true;
	}
	var isLoaded=function(src){
		return !src||__loaded[src];
	}
	var loadJS=function(src,cb,doc){
		cb=cb||function(){};
		if(isLoaded(src)){
			cb();
			return;
		}
		doc=doc||document;	
		var s=doc.createElement('script');
		s.type='text/javascript';
		s.src=src;
		//s.src=src+'?'+(new Date());
		s.onreadystatechange=s.onload=function(){
			if(!this.readyState||(this.readyState=='complete'||this.readyState=='loaded')){
				// __loaded[src]=true;
				addLoaded(src);
				cb();
				if(window.console){
					console.log(src+' is loaded!');
				}
			}
		};
		doc.getElementsByTagName('head')[0].appendChild(s);
		return s;
	}
	var loadCSS=function(href,doc){
		if(isLoaded(href)){
			return;
		}
		doc=doc||document;
		var l=doc.createElement('link');
		l.type='text/css';
		// l.href=href;
		l.href=href+'?'+(new Date());
		l.rel='stylesheet';
		doc.getElementsByTagName('head')[0].appendChild(l);
		addLoaded(href);
		// __loaded[href]=true;
		return l;
	}
	
	var Query=function(){
		this.query=[];
	};
	Query.prototype={
		name:'',
		isLoading:false,
		__isQuery:true,
		/**
		*@desc 往队列中添加元素
		*/		
		add:function(items,cb){
			if(EOS.isArray(items)){
				this.query=this.query.concat(items);
			}else{
				this.query.push(items);
			}
			if(cb){
				this.query.push(cb);
			}
		},
		/**
		*@desc 获取队列的下一个元素
		*/
		next:function(){
			return this.query.shift();
		},
		/**
		*@desc 第一次启动队列
		*/
		doStart:function(){
			var _this=this;
			this.isLoading=true;
			setTimeout(function(){
				_this.start();
			},1);
		},
		/**
		*@desc 停止队列
		*/
		doStop:function(){
			this.isLoading=false;
			var _this=this;
			setTimeout(function(){
				_this.stop();
				return;
			},1);
		},
		/**
		*@desc 逐个执行队列
		*/
		start:function(){
			var c=this.next();
			if(!c){//no item
				this.doStop();
			}else{
				var _this=this;
				this.run(c);
			}
		},
		/**
		*@desc 队列执行结束的回调
		*/
		stop:function(){
			if(this.fatherQuery){//如果有父队列，则执行父队列
				this.fatherQuery.start();
			}
		},
		/**
		*@desc 执行队列
		*/
		run:function(item,query){
			if(item.__isQuery){
				item.fatherQuery=this;
				item.doStart();
				return;
			}
			switch(typeof item){
				case 'function':
					item(this);
					this.start();
					break;
				case 'string':
					var _this=this;
					EOS.loader.loadJS(item,function(){
						_this.start();
					});
					break;
			}
		}
	}
	
	var getPath=function(prev){
		var js=document.scripts;
		js=js[js.length-1].src;
		js=js.substring(0,js.lastIndexOf("/"));
		prev=prev||0;
		while(prev){
			js=js.substring(0,js.lastIndexOf("/"));
			prev--;
		}
		return js;
	};
	var getRequires=function(mods,lib,each){
		if(!mods){
			return {
				js:[],
				css:[],
				name:[]
			};
		}
		mods=mods.split(',');
		var js=[],css=[],name=[];
		for(var i=0,len=mods.length;i<len;i++){
			var mod=lib[mods[i]];
			if(each){
				each(mod,i,mods,lib);
			}
			if(mod&&!mod.loaded){//已经加载完成
				if(mod.requires&&!mod.inquery){//防止相互引用的时候出现死循环
					mod.inquery=true;
					var res=getRequires(mod.requires,lib);
					js=js.concat(res.js);
					css=css.concat(res.css);
					name=name.concat(res.name);
				}
				js=js.concat(mod.js);
				js.push((function(m){
					return function(){
						m.loaded=true;
					}
				})(mod));
				css=css.concat(mod.css);
				name.push(mod.name);
			}
		}
		return {
			js:js,
			css:css,
			name:name
		};
	}

	var globalQuery=new Query();
	globalQuery.name='__global_query';
	EOS.loader={};
	EOS.apply(EOS.loader,{
		isReady:false,
		prix:EOS.createId(),
		isAllLoaded:false,
		lib:{
			'def':{
				path:getPath(0)
			}
		},
		loadJS:function(src,cb,doc){
			if(!src){
				return;
			}
			var lc=0;
			if(typeof(src)=='string'){
				src=src.split(',');
			}
			for(var i=0,len=src.length;i<len;i++){
				loadJS(src[i],function(_src){
					lc++;
					if(lc==len){
						cb();
					}
				});
			}
		},
		loadCSS:function(href,doc){
			if(!href){
				return;
			}
			if(typeof(href)=='string'){
				href=href.split(',');
			}
			for(var i=0,len=href.length;i<len;i++){
				loadCSS(href[i],doc);
			}
		},
		use:function(mods,cb,sc,libName,power){
			if(!mods){
				return;
			}
			cb=cb||function(){};
			if(EOS.loader.isAllLoaded&&!power){
				cb.call(sc||this);
				return;
			}
			var res=this.getRequire(mods,libName);
			var thread=new Query();
			thread.name=mods;
			thread.add(res.js,function(){
				cb.call(sc||this);
			});
			globalQuery.add(thread);
			this.doQueryStart();
			
			EOS.loader.loadCSS(res.css);
		},
		/**
		*@desc 由于所有的方法都在window的onready之后加载，此处添加队列，模拟onload事件
		*/
		onReady:function(cb){
			var thread=new Query();
			thread.name='onready';
			thread.add(cb);
			globalQuery.add(thread);
			this.doQueryStart();
		},
		useJS:function(mods,cb,sc,libName){
			if(!mods){
				return;
			}
			if(EOS.loader.isAllLoaded){
				cb.call(sc||this);
				return;
			}
			cb=cb||function(){};
			var res=this.getRequire(mods,libName);
			var thread=new Query();
			thread.name=mods;
			thread.add(res.js,function(){
				cb.call(sc||this);
			});
			globalQuery.add(thread);
			this.doQueryStart();
		},
		useCSS:function(mods,libName){
			if(!mods){
				return;
			}
			var res=this.getRequire(mods,libName);
			EOS.loader.loadCSS(res.css);
		},
		bindReady:function(){
			var _this=this;
			if(window.attachEvent){
				window.attachEvent('onload',function(){
					_this.ready();
				},false);
			}else if(window.addEventListener){
				window.addEventListener('load',function(){
					_this.ready();
				},false);
			}else{
				window.onload=this.ready;
			}
		},
		ready:function(){
			this.isReady=true;
			this.doQueryStart();
		},
		doQueryStart:function(){
			if(this.isReady){
				if(!globalQuery.isLoading){
					globalQuery.doStart();
				}
			}
		},
		getRequire:function(mods,libName){
			if(!mods){
				return;
			}
			var lib=this.getLib(libName);
			return getRequires(mods,lib);
		},
		
		setModeLoaded:function(mods,libName){
			var lib=this.getLib(libName);
			var res=getRequires(mods,lib,function(mod){
				mod.loaded=true;
			});
			var js=res.js;
			if(js){
				for(var i=0,len=js.length;i<len;i++){
					addLoaded(js[i]);
				}
			}
			var css=res.css;
			if(css){
				for(var i=0,len=css.length;i<len;i++){
					addLoaded(css[i]);
				}
			}
		},
		setJSLoaded:function(mods,libName){
			var lib=this.getLib(libName);
			var res=getRequires(mods,lib);
			var js=res.js;
			if(js){
				for(var i=0,len=js.length;i<len;i++){
					addLoaded(js[i]);
				}
			}
		},
		setCSSLoaded:function(mods,libName){
			var lib=this.getLib(libName);
			var res=getRequires(mods,lib);
			var css=res.css;
			if(css){
				for(var i=0,len=css.length;i<len;i++){
					addLoaded(css[i]);
				}
			}
		},
		/**
		*@desc 添加库
		*/
		addLib:function(name,lib){
			if(!this.lib[name]){
				this.mods[name]=lib||{
					path:''
				};
			}
		},
		/**
		*@desc 获取lib库，默认返回def
		*@param libName lib库的名称
		*/
		getLib:function(libName){
			libName=libName||'def';
			this.addLib(libName);
			return this.lib[libName];
		},
		add:function(name,mod){
			if(!name){
				return;
			}
			var lib=this.getLib(mod.lib);
			var js=[],css=[];	
			var p=EOS.join('/',lib.path,mod.path);
			
			if(mod.jsFullPath){
				js=mod.jsFullPath.split(',');
			}else{
				var jp=mod.jsPath;
				if(jp){
					jp=jp.split(',');
					for(var i=0,len=jp.length;i<len;i++){
						js.push(p+jp[i]);
					}
				}else if(mod.jsPath===undefined){//default;
					js.push(p+name.toLowerCase()+'.js');
				}
			}
			
			if(mod.cssFullPath){
				css=mod.cssFullPath.split(',');
			}else{
				var cp=mod.cssPath;
				if(cp){
					cp=cp.split(',');
					for(var i=0,len=cp.length;i<len;i++){
						css.push(p+cp[i]);
					}
				}
			}
			mod.js=js;
			mod.css=css;
			mod.name=name;
			lib[name]=mod;
			return;
		}
	});
	
	// EOS.loader.initModsQuery().bindReady();
	EOS.loader.bindReady();
	EOS.apply(EOS,{
		skin:'default',
		debug:true,
		setModeLoaded:function(mods,lib){
			EOS.loader.setModeLoaded(mods,lib);
		},
		setJSLoaded:function(mods,lib){
			EOS.loader.setJSLoaded(mods,lib);
		},
		setCSSLoaded:function(mods,lib){
			EOS.loader.setCSSLoaded(mods,lib);
		},
		setAllLoaded:function(isLoaded){
			EOS.loader.isAllLoaded=isLoaded===undefined?true:isLoaded;
		},
		use:function(s,cb,sc,ln,power){
			EOS.loader.use(s,cb,sc,ln,power);
		},
		useCSS:function(s,cb,sc,ln){
			EOS.loader.useCSS(s,cb,sc,ln);
		},
		useJS:function(s,cb,sc,ln){
			EOS.loader.useJS(s,cb,sc,ln);
		},
		onReady:function(cb){
			EOS.loader.onReady(cb);
		},
		regist:function(name,mod){
			EOS.loader.add(name,mod||{});
		}
	});
})();
/********************注册代码资源start*****************/
(function(){
	EOS.regist('eos-ajax',{
		jsPath:'eos-ajax.js',
		requires:'common,eos-log'
	});
	EOS.regist('eos-calendar',{//用到了mootools对Element重写的fireEvent方法
		jsPath:'eos-calendar.js',
		requires:'common,eos-time,eos-check,mootools'
	});
	EOS.regist('eos-check',{
		jsPath:'eos-check.js',
		requires:'eos-dom'
	});
	EOS.regist('eos-comboselect',{
		jsPath:'eos-comboselect.js',
		requires:'common,eos-layout,eos-ajax,eos-dataset'
	});
	EOS.regist('eos-datacell',{
		jsPath:'eos-datacell.js',
		requires:'common,eos-editors,eos-ajax,eos-dataset'
	});
	EOS.regist('eos-dataset',{
		jsPath:'eos-dataset.js',
		requires:'eos-dom,eos-ajax'
	});
	EOS.regist('eos-dom',{
		jsPath:'eos-dom.js',
		requires:'common'
	});
	EOS.regist('eos-domdrag',{
		jsPath:'eos-domdrag.js',
		requires:'common'
	});
	EOS.regist('eos-editors',{
		jsPath:'eos-editors.js',
		requires:'common'
	});
	EOS.regist('eos-event',{
		jsPath:'eos-event.js',
		requires:''
	});
	EOS.regist('eos-key',{
		jsPath:'eos-key.js'
	});
	EOS.regist('eos-layout',{
		jsPath:'eos-layout.js',
		requires:'common,eos-panel'
	});
	EOS.regist('eos-log',{
		jsPath:'eos-log.js',
		requires:'common'
	});
	EOS.regist('eos-lookup',{
		jsPath:'eos-lookup.js',
		requires:'common,eos-modeldialog'
	});
	EOS.regist('eos-mask',{
		jsPath:'eos-mask.js',
		requires:'common,eos-dom'
	});
	EOS.regist('eos-modeldialog',{
		jsPath:'eos-modeldialog.js',
		requires:'common,eos-mask,mootools'
	});
	EOS.regist('eos-multibox',{
		jsPath:'eos-multibox.js',
		requires:'common'
	});
	EOS.regist('eos-multiselect',{
		jsPath:'eos-multiselect.js',
		requires:'common'
	});
	EOS.regist('eos-panel',{
		jsPath:'eos-panel.js',
		requires:'common'
	});
	EOS.regist('eos-popmenu',{
		jsPath:'eos-popmenu.js',
		requires:'common,eos-log,eos-dom'
	});
	EOS.regist('eos-progressbar',{
		jsPath:'eos-progressbar.js',
		requires:'common'
	});
	EOS.regist('eos-radioGroup',{
		jsPath:'eos-radioGroup.js',
		requires:'common'
	});
	EOS.regist('eos-richtext',{
		jsPath:'eos-richtext.js',
		requires:'common,fckeditor'
	});
	EOS.regist('eos-rowselect',{
		jsPath:'eos-rowselect.js',
		requires:'common,eos-dom'
	});
	EOS.regist('eos-rtree',{
		jsPath:'eos-rtree.js',
		requires:'common,eos-layout,eos-dataset,eos-ajax'
	});
	EOS.regist('eos-stree',{
		jsPath:'eos-stree.js',
		requires:'common,eos-layout,eos-dataset,eos-dom'
	});
	EOS.regist('eos-switchcheckbox',{
		jsPath:'eos-switchcheckbox.js',
		requires:'common'
	});
	EOS.regist('eos-tabs',{
		jsPath:'eos-tabs.js',
		requires:'common,eos-dom'
	});
	EOS.regist('eos-time',{
		jsPath:'eos-time.js',
		requires:'common,eos-dom,eos-log,eos-check'
	});
	EOS.regist('eos-util',{
		jsPath:'eos-util.js',
		requires:'eos-event,eos-check,mootools'
	});
	EOS.regist('eos-verifycode',{
		jsPath:'eos-verifycode.js'
	});
	EOS.regist('eos-widget',{
		jsPath:'eos-widget.js',
		requires:'common'
	});
	EOS.regist('message',{
		jsPath:'message.js'
	});
	EOS.regist('fckeditor',{
		jsPath:'../fckeditor/fckeditor.js'
	});
	EOS.regist('resource',{
		jsPath:'../skins/skin0/scripts/resource.js'
	});
	EOS.regist('mootools',{
		jsPath:'../lib/mootools.js'
	});
	// EOS.regist('eos-base',{
		// jsPath:'eos-base.js'
	// });
	EOS.regist('common',{
		jsPath:'',
		cssPath:'',
		// cssPath:'../skins/skin0/theme/style-component.css',
		requires:'message,resource,eos-key,eos-event,eos-util'
	});
})()

/********************注册代码资源end*****************/

/***@desc 兼容错误页面*****/
// EOS.setJSLoaded('common');
// EOS.useCSS('common');
if(window['EOSNEWMODEL']===true){
	EOS.setNewModel();
	window.isFF=EOS.na.isFF;
	EOS.use('common',function(){
		var EOStopWin = EOStopWin || _get_top_window() || window;
		EOStopWin.docs=EOStopWin.docs||[];
		EOStopWin["_eos_modal_dialog"] = EOStopWin["_eos_modal_dialog"] || [];
	});
}else{
	EOS.setOldModel();
}




/********************移步加载JS资源改造***eos-core内容**************end*****************/



































/**
 * 这段代码检测浏览器.
 */

(function () {
	window.undefined = window.undefined;
	document.head = document.getElementsByTagName('head')[0];
	
	window.fAppVersion = parseFloat(navigator.appVersion);
	window.sUserAgent = navigator.userAgent.toLowerCase();
	var ua = navigator.userAgent.toLowerCase();
	
	window.isIE = ua.indexOf("msie") > -1||navigator.userAgent.toLowerCase().indexOf("rv:11.0") != -1;
	window.isIE7 = ua.indexOf("msie 7") > -1;
	window.isIE8 = ua.indexOf("msie 8") > -1;
	window.isIE9 = ua.indexOf("msie 9") > -1;
	//由于目前不支持ie11，尝试把ie11当做ie11进行处理，等全面支持ie11的时候，此行代码需改
	window.isIE10 = ua.indexOf("msie 10") > -1||ua.indexOf("rv:11.0") != -1;
	window.isIE11 = ua.indexOf("rv:11.0") != -1;
	window.isFF = ua.indexOf("firefox") > -1;
	window.isOpera = ua.indexOf("opera") > -1;
	
	window.isWebkit = (/webkit|khtml/).test(ua);
	window.isSafari = ua.indexOf("safari") > -1 || window.isWebkit;
	window.isGecko = window.isMoz = !window.isSafari && ua.indexOf("gecko") > -1;
	
	window.isStrict = document.compatMode == "CSS1Compat";
	window.isBorderBox = window.isIE && !window.isStrict;
	window.isSecure = window.location.href.toLowerCase().indexOf("https") === 0;
	
	window.isWindows = (ua.indexOf("windows") != -1 || ua.indexOf("win32") != -1);
	window.isMac = (ua.indexOf("macintosh") != -1 || ua.indexOf("mac os x") != -1);
	window.isLinux = (ua.indexOf("linux") != -1);
	
	/**
	 * 如果Array没有push方法则添加push方法.
	 */
	if (!Array.prototype.push) {
		Array.prototype.push = function (elem) {
			this[this.length] = elem;
		}
	}
	
	if ((window.isGecko || window.isFF) && HTMLElement) {
		HTMLElement.prototype.__defineGetter__("innerText", function () {
			return this.textContent;
		});
	}
	
	
	
	if (!window.isIE) {
		
		Document.prototype.readyState = 0;
		Document.prototype.onreadystatechange = null;
		
		Document.prototype.__changeReadyState__ = function (iReadyState) {
			try {
				this.readyState = iReadyState;
			} catch (e) {}
			
			if (typeof this.onreadystatechange == "function") {
				this.onreadystatechange();
			}
		};
		
		Document.prototype.__initError__ = function () {
			this.parseError.errorCode = 0;
			this.parseError.filepos = -1;
			this.parseError.line = -1;
			this.parseError.linepos = -1;
			this.parseError.reason = null;
			this.parseError.srcText = null;
			this.parseError.url = null;
		};
		
		Document.prototype.__checkForErrors__ = function () {
			
			if (this.documentElement.tagName == "parsererror") {
				
				var reError = />([\s\S]*?)Location:([\s\S]*?)Line Number (\d+), Column (\d+):<sourcetext>([\s\S]*?)(?:\-*\^)/;
				
				reError.test(this.xml);
				
				this.parseError.errorCode = -999999;
				this.parseError.reason = RegExp.$1;
				this.parseError.url = RegExp.$2;
				this.parseError.line = parseInt(RegExp.$3);
				this.parseError.linepos = parseInt(RegExp.$4);
				this.parseError.srcText = RegExp.$5;
			}
		};
		
		Document.prototype.loadXML = function (sXml) {
			
			this.__initError__();
			
			this.__changeReadyState__(1);
			
			var oParser = new DOMParser();
			var oXmlDom = oParser.parseFromString(sXml, "text/xml");
			while (this.firstChild) {
				this.removeChild(this.firstChild);
			}
			
			for (var i = 0; i < oXmlDom.childNodes.length; i++) {
				var oNewNode = this.importNode(oXmlDom.childNodes[i], true);
				this.appendChild(oNewNode);
			}
			
			this.__checkForErrors__();
			
			this.__changeReadyState__(4);
			
		};
		
		Document.prototype.__load__ = Document.prototype.load;
		
		Document.prototype.load = function (sURL) {
			this.__initError__();
			this.__changeReadyState__(1);
			this.__load__(sURL);
		};
		
		Node.prototype.__defineGetter__("xml", function () {
			//var oSerializer = new XMLSerializer();
			return (new XMLSerializer()).serializeToString(this, "text/xml");
		});
		
	}
	
	/**
	 * 封装解析xpath的selectNodes 及selectSingleNode方法.
	 */
	if (document.implementation.hasFeature("XPath", "3.0")) {
		XMLDocument.prototype.selectNodes = function (cXPathString, xNode) {
			if (!xNode) {
				xNode = this;
			}
			
			var oNSResolver = this.createNSResolver(this.documentElement)
				var aItems = this.evaluate(cXPathString, xNode, oNSResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)
				var aResult = [];
			for (var i = 0; i < aItems.snapshotLength; i++) {
				aResult[i] = aItems.snapshotItem(i);
			}
			
			return aResult;
		}
		XMLDocument.prototype.selectSingleNode = function (cXPathString, xNode) {
			if (!xNode) {
				xNode = this;
			}
			
			var xItems = this.selectNodes(cXPathString, xNode);
			if (xItems.length > 0) {
				return xItems[0];
			} else {
				return null;
			}
		}
		Element.prototype.selectNodes = function (cXPathString) {
			if (this.ownerDocument.selectNodes) {
				return this.ownerDocument.selectNodes(cXPathString, this);
			} else {
				$warn(EOS_BASE_NOT_SUPPORT_SELECTNODES);
			}
		}
		
		Element.prototype.selectSingleNode = function (cXPathString) {
			if (this.ownerDocument.selectSingleNode) {
				return this.ownerDocument.selectSingleNode(cXPathString, this);
			} else {
				$warn(EOS_BASE_NOT_SUPPORT_SELECTSINGLENODE);
			}
		}
		
	}
	
})();

function isCrossDomain(u, win) {
	win = win || window;
	if (u && typeof(u) != 'string') {
		try {
			u = u.location ? u.location.href : u;
		} catch (e) {
			return true;
		}
	}
	var match = /(?:(\w*:)\/\/)?([\w\.]*(?::\d*)?)/.exec(('' + u));
	if (!match[1])
		return false; // No protocol, not cross-domain
	// return (match[1] != win.location.protocol) || (match[2] != win.location.host);
	
	return (match[1] != win.location.protocol) || (u.replace(match[1]+"//","").split("/")[0]!=window.location.host);
};

function _get_top_window(includeFrameset, win) {
	
	win = win || window;
	
	var allWindows = [win];
	
	var topWin_NotCrossDomain = win;
	
	var pwin = win;
	while (pwin != pwin.parent) {
		pwin = pwin.parent;
		allWindows.push(pwin);
	};
	
	function isVaildWin(cwin, win) {
		try {
			return (cwin
				//&& cwin.isCrossDomain
				&&cwin['EOS']
				 && !isCrossDomain(cwin, win)
				 && cwin.document
				 && (includeFrameset || cwin.document.getElementsByTagName("frameset").length < 1));
		} catch (e) {
			return false
		}
	}
	
	for (var i = allWindows.length - 1; i >= 0; i--) {
		var cwin = allWindows[i];
		if (isVaildWin(cwin, win)) {
			return cwin;
		}
	}
	
	return topWin_NotCrossDomain;
	
}

var EOStopWin = _get_top_window()||window;

/**
 * 封装不同浏览器创建xmlDocument的不同,并为其加上load(sUrl),loadXml(xmlStr)等方法.
 * @return 返回xmlDocument对象.
 * @type xmlDocument
 */
function createXmlDom(xmlStr) {
	if (window.ActiveXObject||window.isIE11) {
		var arrSignatures = ["MSXML2.DOMDocument.5.0", "MSXML2.DOMDocument.4.0",
			"MSXML2.DOMDocument.3.0", "MSXML2.DOMDocument",
			"Microsoft.XmlDom"];
		for (var i = 0; i < arrSignatures.length; i++) {
			try {
				var oXmlDom = new ActiveXObject(arrSignatures[i]);
				if (xmlStr) {
					oXmlDom.loadXML(xmlStr);
				}
				return oXmlDom;
			} catch (oError) {
				//ignore
			}
		}
		throw new Error("MSXML is not installed on your system.");
	} else if (document.implementation && document.implementation.createDocument) {
		var oXmlDom = document.implementation.createDocument("", "", null);
		oXmlDom.parseError = {
			valueOf : function () {
				return this.errorCode;
			},
			toString : function () {
				return this.errorCode.toString()
			}
		};
		oXmlDom.__initError__();
		oXmlDom.addEventListener("load", function () {
			this.__checkForErrors__();
			this.__changeReadyState__(4);
		}, false);
		
		if (xmlStr) {
			oXmlDom.loadXML(xmlStr);
		}
		return oXmlDom;
		
	} else {
		throw new Error("Your browser doesn't support an XML DOM object.");
	}
}

/**
 * @private
 */
function $e(id, doc) {
	doc = doc || document;
	if (typeof(id) == 'object') {
		return id;
	}
	var el = $name(id) || $id(id);
	return el;
}

/**
 * 根据ID获取对象的方法.
 * @param {String} id
 * @param {Document} doc
 * @type Element
 * @return 返回ID相对应的元素.
 */
function $id(id, doc) {
 	doc = doc || document;
 	if (typeof(id) == 'object') {
 		return id;
 	}
 	var elem = doc.getElementById(id);
 	var returnObj;
 	if (isIE && elem) {
 		var elemId = elem.id;
 		if (typeof(elemId) != "string") {
 			var idNode = elem.getAttributeNode("id");
 			if (idNode) {
 				elemId = idNode.nodeValue;
 			}
 		}
 		if (elemId === id) {
 			returnObj = elem;
 		} else {
 			var elems = doc.all[id];
 			if (elems && elems.length) {
 				for (var i = 0; i < elems.length; i++) {
 					if (elems[i].id === id) {
 						returnObj = elems[i];
 						break;
 					}
 				}
 			}
 		}
 	} else {
 		returnObj = elem;
 	}
 	return returnObj || $o(id) || null;
}
 
/* function $id(id, doc) {


	doc = doc || document;
	if (typeof(id) == 'object') {
		return id;
	}
	var elem = doc.getElementById(id);
	var returnObj;
	if (isIE && elem) {
		if (elem.id === id) {
			returnObj = elem;
		} else {
			var elems = doc.all[id];
			if (elems && elems.length) {
				for (var i = 0; i < elems.length; i++) {
					if (elems[i].id === id) {
						returnObj = elems[i];
						break;
					}
				}
			}
		}
	} else {
		returnObj = elem;
	}
	return returnObj || $o(id) || null;
} */
/**
 * 根据ID获取对象的方法.regId该方法仅用于使用EOS的迭代生成带下标的ID对象的获取。
 * 如：<input id="cust[1]/name"/> , <input id="cust[2]/name/>等一组对象的获取。
 * 页面元素的id在EOS中是不允许重复的。
 * @param {String} regId id的表达式
 * @type Array
 * @return 返回符合条件的数组.
 */
function $ids(regId) {
	if (regId.indexOf("[*]") > -1) {
		var result = [];
		for (var i = 1; i < Number.MAX_VALUE; i++) {
			var id = regId.replace("[*]", "[" + i + "]");
			var elem = $id(id);
			if (elem) {
				result.push(elem);
			} else {
				break;
			}
		}
		return result;
	} else {
		var result = [];
		var elem = $id(regId);
		if (elem) {
			result.push(elem);
		}
		return result;
	}
	
}
/**
 * 返回第一个name属性等于name参数的元素.当regName它有[*]时,
 * 它会将[*]替换为[1],[2],[3]...查找元素,返回查找到的数组.
 * @param {String} regName regName可以有一个[*]表达式.
 * @type {Element}
 * @return 返回符合条件的数组.
 */
function $names(regName) {
	if (typeof(regName) == 'object') {
		return regName;
	}
	if (regName.indexOf("[*]") > -1) {
		var result = [];
		for (var i = 1; i < Number.MAX_VALUE; i++) {
			var name = regName.replace("[*]", "[" + i + "]");
			var elem = $name(name);
			if (elem) {
				result.push(elem);
			} else {
				break;
			}
		}
		return result;
	} else {
		var elems = document.getElementsByName(regName);
		if (isIE) {
			var result = [];
			for (var i = 0; i < elems.length; i++) {
				if (elems[i].name == regName) {
					result.push(elems[i]);
				}
			}
			return result;
		} else {
			return elems;
		}
	}
}
/**
 * 增加$name函数来根据name获取元素
 * @param {Object} elemName
 */
function $name(elemName) {
	if (typeof(elemName) == 'object') {
		return elemName;
	}
	var elems = document.getElementsByName(elemName);
	if (!elems) {
		return null;
	}
	if (isIE) {
		for (var i = 0; i < elems.length; i++) {
			if (elems[i].name == elemName) {
				return elems[i];
			}
		}
	} else if (elems.length > 0) {
		return elems[0];
	}
	return null;
}

function $indexOf(arr, item) {
	for (var i = 0, length = arr.length; i < length; i++)
		if (arr[i] == item)
			return i;
	return -1;
}

function $contains(arr, item) {
	return $indexOf(arr, item) >= 0;
	
}

function $remove(arr, item) {
	var idx = $indexOf(arr, item);
	if (idx >= 0) {
		return arr.splice(idx, 1);
	}
}

function isArray(obj) {
	return obj && typeof(obj.sort) === 'function' && typeof(obj.join) === 'function';
}

/**
 * 跨浏览器设置innerHTML的方法，该方法可以执行里面的javascript,
 * 但该方法执行过程中，不能再执行设置innerHTML或对dom进行操作.
 * 如果htmlCode中有window的onload事件，则不会执行.
 * 该方法在ie下禁用了日志功能.
 * 该方法不支持document.write
 * 实现说明：ie下读取所有script,将带src的放入一个数组,
 * 用loadNext方法一个一个地载入,最后再执行其它脚本.
 * @param {Object} el 要设置的dom元素,一般为div
 * @param {Object} htmlCode 要设置的innerHTML
 * @param {Object} doc 要设置的document
 */
var setInnerHTML = function (el, htmlCode, doc) {
	
	el.innerHTML = "";
	doc = doc || document;
	var back_write = doc.write;
	doc.write = function () {
		/*var body = doc.getElementsByTagName('body')[0];
		for (var i = 0; i < arguments.length; i++) {
		argument = arguments[i];
		if (typeof argument == 'string') {
		var el = doc.body.appendChild(doc.createElement('div'));
		setInnerHTML(el, argument,doc)
		}
		}*/
	}
	var cacheScripts = doc.getElementsByTagName("script");
	var cacheSRC = {};
	for (var i = 0; i < cacheScripts.length; i++) {
		if (cacheScripts[i].src) {
			cacheSRC[cacheScripts[i].src] = true;
		} else {
			cacheSRC[cacheScripts[i].src] = false;
		}
	}
	if (isIE) {
		htmlCode = '<div style="display:none">for IE</div>' + htmlCode;
		var div = $create("div", doc);
		div.innerHTML = htmlCode;
		var scripts = div.getElementsByTagName("script");
		var execScripts = [];
		var srcArray = [];
		for (var i = scripts.length - 1; i > -1; i--) {
			var script = scripts[i];
			if (script.src) {
				if (!cacheSRC[script.src]) {
					srcArray.push(script.src);
					cacheSRC[script.src] = true;
				}
				script.parentNode.removeChild(script);
			} else {
				execScripts.push(script);
				//script.defer = true;
			}
		}
		function setHTML() {
			//$debug("set html" + div.innerHTML);
			el.innerHTML = div.innerHTML;
			el.removeChild(el.firstChild);
			for (var i = execScripts.length - 1; i >= 0; i--) {
				eval(execScripts[i].innerHTML);
			}
		}
		var index = srcArray.length - 1;
		loadNext();
		function loadNext() {
			if (srcArray[index]) {
				var sc = $create("script", doc);
				sc.src = srcArray[index];
				var first = doc.body.firstChild;
				if (first) {
					doc.body.insertBefore(sc, first);
				} else {
					doc.body.appendChild(sc);
				}
				index--;
				//$debug("load script:" + sc.src + index);
				sc.onreadystatechange = function () {
					if (sc.readyState == "loaded" || sc.readyState == "complete") {
						sc.onreadystatechange = null;
						loadNext();
					}
				}
			} else {
				setHTML();
			}
		}
	} else {
		var el_next = el.nextSibling;
		var el_parent = el.parentNode;
		el_parent.removeChild(el);
		el.innerHTML = htmlCode;
		if (el_next) {
			el_parent.insertBefore(el, el_next)
		} else {
			el_parent.appendChild(el);
		}
	}
}

/**
 * @private 私有方法，设置庶盖层的宽和高.
 * @param {Object} mask
 */
function setMaskSize(mask) {
	var theBody = document.getElementsByTagName("BODY")[0];
	
	var fullHeight = getViewportHeight();
	var fullWidth = getViewportWidth();
	
	// Determine what's bigger, scrollHeight or fullHeight / width
	if (fullHeight > theBody.scrollHeight) {
		popHeight = fullHeight;
	} else {
		popHeight = theBody.scrollHeight;
	}
	if (fullWidth > theBody.scrollWidth) {
		popWidth = fullWidth;
	} else {
		popWidth = theBody.scrollWidth;
	}
	mask.style.height = popHeight + "px";
	mask.style.width = popWidth + "px";
}
/**
 * @private
 * 私有方法，得到可见区的高.
 */
function getViewportHeight() {
	if (window.innerHeight != window.undefined)
		return window.innerHeight;
	if (document.compatMode == 'CSS1Compat')
		return document.documentElement.clientHeight;
	if (document.body)
		return document.body.clientHeight;
	return window.undefined;
}
/**
 * @private
 * 私有方法，得到可见区的宽.
 */
function getViewportWidth() {
	if (window.innerWidth != window.undefined)
		return window.innerWidth;
	if (document.compatMode == 'CSS1Compat')
		return document.documentElement.clientWidth;
	if (document.body)
		return document.body.clientWidth;
	return window.undefined;
}

/**
 * 将宽或高转换为可以使用的类型，如果输入为数字则加px
 * 如：length=1则返回"1px"
 * 如果输入为字符串，带单位的返回本身，否则加px
 * @param {Object} length
 */
function toLength(length) {
	if (isNaN(Number(length))) {
		return length;
	} else {
		return length + "px";
	}
}

/* ============ PageControl 相关函数 ============ */
var __page__components;
if (typeof(__page__components) == "undefined") {
	__page__components = {};
}

/**
 * @class 页面控制类,该类控制页面中的js对象.
 */
function PageControl() {}

PageControl.add = function (id, obj) {
	if (!__page__components[id]) {
		__page__components[id] = obj;
	} else {
		if (__page__components[id + "__is__array__"]) {
			__page__components[id].push(obj);
		} else {
			var temp = [];
			temp.push(__page__components[id]);
			temp.push(obj);
			__page__components[id] = temp;
			__page__components[id + "__is__array__"] = true;
		}
	}
	
	var rel = __page__components_rel;
	if (obj.registerSubComponent && rel[id]) {
		for (var i = 0; i < rel[id].length; i++) {
			if (rel[id][i]) {
				obj.registerSubComponent(rel[id][i]);
				rel[id][i] = null;
			}
		}
	}
	
}

var __page__components_rel;
if (typeof(__page__components_rel) == "undefined") {
	__page__components_rel = {};
}

PageControl.registerRelation = function (pid, id) {
	if (!pid || !id) {
		return;
	}
	var pObj = PageControl.getOne(pid);
	var obj = PageControl.getOne(id);
	if (pObj && pObj.registerSubComponent) {
		pObj.registerSubComponent(id);
	} else if ((pid + '').indexOf('xml:') != 0) {
		var rel = __page__components_rel;
		rel[pid] = rel[pid] || [];
		rel[pid].push(id);
	}
	
}
var topWin = _get_top_window();
topWin.currStack = topWin.currStack || [];
PageControl.setFocus = function (obj, parent,event) {
	var id;
	if (obj) {
		id = obj.id;
	}
	var index = topWin.currStack.length - 1;
	for (; index > -1; index--) {
		var stackObj = topWin.currStack[index];
		if (stackObj) {
			if (stackObj == obj) {
				break;
			} else if (stackObj == parent) {
				break;
			} else {
				if (stackObj.hide) {
					try {
						// stackObj.hide();
						stackObj.hide(obj,parent,event);
					} catch (e) {}
				}
				if (index >= 0) {
					try {
						topWin.currStack.splice(index, 1);
					} catch (e) {}
				}
				
			}
		}
	}
	if (obj) {
		topWin.currStack.push(obj);
	}
}

PageControl.getCurrComp = function () {
	if (topWin.currStack.length > 0) {
		return topWin.currStack[topWin.currStack.length - 1];
	} else {
		return null;
	}
}

PageControl.addtoStack = function (obj) {
	if (!$contains(topWin.currStack, obj)) {
		topWin.currStack[topWin.currStack.length] = obj;
	}
}

/**
 * 根据id获得js对象的方法，获得对象的方法,
 * 如果id对应单个对象则返回对象本身,
 * 如果对应是数组则返回数组.
 * @param {Object} id
 * @return 返回js对象或数组.
 */
PageControl.get = function (id) {
	return __page__components[id];
}

/**
 * 获取一个对象的方法,
 * 如果id对应的是一个数组则返回第一个.
 * @param {Object} id
 * @return 返回js对象或数组的第一项.
 */
PageControl.getOne = function (id) {
	if (__page__components[id + "__is__array__"]) {
		return __page__components[id][0] || null;
	} else {
		return __page__components[id] || null;
	}
}
$o = PageControl.getOne;

var EOS_FunctionCache = {};

function $function(funName, thisObj, argumentList) {
	var func = $getFunction(funName) || window[funName];
	if (typeof(func) == 'function') {
		return func.apply(thisObj || this, argumentList)
	}
}

function $setFunction(funName, func) {
	EOS_FunctionCache[funName] = func;
}

function $getFunction(funName) {
	return EOS_FunctionCache[funName];
}

function $removeFunction(funName) {
	EOS_FunctionCache[funName] = null;
	delete EOS_FunctionCache[funName];
}




