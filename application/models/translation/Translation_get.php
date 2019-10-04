<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 04/10/2019
 * Time: 12:29 PM
 */
class Translation_get extends Core_Model {
    /** api/gateway?re=fetch/translation_get/getlist */
    public function getlist() {
       // return;
        if (file_exists(APPPATH.'config/autoload.php')) { include(APPPATH.'config/autoload.php'); }
        if (file_exists(APPPATH.'config/'.ENVIRONMENT.'/autoload.php')) { include(APPPATH.'config/'.ENVIRONMENT.'/autoload.php'); }
        if ( ! isset($autoload)) { return; }
        if(count($autoload['language'])>0){ $langfiles=$autoload['language']; }

        $baselang='filipino';
        $idioms=array($baselang,'english');
        $collection= array();$code=array();
        foreach($idioms as $idiom){
            $this->lang->load($langfiles,$idiom,FALSE,TRUE,'',FALSE);
            $lang=$this->lang;
            foreach($lang->language as $var=>$trans) {
                if(in_array($var,$code)){
                    $key=array_search($var, $code);
                    //$collection[$key]['languages']=$trans;
                    array_push($collection[$key]['translations'],array($idiom=>$trans));
                    $collection[$key]['language'][$idiom]=$trans;
                } else {
                    array_push($collection,array('variable'=>$var,'language'=>array($idiom=>$trans),'translations'=>array(array($idiom=>$trans))));
                    array_push($code,$var);
                }

            }
        }
        return $collection;
    }
    function g(){

    }
}