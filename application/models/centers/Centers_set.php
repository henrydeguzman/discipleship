<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/14/2019
 * Time: 04:43 PM
 */
class Centers_set extends Core_Model {
    public function __construct()
    {

    }
    /** api/gateway?re=fetch/centers_set/create */
    public function create(){
        $id=isset($_POST['id'])?$_POST['id']:0;
        $name=isset($_POST['name'])?$_POST['name']:null;if(empty($name)){ return array("success"=>false,"info"=>"Name is required"); }
        $location=isset($_POST['location'])?$_POST['location']:null;if(empty($location)){ return array("success"=>false,"info"=>"Location is required"); }
        $data=array(
            "location"=>$location,
            "name"=>$name
        );
        if(empty($id)){
            /* weekend_settings */
            $result=$this->insert('church',$data);
            $this->insert('weekend_settings',array("churchid"=>$result['lastid']));
            return $result;
        }else{
            return $this->update('church',$data,'churchid='.$id);
        }

    }
}