<?php
/**
 * !!! STRICTLY FOR DEVELOPMENT PURPOSES ONLY !!!
 *
 * This section MUST ONLY BE USED DURING DEVELOPMENT.
 * Please provide better code/library that will be use on production.
 */
require_once "vendor/autoload.php";
use PHPMailer\PHPMailer\PHPMailer;
/**
 * !!! END OF RESTRICTION FOR DEVELOPMENT !!!
 */



/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/14/2019
 * Time: 09:45 PM
 */
class users_connection extends core_model {
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
        if(empty($email)){ return array("success"=>false, 'info'=>'email is required'); }

        $sql="SELECT * FROM `user` WHERE email='".$email."'";
        $result = self::query($sql, true);

        $this->load->library('jwt_generator');
        $token = $this->jwt_generator->createToken($result->email, $result->userid, $result->password);

        /**
         * !!! STRICTLY FOR DEVELOPMENT PURPOSES ONLY !!!
         *
         * This section MUST ONLY BE USED DURING DEVELOPMENT.
         * Please provide better code/library that will be use on production.
         */
        $mail = new PHPMailer;

        // Tell PHPMailer to use SMTP.
        $mail->isSMTP();

        // Enable SMPTP Debugging.
        //  0 = Off (Production Use ONLY)
        //  1 = Client Only
        //  2 = Client and Server
        $mail->SMTPDebug = 2;

        // Set the hostname of the mail server.
        $mail->Host = 'smtp.gmail.com';

        $mail->Port = 587;

        $mail->SMTPSecure = 'tls';

        // Set whether to use SMTP Authentication.
        $mail->SMTPAuth = true;

        // Set the Email and Password for Authentication.
        $mail->Username = "justineang.official@gmail.com";
        $mail->Password = "Al3x0403Ang99!!!112498";

        // Set some headers for the email.
        $mail->setFrom('webmaster@discipleship.victory.org.ph');
        $mail->setReplyTo('no-rely@discipleship.victory.org.ph');
        $mail->setAddress($result->email);
        $mail->Subject = "Request to Reset Password";
        //$mail->msgHtml(); // Use to send HTML Email
        //$mail->AltBody = ''; // Use to send HTML Email
        $mail->Body = $token;

        if (!$mail->send()) {
            return array("success" => false, 'info' => "Mail Error: ".$mail->ErrorInfo);
        } else {
            return array("success"=>true, 'info'=>base_url());
        }

        /**
         * !!! END OF RESTRICTION FOR DEVELOPMENT !!!
         */

        //return array("success"=>true, 'info'=>base_url());
    }
}