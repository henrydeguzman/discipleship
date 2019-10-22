<?php

/** 
 * Created by VSCODE
 * User : Henrilics
 * Date : 10/22/2019, 3:14:07 PM
 */
class EmailValidation extends Core_Model
{
     public function __construct()
     {
          $this->script->load('users_script');
          parent::__construct();
     }
     /** api/gateway?re=fetch/email_validation/checkemail
      * check if valid email and already exists
      */
     public function isexist()
     {
          $result = self::isvalid();          
          if ($result['success']) {
               $sql = $this->users_script->getbyemail()." WHERE user.email='". $result['email'] . "'";
               $isuser = $this->query($sql);               
               if(!$isuser) { return array('success' => true); }
               else { return array('success' => false, 'info' => 'Email already exists', 'data' => $isuser, 'errorcode' => 409); }
          }
          return $result;
     }
     /** api/gateway?re=fetch/email_validation/isvalid
      * Check email if valid or not 
      * */
     public function isvalid()
     {
          $email = isset($_REQUEST['email']) ? $_REQUEST['email'] : null;
          if (empty($email)) {
               return array('success' => false, 'info' => 'Email address is required!');
          }
          $isemail = self::validate_email($email);
          if (!$isemail) {
               return array('success' => false, 'info' => 'Invalid email');
          }
          return array('success' => true, 'email' => $isemail);
     }
     /** Validate email if the format is correct */
     private function validate_email($email = false)
     {
          if (is_array($email) || is_numeric($email) || is_bool($email) || is_float($email) || is_file($email) || is_dir($email) || is_int($email))
               return false;
          else {
               $email = trim(strtolower($email));
               if (filter_var($email, FILTER_VALIDATE_EMAIL) !== false) return $email;
               else {
                    $pattern = '/^(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){255,})(?!(?:(?:\\x22?\\x5C[\\x00-\\x7E]\\x22?)|(?:\\x22?[^\\x5C\\x22]\\x22?)){65,}@)(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22))(?:\\.(?:(?:[\\x21\\x23-\\x27\\x2A\\x2B\\x2D\\x2F-\\x39\\x3D\\x3F\\x5E-\\x7E]+)|(?:\\x22(?:[\\x01-\\x08\\x0B\\x0C\\x0E-\\x1F\\x21\\x23-\\x5B\\x5D-\\x7F]|(?:\\x5C[\\x00-\\x7F]))*\\x22)))*@(?:(?:(?!.*[^.]{64,})(?:(?:(?:xn--)?[a-z0-9]+(?:-+[a-z0-9]+)*\\.){1,126}){1,}(?:(?:[a-z][a-z0-9]*)|(?:(?:xn--)[a-z0-9]+))(?:-+[a-z0-9]+)*)|(?:\\[(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){7})|(?:(?!(?:.*[a-f0-9][:\\]]){7,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,5})?)))|(?:(?:IPv6:(?:(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){5}:)|(?:(?!(?:.*[a-f0-9]:){5,})(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3})?::(?:[a-f0-9]{1,4}(?::[a-f0-9]{1,4}){0,3}:)?)))?(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))(?:\\.(?:(?:25[0-5])|(?:2[0-4][0-9])|(?:1[0-9]{2})|(?:[1-9]?[0-9]))){3}))\\]))$/iD';
                    return (preg_match($pattern, $email) === 1) ? $email : false;
               }
          }
     }
}
