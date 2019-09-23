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
}