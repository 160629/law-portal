var openSelectWindow = {
    /**
     * 选择公司
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectcompanyList: function (child, openSetting) {
        var settingChild = {
            param: {},
            isRadio: true,
            callback: function (res) {

            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '选择我方争议主体',
            content: systemConfigPageUrl.selectcompany,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);
            }
        };
        if (settingChild.isRadio) {
            openWindow.area = ['850px', '610px'];
        } else {
            openWindow.area = ['1180px', '610px'];
        }
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择引诉
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectissueguideList: function (child, openSetting) {
        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            area : ['1190px', '610px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '选择关联引诉纠纷',
            content: systemConfigPageUrl.selectissueguide,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);

            }
        };
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择纠纷处理
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectLawsuitdeclareList: function (child, openSetting) {
        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            area : ['1190px', '610px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '选择关联纠纷处理',
            content: systemConfigPageUrl.selectlawsuitdeclareList,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);

            }
        };
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 关联案件列表弹出
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectcaseList: function (child, openSetting) {
        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            area: ['1190px', '610px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '关联案件选择',
            content: systemConfigPageUrl.selectcase,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);

            }
        };
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择单位组织结构树
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectCompanyDepartTree: function (child, openSetting) {

        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            isOrg: 0,
            isDepart: 0,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);

        var openWindow = {
            type: 2,
            area: ['645px', '450px'],
            fixed: false, //不固定
            title: '选择公司',
            content: systemConfigPageUrl.selectcompanydepart,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);
            }
        };
        if (settingChild.isRadio) {
            openWindow.area = ['365px', '450px'];
        } else {
            openWindow.area = ['645px', '450px'];
        }
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择单位部门组织结构树
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectorgTree: function (child, openSetting) {

        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            isOrg: 0,
            isDepart: 0,
            isSort:false,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);

        var openWindow = {
            type: 2,
            area: ['645px', '450px'],
            fixed: false, //不固定
            title: '选择部门',
            content: systemConfigPageUrl.selectorg,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);
            }
        };
        if (settingChild.isRadio) {
            openWindow.area = ['365px', '450px'];
        } else {
            openWindow.area = ['645px', '450px'];
        }
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择单位部门用户组织结构树
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectorguserTree: function (child, openSetting) {

        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            fixed: false, //不固定
            title: '选择部门人员',
            content: systemConfigPageUrl.selectorguser,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);
            }
        };
        if (settingChild.isRadio) {
            openWindow.area = ['365px', '450px'];
        } else {
            openWindow.area = ['645px', '450px'];
        }
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择单位部门用户组织结构树-异步
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectorguserTreeAsyncF: function (child, openSetting) {

        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            fixed: false, //不固定
            title: '选择部门人员',
            content: systemConfigPageUrl.selectorguserTreeAsyncF,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);
            }
        };
        if (settingChild.isRadio) {
            openWindow.area = ['365px', '450px'];
        } else {
            openWindow.area = ['645px', '450px'];
        }
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },

    /**
     * 用于展示组织树（分管领导）
     * @param child
     * @param openSetting
     */
    showOrgTree: function (child, openSetting) {

        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            area: ['645px', '450px'],
            fixed: false, //不固定
            title: '选择公司',
            content: systemConfigPageUrl.showOrgTree,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);
            }
        };
        if (settingChild.isRadio) {
            openWindow.area = ['365px', '450px'];
        } else {
            openWindow.area = ['645px', '450px'];
        }
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    },
    /**
     * 选择角色
     * @child 传入的条件参数回调方法等
     * child = {
     *     isRadio:true,//不设默认单选
     *     callback:function(res){
     *
     *     }
     * }
     * @openSetting 可对弹出框信息设置（非必传）
     * */
    selectroleList: function (child, openSetting) {
        var settingChild = {
            param: {flag: ""},
            isRadio: true,
            callback: function (res) {
            }
        };
        $.extend(settingChild, child);
        var openWindow = {
            type: 2,
            area : ['1190px', '610px'],
            fixed: false, //不固定
            maxmin: false, //开启最大化最小化按钮
            title: '选择角色',
            content: systemConfigPageUrl.selectroleList,
            success: function (layero, index) {
                if (!settingChild.isRadio){
                    var body = layer.getChildFrame('body', index);
                    body.find(".radio-div").removeClass("radio-div");
                }

                var iframe = window['layui-layer-iframe' + index];
                settingChild.openSetting ={
                    title: (openSetting ? openSetting.title : null) || openWindow.title
                };
                iframe.child(settingChild);

            }
        };
        $.extend(openWindow, openSetting);
        layer.open(openWindow);
    }
};