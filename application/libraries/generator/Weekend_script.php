<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:16
 */
class Weekend_script {
    public static $instance;
    function __construct(){self::$instance = &get_instance();}
    public static function getdates(){
        return "SELECT a.weekendid as id,a.weekend_date as `date`, a.total FROM development_weekend_dates a ";
    }
    public static function getvweekendlist($weekendid){
        /** The weekend date greater than or equal to date today and must correspond on the weekendid */
        $churchid=self::$instance->data_app_get->getchurch('churchid');
        return "SELECT a.userid as id,a.email, a.firstname, a.lastname,d.weekendid FROM user a 
                LEFT JOIN development_one2one b ON a.userid=b.userid 
                LEFT JOIN development_weekend_settings c ON c.churchid=$churchid
                LEFT JOIN development_one2one_chapter ON development_one2one_chapter.chapterid = c.chapterid
                LEFT JOIN development_weekend_dates d ON d.weekendid=".$weekendid. " AND d.weekend_date >= CURDATE() AND d.total=0
                WHERE a.profileid=2 AND b.chapter>=development_one2one_chapter.value AND a.churchid = '$churchid' ";
    }
    public static function postlist(){
        return "SELECT development_weekend.devweekendid,development_weekend.userid, user.firstname, user.lastname,user_photo.photo,
                development_weekend_dates.weekend_date as date,user_lifestatus.name as lifestatus
                FROM development_weekend
                INNER JOIN development_weekend_dates ON development_weekend.weekendid=development_weekend_dates.weekendid
                LEFT JOIN development_churchcommunity ON development_churchcommunity.userid=development_weekend.userid
                LEFT JOIN user ON development_weekend.userid=user.userid
                LEFT JOIN user_lifestatus ON user_lifestatus.statusid=user.statusid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}
