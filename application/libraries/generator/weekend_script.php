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
        return "SELECT a.weekendid as id,a.weekend_date as `date`, a.total FROM weekend a ";
    }
    public static function getvweekendlist($weekendid){
        /** The weekend date greater than or equal to date today and must correspond on the weekendid */
        $churchid=self::$instance->data_app_get->getchurch('churchid');
        return "SELECT a.userid as id,a.email, a.firstname, a.lastname,d.weekendid FROM user a 
                LEFT JOIN one2one b ON a.userid=b.userid 
                LEFT JOIN weekend_settings c ON c.churchid=$churchid
                LEFT JOIN weekend d ON d.weekendid=".$weekendid." AND d.weekend_date >= CURDATE() AND d.total=0
                WHERE a.profileid=2 AND b.chapter=c.chapterid";
    }
}
