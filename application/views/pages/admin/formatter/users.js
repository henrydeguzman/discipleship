/**
 * Created by Actino-Dev on 12/8/2018.
 */
var tblformatter={
    action:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-click="userpageCtrl.form.dialog(tr.userid)"><i class="far fa-edit"></i></i></li>' +
            '<li ng-click="tabsCtrl.tab1.file.form(tr,\'delete\')"><i class="far fa-trash-alt"></i></li></ul>';
    }
};