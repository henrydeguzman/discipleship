<?php

/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/14/2019
 * Time: 04:43 PM
 */
class Centers_set extends Core_Model
{
     public function __construct() {
          $this->load->model('email/email_validation', 'emailvalidation');
          $this->load->model('users/users_set', 'users_set');
          $this->script->load('users_script');
     }
     /** api/gateway?re=fetch/centers_set/invite */
     public function invite(){
          if (!isset($_POST['churchid'])) { return array("success" => false, 'info' => 'Church is required!'); }
          $email =isset($_POST['email'])? $_POST['email']: null; if(empty($email)) { return array("success" => false, 'info' => 'Email address is required!'); }
          $exist = isset($_POST['exist'])? $_POST['exist'] : null;
          $user = 0;          
          if($exist<1) {
               $validate = $this->emailvalidation->isexist($email);
               if (!$validate['success']) { return $validate; }
          } else {
               /** find user via email */
               $sql = $this->users_script->getbyemail() . " WHERE user.email='" . $email . "'";
               $user = $this->query($sql, true);
               if(!$user){ return array('success'=> false, 'info' => 'can\'t find user! Please report this error.' ); }               
          }          
          

          /** static required values for inserting invite */
          $_POST['typeid'] = 1; /** email type */
          $_POST['inviteasid'] = 1; /** as administrator */
          $result = $this->users_set->createinvite();
          

          /** create tokens and send email */
          $result['email'] = self::sendemail($email, $user, $result['lastid'], $_POST['churchname']);
          return $result;          
     }
     /** if user is not 0 = existing, else new user */
     private function sendemail($email, $user=0, $inviteid=null, $churchname) {
          $church = isset($_POST['churchid']) ? $_POST['churchid'] : 0;
          if (empty($church)) { return array("success" => false, 'info' => 'Church is required!'); }         
          if (empty($inviteid)) { return array("success" => false, 'info' => 'inviteid is required!'); }
          $recepient = $user==0? $email : $user->firstname == null || $user->firstname === "" ? $email : $user->firstname ;
          $userid = 0;
          if ($user == 0) {
               $subject_cat = 'new';
               $template = 'new-email-user.html';
          } else {
               $subject_cat = 'existing';
               $template = 'existing-user.html';
               $userid = $user->userid;
          }
          $subject = $inviteid.'-subject-invite-admin-'. $subject_cat .'-'. $church . '-' . $userid;
          /** token 1 day validity */
          $token = $this->tokenizer->create($email, self::SECRETKEY, 86400, $subject);
          $sender = $this->data_app_get->getCurrentUname();
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
               'Account Invitation',
               $recepient,
               $churchname,
               $sender,
               ORG_TEAM_NAME,
               date('Y'),
               base_url("register/guest?token=".$token)
          );
          $bodyhtml = file_get_contents(PATH_TEMPLATES_EMAIL . 'invites/admin/html/'. $template);
          $altbody = file_get_contents(PATH_TEMPLATES_EMAIL . 'invites/admin/html/'. $template);
          /*
          * ishtml = boolean; default: false
          * body = string|html; default: 'Who knows?'
          * subject = string; default: 'Test subject'
          * */
          try {
               $result = $this->smpt->send(array(
                    "body" => str_replace($searchNeedle, $replaceStack, $bodyhtml), "alt" => str_replace($searchNeedle, $replaceStack, $bodyhtml),
                    "recipient" => $email, "subject" => "Access invitation!", "ishtml" => true
               ));
          } catch (Exception $a) {
               $result = array('success' => false, 'info' => $a->getMessage());
          }
          return $result;
     }
     /** api/gateway?re=fetch/centers_set/create */
     public function create()
     {
          $id = isset($_POST['id']) ? $_POST['id'] : 0;
          $name = isset($_POST['name']) ? $_POST['name'] : null;
          if (empty($name)) {
               return array("success" => false, "info" => "Name is required");
          }
          $location = isset($_POST['location']) ? $_POST['location'] : null;
          if (empty($location)) {
               return array("success" => false, "info" => "Location is required");
          }
          $data = array(
               "location" => $location,
               "name" => $name
          );
          if (empty($id)) {
               /* weekend_settings */
               $result = $this->insert('church', $data);
               $this->insert('weekend_settings', array("churchid" => $result['lastid']));
               return $result;
          } else {
               return $this->update('church', $data, 'churchid=' . $id);
          }
     }
     /** add user as church admin */
     public function addchurchadmin($churchid=null, $userid=null) {
          if (empty($churchid)) { return array('success' => false, 'info' => 'churchid is required'); }
          if (empty($userid)) { return array('success' => false, 'info' => 'userid is required'); }
          $result = $this->insert('church_admin', array("churchid" => $churchid, "datecreated" => $this->datetime(), "userid" => $userid));
          $this->update('church', array('churchadminid' => $result['lastid']), 'churchid='. $churchid);
          return $result;
     }
}
