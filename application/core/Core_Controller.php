<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 10/18/2018
 * Time: 05:24 PM
 */
class Core_Controller extends CI_Controller {
    public function __construct() { parent::__construct(); }
    public function loadview(){
        if(isset($_GET['view'])){
            $dir='pages/';
            if(isset($_GET['dir'])){$dir=$_GET['dir'].'/';}else{}
            if(file_exists(VIEWPATH.$dir.$_GET['view'])){
                $this->load->view($dir.$_GET['view']);
            }
        }
    }
}