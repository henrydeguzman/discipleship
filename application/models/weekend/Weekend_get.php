<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:11
 */
class Weekend_get extends Core_Model {
    public function __construct(){
        $this->script->load('weekend_script');
        $this->load->model('global/global_filters','global_filters');
    }
    /** api/gateway?re=fetch/weekend_get/dates */
    public function dates(){
        $sql=$this->weekend_script->getdates()." ORDER BY a.weekend_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/weekend_get/getchapter */
    public function getchapter(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $sql="SELECT a.weekendsetid as id FROM development_weekend_settings a WHERE a.churchid=".$churchid;
        return $this->query($sql,true);
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
    /** api/gateway?re=fetch/weekend_get/postlist */
    public function postlist(){
        $whr='';
        if(isset($_POST['filters'])){
            $filter=$_POST['filters'];
            if(!empty($filter['quarterly'])){
                $quarterly=$this->global_filters->sql_quarterly($filter['quarterly'],"development_weekend_dates.weekend_date");
                $whr=self::extendwhr($whr,$quarterly,"AND");
            }
            if(!empty($filter['lifestatus'])){
                $whr=self::extendwhr($whr,"user.statusid IN (".$filter['lifestatus'].")","AND");
            }
        }
        $sql=$this->weekend_script->postlist().$whr;

        return $this->query($sql);
    }
}