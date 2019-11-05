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
          $churchid = self::$instance->data_app_get->getchurch('churchid');

        return "SELECT 
                user.firstname, user.lastname, user_photo.photo, 
                development_empleaders_dates.empleadersid, development_empleaders.devempleadersid
                FROM development_empleaders
                LEFT JOIN development_empleaders_dates ON '$empleadersid'=development_empleaders_dates.empleadersid
                LEFT JOIN user ON user.userid=development_empleaders.userid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid
                WHERE development_empleaders.empleadersid = 0 AND user.churchid='$churchid' ";
    }
}