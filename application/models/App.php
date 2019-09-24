<?php
/**
 * Created by PhpStorm.
 * User: Actino-Dev
 * Date: 4/14/2019
 * Time: 02:26 PM
 */
class App extends Core_Model {
    public function init(){ /** api/gateway?re=fetch/app/init */
        return array(
            "pathvalue"=>array("base_url"=>base_url(),"userphoto"=>PATH_USERPHOTO)
        );
    }
}