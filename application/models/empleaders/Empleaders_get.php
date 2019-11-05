<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 9:54 PM
 */
class Empleaders_get extends Core_Model {
    public function __construct(){
        $this->script->load('empleaders_script');
        $this->load->model('global/global_filters','global_filters');
        parent::__construct();
    }
    /** api/gateway?re=fetch/makingdisciples_get/dates */
    public function dates(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $sql=$this->empleaders_script->getdates()." WHERE a.churchid='$churchid' ORDER BY a.empleaders_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/empleaders_get/processdate */
    public function processdate(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr="WHERE a.empleaders_date >= CURDATE()  AND a.total=0 AND a.churchid='$churchid'";
        $sql=$this->empleaders_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/empleaders_get/candidates */
    public function candidates($empleadersid=null){
        //return $this->_getsecureid($makingdisciplesid);
        $empleadersid=isset($_POST['empleadersid'])?$_POST['empleadersid']:$empleadersid;
        if(empty($empleadersid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->empleaders_script->candidates($this->_getsecureid($empleadersid)).$whr;
        return $this->query($sql,$toprow);
    }
}