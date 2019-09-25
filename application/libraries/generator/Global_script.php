<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 25/09/2019
 * Time: 7:43 AM
 */
class Global_script {
    public static $instance;
    public static $app_get;
    function __construct(){
        self::$instance = &get_instance();
        self::$app_get=self::$instance->data_app_get;
    }
    public static function getlifestatus(){
        return "SELECT user_lifestatus.statusid as id,user_lifestatus.name FROM user_lifestatus ";
    }
    public static function getcenters(){
        return "SELECT church.churchid as id,church.name FROM church ";
    }
}