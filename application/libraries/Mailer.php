<?php

require_once 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

/**
 * Mailer class.
 * 
 * Provides properties and methods for sending plain text
 * and HTML emails.
 */
class Mailer {
    /**
     * Holds an object instance of PHPMailer class.
     * 
     * @var object
     */
    protected $PHPMailer;

    protected const HOST = 'mail.rtudiscipleship.com';
    protected const SMTP_PORT = 465;
    protected const IMAP_PORT = 993;
    protected const POP3_PORT = 995;
    protected const SMTP_SECURE = 'tls';
    protected const SMTP_AUTH = true;
    protected const IMAP_PATH = '{mail.rtudiscipleship.com:993}';
    

    protected const EMAIL_USERNAME = 'team@rtudiscipleship.com';
    protected const EMAIL_PASSWORD = 'kkzdqpprpn';

    /**
     * Mailer constructor.
     * 
     * Creates an object instance of PHPMailer and indentifies
     * whether to use 'standard authentication' or OAuth authentication.
     * 
     * @param array $params
     */
    public function __constructor() {

        $this->PHPMailer = new PHPMailer;

        // Tell PHPMailer to use SMTP.
        $this->PHPMailer->isSMTP();

        // Enable SMTP debugging.
        //   0 = Off (Production Use Only)
        //   1 = Client Messages Only
        //   2 = Client and Server Messages
        $this->PHPMailer->SMTPDebug     = 0;
        $this->PHPMailer->Host          = self::HOST;
        $this->PHPMailer->Port          = self::SMTP_PORT;
        $this->PHPMailer->SMTPSecure    = self::SMTP_SECURE;
        $this->PHPMailer->SMTPAuth      = self::SMTP_AUTH;
    }

    /**
     * Set the username used for SMTP authentication.
     * 
     * @param string $username
     */
    public function setUsername($username = self::EMAIL_USERNAME) {
        if (is_string($username) && $username !== "") {
            $this->PHPMailer->Username = $username;
        }
    }

    public function getUsername() {
        return $this->PHPMailer->Username;
    }

    /**
     * Set the password used for SMTP authentication.
     * 
     * @param string $password
     */
    public function setPassword($password = self::EMAIL_PASSWORD) {
        if (is_string($password) && $password !== "") {
            $this->PHPMailer->Password = $password;
        }
    }

    public function getPassword() {
        return $this->PHPMailer->Password;
    }

    /**
     * Set the email sender.
     * 
     * @param string $senderEmail
     * @param string $name
     */
    public function setSender($name = '', $senderEmail = self::EMAIL_USERNAME) {
        if (is_string($senderEmail) && $senderEmail !== "") {
            if (filter_var($senderEmail, FILTER_VALID_EMAIL)) {
                $this->PHPMailer->setFrom($senderEmail, $name);
            }
        }
    }

    /**
     * Set the email address where replies are going to be sent.
     * 
     * @param string $replyAddress
     * @param string $name
     */
    public function setReplyTo($name = '', $replyAddress = self::EMAIL_USERNAME) {
        if (is_string($replyAddress) && $replyAddress !== "") {
            if (filter_var($replyAddress, FILTER_VALID_EMAIL)) {
                $this->PHPMailer->addReplyTo($replyAddress, $name);
            }
        }
    }

    public function setRecepient($recepientAddress, $name = '') {
        if (is_string($recepientAddress) && $recepientAddress !== "") {
            if (filter_var($recepientAddress, FILTER_VALID_EMAIL)) {
                $this->PHPMailer->addAddress($recepientAddress, $name);
            }
        }
    }

    public function setSubject($subject) {
        if (is_string($subject) && $subject !== "") {
            $this->PHPMailer->Subject = $subject;
        }
    }

    public function setPlainTextEmail($contents) {
        if (is_string($contents) && $contents !== "") {
            $this->PHPMailer->Body = $contents;
        }
    }

    public function setHTMLEmail($htmlEmailFilename, $plainTextAltFilename, $baseDirectory) {
        if ((is_string($htmlEmailFilename) && $htmlEmailFilename !== "") &&
            (is_string($plainTextAltFilename) && $plainTextAltFilename !== "")) {
                $this->PHPMailer->msgHTML(file_get_contents($htmlEmailFilename), $baseDirectory.'html/'.$htmlEmailFilename);
                $this->PHPMailer->AltBody = file_get_contents($baseDirectory.'plaintext/'.$plainTextAltFilename);
        }
    }

    public function addAttachement($path, $name = '', $encoding = 'base64', $type = '', $disposition = 'attachment') {
        $this->PHPMailer->addAttachement($path, $name, $encoding, $type, $disposition); 
    }

    public function sendEmail() {
        if (!$this->PHPMailer->send()) {
            return false;
        } else {
            $this->saveEmail();
        }

        return true;
    }

    public function replaceHTMLEmailVariables($search, $replace, $replacementCount = 0) {
        $this->PHPMailer->Body = str_replace($search, $replace, $this->PHPMailer->Body, $replacementCount);
    }

    public function replacePlainEmailVariables($search, $replace, $replacementCount = 0) {
        $this->PHPMailer->AltBody = str_replace($search, $replace, $this->PHPMailer->AltBody, $replacementCount);
    }

    public function getErrorInfo() {
        $this->PHPMailer->ErrorInfo;
    }

    // public function getSentMIMEMessage() {
    //     return $this->PHPMailer->getSentMIMEMessage();
    // }

    private function saveEmail() {
        $imapStream = imap_open(self::IMAP_PATH, self::EMAIL_USERNAME, self::EMAIL_PASSWORD);
        $result = imap_append($imapStream, self::IMAP_PATH,  $this->PHPMailer->getSentMIMEMessage());
        imap_close($imapStream);
    }
}