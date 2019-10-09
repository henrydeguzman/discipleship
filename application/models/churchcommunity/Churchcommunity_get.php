<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 7:36 PM
 */
class Churchcommunity_get extends Core_Model {
    public function __construct(){
        $this->script->load('churchcommunity_script');
        parent::__construct();
    }
    /** api/gateway?re=fetch/churchcommunity_get/processdate */
    public function processdate(){
        $whr="WHERE a.churchcommunity_date >= CURDATE()  AND a.total=0";
        $sql=$this->churchcommunity_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/churchcommunity_get/dates */
    public function dates(){
        $sql=$this->churchcommunity_script->getdates()." ORDER BY a.churchcommunity_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/churchcommunity_get/$churchcommunityid */
    public function getchurchcommunitylist($churchcommunityid=null){
        if(empty($churchcommunityid)){ return array(); }
        $toprow=false;$whr='AND development_churchcommunity_dates.churchcommunityid IS NOT NULL';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->churchcommunity_script->getchurchcommunitylist($this->_getsecureid($churchcommunityid)).$whr;
        return $this->query($sql,$toprow);
    }
}