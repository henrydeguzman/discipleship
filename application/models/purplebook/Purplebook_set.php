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
    /** api/gateway?re=fetch/purplebook_set/markasdone */
    public function markasdone(){
        $rows=isset($_POST['rows'])?$_POST['rows']:null;
        if(empty($rows)){ return array("success"=>false,"info"=>"no data."); }
        $done=isset($_POST['done'])?$_POST['done']:array();
        $result=array();

        /** register total once. */
        $total=count($rows);
        if(count($done)==0&&count($rows)>0){
            $this->update('development_purplebook_dates',array("total"=>$total),'purplebookid='.$rows[0]['purplebookid']);
        }

        foreach($rows as $row){
            if(!in_array($row['userid'],$done)){
                $_POST=$row;
                array_push($done,$row['userid']); $result=self::addtolist($row['userid'], $row['purplebookid'], $row['churchcommunityid']);
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
    private function addtolist($userid=null,$purplebookid=null,$churchcommunityid=null){
        if(empty($userid)){ return array("success"=>false,"info"=>"Invalid user");}
        if(empty($purplebookid)){ return array("success"=>false,"info"=>"Invalid weekendid");}
        if(empty($churchcommunityid)){ return array("success"=>false,"info"=>"Invalid churchcommunity");}
        return $this->insert('development_purplebook',array("userid"=>$userid,"purplebookid"=>$purplebookid,"churchcommunityid"=>$churchcommunityid));
    }
}