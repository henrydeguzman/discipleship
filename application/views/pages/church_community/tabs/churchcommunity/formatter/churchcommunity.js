/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 9:03 PM
 */
var tblformatter={
    email:function(tr,field,td,index){
        return '<div style="display:inline-block;"><button ng-click="cCommunityCtrl.email.add(tr,'+(index+1)+')" style="text-align: center;" type="button" class="btn btn-success btn-xs" ng-if="tr.email===\'\'||tr.email===null">Add email</button><span ng-if="!empty(tr.email)">{{tr.email}}</span></div>';
    }
};