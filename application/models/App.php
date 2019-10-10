<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 4/14/2019
 * Time: 02:26 PM
 */
class App extends Core_Model {
    public function __construct(){ $this->load->model('links'); }

    /** api/gateway?re=fetch/app/init */
    public function init(){
        return array(
            "pathvalue"=>array("base_url"=>base_url(),"userphoto"=>PATH_USERPHOTO)
        );
    }
    /** api/gateway?re=fetch/app/pagecontrol */
    public function pagecontrol($page){
        $control=true;
        switch ($page){
            case "dashboard":
                break;
            case "discipleship": /** my journey */
                break;
            case "vg":
                break;
            case "schedules":
                break;
            case "reports":

                break;
            case "one2one":

                break;
            case "victory_weekend":
                break;
            case "church_community":

                break;
            case "purple_book":
                break;
            case "making_disciples":

                break;
            case "empowering_leaders":

                break;
            case "vg;interns":

                break;
            case "leadership113":

                break;
            case "translation":
                break;
            case "admin;users":

                break;
            case "admin;centers":

                break;
        };
        return $control;
    }
}