var ship = (function () {
	var caseId = getQuery().caseId;
	var ship = {
		URL: [
			baseUrl.case.addRelationship, // 添加关联引诉纠纷接口
			baseUrl.case.selectRelationship, // 查询 案件卷宗关联接口
			baseUrl.case.deleteRelationship // 删除接口
		],
		listData: {
			t_issue_guide: [], // 引诉
			t_issue_lawsuit: [], // 纠纷处理
			t_case_legislation: [], // 法律文书
			t_issue_jointly: [], // 案件协办
			t_case_assign: [] //案件交办
		},
		isReadOnly: 0 // 是否 只读 ，默认 否
	};
	// 设置 面板内容
	ship.setPanel = function () {
		var html = '', dataArr = [];
		if (ship.listData.t_issue_lawsuit.length > 0) {
			// 纠纷处理
			dataArr = ship.listData.t_issue_lawsuit;
            var lawsuit_html = "";
			$.each(dataArr,function (i,v) {
                var delHtml='';
                if (v.isDelete == 1) {
                    delHtml = "<a href='#' class='del' businesstype='t_issue_lawsuit' caseid='" + v.caseId + "' businessid='" + v.businessId + "'>删除</a>";
                }
                lawsuit_html +=
                    "   <tr>" +
                    "   	<td><a href='#' class='title-link' id='" + v.businessId + "' moduleName='" + v.moduleName + "'>" + v.tittle + "</a></td>" +
                    "   	<td>" + v.createTime + "</td>" +
                    "   	<td>" + dataDict.getDictValueByKey("sys_flow_status", v.flowStatus) + delHtml +"</td>" +
                    " 	</tr>";
            });
            html +="<tr><td>纠纷处理</td><td><table class='table-data'>" +lawsuit_html+"</table></td></tr>";
		}
		if (ship.listData.t_case_assign.length > 0) {
			// 案件交办
			dataArr = ship.listData.t_case_assign;
            var assign_html = "";
            $.each(dataArr,function (i,v) {
                assign_html +=
                    "   <tr>" +
                    "   	<td><a href='#' class='title-link' id='" + v.businessId + "' moduleName='" + v.moduleName + "'>" + v.tittle + "</a></td>" +
                    "   	<td>" + v.createTime + "</td>" +
                    "   	<td>" + dataDict.getDictValueByKey("sys_flow_status", v.flowStatus) + "</td>" +
                    " 	</tr>";
            });
            html +="<tr><td>案件交办</td><td><table class='table-data'>" +assign_html+"</table></td></tr>";
		}
		if (ship.listData.t_issue_jointly.length > 0) {
			// 案件协办
			dataArr = ship.listData.t_issue_jointly;
            var jointly_html = "";
            $.each(dataArr,function (i,v) {
                jointly_html +=
                    "   <tr>" +
                    "   	<td><a href='#' class='title-link' id='" + v.businessId + "' moduleName='" + v.moduleName + "'>" + v.tittle + "</a></td>" +
                    "   	<td>" + v.createTime + "</td>" +
                    "   	<td>" + dataDict.getDictValueByKey("sys_flow_status", v.flowStatus) + "</td>" +
                    " 	</tr>";
            });
            html +="<tr><td>案件协办</td><td><table class='table-data'>" +jointly_html+"</table></td></tr>";
		}
		if (ship.listData.t_case_legislation.length > 0) {
			// 法律文书办理
			dataArr = ship.listData.t_case_legislation;
            var legislation_html = "";
            $.each(dataArr,function (i,v) {
                legislation_html +=
                    "   <tr>" +
                    "   	<td><a href='#' class='title-link' id='" + v.businessId + "' moduleName='" + v.moduleName + "'>" + v.tittle + "</a></td>" +
                    "   	<td>" + v.createTime + "</td>" +
                    "   	<td>" + dataDict.getDictValueByKey("sys_flow_status", v.flowStatus) + "</td>" +
                    " 	</tr>";
            });
            html +="<tr><td>法律文书办理</td><td><table class='table-data'>" +legislation_html+"</table></td></tr>";
		}
        if (ship.listData.t_issue_guide.length > 0) {
			// 引诉纠纷
			dataArr = ship.listData.t_issue_guide;
            var guid_html = "";
            $.each(dataArr,function (i,v) {
                guid_html +=
                    "   <tr>" +
                    "   	<td><a href='#' class='title-link' id='" + v.businessId + "' moduleName='" + v.moduleName + "'>" + v.tittle + "</a></td>" +
                    "   	<td>" + v.createTime + "</td>" +
                    "   	<td>" + dataDict.getDictValueByKey("sys_flow_status", v.flowStatus) + "</td>" +
                    " 	</tr>";
            });
            html +="<tr><td>引诉纠纷</td><td><table class='table-data'>" +guid_html+"</table></td></tr>";
		}
		$('#relevanceTableBody').html(html);

        if (ship.listData.t_issue_lawsuit.length == 0 && ship.listData.t_case_assign.length == 0 && ship.listData.t_issue_jointly.length == 0 && ship.listData.t_case_legislation.length == 0 && ship.listData.t_issue_guide.length == 0) {
            $('#relevanceTableBody').html("<div class='noDate'>暂无数据信息</div>");
        }

		// 删除功能
		$('#relevanceTableBody .del').click(function () {
			var that = $(this), postdata = {};
			postdata.businessType = that.attr('businesstype');
			if (!postdata.businessType) {
				return false;
			}
			layer.confirm("确定删除选中的信息吗？", { btn: ['确定', '取消'], title: "提示" }, function () {
				postdata.caseId = that.attr('caseid');
				postdata.businessId = that.attr('businessid');

				ajax_req({
					url: ship.URL[2],
					type: 'POST',
					data: JSON.stringify(postdata),
					success: function (res) {
						if (res.resultStat == 'SUCCESS') {
							layer.msg('删除成功');
							ship.getData(); // 刷新 ship面板
						}
					}
				});
			});
		});
		$('.title-link').on('click', function () {
			var formId = $(this).attr("id");
			var moduleName = $(this).attr("moduleName");
			jumpDisputeDraft(formId, moduleName);
		})
	};
	// 获取数据
	ship.getData = function (setting) {
		var postdata = {
			caseId: getQuery().caseId   // caseId     案件ID
		};
		var param = {
			onDel: true
		};
		$.extend(param, setting);
		ajax_req({
			url: ship.URL[1],
			type: 'POST',
			data: JSON.stringify(postdata),
			success: function (res) {
				res.data.map(function (v, i) {
					if (v.businessType == 't_issue_guide') {
						console.log(v)
					}
				});
				if (res.resultStat == 'SUCCESS') {
					ship.listData = {
						t_issue_guide: [], // 引诉
						t_issue_lawsuit: [], // 纠纷处理
						t_case_legislation: [], // 法律文书
						t_issue_jointly: [], // 案件协办
						t_case_assign: []
					};
					for (var i = 0; i < res.data.length; i++) {
						if (!ship.listData[res.data[i].businessType]) {
							continue;
						}
						var onDel = param.onDel;
						if (param.onDel && res.data[i].isDelete == 0) {
							onDel = false;
						}
						ship.listData[res.data[i].businessType].push({
							caseId: res.data[i].caseId,  // caseId     案件ID
							businessId: res.data[i].businessId,   // guideId
							tittle: res.data[i].tittle,     //guideTittle   标题
							code: res.data[i].code,     //guideCode      编号
							moduleName: res.data[i].moduleName,      //  moduleName
							isDelete: onDel,
							createTime: res.data[i].createTime,  //创建时间
							flowStatus: res.data[i].flowStatus   //数据状态
						});
					}
					ship.setPanel(); // load panel
				}
			}
		});
	};
	return ship;
})();

function jumpDisputeDraft(formId, moduleName) {
	//去pageUrl匹配对应页面，默认拿编辑页，
	var path = pageUrl.getBusinessUrl(moduleName, "view");
	if (path) {
		var param = "?formId=" + formId + "&moduleName=" + moduleName;
		openFullWindow(path + param, {
			closed: function () {
			}
		});
	} else {
		//提示
	}
}
