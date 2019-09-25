/**
 * Created by Actino-Dev on 2/5/2019.
 */
var tblformatter={
    action:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-click="centerspageCtrl.form.dialog(null,tr.id)"><i class="fa fa-pencil-square-o"></i></li>' +
            '<li ng-click="centerspageCtrl.form.delete(tr.id)"><i class="fa fa-trash-o"></i></li></ul>';
    }
};