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
            $path="login";$template=$path;
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
   /* public function forgot_password(){
        $values=array();
        if(isset($_SESSION['user'])){
            header("location: ".base_url('page/index'));
        } else {
            $this->template->load('forgot_password.html',$values,'forgot_password');
        }
    }*/
   /* public function link_sent(){
        $values=array();
        if(isset($_SESSION['user'])){
            header("location: ".base_url('page/index'));
        } else {
            $this->template->load('resetlink_sent.html',$values,'forgot_password');
        }
    }*/
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
            return;
                    /*
                     * If the request is $_GET, then display the form
                     * for creating a new password, otherwise process
                     * the form.
                     */
                    if ($this->input->get()) {
                        $this->template->load('create-new-password.html',$values,'auth/forgot-password');
                        //$this->template->load('create_new_password.html',$values,'forgot_password');
                    } else {
                        $this->load->library('form_validation');
                        $this->form_validation->set_rules('password', 'Password', 'trim|required');
                        $this->form_validation->set_rules('passwordconf', 'Password Confirmation', 'trim|required|matches[password]');
                        if ($this->form_validation->run() == false) {
                            $this->template->load('create-new-password.html',$values,'auth/forgot-password');
                            //$this->template->load('create_new_password.html',$values,'forgot_password');
                        } else {
                            $password = $_POST['password'];
                            $passwordconf = $_POST['passwordconf'];
                            $this->load->model('users/users_set');
                            $this->users_set->resetPassword($password, $passwordconf, $result->userid);
                            header("location: ".base_url('page/index'));
                        }
                    }

        //}
    }
    public function verify_new_password() {
        if (!$_POST) {
            header('location:'.base_url('page/index'));
        }
    }
}