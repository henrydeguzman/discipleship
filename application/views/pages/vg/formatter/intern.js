/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 12/10/2019
 * Time: 1:09 PM
 */
var tblformatter={
    leader:function(tr){
        return '<gt-profile photo="tr.leader_photo" userid="tr.leaderid" name="tr.leader_firstname+\' \'+tr.leader_lastname"></gt-profile>&nbsp;<span class="gen-text-style-capitalize">{{tr.leader_firstname+" "+tr.leader_lastname}}</span>&nbsp;<span ng-if="genvarsValue.userdata(\'userid\')==tr.userid">(You)</span>';
    },
};