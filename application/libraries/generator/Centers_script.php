<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 12/28/2018
 * Time: 5:08 PM
 */
class Centers_Script {
     public static $export_condition = false;
     public static $instance;
     function __construct()
     {
          // Assign by reference with "&" so we don't create a copy
          self::$instance = &get_instance();
     }
    public static function getcenters(){
        return "SELECT 
               SQL_CALC_FOUND_ROWS church.name, church.churchid as id, church.location,
               church.churchadminid as adminid,
               church_admin.userid as churchadmin_userid,
               user.firstname as churchadmin_firstname, user.lastname as churchadmin_lastname,
               IF(user.firstname is null,user.email,CONCAT(user.firstname,' ',user.lastname))  as churchadmin_fullname,
               user_photo.photo as churchadmin_photo, user.email as churchadmin_email
               FROM church
               LEFT JOIN church_admin ON church_admin.churchadminid=church.churchadminid AND church.churchid=church_admin.churchid
               LEFT JOIN user ON user.userid=church_admin.userid
               LEFT JOIN user_photo ON user_photo.photoid=user.photoid ";
    }
}