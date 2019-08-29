/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-29
 * Time : 19:19
 */
angular.module("MainFormatters",[])
    .value("inifrmtrValue",{
        checkbox:function(tr){
            return '<div ng-if="tr[td.field]!==undefined" class="gttbl_inifrmtr"><i ng-click="gtTblCtrl.tdkick(td,tr,\'checkbox\')" class="fa _checkbox" ng-class="tr[td.field]===\'1\'?\'fa-check-square-o\':\' fa-square-o\'"></i></div><div ng-if="tr[td.field]==undefined" class="unset">-</div>';
        },
        fullname:function(tr){
            console.log(tr);
            return '<gt-profile photo="tr.photo" userid="tr.userid" name="tr.fullname"></gt-profile>&nbsp;<span>{{tr.fullname}}</span>';
        },
        fullnameonly:function(tr){
            return '{{tr.firstname+" "+tr.lastname}}';
        },
        numchecklist:function(tr,td,a){ /** allow checkbox on every record after row number. ex: [checkbox] 1.  */
            return '<label class="gen-checkbox-style">\n' +
                '<input type="checkbox" ng-model="tr._checked" ng-change="td.onclick()(\'row-{{trindex}}\',tr)" />\n' +
                '<div class="ng-binding">{{trindex+1}}.</div>\n' +
                '</label>';
        },
        fulldate:function(tr){ return "<span>{{tr.date | date:'fullDate'}}</span>"; },
        count:function(tr){ return '{{trindex+1}}'; }
    });