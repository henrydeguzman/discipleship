<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 7:37 PM
 */
class Churchcommunity_script {
    public static $instance;
    function __construct(){self::$instance = &get_instance();}
    public static function getdates(){
        return "SELECT a.churchcommunityid as id,a.churchcommunity_date as `date`, a.total FROM development_churchcommunity_dates a ";
    }
    public static function getchurchcommunitylist($churchcommunityid){
        if(!$churchcommunityid){ return 'invalid_token'; }
        return "SELECT development_weekend.devweekendid,development_weekend.userid,development_weekend.weekendid,
                development_churchcommunity_dates.churchcommunityid,
                user.firstname, user.lastname, user_photo.photo
                FROM development_weekend 
                INNER JOIN development_weekend_dates ON development_weekend.weekendid=development_weekend_dates.weekendid
                INNER JOIN user ON user.userid=development_weekend.userid
                LEFT JOIN user_photo ON user_photo.userid=user.userid
                LEFT JOIN development_churchcommunity ON development_weekend.userid=development_churchcommunity.userid
                LEFT JOIN development_churchcommunity_dates ON development_churchcommunity_dates.churchcommunityid=$churchcommunityid
                WHERE development_churchcommunity.userid IS NULL ";
    }
}