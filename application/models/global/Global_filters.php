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
    }
    /** api/gateway?re=fetch/global_filters/getfilters */
    public function getfilters($type=null){
        $data=array();
        /** By lifestatus */
        if(empty($type)||$type==='lifestatus'){
            $sql=$this->global_script->getlifestatus();
            $lifestatus=$this->query($sql);$data['lifestatus']=$lifestatus;
        }
        /** By church */
        if(empty($type)||$type==='church') {
            $sql = $this->global_script->getcenters();
            $church = $this->query($sql);
            $data['church'] = $church;
        }
        /** By year */
        if(empty($type)||$type==='year') {
            $start=2000;$year=array();
            for($x=date('Y');$x>=$start;$x--){
                array_push($year,array("id"=>$x,"name"=>$x));
            }
            return $year;
        }
        if(!empty($type)&&array_key_exists($type,$data)){ return $data[$type]; }
        return $data;
    }
}