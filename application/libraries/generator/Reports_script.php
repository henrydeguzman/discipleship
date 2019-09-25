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
                victory_weekend.victory_weekend_count,church_community.church_community_count,purple_book.purple_book_count,
                making_disciples.making_disciples_count,empowering_leaders.empowering_leaders_count,.leadership_113.leadership_113_count,baptized.baptized_count
                ,church.churchid,church.name as churchname FROM church
                LEFT JOIN (SELECT count(vgid) as vg_count, churchid,vgid FROM user INNER JOIN user_vg ON user.userid=user_vg.leaderid) user_vg ON user_vg.churchid=church.churchid
                LEFT JOIN (SELECT count(internid) as intern_count, churchid,internid,user_vg_intern.statusid FROM user INNER JOIN user_vg_intern ON user.userid=user_vg_intern.userid) vg_intern ON vg_intern.churchid=church.churchid AND vg_intern.statusid=1
                LEFT JOIN (SELECT count(user_journey.victory_weekend) as victory_weekend_count,user_journey.victory_weekend,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.victory_weekend <> '0000-00-00 00:00:00') victory_weekend ON victory_weekend.churchid=church.churchid
                LEFT JOIN (SELECT count(user_journey.church_community) as church_community_count,user_journey.church_community,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.church_community <> '0000-00-00 00:00:00') church_community ON church_community.churchid=church.churchid
                LEFT JOIN (SELECT count(user_journey.purple_book) as purple_book_count,user_journey.purple_book,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.purple_book <> '0000-00-00 00:00:00') purple_book ON purple_book.churchid=church.churchid
                LEFT JOIN (SELECT count(user_journey.making_disciples) as making_disciples_count,user_journey.making_disciples,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.making_disciples <> '0000-00-00 00:00:00') making_disciples ON making_disciples.churchid=church.churchid
                LEFT JOIN (SELECT count(user_journey.empowering_leaders) as empowering_leaders_count,user_journey.empowering_leaders,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.empowering_leaders <> '0000-00-00 00:00:00') empowering_leaders ON empowering_leaders.churchid=church.churchid
                LEFT JOIN (SELECT count(user_journey.leadership_113) as leadership_113_count,user_journey.leadership_113,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.leadership_113 <> '0000-00-00 00:00:00') leadership_113 ON leadership_113.churchid=church.churchid
                LEFT JOIN (SELECT count(user_journey.baptized) as baptized_count,user_journey.baptized,user.churchid FROM user INNER JOIN user_journey ON user.userid=user_journey.userid WHERE user_journey.baptized='1') baptized ON baptized.churchid=church.churchid ";
    }
}
