<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 21/06/2019
 * Time: 2:27 PM
 */
class settings_get extends core_model {
    /** api/gateway?re=fetch/settings_get/getdataform */
    public function getdataform(){
        $values=array();
        $this->load->model('one2one/one2one_get','one2onemod');
        $values['chapters']=$this->one2onemod->chapters();
        foreach ($values['chapters'] as $value){
            if($value->active=='1'){
                $values['chapteractive']=$value->id;
            }
        }
        return $values;
    }
}