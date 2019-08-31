<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:11
 */
class weekend_get extends core_model {
    public function __construct(){ $this->script->load('weekend_script'); }
    /** api/gateway?re=fetch/weekend_get/dates */
    public function dates($churchid=null){
        $sql=$this->weekend_script->getdates();
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
                array("id"=>1,"name"=>"sf"),
            )
        ));
    }
    /** api/gateway?re=fetch/weekend_get/getvweekendlist */
    public function getvweekendlist($weekenddate){
        return $weekenddate;
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){
            $toprow=true;$whr="AND a.userid=".$_POST['rowid'];
        }
        $sql=$this->weekend_script->getvweekendlist().$whr;
        return $this->query($sql,$toprow);
    }
    /** api/gateway?re=fetch/weekend_get/processdate */
    public function processdate(){
     //   usleep(3000000);
        $whr="WHERE a.weekend_date >= CURDATE()";
        $sql=$this->weekend_script->getdates().$whr;
        return $this->query($sql,true);
    }
}