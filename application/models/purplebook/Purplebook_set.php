<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 07/10/2019
 * Time: 10:04 PM
 */
class Purplebook_set extends Core_Model {
    public function __construct(){}
    /** api/gateway?re=fetch/purplebook_set/setdate */
    public function setdate(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $date=isset($_POST['purplebook_date'])?$_POST['purplebook_date']:null;
        if(empty($date)){ return array("success"=>false,"info"=>"Date is required!");}
        return $this->insert('development_purplebook_dates',array(
            "purplebook_date"=>$date,"churchid"=>$churchid
        ));
    }
    /** api/gateway?re=fetch/purplebook_set/remove */
    public function remove(){
        $id=isset($_POST['id'])?$_POST['id']:0; if(empty($id)){ return array("success"=>false,"info"=>"invalid weekend date."); }
        return $this->delete('development_purplebook_dates','purplebookid='.$id);
    }
}