<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 10:07 PM
 */
class Purplebook_script {
    public static $instance;
    function __construct(){self::$instance = &get_instance();}
    public static function getdates(){
        return "SELECT a.purplebookid as id,a.purplebook_date as `date`, a.total FROM development_purplebook_dates a ";
    }
    public static function getpurplebooklist($purplebookid){
        return "";
    }
}