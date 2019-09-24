<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 2/16/2019
 * Time: 04:25 PM
 */
class Vg_get extends Core_Model {
    public function __construct(){ $this->script->load('vg_script'); }
    /** api/gateway?re=fetch/vg_get/tablelist */
    public function tablelist($vgid=null){
        $whr="WHERE xx.leaderid=".$this->data_app_get->idCurrentUser();
        if(!empty($vgid)){
            $whr="WHERE xx.vgid=".$vgid;
        }
        $sql=$this->vg_script->getvglist('mainlink,center,info,vg_intern').$whr;
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/vg_get/getothrvgs */
    public function getothrvgs(){
        //return $this->data_app_get->idCurrentUser();
        $sql=$this->vg_script->getothrvgs()."WHERE a.userid='".$this->data_app_get->idCurrentUser()."' AND b.leaderid<>'".$this->data_app_get->idCurrentUser()."'";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/vg_get/vginfo */
    public function vginfo($vgid=null){
        $whr="WHERE a.leaderid=".$this->data_app_get->idCurrentUser();
        if(!empty($vgid)){
            $whr="WHERE a.vgid=".$vgid;
        }
        $sql=$this->vg_script->vginfo().$whr;
        return $this->query($sql,true);
    }
    public function count_vgs(){

    }
}