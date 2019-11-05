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
    public function markascandidate(){
        $users = isset($_POST['users'])?$_POST['users']:null; if(empty($users)) { return array('success'=>false,'info'=>'No user selected'); }
        foreach($users as $user){
            $result = $this->insert('development_purplebook',array('userid'=>$user['userid']));
            if(!$result) { $result=false; break; }
        }
        return $result;
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
            if(!in_array($row['devchurchcommunityid'],$done)){
                $_POST=$row;
                array_push($done,$row['devchurchcommunityid']); $result=self::addtolist($row['devchurchcommunityid'], $row['churchcommunityid']);
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
    private function addtolist($devchurchcommunityid=null,$churchcommunityid=null){
        if(empty($devchurchcommunityid)){ return array("success"=>false,"info"=>"Invalid processid");}
        if(empty($churchcommunityid)){ return array("success"=>false,"info"=>"Invalid churchcommunity");}
        return $this->update('development_churchcommunity',array("churchcommunityid"=>$churchcommunityid),"devchurchcommunityid=".$devchurchcommunityid);
    }
}