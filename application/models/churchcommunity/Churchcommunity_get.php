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
        $this->load->model('global/global_filters','global_filters');
        parent::__construct();
    }
    /** api/gateway?re=fetch/churchcommunity_get/processdate */
    public function processdate(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr="WHERE a.churchcommunity_date >= CURDATE()  AND a.total=0 AND churchid='$churchid'";
        $sql=$this->churchcommunity_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/churchcommunity_get/dates */
    public function dates(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $sql=$this->churchcommunity_script->getdates()." WHERE a.churchid='$churchid' ORDER BY a.churchcommunity_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/churchcommunity_get/getchurchcommunitylist/$churchcommunityid */
    public function getchurchcommunitylist($churchcommunityid=null){
        $churchcommunityid=isset($_POST['churchcommunityid'])?$_POST['churchcommunityid']:$churchcommunityid;
        if(empty($churchcommunityid)){ return array(); }
        $toprow=false;$whr="";
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->churchcommunity_script->getchurchcommunitylist($this->_getsecureid($churchcommunityid)).$whr;
        return $this->query($sql,$toprow);
    }
    /** api/gateway?re=fetch/churchcommunity_get/postlist */
    public function postlist(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr="WHERE development_purplebook.devpurplebookid is null AND development_churchcommunity_dates.churchid='$churchid'";$tablefilter=array();
        if(isset($_POST['filters'])){
            $filter=$_POST['filters'];
            if(!empty($filter['quarterly'])){
                $quarterly=$this->global_filters->sql_quarterly($filter['quarterly'],"development_churchcommunity_dates.churchcommunity_date");
                $whr=self::extendwhr($whr,$quarterly,"AND");
            }
            if(!empty($filter['lifestatus'])){
                $whr=self::extendwhr($whr,"user.statusid IN (".$filter['lifestatus'].")","AND");
            }
        } else {
            /** default filters */
            // quarterly
            $_a=$this->global_filters->getquarter(date('Y'),'current');
            $default_filter=$this->global_filters->sql_quarterly($_a[0]['id'],"development_churchcommunity_dates.churchcommunity_date");
            array_push($tablefilter,$_a);
            $whr=self::extendwhr($whr,$default_filter,"AND");
        }

        $sql=$this->churchcommunity_script->postlist().$whr;
        $result=$this->query($sql,null,true);
        $result['filters']=$tablefilter;
        return $result;
    }
}