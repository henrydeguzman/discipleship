<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 4/13/2019
 * Time: 05:35 PM
 */
class profile_get extends core_model {
    public function __construct(){ }
    /** api/gateway?re=fetch/profile_get/getdata */
    public function getdata(){
        $this->load->model('users/users_get','user');
        return $this->user->getusers($this->data_app_get->idCurrentUser());
    }
}