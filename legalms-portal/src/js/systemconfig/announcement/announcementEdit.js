var primaryKey;
var fileIds = [];
$(function() {
	getPrimaryKey();
	$("#thelist").find('input[type="file"]').on('change', function() {
		uploadFile.upload($("#thelist"), this, {
			shareType: 'announcement',
			formId: primaryKey
		});
	});
});
<!-- 移除附件-->
function delImg(target, fileId) {
	$(target).parent().parent().remove();
	fileIds.splice($.inArray(fileId, fileIds), 1);
}
<!-- 发布页面-->
function publish() {
	var queryParam = {};
	var queryParams = $.extend($("#announcementForm").serializeJSON(), queryParam);
	if(checkno(queryParams)) {
		if(!isEmpty(queryParams.announcementTypeid)) {
			queryParams.announcementTypeid = parseInt(queryParams.announcementTypeid);
		}
		queryParams.announcementContent = $("#announcementContent").val().replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
		queryParams.announcementId = primaryKey;
		queryParams.filedId = fileIds.join(",");
		ajax_req({
			url: baseUrl.announcement.addAnnouncement,
			type: 'post',
			dataType: 'json',
			contentType: 'application/json',
			data: JSON.stringify(queryParams),
			success: function(rs) {

				if(rs.resultStat == "SUCCESS") {
					layer.msg("添加成功", {
						time: 1000
					});
					closeTab();
				} else {
					layer.alert(rs.mess, {
						icon: 2,
						title: "提示"
					});
				}
			},
			error: function(e) {
				layer.alert('添加公告信息失败，请联系管理员', {
					icon: 2,
					title: "提示"
				});
			}
		});
	}

}

function checkno(obj) {
	for(var i in obj) {
		if(isEmpty(obj[i]) == true) {
			var str = i.toString();
			if(str == 'announcementName') {
				layer.msg("公告标题不能为空", {
					time: 1000
				});
				return false
			} else if(str == 'announcementContent') {
				layer.msg("公告内容不能为空", {
					time: 1000
				});
				return false
			} else if(str == 'announcementTypeid') {
				layer.msg("公告类型不能为空", {
					time: 1000
				});
				return false
			} 

		}
	}
	return true
}
<!-- 获取附件的关联关系-->
function getPrimaryKey() {
	ajax_req({
		url: baseUrl.tFlowMain.getPrimaryKey,
		type: 'post',
		dataType: 'json',
		contentType: 'application/json',
		data: {}, //JSON.stringify(params),
		success: function(rs) {
			if(rs.resultStat == "SUCCESS") {
				primaryKey = rs.data;
			} else {
				layer.alert(rs.mess, {
					icon: 2,
					title: "提示"
				});
			}
		},
		error: function(e) {
			layer.alert('获取文件关联主键信息失败，请联系管理员', {
				icon: 2,
				title: "提示"
			});
		}
	});
}

function closeTab() {
	var index = parent.layer.getFrameIndex(window.name);
	parent.layer.close(index);
}