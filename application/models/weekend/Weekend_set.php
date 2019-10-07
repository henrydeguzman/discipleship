<?php
/**
 * Created by PhpStorm
 * User : Henrilics
 * Date : 2019-05-25
 * Time : 20:09
 */
class Weekend_set extends Core_Model {
    public function __construct(){
        $this->load->model('users/users_set','usersset');
    }
    /** api/gateway?re=fetch/weekend_set/remove */
    public function remove(){
        $id=isset($_POST['id'])?$_POST['id']:0; if(empty($id)){ return array("success"=>false,"info"=>"invalid weekend date."); }
        return $this->delete('development_weekend_dates','weekendid='.$id);
    }
    /** api/gateway?re=fetch/weekend_set/setdate */
    public function setdate(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $date=isset($_POST['weekend_date'])?$_POST['weekend_date']:null;
        if(empty($date)){ return array("success"=>false,"info"=>"Date is required!");}
        return $this->insert('development_weekend_dates',array(
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
            return $this->insert('development_weekend_settings',array("chapterid"=>$chapterid,"churchid"=>$churchid));
        }
        else{
            return $this->update('development_weekend_settings',array("chapterid"=>$chapterid),'weekendsetid='.$result->id);
        }
    }
    private function addtolist($userid,$weekendid){
        if(empty($userid)){ return array("success"=>false,"info"=>"Invalid user");}
        if(empty($weekendid)){ return array("success"=>false,"info"=>"Invalid weekendid");}
        return $this->insert('development_weekend',array("userid"=>$userid,"weekendid"=>$weekendid));
    }
    /** api/gateway?re=fetch/weekend_set/markasdone */
    public function markasdone(){
        $rows=isset($_POST['rows'])?$_POST['rows']:null;
        if(empty($rows)){ return array("success"=>false,"info"=>"no data."); }
        $done=isset($_POST['done'])?$_POST['done']:array();
        $result=array();

        /** register total once. */
        $total=count($rows);
        if(count($done)==0&&count($rows)>0){
            $this->update('development_weekend_dates',array("total"=>$total),'weekendid='.$rows[0]['weekendid']);
        }

        foreach($rows as $row){
            if(!in_array($row['id'],$done)){
                $_POST=$row;
                $result=$this->usersset->verifytomember($row['id'],$row['email']);
                // remove password
                $result['password']='Ops it\'s Confidential :)';
                if($result['success']){ array_push($done,$row['id']); self::addtolist($row['id'], $row['weekendid']); }
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
}