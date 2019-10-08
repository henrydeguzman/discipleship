/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 08/10/2019
 * Time: 9:23 PM
 */
var tblformatter={
    controls:function(){
        return '<ul class="gttbl-btns horizontal">' +
            '<li ng-if="tr.total==0" ng-click="makingdisciplesDatesCtrl.disciples.date.remove(tr)"><i class="far fa-trash-alt"></i></li></ul>';
    }
};