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
        $whr='';
        /** Apply filters */
        if(isset($_POST['filters'])){
            $filters=$_POST['filters'];
            if(!empty($filters['center'])){ $whr=self::extendwhr($whr,"church.churchid IN (".$filters['center'].")","AND"); }
        }
        /** Apply search */
        if(isset($_POST['search'])){
            $whr=self::extendwhr($whr,"church.name LIKE '%".$_POST['search']."%'","AND");
        }

        $sql=$this->reports_script->getlist().$whr.self::setLimit();

        //return $sql;
        return $this->query($sql,false,true);
    }
    /** api/gateway?re=fetch/reports_get/getfilters */
    public function getfilters(){
        return array(
            array("id"=>"center","name"=>"Center","childs"=>$this->gfilters->getfilters('church')),
            array("id"=>"year","name"=>"Year","childs"=>$this->gfilters->getfilters('year'))
        );
    }
}