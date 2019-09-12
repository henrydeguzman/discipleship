<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/19/2019
 * Time: 12:54 PM
 */
class one2one_get extends core_model {
    public function __construct() { $this->script->load('one2one_script'); }
    /** api/gateway?re=fetch/one2one_get/tablelist */
    public function tablelist(){
        $whr="WHERE xx.leaderid=".$this->data_app_get->idCurrentUser()." AND x.profileid=2";
        if(isset($_POST['rowid'])){
            $whr=self::extendwhr($whr,'x.userid='.$_POST['rowid'],"AND");
        }
        $sql=$this->one2one_script->getlist('mainlink,info,vga').$whr;
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/one2one_get/getinfo/{$userid} */
    public function getuser($userid=null,$activemodules=null){
        if($userid===null){return array("success"=>false);}
        $this->load->model('users/users_get','uget');
        return $this->uget->getusers($userid,$activemodules);
    }
    /** api/gateway?re=fetch/one2one_get/getinfo/{$userid} */
    public function getinfo($userid=null){
        if(empty($userid)){ return array("success"=>false,"info"=>"invalid user"); }
        $sql=$this->one2one_script->getinfo()."WHERE user.userid=".$userid;
        return $this->query($sql,true);
    }
    /** api/gateway?re=fetch/one2one_get/chapters/{$onoid} */
    public function chapters(){
        $sql=$this->one2one_script->getchapters();
        return $this->query($sql);
    }
}