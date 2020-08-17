$(function () {
    var caseId = getQuery().caseId;
    if (!isEmpty(caseId)) {
        ajax_req({
            url: baseUrl.caseMain.selectCaseMain,
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify({"caseId": caseId}),
            success: function (rs) {
                if (rs.resultStat == "SUCCESS") {
                    var result = rs.data.caseMainVO;
                    $("#model_form").jsonSerializeForm(result);

                    panel.setSanx({
                        caseTheThird: rs.data.caseMainVO.caseTheThird, // 第三人
                        caseSamePlaintiff: rs.data.caseMainVO.caseSamePlaintiff, // 同案原告
                        caseSameDefendant: rs.data.caseMainVO.caseSameDefendant // 同案被告
                    });
                    if (rs.data.caseMainVO){
                        var rulingClasses = rs.data.caseMainVO.rulingClasses.split(",");
                        $.each(rulingClasses,function (i,v) {
                            // console.log($("input[name='ctype'][value='" + v + "']"));
                            $("input[name='ctype'][value='" + v + "']").prop("checked","checked");
                        });
                    }

                    panel.getFileData(function (res) {
                        if (res.resultStat == 'SUCCESS') {
                            panel.insertFile($('.upfileinput').parents('.input'), res.data, 'casemain');
                        }
                    }, "casemain");


                } else {
                    layer.alert('获取信息失败，请联系管理员', {
                        icon: 2,
                        title: "提示"
                    });
                }
            }, error: function (e) {
                layer.alert('获取信息失败，请联系管理员', {
                    icon: 2,
                    title: "提示"
                });
            }
        });
    }
});

function changeCaseReviewGrade() {
    var selectVal = $(".caseReviewGrade").val();
    if (selectVal != '') {
        $("input[name='ctype']").prop("disabled", false);
        //行政处罚：selectVal = 6
        //行政复议：selectVal = 7
        if (selectVal < 6) {

            $("input[name='ctype']").each(function () {
                if ($(this).val() > selectVal) {
                    this.checked = false;
                    $(this).attr("disabled", true).parent().hide();
                }else{
                    $(this).parent().show();
                }
            })
        }else{
            $("input[name='ctype'][value!='6']").each(function () {
                this.checked = false;
                $(this).attr("disabled", true).parent().hide();
            });
            $("input[name='ctype'][value='6']").parent().show();
        }
    }else{
        $("input[name='ctype']").parent().hide();
    };

    //根据状态进行提示
    if(selectVal){
        $('.tips').hide();
    }else {
        $('.tips').show();
    }
}

//不允许特殊输入字符
$('.len').on('input', function () {
    inputControl.replaceAndSetPos(this,/&quot;|&lt;|&gt;|[\……\~\`\·\|\【\】\!\！\{\}\#\$\￥\%\^\&\*\(\)\[\]\\\/\?\？\=\+]|@|/g,'');
});
