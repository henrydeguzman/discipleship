<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 06/07/2019
 * Time: 10:57 AM
 */
class reports_get extends core_model {
    public function __construct(){ $this->script->load('reports_script'); }
    /** api/gateway?re=fetch/reports_get/getlist */
    public function getlist(){
        $sql=$this->reports_script->getlist();
        return $this->query($sql);
    }
}