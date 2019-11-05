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
    /** api/gateway?re=fetch/purplebook_set/markascandidate */
    public function markascandidate(){
        $users = isset($_POST['users'])?$_POST['users']:null; if(empty($users)) { return array('success'=>false,'info'=>'No user selected'); }
        foreach($users as $user){
            $result = $this->insert('development_makingdisciples',array('userid'=>$user['userid']));
            if(!$result) { $result=false; break; }
        }
        return $result;
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
            if(!in_array($row['devpurplebookid'],$done)){
                $_POST=$row;
                array_push($done,$row['devpurplebookid']); $result=self::addtolist($row['devpurplebookid'], $row['purplebookid']);
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
    private function addtolist($devpurplebookid=null,$purplebookid=null){
        if(empty($devpurplebookid)){ return array("success"=>false,"info"=>"Invalid processid");}
        if(empty($purplebookid)){ return array("success"=>false,"info"=>"Invalid weekendid");}
        return $this->update('development_purplebook',array("purplebookid"=>$purplebookid),'devpurplebookid='.$devpurplebookid);
    }
}