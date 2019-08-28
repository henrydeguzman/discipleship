<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:09
 */
class weekend_set extends core_model {
    public function __construct(){
        $this->load->model('users/users_set','usersset');
    }
    /** api/gateway?re=fetch/weekend_set/remove */
    public function remove(){
        $dateid=isset($_POST['weekend_dateid'])?$_POST['weekend_dateid']:0; if(empty($dateid)){ return array("success"=>false,"info"=>"invalid weekend date."); }
        return $this->delete('weekend_dates','weekend_dateid='.$dateid);
    }
    /** api/gateway?re=fetch/weekend_set/setdate */
    public function setdate(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $date=isset($_POST['weekend_date'])?$_POST['weekend_date']:null;
        if(empty($date)){ return array("success"=>false,"info"=>"Date is required!");}
        return $this->insert('weekend_dates',array(
            "weekend_date"=>$date,"churchid"=>$churchid
        ));
    }
    /** api/gateway?re=fetch/weekend_set/setchapter */
    public function setchapter(){
        $chapterid=isset($_POST['chapterid'])?$_POST['chapterid']:0; if(empty($chapterid)){ return array("success"=>false,"info"=>"Invalid chapter");}
        $this->load->model('weekend/weekend_get','weekendget');
        $result=$this->weekendget->getchapter();
        if(empty($result)){
            $churchid=$this->data_app_get->getchurch('churchid');
            return $this->insert('weekend_settings',array("chapterid"=>$chapterid,"churchid"=>$churchid));
        }
        else{
            return $this->update('weekend_settings',array("chapterid"=>$chapterid),'weekendsetid='.$result->id);
        }
    }
    /** api/gateway?re=fetch/weekend_set/createaccnt */
    public function createaccnt(){
        return $this->usersset->verifytomember();
    }
}