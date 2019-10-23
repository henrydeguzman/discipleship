<?php 
/** 
* Created by VSCODE
* User : Henrilics
* Date : 10/22/2019, 10:29:28 PM
*/
class Email_verify extends Core_Model {
     CONST TOKEN_INVALID = 1;
     CONST TOKEN_EXPIRED = 2;     
     public function __construct()
     {
          parent::__construct();
     }
     /** api/gateway?re=fetch/email_verify/invite
      * 1 day validity
      */
     public function invite(){
          $token = isset($_GET['token'])? $_GET['token']:null; if(empty($token)) { return array('success' => false, 'errorcode' => self::TOKEN_INVALID, 'info' => 'Invalid token!'); }
          return $this->tokenizer->validate($token, self::SECRETKEY);
     }
     /** api/gateway?re=fetch/email_verify/temp */
     public function temp(){
          return $this->tokenizer->create('henrydeguzman.73@gmail.com', self::SECRETKEY, 86400, 'tokenizer-subject-invite-member');
     }
}