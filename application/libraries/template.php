<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 10/18/2018
 * Time: 12:13 PM
 */
class template {
    var $ci;
    function __construct() { $this->ci=&get_instance(); }
    function load($body_view=null,$data=null,$layout='user'){
        if($layout==='login'){ $this->content('templates/login/'.$body_view,$data);return; }
        $this->ci->load->view("templates/".$layout."/header.html");
        $this->ci->load->view("templates/".$layout."/sidebar.html");
        $this->ci->load->view("templates/".$layout."/bcrumbs.html");
        $this->ci->load->view("templates/".$layout."/content.html");
        //$this->content($body_view,$data);
        $this->ci->load->view("templates/".$layout."/footer.html");
        $this->ci->load->view("templates/".$layout."/rightmenu.html");
        $this->ci->load->view("templates/".$layout."/javascripts.html");
    }
    function content($body_view,$data){
        if(!is_null($body_view)){
            $isexist=false;
            if(file_exists(APPPATH.'views/'.$body_view)){ $body_view_path=$body_view;$isexist=true; }
            else if(file_exists(APPPATH.'views/'.$body_view.'.php')){ $body_view_path=$body_view.'.php';$isexist=true; }
            if($isexist){ $this->ci->load->view($body_view_path, $data); }
        } else {
            $this->ci->load->view("", $data);
        }
    }
}