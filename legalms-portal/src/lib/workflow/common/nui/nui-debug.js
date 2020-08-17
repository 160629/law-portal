var PATH = bootPATH+'source/debug/';
var PATHCss = bootPATH+'themes/default/';

var scripts = [
    'base/Core.js',
    'base/Drag.js',
    'base/JSON.js',
    'base/Date.js',
    'base/Utils.js',
    'base/Load.js',
    'base/Format.js',

    'Hidden.js',
    'Popup.js',
    'Button.js',
    'CheckBox.js',
    'ButtonEdit.js',
    'TextBox.js',
    'PopupEdit.js',    
    'ComboBox.js',
    'DatePicker.js',
    //'ColorPicker.js',
    'Calendar.js',
    'ListBox.js',
    'CheckBoxList.js',
    'RadioButtonList.js',
    'TreeSelect.js',
    'Spinner.js',
    'TimeSpinner.js',
    'HtmlFile.js',
    'FileUpload.js',
    'Lookup.js',
    'TextBoxList.js',
    'AutoComplete.js',
    'ToolTip.js',
    //'Label.js',
    'Form.js',
    'Fit.js',
    'Panel.js',    
    'Window.js',
    'Splitter.js',
    'Layout.js',
    'Box.js',    
    'Include.js',
    'Tabs.js',
    'Menu.js',
    'OutlookBar.js',
    'OutlookMenu.js',
    'OutlookTree.js',
    'ToolBar.js',
    'Pager.js',   
    'FilterEdit.js',
        
    'grid/DataBinding.js',
    'grid/DataSet.js',
    'grid/DataSource.js',

    'grid/ColumnModel.js',
    'grid/GridView.js',
    'grid/FrozenGridView.js',
    'grid/ScrollGridView.js',
    'grid/Plugins.js',
    'grid/DataGrid.js',
    'grid/TreeGrid.js',

	'../ext/nui-richtext.js',
	'../ext/nui-ext.js',
	'../ext/nui-dict.js',
	'../ext/nui-ext-eos.js',
	//'../ext/nui-validate.js',
	'../ext/nui-excontrol.js'

];


var css = [
    'core.css',
    'button.css',
    'checkbox.css',
    'textbox.css',
    'buttonedit.css',
    'panel.css',
    'outlookbar.css',
    'tabs.css',
    'splitter.css',
    'layout.css',        
    'menu.css',
    'calendar.css',
    'listbox.css',
    'checkboxlist.css',
    'tooltip.css',

    'grid.css',
    'tree.css',
    
    'pager.css',

    'htmlfile.css',
    'fileupload.css',
    'textboxlist.css'   
];

for (var i = 0, l = css.length; i < l; i++) {
    document.write('<link href="' + PATHCss + css[i] + '" rel="stylesheet" type="text/css" />');
}

for (var i = 0, l = scripts.length; i < l; i++) {
    document.write('<script src="' + PATH + scripts[i] + '" type="text/javascript"></script>');
}

//lang
document.write('<script src="'+bootPATH+'locale/zh_CN.js" type="text/javascript"></script>');



//gray
//document.write('<link href="/miniui/scripts/miniui/themes/gray/skin.css" rel="stylesheet" type="text/css" />');

//blue
//document.write('<link href="/miniui/scripts/miniui/themes/blue/skin.css" rel="stylesheet" type="text/css" />');

//olive2003
//document.write('<link href="/miniui/scripts/miniui/themes/olive2003/skin.css" rel="stylesheet" type="text/css" />');

//blue2003
//document.write('<link href="/miniui/scripts/miniui/themes/blue2003/skin.css" rel="stylesheet" type="text/css" />');

//blue2010
//document.write('<link href="/miniui/scripts/miniui/themes/blue2010/skin.css" rel="stylesheet" type="text/css" />');
