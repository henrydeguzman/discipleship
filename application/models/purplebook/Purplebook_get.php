<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 10:04 PM
 */
class Purplebook_get extends Core_Model {
    public function __construct(){
        $this->script->load('purplebook_script');
    }
    /** api/gateway?re=fetch/purplebook_get/processdate */
    public function processdate(){
        $whr="WHERE a.purplebook_date >= CURDATE()  AND a.total=0";
        $sql=$this->purplebook_script->getdates().$whr;
        return $this->query($sql,true);
    }
    /** api/gateway?re=fetch/purplebook_get/dates */
    public function dates(){
        $sql=$this->purplebook_script->getdates()." ORDER BY a.purplebook_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/purplebook_get/$purplebookid */
    public function getchurchcommunitylist($purplebookid=null){
        $purplebookid=isset($_POST['purplebookid'])?$_POST['purplebookid']:$purplebookid;
        if(empty($purplebookid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->purplebook_script->getchurchcommunitylist($purplebookid).$whr;
        return $this->query($sql,$toprow);
    }
}