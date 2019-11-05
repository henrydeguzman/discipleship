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
        $churchid = self::$instance->data_app_get->getchurch('churchid');
        return "SELECT 
                development_churchcommunity_dates.churchcommunityid,development_churchcommunity.devchurchcommunityid,
                user.firstname, user.lastname, user_photo.photo
                FROM development_churchcommunity 
                LEFT JOIN development_churchcommunity_dates ON '$churchcommunityid'=development_churchcommunity_dates.churchcommunityid
                LEFT JOIN user ON user.userid=development_churchcommunity.userid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid
                WHERE development_churchcommunity.churchcommunityid = 0 AND user.churchid='$churchid' ";
    }
    public static function postlist(){
        return "SELECT development_churchcommunity.devchurchcommunityid,development_churchcommunity.userid,user.firstname,user.lastname,user_photo.photo,
                development_churchcommunity_dates.churchcommunity_date as date, user_lifestatus.name as lifestatus
                FROM development_churchcommunity
                INNER JOIN development_churchcommunity_dates ON development_churchcommunity.churchcommunityid=development_churchcommunity_dates.churchcommunityid
                LEFT JOIN development_purplebook ON development_purplebook.userid=development_churchcommunity.userid
                LEFT JOIN user ON user.userid=development_churchcommunity.userid
                LEFT JOIN user_lifestatus ON user_lifestatus.statusid=user.statusid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}