<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:11
 */
class Weekend_get extends Core_Model {
    public function __construct(){ $this->script->load('weekend_script'); }
    /** api/gateway?re=fetch/weekend_get/dates */
    public function dates($churchid=null){
        $sql=$this->weekend_script->getdates()." ORDER BY a.weekend_date desc";
            //." Where a.churchid=".$churchid;
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/weekend_get/getchapter */
    public function getchapter(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $sql="SELECT a.weekendsetid as id FROM weekend_settings a WHERE a.churchid=".$churchid;
        return $this->query($sql,true);
    }
    /** api/gateway?re=fetch/weekend_get/getfilters */
    public function getfilters(){
        return array(array(
            "id"=>"active","name"=>"Life Status",
            "childs"=>array(
                array("id"=>1,"name"=>"Life StatusLife StatusLife StatusLife StatusLife Status"),
            )
        ));
    }
    /** api/gateway?re=fetch/weekend_get/getvweekendlist */
    public function getvweekendlist($weekendid=null){
        $weekendid=isset($_POST['weekendid'])?$_POST['weekendid']:$weekendid;
        if(empty($weekendid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->weekend_script->getvweekendlist($weekendid).$whr;     
        return $this->query($sql,$toprow);
    }
    /** api/gateway?re=fetch/weekend_get/processdate */
    public function processdate(){
        $whr="WHERE a.weekend_date >= CURDATE()  AND a.total=0";
        $sql=$this->weekend_script->getdates().$whr;
        return $this->query($sql,true);
    }
}