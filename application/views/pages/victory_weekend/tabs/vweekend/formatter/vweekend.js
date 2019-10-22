/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 29/08/2019
 * Time: 11:25 AM
 */
var tblformatter = {
     action: function (tr, field, td, index) {          
          return '<div style="display:inline-block;"><button ng-click="vWeekendCtrl.email.add(tr,' + (index + 1) + ')" type="button" ng-class="tr.email!==null?\'btn-default\':\'btn-success\'" class="btn btn-xs">{{tr.email!==null?\'Change\':\'Add\'}} email</button></div>';          
     }
};