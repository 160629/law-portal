/**
 * 注意 : EOSKey 内的 按键映射为 onKeydown 和 onKeyup 时的 keyCode,一些按键在 keyPress 时 ,可能会有不同的 keyCode.
 *  所以请根据情况 选择使用 EOSKey 或 EOSKeyPress.
 **/


//if(EOSKey!=null) alert(EOSCANNOTINCLUDE); 

var EOSKey = {

	BACKSPACE : 8,
	TAB : 9,
	ENTER : 13,
	SHIFT : 16,
	CTRL : 17,
	PAUSE : 19,
	CAPSLOCK : 20,
	ESC : 27,

	SPACE : 33,
	PAGEUP : 33,
	PAGEDOWN : 34,
	END : 35,
	HOME : 36,
	LEFT : 37,
	UP : 38,
	RIGHT : 39,
	DOWN : 40,
	INSERT : 45,
	DELETE : 46,

	WIN : 91,
	WIN_R : 92,
	MENU : 93,

	F1 : 112,
	F2 : 113,
	F3 : 114,
	F4 : 115,
	F5 : 116,
	F6 : 117,
	F7 : 118,
	F8 : 119,
	F9 : 120,
	F10 : 121,
	F11 : 122,
	F12 : 123,
	NUMLOCK : 144,
	SCROLLLOCK : 145

}


var EOSKeyPress = {
 /* 待补充... */
}

var blankURL=contextPath+"/common/blank.jsp";

