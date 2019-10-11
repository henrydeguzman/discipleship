/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 10:19 PM
 */
var tblformatter={
    controls:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-if="tr.total==0" ng-click="empleadersDatesCtrl.leaders.date.remove(tr)"><i class="far fa-trash-alt"></i></li></ul>';
    }
};