<?php
/**
 * Created by PhpStorm.
 * User: henrilics
 * Date: 13/09/2019
 * Time: 4:17 PM
 */
class dashboard_get extends core_model {
    public function __construct() { }
    /** api/gateway?re=fetch/dashboard_get/getlist */
    public function getlist(){
        $this->load->model('reports/reports_get','reports_get');
        return $this->reports_get->getlist();
    }
}