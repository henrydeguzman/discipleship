<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 4/13/2019
 * Time: 05:35 PM
 */
class profile_get extends Core_Model {
    public function __construct(){ $this->script->load('profile_script'); }
    /** api/gateway?re=fetch/profile_get/getpagedata */
    public function getpagedata(){
        $this->load->model('users/users_get','user');
        $userdata=$this->user->getusers($this->data_app_get->idCurrentUser());

        return array('userdata'=>$userdata,'vgleader'=>$this->isvgleader());
    }
    /** api/gateway?re=fetch/profile_get/isvgleader */
    public function isvgleader($userid=null){
        if(empty($userid)){
            $userid=$this->data_app_get->idCurrentUser();
        }
        $sql=$this->profile_script->vgleader()."WHERE a.leaderid='$userid'";
        return $this->query($sql,true);
    }
}