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
          $churchid = self::$instance->data_app_get->getchurch('churchid');

        return "SELECT
                development_purplebook_dates.purplebookid, development_purplebook.devpurplebookid,
                user.firstname, user.lastname, user_photo.photo
                FROM development_purplebook
                LEFT JOIN development_purplebook_dates ON development_purplebook_dates.purplebookid='$purplebookid'
                LEFT JOIN user ON user.userid=development_purplebook.userid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid
                WHERE development_purplebook.purplebookid = 0 AND user.churchid='$churchid'";
    }
    public static function postlist(){
        return "SELECT 
                development_purplebook.devpurplebookid,development_purplebook.userid, user.firstname, user.lastname, user_photo.photo,
                development_purplebook_dates.purplebook_date as date, user_lifestatus.name as lifestatus
                FROM development_purplebook
                INNER JOIN development_purplebook_dates ON development_purplebook.purplebookid=development_purplebook_dates.purplebookid
                LEFT JOIN development_makingdisciples ON development_purplebook.userid=development_makingdisciples.userid
                LEFT JOIN user ON user.userid=development_purplebook.userid
                LEFT JOIN user_lifestatus ON user_lifestatus.statusid=user.statusid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}