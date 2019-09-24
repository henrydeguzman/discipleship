/**
 * Created by Actino-Dev on 2/16/2019.
 */
var tblformatter={
    action:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-click="vgpageMyVgCtrl.delete(tr)"><i class="fa fa-trash-o"></i></li></ul>';
    },
    toggle:function(tr){
        return '<gt-toggle ng-if="genvarsValue.userdata(\'userid\')!=tr.userid" callback="vgpageMyVgCtrl.addtointern" node="tr" input-model="tr.isintern"></gt-toggle>';
    },
};