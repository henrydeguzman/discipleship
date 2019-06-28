<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 2/16/2019
 * Time: 04:25 PM
 */
class vg_get extends core_model {
    public function __construct(){ $this->script->load('vg_script'); }
    public function tablelist(){/** api/gateway?re=fetch/vg_get/tablelist */
        $sql=$this->vg_script->getvglist('mainlink,center,info')." WHERE xx.leaderid=".$this->data_app_get->idCurrentUser();
        return $this->query($sql);
    }
    public function vginfo(){/** api/gateway?re=fetch/vg_get/vginfo */
        $sql=$this->vg_script->vginfo();
        return $this->query($sql,true);
    }
}