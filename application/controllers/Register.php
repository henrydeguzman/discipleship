<?php

/** 
 * Created by VSCODE
 * User : Henrilics
 * Date : 10/22/2019, 10:34:06 PM
 */
class Register extends Core_Controller
{
     public function __construct()
     {
          parent::__construct();
          $this->load->model('email/email_token', 'emailtoken');
          $this->load->model('users/users_set', 'users_set');
          $this->load->model('users/users_get', 'users_get');
          $this->load->model('centers/centers_set', 'centers_set');
     }     
     public function guest()
     {
          
          $result = $this->emailtoken->isvalid();         
          if ($result['success']) {               
               // create account
               $email = $result['aud'];
               $type_arr = explode('-', $result['sub']);
               $type = isset($type_arr[3]) ? $type_arr[3] : null;
               $inviteid = isset($type_arr[0]) ? $type_arr[0] : null;
               /** validate if the link is already used */
               $validlink = $this->users_get->validateinvite($inviteid);
               // var_dump($validlink->inviteid); return;
               if(!$validlink) { echo 'Link is already used!'; return; }                               
               switch ($type) {
                         /** invites user as member in church inviter */
                    case "member":
                         /** create user invites */
                         $_POST = array(
                              "profileid" => 1, /** user profile => member */
                              "email" => $email
                         );
                         $createuser = $this->users_set->create('invites');  
                         if(!$createuser['success']) {
                              echo 'Error on creating user! Please report this to ' . ORG_TEAM_NAME; return;
                         } else { /** success */
                              $this->users_set->userinviteupdate($validlink->inviteid, $createuser['lastid']); echo "SUCCESS";
                         }
                    return;
                         break;

                    case "admin":
                         /** invites user as admin of the center. */
                         $churchid = isset($type_arr[5]) ? $type_arr[5] : null;
                         if ($churchid < 1) {
                              echo 'Invalid church';
                              return;
                         }
                         $subtype = $type_arr[4];
                         //echo $subtype; return;                      
                         if ($subtype === 'new') {
                              $_POST = array(
                                   "churchid" => $churchid,
                                   "profileid" => 3,
                                   /** user profile => admin */
                                   "email" => $email
                              );
                              $createuser = $this->users_set->create('invites');
                              // var_dump($createuser['lastid']); return;                           
                              if (!$createuser['success']) {
                                   echo 'Error on creating user! Please report this to ' . ORG_TEAM_NAME;
                                   return;
                              } else {
                                   /** success */
                                   $this->users_set->userinviteupdate($validlink->inviteid, $createuser['lastid']);   
                                   $this->centers_set->addchurchadmin($churchid,$createuser['lastid']);
                                   /** SEND EMAIL TO SENDER TO NOTIFY HIM HIS REQUEST ALREADY ACCEPTED */

                                   echo "SUCCESS";
                              }
                         } else if ($subtype === 'existing') {
                              $userid = isset($type_arr[6]) ? $type_arr[6] : null;
                              if ($userid < 1) {
                                   echo 'can\'t find user!';
                                   return;
                              }
                         }
                         break;
               } /** end of switch */

               


          } else {
               $info = $result['info'];
               // error page
               echo 'TOKEN EXPIRED!';
          }
     }
     /** send email back to sender */
     private function sendemail()
     { }     
}
