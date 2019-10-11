<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 11/10/2019
 * Time: 9:54 PM
 */
class Empleaders_set extends Core_Model {
    public function __construct(){
    }
    /** api/gateway?re=fetch/empleaders_set/setdate */
    public function setdate(){
        $churchid=$this->data_app_get->getchurch('churchid');
        $date=isset($_POST['empleaders_date'])?$_POST['empleaders_date']:null;
        if(empty($date)){ return array("success"=>false,"info"=>"Date is required!");}
        return $this->insert('development_empleaders_dates',array(
            "empleaders_date"=>$date,"churchid"=>$churchid
        ));
    }
    /** api/gateway?re=fetch/empleaders_set/remove */
    public function remove(){
        $id=isset($_POST['id'])?$_POST['id']:0; if(empty($id)){ return array("success"=>false,"info"=>"invalid empowering leaders date."); }
        return $this->delete('development_empleaders_dates','empleadersid='.$id);
    }
    /** api/gateway?re=fetch/empleaders_set/markasdone */
    public function markasdone(){
        $rows=isset($_POST['rows'])?$_POST['rows']:null;
        if(empty($rows)){ return array("success"=>false,"info"=>"no data."); }
        $done=isset($_POST['done'])?$_POST['done']:array();
        $result=array();

        /** register total once. */
        $total=count($rows);
        if(count($done)==0&&count($rows)>0){
            $this->update('development_empleaders_dates',array("total"=>$total),'empleadersid='.$rows[0]['empleadersid']);
        }

        foreach($rows as $row){
            if(!in_array($row['userid'],$done)){
                $_POST=$row;
                array_push($done,$row['userid']); $result=self::addtolist($row['userid'], $row['makingdisciplesid'], $row['empleadersid']);
                break;
            }
        }
        $result['done']=$done;
        $result['successcnt']=count($done);
        $result['total']=$total;
        return $result;
    }
    private function addtolist($userid=null,$makingdisciplesid=null,$empleadersid=null){
        if(empty($userid)){ return array("success"=>false,"info"=>"Invalid user");}
        if(empty($makingdisciplesid)){ return array("success"=>false,"info"=>"Invalid making disciplesid");}
        if(empty($empleadersid)){ return array("success"=>false,"info"=>"Invalid empleadersid");}
        return $this->insert('development_empleaders',array("userid"=>$userid,"empleadersid"=>$empleadersid,"makingdisciplesid"=>$makingdisciplesid));
    }
}