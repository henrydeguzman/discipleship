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
        return $this->insert('development_churchcommunity_dates',array(
            "churchcommunity_date"=>$date,"churchid"=>$churchid
        ));
    }
    /** api/gateway?re=fetch/churchcommunity_set/remove */
    public function remove(){
        $id=isset($_POST['id'])?$_POST['id']:0; if(empty($id)){ return array("success"=>false,"info"=>"invalid church community date."); }
        return $this->delete('development_churchcommunity_dates','churchcommunityid='.$id);
    }
    /** api/gateway?re=fetch/churchcommunity_set/markasdone */
    public function markasdone(){
        $rows=isset($_POST['rows'])?$_POST['rows']:null;
        if(empty($rows)){ return array("success"=>false,"info"=>"no data."); }
        $done=isset($_POST['done'])?$_POST['done']:array();
        $result=array();

        /** register total once. */
        $total=count($rows);
        if(count($done)==0&&count($rows)>0){
            $this->update('development_churchcommunity_dates',array("total"=>$total),'churchcommunityid='.$rows[0]['churchcommunityid']);
        }

        foreach($rows as $row){
            if(!in_array($row['userid'],$done)){
                $_POST=$row;
                array_push($done,$row['userid']); $result=self::addtolist($row['userid'], $row['weekendid'], $row['churchcommunityid']);
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
    private function addtolist($userid=null,$weekendid=null,$churchcommunityid=null){
        if(empty($userid)){ return array("success"=>false,"info"=>"Invalid user");}
        if(empty($weekendid)){ return array("success"=>false,"info"=>"Invalid weekendid");}
        if(empty($churchcommunityid)){ return array("success"=>false,"info"=>"Invalid churchcommunity");}
        return $this->insert('development_churchcommunity',array("userid"=>$userid,"weekendid"=>$weekendid,"churchcommunityid"=>$churchcommunityid));
    }
}