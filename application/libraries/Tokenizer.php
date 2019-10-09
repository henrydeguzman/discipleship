<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 25/09/2019
 * Time: 8:11 PM
 */
use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\SignatureInvalidException;

require './assets/dependencies/firebase/JWT.php';
require './assets/dependencies/firebase/ExpiredException.php';

class Tokenizer {
    protected $issuer = "victory-urdaneta-discipleship";
    protected $subject = "Subject to Password Reset";
    protected $issuedAt;
    protected $jwtID;
    protected $token;
    /**
     * The validity of the JSON Web Token in seconds.
     * EXPIRATION_TIME: 900 seconds (15 minutes)
     */
    private $EXPIRATION_TIME = 900;
    /**
     * The added number of seconds to the validity of token in seconds
     * LEEWAY_TIME: 60 seconds (1 minute) =used to generate and verify the token.
     */
    private $LEEWAY_TIME = 60;
    public function __construct() { $this->issuedAt = strtotime("now"); }
    /**
     * EXPIRATION: expiration_time + leeway_time
     * Creates a valid JSON Web Token that expires after fifteen (15) minutes
     * after the generation time with 60 seconds leeway. This leeway ensures
     * that there is enough time to encode and decode the token.
     */
    public function create($audience=null, $secretKey=null, $extime=NULL){
        if(!is_string($audience)||empty($audience)){ return array('error'=>'Invalid audience.'); }
        //if(!is_numeric($jwtID)||$jwtID<=0){ return array('error'=>'Id is not numeric.'); }
        if(!is_string($secretKey)||empty($secretKey)){ return array('error'=>'Please provide secret key.'); }
        if(empty($extime)){$extime=$this->EXPIRATION_TIME;};
        $token = array('iss'=>$this->issuer,
            'aud'=>$audience,
            'sub'=>$this->subject,
            'iat'=>$this->issuedAt,
            'nbf'=>$this->issuedAt,
            'exp'=>$this->issuedAt + ($extime + $this->LEEWAY_TIME)
        );
        $this->token = JWT::encode($token, $secretKey, 'HS512');
        return $this->token;
    }
    public function validate($token=null,$secretKey=null){
        if(!is_string($token)||empty($token)){ return array('error'=>'Invalid token'); }
        if(!is_string($secretKey)||empty($secretKey)){ return array('error'=>'Please provide secret key.'); }
        try { $result=(array)JWT::decode($token, $secretKey,array('HS512'));$result['success']=true;return $result; }
        catch (ExpiredException $ex){ return self::error($ex,". <a href='".base_url()."' style='color:white;font-size:12px;text-decoration: underline;'>[Go back to login]</a>"); }
        catch (SignatureInvalidException $ex) { return self::error($ex); }
        catch (BeforeValidException $ex) { return self::error($ex); }
        catch (DomainException $ex) { return self::error($ex); }
        catch (UnexpectedValueException $ex) { return self::error($ex); }
        catch (InvalidArgumentException $ex) { return self::error($ex); }
    }
    private function error($ex,$ext=null){ return array("success"=>false,"info"=>"{$ex->getMessage()}".$ext); }
}