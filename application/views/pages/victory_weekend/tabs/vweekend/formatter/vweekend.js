/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 29/08/2019
 * Time: 11:25 AM
 */
var tblformatter={
    email:function(tr,field,td,index){        
        return '<div style="display:inline-block;"><button ng-click="vWeekendCtrl.email.add(tr,'+(index+1)+')" style="text-align: center;" type="button" class="btn btn-success btn-xs" ng-if="tr.email===\'\'||tr.email===null">Add email</button><span ng-if="!empty(tr.email)">{{tr.email}}</span></div>';
    }
};