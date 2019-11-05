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
    /** api/gateway?re=fetch/makingdisciples_set/markascandidate */
    public function markascandidate(){
        $users = isset($_POST['users'])?$_POST['users']:null; if(empty($users)) { return array('success'=>false,'info'=>'No user selected'); }
        foreach($users as $user){
            $result = $this->insert('development_empleaders',array('userid'=>$user['userid']));
            if(!$result) { $result=false; break; }
        }
        return $result;
    }
    /** api/gateway?re=fetch/makingdisciples_set/markasdone */
    public function markasdone(){
        $rows=isset($_POST['rows'])?$_POST['rows']:null;
        if(empty($rows)){ return array("success"=>false,"info"=>"no data."); }
        $done=isset($_POST['done'])?$_POST['done']:array();
        $result=array();

        /** register total once. */
        $total=count($rows);
        if(count($done)==0&&count($rows)>0){
                $this->update('development_makingdisciples_dates',array("total"=>$total),'makingdisciplesid='.$rows[0]['makingdisciplesid']);
        }

        foreach($rows as $row){
            if(!in_array($row['devmakingdisciplesid'],$done)){
                $_POST=$row;
                array_push($done,$row['devmakingdisciplesid']); $result=self::addtolist($row['devmakingdisciplesid'], $row['makingdisciplesid']);
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
    private function addtolist($devmakingdisciplesid=null,$makingdisciplesid=null){
        if(empty($devmakingdisciplesid)){ return array("success"=>false,"info"=>"Invalid processid");}
        if(empty($makingdisciplesid)){ return array("success"=>false,"info"=>"Invalid making disciplesid");}
        return $this->update('development_makingdisciples',array("makingdisciplesid"=>$makingdisciplesid),'devmakingdisciplesid='.$devmakingdisciplesid);
    }
}