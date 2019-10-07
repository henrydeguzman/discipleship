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
    }
    /** api/gateway?re=fetch/churchcommunity_get/processdate */
    public function processdate(){
        $whr="WHERE a.churchcommunity_date >= CURDATE()  AND a.total=0";
        $sql=$this->churchcommunity_script->getdates().$whr;
        return $this->query($sql,true);
    }
    /** api/gateway?re=fetch/churchcommunity_get/dates */
    public function dates(){
        $sql=$this->churchcommunity_script->getdates()." ORDER BY a.churchcommunity_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/churchcommunity_get/$churchcommunityid */
    public function getchurchcommunitylist($churchcommunityid=null){
        $churchcommunityid=isset($_POST['churchcommunityid'])?$_POST['churchcommunityid']:$churchcommunityid;
        if(empty($weekendid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->churchcommunity_script->getchurchcommunitylist($churchcommunityid).$whr;
        return $this->query($sql,$toprow);
    }
}