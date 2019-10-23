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
    /*public static function getjourney(){
        return "SELECT a.userid,a.victory_weekend,a.church_community,a.purple_book,a.making_disciples,a.empowering_leaders,a.leadership_113,a.baptized FROM user_journey a ";
    }*/
    public static function inviteslist() {     
         return "SELECT 
         TIMESTAMPDIFF(MINUTE,user_invites.datecreated, now()) as time_minutes,
         TIMESTAMPDIFF(HOUR,user_invites.datecreated, now()) as time_hours,
         user_invites_type.name as `type`,user_invites.email, user_invites.phonenumber, user_invites.datecreated as `date`, user_invites.isverified
         FROM user_invites
               LEFT JOIN user_invites_type ON user_invites.typeid = user_invites_type.typeid ";
    }
    public static function getbyemail(){
         return "SELECT user.email, user.username, user.firstname, user.lastname, user.userid,
               IF(user.firstname is null,user.email,CONCAT(user.firstname,' ',user.lastname))  as fullname,
               user_photo.photo
               FROM user 
               LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
    public static function getusers($activefields=null){
        $condition=array(
            "onfields"=>array(
                "info"=>"a.personal_number,a.current_address as address,a.degree",
                "vg"=>"c.vgid",
                "usertype"=>"user_profile.name as usertype"
            ),
            "onjoins"=>array(
                "info"=>"LEFT JOIN user_info a ON x.userid=a.userid",
                "vg"=>"LEFT JOIN user_vg c ON c.leaderid=x.userid",
                "usertype"=>"LEFT JOIN user_profile ON user_profile.profileid=x.profileid"
            )
        );
        if(self::$export_condition){return $condition;}
        $dynamic=self::$instance->control->fieldRelationalMapper($condition,$activefields);
        return "SELECT SQL_CALC_FOUND_ROWS x.userid,x.firstname,x.lastname,x.lastname,concat(IFNULL(x.firstname,''),' ',IFNULL(x.middlename,''),' ',IFNULL(x.lastname,'')) as fullname,
         x.phonenumber,subx.photo, x.email,subxa.name as churchname, ".$dynamic['fields']." 
        FROM user x LEFT JOIN user_photo subx ON x.photoid=subx.photoid AND x.userid=subx.userid LEFT JOIN church subxa ON subxa.churchid=x.churchid ".$dynamic['joins']." ";
    }
}