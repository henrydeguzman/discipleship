<?php

require_once 'vendor/autoload.php';

use PHPMailer\PHPMailer\OAuth;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use League\OAuth2\Client\Provider\Google;
use League\OAuth2\Client\Grant\RefreshToken;

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

    /**
     * Holds an object instance of OAuth class.
     * 
     * @var object
     */
    protected $OAuth;

    /**
     * Holds an object instance of OAuth Provider class.
     */
    protected $OAuthProvider;
    

    /**
     * Mailer constructor.
     * 
     * Creates an object instance of PHPMailer and indentifies
     * whether to use 'standard authentication' or OAuth authentication.
     * 
     * @param array $params
     */
    public function __constructor($params) {

        $this->PHPMailer = new PHPMailer();

        // Tell PHPMailer to use SMTP.
        $this->PHPMailer->isSMTP();

        // Enable SMTP debugging.
        //   0 = Off (Production Use Only)
        //   1 = Client Messages Only
        //   2 = Client and Server Messages
        $this->PHPMailer->SMTPDebug = 0;

        // Set the hostname of the mail server.
        $this->PHPMailer->Host = $params["host"];

        // Set the SMTP Port number.
        //   587 for Authenticated TLS (a.k.a RFC4409)
        $this->PHPMailer->Port = $params["port"];

        // Set the encryption system to use.
        //    SSL
        //    TLS (RFC4409)
        $this->PHPMailer->SMTPSecure = $params["encryption"];

        // Whether to use SMTP Authentication.
        $this->PHPMailer->SMTPAuth = true;
    }

    /**
     * Set the username used for SMTP authentication.
     * 
     * @param string $username
     */
    public function setUsername($username) {
        if (is_string($username) && $username !== "") {
            $this->SMTPMailer->Username = $username;
        }
    }

    public function getUsername() {
        return $this->SMTPMailer->Username;
    }

    /**
     * Set the password used for SMTP authentication.
     * 
     * @param string $password
     */
    public function setPassword($password) {
        if (is_string($password) && $password !== "") {
            $this->SMTPMailer->Password = $password;
        }
    }

    public function getPassword() {
        return $this->SMTPMailer->Password;
    }

    /**
     * Set the email sender.
     * 
     * @param string $senderEmail
     * @param string $name
     */
    public function setSender($senderEmail, $name = '') {
        if (is_string($senderEmail) && $senderEmail !== "") {
            if (filter_var($senderEmail, FILTER_VALID_EMAIL)) {
                $this->SMTPMailer->setFrom($senderEmail, $name);
            }
        }
    }

    /**
     * Set the email address where replies are going to be sent.
     * 
     * @param string $replyAddress
     * @param string $name
     */
    public function setReplyTo($replyAddress, $name = '') {
        if (is_string($replyAddress) && $replyAddress !== "") {
            if (filter_var($replyAddress, FILTER_VALID_EMAIL)) {
                $this->SMTPMailer->addReplyTo($replyAddress, $name);
            }
        }
    }

    public function setRecepient($recepientAddress, $name = '') {
        if (is_string($recepientAddress) && $recepientAddress !== "") {
            if (filter_var($recepientAddress, FILTER_VALID_EMAIL)) {
                $this->SMTPMailer->addAddress($recepientAddress, $name);
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

    public function setHTMLEmail($htmlEmailFilename, $plainTextAltFilename) {
        if ((is_string($htmlEmailFilename) && $htmlEmailFilename !== "") &&
            (is_string($plainTextAltFilename) && $plainTextAltFilename !== "")) {
                $this->PHPMailer->msgHTML(file_get_contents($htmlEmailFilename), 
                                          base_dir('assets/files/htmlemails/html/'));
                $this->PHPMailer->AltBody = file_get_contents(
                                                base_dir('assets/files/htmlemails/plaintext/').$plainTextAltFilename
                                            );
        }
    }

    public function addAttachement($path, $name = '', $encoding = self::ENCODING_BASE64, $type = '', $disposition = 'attachment') {
        $this->PHPMailer->addAttachement($path, $name, $encoding, $type, $disposition);
    }

    public function sendEmail() {
        return $this->PHPMailer->send();
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

    public function getSentMIMEMessage() {
        return $this->PHPMailer->getSentMIMEMessage();
    }
}