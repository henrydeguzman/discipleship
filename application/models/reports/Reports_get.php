<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 06/07/2019
 * Time: 10:57 AM
 */
class Reports_get extends Core_Model {
    public function __construct(){
        $this->script->load('reports_script');
        $this->load->model('global/global_filters','gfilters');
    }
    /** api/gateway?re=fetch/reports_get/getlist */
    public function getlist(){
        $churchid=isset($_GET['churchid'])?$_GET['churchid']:0;
        $whr='';
        if(!empty($churchid)){ $whr=self::extendwhr($whr,"church.churchid=".$churchid,"AND"); }
        $sql=$this->reports_script->getlist().$whr;
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/reports_get/getfilters */
    public function getfilters(){
        return array(
            array("id"=>"lifestatus","name"=>"Life Status","childs"=>$this->gfilters->getfilters('lifestatus')),
            array("id"=>"center","name"=>"Center","childs"=>$this->gfilters->getfilters('church')),
            array("id"=>"year","name"=>"Year","childs"=>$this->gfilters->getfilters('year'))
        );
    }
}