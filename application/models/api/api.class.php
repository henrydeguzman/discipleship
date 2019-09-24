<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 04:13 PM
 */
abstract class _API extends Core_Model {
    /**
     * Property: method
     * The HTTP method this request was made in, either GET, POST, PUT or DELETE
     */
    protected $method = '';
    /**
     * Property: dtRequest
     * The action requested in the URI. eg: add,edit,delete,fetch,submit
     */
    protected $dtRequest = '';
    /**
     * Property: function
     * The table name of the dtRequest requested. eg: /edit/category
     */
    protected $dtModule = '';
    /**
     * Property: args
     * Any additional URI components after the dtRequest and dtModule have been removed, in our
     * case, an integer ID for the resource. eg: /<dtRequest>/<dtModule>/<arg0>/<arg1>
     * or /<dtRequest>/<arg0>
     */
    protected $args = Array();
    /**
     * Property: file
     * Stores the input of the PUT request
     */
    protected $file = Null;

    /**
     * Constructor: __construct
     * Allow for CORS, assemble and pre-process the data
     */
    public function __construct($request) {
        header("Access-Control-Allow-Origin: *");
        header("Access-Control-Allow-Methods: *");
        header("Access-Control-Allow-Credentials: true");
        header("Content-Type: application/json");


        $this->args = explode('/', rtrim($request, '/'));
        $this->dtRequest = array_shift($this->args);
        if (array_key_exists(0, $this->args) && !is_numeric($this->args[0])) {
            $raw = array_shift($this->args);$rawex=explode("_",$raw);array_pop($rawex);array_push($rawex,$raw);
            $this->dtModule=join('/',$rawex);
        }

        $this->method = $_SERVER['REQUEST_METHOD'];
        if ($this->method == 'POST' && array_key_exists('HTTP_X_HTTP_METHOD', $_SERVER)) {
            if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'DELETE') {
                $this->method = 'DELETE';
            } else if ($_SERVER['HTTP_X_HTTP_METHOD'] == 'PUT') {
                $this->method = 'PUT';
            } else {
                throw new Exception("Unexpected Header");
            }
        }
        switch($this->method) {
            case 'DELETE':
            case 'POST':
                $this->request = $this->_cleanInputs($_POST);
                break;
            /*case 'centersGet':
                $this->request = $this->_cleanInputs($_GET);
                break;*/
            case 'PUT':
                $this->request = $this->_cleanInputs($_GET);
                $this->file = file_get_contents("php://input");
                break;
            default:
                $this->_response('Invalid Method', 405);
                break;
        }
    }
    public function processAPI() {
        if ((int)method_exists($this, $this->dtRequest) > 0) {
            return $this->_response($this->{$this->dtRequest}($this->args));
        }
        return $this->_response("No API Request: ".$this->dtRequest, 404);
    }
    public function processFile(){
        $request='name';$this->dtRequest=$request;
        if(!isset($_REQUEST[$request])){ return $this->_response("No API Request: ".$this->dtRequest, 404); }
        else if ((int)method_exists($this, $this->dtRequest) > 0) {
            $this->args = rtrim($_REQUEST[$request]);
            return $this->_response($this->{$this->dtRequest}($this->args));
        }
    }
    private function _response($data, $status = 200) {
        header("HTTP/1.1 " . $status . " " . $this->_requestStatus($status));
        return json_encode($data);
    }
    private function _requestStatus($code) {
        $status = array(
            200 => 'OK',
            404 => 'Not Found',
            405 => 'Method Not Allowed',
            500 => 'Internal Server Error',
        );
        return ($status[$code])?$status[$code]:$status[500];
    }
    private function _cleanInputs($data) {
        $clean_input = Array();
        if (is_array($data)) {
            foreach ($data as $k => $v) {
                $clean_input[$k] = $this->_cleanInputs($v);
            }
        } else {
            $clean_input = trim(strip_tags($data));
        }
        return $clean_input;
    }
}