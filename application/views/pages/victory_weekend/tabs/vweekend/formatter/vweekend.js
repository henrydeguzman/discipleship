/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 29/08/2019
 * Time: 11:25 AM
 */
var tblformatter = {
     action: function (tr, field, td, index) {          
          return '<div style="display:inline-block;"><button ng-click="vWeekendCtrl.email.add(tr,' + (index + 1) + ')" type="button" class="btn btn-success btn-xs">Add email</button></div>';          
     }
};