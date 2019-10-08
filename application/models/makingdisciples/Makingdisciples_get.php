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
    }
    /** api/gateway?re=fetch/makingdisciples_get/processdate */
    public function processdate(){
        $whr="WHERE a.makingdisciples_date >= CURDATE()  AND a.total=0";
        $sql=$this->makingdisciples_script->getdates().$whr;
        return $this->query($sql,true);
    }
    /** api/gateway?re=fetch/makingdisciples_get/dates */
    public function dates(){
        $sql=$this->makingdisciples_script->getdates()." ORDER BY a.makingdisciples_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/makingdisciples_get/ */
    public function getmakingdiscipleslist(){

    }
}