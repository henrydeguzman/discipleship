<?php 
/** 
* Created by VSCODE
* User : Henrilics
* Date : 10/22/2019, 10:34:06 PM
*/
class Register extends Core_Controller {
     public function __construct()
     {          
          parent::__construct();
          $this->load->model('email/email_verify', 'emailverify');
     }
     public function guest(){
         $result = $this->emailverify->invite();         
         if($result['success']) {
              // create account
              $email = $result['aud'];
              $type = explode('-', $result['sub']);              
              $type = isset($type[4])?$type[4]:null;
              switch ($type) {
                   case "member": /** invites user as member in church inviter */
                   break;
                   case "admin": /** invites user as admin of the center. */
                   break;
              }

         } else {
              $info = $result['info'];
              // error page
         }
     }
}