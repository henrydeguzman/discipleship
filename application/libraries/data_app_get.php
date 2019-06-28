<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/19/2019
 * Time: 12:19 PM
 */
class Data_App_Get {
    public static function dataCurrentUser(){
        return array(
            "userid" => $_SESSION['user']->userid,"photo" => $_SESSION['user']->photo,
            "fullname" => $_SESSION['user']->firstname.' '.$_SESSION['user']->lastname,
            "churchid" => $_SESSION['user']->churchid,"churchname"=>$_SESSION['user']->churchname,
            "profileid"=>$_SESSION['user']->profileid,
            "datecreated" => $_SESSION['user']->datecreated
        );
    }
    public static function getchurch($id=null){
        $data=self::dataCurrentUser();
        return $data[$id==null?'churchid':$id];
    }
    public static function idCurrentUser(){
        return $_SESSION['user']->userid;
    }
    public static function currentDateTime(){
        return date('Y-m-d H:i:s');
    }
    public static function currentDate(){
        return date('Y-m-d');
    }
    public static function formatDateTime($datetime,$dateformat="Y-m-d H:i:s"){
        $date= new DateTime($datetime); return $date->format($dateformat);
    }
}