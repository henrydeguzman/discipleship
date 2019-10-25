<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 08/10/2019
 * Time: 9:15 PM
 */
class Makingdisciples_script {
    public static $instance;
    function __construct(){self::$instance = &get_instance();}
    public static function getdates(){
        return "SELECT a.makingdisciplesid as id,a.makingdisciples_date as `date`, a.total FROM development_makingdisciples_dates a ";
    }
    public static function candidates($makingdisciplesid){
        if(!$makingdisciplesid){ return 'invalid_token'; }
          $churchid = self::$instance->data_app_get->getchurch('churchid');
        return "SELECT development_purplebook.purplebookid,development_purplebook.userid,development_purplebook.devpurplebookid,
                development_makingdisciples_dates.makingdisciplesid,
                user.firstname, user.lastname, user_photo.photo
                FROM development_purplebook 
                INNER JOIN development_purplebook_dates ON development_purplebook.purplebookid=.development_purplebook_dates.purplebookid
                INNER JOIN user ON user.userid=development_purplebook.userid
                LEFT JOIN user_photo ON user_photo.userid=user.userid
                LEFT JOIN development_makingdisciples ON development_makingdisciples.userid=development_purplebook.userid
                LEFT JOIN development_makingdisciples_dates ON development_makingdisciples_dates.makingdisciplesid=$makingdisciplesid
                WHERE development_makingdisciples.userid IS NULL AND user.churchid='$churchid' ";
    }
    public static function postlist(){
        return "SELECT development_makingdisciples.devmakingdisciplesid,development_makingdisciples.userid, user.firstname, user.lastname,user_photo.photo,
                development_makingdisciples_dates.makingdisciples_date as date,user_lifestatus.name as lifestatus
                FROM development_makingdisciples
                INNER JOIN development_makingdisciples_dates ON development_makingdisciples.makingdisciplesid=development_makingdisciples_dates.makingdisciplesid
                LEFT JOIN user ON development_makingdisciples.userid=user.userid
                LEFT JOIN user_lifestatus ON user_lifestatus.statusid=user.statusid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}