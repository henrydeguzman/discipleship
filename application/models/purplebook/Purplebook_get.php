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
        parent::__construct();
    }
    /** api/gateway?re=fetch/purplebook_get/processdate */
    public function g($token=null){
        return $this->getsecureid($token);
    }
    public function processdate(){
        $whr="WHERE a.purplebook_date >= CURDATE()  AND a.total=0";
        $sql=$this->purplebook_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/purplebook_get/dates */
    public function dates(){
        $sql=$this->purplebook_script->getdates()." ORDER BY a.purplebook_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/purplebook_get/candidates/$purplebookid */
    public function candidates($purplebookid=null){
        $purplebookid=isset($_POST['purplebookid'])?$_POST['purplebookid']:$purplebookid;
        if(empty($purplebookid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->purplebook_script->candidates($this->_getsecureid($purplebookid)).$whr;
        return $this->query($sql,$toprow);
    }
}