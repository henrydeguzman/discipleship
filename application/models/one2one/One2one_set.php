<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 1/19/2019
 * Time: 10:19 AM
 */
class One2one_set extends Core_Model {
    public function __construct(){}
    public function create(){ /** api/gateway?re=fetch/one2one_set/create */
        $this->load->model('users/users_set','uset');
        return $this->uset->create(false);
    }
    public function add(){ /** api/gateway?re=fetch/one2one_set/edit */
        $o2oid=isset($_POST['o2oid'])?$_POST['o2oid']:0;
        $userid=isset($_POST['userid'])?$_POST['userid']:0;
        $leaderid=isset($_POST['leaderid'])?$_POST['leaderid']:0;
        $chapter=isset($_POST['chapter'])?$_POST['chapter']:null;
        $data=array();
        if(!empty($chapter)){ $data['chapter']=$chapter; }
        if(!empty($leaderid)){ $data['leaderid']=$leaderid; }
        if(!empty($userid)){ $data['userid']=$userid; }

        if(!empty($o2oid)){
            return $this->update('one2one',$data,'o2oid='.$o2oid);
        } else {
            if(empty($userid)){ return array('success'=>false,'info'=>'Cannot find user'); }
            $data['datecreated']=self::datetime();
            return $this->insert('one2one',$data);
        }
    }
}