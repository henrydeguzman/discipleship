<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 12/8/2018
 * Time: 02:43 PM
 */
class Users_Script {
    public static $export_condition=false;
    public static $instance;
    function __construct()
    {
        // Assign by reference with "&" so we don't create a copy
        self::$instance = &get_instance();
    }
    public static function getjourney(){
        return "SELECT a.userid,a.victory_weekend,a.church_community,a.purple_book,a.making_disciples,a.empowering_leaders,a.leadership_113,a.baptized FROM user_journey a ";
    }
    public static function getusers($activefields=null){
        $condition=array(
            "onfields"=>array(
                "info"=>"a.personal_number,a.current_address as address,a.degree,c.vgid",
            ),
            "onjoins"=>array(
                "info"=>"LEFT JOIN user_info a ON x.userid=a.userid LEFT JOIN user_vg c ON c.leaderid=x.userid",
            )
        );
        if(self::$export_condition){return $condition;}
        $dynamic=self::$instance->control->fieldRelationalMapper($condition,$activefields);
        return "SELECT SQL_CALC_FOUND_ROWS x.userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
         x.phonenumber,subx.photo, x.email,subxa.name as churchname, ".$dynamic['fields']." 
        FROM user x LEFT JOIN user_photo subx ON x.photoid=subx.photoid AND x.userid=subx.userid LEFT JOIN church subxa ON subxa.churchid=x.churchid ".$dynamic['joins']." ";
    }
}