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
                development_weekend.victory_weekend_count, development_churchcommunity.church_community_count,
                development_purplebook.purple_book_count,development_makingdisciples.making_disciples_count,
                development_empleaders.empowering_leaders_count
                ,church.churchid,church.name as churchname FROM church
                LEFT JOIN (SELECT COUNT(vgid) as vg_count, churchid,vgid FROM user INNER JOIN user_vg ON user.userid=user_vg.leaderid) 
                user_vg ON user_vg.churchid=church.churchid
                LEFT JOIN (SELECT COUNT(internid) as intern_count, churchid,internid,user_vg_intern.statusid FROM user INNER JOIN user_vg_intern ON user.userid=user_vg_intern.userid) vg_intern ON vg_intern.churchid=church.churchid AND vg_intern.statusid=1
                LEFT JOIN (SELECT COUNT(a.devweekendid) as victory_weekend_count, b.churchid  FROM development_weekend a INNER JOIN development_weekend_dates b ON a.weekendid=b.weekendid ) development_weekend ON development_weekend.churchid=church.churchid
                LEFT JOIN (SELECT COUNT(a.devchurchcommunityid) as church_community_count,b.churchid FROM development_churchcommunity a INNER JOIN development_churchcommunity_dates b ON a.churchcommunityid=b.churchcommunityid) development_churchcommunity ON development_churchcommunity.churchid=church.churchid
                LEFT JOIN (SELECT COUNT(a.devpurplebookid) as purple_book_count,b.churchid FROM development_purplebook a INNER JOIN development_purplebook_dates b ON a.purplebookid=b.purplebookid) development_purplebook ON development_purplebook.churchid=church.churchid
                LEFT JOIN (SELECT COUNT(a.devmakingdisciplesid) as making_disciples_count, b.churchid FROM development_makingdisciples a INNER JOIN development_makingdisciples_dates b ON a.makingdisciplesid=b.makingdisciplesid) development_makingdisciples ON development_makingdisciples.churchid=church.churchid
                LEFT JOIN (SELECT COUNT(a.devempleadersid) as empowering_leaders_count,b.churchid FROM development_empleaders a INNER JOIN development_empleaders_dates b ON a.empleadersid=b.empleadersid) development_empleaders ON development_empleaders.churchid=church.churchid ";
    }
}
