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
}