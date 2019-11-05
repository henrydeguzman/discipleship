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
        $this->load->model('global/global_filters','global_filters');
        parent::__construct();
    }
    /** api/gateway?re=fetch/purplebook_get/processdate */
    public function processdate(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr="WHERE a.purplebook_date >= CURDATE()  AND a.total=0 AND a.churchid='$churchid'";
        $sql=$this->purplebook_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/purplebook_get/dates */
    public function dates(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $sql=$this->purplebook_script->getdates()." WHERE a.churchid='$churchid' ORDER BY a.purplebook_date desc";
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
    /** api/gateway?re=fetch/purplebook_get/postlist */
    public function postlist(){
          $churchid = $this->data_app_get->getchurch('churchid');
          $whr = "WHERE development_makingdisciples.devmakingdisciplesid is null AND development_purplebook_dates.churchid='$churchid'";$tablefilter=array();
        if(isset($_POST['filters'])){
            $filter=$_POST['filters'];
            if(!empty($filter['quarterly'])){
                $quarterly=$this->global_filters->sql_quarterly($filter['quarterly'],"development_purplebook_dates.purplebook_date");
                $whr=self::extendwhr($whr,$quarterly,"AND");
            }
            if(!empty($filter['lifestatus'])){
                $whr=self::extendwhr($whr,"user.statusid IN (".$filter['lifestatus'].")","AND");
            }
        } else {
            /** default filters */
            // quarterly
            $_a=$this->global_filters->getquarter(date('Y'),'current');
            $default_filter=$this->global_filters->sql_quarterly($_a[0]['id'],"development_purplebook_dates.purplebook_date");
            array_push($tablefilter,$_a);
            $whr=self::extendwhr($whr,$default_filter,"AND");
        }
        $sql=$this->purplebook_script->postlist().$whr;
        $result=$this->query($sql,null,true);
        $result['filters']=$tablefilter;
        return $result;
    }
}