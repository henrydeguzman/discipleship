<?php
/**
* Created by PhpStorm.
* User: Actino-Dev
* Date: 1/14/2019
* Time: 10:36 PM
*/
class Users_set extends Core_Model {
     public function __construct(){
          $this->load->library('smpt');          
     }
     /** api/gateway?re=fetch/users_set/generatepassword */
     private function generatePassword($a=5,$b='azertyuiopqsdfghjklmwxcvbnAZERTYUIOPQSDFGHJKLMWXCVBN0123456789'){
          if(empty($a)){return;} $bc=strlen($b)-1; $gen=''; for($i=0; $i < intval($a); $i++) { $h = mt_rand(1, $bc); $c = $b[$h]; $gen .= $c; }
          return $gen;
     }
     /* api/gateway?re=fetch/users_set/resetPassword */
     public function resetPassword($newPassword, $confirmPassword, $userId) {
          $this->load->model('users_connection');
          $result = $this->users_connection->getuserbyid($userId);
          if ($result) {
               if (sha1($newPassword) === sha1($confirmPassword)) {
                    $data = array(
                         'password' => sha1($newPassword)
                    );
                    $this->update('user', $data, 'userid='.$userId);
               }
          }
     }
     /** api/gateway?re=fetch/users_set/create */
     public function create($fromadmin=true){
          $userid=isset($_POST['userid'])?$_POST['userid']:0;
          $churchid=$this->data_app_get->getchurch('churchid');
          if(empty($churchid)){ return array('success'=>false,'info'=>'User center is required'); }
          $frompage=isset($_POST['frmctrl'])?$_POST['frmctrl']:null;
          $ismember=isset($_POST['ismember'])?$_POST['ismember']:0;
          if($ismember&&$frompage==='vg'){
               /** only add existing user to vg group */
               if(empty($userid)){ return array("success"=>false,"info"=>"invalid userid"); }
               return $this->setvg($userid,1);
          }
          $firstname=isset($_POST['firstname'])?$_POST['firstname']:null; if(empty($firstname)){ return array('success'=>false,'info'=>'First name is required'); }
          $lastname=isset($_POST['lastname'])?$_POST['lastname']:null; if(empty($lastname)){ return array('success'=>false,'info'=>'Last name is required'); }
          $data=array(
               "firstname"=>$firstname,
               "lastname"=>$lastname,"churchid"=>$churchid
          );$data2=array();
          
          if($fromadmin){ // add member from users admin page
               $profileid=1;
               if(empty($userid)){ /** add */
                    $gen=$this->generatePassword();
                    $data['password']=self::encrypt($gen);
               }else{ /** update */
                    
               }
               $email=isset($_POST['email'])?$_POST['email']:null;if(empty($email)){ return array('success'=>false,'info'=>'email is required'); }
               if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { return array('success'=>false,'info'=>"$email is not a valid email address"); }
               $data['email']=$email;
          }else{/** add non-member from one2one/vg page */
               $phonenumber=isset($_POST['phonenumber'])?$_POST['phonenumber']:null; if(empty($phonenumber)){ return array('success'=>false,'info'=>'Contact # is required'); }
               $address=isset($_POST['address'])?$_POST['address']:null; if(empty($address)){ return array('success'=>false,'info'=>'Address is required'); }
               $data['phonenumber']=$phonenumber;
               /** info */
               $data2['current_address']=$address;
               $profileid=2;
          }
          $data['profileid']=$profileid;
          
          
          if(empty($userid)) { /* add */
               $result=$this->insert('user',$data);
               $data2['userid']=$result['lastid'];
               $this->insert('user_info',$data2);
               if(!$fromadmin){
                    $leaderid=$this->data_app_get->idCurrentUser();
                    if($frompage==='vg'){
                         /** from vg page */
                         $this->setvg($result['lastid'],1);
                         $leaderid=0;
                    }
                    $this->insert('development_one2one',array("userid"=>$result['lastid'],"leaderid"=>$leaderid,"datecreated"=>self::datetime()));
               }
          }else {
               $result=$this->update('user',$data,'userid='.$userid);
               $this->insert('user_info',$data2,'userid='.$userid);
          }
          return $result;
     }
     private function setvg($userid,$value){
          $this->load->model('vg/vg_set','vgset');
          return $this->vgset->set_vg($userid,$value);
     }
     public function getjourney($userid=null){ /* api/gateway?re=fetch/users_set/getjourney */
          $this->script->load('users_script');
          if(empty($userid)){ $userid=$this->data_app_get->idCurrentUser(); }
          $sql=$this->users_script->getjourney()."WHERE a.userid=".$userid;
          return $this->query($sql,true);
     }
     /** api/gateway?re=fetch/users_set/setjourney */
    /* public function setjourney(){
          $userid=$this->data_app_get->idCurrentUser();
          $data=array();
          if(isset($_POST['victory_weekend'])){ $data['victory_weekend']=$_POST['victory_weekend']; }
          if(isset($_POST['church_community'])){ $data['church_community']=$_POST['church_community']; }
          if(isset($_POST['purple_book'])){ $data['purple_book']=$_POST['purple_book']; }
          if(isset($_POST['making_disciples'])){ $data['making_disciples']=$_POST['making_disciples']; }
          if(isset($_POST['empowering_leaders'])){ $data['empowering_leaders']=$_POST['empowering_leaders']; }
          if(isset($_POST['leadership_113'])){ $data['leadership_113']=$_POST['leadership_113']; }
          if(isset($_POST['baptized'])){ $data['baptized']=$_POST['baptized']; }
          $journey=$this->getjourney($userid);
          if(!empty($journey)){
               return $this->update('user_journey',$data,'userid='.$userid);
          } else {
               $data['userid']=$userid;
               return $this->insert('user_journey',$data);
          }
     }*/
     /** api/gateway?re=fetch/users_set/verifytomember */
     public function verifytomember($userid,$email){
         $result=self::edit($userid,'tomember');
         if(!empty($email)){
             /** TODO mobile text for credentials */
             $result['email']=self::sendemail($result['password'],$email);
         } else { $result['email']='empty email!'; }
         return $result;
     }
     private function sendemail($password,$email=null){          
          $searchNeedle = array(
               '{{ Mail::Title }}',
               '{{ Mail::Recepient }}',               
               '{{ Mail::Sender }}',
               '{{ Mail::Team }}',
               '{{ Mail::CopyrightYear }}',
               '{{ Mail::OTP }}'
          );
          $replaceStack = array(
               'Account created',
               $email,               
               ORG_TEAM_NAME,
               ORG_TEAM_NAME,
               date('Y'),
               $password
          );
          $bodyhtml=file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/html/new-account.html');
          $altbody=file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/plaintext/new-account.txt');              
          /*
          * ishtml = boolean; default: false
          * body = string|html; default: 'Who knows?'
          * subject = string; default: 'Test subject'
          * */
          return $this->smpt->send(array("body"=>str_replace($searchNeedle, $replaceStack, $bodyhtml),"alt"=>str_replace($searchNeedle, $replaceStack, $bodyhtml),
          "recipient"=>$email, "subject"=>ORG_TEAM_NAME." created you an account!", "ishtml"=>true ));   
     }
     /** api/gateway?re=fetch/users_set/edit */
     public function edit($id=null,$savetype='default'){
          /**
          * Fill password
          * profileid from nonmember(2) to member(1)
          */
          $id=empty($id)?$_POST['id']:$id;
          $savetype=empty($savetype)?$_POST['savetype']:$savetype;
          if(empty($id)){ return array("success"=>false,"info"=>"id is required!"); }
          $gen=null;
          if($savetype==='tomember'){
               $gen=$this->generatePassword();               
               $data=array(
                    "password"=>sha1($gen),
                    "profileid"=>1,
                    "datecreated"=>self::datetime()
               );
          }
          else{
               $data=array();
               $data=$this->_isset($data,'email');
          }
          
          $result=$this->update('user',$data,'userid='.$id);
          if($gen!==null){$result['password']=$gen;}          
          return $result;
     }
}