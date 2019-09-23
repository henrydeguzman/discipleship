<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 12/09/2019
 * Time: 6:11 PM
 */
class Vg_intern extends Core_Model {
    public function __construct(){
        $this->script->load('vg_intern_script');
        $this->load->model('one2one/one2one_get','one2one_get');
    }
    /** api/gateway?re=fetch/vg_intern/set */
    public function set(){
        $value=isset($_POST['value'])?$_POST['value']:0;
        if($value=='0'){
            $internid=isset($_POST['internid'])?$_POST['internid']:0; if(empty($internid)){ return array("success"=>false,"info"=>"Invalid internid"); }
            $result=$this->delete('user_vg_intern',"internid=".$internid);
        } else {
            $on2one=$this->one2one_get->getinfo($_POST['userid']);
            if($on2one->leaderid>0){
                $vgid=isset($_POST['vgid'])?$_POST['vgid']:0; if(empty($vgid)){ return array("success"=>false,"info"=>"Invalid Victory Group"); }
                $userid=isset($_POST['userid'])?$_POST['userid']:0; if(empty($userid)){ return array("success"=>false,"info"=>"Invalid User"); }
                $result=$this->insert('user_vg_intern',array("statusid"=>1,"datecreated"=>self::datetime(),"vgid"=>$vgid,"userid"=>$userid));
            } else {
                return array("success"=>false,"info"=>"This user need to do one2one first.","type"=>"notify");
            }
        }
        return $result;
    }
}