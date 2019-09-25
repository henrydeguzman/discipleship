<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 25/09/2019
 * Time: 4:01 PM
 */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './assets/dependencies/phpmailer/Exception.php';
require './assets/dependencies/phpmailer/PHPMailer.php';
require './assets/dependencies/phpmailer/SMTP.php';
class Smpt {
    const HOST = 'mail.rtudiscipleship.com';
    const TEAM_USER = 'team@rtudiscipleship.com';
    const TEAM_PASS = 'kkzdqpprpn';
    protected $mail;
    public function __construct()
    {
        $this->mail = new PHPMailer(true);

            //Server settings
            $this->mail->SMTPDebug = 0;
            $this->mail->isSMTP();
            $this->mail->Host=self::HOST;
            $this->mail->SMTPAuth=true;
            $this->mail->Username=self::TEAM_USER;
            $this->mail->Password=self::TEAM_PASS;
            $this->mail->SMTPSecure='ssl';
            $this->mail->Port=465;
            $this->mail->setFrom(self::TEAM_USER, 'Discipleship Team');
            //$mail->send();
            //echo 'Message has been sent';

    }
    public function send($data=null){
        //Recipients
        if(!empty($data)){
            $recipient=isset($data['recipient'])?$data['recipient']:null; if(empty($recipient)){ return array("success"=>false,"info"=>'Invalid recipient!');}
            $subject=isset($data['subject'])?$data['subject']:'Test Subject';
            $body=isset($data['body'])?$data['body']:'Test content';
            $alt=isset($data['alt'])?$data['alt']:'';
            $ishtml=isset($data['ishtml'])&&gettype($data['ishtml'])==="boolean"?$data['body']:false;


            $this->mail->addAddress($recipient);
            $this->mail->addReplyTo(self::TEAM_USER, 'Information');

            $this->mail->isHTML($ishtml);
            $this->mail->Subject=$subject;
            $this->mail->Body=$body;
            $this->mail->wrapText($this->mail->Body, 100);
            $this->mail->AltBody=$alt;
            try {
                return $this->mail->send();
                //if($this->mail->send()){

                   // $path = "{mail.rtudiscipleship.com:993}";
                    //$imapStream = imap_open($path, $mail->Username, $mail->Password);
                    //$result = imap_append($imapStream, $path,  $mail->getSentMIMEMessage());
                    //imap_close($imapStream);
                //}
            } catch (Exception $e) {
                return array("success"=>false,'info'=>"Message could not be sent. Mailer Error: {$this->mail->ErrorInfo}");
            }
        } else {
            return array('success'=>false,'info'=>'Unable to send enable. Please check required parameters.');
        }



        $this->mail->AltBody = 'This is the body in plain text for non-HTML mail clients';
    }
}