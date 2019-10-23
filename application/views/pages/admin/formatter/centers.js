/**
 * Created by Actino-Dev on 2/5/2019.
 */
var tblformatter={
    action:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-click="centerspageCtrl.form.dialog(null,tr.id)"><i class="far fa-edit"></i></li>' +
            '<li ng-click="centerspageCtrl.form.delete(tr.id)"><i class="far fa-trash-alt"></i></li></ul>';
    },
    admin: function () {
         return '<div ng-if="tr.adminid>0"><gt-profile photo="tr.churchadmin_photo" userid="tr.churchadmin_userid" name="tr.churchadmin_fullname"></gt-profile>&nbsp;<span ng-class="tr.churchadmin_firstname!=null?\'gen-text-style-capitalize\':\'\'">{{tr.churchadmin_fullname}}</span>&nbsp;<span ng-if="genvarsValue.userdata(\'userid\')==tr.churchadmin_userid">(You)</span></div><div style="text-align:center;" ng-if="tr.adminid==0"><button ng-click="centerspageCtrl.admin.adddialog(tr)" class="btn btn-xs btn-success"><i class="fas fa-plus"></i> Add</button></div>';
    }
};