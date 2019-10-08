<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 08/10/2019
 * Time: 9:03 PM
 */
class Makingdisciples_set extends Core_Model {
    /** api/gateway?re=fetch/makingdisciples_set/setdate */
    public function setdate(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $date=isset($_POST['makingdisciples_date'])?$_POST['makingdisciples_date']:null;
        if(empty($date)){ return array("success"=>false,"info"=>"Date is required!");}
        return $this->insert('development_makingdisciples_dates',array(
            "makingdisciples_date"=>$date,"churchid"=>$churchid
        ));
    }
    /** api/gateway?re=fetch/makingdisciples_set/remove */
    public function remove(){
        $id=isset($_POST['id'])?$_POST['id']:0; if(empty($id)){ return array("success"=>false,"info"=>"invalid making disciples date."); }
        return $this->delete('development_makingdisciples_dates','makingdisciplesid='.$id);
    }
}