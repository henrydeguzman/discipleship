<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 4/13/2019
 * Time: 11:04 PM
 */
class Profile_set extends Core_Model {
    public function __construct(){}
    /** api/gateway?re=fetch/profile_set/uploadphoto */
    public function uploadphoto(){
        // var_dump($_POST);       
        $curuser=$this->data_app_get->idCurrentUser();
        $file=$_FILES['file'];
        $upload=$this->fileupload->upload($file,'image',PATH_USERPHOTO);
        if($upload->result){
            $result=$this->insert("user_photo",array(
                "userid"=>$curuser,"datecreated"=>self::datetime(),
                "photo"=>$upload->name,"defaultname"=>$upload->default_filename
            ),$upload);
            $this->update('user',array('photoid'=>$result['lastid']),'userid='.$curuser);
            // update session
            $this->data_app_set->dataCurrentUser('photo',$upload->name);
            return $result;
        } else { return array("success"=>false,"info"=>"error upload","data"=>$upload); }
    }
}