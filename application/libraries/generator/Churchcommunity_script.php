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
        return "SELECT a.churchcommunityid as id,a.churchcommunity_date as `date`, a.total FROM development_churchcommunity_date a ";
    }
    public static function getchurchcommunitylist($churchcommunityid){
        return "";
    }
}