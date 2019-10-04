/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 04/10/2019
 * Time: 9:30 PM
 */
var tblformatter = {
    language:function(tr,a,b){
        if(tr.language[a]===undefined){return '-';}
        return '<span>'+tr.language[a]+'</span>';
    }
};