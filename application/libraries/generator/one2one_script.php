<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/19/2019
 * Time: 12:55 PM
 */
class One2one_script {
    public static $instance;
    public static $app_get;
    function __construct()
    {
        // Assign by reference with "&" so we don't create a copy
        self::$instance = &get_instance();
        self::$instance->script->load('users_script');
        self::$app_get=self::$instance->data_app_get;
    }
    public static function getlist($activefields=null){
        $user= self::$instance->users_script;
        $user::$export_condition=true;
        $mainscript=$user->getusers();
        $onfields=array_merge(array(
            "mainlink"=>"x.userid as userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname, x.phonenumber,subx.photo,x.photoid",
            "vga"=>"l_b.vgid as hasvgid"
        ),$mainscript['onfields']);
        $onjoins=array_merge(array(
            "mainlink"=>"INNER JOIN user x ON x.userid=xx.userid
                        LEFT JOIN user_photo subx ON x.photoid=subx.photoid AND x.userid=subx.userid",
            "vga"=>"LEFT JOIN user_vg l_a ON l_a.leaderid=".self::$app_get->idCurrentUser()."
                  LEFT JOIN user_vg_users l_b ON l_b.vgid=l_a.vgid AND l_b.userid=x.userid"
        ),$mainscript['onjoins']);
        $condition= array("onfields"=>$onfields,"onjoins"=>$onjoins);
        $dynamic=self::$instance->control->fieldRelationalMapper($condition,$activefields);
        return "SELECT xx.o2oid, xx.chapter, ".$dynamic['fields']." FROM one2one xx ".$dynamic['joins']." ";
    }
    public static function getchapters(){
        return "SELECT a.chapterid as id, a.value as name,if(a.chapterid=b.chapterid,true,false) as active FROM one2one_chapter a
                LEFT JOIN weekend_settings b ON a.chapterid=b.chapterid AND b.churchid=".self::$app_get->getchurch('churchid');
    }
}