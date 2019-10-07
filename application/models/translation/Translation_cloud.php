<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 05/10/2019
 * Time: 2:11 PM
 */
class Translation_cloud extends Core_Model {
    public function __construct() { $this->script->load('translation_script'); }

    /** api/gateway?re=fetch/translation_cloud/searchlist */
    public function searchlist(){
        $sql=$this->translation_script->searchcloudlist();
        return $this->query($sql);
    }
    /**
     * URL: api/gateway?re=fetch/translation_cloud/sync
     * WHAT: able to sync from system translation to cloud translation
     */
    /** api/gateway?re=fetch/translation_cloud/sync */
    public function sync(){
        $langs=$this->getlangs();
        foreach ($langs as $lang){
            if($lang==='english'){
                $result=$this->pushlang($lang);
            }
        }
        return $result;
    }
    private function pushlang($idiom=null,$data=null){
        if(empty($idiom)){ return array('success'=>false,'info'=>'invalid'); }
        $datetime=$this->datetime();
        //$this->db->trans_start();
        $data=array(
            "code"=>"trans_form_diagtitleffs"
        );
        $data['datecreated']=$datetime;
        return $this->updateinsert('translation',$data,'translationid=3');
        //$this->db->trans_complete();
    }
    private function getlangs(){
        $dir_to_check=array_slice(scandir(PATH_LANG), 2);$dirs=array();
        foreach ($dir_to_check as $item){ if (is_dir(PATH_LANG.$item)){ array_push($dirs, $item); } }
        return $dirs;
    }
}