<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 11/24/2018
 * Time: 06:41 PM
 */
class page extends core_controller {
    public function index(){
        if(isset($_SESSION['user'])){
            $this->data_app_get->idCurrentUser();
            $this->template->load();
        } else {
            header("location: ".base_url('page/login'));
        }
    }
    public function login(){
        //session_destroy();
        $values=array();
        if(isset($_SESSION['user'])){
            header("location: ".base_url('page/index'));
        } else {
            $this->template->load('login.html',$values,'login');
        }

    }
    public function forgot_password(){
        $values=array();
        if(isset($_SESSION['user'])){
            header("location: ".base_url('page/index'));
        } else {
            $this->template->load('forgot_password.html',$values,'forgot_password');
        }
    }
    public function link_sent(){
        $values=array();
        if(isset($_SESSION['user'])){
            header("location: ".base_url('page/index'));
        } else {
            $this->template->load('resetlink_sent.html',$values,'forgot_password');
        }
    }
    public function reset_account($userID, $token) {
        $this->load->model('users/users_connection');
        $result = $this->users_connection->getuserbyid($userID);

        if ($result) {
            $this->load->library('jwt_generator');
            $decodedToken = array();

            try {
                $this->jwt_generator->decodeToken($token, $result->password);
            } catch (\Throwable $th) {
                header("location: ".base_url('page/index'));
            }

            // Check for the two parties involved!
            if (!empty($decodedToken)) {
                if (($result->email === $decodedToken["aud"]) && $decodedToken["iss"] === "Victory Urdaneta Discipleship") {
                    $values = array();
                    /*
                     * If the request is $_GET, then display the form
                     * for creating a new password, otherwise process
                     * the form.
                     */
                    if ($this->input->get()) {
                        $this->template->load('create_new_password.html',$values,'forgot_password');
                    } else {
                        $this->load->library('form_validation');
                        $this->form_validation->set_rules('password', 'Password', 'trim|required');
                        $this->form_validation->set_rules('passwordconf', 'Password Confirmation', 'trim|required|matches[password]');
                        if ($this->form_validation->run() == false) {
                            $this->template->load('create_new_password.html',$values,'forgot_password');
                        } else {
                            $password = $_POST['password'];
                            $passwordconf = $_POST['passwordconf'];
                            $this->load->model('users/users_set');
                            $this->users_set->resetPassword($password, $passwordconf, $result->userid);
                            header("location: ".base_url('page/index'));
                        }
                    }
                }
            } else {
                header("location: ".base_url('page/index'));
            }
        }
    }
    public function verify_new_password() {
        if (!$_POST) {
            header('location:'.base_url('page/index'));
        }
    }
}