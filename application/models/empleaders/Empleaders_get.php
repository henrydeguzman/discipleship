<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 9:54 PM
 */
class Empleaders_get extends Core_Model {
    public function __construct(){
        $this->script->load('empleaders_script');
        $this->load->model('global/global_filters','global_filters');
        parent::__construct();
    }
    /** api/gateway?re=fetch/makingdisciples_get/dates */
    public function dates(){
        $sql=$this->empleaders_script->getdates()." ORDER BY a.empleaders_date desc";
        return $this->query($sql);
    }
    /** api/gateway?re=fetch/empleaders_get/processdate */
    public function processdate(){
        $whr="WHERE a.empleaders_date >= CURDATE()  AND a.total=0";
        $sql=$this->empleaders_script->getdates().$whr;
        $result=$this->query($sql,true);
        if($result){ $result->id=$this->_secureid($result->id); }
        return $result;
    }
    /** api/gateway?re=fetch/empleaders_get/candidates */
    public function candidates($empleadersid=null){
        //return $this->_getsecureid($makingdisciplesid);
        $empleadersid=isset($_POST['empleadersid'])?$_POST['empleadersid']:$empleadersid;
        if(empty($empleadersid)){ return array(); }
        $toprow=false;$whr='';
        if(isset($_POST['rowid'])){ $toprow=true;$whr="AND a.userid=".$_POST['rowid']; }
        $sql=$this->empleaders_script->candidates($this->_getsecureid($empleadersid)).$whr;
        return $this->query($sql,$toprow);
    }
    /** api/gateway?re=fetch/makingdisciples_get/postlist */
    public function postlist(){
        $whr='';$tablefilter=array();
        if(isset($_POST['filters'])){
            $filter=$_POST['filters'];
            if(!empty($filter['quarterly'])){
                $quarterly=$this->global_filters->sql_quarterly($filter['quarterly'],"development_empleaders_dates.empleaders_date");
                $whr=self::extendwhr($whr,$quarterly,"AND");
            }
            if(!empty($filter['lifestatus'])){
                $whr=self::extendwhr($whr,"user.statusid IN (".$filter['lifestatus'].")","AND");
            }
        } else {
            /** default filters */
            // quarterly
            $_a=$this->global_filters->getquarter(date('Y'),'current');
            $default_filter=$this->global_filters->sql_quarterly($_a[0]['id'],"development_empleaders_dates.empleaders_date");
            array_push($tablefilter,$_a);
            $whr=self::extendwhr($whr,$default_filter,"AND");
        }

        $sql=$this->empleaders_script->postlist().$whr;

        $result=$this->query($sql,null,true);
        $result['filters']=$tablefilter;
        return $result;
    }
}