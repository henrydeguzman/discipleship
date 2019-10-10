<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 10/18/2018
 * Time: 05:24 PM
 */
class Core_Controller extends CI_Controller {
    public function __construct() { parent::__construct(); $this->load->model('app'); }
    const dir_page='pages/';
    const dir_templates='templates';
    const dir_errors='templates/error/';
    public function loadview(){ if(isset($_GET['view'])){ $dir=self::dir_page; if(isset($_GET['dir'])){$dir=$_GET['dir'].'/';} if(file_exists(VIEWPATH.$dir.$_GET['view'])){ $this->load->view($dir.$_GET['view']); } } }
    public function loadpage(){
        if(isset($_GET['view'])&&isset($_GET['page'])){
            $dir=self::dir_page;
            $pagecontrol=$this->app->pagecontrol($_GET['page']);
            if(!$pagecontrol){
                $this->load->view(self::dir_errors.'403.html');
            } else if(file_exists(VIEWPATH.$dir.$_GET['view'])){
                $this->load->view($dir.$_GET['view']);
            } else {
                $this->load->view(self::dir_errors.'404.html');
            }
        }
    }
}