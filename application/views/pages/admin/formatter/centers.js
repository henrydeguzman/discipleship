/**
 * Created by Actino-Dev on 2/5/2019.
 */
var tblformatter = {
     action: function () {
          $html = '<button ng-click="centerspageCtrl.admin.changedialog(tr)" ng-if="tr.adminid>0" style="margin-right:5px;" class="btn btn-xs btn-default">Change admin</button>';
          $html += '<ul class="gttbl-btns horizontal">' +
               '<li ng-click="centerspageCtrl.form.dialog(null,tr.id)"><i class="far fa-edit"></i></li>';
          return $html
     },
     admin: function () {
          $html = '<div ng-if="tr.adminid>0"><gt-profile data="{photo:tr.churchadmin_photo,userid:tr.churchadmin_userid,firstname:tr.churchadmin_firstname,lastname:tr.churchadmin_lastname,email:tr.churchadmin_email}"></gt-profile></div>';

          $html += '<div class="invitestatus"  style="text-align:center;" ng-if="tr.inviteid != null">';
          $html += '<span class="_wait" ng-if="tr.isverified==0&&tr.time_hours<=24"><i class="fas fa-clock"></i> {{tr.invite_email}} requested {{tr.time_minutes | fltr_asMinutesDiff}}</span>';
          $html += '<span class="_expired" ng-if="tr.isverified==0&&tr.time_hours>24"><i class="fas fa-unlink"></i> {{tr.invite_email}} requested was Expired!</span>';
          $html += '</div>';

          $html += '<div style="text-align:center;" ng-if="tr.adminid==0&&tr.inviteid==null"><button ng-click="centerspageCtrl.admin.adddialog(tr)" class="btn btn-xs btn-success"><i class="fas fa-plus"></i> Add</button></div>';
          return $html;
     }
};