/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:05
 */
var tblformatter={
    controls:function(tr){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-if="tr.total==0" ng-click="vwDatesCtrl.weekend.date.remove(tr)"><i class="far fa-trash-alt"></i></li></ul>';
    }
};