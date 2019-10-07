<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 8:13 PM
 */
class Churchcommunity_set extends Core_Model {
    public function __construct(){}
    /** api/gateway?re=fetch/churchcommunity_set/setdate */
    public function setdate(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $date=isset($_POST['churchcommunity_date'])?$_POST['churchcommunity_date']:null;
        if(empty($date)){ return array("success"=>false,"info"=>"Date is required!");}
        return $this->insert('development_churchcommunity_date',array(
            "churchcommunity_date"=>$date,"churchid"=>$churchid
        ));
    }
    /** api/gateway?re=fetch/churchcommunity_set/remove */
    public function remove(){
        $id=isset($_POST['id'])?$_POST['id']:0; if(empty($id)){ return array("success"=>false,"info"=>"invalid weekend date."); }
        return $this->delete('development_churchcommunity_date','churchcommunityid='.$id);
    }
}