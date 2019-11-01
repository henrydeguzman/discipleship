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
          //$this->template->load('.html', array(), 'emails/invites/users/thankyou.html');return;          
          $result = $this->emailtoken->isvalid(); 
         // var_dump($result);return;        
          if ($result['success']) {               
               // create account
               $email = $result['aud'];
               $type_arr = explode('-', $result['sub']);
               $type = isset($type_arr[3]) ? $type_arr[3] : null;
               $inviteid = isset($type_arr[0]) ? $type_arr[0] : null;
               /** validate if the link is already used */
               $validlink = $this->users_get->validateinvite($inviteid);
               // var_dump($validlink->inviteid); return;
               if(!$validlink) {
                    $this->load->view('templates/emails/invites/tokenused.html', array('loginurl' => base_url(), 'title' => 'Invalid!'));
                    return; 
               }
               switch ($type) {
                         /** invites user as member in church inviter */
                    case "member":
                         /** create user invites */
                         $churchid = isset($type_arr[4]) ? $type_arr[4] : null;
                         //echo $churchid;return;
                         $_POST = array(
                              "profileid" => 1, /** user profile => member */
                              "email" => $email,
                              "churchid" => $churchid
                         );
                        // var_dump($_POST);return;
                         $createuser = $this->users_set->create('invites');  
                         if(!$createuser['success']) {
                            //  var_dump($createuser);
                              echo 'Error on creating user! Please report this to ' . ORG_TEAM_NAME; return;
                         } else { /** success */
                              $this->users_set->userinviteupdate($validlink->inviteid, $createuser['lastid']);
                              $this->load->view('templates/emails/invites/verified.html', array('loginurl' => base_url(),'title'=> 'Successfully Verified!'));
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
                                   $this->load->view('templates/emails/invites/verified.html', array('loginurl' => base_url(), 'title' => 'Thank you for accepting our request!'));                                
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
               $this->load->view('templates/emails/invites/tokenexpired.html', array('title' => 'Invalid!'));
          }
     }  
}
