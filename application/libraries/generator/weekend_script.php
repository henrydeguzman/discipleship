<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:16
 */
class weekend_script {
    public static $instance;
    function __construct(){self::$instance = &get_instance();}
    public static function getdates(){
        return "SELECT a.weekend_dateid,a.weekend_date as `date` FROM weekend_dates a";
    }

}
