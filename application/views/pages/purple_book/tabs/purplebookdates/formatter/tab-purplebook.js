/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 10:26 PM
 */
var tblformatter={
    controls:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-if="tr.total==0" ng-click="purplebookDatesCtrl.pbook.date.remove(tr)"><i class="far fa-trash-alt"></i></li></ul>';
    }
};