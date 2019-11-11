<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 14/09/2019
 * Time: 11:07 PM
 */
class Global_filters extends Core_Model {
    public function __construct(){
        $this->script->load('global_script');
        $this->load->model('global/global_date','global_date');
    }
    /** api/gateway?re=fetch/global_filters/getfilters */
    public function getfilters($type=null){
        $data=array();$ismany=false;
        if(!empty($type)){
            $type=array_map('trim',explode(",",$type));
            if(count($type)>1){
                /** more than 1 */
                $ismany=true;
            }
        }
        /** By lifestatus */
        if(empty($type)||in_array('lifestatus',$type)){
            $sql=$this->global_script->getlifestatus();
            $lifestatus=$this->query($sql);
            $data['lifestatus']=array("id"=>"lifestatus","name"=>"Life Status","childs"=>$lifestatus);
        }
        /** By church */
        if(empty($type)||in_array('church',$type)) {
            $sql = $this->global_script->getcenters();
            $church = $this->query($sql);
            $data['church']=array("id"=>"church","name"=>"Church","childs"=>$church);
        }
        /** By year */
        if(empty($type)||in_array('year',$type)) {
            $start=2000;$year=array();
            for($x=date('Y');$x>=$start;$x--){
                array_push($year,array("id"=>$x,"name"=>$x));
            }
            $data['year']=array("id"=>"year","name"=>"Year","childs"=>$year);
        }
        /** Quarterly */
        if(empty($type)||in_array('quarterly',$type)){
            $quarter=self::getquarter();
            $data['quarterly']=array("id"=>"quarterly","name"=>"Quarterly","childs"=>$quarter);
        }

        if($ismany){
            $collection=array();
            foreach ($type as $order){
                array_push($collection,$data[$order]);
            }
            return $collection;
        } else { return $data; }

    }
    private function getquarter($year=null){
        if(empty($year)){ $year = date('Y'); }
        $quarter=array();
        $global_date=$this->global_date;
        //return $dateStr;
        $q1=$global_date->get_dates_of_quarter(1,$year,'Y-m-d');
        $q2=$global_date->get_dates_of_quarter(2,$year,'Y-m-d');
        $q3=$global_date->get_dates_of_quarter(3,$year,'Y-m-d');
        $q4=$global_date->get_dates_of_quarter(4,$year,'Y-m-d');
        array_push($quarter,array("name"=>"Q1 ".self::formatdate($q1['start'])." to ".self::formatdate($q1['end']),"id"=>$q1['start']."=".$q1['end']));
        array_push($quarter,array("name"=>"Q2 ".self::formatdate($q2['start'])." to ".self::formatdate($q2['end']),"id"=>$q2['start']."=".$q2['end']));
        array_push($quarter,array("name"=>"Q3 ".self::formatdate($q3['start'])." to ".self::formatdate($q3['end']),"id"=>$q3['start']."=".$q3['end']));
        array_push($quarter,array("name"=>"Q4 ".self::formatdate($q4['start'])." to ".self::formatdate($q4['end']),"id"=>$q4['start']."=".$q4['end']));
        return $quarter;
    }
    private function formatdate($date,$format='F j, Y'){
        return date($format,strtotime($date));
    }
}