<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 10:07 PM
 */
class Purplebook_script {
    public static $instance;
    function __construct(){
        self::$instance = &get_instance();

    }
    public static function getdates(){
        return "SELECT a.purplebookid as id,a.purplebook_date as `date`, a.total FROM development_purplebook_dates a ";
    }
    public static function candidates($purplebookid){
        if(!$purplebookid){ return 'invalid_token'; }
        return "SELECT development_churchcommunity.devchurchcommunityid,development_churchcommunity.userid,development_churchcommunity.churchcommunityid,
                development_purplebook_dates.purplebookid,
                user.firstname, user.lastname, user_photo.photo
                FROM development_churchcommunity
                INNER JOIN development_churchcommunity_dates ON development_churchcommunity.churchcommunityid=development_churchcommunity_dates.churchcommunityid
                INNER JOIN user ON user.userid=development_churchcommunity.userid
                LEFT JOIN user_photo ON user_photo.userid=user.userid
                LEFT JOIN development_purplebook ON development_purplebook.userid=development_churchcommunity.userid
                LEFT JOIN development_purplebook_dates ON development_purplebook_dates.purplebookid=$purplebookid
                WHERE development_purplebook.userid IS NULL ";
    }
}