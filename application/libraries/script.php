<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 12/8/2018
 * Time: 02:39 PM
 */
class script {
    var $ci;
    function __construct() { $this->ci=&get_instance(); }
    function load($cls){ $this->ci->load->library('generator/'.$cls,NULL,$cls); }
}