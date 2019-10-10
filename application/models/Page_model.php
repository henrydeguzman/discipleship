<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 10/10/2019
 * Time: 6:47 PM
 */
class Page_model extends Core_Model {
    public function __construct(){ $this->load->model('links'); $this->script->load('rights_script'); }
    /** api/gateway?re=fetch/page_model/rights */
    public function rights($page=null){
        /**
         * This function check if you have rights to certain page with the collection of rights assign on the page control
         * NOTE: Developer and Super admin profile will have autoaccess to all pages.
         */
        $autoaccess=array('5','4');
        $profileid=$this->data_app_get->profileidCurrentUser();
        if(in_array($profileid,$autoaccess)){ return true; }
        $curuserid=$this->data_app_get->idCurrentUser();$toponly=false;
        $whr="WHERE page_control_rights.userid=$curuserid";
        if($page!=null){ $whr=self::extendwhr($whr,'page.code="'.$page.'"',"AND"); $toponly=true; }
        $sql=$this->rights_script->pagecontrol().$whr." GROUP BY page.code";
        $result=$this->query($sql,$toponly);
        return $page!=null?$result?true:false:$result;
    }
    /** api/gateway?re=fetch/page_model/profilecontrol */
    public function profilecontrol($page=null){
        /**
         * This function check if you have rights to certain page with profileid
         */
        $whr='';$toponly=false;
        if($page!=null){ $whr='AND page.code="'.$page.'"'; $toponly=true; }
        $sql=$this->rights_script->profilecontrol().$whr;
        $result=$this->query($sql,$toponly);
        return $page!=null?$result?true:false:$result;
    }
    /** api/gateway?re=fetch/page_model/control */
    public function control($page){
        /** check if have rights on page_control_rights */
        $result=self::rights($page);
        /** check if have rights on per profileid */
        if(!$result){ $result=self::profilecontrol($page); }
        return $result;
    }
}