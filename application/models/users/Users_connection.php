<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/14/2019
 * Time: 09:45 PM
 */
class Users_connection extends Core_Model {
    public function __construct() { }
    public function signout(){
        $destroy=session_destroy();
        return array('success'=>true,'info'=>$destroy);
    }
    /** api/gateway?re=fetch/users_connection/verify */
    public function verify(){
        /* users profile eligible: 1=member;3=admin;4=super admin */
        $email=isset($_POST['email'])?$_POST['email']:null; if(empty($email)){ return array("success"=>false,'info'=>'email is required'); }
        $password=isset($_POST['password'])?$_POST['password']:null; if(empty($password)){ return array("success"=>false,'info'=>'password is required'); }
        $sql="SELECT a.username,a.email,a.firstname,a.userid,a.lastname,a.middlename,photo,a.datecreated,c.churchid,c.name as churchname,a.profileid FROM `user` a
            LEFT JOIN church c ON c.churchid=a.churchid
            LEFT JOIN user_photo b ON a.userid=b.userid AND a.photoid=b.photoid WHERE a.profileid in (1,3,4) AND a.password='".self::encrypt($password)."' AND a.email='".$email."'";
        $result=self::query($sql,true);
        if($result){ $session=self::creatingsession($result); return array('success'=>$result,'info'=>'Creating session...','session'=>$session); }
        else { return array('success'=>false,'info'=>'Invalid credentials'); }
    }
    private function creatingsession($data){ $_SESSION['user']=$data; }
    /** api/gateway?re=fetch/users_connection/viewsession */
    public function viewsession(){
        return $_SESSION['user'];
    }
}