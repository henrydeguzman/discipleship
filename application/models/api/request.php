<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 04:18 PM
 */
require_once 'api.class.php';
class request extends _API{
    protected  $user;
    public function __construct() {
        parent::__construct($_REQUEST['re']);
       // if ($this->method != 'centersGet'){return "Only accepts GET HTTP Request Method";}
    }
    protected function fetch() {
        if($this->dtModule!='' && is_array($this->args)){
            $func =  array_shift($this->args);
            $this->load->model($this->dtModule,'mod');
            if(method_exists($this->mod,$func)){
                return call_user_func_array(array($this->mod,$func),$this->args);
                //$this->mod->$func($this->args);
            }
        }
    }
}