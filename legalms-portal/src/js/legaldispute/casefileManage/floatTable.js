var floatTable = {
    //添加关联引诉、纠纷处理
    addRelationship: function (data) {
        var resourceData = {};
        ajax_req({
            url: baseUrl.case.addRelationship,
            type: 'post',
            data: JSON.stringify(data),
            async: false,
            success: function (res) {
                if (res.resultStat == "SUCCESS") {
                    layer.msg('关联成功');
                    resourceData = res.data;
                    if (typeof ship != 'undefined') {
                        ship.getData(); // 刷新 ship面板
                    }
                } else {
                    layer.msg('关联失败');
                }
            }
        });
        return resourceData;
    },
    //创建卷宗页面-添加引诉弹出页
    addIssueguideListPage: function () {
        openSelectWindow.selectissueguideList({
            param: {correlate: "1"},
            callback: function (res) {
                var guideObj = res[0];
                var caseId = getQuery().caseId || $('input[name="caseId"]').val();
                var postData = {
                    businessType: 't_issue_guide', // 业务表类型,暂时写死了，需要跟后台要活数据
                    caseId: caseId,   // caseId     案件ID
                    businessId: guideObj.guideId || '',   // guideId
                    tittle: guideObj.guideTitle || '',     //guideTittle
                    code: guideObj.guideCode || '',     //guideCode
                    moduleName: guideObj.moduleName || ''    //  moduleName 页面跳转标识
                };
                floatTable.addRelationship(postData);
            }
        })
    },
    //创建卷宗页面-添加纠纷处理弹出页
    addLawsuitdeclareListPage: function () {
        openSelectWindow.selectLawsuitdeclareList({
            param: {correlate: "1"},
            callback: function (res) {
                var lawsuitObj = res[0];
                var caseId = getQuery().caseId || $('input[name="caseId"]').val();
                var postData = {
                    businessType: 't_issue_lawsuit', // 业务表类型,暂时写死了，需要跟后台要活数据
                    caseId: caseId,   // caseId     案件ID
                    businessId: lawsuitObj.lawsuitId || '',
                    tittle: lawsuitObj.lawsuitTitle || '',
                    code: lawsuitObj.lawsuitCode || '',
                    moduleName: lawsuitObj.moduleName || ''
                };
                floatTable.addRelationship(postData);
            }
        },{title:'选择纠纷处理'})
    },
    //创建卷宗页面-关联引诉弹出页
    selectIssueguideListPage: function () {
        openSelectWindow.selectissueguideList({
            param: {correlate: "1"},
            callback: function (res) {
                var guideObj = res[0];
                $("input[name=guideTitle]").val(guideObj.guideTitle);
                $("input[name=guideId]").val(guideObj.guideId);
                $(".caseSpecialLine").val(guideObj.guideMethod);
                $(".caseReason").val(guideObj.caseReason);
                $("input[name=caseDeputeMoney]").val(guideObj.caseDeputeMoney);
                $(".largeLawsuitMark").val(guideObj.guideSize);
                $("input[name=ourLawsuitBodyName]").val(guideObj.ourLawsuitBodyName);
                $("input[name=ourLawsuitBody]").val(guideObj.ourLawsuitBody);
                $("input[name=otherLawsuitBody]").val(guideObj.otherDeputeBody);
            }
        })
    },
    //创建卷宗页面-我方主体选择弹出页
    ourLawsuitBodySelect: function () {

        //若是多选啊需要设置回填字段和值
        var selectItem = {};
        var ourLawsuitBody = $("input[name=ourLawsuitBody]").val();
        var ourLawsuitBodyName = $("input[name=ourLawsuitBodyName]").val();
        if (ourLawsuitBody) {
            selectItem = {
                bodyCode: ourLawsuitBody.split(","),
                bodyName: ourLawsuitBodyName.split(",")
            };
        }
        openSelectWindow.selectcompanyList({
            param: {flag: "1"},
            isRadio: false,
            selectItem: selectItem,
            callback: function (res) {
                var bodyName = [], bodyCode = [];
                $.each(res, function (index, value) {
                    //回调函数设置
                    bodyName.push(value.bodyName);
                    bodyCode.push(value.bodyCode);
                });
                $("input[name=ourLawsuitBody]").val(bodyCode.join(","));
                $("input[name=ourLawsuitBodyName]").val(bodyName.join(","));
            }
        }, {title: '选择我方诉讼主体'})
    },
    /**
     * 选择涉案负责人
     */
    involvedAccountPage:function () {
        parent.openSelectWindow.selectorguserTreeAsyncF({
            param: {'flag': 5},
            isRadio: true,
            isDepart: 1,
            callback: function (res) {
                $("input[name=involvedAccountId]").val(res[0].id);
                $("input[name=involvedAccountName]").val(res[0].val);
                $("input[name=involvedDeptName]").val(res[0].deptName);
                $("input[name=involvedDeptId]").val(res[0].pid);
                $("input[name=involvedOrgId]").val(res[0].orgId);
                $("input[name=involvedOrgName]").val(res[0].orgName);
            }
        }, {title: '选择涉案负责人'})
    }
};

