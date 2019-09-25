<?php
require_once "vendor/autoload.php";

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

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
    /** api/gateway?re=fetch/users_connection/reset_password */
    public function reset_password(){
        $email=isset($_POST['email'])?$_POST['email']:null;
        /** testing */
        $email='henrydeguzman.java73@gmail.com';
        /** end */

        if(empty($email)){ return array("success"=>false, 'info'=>'email is required'); }
        $sql="SELECT user.email,user.userid,user.password,user.firstname,user.lastname FROM `user` 
              WHERE email='".$email."'";$result = self::query($sql, true);
        
        if ($result) {
            //return $result;
            $this->load->library('jwt_generator');
            $this->load->library('smpt');
            $token = $this->jwt_generator->createToken($result->email, $result->userid, $result->password);

            return;
            $mail = new PHPMailer;



            $mail->isSMTP();
            $mail->SMTPDebug = 2; //Alternative to above constant
            $mail->Host = 'mail.rtudiscipleship.com';
            $mail->Port = 465;
            $mail->SMTPSecure = 'tls';
            $mail->SMTPAuth = true;
            $mail->Username = 'team@rtudiscipleship.com'; // Please provide this...
            $mail->Password = 'kkzdqpprpn'; // Please provide this...
            $mail->setFrom($mail->Username, 'Discipleship Team');
            $mail->addAddress($result->email, $result->firstname.' '.$result->lastname);
            $mail->Subject = 'Request to Reset Password';

            //$mail->msgHtml(file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/html/reset_password_email.html'));
            //$mail->AltBody = file_get_contents(PATH_VIEW.'templates/auth/forgot-password/htmlemails/plaintext/reset_password_email.txt');
            $mail->msgHtml('sample');
            $mail->wrapText($mail->Body, 100);
            
            //return array('success' => false, 'info' => $mail->ErrorInfo);

            $searchNeedle = array(
                '{{ Mail::Title }}',
                '{{ Mail::Recepient }}',
                '{{ Mail::JSONToken }}',
                '{{ Mail::Sender }}',
                '{{ Mail::CopyrightYear }}'
            );

            $replaceStack = array(
                'Reset Email',
                $result->firstname,
                base_url('page/reset_account/'.$result->userid.'/'.$token),
                'Discipleship Team',
                date('Y')
            );

            $mail->Body = str_replace($searchNeedle, $replaceStack, $mail->Body);
            $mail->AltBody = str_replace($searchNeedle, $replaceStack, $mail->AltBody);
            return $mail->send();
            if (!$mail->send()) {
                return array("success"=>false, 'info'=>"Error Message: ".$mail->ErrorInfo);
            } else {
                // The path to where to save the emails sent.
                return 'sent';
                $path = "{mail.rtudiscipleship.com:993}";

                // Tell your server to open an IMAP connect using
                // the same username and password used in SMTP.
                $imapStream = imap_open($path, $mail->Username, $mail->Password);
                $result = imap_append($imapStream, $path,  $mail->getSentMIMEMessage());
                imap_close($imapStream);

                return array("success"=>true, 'info'=>base_url());
            }
        } else {
            return array("success"=>false, 'info'=>"Sorry, we didn't find any account associated with this email.");
        }
    }

    public function getuserbyid($userID){
        $sql="SELECT * FROM `user` WHERE userid=".$userID;
        return self::query($sql, true);
    }
}
