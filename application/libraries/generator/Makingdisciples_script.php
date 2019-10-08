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
    public static function getmakingdiscipleslist($makingdisciplesid){
        return "";
    }
}