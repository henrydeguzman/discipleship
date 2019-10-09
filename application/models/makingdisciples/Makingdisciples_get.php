<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 08/10/2019
 * Time: 9:04 PM
 */
class Makingdisciples_get extends Core_Model {
    public function __construct(){
        $this->script->load('makingdisciples_script');
        parent::__construct();
    }
    /** api/gateway?re=fetch/makingdisciples_get/processdate */
    public function processdate(){
        $whr="WHERE a.makingdisciples_date >= CURDATE()  AND a.total=0";
        $sql=$this->makingdisciples_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/makingdisciples_get/dates */
    public function dates(){
        $sql=$this->makingdisciples_script->getdates()." ORDER BY a.makingdisciples_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/makingdisciples_get/candidates */
    public function candidates($makingdisciplesid=null){
        //return $this->_getsecureid($makingdisciplesid);
        $makingdisciplesid=isset($_POST['makingdisciplesid'])?$_POST['makingdisciplesid']:$makingdisciplesid;
        if(empty($makingdisciplesid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->makingdisciples_script->candidates($this->_getsecureid($makingdisciplesid)).$whr;
        return $this->query($sql,$toprow);
    }
}