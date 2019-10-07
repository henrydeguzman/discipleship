<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 06/07/2019
 * Time: 11:04 AM
 */
class Reports_Script {
    function getlist(){
        return "SELECT SQL_CALC_FOUND_ROWS user_vg.vg_count,vg_intern.intern_count,
                development_weekend.victory_weekend_count           
                ,church.churchid,church.name as churchname FROM church
                LEFT JOIN (SELECT COUNT(vgid) as vg_count, churchid,vgid FROM user INNER JOIN user_vg ON user.userid=user_vg.leaderid) user_vg ON user_vg.churchid=church.churchid
                LEFT JOIN (SELECT COUNT(internid) as intern_count, churchid,internid,user_vg_intern.statusid FROM user INNER JOIN user_vg_intern ON user.userid=user_vg_intern.userid) vg_intern ON vg_intern.churchid=church.churchid AND vg_intern.statusid=1
                LEFT JOIN (SELECT COUNT(a.devweekendid) as victory_weekend_count, b.churchid  FROM development_weekend a INNER JOIN development_weekend_dates b ON a.weekendid=b.weekendid ) development_weekend ON development_weekend.churchid=church.churchid";
    }
}
