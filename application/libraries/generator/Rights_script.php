<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 10/10/2019
 * Time: 6:55 PM
 */
class Rights_script {
    public static $instance;public static $app_get;
    function __construct() {
        self::$instance = &get_instance();self::$app_get=self::$instance->data_app_get;
    }
    function pagecontrol(){
        return "SELECT page_control.pagecontrolid,page.code,page_control_rights.userid
                FROM page_control 
                INNER JOIN page_control_rights ON page_control_rights.pagecontrolid=page_control.pagecontrolid
                INNER JOIN page_control_collection ON page_control_collection.pagecontrolid=page_control.pagecontrolid AND page_control.profileid=0
                INNER JOIN page ON page.pageid=page_control_collection.pageid ";
    }
    function profilecontrol(){
        return "SELECT page_control.pagecontrolid,page_control_collection.pageid 
                FROM page_control
                INNER JOIN page_control_collection ON page_control_collection.pagecontrolid=page_control.pagecontrolid
                INNER JOIN page ON page.pageid=page_control_collection.pageid
                LEFT JOIN user ON user.profileid=page_control.profileid 
                WHERE user.userid=".self::$app_get->idCurrentUser()." ";
    }
}