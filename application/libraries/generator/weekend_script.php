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
    public static function getvweekendlist(){
        $churchid=self::$instance->data_app_get->getchurch('churchid');
        return "SELECT a.userid as id, a.firstname, a.lastname FROM user a 
                LEFT JOIN one2one b ON a.userid=b.userid 
                LEFT JOIN weekend_settings c ON c.churchid=$churchid
                WHERE a.profileid=2 AND b.chapter=c.chapterid";
    }
}
