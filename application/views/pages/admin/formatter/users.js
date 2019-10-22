/**
 * Created by Actino-Dev on 12/8/2018.
 */
var tblformatter = {
     action: function () {
          return '<ul class="gttbl-btns horizontal">' +
               '<li ng-click="userpageCtrl.form.dialog(tr.userid)"><i class="far fa-edit"></i></i></li>' +
               '<li ng-click="tabsCtrl.tab1.file.form(tr,\'delete\')"><i class="far fa-trash-alt"></i></li></ul>';
     },
     verified: function () {
          /** Verified/waiting for verification/expired token and not verified */
          /** 1 day verification time limit */
          return '<div class="invitestatus"><span class="_verified" ng-if="tr.isverified==1"><i class="fas fa-check-circle"></i> Verified</span>' +
          '<span class="_wait" ng-if="tr.isverified==0&&tr.time_hours<=24"><i class="fas fa-clock"></i> {{tr.time_minutes | fltr_asMinutesDiff}}</span><span class="_expired" ng-if="tr.isverified==0&&tr.time_hours>24"><i class="fas fa-unlink"></i> Expired!</span></div>';
     },
     actioninvites: function() {
          return '<button ng-if="tr.isverified==0&&tr.time_hours>24" class="btn btn-xs btn-default"><i class="fas fa-reply"></i> Resend</button>';
     }
};