<?php
/**
* Created by PhpStorm.
* User: Actino-Dev
* Date: 1/14/2019
* Time: 09:45 PM
*/
class Users_connection extends Core_Model {
     const SECRETKEY="&gqFee#e6ks7";
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
     /** api/gateway?re=fetch/users_connection/createtoken */
     public function createtoken($userid=null){
          if(empty($userid)){ return array("success"=>false,'info'=>'Invalid User'); }
          $this->load->library('tokenizer');
          $user=$this->getuserbyid($userid);
          return $this->tokenizer->create($user->email,$user->password.self::SECRETKEY);
     }
     public function getuserbyid($userID){
          $sql="SELECT user.password,user.email FROM `user` WHERE userid=".$userID;
          return self::query($sql, true);
     }
     public function validatetoken($userid=null,$token=null){
          if(empty($userid)){ return array('success'=>false,"info"=>'Invalid User'); }
          $user=$this->getuserbyid($userid);
          if($user){
               $this->load->library('tokenizer');
               $result=$this->tokenizer->validate($token,$user->password.self::SECRETKEY);
               if($result['success']&&$result['aud']!==$user->email){ $result=array("success"=>false,"info"=>"Wrong token for this email");}
               else if($result['success']&&$result['iss']!=="victory-urdaneta-discipleship"){ $result=array("success"=>false,"info"=>"Invalid token issuer."); }
               return $result;
          } else {
               return array("success"=>false,"info"=>"Sorry, we didn't find any account associated with this email.");
          }
     }
     /** api/gateway?re=fetch/users_connection/recover */
     public function recover(){
          $token=isset($_POST['token'])?$_POST['token']:null; if(empty($token)) { return array("success"=>false,"info"=>"Token is required."); }
          $userid=isset($_POST['userid'])?$_POST['userid']:null; if(empty($userid)) { return array("success"=>false,"info"=>"Token is required."); }
          $result=self::validatetoken($userid,$token);
          if($result['success']){
               $password=isset($_POST['password'])?$_POST['password']:null; if(empty($password)) { return array("success"=>false,"info"=>"New password is required."); }
               $confirm=isset($_POST['confirm'])?$_POST['confirm']:null; if(empty($confirm)) { return array("success"=>false,"info"=>"Need to confirm password."); }
               // update password;
               return $this->update('user',array('password'=>self::encrypt($password),'generatedcode'=>$password),'userid='.$userid);
          }else{return $result;}
     }
     /** api/gateway?re=fetch/users_connection/reset_password */
     public function reset_password(){
          $email=isset($_POST['email'])?$_POST['email']:null;
          if(empty($email)){ return array("success"=>false, 'info'=>'email is required'); }
          $sql="SELECT user.email,user.userid,user.password,user.firstname,user.lastname FROM `user` WHERE email='".$email."'";$result = self::query($sql, true);
          if ($result) {
               $this->load->library('smpt');
               $token = self::createtoken($result->userid);
               $searchNeedle = array(
                    '{{ Mail::Title }}','{{ Mail::Recepient }}',
                    '{{ Mail::JSONToken }}','{{ Mail::Sender }}',
                    '{{ Mail::CopyrightYear }}'
               );
               $replaceStack = array('Reset Email',$result->firstname,
               base_url('page/reset_account/'.$result->userid.'/'.$token),
               'Discipleship Team', date('Y'));
               $bodyhtml=file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/html/reset-password-email.html');
               $altbody=file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/plaintext/reset-password-email.html');
               /*return $this->smpt->send(array(
                    "body"=>"body html",
                    "alt"=>"sample alt",
                    "recipient"=>'henrydeguzman.java73@gmail.com',
                    "subject"=>'Request to reset password'
               ));*/
               return $this->smpt->send(array(
                    "body"=>str_replace($searchNeedle, $replaceStack, $bodyhtml),
                    "alt"=>str_replace($searchNeedle, $replaceStack, $bodyhtml),
                    "recipient"=>$email, "subject"=>'Request to reset password', "ishtml"=>true 
               ));
               /*
               * ishtml = boolean; default: false
               * body = string|html; default: 'Who knows?'
               * subject = string; default: 'Test subject'
               * */
          } else { return array("success"=>false, 'info'=>"Sorry, we didn't find any account associated with this email."); }
     }
}
