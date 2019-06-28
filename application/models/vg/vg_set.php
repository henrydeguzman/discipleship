<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 2/16/2019
 * Time: 09:15 PM
 */
class vg_set extends core_model {
    public function __construct(){}
    /** api/gateway?re=fetch/vg_set/edit */
    public function edit(){
        $userid=isset($_POST['userid'])?$_POST['userid']:0; if(empty($userid)){ return array('success'=>false,'info'=>'invalid userid'); }
        $value=isset($_POST['value'])?$_POST['value']:0;
        $leaderid=0;
        if($value==1){$leaderid=$this->data_app_get->idCurrentUser();}
        $data=array('leaderid'=>$leaderid,'dateadded'=>self::datetime());

        return $this->update('user_vg',$data,'userid='.$userid);
    }
    /** api/gateway?re=fetch/vg_set/set_info */
    public function set_info(){
        $leaderid=$this->data_app_get->idCurrentUser();
        $this->load->model('vg/vg_get','vgget');
        $vginfo=$this->vgget->vginfo();
        $dayofweek=isset($_POST['dayoftheweek'])?$_POST['dayoftheweek']:false;
        $time=isset($_POST['time'])?$_POST['time']:false;
        $venue=isset($_POST['venue'])?$_POST['venue']:false;

        if($dayofweek){ $data['dayoftheweek']=$dayofweek; }
        if($time){ $data['time']=date('H:i:s', strtotime($time)); }
        if($venue){ $data['venue']=$venue; }

        if($vginfo->dayoftheweek===null){
            $data['leaderid']=$leaderid;
            $data['dateadded']=self::datetime();
            return $this->insert('user_vg_info',$data);
        }
        else{
            $data['dateupdated']=self::datetime();
            return $this->update('user_vg_info',$data,'leaderid='.$leaderid);
        }
    }
    /** api/gateway?re=fetch/vg_set/set_vg */
    public function set_vg($userid=0,$value=0){
        $userid=isset($_POST['userid'])?$_POST['userid']:$userid; if(empty($userid)){ return array('success'=>false,'info'=>'invalid userid'); }
        $value=isset($_POST['value'])?$_POST['value']:$value;
        $leaderid=0;
        if($value==1){$leaderid=$this->data_app_get->idCurrentUser();}
        $this->load->model('vg/vg_get','vgget');
        $vginfo=$this->vgget->vginfo();
        if($vginfo){
            if($value){
                return $this->insert('user_vg_users',array('vgid'=>$vginfo->vgid,'userid'=>$userid,'dateadded'=>self::datetime()));
            }
            else{
                return $this->delete('user_vg_users','userid='.$userid);
            }

        }else{
            $result=$this->insert('user_vg',array('leaderid'=>$leaderid,'dateadded'=>self::datetime()),'userid='.$userid);
            return $this->insert('user_vg_users',array('vgid'=>$result['lastid'],'userid'=>$userid,'dateadded'=>self::datetime()));
        }
    }
}