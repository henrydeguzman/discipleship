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
        $this->load->model('global/global_filters','global_filters');
        parent::__construct();
    }
    /** api/gateway?re=fetch/makingdisciples_get/processdate */
    public function processdate(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $whr="WHERE a.makingdisciples_date >= CURDATE()  AND a.total=0 AND a.churchid='$churchid'";
        $sql=$this->makingdisciples_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/makingdisciples_get/dates */
    public function dates(){
          $churchid = $this->data_app_get->getchurch('churchid');
        $sql=$this->makingdisciples_script->getdates()." WHERE a.churchid='$churchid' ORDER BY a.makingdisciples_date desc";
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
    /** api/gateway?re=fetch/makingdisciples_get/postlist */
    public function postlist(){
          $churchid = $this->data_app_get->getchurch('churchid');
          $whr = "WHERE development_makingdisciples_dates.churchid='$churchid'";$tablefilter=array();
        if(isset($_POST['filters'])){
            $filter=$_POST['filters'];
            if(!empty($filter['quarterly'])){
                $quarterly=$this->global_filters->sql_quarterly($filter['quarterly'],"development_makingdisciples_dates.makingdisciples_date");
                $whr=self::extendwhr($whr,$quarterly,"AND");
            }
            if(!empty($filter['lifestatus'])){
                $whr=self::extendwhr($whr,"user.statusid IN (".$filter['lifestatus'].")","AND");
            }
        } else {
            /** default filters */
            // quarterly
            $_a=$this->global_filters->getquarter(date('Y'),'current');
            $default_filter=$this->global_filters->sql_quarterly($_a[0]['id'],"development_makingdisciples_dates.makingdisciples_date");
            array_push($tablefilter,$_a);
            $whr=self::extendwhr($whr,$default_filter,"AND");
        }

        $sql=$this->makingdisciples_script->postlist().$whr;

        $result=$this->query($sql,null,true);
        $result['filters']=$tablefilter;
        return $result;
    }
}