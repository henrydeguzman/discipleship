<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 2/16/2019
 * Time: 04:37 PM
 */
class Vg_Script {
    public static $instance;
    function __construct()
    {
        // Assign by reference with "&" so we don't create a copy
        self::$instance = &get_instance();
    }
    public static function vginfo(){
        return "SELECT a.vgid,b.dayoftheweek,b.time,b.venue FROM user_vg a LEFT JOIN user_vg_info b ON a.vgid=b.vgid ";
    }
    public static function getvglist($activefields=null){
        self::$instance->script->load('users_script');
        $app_get=self::$instance->data_app_get;
        $user= self::$instance->users_script;
        $user::$export_condition=true;
        $mainscript=$user->getusers();
        $onfields=array_merge(array(
            "mainlink"=>"x_photo.photo, x.userid as userid,x.firstname, x.email,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
                        x.phonenumber",
            "vg_intern"=>"user_vg_intern.internid as isintern, user_vg_intern.internid, user_vg_intern.statusid as internstatusid"
        ),$mainscript['onfields']);
        $onjoins=array_merge(array(
            "mainlink"=>"INNER JOIN user_vg_users uxx ON uxx.vgid=xx.vgid LEFT JOIN user x ON x.userid=uxx.userid LEFT JOIN user_photo x_photo ON x_photo.photoid=x.photoid",
            "vg_intern"=>"LEFT JOIN user_vg_intern user_vg_intern ON user_vg_intern.userid=uxx.userid"
        ),$mainscript['onjoins']);
        $condition= array("onfields"=>$onfields,"onjoins"=>$onjoins);
        $dynamic=self::$instance->control->fieldRelationalMapper($condition,$activefields);
        return "SELECT xx.vgid, xx.dateadded, ".$dynamic['fields']." FROM user_vg xx ".$dynamic['joins']." ";
    }
    public static function getnovg(){
        $app_get=self::$instance->data_app_get;
          $churchid = $app_get->getchurch('churchid');
        return "SELECT a.userid,a.firstname,a.lastname, CONCAT(a.firstname,' ',a.lastname) as fullname, a.email FROM user a 
                LEFT JOIN user_vg_users b ON a.userid=b.userid WHERE a.churchid='$churchid' AND b.userid IS NULL AND a.userid <> ".$app_get->idCurrentUser();
    }
    public static function getothrvgs(){
        return "SELECT a.vgid FROM user_vg_users a LEFT JOIN user_vg b ON b.vgid=a.vgid ";
    }
}