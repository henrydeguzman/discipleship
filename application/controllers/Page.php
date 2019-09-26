<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 06:41 PM
 */
class Page extends Core_Controller {
    public function index(){

        if(isset($_SESSION['user'])){
            $this->data_app_get->idCurrentUser();
            $this->template->load();
        } else {
            header("location: ".base_url('page/auth'));
        }
    }
    public function auth($type=null){
        //session_destroy();
        $values=array();
        if(isset($_SESSION['user'])){
            header("location: ".base_url('page/index'));
        } else {
            $path="login";$template="login-v2";
            //var_dump($type);
            switch ($type){
                case "link-sent":
                case "create-new-password":
                case "reset-success":
                    $path="forgot-password";$template=$type;
                    break;
                case !null:
                    //$this->template->load($type.'.html',$values,'auth/'.$type);
                    $path=$type;$template=$path;
                    break;
            }
            $this->template->load($template.'.html',$values,'auth/'.$path);
        }

    }
    public function reset_account($uid, $token) {
        $this->load->model('users/users_connection');
        $result=$this->users_connection->validatetoken($uid,$token);
        //echo json_encode($result);return;
        if ($result['success']) {
            $result['token']=$token;
            $result['userid']=$uid;
            $this->template->load('create-new-password.html', $result, 'auth/forgot-password');
        } else {
            $this->template->load('error.html', $result, 'auth/forgot-password');
        }          
    }
    public function verify_new_password() {
        if (!$_POST) {
            header('location:'.base_url('page/index'));
        }
    }
}