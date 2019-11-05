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
          $churchid = $this->data_app_get->getchurch('churchid');
        $sql=$this->weekend_script->getdates()." WHERE a.churchid='$churchid' ORDER BY a.weekend_date desc";
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
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr="WHERE a.weekend_date >= CURDATE()  AND a.total=0 AND a.churchid='$churchid'";
        $sql=$this->weekend_script->getdates().$whr;
        return $this->query($sql,true);
    }
    /** api/gateway?re=fetch/weekend_get/postlist */
    public function postlist(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr= "WHERE development_churchcommunity.devchurchcommunityid is null AND development_weekend_dates.churchid='$churchid'";$tablefilter=array();
        if(isset($_POST['filters'])){
            $filter=$_POST['filters'];
            if(!empty($filter['quarterly'])){
                $quarterly=$this->global_filters->sql_quarterly($filter['quarterly'],"development_weekend_dates.weekend_date");
                $whr=self::extendwhr($whr,$quarterly,"AND");
            }
            if(!empty($filter['lifestatus'])){
                $whr=self::extendwhr($whr,"user.statusid IN (".$filter['lifestatus'].")","AND");
            }
        } else {
            /** default filters */
            // quarterly
            $_a=$this->global_filters->getquarter(date('Y'),'current');
            $default_filter=$this->global_filters->sql_quarterly($_a[0]['id'],"development_weekend_dates.weekend_date");
            array_push($tablefilter,$_a);
            $whr=self::extendwhr($whr,$default_filter,"AND");
        }

        $sql=$this->weekend_script->postlist().$whr;

        $result=$this->query($sql,null,true);
        $result['filters']=$tablefilter;
        return $result;
    }
}