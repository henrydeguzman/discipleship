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
          $this->load->model('email/email_validation', 'emailvalidation');                 
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
     public function create($creationtype=null){
          //return $_POST['email'];       
          $userid=isset($_POST['userid'])?$_POST['userid']:0;

          $churchid=$this->data_app_get->getchurch('churchid');
          if(isset($_POST['churchid'])) { $churchid = $_POST['churchid']; }
          if(empty($churchid)){ return array('success'=>false,'info'=>'User center is required'); }

          $frompage=isset($_POST['frmctrl'])?$_POST['frmctrl']:null;

          $ismember=isset($_POST['ismember'])?$_POST['ismember']:0;
          if($ismember&&$frompage==='vg'){ // review
               /** only add existing user to vg group */
               if(empty($userid)){ return array("success"=>false,"info"=>"invalid userid"); }
               return $this->setvg($userid,1);
          }



          // if($fromadmin){ // add member from users admin page
          //      $profileid=1;
          //      if(empty($userid)){ /** add */
          //           $gen=$this->generatePassword();
          //           $data['password']=self::encrypt($gen);
          //      }else{ /** update */

          //      }
          //      $email=isset($_POST['email'])?$_POST['email']:null;if(empty($email)){ return array('success'=>false,'info'=>'email is required'); }
          //      if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { return array('success'=>false,'info'=>"$email is not a valid email address"); }
          //      $data['email']=$email;
          // }
          $data2 = array();
          if($creationtype == 'invites') {
               /** requires fields
                * 1. profileid
                * 2. email
                */
               $gen = $this->generatePassword();
               $data['password']=self::encrypt($gen);
               $email = isset($_POST['email']) ? $_POST['email'] : null;
               if (empty($email)) { return array('success' => false, 'info' => 'Email address is required'); }
               $profileid = isset($_POST['profileid']) ? $_POST['profileid'] : null;
               if (empty($profileid)) { return array('success' => false, 'info' => 'Profileid is required'); }
               /** validate email if exist */
               //return $_POST['email'];
               $validate = $this->emailvalidation->isexist($_POST['email']);               
               if (!$validate['success']) { return $validate; }
               $data['profileid'] = $profileid;
               $data['datecreated'] = $this->datetime();
               $data['churchid'] = $churchid;
               $data['email'] = $email;
          }
          else{/** add non-member from one2one/vg page */
               $firstname = isset($_POST['firstname']) ? $_POST['firstname'] : null;
               if (empty($firstname)) { return array('success' => false, 'info' => 'First name is required'); }
               $lastname = isset($_POST['lastname']) ? $_POST['lastname'] : null;
               if (empty($lastname)) { return array('success' => false, 'info' => 'Last name is required'); }
               $data = array(
                    "firstname" => $firstname,
                    "lastname" => $lastname, "churchid" => $churchid
               );

               $phonenumber=isset($_POST['phonenumber'])?$_POST['phonenumber']:null; if(empty($phonenumber)){ return array('success'=>false,'info'=>'Contact # is required'); }
               $address=isset($_POST['address'])?$_POST['address']:null; if(empty($address)){ return array('success'=>false,'info'=>'Address is required'); }
               $data['phonenumber']=$phonenumber;
               /** info */
               $data2['current_address']=$address;
               $data['profileid']=2;
          }          
          
          
          if(empty($userid)) { /* add */
               $result=$this->insert('user',$data);
               $data2['userid']=$result['lastid'];
               $this->insert('user_info',$data2);               
               $leaderid = 0;
               if ($frompage === 'vg') {
                    /** from vg page */
                    $this->setvg($result['lastid'], 1);                    
               } else if($frompage === 'one2one') {
                    /** from one2one page */
                    $leaderid = $this->data_app_get->idCurrentUser();
               }
               $this->insert('development_one2one', array("userid" => $result['lastid'], "leaderid" => $leaderid, "datecreated" => self::datetime()));

          }else {
               //$result=$this->update('user',$data,'userid='.$userid);
               //$this->insert('user_info',$data2,'userid='.$userid);
          }

          /** send emails */
          if($creationtype === 'invites') {
               $result['email'] = self::sendemail($gen, $email);
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
          $searchNeedle = array( '{{ Mail::Title }}', '{{ Mail::Recepient }}', '{{ Mail::Sender }}', '{{ Mail::Team }}', '{{ Mail::CopyrightYear }}', '{{ Mail::OTP }}' );
          $replaceStack = array( 'Account created', $email, ORG_TEAM_NAME, ORG_TEAM_NAME, date('Y'), $password );
          $bodyhtml=file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/html/new-account.html');
          $altbody=file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/plaintext/new-account.txt');              
          /*
          * ishtml = boolean; default: false
          * body = string|html; default: 'Who knows?'
          * subject = string; default: 'Test subject'
          * */
          try {
              $result= $this->smpt->send(array("body"=>str_replace($searchNeedle, $replaceStack, $bodyhtml),"alt"=>str_replace($searchNeedle, $replaceStack, $altbody),
                  "recipient"=>$email, "subject"=>ORG_TEAM_NAME." created you an account!", "ishtml"=>true ));
          } catch (Exception $a) { $result = array('success'=> false,'info'=>$a->getMessage()); } return $result;
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
               $data=array( "password"=>sha1($gen), "profileid"=>1, "datecreated"=>self::datetime() );
          }
          else{              
               if(!isset($_POST['email'])){ return array("success"=> false, 'info' => 'Email address is required!'); }
               $validate = $this->emailvalidation->isexist($_POST['email']);               
               if(!$validate['success']) { return $validate; }
               $data=array();
               $data=$this->_isset($data,'email');
          }          
          $result=$this->update('user',$data,'userid='.$id);
          if($gen!==null){$result['password']=$gen;}          
          return $result;
     }
     private function sendemail_invites($email, $inviteid = null) {
          // TODOTHIS: $this->tokenizer->create($email, self::SECRETKEY, 86400, 'tokenizer-subject-invite-member');
          $churchid = isset($_POST['churchid']) ? $_POST['churchid'] : 0;
          if (empty($churchid)) { return array("success" => false, 'info' => 'Church is required!'); }
          if (empty($inviteid)) { return array("success" => false, 'info' => 'inviteid is required!'); } 
          $churchname = $this->data_app_get->getchurch('churchname');

          $subject = $inviteid . '-subject-invite-member-' . $churchid;

          $token = $this->tokenizer->create($email, self::SECRETKEY, 86400, $subject);
          $searchNeedle = array(
               '{{ Mail::Title }}',
               '{{ Mail::Recepient }}',
               '{{ Mail::Church }}',
               '{{ Mail::Sender }}',
               '{{ Mail::Team }}',
               '{{ Mail::CopyrightYear }}',
               '{{ Mail::JSONToken }}'         
          );
          $replaceStack = array(
               'Account Verification',
               $email,
               $churchname,
               ORG_TEAM_NAME,
               ORG_TEAM_NAME,
               date('Y'),
               base_url("register/guest?token=" . $token)
          );
          $bodyhtml = file_get_contents(PATH_TEMPLATES_EMAIL . 'invites/users/html/new-email-user.html');
          $altbody = file_get_contents(PATH_TEMPLATES_EMAIL . 'invites/users/html/new-email-user.html');
          /*
          * ishtml = boolean; default: false
          * body = string|html; default: 'Who knows?'
          * subject = string; default: 'Test subject'
          * */
          try {
               $result = $this->smpt->send(array(
                    "body" => str_replace($searchNeedle, $replaceStack, $bodyhtml), "alt" => str_replace($searchNeedle, $replaceStack, $bodyhtml),
                    "recipient" => $email, "subject" => ORG_TEAM_NAME . " send you verification!", "ishtml" => true
               ));
          } catch (Exception $a) {
               $result = array('success' => false, 'info' => $a->getMessage());
          }
          return $result;
     }
     /** api/gateway?re=fetch/users_set/invites */
     public function invites(){
          //$data = isset($_POST['users'])?$_POST['users']:null;
          //if(empty($data)){ return array('success'=>false, 'info'=> 'empty data!'); }
          //return $data;

          $rows = isset($_POST['rows']) ? $_POST['rows'] : null;
          if (empty($rows)) { return array("success" => false, "info" => "no data."); }
          $done = isset($_POST['done']) ? $_POST['done'] : array();
          $result = array();

          /** register total once. */
          $total = count($rows);
          foreach ($rows as $row) {
               $_POST = array();
               if (!in_array($row, $done)) {
                    $_POST['email'] = $row;
                    //register user
                    // insert user.
                    $_POST['churchid'] = $this->data_app_get->getchurch('churchid');
                    $_POST['typeid'] = 1; /** email type */
                    $_POST['inviteasid'] = 2; /** as member */
                    $result = self::createinvite();
                   // return $registered['lastid'];
                    // send verification email
                    if($result['success']) {                         
                         $send_email = $this->sendemail_invites($_POST['email'], $result['lastid']);   
                         if ($send_email['success']){
                              $result['update_user'] = $this->update('user_invites',array('sendemailsuccess' => 1),'inviteid='. $result['lastid']);
                         } else { $result['update_user'] = $send_email; }
                         array_push($done, $_POST['email']);
                    }                                                           
                    break;
               }
          }

          $result['done'] = $done;
          $result['successcnt'] = count($done);
          $result['total'] = $total;
          return $result;
     }
     /** api/gateway?re=fetch/users_set/createinvites 
      * This api insert new record in user_invites table with type and as admin or member invites
     */
     public function createinvite() {
          $email = isset($_POST['email'])? $_POST['email'] : null;
          $phonenumber = isset($_POST['phonenumber']) ? $_POST['phonenumber'] : null;
          if (empty($phonenumber) && empty($email)) { return array('success' => false, 'info' => 'Email address or Phonenumber is required!'); }
          $churchid = isset($_POST['churchid'])? $_POST['churchid'] : 0;
          if (empty($churchid)) { return array('success' => false, 'info' => 'church is required'); }
          $typeid = isset($_POST['typeid']) ? $_POST['typeid'] : null; if (empty($typeid)) { return array('success' => false, 'info' => 'Typeid is required!'); }
          $inviteasid = isset($_POST['inviteasid']) ? $_POST['inviteasid'] : null;
          if (empty($inviteasid)) { return array('success' => false, 'info' => 'Invite as "" is required!'); }
          return $this->insert('user_invites', array(
               "email" => $email, 
               "phonenumber" => $phonenumber,
               "datecreated" => $this->datetime(),
               "typeid" => $typeid,
               "inviteasid" => $inviteasid,
               "churchid" => $churchid
          ));
     }
     /** update record on user_invites table isverified=1 */
     public function userinviteupdate($inviteid=null,$userid=null)
     {
          if (empty($inviteid)) { return array("success" => false, 'info' => 'invalid inviteid'); }
          if (empty($userid)) { return array("success" => false, 'info' => 'invalid userid'); }
          return $this->update('user_invites', array("isverified" => 1, "userid" => $userid), 'inviteid=' . $inviteid);
     }
}