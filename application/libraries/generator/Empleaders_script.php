<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 9:59 PM
 */
class Empleaders_script {
    public static $instance;
    function __construct(){self::$instance = &get_instance();}
    public static function getdates(){
        return "SELECT a.empleadersid as id,a.empleaders_date as `date`, a.total FROM development_empleaders_dates a ";
    }
    public static function candidates($empleadersid){
        if(!$empleadersid){ return 'invalid_token'; }
        return "SELECT development_makingdisciples.makingdisciplesid,development_makingdisciples.userid,development_makingdisciples.devmakingdisciplesid,
                development_empleaders_dates.empleadersid,
                user.firstname, user.lastname, user_photo.photo
                FROM development_makingdisciples 
                INNER JOIN development_makingdisciples_dates ON development_makingdisciples.makingdisciplesid=.development_makingdisciples_dates.makingdisciplesid
                INNER JOIN user ON user.userid=development_makingdisciples.userid
                LEFT JOIN user_photo ON user_photo.userid=user.userid
                LEFT JOIN development_empleaders ON development_empleaders.userid=development_makingdisciples.userid
                LEFT JOIN development_empleaders_dates ON development_empleaders_dates.empleadersid=$empleadersid
                WHERE development_empleaders.userid IS NULL ";
    }
    public static function postlist(){
        return "SELECT development_empleaders.devempleadersid,development_empleaders.userid, user.firstname, user.lastname,user_photo.photo,
                development_empleaders_dates.empleaders_date as date,user_lifestatus.name as lifestatus
                FROM development_empleaders
                INNER JOIN development_empleaders_dates ON development_empleaders.empleadersid=development_empleaders_dates.empleadersid
                LEFT JOIN user ON development_empleaders.userid=user.userid
                LEFT JOIN user_lifestatus ON user_lifestatus.statusid=user.statusid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}