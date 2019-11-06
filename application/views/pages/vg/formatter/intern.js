/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 12/10/2019
 * Time: 1:09 PM
 */
var tblformatter={
    leader:function(tr){
        return '<gt-profile data="{photo:tr.leader_photo,userid:tr.leaderid,firstname:tr.leader_firstname,lastname:tr.leader_lastname,email:leader_email}"></gt-profile>';
    },
};