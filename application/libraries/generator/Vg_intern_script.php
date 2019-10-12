<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 12/09/2019
 * Time: 7:27 PM
 */
class Vg_intern_script {
    public static $instance;
    public static $app_get;
    function __construct(){
        self::$instance = &get_instance();
        self::$app_get=self::$instance->data_app_get;
    }
    function getinfo(){
        return "SELECT user_vg_intern.internid FROM user_vg_intern user_vg_intern LEFT JOIN user_vg_intern_status user_vg_intern_status ON user_vg_intern.statusid=user_vg_intern_status.statusid ";
    }
    function getlist(){
        return "SELECT user_vg_intern.internid, user_vg_intern.vgid,user_vg_intern.userid,
                user.firstname, user.lastname, user_photo.photo,
                a.firstname as leader_firstname, a.lastname as leader_lastname, b.photo as leader_photo,a.userid as leaderid 
                FROM user_vg_intern
                INNER JOIN user_vg ON user_vg_intern.vgid=user_vg.vgid
                INNER JOIN user a ON a.userid=user_vg.leaderid
                LEFT JOIN user_photo b ON b.photoid=a.photoid
                INNER JOIN user ON user.userid=user_vg_intern.userid
                LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}