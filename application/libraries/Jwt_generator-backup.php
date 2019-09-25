<?php
/**
 * Created by PhpStorm.
 * User: Justine Ang
 * Date: 29/08/2019
 * Time: 11:29 PM
 */
//require_once 'vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\ExpiredException;

require './assets/dependencies/firebase/JWT.php';
require './assets/dependencies/firebase/ExpiredException.php';

class Jwt_Generator
{
    /**
     * Contains the 'issuer' claim of the JSON Web Token
     *
     * @var string
     */
    protected $issuer = "Victory Urdaneta Discipleship";

    /**
     * Contains the 'subject' claim of the JSON Web Token
     *
     * @var string
     */
    protected $subject = "Subject to Password Reset";

    /**
     * Contains the 'audience' claim of the JSON Web Token
     *
     * @var string
     */
    protected $audience;

    /**
     * Contains the 'issued at' claim of the JSON Web Token
     *
     * @var string
     */
    protected $issuedAt;

    /**
     * Contains the 'JWT ID' claim of the JSON Web Token
     *
     * @var string
     */
    protected $jwtID;

    /**
     * Contains the JSON Web Token
     *
     * @var string
     */
    protected $jsonWebToken;

    /**
     * The validity of the JSON Web Token in seconds.
     *
     * @var int EXPIRATION_TIME
     */
    private $EXPIRATION_TIME = 900;

    /**
     * The added number of seconds to the validity of token
     * used to generate and verify the token.
     *
     * @var int $LEEWAY_TIME
     */
    private $LEEWAY_TIME = 60;

    /**
     * JWTGenerator constructor.
     *
     * Create an object instance of JWT_Generator which can be used
     * for creating JSON Web Token.
     */
    public function __construct()
    {
        $this->issuedAt = time();
    }

    /**
     * Creates a valid JSON Web Token that expires after fifteen (15) minutes
     * after the generation time with 60 seconds leeway. This leeway ensures
     * that there is enough time to encode and decode the token.
     *
     * @param string $audience   the email of the user requesting for the token
     * @param int $jwtID    the unique user identity of the user requesting the token
     * @param string $secretKey     the current hashed password of the user requesting for the token
     * @return string
     */
    public function createToken($audience, $jwtID, $secretKey)
    {
        if (!is_string($audience) || $audience === "") { exit; }
        if (!is_numeric($jwtID) || $jwtID <= 0) { exit; }
        if (!is_string($secretKey) || $secretKey === "") { exit; }

        $this->audience = $audience;
        $this->jwtID = $jwtID;

        // Creates the JSON Web Token by filling up the claims.
        $token = array(
            'iss'   => $this->issuer,
            'aud'   => $this->audience,
            'sub'   => $this->subject,
            'iat'   => $this->issuedAt,
            'nbf'   => $this->issuedAt,
            'exp'   => $this->issuedAt + ($this->EXPIRATION_TIME + $this->LEEWAY_TIME)
        );
        $this->jsonWebToken = JWT::encode($token, $secretKey, 'HS512');
        return $this->jsonWebToken;
    }

    public function decodeToken($token, $secretKey)
    {
        if (!is_string($token) || $token === "") { exit; }
        if (!is_string($secretKey) || $secretKey === "") { exit; }

        $decodedToken = array();

        try {
            $decodedToken = (array)JWT::decode($token, $secretKey, array('HS512'));
        } catch (ExpiredException $ex) {
            echo "Message could not decode. Jwt_generator Error: {$ex}";
        }

        return $decodedToken; 
    }

    function __destruct()
    {
        $this->issuedAt = null;
        $this->audience = null;
        $this->jwtID = null;
    }
}